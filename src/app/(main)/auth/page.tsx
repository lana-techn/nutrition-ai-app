'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to home page where Clerk's Account Portal will handle authentication
export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <p>Redirecting...</p>
    </div>
  );
}
