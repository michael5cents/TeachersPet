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

    console.log('📚 Starting curriculum generation');

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
      const result = await generateCurriculum(subject, updateStep);
      
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <div className="text-center">
            <LogoIcon className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Teacher's Pet</h2>
            <p className="text-slate-600">Getting ready for you...</p>
          </div>
        </div>
      );
    }
    
    if (initialScreenState === 'load_prompt') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <LogoIcon className="h-16 w-16 text-purple-600 drop-shadow-lg animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Teacher's Pet
              </h1>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 mb-8">
              <p className="text-slate-700 text-xl font-semibold mb-2">
                👋 Welcome back, educator!
              </p>
              <p className="text-slate-600 text-lg">
                Ready to continue your teaching journey?
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleLoadProgress}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl shadow-green-300/30"
              >
                📚 Load Saved Session
              </button>
              <button
                onClick={handleStartNew}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-purple-300/30"
              >
                ✨ Start a New Adventure
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
        <div className="w-full max-w-lg text-center relative z-10">
          <div className="flex justify-center items-center gap-4 mb-8 relative">
            <LogoIcon className="h-20 w-20 text-purple-600 drop-shadow-lg" />
            <div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                Teacher's Pet
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full"></div>
            </div>
            
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 mb-8">
            <p className="text-slate-700 text-xl font-semibold mb-2">
              🎓 Your AI-Powered Master Educator
            </p>
            <p className="text-slate-600 text-lg">
              Transform any subject into a comprehensive, interactive learning experience with quizzes and voice narration!
            </p>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerateCurriculum()}
                placeholder="✨ e.g., Quantum Mechanics, Guitar Playing, French Cooking..."
                className="w-full px-6 py-4 text-lg border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all bg-white/90 backdrop-blur-sm text-slate-900 placeholder-slate-500 shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-2xl -z-10 blur-xl"></div>
            </div>
            
            <button
              onClick={handleGenerateCurriculum}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-purple-300/30 relative overflow-hidden"
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
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Create My Learning Adventure
                  <span className="ml-2">✨</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 font-medium">⚠️ {error}</p>
            </div>
          )}
        </div>
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
