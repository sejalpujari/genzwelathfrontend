// components/screens/OnboardingScreen.tsx
'use client';

import { ChevronRight, ChevronLeft } from 'lucide-react';

export type OnboardingQuestion = {
  id: string;
  question: string;
  options: string[];
};

type OnboardingScreenProps = {
  step: number;
  totalSteps: number;
  currentQuestion: OnboardingQuestion;
  onAnswer: (value: string) => void;
  onBack: () => void;
};

// ────────────────────────────────────────────────
//  11 questions – matching exactly the profiles table fields
// ────────────────────────────────────────────────
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'age_range',
    question: 'What is your age range?',
    options: ['18-24', '25-34', '35-44', '45-54', '55+'],
  },
  {
    id: 'country',
    question: 'Where do you primarily reside?',
    options: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'Other'],
  },
  {
    id: 'monthly_investment',
    question: 'How much can you comfortably invest each month?',
    options: [
      '₹5,000 – ₹20,000',
      '₹20,000 – ₹50,000',
      '₹50,000 – ₹1,00,000',
      '₹1,00,000 – ₹2,50,000',
      'More than ₹2,50,000',
      'It varies a lot',
    ],
  },
  {
    id: 'primary_goal',
    question: 'What is your main investment goal right now?',
    options: [
      'Financial freedom / long-term wealth',
      'Retirement planning',
      'Buying a home or property',
      'Education (self or children)',
      'Generate passive income',
      'Short-term goal (car, travel, wedding, etc.)',
    ],
  },
  {
    id: 'time_horizon',
    question: 'When do you expect to need most of this invested money?',
    options: [
      'Less than 3 years',
      '3–7 years',
      '7–12 years',
      '12–20 years',
      '20+ years (very long term)',
    ],
  },
  {
    id: 'market_reaction',
    question: 'If your portfolio dropped 20% in a few months, how would you most likely react?',
    options: [
      'Sell everything to stop the losses',
      'Sell some to reduce risk',
      'Hold steady — markets recover',
      'Buy more — it’s a discount',
      'I wouldn’t even check for months',
    ],
  },
  {
    id: 'risk_style',
    question: 'How would you describe your comfort with investment risk?',
    options: [
      'Very conservative (safety first)',
      'Conservative',
      'Moderate (balanced)',
      'Aggressive',
      'Very aggressive (high growth focus)',
    ],
  },
  {
    id: 'experience',
    question: 'What best describes your investment experience?',
    options: [
      'Complete beginner — first time investing',
      'Beginner — tried small amounts',
      'Intermediate (know basics of stocks/MF/crypto)',
      'Advanced (actively manage portfolio)',
      'Very experienced / professional level',
    ],
  },
  {
    id: 'existing_investments',
    question: 'Which best describes your current investments?',
    options: [
      'None — only savings / FD / RD',
      'Mostly fixed deposits / recurring deposits',
      'Mutual funds and/or stocks',
      'Crypto or alternative assets',
      'Already diversified (stocks + MF + gold + others)',
    ],
  },
  {
    id: 'preferences',
    question: 'Which factor matters most to you when choosing investments?',
    options: [
      'Lowest possible fees & costs',
      'Ethical / sustainable / ESG focus',
      'Highest possible growth potential',
      'Capital preservation & low volatility',
      'Tax efficiency & optimization',
    ],
  },
];

export default function OnboardingScreen({
  step,
  totalSteps,
  currentQuestion,
  onAnswer,
  onBack,
}: OnboardingScreenProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="font-medium text-gray-600">
              Question {step + 1} of {totalSteps}
            </span>
            <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3.5">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              className={`
                group w-full text-left px-6 py-4.5 
                border-2 border-gray-200 rounded-xl 
                hover:border-blue-500 hover:bg-blue-50/70 
                active:bg-blue-100 transition-all duration-200
                flex items-center justify-between
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
            >
              <span className="font-medium text-gray-900 text-[15px] md:text-base leading-relaxed">
                {option}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 ml-3" />
            </button>
          ))}
        </div>

        {/* Back */}
        {step > 0 && (
          <button
            onClick={onBack}
            className="mt-8 flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}