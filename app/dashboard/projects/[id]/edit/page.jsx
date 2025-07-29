"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, UploadCloud, Trash2, Save, Send, Star, Sparkles, User, Calendar, MapPin, Video, Plus, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

export default function EditProjectPage({ params }) {
    const router = useRouter();
    const { id: projectId } = params;

    const { request: fetchProjectRequest, loading: isLoading } = useApiRequest();
    const { request: updateRequest, loading: isUpdating } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();

    const [formData, setFormData] = useState({
        title: '', description: '', client: '', projectDate: '', location: '', category: '', isPublished: false,
    });
    const [errors, setErrors] = useState({});
    
    const [mediaItems, setMediaItems] = useState([]);
    const [coverImageName, setCoverImageName] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // --- جلب بيانات المشروع عند تحميل الصفحة ---
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchProjectRequest(() => globalApi.getProjectById(projectId));
            if (result.success) {
                const project = result.data.data;
                setFormData({
                    title: project.title,
                    description: project.description,
                    client: project.client || '',
                    projectDate: new Date(project.projectDate).toISOString().split('T')[0],
                    location: project.location || '',
                    category: project.category,
                    isPublished: project.isPublished,
                });
                setMediaItems(project.media.map(m => ({ ...m, name: m.url })));
                setCoverImageName(project.coverImage);
            } else {
                showToast("error", "Failed to fetch project data.");
                router.push('/dashboard/projects'); // Redirect if project not found
            }
        };
        if (projectId) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };
    
    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
        if (errors.category) setErrors(prev => ({ ...prev, category: null }));
    };

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({ ...prev, isPublished: checked }));
    };

    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(prev => [...prev, ...files]);

        const newMediaItems = files.map(file => ({
            type: 'image', url: URL.createObjectURL(file), name: file.name, isFeatured: false,
        }));
        setMediaItems(prev => [...prev, ...newMediaItems]);
    };
    
    const addVideo = () => {
        if (videoUrl.trim() === '') return;
        const newVideo = { type: 'video', url: videoUrl, name: `video-${Date.now()}` };
        setMediaItems(prev => [...prev, newVideo]);
        setVideoUrl('');
    };

    const removeMedia = (mediaName) => {
        setMediaItems(prev => prev.filter(item => item.name !== mediaName));
        setImageFiles(prev => prev.filter(file => file.name !== mediaName));
        if (coverImageName === mediaName) setCoverImageName(null);
    };

    const toggleFeatured = (imageNameToToggle) => {
        setMediaItems(prev => 
            prev.map(item => item.name === imageNameToToggle ? { ...item, isFeatured: !item.isFeatured } : item)
        );
    };

    // --- Validation and Submission ---
    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "عنوان المشروع مطلوب.";
        if (!formData.description) newErrors.description = "وصف المشروع مطلوب.";
        if (!formData.projectDate) newErrors.projectDate = "تاريخ المشروع مطلوب.";
        if (!formData.category) newErrors.category = "فئة المشروع مطلوبة.";
        if (mediaItems.filter(item => item.type === 'image').length === 0) newErrors.media = "يجب وجود صورة واحدة على الأقل.";
        if (!coverImageName) newErrors.cover = "الرجاء تحديد صورة غلاف للمشروع.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showToast("error", "الرجاء ملء جميع الحقول المطلوبة.");
            return;
        }
        setErrors({});

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        
        imageFiles.forEach(file => submissionData.append('media', file));

        const mediaMetadata = mediaItems.map(item => ({
            name: item.name,
            url: item.url,
            type: item.type,
            isFeatured: item.isFeatured || false,
        }));
        
        submissionData.append('media', JSON.stringify(mediaMetadata));
        submissionData.append('coverImageName', coverImageName);

        const result = await updateRequest(() => globalApi.updateProject(projectId, submissionData));

        if (result.success) {
            showToast("success", "تم تحديث المشروع بنجاح!");
            router.push("/dashboard/projects");
        } else {
            showToast("error", result.error || "فشل تحديث المشروع.");
        }
    };

    const handleDelete = async () => {
        if (!projectToDelete) return;
        const result = await deleteRequest(() => globalApi.deleteProject(projectToDelete));
        if (result.success) {
            showToast("success", "تم حذف المشروع بنجاح");
            setProjectToDelete(null);
            router.push("/dashboard/projects");
        } else {
            showToast("error", result.error || "فشل حذف المشروع");
        }
    };
    
    if (isLoading) {
        return (
             <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid gap-8">
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1"><Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card></div>
            </div>
        );
    }

    return (
        <>
            <motion.div
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/projects"><span className="text-muted-foreground hover:text-foreground">المشاريع</span></Link>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transform rotate-180" />
                        <span className="font-semibold">تعديل مشروع: {formData.title}</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display">تعديل تفاصيل المشروع</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 grid gap-8">
                        <Card>
                            <CardHeader><CardTitle>التفاصيل الأساسية</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">عنوان المشروع</Label>
                                    <Input id="title" value={formData.title || ''} onChange={handleChange} />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">وصف المشروع</Label>
                                    <Textarea id="description" value={formData.description || ''} onChange={handleChange} rows={6} />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>تفاصيل إضافية</CardTitle></CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="client">اسم العميل</Label>
                                    <Input id="client" value={formData.client || ''} onChange={handleChange} icon={<User />} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectDate">تاريخ المشروع</Label>
                                    <Input id="projectDate" type="date" value={formData.projectDate || ''} onChange={handleChange} icon={<Calendar />} />
                                    {errors.projectDate && <p className="text-sm text-destructive">{errors.projectDate}</p>}
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="location">موقع المشروع</Label>
                                    <Input id="location" value={formData.location || ''} onChange={handleChange} icon={<MapPin />} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>وسائط المشروع</CardTitle>
                                <CardDescription>أضف المزيد من الصور أو الفيديوهات للمشروع.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>إضافة فيديوهات</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-grow">
                                                <Video className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="رابط الفيديو..." className="pr-10" />
                                            </div>
                                            <Button type="button" onClick={addVideo}>إضافة</Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>إضافة صور</Label>
                                        <div className="w-full p-8 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-card/80 transition-colors">
                                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                            <Label htmlFor="image-upload" className="font-semibold text-primary cursor-pointer block">انقر لرفع المزيد من الصور</Label>
                                            <Input id="image-upload" type="file" multiple className="hidden" onChange={handleMediaChange} accept="image/*" />
                                        </div>
                                    </div>
                                </div>
                                {mediaItems.length > 0 && (
                                    <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {mediaItems.map((item) => (
                                            <div key={item.name} className="relative group aspect-square">
                                                {item.type === 'image' ? (
                                                    <Image src={item.url} alt={item.name} layout="fill" objectFit="cover" className={cn("rounded-md transition-all", item.isFeatured && "ring-2 ring-offset-2 ring-offset-background ring-sky-400")} />
                                                ) : (
                                                    <div className="w-full h-full bg-card rounded-md flex items-center justify-center"><Video className="h-10 w-10 text-muted-foreground" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                    <Button type="button" size="icon" variant="destructive" onClick={() => removeMedia(item.name)}><Trash2 className="h-4 w-4" /></Button>
                                                    {item.type === 'image' && (
                                                        <>
                                                            <Button type="button" size="icon" variant={coverImageName === item.name ? "default" : "secondary"} onClick={() => setCoverImageName(item.name)}><Star className="h-4 w-4" /></Button>
                                                            <Button type="button" size="icon" variant={item.isFeatured ? "default" : "secondary"} onClick={() => toggleFeatured(item.name)}><Sparkles className="h-4 w-4" /></Button>
                                                        </>
                                                    )}
                                                </div>
                                                {coverImageName === item.name && (
                                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-1 rounded-full"><Star className="h-3 w-3" /></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 grid gap-8 lg:sticky lg:top-24">
                        <Card>
                            <CardHeader><CardTitle>الإعدادات</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isPublished">نشر المشروع</Label>
                                    <Switch id="isPublished" checked={formData.isPublished} onCheckedChange={handleSwitchChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>فئة المشروع</Label>
                                    <Select value={formData.category} onValueChange={handleSelectChange}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="زفاف">زفاف</SelectItem>
                                            <SelectItem value="بورتريه">بورتريه</SelectItem>
                                            <SelectItem value="طبيعة">طبيعة</SelectItem>
                                            <SelectItem value="منتجات">منتجات</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex flex-col gap-3">
                            <Button type="submit" size="lg" className="w-full" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                                حفظ التغييرات
                            </Button>
                            <Button type="button" size="lg" variant="destructive" className="w-full" onClick={() => setProjectToDelete(projectId)}>
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف المشروع
                            </Button>
                        </div>
                    </div>
                </form>
            </motion.div>

            <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-start">هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-start">
                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المشروع نهائيًا.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            نعم، قم بالحذف
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
