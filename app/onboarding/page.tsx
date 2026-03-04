// app/onboarding/page.tsx
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
  const token = localStorage.getItem('access_token');

  // Check if user already has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!token) {
        // No token → probably not logged in → stay on onboarding or redirect to login
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
          // Check if profile has meaningful data (e.g., at least one onboarding field filled)
          const profile = data.profile || {};
          const hasCompletedOnboarding = profile.age_range || profile.primary_goal || profile.risk_style;

          if (hasCompletedOnboarding) {
            setHasProfile(true);
            router.replace('/dashboard'); // or router.push('/dashboard')
            return;
          }
        }
      } catch (err) {
        console.warn('Could not check profile status:', err);
        // If check fails → just show onboarding (fail-safe)
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkProfile();
  }, [router, token]);
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
  function formatAnswersForModel(answers: Record<string, string>) {
  return ONBOARDING_QUESTIONS.map(q => answers[q.id]);
}


 const submitProfile = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  setError(null);

  const token = localStorage.getItem('access_token');

  const orderedAnswers = ONBOARDING_QUESTIONS.map(q => {
    const val = answers[q.id];
    if (val === undefined || val === null) {
      console.warn(`Missing answer for question: ${q.id} (${q.question})`);
      return "";
    }
    return val;
  });

  if (orderedAnswers.length !== 10) {
    setError("Incomplete answers – please complete all questions");
    setIsSubmitting(false);
    return;
  }

  console.log("Sending answers:", orderedAnswers);

  try {
    const res = await fetch(`${API_URL}/api/v1/portfolio/profile/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify({ answers: orderedAnswers }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Backend error response:", errData);
      throw new Error(
        errData.detail?.[0]?.msg ||
        errData.detail ||
        `Server error ${res.status}`
      );
    }

    router.push('/dashboard');
    router.refresh();

  } catch (err: any) {
    console.error("Submit failed:", err);
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

  // If already onboarded → this won't be reached because of router.replace above
  // But as fallback:
  if (hasProfile) {
    return null; // or a tiny spinner
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
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