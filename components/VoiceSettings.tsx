import React, { useState, useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { VolumeIcon, VolumeOffIcon, SettingsIcon } from './icons';

// Declare ResponsiveVoice global
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice?: string, parameters?: any) => void;
      cancel: () => void;
      pause: () => void;
      resume: () => void;
      isPlaying: () => boolean;
      getVoices: () => Array<{name: string, lang: string}>;
    };
  }
}

const VoiceSettings: React.FC = () => {
  const { settings, updateSettings } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResponsiveVoiceReady, setIsResponsiveVoiceReady] = useState(false);
  const [responsiveVoices, setResponsiveVoices] = useState<Array<{name: string, lang: string}>>([]);

  // Check if ResponsiveVoice is ready and get working voices
  useEffect(() => {
    const checkResponsiveVoice = () => {
      if ((window as any).responsiveVoice) {
        setIsResponsiveVoiceReady(true);
        
        // Only show voices that actually work in free tier
        const workingVoices = [
          { name: 'Default Voice', lang: 'en-US' }
        ];
        
        setResponsiveVoices(workingVoices);
        console.log('✅ ResponsiveVoice ready - showing only working free tier voices');
        return true;
      }
      return false;
    };
    
    if (!checkResponsiveVoice()) {
      const interval = setInterval(() => {
        if (checkResponsiveVoice()) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  if (!isResponsiveVoiceReady) {
    return null;
  }

  // Only show voices that actually work in free tier
  const availableVoices = responsiveVoices;

  return (
    <div className="border-t border-slate-200 pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
      >
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <VolumeIcon className="h-4 w-4" />
          ) : (
            <VolumeOffIcon className="h-4 w-4" />
          )}
          <span>Voice Settings</span>
        </div>
        <SettingsIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4 p-3 bg-slate-50 rounded-lg text-sm">
          {/* Voice Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-slate-700 font-medium">Enable Voice</label>
            <button
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                settings.enabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.enabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Speed Control */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">
                  Speed: {settings.rate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={settings.rate}
                  onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Voice Selection */}
              {availableVoices.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-medium">Voice (Free Tier)</label>
                  <select
                    value={settings.voice || ''}
                    onChange={(e) => updateSettings({ voice: e.target.value || 'Default Voice' })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                  >
                    {availableVoices.map(voice => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} - Currently: {voice.lang === 'en-US' ? 'Google UK English Female' : voice.lang}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Auto-play Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-medium">Auto-play</label>
                <button
                  onClick={() => updateSettings({ autoPlay: !settings.autoPlay })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    settings.autoPlay ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      settings.autoPlay ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Test Voice Button */}
              <button
                onClick={() => {
                  if (window.responsiveVoice) {
                    console.log('🔊 Testing speech...');
                    const testText = "This is a test of the voice settings. How does this sound?";
                    
                    console.log('Using default voice (free tier)');
                    
                    // Use simple call with null voice (free tier)
                    window.responsiveVoice.speak(testText, null, {
                      onstart: () => console.log('✅ Speech started'),
                      onend: () => console.log('✅ Speech ended'),
                      onerror: (error: any) => console.log('❌ Speech error: ' + error)
                    });
                  } else {
                    console.log('❌ ResponsiveVoice not available');
                  }
                }}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-3 rounded transition-colors"
              >
                Test Voice
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VoiceSettings;