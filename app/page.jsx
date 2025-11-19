
import Header from '@/components/layout/public/Header';
import HeroSection from '@/features/home/components/HeroSection';
import AboutSection from '@/features/home/components/AboutSection';
import WhyChooseUsSection from '@/features/home/components/WhyChooseUsSection';
import ServicesSection from '@/features/home/components/ServicesSection';

import HowItWorksSection from '@/features/home/components/HowItWorksSection';
import TestimonialsSection from '@/features/home/components/TestimonialsSection';
import FaqSection from '@/features/home/components/FaqSection';
import BookingSection from '@/features/home/components/BookingSection';
import Footer from '@/components/layout/public/Footer';
import GallerySection from '@/features/home/components/GallerySection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main >
        <HeroSection />
        <AboutSection />
        <WhyChooseUsSection /> 
        {/* <ServicesSection /> */}
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