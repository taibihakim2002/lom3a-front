"use client";
import React from 'react';
import { Loader2 } from 'lucide-react';


export const FullScreenLoader = ({ variant = 'dark' }) => {
  // تحديد الألوان بناءً على النسخة المطلوبة
  const themeClasses = {
    light: {
      background: 'bg-slate-50', // خلفية فاتحة
      text: 'text-slate-600',   // نص داكن
    },
    dark: {
      background: 'bg-[radial-gradient(ellipse_at_center,hsl(224,13%,12%),hsl(224,13%,8%))]', // خلفية داكنة
      text: 'text-slate-300',   // نص فاتح
    },
  };

  const currentTheme = themeClasses[variant];

  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center font-sans ${currentTheme.background}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className={`mt-4 ${currentTheme.text}`}>
        جاري التحميل...
      </p>
    </div>
  );
};