'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
// 1. استيراد m و LazyMotion لتحسين الأداء
import { m, LazyMotion, domAnimation } from 'framer-motion'; 
// 2. استيراد مكون الصور
import Image from 'next/image';

import { 
  Home, Building, Bath, Layers, Sofa, ArrowLeft,
  Sparkles, 
} from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';

export default function ServicesSection() {

  // بيانات الخدمات
  const servicesData = [
    {
      icon: <Home size={28} className="text-background" />,
      title: "تنظيف المنازل الدوري",
      description: "نحافظ على نظافة منزلك بشكل مستمر ومنظم.",
      imageUrl: "/services/house.webp"
    },
    {
      icon: <Sparkles size={28} className="text-background" />,
      title: "التنظيف العميق",
      description: "خدمة شاملة تصل إلى أعمق الأماكن.",
      imageUrl: "/services/deep.webp"
    },
    {
      icon: <Building size={28} className="text-background" />,
      title: "تنظيف ما بعد البناء",
      description: "نزيل جميع مخلفات البناء والدهان.",
      imageUrl: "/services/building.webp"
    },
    {
      icon: <Bath size={28} className="text-background" />,
      title: "المطابخ والحمامات",
      description: "تعقيم وتلميع شامل لإزالة الدهون.",
      imageUrl: "/services/kitchen.jpeg"
    },
    {
      icon: <Layers size={28} className="text-background" />,
      title: "تنظيف السجاد والموكيت",
      description: "نستخدم أحدث الأجهزة لإعادة الحيوية.",
      imageUrl: "/services/sijad.jpg"
    },
    {
      icon: <Sofa size={28} className="text-background" />,
      title: "تنظيف الكنب والمفروشات",
      description: "تنظيف بالبخار لإزالة البقع والروائح.",
      imageUrl: "/services/kanap.webp"
    },
  ];

  // --- متغيرات الحركة ---
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };

  return (
    // 3. تغليف القسم بـ LazyMotion
    <LazyMotion features={domAnimation}>
      <m.section 
        className="relative py-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        id='services'
      >
        {/* فاصل الموجة العلوي */}
        <div className="absolute top-0 left-0 w-full h-[50px] sm:h-[150px] md:h-[100px] transform rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path fill="#f5f5f5" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-24">
          
          {/* العنوان */}
          <m.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-lg font-semibold text-blue-600">خدماتنا</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-2">
              خدمات تنظيف احترافية لمنزل يلمع
            </h2>
            <p className="text-lg text-gray-700 mt-4">
              نقدم مجموعة متكاملة من خدمات التنظيف التي تلبي جميع احتياجاتك، من التنظيف الدوري السريع إلى التنظيف العميق والشامل.
            </p>
          </m.div>

          {/* شبكة بطاقات الخدمات */}
          <m.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridContainerVariants}
          >
            {servicesData.map((service) => (
              <m.div
                key={service.title}
                variants={cardVariants}
              >
                <Card className="relative h-96 rounded-2xl shadow-lg overflow-hidden group cursor-pointer border-0">
                  <CardContent className="p-0">
                    {/* 4. استبدال img بـ Image */}
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill // تملأ الحاوية (h-96)
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      // 5. أحجام ذكية: 100% للموبايل، 50% للتابلت، 33% للشاشات الكبيرة
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={75}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    <div className="relative h-96 flex flex-col justify-end p-6 text-right text-white 
                                    transition-transform duration-500 ease-in-out 
                                    group-hover:-translate-y-4">
                      
                      <div className="bg-primary p-3 rounded-full w-fit mb-3 shadow-md">
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                      <p className="text-gray-200 text-sm mb-4">{service.description}</p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button asChild variant="link" className="text-white p-0 text-base">
                          <Link href="#booking">
                            احجز الآن
                            <ArrowLeft size={18} className="mr-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </m.div>

        </div>

        {/* فاصل الموجة السفلي */}
        <div className="absolute bottom-0 left-0 w-full h-[50px] sm:h-[150px] md:h-[100px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path fill="#f5f5f5" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

      </m.section>
    </LazyMotion>
  );
}