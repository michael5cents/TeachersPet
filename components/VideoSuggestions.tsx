import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { videoSearchService, type VideoResult, type VideoSearchOptions } from '../services/videoSearchService';

interface VideoSuggestionsProps {
  topic: string;
  sectionTitle?: string;
  maxVideos?: number;
  showPlayer?: boolean;
  className?: string;
}

const VideoSuggestions: React.FC<VideoSuggestionsProps> = ({
  topic,
  sectionTitle,
  maxVideos = 3,
  showPlayer = false,
  className = ''
}) => {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for relevant videos when topic changes
  useEffect(() => {
    if (topic.trim()) {
      searchVideos();
    }
  }, [topic, sectionTitle]);

  const searchVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create search query combining topic and section
      const searchQuery = sectionTitle 
        ? `${topic} ${sectionTitle}`
        : topic;

      const searchOptions: VideoSearchOptions = {
        maxResults: maxVideos,
        minDuration: 180, // 3 minutes minimum
        maxDuration: 1200, // 20 minutes maximum
        platforms: ['youtube', 'vimeo', 'khan-academy', 'ted-ed'],
        educationalOnly: true,
        language: 'en'
      };

      console.log(`🎥 Searching for videos: "${searchQuery}"`);
      const results = await videoSearchService.searchVideos(searchQuery, searchOptions);
      
      setVideos(results);
      
      // Auto-select first video if showing player
      if (results.length > 0 && showPlayer) {
        setSelectedVideo(results[0]);
      }
      
      console.log(`✅ Found ${results.length} videos for "${searchQuery}"`);
    } catch (err) {
      console.error('Video search failed:', err);
      setError('Unable to load video suggestions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (video: VideoResult) => {
    setSelectedVideo(video);
    if (!showPlayer) {
      // Open video in new tab if not showing embedded player
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'youtube': return 'text-red-600 bg-red-50 border-red-200';
      case 'vimeo': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'khan-academy': return 'text-green-600 bg-green-50 border-green-200';
      case 'ted-ed': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!topic.trim()) {
    return null;
  }

  return (
    <div className={`video-suggestions ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <h3 className="text-lg font-semibold text-slate-900">
            Related Videos
          </h3>
          {sectionTitle && (
            <span className="text-sm text-slate-500">
              for {sectionTitle}
            </span>
          )}
        </div>
        
        {videos.length > 0 && !isLoading && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isExpanded ? 'Show Less' : `View All (${videos.length})`}
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-slate-600">Finding relevant videos...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-8 bg-red-50 rounded-lg border-2 border-dashed border-red-200">
          <div className="text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
            <button 
              onClick={searchVideos}
              className="mt-2 text-xs text-red-700 hover:text-red-900 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Video Player (if enabled and video selected) */}
      {showPlayer && selectedVideo && (
        <div className="mb-6">
          <VideoPlayer 
            video={selectedVideo} 
            showControls={true}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Video List */}
      {videos.length > 0 && !isLoading && (
        <div className="space-y-3">
          {videos.slice(0, isExpanded ? videos.length : maxVideos).map((video, index) => (
            <div
              key={video.id}
              className={`video-suggestion-item p-4 rounded-lg border transition-all cursor-pointer ${
                selectedVideo?.id === video.id 
                  ? 'border-indigo-300 bg-indigo-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="flex space-x-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {formatDuration(video.durationSeconds)}
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-600 mb-2">
                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getPlatformColor(video.platform)}`}>
                      {video.platform === 'youtube' ? 'YouTube' : 
                       video.platform === 'khan-academy' ? 'Khan Academy' :
                       video.platform === 'ted-ed' ? 'TED-Ed' : 'Vimeo'}
                    </span>
                    <span>•</span>
                    <span>{video.channelTitle}</span>
                    <span>•</span>
                    <span>{video.viewCount.toLocaleString()} views</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Educational Tags */}
                  {video.educationalTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.educationalTags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Relevance Score */}
                <div className="flex-shrink-0 flex flex-col items-end">
                  <div className="text-xs text-slate-500 mb-1">
                    Relevance
                  </div>
                  <div className={`text-sm font-semibold ${
                    video.relevanceScore >= 90 ? 'text-green-600' :
                    video.relevanceScore >= 75 ? 'text-yellow-600' : 'text-slate-600'
                  }`}>
                    {video.relevanceScore}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Videos Found */}
      {videos.length === 0 && !isLoading && !error && (
        <div className="flex items-center justify-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">  
          <div className="text-center">
            <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-600">No videos found for this topic</p>
            <p className="text-xs text-slate-500 mt-1">Try a different search term or check back later</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSuggestions;