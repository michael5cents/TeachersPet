import React, { useState, useEffect, useRef } from 'react';
import { useVoice } from '../contexts/VoiceContext';

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

interface VoiceControlsProps {
  text: string;
  id: string; // Unique identifier for this voice control instance
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onWordBoundary?: (wordIndex: number) => void;
  words?: string[];
}

interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
  enabled: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ text, id, onStart, onEnd, onError }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isResponsiveVoiceReady, setIsResponsiveVoiceReady] = useState(false);
  const { 
    settings,
    currentlyPlaying, 
    startPlaying, 
    stopPlaying, 
    forceStopAll 
  } = useVoice();

  const isPlaying = currentlyPlaying === id;

  // Check if ResponsiveVoice is ready
  useEffect(() => {
    const checkResponsiveVoice = () => {
      if ((window as any).responsiveVoice) {
        setIsResponsiveVoiceReady(true);
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

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying && (window as any).responsiveVoice) {
        (window as any).responsiveVoice.cancel();
      }
    };
  }, []);

  // Clean text for speech synthesis
  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      // Remove markdown formatting
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/>\s/g, '') // Remove blockquotes
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // ResponsiveVoice functions - Free Tier (simple calls)
  const speak = () => {
    if (!text.trim() || !settings.enabled) return;

    // Check if ResponsiveVoice is available
    if (!window.responsiveVoice) {
      console.log('❌ ResponsiveVoice not available');
      onError?.('ResponsiveVoice not available');
      return;
    }

    console.log('🔊 Starting speech...');
    
    // Start playing this instance (will stop others)
    startPlaying(id);
    
    const cleanText = cleanTextForSpeech(text);
    
    console.log('Text length:', cleanText.length);
    console.log('Full text preview:', cleanText.substring(0, 100) + '...');
    
    // Use simple ResponsiveVoice call (free tier)
    // Pass null for voice to use default, avoiding voice-specific API calls
    window.responsiveVoice.speak(cleanText, null, {
      onstart: () => {
        console.log('✅ Speech started - reading full text');
        setIsPaused(false);
        onStart?.();
      },
      onend: () => {
        console.log('✅ Speech completed - full text read');
        setIsPaused(false);
        stopPlaying();
        onEnd?.();
      },
      onerror: (error: any) => {
        console.log('❌ Speech error:', error);
        setIsPaused(false);
        stopPlaying();
        onError?.('ResponsiveVoice speech error: ' + error);
      }
    });
  };

  const pause = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      console.log('🛑 Speech stopped');
    }
    setIsPaused(false);
    stopPlaying();
  };

  if (!settings.enabled) {
    return (
      <div className="text-sm text-slate-500 italic">
        Voice playback disabled
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border">
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? (isPaused ? resume : pause) : speak}
        className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
        title={isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
      >
        {isPlaying && !isPaused ? (
          // Pause icon
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zM13 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        ) : (
          // Play icon
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a.5.5 0 01.533 0l8 5.5a.5.5 0 010 .844l-8 5.5A.5.5 0 016 14.5v-11a.5.5 0 01.267-.045z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Stop Button */}
      <button
        onClick={stop}
        disabled={!isPlaying}
        className="flex items-center justify-center w-8 h-8 bg-slate-300 hover:bg-slate-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-700 rounded transition-colors"
        title="Stop"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Speed Display */}
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <span>Speed: {settings.rate}x</span>
      </div>

      {/* Voice Display */}
      {settings.voice && (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <span>{settings.voice.split(' ')[0]}</span>
        </div>
      )}

      {/* Status indicator */}
      {isPlaying && (
        <div className="flex items-center gap-2 text-xs text-indigo-600">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          <span>{isPaused ? 'Paused' : 'Playing'}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceControls;