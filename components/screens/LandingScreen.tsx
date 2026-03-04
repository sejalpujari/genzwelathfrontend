"use client";

import { ArrowRight, TrendingUp, Shield, MessageCircle, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">WealthWise Advisor</h1>
            <p className="text-xl text-gray-600">Personalized investment strategies powered by AI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Bank-level encryption</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <MessageCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Guidance</h3>
              <p className="text-sm text-gray-600">Chat with your advisor</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Globe className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Market Data</h3>
              <p className="text-sm text-gray-600">Real-time recommendations</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => router.push("/signup")}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-white text-blue-600 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
