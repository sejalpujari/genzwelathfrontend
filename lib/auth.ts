// lib/auth.ts  (or utils/auth.ts, hooks/useLogout.ts, etc.)
'use client';

import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    // Clear authentication-related items
    localStorage.removeItem('access_token');
    
    // Optional: clear other common auth/session keys if you use them
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');     // if you have one
    localStorage.removeItem('token');             // sometimes people use generic names
    // localStorage.clear();                      // ← aggressive: clears EVERYTHING (use with caution)

    // Redirect to login page
    router.push('/login');
    
    // Optional: force a full refresh to clear any in-memory state
    // (especially useful if you're using React Context or Zustand/Redux)
    // router.refresh();  // or window.location.href = '/login';
  };

  return logout;
}