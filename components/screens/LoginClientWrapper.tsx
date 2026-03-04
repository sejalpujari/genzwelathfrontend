"use client";

import { useRouter } from "next/navigation";
import LoginScreen from "./LoginScreen";

export default function LoginClientWrapper() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    console.log("Login Success!");
    router.push("/onboarding"); // Navigate to dashboard or other post-login page
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password clicked!");
    router.push("/forgot-password"); // Navigate to forgot password page
  };

  const handleSignup = () => {
    console.log("Sign Up clicked!");
    router.push("/signup"); // Navigate to signup page
  };

  return (
    <LoginScreen
      onLoginSuccess={handleLoginSuccess}
      onForgotPassword={handleForgotPassword}
      onSignup={handleSignup}
    />
  );
}