'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner'; 
import useAuthStore from '@/store/authStore';
import { authApi } from '../api';
import { cn } from "@/lib/utils";

// --- Zod Schema لـ Login (مطابق للباكاند) ---
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'), 
});

// (متغيرات الحركة)
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // --- إعداد React Hook Form ---
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // --- إعداد React Query Mutation ---
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success('أهلاً بعودتك! جارِ تسجيل الدخول...');
      setUser(data.data.user); // (البيانات تأتي داخل data.data بسبب axios)
      router.push('/admin/dashboard'); 
    },
    onError: (error) => {
      // (رسالة الخطأ من الباكاند، مثل "بيانات الدخول غير صحيحة")
      const message = error.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(message);
    },
  });

  // --- دالة الإرسال ---
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Toaster richColors position="top-right" /> 

      <Link 
        href="/" 
        className="absolute top-6 right-6 z-10 text-sm font-medium text-primary-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <LogIn size={16} className="rotate-180" />
        العودة للموقع الرئيسي
      </Link>
      
      <motion.div
        className="relative z-20 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <fieldset disabled={mutation.isPending}>
          <Card className="shadow-2xl border-none bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-right space-y-3 p-6 md:p-8">
              <motion.div variants={itemVariants}>
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* --- البريد الإلكتروني --- */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => ( 
                        <FormItem className="text-right">
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="ادخل بريدك الإلكتروني" 
                                {...field}
                                className={cn(
                                  "pr-10 text-right",
                                  fieldState.invalid && "bg-destructive/10 border-destructive text-destructive-foreground focus-visible:ring-destructive"
                                )}
                              />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  {/* --- كلمة المرور --- */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem className="text-right">
                          <Label>كلمة المرور</Label>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="password" 
                                placeholder="ادخل كلمة المرور"
                                {...field}
                                className={cn(
                                  "pr-10 text-right",
                                  fieldState.invalid && "bg-destructive/10 border-destructive text-destructive-foreground focus-visible:ring-destructive"
                                )}
                              />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <motion.div variants={itemVariants} className="text-left pt-1">
                      <Link href="#" className="text-sm text-primary hover:underline font-medium">
                        هل نسيت كلمة المرور؟
                      </Link>
                    </motion.div>
                  </motion.div>
                  
                  {/* --- زر الإرسال --- */}
                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "جارِ الدخول..." : "تسجيل الدخول"}
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
                    ليس لديك حساب؟ 
                    <Button variant="link" asChild className="p-1 text-primary">
                      <Link href="/admin/register">إنشاء حساب (لأول مرة)</Link>
                    </Button>
                  </motion.div>

                </form>
              </Form>

            </CardContent>
          </Card>
        </fieldset>
      </motion.div>
    </>
  );
}