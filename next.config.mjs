/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // السماح بالنطاقات الخارجية
    domains: ['images.unsplash.com', "images.pexels.com", "res.cloudinary.com", "youtube.com"],
    // تفعيل التنسيقات الحديثة (WebP و AVIF)
    formats: ['image/avif', 'image/webp'],
    // تقليل جودة الصور قليلاً لتقليل الحجم (لا يؤثر على الرؤية)
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
