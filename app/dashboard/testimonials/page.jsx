'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trash2, Star, PlusCircle, MoreHorizontal, Edit, XCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // (مطلوب للفورم)
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// (بيانات وهمية للعرض)
const testimonials = [
  { id: 1, name: "أحمد العبدالله", quote: "فريق عمل محترف ودقيق جداً...", stars: 5, status: "موافق عليه" },
  { id: 2, name: "سارة محمود", quote: "أفضل خدمة تنظيف كنب جربتها...", stars: 5, status: "موافق عليه" },
  { id: 3, name: "خالد", quote: "خدمة جيدة ولكن تأخروا قليلاً.", stars: 4, status: "بانتظار المراجعة" },
];

export default function TestimonialsPage() {

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
      {/* ----- 1. عنوان الصفحة وزر الإضافة ----- */}
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة آراء العملاء</h1>
          <p className="text-muted-foreground">الموافقة على الآراء الجديدة أو حذفها.</p>
        </div>
        
        {/* --- التعديل هنا: إضافة زر Dialog --- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <PlusCircle size={18} />
              إضافة رأي يدوي
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>إضافة رأي جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات العميل ورأيه يدوياً.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4 text-right">
              <div className="space-y-2">
                <Label htmlFor="name">اسم العميل</Label>
                <Input id="name" placeholder="مثال: أحمد العبدالله" className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">الموقع (اختياري)</Label>
                <Input id="location" placeholder="مثال: عمّان - دابوق" className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stars">التقييم (من 1 إلى 5)</Label>
                <Input id="stars" type="number" min="1" max="5" placeholder="5" className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">الاقتباس (الرأي)</Label>
                <Textarea id="quote" placeholder="اكتب رأي العميل هنا..." className="text-right" />
              </div>
              {/* (يمكن إضافة Switch هنا للتحكم بالحالة مباشرة) */}
            </form>
            <DialogFooter className="flex-row justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">إلغاء</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* --- نهاية التعديل --- */}

      </div>

      {/* ----- 2. جدول الآراء (تم تحسينه) ----- */}
      <Card className="shadow-md">
        <CardHeader className="text-right">
          <CardTitle>جميع الآراء ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right w-[40%]">الاقتباس</TableHead>
                <TableHead className="text-center">التقييم</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-right">{item.name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.quote}</TableCell>
                  
                  {/* --- التعديل هنا: استخدام Badge للتقييم --- */}
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Star size={14} className="fill-yellow-500 ml-1" />
                      {item.stars}
                    </Badge>
                  </TableCell>
                  
                  {/* --- التعديل هنا: استخدام Badge للحالة بدلاً من Switch --- */}
                  <TableCell className="text-center">
                    <Badge 
                      className={
                        item.status === "موافق عليه" 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  
                  {/* --- التعديل هنا: إضافة Dropdown للإجراءات --- */}
                  <TableCell className="text-center">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.status !== "موافق عليه" && (
                          <DropdownMenuItem>
                            <CheckCircle className="ml-2 h-4 w-4 text-success" />
                            موافقة ونشر
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        {item.status === "موافق عليه" && (
                           <DropdownMenuItem>
                            <XCircle className="ml-2 h-4 w-4" />
                            إلغاء الموافقة
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {/* --- نهاية التعديل --- */}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}