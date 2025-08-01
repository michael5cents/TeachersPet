import React from 'react';
import type { Curriculum, QuizResult, UserAnswers } from '../types';
import VoiceContentRenderer from './VoiceContentRenderer';
import QuizComponent from './Quiz';
import { MenuIcon } from './icons';

interface MainContentProps {
  curriculum: Curriculum;
  activeView: string;
  quizResults: Record<string, QuizResult>;
  onQuizSubmit: (id: string, userAnswers: UserAnswers, quizData: Curriculum['finalTest']) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({ curriculum, activeView, quizResults, onQuizSubmit, setSidebarOpen }) => {
  let content;
  const activeModule = curriculum.modules.find(m => `module-${m.moduleNumber}` === activeView);

  if (activeView === 'overview') {
    content = (
      <>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Program Overview</h2>
        <div className="mt-6">
          <VoiceContentRenderer 
            markdownContent={curriculum.programOverview}
            sectionTitle="Program Overview"
            id="program-overview"
          />
        </div>
      </>
    );
  } else if (activeModule) {
    content = (
      <>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">{`Module ${activeModule.moduleNumber}: ${activeModule.title}`}</h2>
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-slate-700">Learning Objectives</h3>
            <div className="bg-slate-100 p-4 rounded-lg">
              <VoiceContentRenderer 
                markdownContent={activeModule.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
                sectionTitle="Learning Objectives"
                id={`module-${activeModule.moduleNumber}-objectives`}
                showVoiceControls={true}
              />
            </div>
        </div>
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-slate-700">Lesson</h3>
            <VoiceContentRenderer 
              markdownContent={activeModule.content}
              sectionTitle={`Module ${activeModule.moduleNumber} Lesson`}
              id={`module-${activeModule.moduleNumber}-lesson`}
            />
        </div>
        
        <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-slate-700 border-t pt-8">Module Quiz</h3>
            <QuizComponent
                key={activeView}
                quizData={activeModule.quiz}
                result={quizResults[activeView]}
                onSubmit={(answers) => onQuizSubmit(activeView, answers, activeModule.quiz)}
            />
        </div>
      </>
    );
  } else if (activeView === 'final-test') {
    content = (
      <>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Final Test</h2>
        <p className="mt-2 text-slate-600">This comprehensive test covers all modules in the program.</p>
        <div className="mt-8">
             <QuizComponent
                key={activeView}
                quizData={curriculum.finalTest}
                result={quizResults[activeView]}
                onSubmit={(answers) => onQuizSubmit(activeView, answers, curriculum.finalTest)}
            />
        </div>
      </>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-white">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 mb-4">
        <MenuIcon className="h-8 w-8" />
      </button>
      <div className="max-w-4xl mx-auto">
        {content}
      </div>
    </main>
  );
};

export default MainContent;