"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SignupScreenProps = {
  onCreateAccount?: () => void;
  onLogin?: () => void;
};

export default function SignupScreen({ onCreateAccount, onLogin }: SignupScreenProps) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (onCreateAccount) {
      onCreateAccount();
      return;
    }

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.detail || "Signup failed");
        return;
      }

      alert("Account created. Please log in.");
      router.push("/login");
    } catch {
      alert("Server error during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Start your investment journey today</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        <p className="text-xs text-gray-500 text-center mb-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onLogin ? onLogin : () => router.push("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
