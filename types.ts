export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  answer: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface Module {
  moduleNumber: number;
  title: string;
  learningObjectives: string[];
  content: string; // Markdown content
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