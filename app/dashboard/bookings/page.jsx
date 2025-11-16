'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
// --- (تأكد من وجود هذه الأيقونات في ملف layout.jsx) ---
import { MoreHorizontal, CheckCircle, Trash2, Clock, MapPin, MessageSquare } from 'lucide-react';

// (بيانات وهمية للعرض - تم إضافة الحقول الجديدة)
const bookings = [
  { 
    id: 1, 
    name: "أحمد العبدالله", 
    phone: "0795551234", 
    service: "التنظيف العميق", 
    date: "2025-11-18", 
    time: "9:00 صباحاً - 12:00 ظهراً", 
    address: "عمّان، دابوق، شارع...",
    notes: "الرجاء إحضار مواد تنظيف للأرضيات الخشبية.",
    status: "جديد" 
  },
  { 
    id: 2, 
    name: "سارة محمود", 
    phone: "0785554321", 
    service: "تنظيف الكنب", 
    date: "2025-11-19", 
    time: "3:00 مساءً - 6:00 مساءً",
    address: "الصويفية، شارع الوكالات",
    notes: "",
    status: "مؤكد" 
  },
  { 
    id: 3, 
    name: "عمر خليل", 
    phone: "0775556789", 
    service: "تنظيف ما بعد البناء", 
    date: "2025-11-20", 
    time: "12:00 ظهراً - 3:00 مساءً",
    address: "الرابية، قرب السفارة...",
    notes: "التركيز على إزالة بقع الدهان.",
    status: "مكتمل" 
  },
];

export default function BookingsPage() {

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {/* ----- 1. عنوان الصفحة ----- */}
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">طلبات الحجز</h1>
          <p className="text-muted-foreground">إدارة وتأكيد طلبات الحجز الواردة.</p>
        </div>
      </div>

      {/* ----- 2. جدول الطلبات ----- */}
      <Card className="shadow-md">
        <CardHeader className="text-right">
          <CardTitle>جميع الطلبات ({bookings.length})</CardTitle>
          <CardDescription>
            آخر الطلبات الواردة من نموذج الحجز في الموقع.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* --- التعديل هنا: تم إصلاح هيكل الجدول --- */}
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[20%]">العميل</TableHead>
                <TableHead className="text-right w-[20%]">الخدمة</TableHead>
                <TableHead className="text-right w-[25%] hidden md:table-cell">الموعد</TableHead>
                <TableHead className="text-right w-[25%] hidden lg:table-cell">العنوان والملاحظات</TableHead>
                <TableHead className="text-right w-[10%]">الحالة</TableHead>
                <TableHead className="text-center w-[5%]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  {/* العميل (الاسم والهاتف) */}
                  <TableCell className="font-medium text-right">
                    <div className="font-bold">{booking.name}</div>
                    <div className="text-xs text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  
                  {/* الخدمة */}
                  <TableCell className="text-right">{booking.service}</TableCell>
                  
                  {/* الموعد (التاريخ والوقت) */}
                  <TableCell className="hidden md:table-cell text-right text-sm">
                    <div>{booking.date}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-start gap-1 mt-1">
                      <span>{booking.time}</span>
                      <Clock size={12} />
                    </div>
                  </TableCell>

                  {/* العنوان والملاحظات */}
                  <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                    <div className="flex items-center justify-start gap-1">
                      <span>{booking.address}</span>
                      <MapPin size={12} />
                    </div>
                    {booking.notes && (
                      <div className="flex items-center justify-start gap-1 mt-1 text-xs text-amber-600">
                        <span>{booking.notes}</span>
                        <MessageSquare size={12} />
                      </div>
                    )}
                  </TableCell>
                  
                  {/* الحالة */}
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        booking.status === "جديد" ? "destructive" : 
                        booking.status === "مؤكد" ? "default" : "secondary"
                      }
                      // (استخدام متغيرات الألوان)
                      className={
                        booking.status === "جديد" ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === "مؤكد" ? 'bg-primary/20 text-primary' : ''
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>

                  {/* إجراءات */}
                  <TableCell className="text-center">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <CheckCircle className="ml-2 h-4 w-4" />
                          تأكيد الطلب
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف الطلب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}