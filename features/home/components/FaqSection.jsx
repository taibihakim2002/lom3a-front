'use client';

// 1. استيراد المكونات الخفيفة من framer-motion
import { m, LazyMotion, domAnimation } from 'framer-motion'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSection() {

  const faqData = [
    {
      question: "كم يستغرق تنظيف المنزل بالكامل؟",
      answer: "يعتمد الوقت على حجم المنزل وحالته. التنظيف العميق لشقة متوسطة (3 غرف نوم) يستغرق عادة من 4 إلى 6 ساعات مع فريقنا."
    },
    {
      question: "هل أحتاج لتوفير مواد التنظيف؟",
      answer: "لا، نحن في \"لمعة البيت\" نأتي مجهزين بالكامل بجميع مواد التنظيف والمعدات الاحترافية اللازمة لضمان أفضل نتيجة."
    },
    {
      question: "هل أنتم مؤمنون ضد الأضرار؟",
      answer: "نعم بالطبع. جميع موظفينا مؤمنون، ونتحمل كامل المسؤولية عن أي ضرر قد يحدث (لا قدر الله) أثناء عملية التنظيف."
    },
    {
      question: "ما هي المدن التي تغطونها في الأردن؟",
      answer: "نحن نغطي حالياً جميع مناطق عمّان الكبرى، بالإضافة إلى الزرقاء، السلط، وإربد. نعمل على التوسع قريباً."
    }
  ];

  return (
    // 2. تغليف القسم بـ LazyMotion
    <LazyMotion features={domAnimation}>
      {/* 3. استبدال motion.section بـ m.section */}
      <m.section 
        className="relative py-24 bg-secondary" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        id='faq'
      >

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          
          {/* ----- 1. عنوان القسم ----- */}
          {/* 4. استبدال motion.div بـ m.div */}
          <m.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-lg font-semibold text-blue-600">هل لديك استفسار؟</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-2">
              الأسئلة الشائعة
            </h2>
          </m.div>

          {/* ----- 2. الأكورديون ----- */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-background rounded-xl shadow-md overflow-hidden border-b-0"
                  >
                    <AccordionTrigger 
                      className="w-full text-right p-6 text-lg font-bold text-gray-800 hover:no-underline hover:bg-secondary rounded-t-xl"
                    >
                      <span className="flex-1 text-right">{faq.question}</span>
                    </AccordionTrigger>
                    
                    <AccordionContent className="p-6 pt-0 text-right text-base text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </m.div>
              ))}
            </Accordion>
          </div>
        </div>

      </m.section>
    </LazyMotion>
  );
}