'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 
import { Quote, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '@/features/testimonials/api';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. جلب البيانات من الباكاند (الموافق عليها فقط)
  const { data, isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: testimonialsApi.getApproved,
    staleTime: 1000 * 60 * 5, // كاش لمدة 5 دقائق
  });

  const testimonialsData = data?.data?.data?.testimonials || [];

  // (التعامل مع التنقل)
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <motion.section 
      className="relative py-24 bg-primary" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-lg font-semibold text-blue-600">آراء عملائنا</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-background leading-tight mt-2">
            ماذا يقول العملاء عن "لمعة البيت"؟
          </h2>
        </motion.div>

        {/* حالة التحميل */}
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-background animate-spin" />
            </div>
        ) : testimonialsData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* --- العمود الأيمن: قائمة العملاء (للحاسوب) --- */}
            <motion.div 
                className="hidden lg:flex flex-col space-y-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                {testimonialsData.map((testimonial, index) => (
                <button
                    key={testimonial._id || index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex items-center gap-4 w-full text-right p-4 rounded-xl transition-all duration-300
                    ${currentIndex === index 
                        ? 'bg-blue-50 shadow-lg scale-105' 
                        : 'bg-background hover:bg-secondary' 
                    }`}
                >
                    {/* --- التعديل هنا: صورة العميل أو الحرف الأول --- */}
                    {testimonial.img ? (
                        <img 
                            src={testimonial.img} 
                            alt={testimonial.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" 
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                            {testimonial.name.charAt(0)}
                        </div>
                    )}
                    {/* --- نهاية التعديل --- */}

                    <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location || "عميل مميز"}</p>
                    </div>
                </button>
                ))}
            </motion.div>

            {/* --- العمود الأيسر: عرض الاقتباس --- */}
            <div className="relative lg:col-span-2 bg-secondary p-8 md:p-12 rounded-2xl shadow-lg min-h-[300px] text-right">
                <Quote size={48} className="absolute top-6 left-6 text-blue-200 opacity-70" />
                
                <AnimatePresence mode="wait">
                {currentTestimonial && (
                    <motion.div
                        key={currentIndex} 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="flex justify-end mb-4">
                        {Array(currentTestimonial.stars || 5).fill(0).map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-yellow-400 ml-1" />
                        ))}
                        </div>
                        
                        <p className="text-xl md:text-2xl font-medium text-gray-800 italic">
                        "{currentTestimonial.quote}"
                        </p>
                        
                        <div className="mt-6">
                        <h4 className="text-xl font-bold text-blue-600">{currentTestimonial.name}</h4>
                        <p className="text-gray-500">{currentTestimonial.location || "عميل مميز"}</p>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                
                {/* أزرار التنقل (إضافية - إذا أردت استخدامها لاحقاً) */}
                 <div className="absolute bottom-6 left-6 flex gap-2 z-20 lg:hidden"> {/* تظهر فقط في الموبايل هنا إذا أردت */}
                    <motion.button 
                    onClick={prevTestimonial}
                    className="bg-background p-2 rounded-full shadow-md hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                    <ChevronRight size={20} className="text-foreground" />
                    </motion.button>
                    <motion.button 
                    onClick={nextTestimonial}
                    className="bg-background p-2 rounded-full shadow-md hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                    <ChevronLeft size={20} className="text-foreground" />
                    </motion.button>
                </div>

            </div>

            {/* --- شريط العملاء (للموبايل فقط) --- */}
            <motion.div 
                className="lg:hidden flex gap-4 overflow-x-auto p-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                {testimonialsData.map((testimonial, index) => (
                <button
                    key={testimonial._id || index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${currentIndex === index 
                        ? 'bg-blue-50 shadow-md' 
                        : 'bg-background shadow-sm'
                    }`}
                >
                    {/* --- التعديل هنا: صورة العميل أو الحرف الأول (للموبايل) --- */}
                    {testimonial.img ? (
                        <img 
                            src={testimonial.img} 
                            alt={testimonial.name} 
                            className="w-10 h-10 rounded-full object-cover border border-primary/20" 
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-base border border-primary/20">
                            {testimonial.name.charAt(0)}
                        </div>
                    )}
                    {/* --- نهاية التعديل --- */}
                    
                    <div>
                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                    </div>
                </button>
                ))}
            </motion.div>

            </div>
        ) : (
            <div className="text-center text-background/80 py-10">
                لا توجد آراء متاحة حالياً.
            </div>
        )}
      </div>
    </motion.section>
  );
}