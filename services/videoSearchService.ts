// Video Search Service - Multi-platform educational video discovery
// NO MOCK DATA - Returns empty arrays until real APIs are implemented

export interface VideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string; // ISO 8601 duration format (PT4M13S)
  durationSeconds: number;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  platform: 'youtube' | 'vimeo' | 'khan-academy' | 'ted-ed' | 'peertube';
  url: string;
  embedUrl: string;
  relevanceScore: number; // 0-100 based on educational relevance
  educationalTags: string[];
}

export interface VideoSearchOptions {
  maxResults?: number;
  minDuration?: number; // seconds
  maxDuration?: number; // seconds
  platforms?: ('youtube' | 'vimeo' | 'khan-academy' | 'ted-ed' | 'peertube')[];
  educationalOnly?: boolean;
  language?: string;
}

class VideoSearchService {
  private YOUTUBE_API_KEY = ''; // Will be set via UI
  private readonly EDUCATIONAL_CHANNELS = [
    'Khan Academy',
    'TED-Ed',
    'Crash Course',
    'SciShow',
    'Veritasium',
    'MinutePhysics',
    'Professor Leonard',
    '3Blue1Brown',
    'MIT OpenCourseWare',
    'Stanford',
    'Coursera',
    'edX'
  ];

  /**
   * Search for educational videos across multiple platforms
   */
  async searchVideos(query: string, options: VideoSearchOptions = {}): Promise<VideoResult[]> {
    const {
      maxResults = 10,
      minDuration = 60, // 1 minute minimum
      maxDuration = 1800, // 30 minutes maximum
      platforms = ['youtube'],
      educationalOnly = true,
      language = 'en'
    } = options;

    console.log(`🔍 Searching for educational videos: "${query}"`);
    
    const allResults: VideoResult[] = [];

    // Search each enabled platform
    for (const platform of platforms) {
      try {
        let platformResults: VideoResult[] = [];
        
        switch (platform) {
          case 'youtube':
            platformResults = await this.searchYouTube(query, maxResults, educationalOnly, language);
            break;
          case 'peertube':
            platformResults = await this.searchPeerTube(query, maxResults);
            break;
          case 'vimeo':
            platformResults = await this.searchVimeo(query, maxResults);
            break;
          case 'khan-academy':
            platformResults = await this.searchKhanAcademy(query, maxResults);
            break;
          case 'ted-ed':
            platformResults = await this.searchTedEd(query, maxResults);
            break;
        }

        // Filter by duration
        const filteredResults = platformResults.filter(video => 
          video.durationSeconds >= minDuration && video.durationSeconds <= maxDuration
        );

        allResults.push(...filteredResults);
      } catch (error) {
        console.warn(`Failed to search ${platform}:`, error);
      }
    }

    // Sort by relevance score and return top results
    const sortedResults = allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);

    console.log(`✅ Found ${sortedResults.length} educational videos`);
    return sortedResults;
  }

  /**
   * Search YouTube for educational content using real API
   */
  private async searchYouTube(query: string, maxResults: number, educationalOnly: boolean, language: string): Promise<VideoResult[]> {
    console.log(`🔍 YouTube search called with query: "${query}"`);
    console.log(`🔑 API key configured: ${this.YOUTUBE_API_KEY ? 'YES' : 'NO'}`);
    
    if (!this.YOUTUBE_API_KEY) {
      console.log(`❌ YouTube search requested for: ${query} - no API key configured`);
      return [];
    }

    try {
      // Enhanced search query for educational content
      let searchQuery = query;
      if (educationalOnly) {
        // Add educational keywords to improve relevance
        searchQuery += ' (tutorial OR lesson OR explanation OR "how to" OR educational OR course OR learning)';
      }

      // YouTube Data API v3 search endpoint
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      searchUrl.searchParams.set('part', 'snippet');
      searchUrl.searchParams.set('q', searchQuery);
      searchUrl.searchParams.set('type', 'video');
      searchUrl.searchParams.set('maxResults', Math.min(maxResults, 25).toString());
      searchUrl.searchParams.set('order', 'relevance');
      searchUrl.searchParams.set('safeSearch', 'strict');
      searchUrl.searchParams.set('regionCode', 'US');
      searchUrl.searchParams.set('relevanceLanguage', language);
      searchUrl.searchParams.set('key', this.YOUTUBE_API_KEY);

      // Note: YouTube API doesn't support multiple channelIds in one request
      // We'll filter by educational keywords instead for better results

      console.log(`🔍 YouTube API request: ${searchQuery}`);
      const searchResponse = await fetch(searchUrl.toString());
      
      if (!searchResponse.ok) {
        if (searchResponse.status === 403) {
          const errorData = await searchResponse.json().catch(() => ({}));
          if (errorData.error?.reason === 'quotaExceeded') {
            console.warn('🚫 YouTube API quota exceeded. Switching to PeerTube fallback...');
            return []; // Return empty array to trigger fallback
          }
          console.warn('🚫 YouTube API access denied (403). Videos may be limited.');
          return [];
        }
        throw new Error(`YouTube API error: ${searchResponse.status} ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        console.log(`No YouTube results found for: ${query}`);
        return [];
      }

      // Get video details including duration
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      detailsUrl.searchParams.set('part', 'contentDetails,statistics,snippet');
      detailsUrl.searchParams.set('id', videoIds);
      detailsUrl.searchParams.set('key', this.YOUTUBE_API_KEY);

      const detailsResponse = await fetch(detailsUrl.toString());
      const detailsData = await detailsResponse.json();

      // Process results
      const results: VideoResult[] = detailsData.items.map((video: any) => {
        const durationSeconds = this.parseDuration(video.contentDetails.duration);
        const isEducational = this.isEducationalChannel(video.snippet.channelTitle);
        
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description || '',
          thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
          duration: video.contentDetails.duration,
          durationSeconds,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(video.statistics?.viewCount || '0'),
          platform: 'youtube' as const,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
          relevanceScore: this.calculateRelevanceScore(video, query, isEducational),
          educationalTags: this.extractEducationalTags(video.snippet.title, video.snippet.description)
        };
      });

      console.log(`✅ YouTube API returned ${results.length} videos`);
      return results;

    } catch (error) {
      console.error('YouTube search failed:', error);
      return [];
    }
  }

  /**
   * Search PeerTube instances for educational content
   */
  private async searchPeerTube(query: string, maxResults: number): Promise<VideoResult[]> {
    console.log(`🔍 PeerTube search for: "${query}"`);
    
    try {
      // Use popular educational PeerTube instances
      const instances = [
        'https://diode.zone',        // Science/tech content, good search index
        'https://tube.tchncs.de',    // Tech/educational content, multilingual
        'https://peertube.tv',       // General educational content
        'https://video.blender.org', // Blender educational content
        'https://share.tube'         // Creative and educational content
      ];
      
      let allVideos: VideoResult[] = [];
      
      for (const instance of instances) {
        try {
          const searchUrl = new URL(`${instance}/api/v1/search/videos`);
          searchUrl.searchParams.set('search', query);
          searchUrl.searchParams.set('count', Math.min(maxResults, 10).toString());
          // Note: PeerTube API uses minimal parameters - search and count only
          
          console.log(`🔍 Searching PeerTube instance: ${instance}`);
          
          // Create AbortController for timeout (browser-compatible)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(searchUrl.toString(), {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.warn(`PeerTube instance ${instance} returned ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          if (data.data && Array.isArray(data.data)) {
            const videos = data.data.map((video: any) => this.convertPeerTubeToVideoResult(video, instance, query));
            allVideos.push(...videos);
            console.log(`✅ Found ${videos.length} videos from ${instance}`);
          }
        } catch (error) {
          console.warn(`Failed to search PeerTube instance ${instance}:`, error);
        }
      }
      
      // Sort by relevance and return top results
      const sortedResults = allVideos
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
      
      console.log(`✅ PeerTube search found ${sortedResults.length} total videos`);
      return sortedResults;
      
    } catch (error) {
      console.error('PeerTube search failed:', error);
      return [];
    }
  }

  /**
   * Convert PeerTube video data to VideoResult format
   */
  private convertPeerTubeToVideoResult(video: any, instance: string, searchQuery?: string): VideoResult {
    const duration = video.duration || 0;
    const relevanceScore = this.calculatePeerTubeRelevance(video, searchQuery);
    
    return {
      id: `peertube_${video.uuid}`,
      title: video.name || 'Untitled',
      description: video.description || '',
      thumbnail: video.thumbnailPath ? `${instance}${video.thumbnailPath}` : '',
      duration: this.secondsToISO8601(duration),
      durationSeconds: duration,
      channelTitle: video.account?.displayName || video.channel?.displayName || 'Unknown',
      publishedAt: video.publishedAt || new Date().toISOString(),
      viewCount: video.views || 0,
      platform: 'peertube' as const,
      url: `${instance}/w/${video.uuid}`,
      embedUrl: `${instance}/videos/embed/${video.uuid}`,
      relevanceScore,
      educationalTags: this.extractEducationalTags(video.name, video.description)
    };
  }

  /**
   * Calculate relevance score for PeerTube videos with subject focus
   */
  private calculatePeerTubeRelevance(video: any, searchQuery?: string): number {
    let score = 30; // Lower base score, require relevance to earn points
    
    const title = (video.name || '').toLowerCase();
    const description = (video.description || '').toLowerCase();
    const text = `${title} ${description}`;
    
    // Subject relevance boost (most important factor)
    if (searchQuery) {
      const queryWords = searchQuery.toLowerCase().split(' ');
      const mainSubject = queryWords[0]; // First word is usually the main subject
      
      // Heavy bonus for main subject in title
      if (title.includes(mainSubject)) score += 40;
      // Moderate bonus for main subject in description
      else if (description.includes(mainSubject)) score += 20;
      
      // Additional points for other query words
      queryWords.slice(1).forEach(word => {
        if (word.length > 2 && text.includes(word)) score += 5;
      });
    }
    
    // Educational keywords boost
    const eduKeywords = ['tutorial', 'lesson', 'course', 'learn', 'education', 'how to', 'guide'];
    eduKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 8;
    });
    
    // Language indicators (for language subjects)
    const languageKeywords = ['language', 'speak', 'conversation', 'grammar', 'vocabulary', 'pronunciation'];
    languageKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 5;
    });
    
    // View count factor (smaller scale than YouTube)
    if (video.views > 100) score += 3;
    if (video.views > 1000) score += 7;
    
    // Duration preference (3-20 minutes)
    const duration = video.duration || 0;
    if (duration >= 180 && duration <= 1200) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Convert seconds to ISO 8601 duration format
   */
  private secondsToISO8601(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let duration = 'PT';
    if (hours > 0) duration += `${hours}H`;
    if (minutes > 0) duration += `${minutes}M`;
    if (secs > 0) duration += `${secs}S`;
    
    return duration || 'PT0S';
  }

  /**
   * Search Vimeo for educational content - NO MOCK DATA
   */
  private async searchVimeo(query: string, _maxResults: number): Promise<VideoResult[]> {
    console.log(`Vimeo search requested for: ${query} - no API configured`);
    return [];
  }

  /**
   * Search Khan Academy content - NO MOCK DATA
   */
  private async searchKhanAcademy(query: string, _maxResults: number): Promise<VideoResult[]> {
    console.log(`Khan Academy search requested for: ${query} - no API configured`);
    return [];
  }

  /**
   * Search TED-Ed content - NO MOCK DATA
   */
  private async searchTedEd(query: string, _maxResults: number): Promise<VideoResult[]> {
    console.log(`TED-Ed search requested for: ${query} - no API configured`);
    return [];
  }

  /**
   * Calculate educational relevance score based on multiple factors
   */
  private calculateRelevanceScore(video: any, query: string, isEducationalChannel: boolean): number {
    let score = 0;

    // Base score for educational channels
    if (isEducationalChannel) score += 40;

    // Title relevance
    const titleWords = video.snippet.title.toLowerCase().split(' ');
    const queryWords = query.toLowerCase().split(' ');
    const titleMatches = queryWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word))
    ).length;
    score += (titleMatches / queryWords.length) * 25;

    // Description relevance
    if (video.snippet.description) {
      const descWords = video.snippet.description.toLowerCase().split(' ');
      const descMatches = queryWords.filter(word =>
        descWords.some((descWord: string) => descWord.includes(word))
      ).length;
      score += (descMatches / queryWords.length) * 15;
    }

    // View count factor (logarithmic scale)
    const viewCount = parseInt(video.statistics?.viewCount || '0');
    if (viewCount > 0) {
      score += Math.min(Math.log10(viewCount) * 5, 20);
    }

    // Duration preference (5-15 minutes is ideal)
    const duration = this.parseDuration(video.contentDetails?.duration || 'PT0S');
    if (duration >= 300 && duration <= 900) { // 5-15 minutes
      score += 10;
    } else if (duration >= 180 && duration <= 1800) { // 3-30 minutes
      score += 5;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private parseDuration(isoDuration: string): number {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Check if channel is known educational source
   */
  private isEducationalChannel(channelTitle: string): boolean {
    return this.EDUCATIONAL_CHANNELS.some(eduChannel => 
      channelTitle.toLowerCase().includes(eduChannel.toLowerCase())
    );
  }

  /**
   * Extract educational tags from title and description
   */
  private extractEducationalTags(title: string, description: string): string[] {
    const tags: string[] = [];
    const text = `${title} ${description}`.toLowerCase();

    const educationalKeywords = [
      'tutorial', 'lesson', 'course', 'learn', 'education', 'teaching',
      'beginner', 'advanced', 'introduction', 'explanation', 'how to',
      'step by step', 'guide', 'fundamentals', 'basics', 'overview'
    ];

    educationalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags.slice(0, 5); // Limit to 5 tags
  }

  /**
   * Set YouTube API key (called from settings)
   */
  setYouTubeApiKey(apiKey: string): void {
    this.YOUTUBE_API_KEY = apiKey;
    console.log('✅ YouTube API key configured:', apiKey ? 'Key present' : 'Key empty');
    console.log('🔑 First 8 chars:', apiKey ? apiKey.substring(0, 8) : 'none');
  }
}

// Export singleton instance
export const videoSearchService = new VideoSearchService();
export default videoSearchService;