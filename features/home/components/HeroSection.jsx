'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';

export default function HeroSection() {
  const bgImageUrl = "/services/hero.webp";
  const roundImageUrl =
    "https://images.pexels.com/photos/6198656/pexels-photo-6198656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  /**
   * Framer Motion variants
   * -> قلّلت delayChildren وstaggerChildren لتقليل التأخير المرئي.
   * -> استخدام prefers-reduced-motion أدنى لإعطاء تجربة متوافقة مع إعدادات المستخدم.
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }
  };

  // نحترم إعداد reduced motion
  const prefersReducedMotion = (typeof window !== 'undefined') && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      className="relative flex items-center min-h-[85vh] sm:min-h-screen pt-28 sm:pt-36 lg:pt-12"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10">
        {/* <Image
          src={bgImageUrl}
          alt="" // زينة بصرية؛ اجعل alt فارغًا لقراء الشاشة إن لم تحمل معنى
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        /> */}
        {/* طبقة Overlay */}
        <div className="absolute inset-0 bg-background opacity-80" />
      </div>

      <div
        className="container relative z-10 mx-auto grid grid-cols-1 min-h-[calc(85vh-112px)] sm:min-h-[calc(100vh-128px)]
                    items-center gap-5 px-4 md:grid-cols-2 md:px-6 lg:gap-16"
      >
        {/* المحتوى النصي */}
        <motion.div
          className="order-2 lg:order-1 flex flex-col space-y-4 sm:space-y-6 text-right"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // إذا المستخدم يفضّل تقليل الحركة، نلغي animation الثقيل
          {...(prefersReducedMotion ? { initial: false, animate: undefined } : {})}
        >
          <motion.p
            variants={itemVariants}
            className="mt-3 md:mt-0 text-sm text-center lg:text-start  sm:text-lg font-semibold text-blue-600"
          >
            التعقيم الاحترافي
          </motion.p>

          {/* العنوان الأساسي: أحرصنا أن يظهر مبكراً بتقليل تأخير الحركات */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-center lg:text-start text-5xl sm:text-5xl md:text-6xl lg:text-7xl 
                       font-extrabold  sm:leading-tight tracking-tight text-gray-900"
          >
            التميز في خدمات
            <span className="text-blue-600 mt-5 sm:mt-3 block">التنظيف</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-center lg:text-start  max-w-xl text-sm sm:text-lg text-gray-700 mx-auto lg:mx-0"
          >
            لمعة البيت هي شركة أردنية متخصصة في تقديم خدمات تنظيف المنازل والمكاتب منذ عام 2021.
            نحن نضمن فريق عمل محترف يضمن جودة الخدمة والاهتمام بالتفاصيل.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-fit sm:w-auto mx-auto lg:mx-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-green-500 hover:bg-green-600 text-background w-full sm:w-fit text-base sm:text-lg px-10 sm:px-8 py-6 sm:py-7 rounded-full"
              >
                <Link href="#services">عرض خدماتنا</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-primary hover:bg-blue-700 text-background w-full sm:w-fit text-base sm:text-lg px-10 sm:px-8 py-6 sm:py-7 rounded-full"
              >
                <Link href="#booking">حجز الان</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* الصورة الدائرية (صمّمت بنفس الشكل) */}
        <motion.div
          className="order-1 lg:order-2 flex sm:pb-16 md:pb-12 items-center justify-center lg:justify-end"
          initial={prefersReducedMotion ? undefined : { opacity: 0, x: 50 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.7, delay: 0.18 }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.03, rotate: -1 }}
        >
          <div
            className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[450px] md:h-[450px]
                          overflow-hidden shadow-2xl rounded-tl-full rounded-bl-full rounded-br-full"
            aria-hidden={false}
          >
            {/* استخدمنا next/image لتحسين delivery و responsive srcset */}
            <Image
              src={roundImageUrl}
              alt="تنظيف أريكة"
              width={450}
              height={450}
              priority={false} // ليست بالضرورة LCP لكن مرئية فورية؛ جعلها غير أولوية افتراضياً
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 450px, 600px"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* الموجة السفليّة — بقيت كما هي */}
      <div className="absolute bottom-0 left-0 w-full h-[40px] sm:h-[50px] md:h-[80px]">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
             viewBox="0 0 1440 320" className="w-full h-full" aria-hidden="true" focusable="false">
          <path fill="#ffffff" fillOpacity="1"
            d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,
               768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,
               192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,
               320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
