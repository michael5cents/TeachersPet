import React, { useState, useEffect } from 'react';
import { videoSearchService } from '../services/videoSearchService';

const ApiSettings: React.FC = () => {
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('youtubeApiKey');
    if (savedKey) {
      const maskedKey = savedKey.substring(0, 8) + '...' + savedKey.substring(savedKey.length - 4);
      setYoutubeApiKey(maskedKey);
      setIsSaved(true);
      console.log('✅ ApiSettings: YouTube API key confirmed configured');
    }
  }, []);

  const handleSaveApiKey = () => {
    if (youtubeApiKey.trim()) {
      // Save to localStorage and set in service
      localStorage.setItem('youtubeApiKey', youtubeApiKey);
      videoSearchService.setYouTubeApiKey(youtubeApiKey);
      
      // Mask the key for display
      const maskedKey = youtubeApiKey.substring(0, 8) + '...' + youtubeApiKey.substring(youtubeApiKey.length - 4);
      setYoutubeApiKey(maskedKey);
      setIsSaved(true);
      
      console.log('✅ YouTube API key saved and configured');
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('youtubeApiKey');
    videoSearchService.setYouTubeApiKey('');
    setYoutubeApiKey('');
    setIsSaved(false);
    console.log('🗑️ YouTube API key cleared');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <h3 className="text-lg font-semibold text-slate-900">Video Integration</h3>
          {isSaved && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Configured
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Get Your Free YouTube API Key</h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project or select existing</li>
                  <li>Enable "YouTube Data API v3"</li>
                  <li>Go to Credentials → Create Credentials → API Key</li>
                  <li>Copy and paste your API key below</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Free tier:</strong> 10,000 requests/day (plenty for educational use)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="youtube-api-key" className="block text-sm font-medium text-slate-700 mb-2">
              YouTube Data API v3 Key
            </label>
            <div className="flex space-x-2">
              <input
                id="youtube-api-key"
                type="text"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="AIzaSyD..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={isSaved}
              />
              {isSaved ? (
                <button
                  onClick={handleClearApiKey}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={handleSaveApiKey}
                  disabled={!youtubeApiKey.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {isSaved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-800">
                  YouTube API configured! Educational videos will now appear in generated curricula.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiSettings;