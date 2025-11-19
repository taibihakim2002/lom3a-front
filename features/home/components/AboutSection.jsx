'use client';

// 1. استيراد مكتبات الحركة الخفيفة لتقليل حجم الباندل (Bundle Size)
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { Users, Sparkles, CheckSquare } from 'lucide-react';
// 2. استيراد مكون الصور من Next.js
import Image from 'next/image';

export default function AboutSection() {
  const aboutImageUrl = "https://images.pexels.com/photos/7217988/pexels-photo-7217988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const features = [
    {
      icon: <Users size={32} className="text-blue-600" />,
      title: "فريق عمل محترف",
      description: "فريقنا مكون من 10 موظفين مدربين لضمان أعلى مستويات الخدمة."
    },
    {
      icon: <Sparkles size={32} className="text-blue-600" />,
      title: "جودة مضمونة",
      description: "نستخدم أفضل المواد والمعدات لضمان لمعان يدوم طويلاً."
    },
    {
      icon: <CheckSquare size={32} className="text-blue-600" />,
      title: "خدمة عملاء ممتازة",
      description: "نحن هنا لسماع ملاحظاتكم وتلبية احتياجاتكم بكفاءة عالية."
    }
  ];

  return (
    // 3. تغليف القسم بـ LazyMotion
    <LazyMotion features={domAnimation}>
      <m.section 
        className="py-16 bg-background"
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.3 }} 
        transition={{ duration: 0.7, ease: "easeOut" }}
        id='about'
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-6">
          {/* ----- العمود الأيمن: الصورة ----- */}
          <div className="flex items-center justify-center">
            {/* الحاوية (Container) كما هي تماماً بتنسيقها */}
            <div className="relative w-full max-w-md md:max-w-lg h-[350px] md:h-[450px] overflow-hidden 
                            rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl shadow-2xl">
              
              {/* 4. استخدام Next/Image بدلاً من img */}
              <Image
                src={aboutImageUrl}
                alt="فريق شركة لمعة البيت"
                fill // يجعل الصورة تملأ الإطار (الذي حددته أنت مسبقاً بـ relative)
                className="object-cover"
                // 5. ضبط الأحجام ليقوم المتصفح بتحميل نسخة صغيرة للموبايل ونسخة أكبر للديسك توب
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75} // تقليل الجودة قليلاً لزيادة السرعة
                // بما أن هذا القسم ليس في أعلى الصفحة (Hero)، لا نضع priority، وسيتم تحميلها Lazy Loading تلقائياً
              />
            </div>
          </div>

          {/* ----- العمود الأيسر: المحتوى النصي ----- */}
          <div className="flex flex-col space-y-6 text-right">
            <span className="text-lg font-semibold text-blue-600">عن شركة لمعة البيت</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              خبرة منذ 2021 في تقديم خدمات التنظيف الاحترافية
            </h2>
            <p className="text-lg text-gray-700 max-w-lg">
              نحن شركة أردنية صغيرة متخصصة في تقديم خدمات تنظيف المنازل والمكاتب في عمّان.
              نفخر بفريقنا المكون من 10 موظفين ونحرص دائماً على الجودة وخدمة العملاء الممتازة.
            </p>
            
            {/* ----- ميزات الشركة ----- */}
            <div className="space-y-6 pt-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </m.section>
    </LazyMotion>
  );
}