import React, { useState } from 'react';
import type { Quiz, QuizResult, UserAnswers } from '../types';

interface QuizComponentProps {
  quizData: Quiz;
  result: QuizResult | undefined;
  onSubmit: (userAnswers: UserAnswers) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizData, result, onSubmit }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const getAnswerClasses = (index: number) => {
    if (!result) return '';
    const answerResult = result.answers[index];
    if (answerResult.isCorrect) {
      return 'border-green-500 bg-green-50';
    }
    return 'border-red-500 bg-red-50';
  };
  
  const getOptionLabelClasses = (index: number, option: string) => {
     if (!result) return 'border-slate-300';
     const answerResult = result.answers[index];
     const correctAnswer = quizData.questions[index].answer;

     if (answerResult.isCorrect && answerResult.userAnswer === option) {
        return 'border-green-500 bg-green-100 text-green-800'; // Correctly selected
     }
     if (!answerResult.isCorrect && answerResult.userAnswer === option) {
         return 'border-red-500 bg-red-100 text-red-800'; // Incorrectly selected
     }
     if (option === correctAnswer) {
         return 'border-green-500 bg-green-100 text-green-800'; // The correct answer (when user was wrong)
     }
     return 'border-slate-300';
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {quizData.questions.map((q, index) => (
        <div key={index} className={`p-6 rounded-xl border-2 ${result ? getAnswerClasses(index) : 'border-slate-200 bg-white'}`}>
          <p className="font-semibold text-lg text-slate-800 mb-4">{index + 1}. {q.question}</p>
          {q.type === 'multiple-choice' && q.options && (
            <div className="space-y-3">
              {q.options.map((option, i) => (
                <label key={i} className={`flex items-center p-3 rounded-md border cursor-pointer transition ${result ? getOptionLabelClasses(index, option) : 'hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={!!result}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          )}
          {q.type === 'true-false' && (
             <div className="space-y-3">
                {['True', 'False'].map((option, i) => (
                  <label key={i} className={`flex items-center p-3 rounded-md border cursor-pointer transition ${result ? getOptionLabelClasses(index, option) : 'hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={!!result}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-slate-700">{option}</span>
                  </label>
                ))}
            </div>
          )}
          {q.type === 'short-answer' && (
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={!!result}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
            />
          )}
          {result && !result.answers[index].isCorrect && (
            <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <strong>Correct Answer:</strong> {q.answer}
            </div>
          )}
        </div>
      ))}
      {!result ? (
        <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-indigo-300">
          Submit Quiz
        </button>
      ) : (
         <div className="text-center p-6 bg-slate-100 rounded-lg">
            <h3 className="text-2xl font-bold text-slate-800">Your Score</h3>
            <p className={`text-5xl font-extrabold my-2 ${result.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>{result.percentage}%</p>
            <p className="text-slate-600 text-lg">{`You answered ${result.score} out of ${result.total} questions correctly.`}</p>
        </div>
      )}
    </form>
  );
};

export default QuizComponent;