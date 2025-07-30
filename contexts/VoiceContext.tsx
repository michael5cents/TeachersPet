import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VoiceSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice: string; // ResponsiveVoice voice name
  autoPlay: boolean;
}

interface VoiceContextType {
  settings: VoiceSettings;
  updateSettings: (settings: Partial<VoiceSettings>) => void;
  currentlyPlaying: string | null;
  startPlaying: (id: string) => void;
  stopPlaying: () => void;
  forceStopAll: () => void;
}

const defaultSettings: VoiceSettings = {
  enabled: true,
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: 'US English Female',
  autoPlay: false
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>(defaultSettings);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('teachersPetVoiceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved voice settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Save to localStorage
      try {
        localStorage.setItem('teachersPetVoiceSettings', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save voice settings:', error);
      }
      
      return updated;
    });
  };


  const startPlaying = (id: string) => {
    // Stop any currently playing speech
    forceStopAll();
    setCurrentlyPlaying(id);
  };

  const stopPlaying = () => {
    setCurrentlyPlaying(null);
  };

  const forceStopAll = () => {
    // Force cancel ResponsiveVoice speech
    if ((window as any).responsiveVoice) {
      (window as any).responsiveVoice.cancel();
    }
    setCurrentlyPlaying(null);
  };

  const value: VoiceContextType = {
    settings,
    updateSettings,
    currentlyPlaying,
    startPlaying,
    stopPlaying,
    forceStopAll
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceContext;