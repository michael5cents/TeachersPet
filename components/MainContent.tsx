import React from 'react';
import type { Curriculum, QuizResult, UserAnswers } from '../types';
import VoiceContentRenderer from './VoiceContentRenderer';
import QuizComponent from './Quiz';
import VideoPlayer from './VideoPlayer';
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
  
  // Debug logging for video integration
  if (activeModule) {
    console.log(`📹 Debug - Module ${activeModule.moduleNumber}:`, activeModule.title);
    console.log(`📹 Debug - Videos array:`, activeModule.videos);
    console.log(`📹 Debug - Videos length:`, activeModule.videos?.length || 0);
    console.log(`📹 Debug - Has videos:`, activeModule.videos && activeModule.videos.length > 0);
    if (activeModule.videos && activeModule.videos.length > 0) {
      console.log(`📹 Debug - First video:`, activeModule.videos[0]);
    }
  }

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
        
        {/* Video Recommendations Section */}
        {activeModule.videos && activeModule.videos.length > 0 && (
          <div className="mt-10">
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recommended Educational Videos
                  </h3>
                </div>
                <span className="text-sm text-slate-500 bg-green-100 px-2 py-1 rounded">
                  {activeModule.videos.length} video{activeModule.videos.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                {activeModule.videos.map((video, index) => (
                  video._videoData ? (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      <VideoPlayer 
                        video={video._videoData}
                        showControls={true}
                        autoplay={false}
                      />
                    </div>
                  ) : (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            video.platform === 'youtube' ? 'bg-red-50 text-red-600' :
                            video.platform === 'vimeo' ? 'bg-blue-50 text-blue-600' :
                            video.platform === 'khan-academy' ? 'bg-green-50 text-green-600' :
                            video.platform === 'peertube' ? 'bg-orange-50 text-orange-600' :
                            'bg-purple-50 text-purple-600'
                          }`}>
                            {video.platform === 'youtube' ? 'YT' :
                             video.platform === 'vimeo' ? 'VM' :
                             video.platform === 'khan-academy' ? 'KA' : 
                             video.platform === 'peertube' ? 'PT' : 'TE'}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {video.relevanceDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* No Videos Found Message */}
        {(!activeModule.videos || activeModule.videos.length === 0) && (
          <div className="mt-10">
            <div className="border-t pt-8">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-medium text-slate-600 mb-1">No Educational Videos Found</h3>
                <p className="text-xs text-slate-500">Check your YouTube API configuration or try generating a new curriculum.</p>
              </div>
            </div>
          </div>
        )}
        
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