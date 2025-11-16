'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react'; // إضافة أيقونة LogIn

export default function AdminLoginPage() {
  
  // متغيرات الحركة للعناصر المتتابعة
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // حركة زنبركية
        damping: 15,    // يخفف الاهتزاز
        stiffness: 100, // سرعة الحركة
        staggerChildren: 0.1, // تأخير بين ظهور العناصر الفرعية
        delayChildren: 0.2    // تأخير قبل بدء ظهور العناصر الفرعية
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 md:p-8 overflow-hidden">
      
      {/* الخلفية المتدرجة باستخدام ألوان Tailwind المتغيرة */}
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
      
      {/* رابط العودة للموقع الرئيسي */}
      <Link 
        href="/" 
        className="absolute top-6 right-6 z-10 text-sm font-medium text-primary-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <LogIn size={16} className="rotate-180" /> {/* أيقونة تعبر عن العودة أو الخروج */}
        العودة للموقع الرئيسي
      </Link>
      
      {/* البطاقة الرئيسية لتسجيل الدخول */}
      <motion.div
        className="relative z-20 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-2xl border-none bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-right space-y-3 p-6 md:p-8">
            <motion.div variants={itemVariants}>
              {/* شعار الشركة المصغر */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                ل
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-extrabold text-foreground text-center">
                لوحة تحكم "لمعة البيت"
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-muted-foreground text-center text-base">
                أهلاً بك! الرجاء تسجيل الدخول للمتابعة.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
            <form className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2 text-right">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ادخل بريدك الإلكتروني" 
                    className="pr-10 text-right bg-input/80 border-border focus:border-primary transition-colors"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2 text-right">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="ادخل كلمة المرور"
                    className="pr-10 text-right bg-input/80 border-border focus:border-primary transition-colors"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <motion.div variants={itemVariants} className="text-left pt-1">
                  <Link href="#" className="text-sm text-primary hover:underline font-medium">
                    هل نسيت كلمة المرور؟
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full text-lg py-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 ease-in-out">
                  تسجيل الدخول
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}