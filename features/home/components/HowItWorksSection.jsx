'use client';

// 1. استيراد المكونات الخفيفة من framer-motion لتقليل حجم الملف
import { m, LazyMotion, domAnimation } from 'framer-motion'; 

import { 
  Sparkles,
  Calendar,
  PhoneCall,
  CheckCircle,
} from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';


export default function HowItWorksSection() {
  
  // بيانات الخطوات
  const stepsData = [
    {
      icon: <Calendar size={32} className="text-blue-600" />,
      title: "1. الحجز المسبق",
      description: "اختر الخدمة واحجز موعدك بسهولة عبر موقعنا أو بالاتصال المباشر."
    },
    {
      icon: <PhoneCall size={32} className="text-blue-600" />,
      title: "2. التأكيد والتجهيز",
      description: "نتصل بك لتأكيد الموعد وتفاصيل الخدمة المطلوبة وتجهيز الفريق."
    },
    {
      icon: <Sparkles size={32} className="text-blue-600" />,
      title: "3. عملية التنظيف",
      description: "يصل فريقنا في الموعد مجهزاً بأفضل المواد ويبدأ العمل بدقة واحترافية."
    },
    {
      icon: <CheckCircle size={32} className="text-blue-600" />,
      title: "4. النتيجة والمتابعة",
      description: "نسلّمك منزلاً يلمع، ونتابع معك لضمان رضاك التام عن الخدمة."
    }
  ];

  // --- متغيرات الحركة ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } 
  };

  return (
    // 2. تغليف القسم بـ LazyMotion
    <LazyMotion features={domAnimation}>
      {/* 3. استبدال motion.section بـ m.section */}
      <m.section 
        className="relative pt-16 pb-36 bg-background" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* ----- 1. عنوان القسم ----- */}
          {/* 4. استبدال motion.div بـ m.div */}
          <m.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-lg font-semibold text-blue-600">آلية العمل</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-2">
              كيف نعمل؟
            </h2>
            <p className="text-lg text-gray-700 mt-4">
              نتبع 4 خطوات بسيطة ومدروسة لنضمن لك تجربة سهلة ونتيجة ممتازة.
            </p>
          </m.div>

          <m.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 relative"
            variants={containerVariants}
          >
            {/* الخط الأفقي */}
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-200 -z-10" />

            {stepsData.map((step, index) => (
              <m.div
                key={step.title}
                variants={itemVariants}
              >
                <Card className="flex flex-col items-center text-center p-6 shadow-lg h-full">
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="flex-shrink-0 bg-accent p-4 rounded-full border-4 border-background shadow-md">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground mt-6 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </m.div>

        </div>

      </m.section>
    </LazyMotion>
  );
}