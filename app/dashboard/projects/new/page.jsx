"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, UploadCloud, Trash2, Save, Send, Star, User, Calendar, MapPin, Video, Plus, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

export default function NewProjectPage() {
    const { request, loading } = useApiRequest();
    const router = useRouter();
    
    // State for form fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        client: '',
        projectDate: '',
        location: '',
        category: '',
        isPublished: true,
    });
    const [errors, setErrors] = useState({});
    
    // State for media management
    const [imageFiles, setImageFiles] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [coverImageName, setCoverImageName] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');

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
        const newImageFiles = [...imageFiles, ...files];
        setImageFiles(newImageFiles);

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
        if (mediaItems.filter(item => item.type === 'image').length === 0) {
            newErrors.media = "يجب رفع صورة واحدة على الأقل.";
        }
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

        const imageMetadata = mediaItems
            .filter(item => item.type === 'image')
            .map(item => ({
                name: item.name,
                isFeatured: item.isFeatured,
            }));
        
        const videos = mediaItems
            .filter(item => item.type === 'video')
            .map(item => ({ url: item.url, name: item.name }));

        submissionData.append('mediaMetadata', JSON.stringify(imageMetadata));
        submissionData.append('videos', JSON.stringify(videos));
        submissionData.append('coverImageName', coverImageName);

        const result = await request(() => globalApi.createProject(submissionData));
        
        if (result.success) {
            showToast("success", "تم إنشاء المشروع بنجاح!");
            router.push("/dashboard/projects");
        } else {
            showToast("error", result.error || "حدث خطأ أثناء إنشاء المشروع.");
        }
    };

    return (
        <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/projects"><span className="text-muted-foreground hover:text-foreground transition-colors">المشاريع</span></Link>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transform rotate-180" />
                        <span className="font-semibold">إضافة مشروع جديد</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display">املأ تفاصيل مشروعك</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid gap-8">
                    <Card>
                        <CardHeader><CardTitle>التفاصيل الأساسية</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">عنوان المشروع</Label>
                                <Input id="title" value={formData.title} onChange={handleChange} />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">وصف المشروع</Label>
                                <Textarea id="description" value={formData.description} onChange={handleChange} rows={6} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>تفاصيل إضافية</CardTitle></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="client">اسم العميل</Label>
                                <Input id="client" value={formData.client} onChange={handleChange} icon={<User />} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="projectDate">تاريخ المشروع</Label>
                                <Input id="projectDate" type="date" value={formData.projectDate} onChange={handleChange} icon={<Calendar />} />
                                {errors.projectDate && <p className="text-sm text-destructive">{errors.projectDate}</p>}
                            </div>
                             <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="location">موقع المشروع</Label>
                                <Input id="location" value={formData.location} onChange={handleChange} icon={<MapPin />} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>وسائط المشروع</CardTitle>
                            <CardDescription>ارفع الصور وأضف روابط الفيديو الخاصة بالمشروع.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>إضافة فيديوهات</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow"><Video className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="رابط الفيديو..." className="pr-10" /></div>
                                        <Button type="button" onClick={() => addVideo(videoUrl)}>إضافة</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>إضافة صور</Label>
                                    <div  className="w-full p-8 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-card/80 transition-colors">
                                        <UploadCloud  className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <Label htmlFor="image-upload" className="font-semibold text-primary cursor-pointer block">انقر لرفع الصور<span className="font-normal text-muted-foreground"> أو اسحب وأفلت</span></Label>
                                        <Input id="image-upload" type="file" multiple className="hidden" onChange={handleMediaChange} accept="image/*" />
                                    </div>
                                    {errors.media && <p className="text-sm text-destructive mt-2">{errors.media}</p>}
                                </div>
                            </div>
                            
                            {mediaItems.length > 0 && (
                                <div className="mt-6">
                                    {errors.cover && <p className="text-sm text-destructive mb-4">{errors.cover}</p>}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {mediaItems.map((item) => (
                                            <div key={item.name} className="relative group aspect-square">
                                                {item.type === 'image' ? (
                                                    <Image src={item.url} alt={item.name} layout="fill" objectFit="cover" className={cn("rounded-md transition-all", item.isFeatured && "ring-2 ring-sky-400")} />
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
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 grid gap-8 lg:sticky lg:top-24">
                    <Card>
                        <CardHeader><CardTitle>الإعدادات</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="isPublished">نشر المشروع</Label>
                                <Switch id="isPublished" checked={formData.isPublished} onCheckedChange={handleSwitchChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>فئة المشروع</Label>
                                <Select onValueChange={handleSelectChange} value={formData.category}>
                                    <SelectTrigger><SelectValue placeholder="اختر فئة" /></SelectTrigger>
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
                        <Button type="submit" size="lg" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                            نشر المشروع
                        </Button>
                        <Button type="submit" size="lg" variant="outline" className="w-full" disabled={loading}>
                            <Save className="ml-2 h-4 w-4" />
                            حفظ كمسودة
                        </Button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
