import { TrendingUp } from 'lucide-react';

export default function AnalyzingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <TrendingUp className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Building your personalized investment strategy based on your goals and preferences...
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}