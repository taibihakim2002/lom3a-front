'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // (تم حذف CardFooter)
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { useState } from 'react';

// (بيانات وهمية للعرض)
const galleryItems = [
    {
      img: "https://images.pexels.com/photos/2819088/pexels-photo-2819088.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "مطبخ لامع - عبدون",
      category: "مطابخ وحمامات"
    },
    {
      img: "https://images.pexels.com/photos/6585613/pexels-photo-6585613.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "تنظيف كنب - الصويفية",
      category: "كنب ومفروشات"
    },
    {
      img: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "تنظيف ما بعد البناء - الرابية",
      category: "تنظيف منازل"
    },
];

export default function GalleryPage() {
  const [images, setImages] = useState(galleryItems);
  const [fileName, setFileName] = useState('');

  const filters = ['تنظيف منازل', 'كنب ومفروشات', 'مطابخ وحمامات'];

  // (متغيرات الحركة للظهور المتتابع)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ----- 1. عنوان الصفحة وزر الإضافة ----- */}
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المعرض</h1>
          <p className="text-muted-foreground">إضافة أو حذف الصور من معرض الأعمال.</p>
        </div>
        
        {/* --- زر إضافة صورة جديدة (يفتح Dialog) --- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <PlusCircle size={18} />
              إضافة صورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>إضافة صورة جديدة للمعرض</DialogTitle>
              <DialogDescription>
                اختر الصورة، وأدخل وصفها والفئة التي تنتمي إليها.
              </DialogDescription>
            </DialogHeader>
            
            <form className="grid gap-4 py-4 text-right">
              <div className="space-y-2">
                <Label htmlFor="imgFile">اختر الصورة</Label>
                <Label 
                  htmlFor="imgFile" 
                  className="flex h-32 w-full cursor-pointer items-center justify-center 
                             rounded-lg border-2 border-dashed border-border 
                             bg-secondary hover:bg-accent transition-colors"
                >
                  {fileName ? (
                    <span className="text-sm font-medium text-foreground">{fileName}</span>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload size={32} />
                      <span className="text-sm">انقر للرفع</span>
                    </div>
                  )}
                </Label>
                <Input 
                  id="imgFile" 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setFileName(e.target.files[0]?.name || '')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">العنوان (الوصف)</Label>
                <Input id="title" placeholder="مثال: تنظيف فيلا - دابوق" className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select dir="rtl">
                  <SelectTrigger id="category" className="w-full text-right">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="flex-row justify-start pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">إلغاء</Button>
                </DialogClose>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">إضافة</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ----- 2. شبكة الصور الحالية (تم تعديل تصميم البطاقة) ----- */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((image) => (
          <motion.div key={image.img} variants={itemVariants}>
            
            {/* --- التعديل هنا: تصميم البطاقة الجديد --- */}
            <Card className="relative h-80 rounded-2xl shadow-lg overflow-hidden group border-0">
              <CardContent className="p-0">
                {/* 1. الصورة (في الخلفية مع تأثير زووم) */}
                <img
                  src={image.img}
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out 
                             group-hover:scale-110" 
                />
                
                {/* 2. التدرج اللوني (لضمان وضوح النص) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* 3. زر الحذف (يظهر عند المرور) */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="destructive" size="icon" className="h-9 w-9">
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* 4. المحتوى النصي (يطفو فوق التدرج) */}
                <div className="relative h-full flex flex-col justify-end p-5 text-right text-white 
                                transition-transform duration-300 ease-in-out 
                                group-hover:-translate-y-2"> {/* (يرتفع النص قليلاً) */}
                  
                  <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                  <p className="text-sm text-gray-200">{image.category}</p>
                </div>
              </CardContent>
            </Card>
            {/* --- نهاية التعديل --- */}

          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}