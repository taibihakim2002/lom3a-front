'use client';

import { motion } from 'framer-motion'; 

// *** تمت الإضافة: أيقونات جديدة للأقسام الجديدة ***
import { Users, Sparkles, CheckSquare,} from 'lucide-react'; 



export default function AboutSection() {
  const aboutImageUrl = "https://images.pexels.com/photos/7217988/pexels-photo-7217988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"; // صورة لفريق عمل يبتسم

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
    // استخدام "motion.section" مع "whileInView" لتفعيل الحركة عند السكرول
    <motion.section 
      className="py-16 bg-background"
      initial={{ opacity: 0, y: 50 }} // يبدأ شفافاً ومزاحاً للأسفل
      whileInView={{ opacity: 1, y: 0 }} // يظهر ويصعد لمكانه
      viewport={{ once: true, amount: 0.3 }} // تفعيل الحركة مرة واحدة عند رؤية 30% من القسم
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-6">
        {/* ----- العمود الأيمن: الصورة (تم تعديله هنا) ----- */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md md:max-w-lg h-[350px] md:h-[450px] overflow-hidden 
                          rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl shadow-2xl"> {/* *** تم تعديل الـ className هنا *** */}
            <img
              src={aboutImageUrl}
              alt="فريق شركة لمعة البيت"
              className="object-cover w-full h-full"
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
          
          {/* ----- ميزات الشركة (الإحصائيات السريعة) ----- */}
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
    </motion.section>
  );
}