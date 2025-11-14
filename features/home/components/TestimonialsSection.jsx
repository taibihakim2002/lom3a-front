'use client';


import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion'; 


import { 
  Quote, Star,  
} from 'lucide-react'; 



export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonialsData = [
    {
      name: "أحمد العبدالله",
      location: "عمّان - دابوق",
      stars: 5,
      quote: "فريق عمل محترف ودقيق جداً في المواعيد. خدمة التنظيف العميق كانت فوق الممتاز، المنزل عاد وكأنه جديد!",
      img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400" // (صورة وهمية)
    },
    {
      name: "سارة محمود",
      location: "عمّان - الصويفية",
      stars: 5,
      quote: "أفضل خدمة تنظيف كنب جربتها في الأردن. تمكنوا من إزالة بقعة قهوة قديمة كنت قد يأست منها. شكراً لمعة البيت.",
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" // (صورة وهمية)
    },
    {
      name: "شركة البوتاس العربية",
      location: "مكاتب - الشميساني",
      stars: 5,
      quote: "نعتمد على لمعة البيت في التنظيف الدوري لمكاتبنا. دائماً عند حسن الظن، احترافية، وأمانة عالية.",
      img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400" // (صورة وهمية)
    }
  ];

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <motion.section 
      // (تم تغيير الخلفية إلى "bg-background" وحذف الموجات)
      className="relative py-24 bg-primary" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ----- 1. عنوان القسم ----- */}
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

        {/* ----- 2. التصميم الجديد (عمودين) ----- */}
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
                key={testimonial.name}
                onClick={() => setCurrentIndex(index)}
                className={`flex items-center gap-4 w-full text-right p-4 rounded-xl transition-all duration-300
                  ${currentIndex === index 
                    ? 'bg-blue-50 shadow-lg scale-105' // (التصميم النشط)
                    : 'bg-background hover:bg-secondary' // (التصميم العادي)
                  }`}
              >
                <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </button>
            ))}
          </motion.div>

          {/* --- العمود الأيسر: عرض الاقتباس --- */}
          <div className="relative lg:col-span-2 bg-secondary p-8 md:p-12 rounded-2xl shadow-lg min-h-[300px] text-right">
            <Quote size={48} className="absolute top-6 left-6 text-blue-200 opacity-70" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex} // (أساسي للحركة)
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* التقييم (النجوم) */}
                <div className="flex justify-end mb-4">
                  {Array(currentTestimonial.stars).fill(0).map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400 ml-1" />
                  ))}
                </div>
                
                {/* الاقتباس */}
                <p className="text-xl md:text-2xl font-medium text-gray-800 italic">
                  "{currentTestimonial.quote}"
                </p>
                
                {/* اسم العميل والموقع */}
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-blue-600">{currentTestimonial.name}</h4>
                  <p className="text-gray-500">{currentTestimonial.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
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
                key={testimonial.name}
                onClick={() => setCurrentIndex(index)}
                // (flex-shrink-0 مهم للسكرول الأفقي)
                className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                  ${currentIndex === index 
                    ? 'bg-blue-50 shadow-md' 
                    : 'bg-background shadow-sm'
                  }`}
              >
                <img src={testimonial.img} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                </div>
              </button>
            ))}
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}