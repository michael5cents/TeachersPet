import React, { useState, useEffect } from 'react';

const ApiSettings: React.FC = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
      const maskedKey = savedKey.substring(0, 8) + '...' + savedKey.substring(savedKey.length - 4);
      setGeminiApiKey(maskedKey);
      setIsSaved(true);
      console.log('✅ ApiSettings: Gemini API key confirmed configured');
    }
  }, []);

  const handleSaveApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
      
      // Mask the key for display
      const maskedKey = geminiApiKey.substring(0, 8) + '...' + geminiApiKey.substring(geminiApiKey.length - 4);
      setGeminiApiKey(maskedKey);
      setIsSaved(true);
      
      console.log('✅ Gemini API key saved and configured');
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setGeminiApiKey('');
    setIsSaved(false);
    console.log('🗑️ Gemini API key cleared');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-slate-900">AI Configuration</h3>
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
                <h4 className="text-sm font-medium text-blue-900 mb-1">Get Your Free Gemini API Key</h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy and paste your API key below</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Free tier:</strong> Generous limits for educational curriculum generation
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="gemini-api-key" className="block text-sm font-medium text-slate-700 mb-2">
              Google Gemini API Key
            </label>
            <div className="flex space-x-2">
              <input
                id="gemini-api-key"
                type="text"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
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
                  disabled={!geminiApiKey.trim()}
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
                  Gemini AI configured! Ready to generate comprehensive educational curricula.
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