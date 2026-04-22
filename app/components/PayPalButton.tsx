'use client';
import React, { useEffect, useRef } from 'react';

interface PayPalProps {
  amount: string;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. פונקציית הרינדור של הכפתורים
    const renderButtons = () => {
      // @ts-ignore
      if (window.paypal && window.paypal.Buttons && containerRef.current) {
        // ניקוי המכולה למניעת כפילויות
        containerRef.current.innerHTML = ''; 
        
        // @ts-ignore
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'rect',
            label:  'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: "SeniorSafe - Annual Access (1 Year)",
                amount: {
                  currency_code: "ILS",
                  value: amount
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture();
            
            // 1. שמירת המייל של המשלם בזיכרון של הדפדפן לזיהוי עתידי
            const payerEmail = details.payer.email_address;
            localStorage.setItem('senior_user_email', payerEmail);
            
            // 2. הפעלת פונקציית ההצלחה
            onSuccess(details);

            // 3. מעבר אוטומטי לדף ניהול המלווים
            window.location.href = '/admin';
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
            alert("הייתה שגיאה בתשלום, אנא נסו שנית.");
          }
        }).render(containerRef.current);
      }
    };

    // 2. טעינת הסקריפט של PayPal בצורה בטוחה
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.error("PayPal Client ID is missing in environment variables!");
      return;
    }

    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS`;
      script.async = true;
      script.onload = renderButtons;
      document.body.appendChild(script);
    } else {
      renderButtons();
    }
  }, [amount, onSuccess]);

  return (
    <div className="w-full">
      {/* המכולה שבה יופיע הכפתור */}
      <div ref={containerRef} className="min-h-37.5"></div>
    </div>
  );
}