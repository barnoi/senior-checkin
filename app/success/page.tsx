'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // השהייה של 5 שניות כדי לאפשר קריאה של ההנחיות לפני מעבר אוטומטי
    const timer = setTimeout(() => {
      router.push('/admin');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-right" dir="rtl">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-2 bg-green-500"></div>
        
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-4xl font-black text-slate-800">התשלום עבר!</h1>
        <p className="text-xl text-slate-600 font-medium">
          ברוכים הבאים למשפחת SeniorSafe. החשבון שלך הופעל בהצלחה.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3 text-right">
          <p className="font-bold text-blue-800">מה עושים עכשיו?</p>
          <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
            <li>אנחנו מעבירים אותך לדף ניהול המלווים.</li>
            <li><strong>חשוב:</strong> ודאו שאיש הקשר הראשון הוא המלווה הראשי לחירום.</li>
            <li>לאחר מכן, תוכלו להתקין את האפליקציה אצל אמא.</li>
          </ul>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <p className="text-xs text-slate-400 italic">מעביר לניהול מלווים בעוד מספר שניות...</p>
      </div>
    </div>
  );
}