'use client';
import React, { useState, useEffect } from 'react';
import LandingPage from './landing/page';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // שימי לב שהוספנו suppressHydrationWarning ל-div
  if (!mounted) {
    return <div className="min-h-screen bg-white" suppressHydrationWarning={true} />;
  }

  return (
    <div suppressHydrationWarning={true}>
      <LandingPage />
    </div>
  );
}