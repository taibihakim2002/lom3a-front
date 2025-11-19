'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
// --- إضافة Upload أيقونة ---
import { Trash2, Star, PlusCircle, MoreHorizontal, Edit, XCircle, CheckCircle, Loader2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '@/features/testimonials/api';
import { toast } from 'sonner';

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- حالات الفورم الجديدة ---
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [stars, setStars] = useState(5);
  const [quote, setQuote] = useState('');
  const [file, setFile] = useState(null);     // للصورة
  const [fileName, setFileName] = useState(''); // لاسم الملف
  // ---------------------------

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialsApi.getAll,
  });

  const testimonials = data?.data?.data?.testimonials || [];

  const createMutation = useMutation({
    mutationFn: testimonialsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      toast.success("تم إضافة الرأي بنجاح.");
      setIsDialogOpen(false);
      // تصفير الفورم
      setName(''); setLocation(''); setStars(5); setQuote(''); setFile(null); setFileName('');
    },
    onError: () => toast.error("فشل إضافة الرأي."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => testimonialsApi.update({ id, data: { status } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      toast.success("تم تحديث الحالة.");
    },
    onError: () => toast.error("فشل التحديث."),
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      toast.success("تم حذف الرأي.");
    },
    onError: () => toast.error("فشل الحذف."),
  });

  // --- التعامل مع الملف ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
  };

  // --- إرسال الفورم (FormData) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quote", quote);
    formData.append("stars", stars);
    if(location) formData.append("location", location);
    if(file) formData.append("img", file); // المفتاح "img"
    formData.append("status", "موافق عليه");

    createMutation.mutate(formData);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة آراء العملاء</h1>
          <p className="text-muted-foreground">الموافقة على الآراء الجديدة أو حذفها.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <PlusCircle size={18} />
              إضافة رأي يدوي
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>إضافة رأي جديد</DialogTitle>
              <DialogDescription>أدخل بيانات العميل، الصورة (اختياري)، والرأي.</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="grid gap-4 py-4 text-right">
              
              {/* حقل الصورة */}
              <div className="space-y-2">
                <Label>صورة العميل (اختياري)</Label>
                <Label htmlFor="clientImg" className="flex h-20 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary hover:bg-accent transition-colors">
                  {fileName ? <span className="text-xs">{fileName}</span> : <div className="flex flex-col items-center text-muted-foreground"><Upload size={20} /><span className="text-xs">رفع صورة</span></div>}
                </Label>
                <Input id="clientImg" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-2">
                <Label>اسم العميل</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="text-right" />
              </div>
              <div className="space-y-2">
                <Label>الموقع (اختياري)</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="text-right" />
              </div>
              <div className="space-y-2">
                <Label>التقييم</Label>
                <Input type="number" min="1" max="5" value={stars} onChange={(e) => setStars(e.target.value)} required className="text-right" />
              </div>
              <div className="space-y-2">
                <Label>الرأي</Label>
                <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} required className="text-right" />
              </div>

              <DialogFooter className="flex-row justify-start pt-4">
                <DialogClose asChild><Button type="button" variant="secondary">إلغاء</Button></DialogClose>
                <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground">
                    {createMutation.isPending ? "جارِ الإضافة..." : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader className="text-right">
          <CardTitle>جميع الآراء ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right w-[40%]">الاقتباس</TableHead>
                <TableHead className="text-center">التقييم</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item._id || item.id}>
                  <TableCell className="font-medium text-right">
                    <div className="flex items-center gap-3">
                        {/* عرض الصورة المصغرة */}
                        {item.img ? (
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs">
                                {item.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <div>{item.name}</div>
                            {item.location && <div className="text-xs text-muted-foreground">{item.location}</div>}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm truncate max-w-[200px]">{item.quote}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-50">
                      <Star size={14} className="fill-yellow-500 ml-1" />{item.stars}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={item.status === "موافق عليه" ? 'bg-primary/20 text-primary' : 'bg-yellow-100 text-yellow-800'}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.status !== "موافق عليه" ? (
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: item._id, status: "موافق عليه" })}><CheckCircle className="ml-2 h-4 w-4 text-green-600" />موافقة</DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem onClick={() => updateMutation.mutate({ id: item._id, status: "بانتظار المراجعة" })}><XCircle className="ml-2 h-4 w-4 text-orange-500" />إلغاء الموافقة</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { if(confirm("حذف؟")) deleteMutation.mutate(item._id); }}><Trash2 className="ml-2 h-4 w-4" />حذف</DropdownMenuItem>
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