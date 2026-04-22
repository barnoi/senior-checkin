'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PayPalButton from '../components/PayPalButton';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // מונע שגיאות Hydration על ידי המתנה לטעינה בדפדפן
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePaymentSuccess = async (details: any) => {
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    try {
      // רישום בטבלת customers בסופבייס
      const { error } = await supabase
        .from('customers')
        .upsert([{ 
          email: cleanEmail, 
          payment_status: 'paid', 
          plan_type: 'founder_lifetime', // או 'annual' לפי מה שהחלטת
          paypal_order_id: details.id 
        }]);

      if (error) throw error;
      
      // שמירה מקומית כדי שהאדמין יזהה אותו
      localStorage.setItem('senior_user_email', cleanEmail);
      setIsPaid(true);

      // מעבר לדף ניהול המלווים
      setTimeout(() => {
        window.location.href = '/admin'; // שיניתי מ-success ל-admin
      }, 2000);

    } catch (err) {
      console.error("Error saving payment:", err);
      alert("התשלום עבר אך נתקלנו בבעיה ברישום. צרו קשר עם התמיכה.");
    } finally {
      setLoading(false);
    }
  };

  // בדיקת אימייל תקין הכוללת @ ונקודה
  const isEmailValid = email.includes('@') && email.split('@')[1]?.includes('.') && email.length > 5;

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-right" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 left-0 h-2 bg-blue-600"></div>

        {!isPaid ? (
          <>
            <Link href="/" className="text-blue-600 text-sm font-bold mb-6 inline-block hover:underline">
              ← חזרה לדף הבית
            </Link>
            
            <h1 className="text-3xl font-black text-slate-800 mb-2">הצטרפות ל-Founders</h1>
            <p className="text-slate-500 mb-8 font-medium">תשלום חד-פעמי של ₪199 לכל החיים.</p>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 mr-1">אימייל להגדרת החשבון:</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-left font-sans"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="pt-4 min-h-37.5">
                {isEmailValid ? (
                  <div key="paypal-container" className="animate-in fade-in zoom-in duration-300">
                    <p className="text-xs text-blue-600 font-black mb-4 italic text-center">** מצב בדיקה פעיל: המחיר הוא 1 ש"ח **</p>
                    <PayPalButton 
                      amount="1.00" 
                      onSuccess={handlePaymentSuccess} 
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-50 rounded-2xl text-slate-400 font-bold border-2 border-dashed border-slate-200">
                    הזינו אימייל תקין כדי להמשיך לתשלום
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">ברוכים הבאים!</h2>
            <p className="text-slate-600 font-medium mb-8">החשבון הופעל עבור המייל {email}</p>
          </div>
        )}
      </div>
    </div>
  );
}