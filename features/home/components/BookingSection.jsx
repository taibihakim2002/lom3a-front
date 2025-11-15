'use client';

// (استيراد المكونات المطلوبة)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; 
import { Phone, Mail, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";


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

  return (
    <motion.section 
      className="relative z-40 py-24 bg-primary" 
      id='booking'
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7 }}
    >
      {/* --- فاصل الموجة --- */}
      <div className="absolute top-0 left-0 w-full h-[50px] sm:h-[100px] md:h-[150px] transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          {/* (يجب أن يكون لون "fill" هو لون القسم السابق "bg-background") */}
          <path fill="#f5f5f5" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      {/* --- نهاية التعديل --- */}
      
      {/* *** تم التعديل هنا: إضافة pt-36 md:pt-48 *** */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ----- 1. العمود الأيمن (العنوان والوصف) ----- */}
          <motion.div 
            className="flex flex-col space-y-6 text-right"
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            {/* (تم تعديل الألوان لتناسب الخلفية الأساسية) */}
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
          </motion.div>

          {/* ----- 2. العمود الأيسر (فورم الحجز) ----- */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, x: 0 }} 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            {/* (استخدام "Card" بخلفية "bg-background") */}
            <Card className="bg-background p-8 shadow-lg">
              <CardContent className="p-0">
                <form 
                  onSubmit={(e) => e.preventDefault()}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* (استخدام "Label" و "Input") */}
                  <div className="space-y-1 text-right">
                    <Label htmlFor="name" className="text-muted-foreground">الاسم الكامل</Label>
                    <Input type="text" id="name" placeholder="مثال: أحمد العبدالله" className="bg-input border-border text-foreground text-right" />
                  </div>

                  <div className="space-y-1 text-right">
                    <Label htmlFor="phone" className="text-muted-foreground">رقم الهاتف</Label>
                    <Input type="tel" id="phone" placeholder="0795551234" className="bg-input border-border text-foreground text-right" />
                  </div>

                  {/* (استخدام "Select" من shadcn) */}
                  <div className="md:col-span-2 space-y-1 text-right">
                    <Label htmlFor="service" className="text-muted-foreground">نوع الخدمة</Label>
                    <Select dir="rtl">
                      <SelectTrigger id="service" className="w-full bg-input border-border text-foreground text-right">
                        <SelectValue placeholder="اختر الخدمة المطلوبة..." />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map(service => (
                          <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 text-right">
                    <Label htmlFor="date" className="text-muted-foreground">التاريخ المفضل</Label>
                    <Input type="date" id="date" className="bg-input border-border text-foreground text-right" />
                  </div>

                  <div className="space-y-1 text-right">
                    <Label htmlFor="time" className="text-muted-foreground">الوقت المفضل</Label>
                    <Select dir="rtl">
                      <SelectTrigger id="time" className="w-full bg-input border-border text-foreground text-right">
                        <SelectValue placeholder="اختر الوقت..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-1 text-right">
                    <Label htmlFor="address" className="text-muted-foreground">العنوان (المكان)</Label>
                    <Input type="text" id="address" placeholder="مثال: عمّان، دابوق، شارع..." className="bg-input border-border text-foreground text-right" />
                  </div>

                  {/* (استخدام "Textarea") */}
                  <div className="md:col-span-2 space-y-1 text-right">
                    <Label htmlFor="notes" className="text-muted-foreground">ملاحظات إضافية</Label>
                    <Textarea id="notes" rows={3} placeholder="هل لديك أي طلبات خاصة؟ (اختياري)" className="bg-input border-border text-foreground text-right"/>
                  </div>

                  {/* (زر بلون متباين) */}
                  <div className="md:col-span-2">
                    <Button size="lg" className="w-full text-lg bg-foreground hover:bg-foreground/90 text-background rounded-full py-7">
                      <span className="ml-2">إرسال طلب الحجز</span>
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}