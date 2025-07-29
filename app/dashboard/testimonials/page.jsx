"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, AlertCircle, Inbox, Trash2, Loader2, Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

// --- مكون النموذج (للإضافة والتعديل) ---
function TestimonialFormDialog({ open, onOpenChange, testimonial, onSave }) {
    const { request, loading } = useApiRequest();
    
    // --- START: استخدام useState بدلاً من useForm ---
    const [formData, setFormData] = useState({
        clientName: '',
        review: '',
        isPublished: true,
    });
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    // --- END: استخدام useState بدلاً من useForm ---

    useEffect(() => {
        if (open) {
            if (testimonial) {
                setFormData({
                    clientName: testimonial.clientName,
                    review: testimonial.review,
                    isPublished: testimonial.isPublished,
                });
                setImagePreview(testimonial.clientImage || '');
            } else {
                setFormData({ clientName: '', review: '', isPublished: true });
                setImagePreview('');
            }
            setImageFile(null);
            setErrors({});
        }
    }, [testimonial, open]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.clientName) newErrors.clientName = "اسم العميل مطلوب.";
        if (!formData.review) newErrors.review = "نص الرأي مطلوب.";
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const submissionData = new FormData();
        submissionData.append('clientName', formData.clientName);
        submissionData.append('review', formData.review);
        submissionData.append('isPublished', formData.isPublished);
        if (imageFile) {
            submissionData.append('clientImage', imageFile);
        }

        const result = testimonial
            ? await request(() => globalApi.updateTestimonial(testimonial._id, submissionData))
            : await request(() => globalApi.createTestimonial(submissionData));
        
        if (result.success) {
            onSave(result.data.data.testimonial);
            onOpenChange(false);
            showToast("success", testimonial ? "تم تحديث الرأي بنجاح" : "تمت إضافة الرأي بنجاح");
        } else {
            showToast("error", result.error || "حدث خطأ ما");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>{testimonial ? 'تعديل رأي عميل' : 'إضافة رأي جديد'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-24 h-24"><AvatarImage src={imagePreview} /><AvatarFallback>ص</AvatarFallback></Avatar>
                        <Button type="button" asChild variant="outline"><label htmlFor="clientImage" className="cursor-pointer"><Upload className="ml-2 h-4 w-4"/>تغيير الصورة</label></Button>
                        <Input id="clientImage" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientName">اسم العميل</Label>
                        <Input id="clientName" value={formData.clientName} onChange={handleChange} />
                        {errors.clientName && <p className="text-destructive text-sm">{errors.clientName}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review">نص الرأي</Label>
                        <Textarea id="review" value={formData.review} onChange={handleChange} rows={5} />
                        {errors.review && <p className="text-destructive text-sm">{errors.review}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isPublished">نشر على الموقع؟</Label>
                        <Switch dir="ltr" id="isPublished" checked={formData.isPublished} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}حفظ</Button>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>إلغاء</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// --- المكون الرئيسي للصفحة ---
export default function TestimonialsPage() {
    const { request: fetchTestimonials, loading, error } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();
    const { request: updateStatusRequest } = useApiRequest();

    const [testimonials, setTestimonials] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchTestimonials(() => globalApi.getAllTestimonials());
            if (result.success && result.data.data.testimonials) {
                setTestimonials(result.data.data.testimonials);
            }
        };
        fetchData();
    }, []);

    const handleSave = (savedTestimonial) => {
        if (editingTestimonial) {
            setTestimonials(prev => prev.map(t => t._id === savedTestimonial._id ? savedTestimonial : t));
        } else {
            setTestimonials(prev => [savedTestimonial, ...prev]);
        }
    };

    const handleDelete = async () => {
        if (!testimonialToDelete) return;
        const result = await deleteRequest(() => globalApi.deleteTestimonial(testimonialToDelete));
        if (result.success) {
            showToast("success", "تم حذف الرأي بنجاح");
            setTestimonials(prev => prev.filter(t => t._id !== testimonialToDelete));
            setTestimonialToDelete(null);
        } else {
            showToast("error", result.error || "فشل حذف الرأي");
        }
    };
    
    const handleTogglePublished = async (testimonial) => {
        const newStatus = !testimonial.isPublished;
        const result = await updateStatusRequest(() => globalApi.updateTestimonial(testimonial._id, { isPublished: newStatus }));
        if (result.success) {
            showToast("success", "تم تحديث حالة النشر");
            setTestimonials(prev => prev.map(t => t._id === testimonial._id ? { ...t, isPublished: newStatus } : t));
        } else {
            showToast("error", "فشل تحديث الحالة");
        }
    };

    const renderContent = () => {
        if (loading) return <div><Skeleton className="h-96 w-full" /></div>;
        if (error) return <div className="text-center py-24 text-destructive"><AlertCircle className="mx-auto h-12 w-12 mb-4" /><p>{error}</p></div>;
        
        if (testimonials.length === 0) return (
            <div className="text-center py-24 border-2 border-dashed rounded-lg">
                <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-bold">لا توجد آراء لعرضها</h3>
                <p className="text-muted-foreground mb-6">ابدأ بإضافة أول رأي عميل.</p>
                <Button onClick={() => { setEditingTestimonial(null); setIsDialogOpen(true); }}><PlusCircle className="ml-2 h-4 w-4" />إضافة رأي جديد</Button>
            </div>
        );

        return (
            <Table dir="rtl">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px] text-start">العميل</TableHead>
                        <TableHead className="hidden sm:table-cell text-start">الرأي</TableHead>
                        <TableHead className="text-center">منشور</TableHead>
                        <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {testimonials.map(t => (
                        <TableRow key={t._id}>
                            <TableCell className="flex items-center gap-4">
                                <Avatar><AvatarImage src={t.clientImage} /><AvatarFallback>{t.clientName.charAt(0)}</AvatarFallback></Avatar>
                                <span className="font-medium">{t.clientName}</span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">{t.review}</TableCell>
                            <TableCell className="text-center">
                                <Switch dir="ltr" checked={t.isPublished} onCheckedChange={() => handleTogglePublished(t)} />
                            </TableCell>
                            <TableCell className="text-left">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => { setEditingTestimonial(t); setIsDialogOpen(true); }}>تعديل</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => setTestimonialToDelete(t._id)}>حذف</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <>
            <motion.div className="flex flex-col gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-display">آراء العملاء</h1>
                        <p className="text-muted-foreground">إدارة الشهادات التي تظهر في صفحتك الرئيسية.</p>
                    </div>
                    <Button onClick={() => { setEditingTestimonial(null); setIsDialogOpen(true); }}>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة رأي جديد
                    </Button>
                </div>
                <Card><CardContent className="p-0">{renderContent()}</CardContent></Card>
            </motion.div>

            <TestimonialFormDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                testimonial={editingTestimonial}
                onSave={handleSave}
            />

            <AlertDialog open={!!testimonialToDelete} onOpenChange={() => setTestimonialToDelete(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle><AlertDialogDescription>سيتم حذف هذا الرأي بشكل نهائي.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}حذف</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
