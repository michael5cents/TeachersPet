import React, { useState, useCallback, useEffect } from 'react';
import { generateCurriculum } from './services/geminiService';
import type { Curriculum, QuizResult, UserAnswers } from './types';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Loader from './components/Loader';
import { LogoIcon } from './components/icons';
import { VoiceProvider } from './contexts/VoiceContext';

const AppContent: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string>('overview');
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // New state for handling saved sessions and save button status
  const [initialScreenState, setInitialScreenState] = useState<'checking' | 'new' | 'load_prompt'>('checking');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [researchStep, setResearchStep] = useState<string>('');

  // Check for saved data on initial app load
  useEffect(() => {
    const savedData = localStorage.getItem('opalCurriculum');
    if (savedData) {
      setInitialScreenState('load_prompt');
    } else {
      setInitialScreenState('new');
    }
  }, []);

  const handleGenerateCurriculum = async () => {
    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurriculum(null);
    setQuizResults({});
    setCompletedModules(new Set());
    setActiveView('overview');
    setResearchStep('');

    const updateStep = (step: string) => {
      setResearchStep(step);
      console.log(`📚 ${step}`);
    };

    try {
      updateStep('🔍 Analyzing subject matter and scope...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateStep('📖 Researching core concepts and learning objectives...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateStep('🏗️ Structuring curriculum framework...');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      updateStep('✍️ Generating comprehensive lesson content...');
      const result = await generateCurriculum(subject);
      
      updateStep('🎯 Creating assessment materials and quizzes...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateStep('✅ Finalizing your personalized curriculum...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setCurriculum(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate curriculum. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
      setResearchStep('');
    }
  };

  const handleQuizSubmit = useCallback((id: string, userAnswers: UserAnswers, quizData: Curriculum['finalTest']) => {
    let score = 0;
    const gradedAnswers: QuizResult['answers'] = {};

    quizData.questions.forEach((q, index) => {
      const userAnswer = userAnswers[index] || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) {
        score++;
      }
      gradedAnswers[index] = { userAnswer, isCorrect };
    });

    const newResult: QuizResult = {
      score,
      total: quizData.questions.length,
      percentage: Math.round((score / quizData.questions.length) * 100),
      answers: gradedAnswers,
    };

    setQuizResults(prev => ({ ...prev, [id]: newResult }));
    
    if (id.startsWith('module-')) {
        setCompletedModules(prev => new Set(prev).add(id));
    }
  }, []);

  const handleSaveProgress = useCallback(() => {
    if (!curriculum) return;
    setSaveStatus('saving');
    try {
      const dataToSave = {
        curriculum,
        quizResults,
        completedModules: Array.from(completedModules), // Convert Set to Array for JSON
      };
      localStorage.setItem('opalCurriculum', JSON.stringify(dataToSave));
      setSaveStatus('saved');
    } catch (err) {
      console.error("Failed to save progress:", err);
      setError("Could not save progress. Storage may be full.");
      setSaveStatus('idle');
    }
    
    setTimeout(() => setSaveStatus('idle'), 2000); // Reset status after 2s
  }, [curriculum, quizResults, completedModules]);

  const handleLoadProgress = () => {
    const savedData = localStorage.getItem('opalCurriculum');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCurriculum(parsedData.curriculum);
        setQuizResults(parsedData.quizResults || {});
        setCompletedModules(new Set(parsedData.completedModules || [])); // Convert Array back to Set
        setActiveView('overview');
      } catch (err) {
        console.error("Failed to load progress:", err);
        setError("Could not load saved data. It may be corrupted.");
        handleStartNew(); // Clear corrupted data
      }
    }
  };

  const handleStartNew = () => {
    localStorage.removeItem('opalCurriculum');
    setCurriculum(null);
    setQuizResults({});
    setCompletedModules(new Set());
    setSubject('');
    setError(null);
    setInitialScreenState('new');
  };

  const handleReturnToMainMenu = () => {
    setCurriculum(null);
    setQuizResults({});
    setCompletedModules(new Set());
    setSubject('');
    setError(null);
    setActiveView('overview');
    setInitialScreenState('new');
  };

  const renderIntroScreen = () => {
    if (initialScreenState === 'checking') {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <Loader />
        </div>
      );
    }
    
    if (initialScreenState === 'load_prompt') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <LogoIcon className="h-16 w-16 text-indigo-600" />
              <h1 className="text-5xl font-bold text-slate-800">Opal</h1>
            </div>
            <p className="text-slate-600 mb-8 text-lg">Welcome back! Would you like to load your saved lesson plan?</p>
            <div className="space-y-4">
              <button
                onClick={handleLoadProgress}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                Load Saved Session
              </button>
              <button
                onClick={handleStartNew}
                className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition"
              >
                Start a New Program
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <LogoIcon className="h-16 w-16 text-indigo-600" />
            <h1 className="text-5xl font-bold text-slate-800">Opal</h1>
          </div>
          <p className="text-slate-600 mb-8 text-lg">Your AI-powered Master Educator & Curriculum Architect</p>
          <div className="space-y-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerateCurriculum()}
              placeholder="e.g., Quantum Mechanics, The French Revolution..."
              className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-slate-900"
            />
            <button
              onClick={handleGenerateCurriculum}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader />
                  <div className="text-center">
                    <div className="font-semibold">Creating Your Lesson Program</div>
                    {researchStep && (
                      <div className="text-sm mt-1 opacity-90">{researchStep}</div>
                    )}
                  </div>
                </div>
              ) : 'Generate Lesson Program'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <footer className="absolute bottom-4 text-slate-500 text-sm">
          Generated by Opal. Powered by Google.
        </footer>
      </div>
    );
  };

  if (!curriculum) {
    return renderIntroScreen();
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        curriculum={curriculum}
        activeView={activeView}
        setActiveView={setActiveView}
        completedModules={completedModules}
        quizResults={quizResults}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onSaveProgress={handleSaveProgress}
        saveStatus={saveStatus}
        onReturnToMainMenu={handleReturnToMainMenu}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainContent
          curriculum={curriculum}
          activeView={activeView}
          quizResults={quizResults}
          onQuizSubmit={handleQuizSubmit}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <VoiceProvider>
      <AppContent />
    </VoiceProvider>
  );
};

export default App;
