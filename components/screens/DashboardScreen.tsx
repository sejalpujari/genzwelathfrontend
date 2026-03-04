// components/screens/DashboardScreen.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/lib/auth';
import { RefreshCw, X } from 'lucide-react';
import OnboardingScreen, { OnboardingQuestion, ONBOARDING_QUESTIONS } from './OnboardingScreen';

interface Profile {
  id: string;
  profile_code: string;
  email: string;
  age_range?: string;
  country?: string;
  monthly_investment?: string;
  primary_goal?: string;
  time_horizon?: string;
  market_reaction?: string;
  risk_style?: string;
  experience?: string;
  existing_investments?: string;
  preferences?: string;
  created_at: string;
  updated_at: string;
}

interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface DashboardData {
  profile: Profile;
  initial_portfolio: PortfolioItem[];
}

const PORTFOLIO_STORAGE_KEY = 'portfolio_state';

export default function DashboardScreen() {
  const router = useRouter();
  const logout = useLogout();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [repredicting, setRepredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showRepredictModal, setShowRepredictModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // const [token, setToken] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const PROFILE_ENDPOINT = `${API_URL}/api/v1/portfolio/profile`;
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  };

  const persistPortfolio = (items: PortfolioItem[]) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore browser storage failures.
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(PROFILE_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const result: DashboardData = await res.json();
      setData(result);
      if (result.initial_portfolio?.length) {
        persistPortfolio(result.initial_portfolio);
      }
      setError(null);
    } catch (err: any) {
      console.error('Fetch profile failed:', err);
      setError(err.message || 'Failed to load profile and portfolio');
    } finally {
      setLoading(false);
      setRepredicting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRepredict = () => {
    setShowRepredictModal(true);
    setCurrentStep(0);
    setAnswers({});
    setError(null);
  };

  const handleAnswer = (value: string) => {
    const questionId = ONBOARDING_QUESTIONS[currentStep].id;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAnswersAndRefresh();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAnswersAndRefresh = async () => {
    setShowRepredictModal(false);
    setRepredicting(true);
    setError(null);

    try {
      // Most common pattern: send key-value object (not array)
      // Adjust this body format according to what your backend actually expects
      const payload = { ...answers }; // { age_range: "...", risk_style: "...", ... }

      // If your backend really wants an ordered array:
      // const orderedAnswers = ONBOARDING_QUESTIONS.map(q => answers[q.id] ?? "");
      // const payload = { answers: orderedAnswers };
      const token = getToken();
      const res = await fetch(PROFILE_ENDPOINT, {
        method: 'PATCH',           // ← try PATCH first (most RESTful for partial updates)
        // method: 'POST',         // ← use if your backend only accepts POST
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = errData.detail || errData.message || `Update failed (${res.status})`;
        throw new Error(message);
      }

      const updatedData: DashboardData = await res.json();
      setData(updatedData);
      if (updatedData.initial_portfolio?.length) {
        persistPortfolio(updatedData.initial_portfolio);
      }
    } catch (err: any) {
      console.error('Repredict / update failed:', err);
      setError(err.message || 'Failed to update profile and get new recommendations');
      // Fallback: reload current data
      await fetchProfile();
    } finally {
      setRepredicting(false);
    }
  };

  const handleCloseModal = () => {
    setShowRepredictModal(false);
    setRepredicting(false);
  };

  // ─────────────────────────────────────────────
  // Guards – prevent crash on reload / failed load
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading your dashboard...</h2>
          <p className="text-gray-600 mt-2">Fetching your profile & recommendations</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <div className="text-red-500 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Couldn't load dashboard</h2>
          <p className="text-gray-600 mb-8">{error || 'Profile data is missing'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-medium transition shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Safe destructuring – we know data & profile exist
  // ─────────────────────────────────────────────
  const { profile, initial_portfolio } = data;
  const displayName = profile.email?.split('@')[0] || 'Investor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              W
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Wealth Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm bg-green-100 text-green-800 px-4 py-1.5 rounded-full">
              Live • Updated now
            </span>

            <button
              onClick={handleRepredict}
              disabled={repredicting}
              title="Update profile and get new recommendations"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${repredicting
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200'
                }
              `}
            >
              <RefreshCw className={`w-4 h-4 ${repredicting ? 'animate-spin' : ''}`} />
              {repredicting ? 'Updating...' : 'Repredict'}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}
          </h2>
          <p className="text-gray-600">
            Here's your personalized investment profile and recommended starting portfolio
          </p>
        </div>

        {/* Profile summary cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Age Range</h3>
            <p className="text-2xl font-bold text-gray-900">{profile.age_range || '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Risk Style</h3>
            <p className="text-2xl font-bold text-indigo-600">{profile.risk_style || '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Primary Goal</h3>
            <p className="text-2xl font-bold text-emerald-600">{profile.primary_goal || '—'}</p>
          </div>
        </div>

        {/* Recommended Portfolio */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Starting Portfolio</h2>
            <span className="text-sm text-gray-500">AI-predicted based on your profile</span>
          </div>

          {initial_portfolio?.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              No allocation data available yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initial_portfolio.map((item) => (
                <div
                  key={item.name}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {item.value.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/recommendation')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-medium text-lg transition shadow-lg"
          >
            Customize Portfolio →
          </button>
        </div>
      </div>

      {/* Repredict Modal */}
      {showRepredictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 md:p-8">
              <OnboardingScreen
                step={currentStep}
                totalSteps={ONBOARDING_QUESTIONS.length}
                currentQuestion={ONBOARDING_QUESTIONS[currentStep]}
                onAnswer={handleAnswer}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
