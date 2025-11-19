'use client';
// (هذا المكون يحتوي على الخلفية المشتركة)

import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 md:p-8 overflow-hidden">
      
      {/* الخلفية المتدرجة */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary via-success/80 to-background"
      ></div>

      {/* نقطة ضوئية علوية يسرى */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-accent/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        initial={{ x: -100, y: -100, scale: 0.5 }}
        animate={{ x: 0, y: 0, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      {/* نقطة ضوئية سفلية يمنى */}
      <motion.div 
        className="absolute bottom-0 right-0 w-64 h-64 bg-primary/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        initial={{ x: 100, y: 100, scale: 0.5 }}
        animate={{ x: 0, y: 0, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* (هنا سيتم عرض الفورم - login أو register) */}
      {children}
    </div>
  );
}