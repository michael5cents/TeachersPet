export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  answer: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface CurriculumVideo {
  title: string;
  platform: 'youtube' | 'vimeo' | 'khan-academy' | 'ted-ed' | 'peertube';
  relevanceDescription: string;
  _videoData?: any; // Full VideoResult data for UI components
}

export interface Module {
  moduleNumber: number;
  title: string;
  learningObjectives: string[];
  content: string; // Markdown content
  videos: CurriculumVideo[];
  quiz: Quiz;
}

export interface Curriculum {
  subject: string;
  programOverview: string; // Markdown content
  modules: Module[];
  finalTest: Quiz;
}

export interface UserAnswers {
  [questionIndex: number]: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: {
    [questionIndex: number]: {
      userAnswer: string;
      isCorrect: boolean;
    };
  };
}