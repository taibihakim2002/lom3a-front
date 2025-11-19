'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion'; 
import { Search, X, Loader2 } from 'lucide-react'; // (تمت إضافة Loader2)
import { Card, CardContent } from '@/components/ui/card';

// --- إضافات للربط بالباكاند ---
import { useQuery } from '@tanstack/react-query';
import { galleryApi } from '@/features/gallery/api';
// ------------------------------

export default function GallerySection() {
  
  const [filter, setFilter] = useState('الكل');
  const [selectedImage, setSelectedImage] = useState(null);

  // 1. جلب البيانات من الـ API بدلاً من المصفوفة الثابتة
  const { data, isLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: galleryApi.getAll,
    staleTime: 1000 * 60 * 5, // كاش لمدة 5 دقائق
  });

  // استخراج الصور (أو مصفوفة فارغة في حالة التحميل/الخطأ)
  const galleryImages = data?.data?.data?.images || [];

  const filters = ['الكل', 'تنظيف منازل', 'كنب ومفروشات', 'مطابخ وحمامات'];

  // فلترة الصور بناءً على الحالة
  const filteredImages = filter === 'الكل' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === filter);

  return (
    <motion.section 
      className="relative pt-16 pb-36 bg-secondary" // يكمل على نفس الخلفية الرمادية
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7 }}
      id="gallery"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ----- 1. عنوان القسم ----- */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12" // (تقليل المسافة السفلية)
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-lg font-semibold text-blue-600">معرض أعمالنا</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-2">
            شاهد بنفسك جودة عملنا
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            صور حقيقية من مشاريع قمنا بتنفيذها. نترك عملنا يتحدث عنّا.
          </p>
        </motion.div>

        {/* ----- 2. أزرار الفلترة ----- */}
        <motion.div 
          className="flex justify-center flex-wrap gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map((item) => (
            <Button
              key={item}
              variant={filter === item ? "default" : "outline"}
              className={`rounded-full transition-colors duration-300 
                ${filter === item 
                  ? 'bg-primary text-background' 
                  : 'bg-background text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </motion.div>

        {/* ----- 3. شبكة الصور ----- */}
        {/* عرض مؤشر تحميل أثناء جلب البيانات */}
        {isLoading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredImages.length > 0 ? (
                    filteredImages.map((image) => (
                    <motion.div
                        key={image._id || image.id} // استخدام الـ ID من قاعدة البيانات
                        layoutId={image._id || image.id} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Card 
                        className="relative h-80 rounded-lg shadow-lg overflow-hidden group cursor-pointer border-0"
                        onClick={() => setSelectedImage(image)}
                        >
                        <CardContent className="p-0">
                            <img
                            src={image.img}
                            alt={image.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                        flex flex-col items-center justify-center transition-opacity duration-300">
                            <div className="text-white text-center p-4">
                                <Search size={32} />
                                <p className="text-lg font-bold mt-2">{image.title}</p>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        لا توجد صور متاحة في هذا القسم حالياً.
                    </div>
                )}
              </AnimatePresence>
            </motion.div>
        )}

      </div>

      {/* ----- 4. الـ Lightbox (شاشة العرض الكامل) ----- */}
      <AnimatePresence>
        {selectedImage && (
          <>
            {/* الخلفية المعتمة */}
            <motion.div
              className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            />
            
            {/* حاوية الصورة المتحركة */}
            <motion.div
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
              layoutId={selectedImage._id || selectedImage.id}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <img
                src={selectedImage.img}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* زر الإغلاق */}
            <motion.button
              className="fixed top-6 right-6 z-[80] text-background bg-black/30 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <X size={24} />
            </motion.button>
          </>
        )}
      </AnimatePresence>


      {/* *** فاصل الموجة السفلي (للرجوع للأبيض) *** */}
      <div className="absolute bottom-0 left-0 w-full h-[50px] sm:h-[150px] md:h-[100px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          {/* اللون #ffffff للرجوع للخلفية البيضاء (للفوتر مثلاً) */}
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

    </motion.section>
  );
}