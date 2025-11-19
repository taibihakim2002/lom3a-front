'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Upload, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from '@/features/gallery/api'; 
import { toast } from 'sonner';

export default function GalleryPage() {
  const queryClient = useQueryClient();
  
  // حالات الفورم
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- حالة الحذف ---
  const [deleteId, setDeleteId] = useState(null); 
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); 

  // 1. جلب الصور
  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
  });

  const images = data?.data?.data?.images || [];

  // 2. دالة الرفع
  const createMutation = useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      toast.success("تم إضافة الصورة بنجاح.");
      setIsDialogOpen(false);
      setFile(null);
      setFileName('');
      setTitle('');
      setCategory('');
    },
    onError: (error) => {
      console.error(error);
      toast.error("فشل إضافة الصورة.");
    },
  });

  // 3. دالة الحذف
  const deleteMutation = useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      toast.success("تم حذف الصورة بنجاح.");
      setIsDeleteOpen(false);
      setDeleteId(null);
    },
    onError: () => toast.error("فشل حذف الصورة."),
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || !category) {
        toast.error("يرجى تعبئة جميع الحقول واختيار صورة");
        return;
    }

    const formData = new FormData();
    formData.append("img", file);
    formData.append("title", title);
    formData.append("category", category);

    createMutation.mutate(formData);
  };

  // التعامل مع طلب الحذف
  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // --- (مهم جداً: منع انتشار الحدث للبطاقة) ---
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const filters = ['تنظيف منازل', 'كنب ومفروشات', 'مطابخ وحمامات'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ----- 1. عنوان الصفحة وزر الإضافة ----- */}
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المعرض</h1>
          <p className="text-muted-foreground">إضافة أو حذف الصور من معرض الأعمال.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            
            <form onSubmit={handleSubmit} className="grid gap-4 py-4 text-right">
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
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">العنوان (الوصف)</Label>
                <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تنظيف فيلا - دابوق" 
                    className="text-right" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select dir="rtl" onValueChange={setCategory} value={category}>
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
                <Button 
                    type="submit" 
                    disabled={createMutation.isPending} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {createMutation.isPending ? "جارِ الرفع..." : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ----- 2. شبكة الصور ----- */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {images.map((image) => (
          <motion.div key={image._id || image.id} variants={itemVariants}>
            
            {/* --- تصميم البطاقة --- */}
            <Card className="relative h-80 rounded-2xl shadow-lg overflow-hidden group border-0 transform transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0 h-full">
                
                {/* 1. الصورة */}
                <img
                  src={image.img}
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out 
                             group-hover:scale-110" 
                />
                
                {/* 2. التدرج */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* 3. زر الحذف (تم الإصلاح) */}
                {/* تم إضافة "z-20" لضمان ظهوره فوق كل شيء */}
                {/* تم إزالة "opacity-0" وجعله يظهر دائماً كزر عائم صغير */}
                <div className="absolute top-3 left-3 z-20">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    disabled={deleteMutation.isPending}
                    onClick={(e) => handleDeleteClick(e, image._id || image.id)}
                  >
                    {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={14} />}
                  </Button>
                </div>

                {/* 4. المحتوى النصي */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-right text-white 
                                transition-transform duration-300 ease-in-out pointer-events-none 
                                group-hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-1 drop-shadow-md">{image.title}</h3>
                  <p className="text-sm text-gray-200 drop-shadow-md">{image.category}</p>
                </div>
              </CardContent>
            </Card>

          </motion.div>
        ))}
      </div>
      
      {images.length === 0 && (
        <p className="text-center text-muted-foreground py-10">لا توجد صور في المعرض حالياً.</p>
      )}

      {/* --- نافذة تأكيد الحذف --- */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-background" dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الصورة نهائياً من الخوادم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
                onClick={confirmDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
            >
                {deleteMutation.isPending ? "جارِ الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </motion.div>
  );
}