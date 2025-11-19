/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // السماح بالنطاقات الخارجية
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    // تفعيل التنسيقات الحديثة (WebP و AVIF)
    formats: ['image/avif', 'image/webp'],
    // تقليل جودة الصور قليلاً لتقليل الحجم (لا يؤثر على الرؤية)
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
