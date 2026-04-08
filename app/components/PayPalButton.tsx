'use client';
import React, { useEffect } from 'react';

interface PayPalProps {
  amount: string;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalProps) {
  useEffect(() => {
    // בדיקה אם הסקריפט כבר קיים כדי למנוע כפילויות
    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=AasYqR0I1gISlBltl-9cgv71rFHkTpRQY6SvyU_q3-ADwanvgVAUE2PZFg27iglcxVMfyys68HbWAkLa&currency=ILS`;
      script.async = true;
      script.addEventListener('load', () => {
        renderButtons();
      });
      document.body.appendChild(script);
    } else {
      renderButtons();
    }

    function renderButtons() {
      // @ts-ignore
      if (window.paypal && window.paypal.Buttons) {
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
                description: "SeniorSafe - Lifetime Access",
                amount: {
                  currency_code: "ILS",
                  value: amount
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture();
            onSuccess(details);
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
            alert("הייתה שגיאה בתשלום, אנא נסו שנית.");
          }
        }).render('#paypal-button-container');
      }
    }
  }, [amount, onSuccess]);

  return (
    <div className="w-full">
      <div id="paypal-button-container"></div>
    </div>
  );
}