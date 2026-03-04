"use client";

import { useState } from "react";
import { usePortfolio } from "../../hooks/usePortfolio";
import PortfolioPieChart from "@/components/portfolio/PortfolioPieChart";
import PortfolioBarChart from "@/components/portfolio/PortfolioBarChart";
import PortfolioLegendList from "@/components/portfolio/PortfolioLegendList";
import PortfolioChatbot from "@/components/portfolio/PortfolioChatbot";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function RecommendationScreen() {
  const { portfolio, applyPortfolio, chartView, setChartView, totalAllocation } = usePortfolio();

  const isBalanced = Math.abs(totalAllocation - 100) < 0.5;
  // Removed openExplanation state & explanations array since the section is gone

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50/40 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Your Portfolio
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Aggressive Growth • 20+ years horizon
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium shadow-sm">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Live market data
            </div>
          </div>
        </div>

        {/* Warning */}
        {!isBalanced && (
          <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800">
            <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Portfolio not balanced</p>
              <p className="text-sm mt-1">
                Current allocation: {totalAllocation.toFixed(1)}%. Use chat to adjust.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Cards
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-1">Expected Return</p>
            <p className="text-3xl font-bold text-emerald-700">8.5–12%</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-1">Risk Level</p>
            <p className="text-3xl font-bold text-amber-700">Moderate-High</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-1">Time Horizon</p>
            <p className="text-3xl font-bold text-indigo-700">20+ Years</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-1">Diversification</p>
            <p className="text-3xl font-bold text-blue-700">7 Assets</p>
          </div>
        </div> */}

        <div className="grid lg:grid-cols-2 gap-7">
          {/* Main Chart Card – unchanged */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Asset Allocation</h3>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartView("pie")}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                    chartView === "pie"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartView("bar")}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                    chartView === "bar"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Bar
                </button>
              </div>
            </div>

            <div className="p-6 pb-2 h-[380px]">
              {chartView === "pie" ? (
                <PortfolioPieChart data={portfolio} />
              ) : (
                <PortfolioBarChart data={portfolio} />
              )}
            </div>

            <div className="px-6 pb-6">
              <PortfolioLegendList items={portfolio} />
            </div>
          </div>

          {/* Right side now only has Quick Actions (small) + full-width Chatbot below */}
          <div className="space-y-7">
        
            
            {/* Chatbot takes more vertical & horizontal space */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden  min-h-[220px] lg:min-h-[280px]">
              <PortfolioChatbot portfolio={portfolio} applyPortfolio={applyPortfolio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
