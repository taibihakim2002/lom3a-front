'use client';

// (استيراد المكونات المطلوبة)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// 1. التعديل هنا: استيراد النسخ الخفيفة من framer-motion
import { m, LazyMotion, domAnimation } from 'framer-motion'; 
import { Phone, Mail, Send, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// --- الإضافات للربط ---
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner'; 
import { bookingsApi } from '@/features/bookings/api'; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

// 1. تعريف Zod Schema
const bookingSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(9, 'رقم الهاتف مطلوب'),
  service: z.string({ required_error: 'يرجى اختيار الخدمة' }).min(1, 'يرجى اختيار الخدمة'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  time: z.string({ required_error: 'الوقت مطلوب' }).min(1, 'الوقت مطلوب'),
  address: z.string().min(5, 'العنوان مطلوب'),
  notes: z.string().optional(),
});

export default function BookingSection() {
  
  const serviceOptions = [
    "تنظيف المنازل الدوري",
    "التنظيف العميق",
    "تنظيف ما بعد البناء",
    "تنظيف المطابخ والحمامات",
    "تنظيف السجاد والموكيت",
    "تنظيف الكنب والمفروشات"
  ];

  const timeOptions = [
    "9:00 صباحاً - 12:00 ظهراً",
    "12:00 ظهراً - 3:00 مساءً",
    "3:00 مساءً - 6:00 مساءً"
  ];

  // 2. إعداد الفورم
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "", phone: "", service: "", date: "", time: "", address: "", notes: ""
    },
  });

  // 3. إعداد Mutation
  const mutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      toast.success('تم إرسال طلبك بنجاح! سيتواصل معك فريقنا قريباً.');
      form.reset(); // تصفير الفورم
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "حدث خطأ أثناء الحجز";
      toast.error(msg);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    // 2. تغليف القسم بـ LazyMotion لتقليل حجم الجافا سكريبت
    <LazyMotion features={domAnimation}>
      {/* 3. استبدال motion.section بـ m.section */}
      <m.section 
        className="relative z-40 pb-24 bg-primary" 
        id='booking'
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <Toaster richColors position="top-center" />
        
        {/* --- فاصل الموجة --- */}
        <div className="absolute top-0 left-0 w-full h-[50px] sm:h-[100px] md:h-[150px] transform rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path fill="hsl(var(--secondary))" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-36 md:pt-48">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ----- 1. العمود الأيمن (العنوان والوصف) ----- */}
            {/* 4. استبدال motion.div بـ m.div */}
            <m.div 
              className="flex flex-col space-y-6 text-right"
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
              <span className="text-lg font-semibold text-primary-foreground/70">لا تتردد</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
                احجز خدمتك الآن
              </h2>
              <p className="text-lg text-primary-foreground/80 mt-4 max-w-lg">
                املأ النموذج وسيقوم فريقنا بالتواصل معك مباشرة لتأكيد الحجز وتفاصيل الزيارة. 
                استعد لتجربة نظافة لا مثيل لها مع "لمعة البيت".
              </p>
              <div className="pt-4 space-y-4">
                <a href="tel:+962795551234" className="flex items-center justify-end gap-3 text-lg text-primary-foreground hover:text-background/70 transition-colors">
                  <span>+962 79 555 1234</span>
                  <Phone size={20} />
                </a>
                <a href="mailto:info@lammat-albayt.jo" className="flex items-center justify-end gap-3 text-lg text-primary-foreground hover:text-background/70 transition-colors">
                  <span>info@lammat-albayt.jo</span>
                  <Mail size={20} />
                </a>
              </div>
            </m.div>

            {/* ----- 2. العمود الأيسر (فورم الحجز) ----- */}
            {/* 5. استبدال motion.div بـ m.div */}
            <m.div 
              className="w-full"
              initial={{ opacity: 0, x: 0 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            >
              <Card className="bg-background p-8 shadow-lg">
                <CardContent className="p-0">
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* الاسم */}
                      <FormField control={form.control} name="name" render={({ field, fieldState }) => (
                        <FormItem className="space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: أحمد العبدالله" {...field} className={cn("bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* الهاتف */}
                      <FormField control={form.control} name="phone" render={({ field, fieldState }) => (
                        <FormItem className="space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="0795551234" {...field} className={cn("bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* الخدمة */}
                      <FormField control={form.control} name="service" render={({ field, fieldState }) => (
                        <FormItem className="md:col-span-2 space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">نوع الخدمة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                            <FormControl>
                              <SelectTrigger className={cn("w-full bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")}>
                                <SelectValue placeholder="اختر الخدمة المطلوبة..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* التاريخ */}
                      <FormField control={form.control} name="date" render={({ field, fieldState }) => (
                        <FormItem className="space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">التاريخ المفضل</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className={cn("bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* الوقت */}
                      <FormField control={form.control} name="time" render={({ field, fieldState }) => (
                        <FormItem className="space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">الوقت المفضل</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                            <FormControl>
                              <SelectTrigger className={cn("w-full bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")}>
                                <SelectValue placeholder="اختر الوقت..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* العنوان */}
                      <FormField control={form.control} name="address" render={({ field, fieldState }) => (
                        <FormItem className="md:col-span-2 space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">العنوان (المكان)</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: عمّان، دابوق، شارع..." {...field} className={cn("bg-input border-border text-foreground text-right", fieldState.invalid && "border-destructive")} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* الملاحظات */}
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem className="md:col-span-2 space-y-1 text-right">
                          <FormLabel className="text-muted-foreground">ملاحظات إضافية</FormLabel>
                          <FormControl>
                            <Textarea rows={3} placeholder="هل لديك أي طلبات خاصة؟ (اختياري)" className="bg-input border-border text-foreground text-right" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      {/* زر الإرسال */}
                      <div className="md:col-span-2">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full text-lg bg-foreground hover:bg-foreground/90 text-background rounded-full py-7"
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending ? <Loader2 className="ml-2 animate-spin" /> : <Send className="ml-2" size={18} />}
                          {mutation.isPending ? "جارِ الإرسال..." : "إرسال طلب الحجز"}
                        </Button>
                      </div>

                    </form>
                  </Form>

                </CardContent>
              </Card>
            </m.div>
          </div>

        </div>
      </m.section>
    </LazyMotion>
  );
}