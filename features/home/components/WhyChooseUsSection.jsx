'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {  motion } from 'framer-motion'; 

// *** تمت الإضافة: أيقونات جديدة للأقسام الجديدة ***
import { 
  Sparkles,
  BadgeCheck, ShieldCheck, Smile, 
} from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';


export default function WhyChooseUsSection() {
  
  // بيانات البطاقات (تبقى كما هي)
  const whyUsFeatures = [
    {
      icon: <BadgeCheck size={32} className="text-blue-600" />,
      title: "جودة احترافية",
      description: "نضمن لك أعلى مستويات النظافة باستخدام أفضل المواد وفريق مدرب."
    },
    {
      icon: <ShieldCheck size={32} className="text-blue-600" />,
      title: "موثوقية وأمانة",
      description: "فريقنا يتمتع بأمانة تامة، ونلتزم بالمواعيد لراحتك الكاملة."
    },
    {
      icon: <Smile size={32} className="text-blue-600" />,
      title: "رضا العملاء أولاً",
      description: "نسعى دائماً لتجاوز توقعاتك، وخدمة عملائنا هي أولويتنا."
    }
  ];

  // --- متغيرات الحركة (Stagger) للبطاقات في العمود الأيمن ---
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2, // تأخير 0.2 ثانية بين كل بطاقة
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 }, // تبدأ مخفية ومزاحة لليمين
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  // --- نهاية متغيرات الحركة ---

  return (
    <motion.section 
      // تم حذف "py-24" من هنا، وإضافتها للحاوية الداخلية
      className="relative overflow-hidden bg-secondary pt-12" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // تفعيل عند رؤية 20%
    >
      {/* *** القسم المضاف: فاصل الموجة العلوي *** */}
      <div className="absolute top-0 left-0 w-full h-[50px] sm:h-[150px] md:h-[100px] transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          {/* اللون #ffffff يتطابق مع خلفية "من نحن" السابقة */}
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16">
        
        {/* *** تخطيط جديد: شبكة من عمودين *** */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ----- 1. العمود الأيسر (العنوان والوصف) ----- */}
          <motion.div 
            className="flex flex-col space-y-6 text-right"
            initial={{ opacity: 0, x: -50 }} // انزلاق من اليسار
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <span className="text-center md:text-start text-lg font-semibold text-blue-600">لماذا نحن الأفضل؟</span>
            <h2 className="text-center md:text-start text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              خبرتنا تتحدث عنّا، راحتك هي أولويتنا
            </h2>
            <p className="text-center md:text-start text-lg text-gray-700 mt-4 max-w-lg">
              نحن لا ننظف فقط، بل نخلق بيئة صحية ومريحة. نجمع بين أحدث التقنيات 
              وفريق عمل شغوف لتقديم خدمة تفوق توقعاتك في كل مرة.
            </p>
            {/* زر "اكتشف خدماتنا" */}
            <div className="pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-fit m-auto md:m-0" // لجعل الزر بحجمه الطبيعي
              >
                <Button asChild size="lg" className="bg-primary hover:bg-blue-700 text-background text-lg px-8 py-7 rounded-full">
                  <Link href="/services">اكتشف خدماتنا</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* ----- 2. العمود الأيمن (البطاقات) ----- */}
          <motion.div 
            className="grid grid-cols-1 gap-6"
            variants={staggerContainerVariants} // تطبيق حاوية الحركة المتتابعة
          >
            {whyUsFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" 
                }}
              >
                <Card className="bg-background shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="flex-shrink-0 bg-accent p-4 rounded-full"> 
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* *** اللمسة الجمالية: الأيقونة في الخلفية *** */}
      <motion.div
        className="absolute -bottom-24 -right-24 z-0"
        animate={{ rotate: 360 }} // حركة دوران دائمة
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles 
          className="w-72 h-72 text-blue-100/50" // أيقونة ضخمة وفاتحة
          strokeWidth={1}
        />
      </motion.div>

    </motion.section>
    
  );
}