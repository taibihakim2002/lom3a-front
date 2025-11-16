'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  GalleryHorizontal, 
  Star, 
  ArrowLeft,
  Package, // (أيقونة جديدة)
  Eye // (أيقونة جديدة)
} from 'lucide-react';

// (بيانات وهمية للبطاقات)
const statsCards = [
  {
    title: "طلبات الحجز الجديدة",
    value: "5",
    description: "طلبات تنتظر التأكيد",
    icon: <ClipboardList className="h-6 w-6 text-primary-foreground/80" />,
    href: "/admin/bookings",
    // --التعديل هنا-- (إضافة لون مميز لكل بطاقة)
    bgColor: "bg-primary",
    textColor: "text-primary-foreground"
  },
  {
    title: "صور المعرض",
    value: "12",
    description: "صورة معروضة في الموقع",
    icon: <GalleryHorizontal className="h-6 w-6 text-success-foreground/80" />,
    href: "/admin/gallery",
    // --التعديل هنا--
    bgColor: "bg-success",
    textColor: "text-success-foreground"
  },
  {
    title: "آراء العملاء",
    value: "8",
    description: "آراء موافق عليها",
    icon: <Star className="h-6 w-6 text-accent-foreground/80" />,
    href: "/admin/testimonials",
    // --التعديل هنا--
    bgColor: "bg-accent", // (استخدام 'accent' للبطاقة الثالثة)
    textColor: "text-accent-foreground"
  }
];

// (بيانات وهمية للجدول الجديد)
const recentBookings = [
  { id: 1, name: "أحمد العبدالله", service: "التنظيف العميق", date: "2025-11-18", status: "جديد" },
  { id: 2, name: "سارة محمود", service: "تنظيف الكنب", date: "2025-11-19", status: "مؤكد" },
  { id: 3, name: "عمر خليل", service: "ما بعد البناء", date: "2025-11-20", status: "مكتمل" },
  { id: 4, name: "ليلى حسن", service: "تنظيف دوري", date: "2025-11-21", status: "جديد" },
  { id: 5, name: "محمد علي", service: "تنظيف سجاد", date: "2025-11-22", status: "جديد" },
];

// (متغيرات الحركة للظهور المتتابع)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function AdminDashboardPage() {
  
  return (
    <div className="space-y-8">
      
      {/* ----- 1. عنوان الصفحة ----- */}
      <motion.div 
        className="text-right"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --التعديل هنا-- (عنوان ترحيبي أفضل) */}
        <h1 className="text-3xl font-bold text-foreground">أهلاً بعودتك!</h1>
        <p className="text-muted-foreground">إليك ملخص نشاط الموقع اليوم.</p>
      </motion.div>

      {/* ----- 2. شبكة البطاقات (Stats Grid) - (تم تحسين التصميم) ----- */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            {/* --التعديل هنا-- (استخدام ألوان البطاقات الجديدة) */}
            <Card className={`shadow-md border-none transition-transform duration-300 hover:-translate-y-1 ${card.bgColor} ${card.textColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-right">
                <CardTitle className={`text-sm font-medium ${card.textColor}/80`}>
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="text-right">
                <div className="text-4xl font-bold">{card.value}</div>
                <p className={`text-xs ${card.textColor}/70`}>{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ----- 3. *** القسم الجمالي الجديد: آخر الطلبات *** ----- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 text-right">
            <div>
              <CardTitle>آخر الطلبات الواردة</CardTitle>
              <CardDescription>
                آخر 5 طلبات تم تسجيلها.
              </CardDescription>
            </div>
            <div className="bg-accent p-3 rounded-md">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">الخدمة</TableHead>
                  <TableHead className="hidden md:table-cell text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">عرض</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-right">{booking.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">{booking.service}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{booking.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={booking.status === "جديد" ? "destructive" : "default"}
                        // (استخدام ألوان مميزة للحالة)
                        className={
                          booking.status === "جديد" ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === "مؤكد" ? 'bg-primary/20 text-primary' : 'bg-secondary'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-start">
            <Button asChild variant="link" size="sm" className="p-0 text-primary">
              <Link href="/admin/bookings">
                عرض كل الطلبات
                <ArrowLeft size={16} className="mr-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

    </div>
  );
}