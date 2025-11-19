import dynamic from 'next/dynamic'; // 1. استيراد dynamic

// المكونات التي تظهر في الشاشة الأولى (Above the fold) تبقى كما هي (استيراد مباشر)
import Header from '@/components/layout/public/Header';
import HeroSection from '@/features/home/components/HeroSection';

// 2. باقي المكونات يتم تحميلها عند الحاجة (Lazy Loading)
const AboutSection = dynamic(() => import('@/features/home/components/AboutSection'));
const WhyChooseUsSection = dynamic(() => import('@/features/home/components/WhyChooseUsSection'));
const ServicesSection = dynamic(() => import('@/features/home/components/ServicesSection'));
const GallerySection = dynamic(() => import('@/features/home/components/GallerySection'));
const HowItWorksSection = dynamic(() => import('@/features/home/components/HowItWorksSection'));
const TestimonialsSection = dynamic(() => import('@/features/home/components/TestimonialsSection'));
const FaqSection = dynamic(() => import('@/features/home/components/FaqSection'));
const BookingSection = dynamic(() => import('@/features/home/components/BookingSection'));
const Footer = dynamic(() => import('@/components/layout/public/Footer'));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* يتم تحميله فوراً لأهميته لمحركات البحث وتجربة المستخدم */}
        <HeroSection /> 
        
        {/* سيتم تحميل هذه الأجزاء بشكل منفصل مما يسرع فتح الصفحة */}
        <AboutSection />
        <WhyChooseUsSection /> 
        <ServicesSection />
        <GallerySection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <BookingSection />
        <Footer/>
      </main>
    </>
  );
}