'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing/page';

export default function SmartEntryPoint() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isRecognized, setIsRecognized] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('senior_user_email');
    const recognized = !!savedUser;
    
    setIsRecognized(recognized);

    if (recognized) {
      router.push('/checkin');
    }
  }, [router]);

  // פתרון Hydration: השרת ירנדר div ריק, והלקוח ימלא אותו
  // זה מונע מהתוספים של הדפדפן להתנגש עם ה-HTML הראשוני
  if (!isMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  // מצב טעינה/זיהוי
  if (isRecognized === null || isRecognized === true) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {/* הטקסט הזה ירונדר רק בדפדפן, ולכן לא יגרום לשגיאת Mismatch */}
        <div className="animate-pulse text-slate-300 font-medium italic">
          SeniorSafe מזהה מכשיר...
        </div>
      </div>
    );
  }

  return <LandingPage />;
}