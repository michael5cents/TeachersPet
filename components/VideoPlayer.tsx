import React, { useState, useRef, useEffect } from 'react';
import type { VideoResult } from '../services/videoSearchService';

interface VideoPlayerProps {
  video: VideoResult;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  autoplay = false, 
  showControls = true,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate platform-specific embed URL with educational parameters
  const getEmbedUrl = (video: VideoResult): string => {
    let embedUrl = video.embedUrl;
    
    switch (video.platform) {
      case 'youtube':
        // Add educational parameters for YouTube
        const youtubeParams = new URLSearchParams({
          cc_load_policy: '1',    // Enable captions
          rel: '0',               // Disable related videos
          modestbranding: '1',    // Remove YouTube branding
          fs: '1',                // Allow fullscreen
          playsinline: '1',       // Play inline on mobile
          ...(autoplay && { autoplay: '1' })
        });
        
        // Use youtube-nocookie.com for privacy
        const baseUrl = embedUrl.split('?')[0];
        return `${baseUrl}?${youtubeParams.toString()}`;
        
      case 'vimeo':
        // Add Vimeo educational parameters
        const vimeoParams = new URLSearchParams({
          badge: '0',             // Remove Vimeo badge
          autopause: '0',         // Don't pause when other videos play
          player_id: '0',
          app_id: '58479',
          ...(autoplay && { autoplay: '1' })
        });
        
        const vimeoBase = embedUrl.split('?')[0];
        return `${vimeoBase}?${vimeoParams.toString()}`;
        
      case 'khan-academy':
        // Khan Academy embed parameters
        return embedUrl + (autoplay ? '&autoplay=1' : '');
        
      case 'ted-ed':
        // TED-Ed embed parameters
        return embedUrl;
        
      case 'peertube':
        // PeerTube embed parameters
        const peertubeParams = new URLSearchParams({
          subtitle: 'en',
          ...(autoplay && { autoplay: '1' })
        });
        
        const peertubeBase = embedUrl.split('?')[0];
        return `${peertubeBase}?${peertubeParams.toString()}`;
        
      default:
        return embedUrl;
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load video. Please try refreshing the page.');
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'vimeo':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
          </svg>
        );
      case 'khan-academy':
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568L12 12l-5.568 5.568c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414L10.586 12 5.018 6.432c-.39-.39-.39-1.024 0-1.414s1.024-.39 1.414 0L12 10.586l5.568-5.568c.39-.39 1.024-.39 1.414 0s.39 1.024 0 1.414L13.414 12l5.568 5.568c.39.39.39 1.024 0 1.414s-1.024.39-1.414 0z"/>
          </svg>
        );
      case 'ted-ed':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            <path d="M8 7h8v2H8zm0 4h8v2H8zm0 4h8v2H8z"/>
          </svg>
        );
      case 'peertube':
        return (
          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 7l6 5-6 5V7z"/>
          </svg>
        );  
      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl(video);

  return (
    <div className={`video-player-container ${className}`}>
      {/* Video Header */}
      {showControls && (
        <div className="bg-slate-100 border border-slate-200 rounded-t-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-slate-900 truncate">
                {video.title}
              </h3>
              <div className="flex items-center mt-1 text-xs text-slate-600 space-x-3">
                <div className="flex items-center space-x-1">
                  {getPlatformIcon(video.platform)}
                  <span className="capitalize">{video.channelTitle}</span>
                </div>
                <span>•</span>
                <span>{formatDuration(video.durationSeconds)}</span>
                <span>•</span>
                <span>{video.viewCount.toLocaleString()} views</span>
              </div>
            </div>
            
            {/* Educational Tags */}
            <div className="flex flex-wrap gap-1 ml-3">
              {video.educationalTags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Embed */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 border border-slate-200">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-slate-600">Loading video...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 border border-slate-200">
            <div className="text-center p-4">
              <div className="text-red-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-slate-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={video.title}
          className={`absolute inset-0 w-full h-full ${showControls ? 'rounded-b-lg' : 'rounded-lg'} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
        />
      </div>

      {/* Video Description (if enabled) */}
      {showControls && video.description && (
        <div className="bg-slate-50 border border-t-0 border-slate-200 rounded-b-lg p-3">
          <p className="text-sm text-slate-700 line-clamp-3">
            {video.description}
          </p>
          <a 
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-xs text-indigo-600 hover:text-indigo-800"
          >
            Watch on {video.platform === 'youtube' ? 'YouTube' : 
                      video.platform === 'peertube' ? 'PeerTube' :
                      video.platform === 'khan-academy' ? 'Khan Academy' :
                      video.platform === 'ted-ed' ? 'TED-Ed' : 
                      video.platform}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;