import Header from '@/components/layout/public/Header';
import HeroSection from '@/features/home/components/HeroSection'; // اترك هذا كما هو ليتحمل بسرعة
import Footer from '@/components/layout/public/Footer';
import dynamic from 'next/dynamic';

// تحميل باقي الأقسام عند الحاجة فقط
const AboutSection = dynamic(() => import('@/features/home/components/AboutSection'));
const WhyChooseUsSection = dynamic(() => import('@/features/home/components/WhyChooseUsSection'));
const ServicesSection = dynamic(() => import('@/features/home/components/ServicesSection'));
const GallerySection = dynamic(() => import('@/features/home/components/GallerySection'));
const HowItWorksSection = dynamic(() => import('@/features/home/components/HowItWorksSection'));
const TestimonialsSection = dynamic(() => import('@/features/home/components/TestimonialsSection'));
const FaqSection = dynamic(() => import('@/features/home/components/FaqSection'));
const BookingSection = dynamic(() => import('@/features/home/components/BookingSection'));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* يتم تحميل هذا القسم فوراً */}
        <HeroSection />
        
        {/* باقي الأقسام ستتحمل بشكل منفصل مما يقلل حجم الجافا سكريبت الأولي */}
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