'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingScreen, { ONBOARDING_QUESTIONS } from '@/components/screens/OnboardingScreen';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/v1/portfolio/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const profile = data.profile || {};
          const hasCompletedOnboarding = profile.age_range || profile.primary_goal || profile.risk_style;

          if (hasCompletedOnboarding) {
            setHasProfile(true);
            router.replace('/dashboard');
            return;
          }
        }
      } catch (err) {
        console.warn('Could not check profile status:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkProfile();
  }, [router]);

  const totalSteps = ONBOARDING_QUESTIONS.length;
  const currentQuestion = ONBOARDING_QUESTIONS[step];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      submitProfile();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const submitProfile = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const orderedAnswers = ONBOARDING_QUESTIONS.map((q) => {
      const val = answers[q.id];
      if (val === undefined || val === null) {
        console.warn(`Missing answer for question: ${q.id} (${q.question})`);
        return '';
      }
      return val;
    });

    if (orderedAnswers.length !== 10) {
      setError('Incomplete answers - please complete all questions');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/portfolio/profile/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ answers: orderedAnswers }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail?.[0]?.msg || errData.detail || `Server error ${res.status}`);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Submit failed:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Checking your profile...</h2>
        </div>
      </div>
    );
  }

  if (hasProfile) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <OnboardingScreen
      step={step}
      totalSteps={totalSteps}
      currentQuestion={currentQuestion}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
}
