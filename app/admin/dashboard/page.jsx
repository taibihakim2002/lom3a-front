'use client';

import { useState } from 'react'; // (إضافة useState)
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
  Package, 
  Eye,
  Loader2 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statsApi } from '@/features/stats/api';
import { bookingsApi } from '@/features/bookings/api'; // (نحتاج هذا لتنفيذ العمليات)
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
// --- التعديل هنا: استيراد مودال التفاصيل ---
import BookingDetailsDialog from '@/features/bookings/components/BookingDetailsDialog';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // --- التعديل هنا: حالات التحكم بالمودال ---
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. جلب الإحصائيات
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboardStats,
    refetchInterval: 60000, 
  });

  const stats = data?.data?.data || {};
  const recentBookings = stats.recentBookings || [];

  // --- التعديل هنا: إضافة Mutations للتحكم في الطلبات من الصفحة الرئيسية ---
  
  // أ) تحديث الحالة
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingsApi.updateStatus({ id, status }),
    onSuccess: (_, variables) => {
      // (تحديث بيانات الداشبورد لتعكس التغيير في الأرقام والجدول)
      queryClient.invalidateQueries(['dashboardStats']); 
      queryClient.invalidateQueries(['bookings']); // (تحديث صفحة الحجوزات أيضاً)
      
      const msg = variables.status === 'confirmed' ? "تم تأكيد الحجز." : "تم إلغاء الحجز.";
      toast.success(msg);
      setIsDialogOpen(false);
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث."),
  });

  // ب) حذف الحجز
  const deleteMutation = useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['bookings']);
      toast.success("تم حذف الحجز.");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف."),
  });

  // متغير للتحميل
  const isProcessing = updateStatusMutation.isPending || deleteMutation.isPending;

  // --- دوال التحكم (Handlers) ---
  const handleConfirm = (id) => updateStatusMutation.mutate({ id, status: 'confirmed' });
  
  const handleCancel = (id) => {
    if(confirm('هل أنت متأكد من رفض/إلغاء هذا الطلب؟')) {
        updateStatusMutation.mutate({ id, status: 'cancelled' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('تحذير: سيتم حذف هذا الطلب نهائياً. هل أنت متأكد؟')) {
        deleteMutation.mutate(id);
    }
  };

  // عند النقر على صف في الجدول
  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };
  // -----------------------------------------------------------------------

  // (إعداد بيانات البطاقات)
  const statsCards = [
    {
      title: "طلبات الحجز الجديدة",
      value: isLoading ? "..." : stats.newBookingsCount || 0,
      description: "طلبات تنتظر التأكيد",
      icon: <ClipboardList className="h-6 w-6 text-primary-foreground/80" />,
      href: "/admin/dashboard/bookings",
      bgColor: "bg-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "صور المعرض",
      value: isLoading ? "..." : stats.galleryCount || 0,
      description: "صورة معروضة في الموقع",
      icon: <GalleryHorizontal className="h-6 w-6 text-success-foreground/80" />,
      href: "/admin/dashboard/gallery",
      bgColor: "bg-success",
      textColor: "text-success-foreground"
    },
    {
      title: "آراء العملاء",
      value: isLoading ? "..." : stats.testimonialsCount || 0,
      description: "آراء موافق عليها",
      icon: <Star className="h-6 w-6 text-accent-foreground/80" />,
      href: "/admin/dashboard/testimonials",
      bgColor: "bg-accent", 
      textColor: "text-accent-foreground"
    }
  ];

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'جديد';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'confirmed': return 'bg-primary/20 text-primary hover:bg-primary/20';
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled': return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
      default: return 'bg-secondary';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isError) return <div className="text-center text-red-500 p-10">فشل تحميل البيانات.</div>;

  return (
    <div className="space-y-8">
      
      {/* ----- 1. عنوان الصفحة ----- */}
      <motion.div 
        className="text-right"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
            أهلاً، {user?.name || "المسؤول"}! 👋
        </h1>
        <p className="text-muted-foreground">إليك ملخص نشاط الموقع اليوم.</p>
      </motion.div>

      {/* ----- 2. شبكة البطاقات ----- */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card className={`shadow-md border-none transition-transform duration-300 hover:-translate-y-1 ${card.bgColor} ${card.textColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-right">
                <CardTitle className={`text-sm font-medium ${card.textColor}/80`}>
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="text-right">
                <div className="text-4xl font-bold">
                    {card.value}
                </div>
                <p className={`text-xs ${card.textColor}/70`}>{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ----- 3. آخر الطلبات ----- */}
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
            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
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
                {recentBookings.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">لا توجد طلبات حديثة.</TableCell></TableRow>
                )}
                {recentBookings.map((booking) => (
                  <TableRow 
                    key={booking._id || booking.id}
                    // --- التعديل هنا: جعل الصف قابلاً للنقر ---
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleRowClick(booking)}
                  >
                    <TableCell className="font-medium text-right">{booking.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">{booking.service}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{booking.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {/* (زر "عين" لفتح التفاصيل أيضاً) */}
                      <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation(); // منع تكرار النقر
                          handleRowClick(booking);
                      }}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
          <CardFooter className="justify-start">
            <Button asChild variant="link" size="sm" className="p-0 text-primary">
              <Link href="/admin/dashboard/bookings">
                عرض كل الطلبات
                <ArrowLeft size={16} className="mr-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* --- التعديل هنا: استدعاء المودال (نفس المستخدم في صفحة الحجوزات) --- */}
      <BookingDetailsDialog 
        booking={selectedBooking} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isProcessing={isProcessing}
      />

    </div>
  );
}