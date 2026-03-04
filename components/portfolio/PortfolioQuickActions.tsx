"use client";

import { ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio'; // adjust path if needed

export default function PortfolioQuickActions() {
  const { switchPreset } = usePortfolio();

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold mb-5">Quick Portfolio Presets</h3>

      {/* First row - more aggressive / trendy presets */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => switchPreset('aggressive')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Aggressive Growth
        </button>

        <button
          onClick={() => switchPreset('techFocused')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Tech-Focused
        </button>

        <button
          onClick={() => switchPreset('sustainable')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Sustainable / ESG
        </button>
      </div>

      {/* Second row - more balanced / safe + chat */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => switchPreset('balanced')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Balanced
        </button>

        <button
          onClick={() => switchPreset('conservative')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Conservative
        </button>

        <button
          onClick={() => {
            const section = document.getElementById("portfolio-chat");
            section?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          Customize with AI Chat
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Optional small helper text */}
      <p className="text-sm text-gray-500 mt-5 text-center">
        Switch instantly between curated Gen Z-friendly strategies
      </p>
    </div>
  );
}
