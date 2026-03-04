"use client";

import { useRouter } from "next/navigation";
import ProfileSummaryScreen from "@/components/screens/ProfileSummaryScreen";

export default function ProfileSummaryPage() {
  const router = useRouter();

  return <ProfileSummaryScreen onViewPortfolio={() => router.push("/dashboard")} />;
}
