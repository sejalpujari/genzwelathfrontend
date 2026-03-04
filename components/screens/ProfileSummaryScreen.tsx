import { Check, ArrowRight } from 'lucide-react';

export default function ProfileSummaryScreen({ onViewPortfolio }: { onViewPortfolio: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Complete</h2>
          <p className="text-gray-600">Here's what we learned about your investment preferences</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Risk Profile</h3>
            <p className="text-2xl font-bold text-blue-600">Aggressive</p>
            <p className="text-sm text-gray-600 mt-1">High growth potential with moderate volatility</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Time Horizon</h3>
            <p className="text-2xl font-bold text-green-600">20+ Years</p>
            <p className="text-sm text-gray-600 mt-1">Long-term wealth accumulation strategy</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Primary Goal</h3>
            <p className="text-2xl font-bold text-purple-600">Wealth Growth</p>
            <p className="text-sm text-gray-600 mt-1">Focus on capital appreciation</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Monthly Investment</h3>
            <p className="text-2xl font-bold text-orange-600">$1,000-$2,500</p>
            <p className="text-sm text-gray-600 mt-1">Consistent contribution strategy</p>
          </div>
        </div>

        <button
          onClick={onViewPortfolio}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          View Your Portfolio <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}