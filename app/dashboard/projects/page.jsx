"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, AlertCircle, Inbox, Trash2, Pencil, Eye, Loader2 } from 'lucide-react';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

export default function ProjectsPage() {
    const { request: fetchProjectsRequest, loading, error } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();
    
    const [projects, setProjects] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchData = async () => {
        const result = await fetchProjectsRequest(() => globalApi.getAllProjects());
        if (result.success ) {
            setProjects(result.data.data); 
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        const result = await deleteRequest(() => globalApi.deleteProject(projectToDelete));

        if (result.success) {
            showToast("success", "تم حذف المشروع بنجاح");
            setProjects(prevProjects => prevProjects.filter(p => p._id !== projectToDelete));
            setProjectToDelete(null);
        } else {
            showToast("error", result.error || "فشل حذف المشروع");
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Table dir="rtl">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell text-right">صورة</TableHead>
                            <TableHead className="text-right">العنوان</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="hidden md:table-cell text-right">تاريخ المشروع</TableHead>
                            <TableHead className="hidden lg:table-cell text-right">الموقع</TableHead>
                            <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        
        if (error) {
            return (
                <div className="text-center py-24 text-destructive">
                    <AlertCircle className="mx-auto h-16 w-16 mb-4" />
                    <h3 className="text-2xl font-bold">حدث خطأ ما</h3>
                    <p className="mb-6">{error}</p>
                    <Button variant="secondary" onClick={fetchData}>إعادة المحاولة</Button>
                </div>
            );
        }

        if (!projects || projects.length === 0) {
            return (
                <div className="text-center py-24">
                    <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold">لم تقم بإضافة أي مشاريع بعد</h3>
                    <p className="text-muted-foreground mb-6">ابدأ بإضافة مشروعك الأول لعرضه في موقعك.</p>
                    <Link href="/dashboard/projects/new">
                        <Button>
                            <PlusCircle className="ml-2 h-4 w-4" />
                            إضافة مشروع جديد
                        </Button>
                    </Link>
                </div>
            );
        }
        
        return (
            <Table dir="rtl">
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell text-right">صورة</TableHead>
                        <TableHead className="text-right">العنوان</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="hidden md:table-cell text-right">تاريخ المشروع</TableHead>
                        <TableHead className="hidden lg:table-cell text-right">الموقع</TableHead>
                        <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project._id}>
                            <TableCell className="hidden sm:table-cell">
                                <Image src={project.coverImage} alt={project.title} width={80} height={80} className="h-16 w-16 object-cover rounded-md" />
                            </TableCell>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>
                                <Badge variant={project.isPublished ? 'default' : 'outline'}>{project.isPublished ? 'منشور' : 'مسودة'}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(project.projectDate).toLocaleDateString('en-us')}</TableCell>
                            <TableCell className="hidden lg:table-cell">{project.location}</TableCell>
                            <TableCell className="text-left">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" dir="rtl">
                                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                        <DropdownMenuItem asChild><Link href={`/projects/${project.slug}`} className="flex items-center w-full cursor-pointer"><Eye className="ml-2 h-4 w-4" />معاينة</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href={`/dashboard/projects/${project._id}/edit`} className="flex items-center w-full cursor-pointer"><Pencil className="ml-2 h-4 w-4" />تعديل</Link></DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={() => setProjectToDelete(project._id)}><Trash2 className="ml-2 h-4 w-4" />حذف</DropdownMenuItem>
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
            <motion.div
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-display">المشاريع</h1>
                        <p className="text-muted-foreground">إدارة جميع مشاريعك في مكان واحد.</p>
                    </div>
                    <Link href="/dashboard/projects/new">
                        <Button>
                            <PlusCircle className="ml-2 h-4 w-4" />
                            إضافة مشروع جديد
                        </Button>
                    </Link>
                </div>
                
                <Card>
                    <CardContent className="p-0">
                        {renderContent()}
                    </CardContent>
                </Card>

                {projects && projects.length > 0 && (
                    <div className="flex justify-end items-center gap-4">
                        <span className="text-sm text-muted-foreground">صفحة 1 من 1</span>
                        <Button variant="outline" size="sm">السابق</Button>
                        <Button variant="outline" size="sm">التالي</Button>
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle  className="text-start">هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription  className="text-start">
                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المشروع بشكل دائم من خوادمنا.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDeleteProject} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            نعم، قم بالحذف
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
