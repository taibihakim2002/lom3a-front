"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Inbox, Send, Trash2, Archive, Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

// --- المكون الرئيسي للصفحة ---
export default function MessagesPage() {
    const { request: fetchMessages, loading, error } = useApiRequest();
    const { request: updateMessageRequest } = useApiRequest();
    const { request: replyRequest, loading: isReplying } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();

    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchMessages(() => globalApi.getAllMessages());
            if (result.success) {
                setMessages(result.data.data.messages);
            }
        };
        fetchData();
    }, []);

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            const result = await updateMessageRequest(() => globalApi.updateMessage(message._id, { isRead: true }));
            if (result.success) {
                setMessages(prev => prev.map(m => m._id === message._id ? { ...m, isRead: true } : m));
            }
        }
    };

    const handleDelete = async () => {
        if (!messageToDelete) return;
        const result = await deleteRequest(() => globalApi.deleteMessage(messageToDelete._id));
        if (result.success) {
            showToast("success", "تم حذف الرسالة بنجاح");
            setMessages(prev => prev.filter(m => m._id !== messageToDelete._id));
            setMessageToDelete(null);
            if (selectedMessage?._id === messageToDelete._id) {
                setSelectedMessage(null);
            }
        } else {
            showToast("error", result.error || "فشل حذف الرسالة");
        }
    };

    const handleReply = async () => {
        if (!selectedMessage || !replyText.trim()) {
            showToast("error", "الرجاء كتابة نص الرد.");
            return;
        }
        const replyResult = await replyRequest(() => globalApi.replyToMessage(selectedMessage._id, { replyMessage: replyText }));
        
        if (replyResult.success) {
            showToast("success", "تم إرسال الرد بنجاح!");
            setReplyText("");
            
            // --- START: تعديل لحذف الرسالة من الواجهة الخلفية بعد الرد ---
            const deleteResult = await deleteRequest(() => globalApi.deleteMessage(selectedMessage._id));
            if (deleteResult.success) {
                showToast("success", "تم أرشفة الرسالة بعد الرد.");
            } else {
                showToast("warning", "تم إرسال الرد، لكن فشلت أرشفة الرسالة.");
            }

            // تحديث الواجهة بإزالة الرسالة
            setMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
            setSelectedMessage(null); // العودة إلى الواجهة الافتراضية
            // --- END: تعديل لحذف الرسالة من الواجهة الخلفية بعد الرد ---

        } else {
            showToast("error", replyResult.error || "فشل إرسال الرد.");
        }
    };

    return (
        <>
            <motion.div
                className="flex flex-col gap-8 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold font-display">صندوق الوارد</h1>
                    <p className="text-muted-foreground">عرض وإدارة الرسائل الواردة من العملاء.</p>
                </div>

                <Card className="flex-grow overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
                        {/* --- قائمة الرسائل (العمود الأيمن) --- */}
                        <div className={cn("border-l border-border h-full overflow-y-auto", selectedMessage && "hidden md:block")}>
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                                </div>
                            ) : error ? (
                                <div className="p-4 text-center text-destructive">{error}</div>
                            ) : messages.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">صندوق الوارد فارغ.</div>
                            ) : (
                                <div className="p-2">
                                    {messages.map(msg => (
                                        <button
                                            key={msg._id}
                                            onClick={() => handleSelectMessage(msg)}
                                            className={cn(
                                                "w-full text-right p-4 rounded-lg transition-colors flex gap-4 items-start",
                                                selectedMessage?._id === msg._id ? "bg-primary/10" : "hover:bg-muted"
                                            )}
                                        >
                                            <Avatar className="w-10 h-10 border-2 border-border">
                                                <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <p className={cn("font-bold truncate", !msg.isRead && "text-primary")}>{msg.name}</p>
                                                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>}
                                                </div>
                                                <p className="text-sm font-semibold truncate">{msg.subject}</p>
                                                <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- عارض الرسالة (العمود الأيسر) --- */}
                        <div className={cn("md:col-span-2 lg:col-span-3 h-full overflow-y-auto", !selectedMessage && "hidden md:flex")}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedMessage?._id || 'empty'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 w-full"
                                >
                                    {selectedMessage ? (
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-12 h-12"><AvatarFallback>{selectedMessage.name.charAt(0)}</AvatarFallback></Avatar>
                                                    <div><p className="font-bold">{selectedMessage.name}</p><p className="text-sm text-muted-foreground">{selectedMessage.email}</p></div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                                            </div>
                                            <h2 className="text-2xl font-bold font-display mb-4">{selectedMessage.subject}</h2>
                                            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</div>
                                            <div className="border-t my-8"></div>
                                            <div>
                                                <Label htmlFor="reply" className="text-lg font-semibold">الرد على الرسالة</Label>
                                                <Textarea id="reply" placeholder={`اكتب ردك إلى ${selectedMessage.name}...`} rows={6} className="mt-2" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="flex gap-2">
                                                        <Button variant="destructive" size="icon" onClick={() => setMessageToDelete(selectedMessage)}><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                    <Button onClick={handleReply} disabled={isReplying}>
                                                        {isReplying ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                                                        إرسال الرد
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                            <Inbox className="h-24 w-24 mb-4" />
                                            <h3 className="text-2xl font-bold">حدد رسالة لعرضها</h3>
                                            <p>لم يتم تحديد أي رسالة. اختر واحدة من القائمة على اليمين.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>سيتم حذف هذه الرسالة بشكل نهائي.</AlertDialogDescription>
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
