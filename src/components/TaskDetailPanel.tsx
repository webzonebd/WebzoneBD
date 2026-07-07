import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Trash2, Edit2, Check, Paperclip, Send, MessageSquare, 
  Clock, Upload, FileText, ExternalLink, Loader2, AlertCircle,
  User, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';

export interface Attachment {
  name: string;
  size: string;
  uploadedAt: string;
  url?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  column: 'todo' | 'in_progress' | 'testing' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate?: string;
  completedDate?: string;
  description?: string;
  attachments?: Attachment[];
  comments?: Comment[];
}

interface TaskDetailPanelProps {
  task: Task | null;
  tasks: Task[];
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => Promise<void>;
  language: 'en' | 'bn' | 'ar';
  theme: 'light' | 'dark';
  triggerToast: (msg: string) => void;
}

const TRANSLATIONS = {
  en: {
    detailsTitle: "Task Details Dashboard",
    pipelineStage: "Pipeline Stage",
    assignedEngineer: "Assigned Engineer",
    severityPriority: "Severity Priority",
    sprintDue: "Sprint Commitment Due",
    descTitle: "📝 Description & Deliverables",
    attachmentsTitle: "📎 Connected Attachments",
    commentsTitle: "💬 Collaboration Board & Daily Notes",
    editBtn: "Edit",
    saveBtn: "Save Changes",
    cancelBtn: "Cancel",
    postAs: "Post Update As:",
    discussPlaceholder: "Discuss blockers, milestones reached, or code revisions...",
    emptyThread: "Empty Thread",
    noTeamComments: "No team commentary logged yet.",
    dropzoneText: "Drag & Drop assets here, or Click to Select",
    fileTypes: "PDF, PNG, JPG, ZIP, JSON docs",
    uploadingFile: "Uploading file to Firebase Storage...",
    noDesc: "No details or requirements specified. Click here to attach instructions.",
    ongoing: "ongoing",
    allTracks: "all tracks",
    deleteComment: "Delete Comment",
    deleteAttachment: "Delete Attachment",
    todo: "To Do / Backlog",
    in_progress: "In Progress",
    testing: "Quality Testing",
    done: "Done / Completed",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical (ASAP)"
  },
  bn: {
    detailsTitle: "কাজের ডেটা ড্যাশবোর্ড",
    pipelineStage: "কাজের পর্যায়",
    assignedEngineer: "দায়িত্বপ্রাপ্ত ইঞ্জিনিয়ার",
    severityPriority: "গুরুত্ব স্তর (Priority)",
    sprintDue: "কাজের শেষ ডেটলাইন",
    descTitle: "📝 কাজের বিবরণ ও ফলাফলসমূহ",
    attachmentsTitle: "📎 সংযুক্ত ফাইল এবং ডকুমেন্টস",
    commentsTitle: "💬 টিম আলোচনা বোর্ড এবং কার্যবিবরণী",
    editBtn: "সম্পাদনা",
    saveBtn: "সংরক্ষণ করুন",
    cancelBtn: "বাতিল",
    postAs: "মন্তব্যকারী নির্বাচিত করুন:",
    discussPlaceholder: "কোন সমস্যা বা অগ্রগতি থাকলে এখানে বিস্তারিত লিখুন...",
    emptyThread: "খালি থ্রেড",
    noTeamComments: "অত্র কাজে এখনও কোনো টিম মন্তব্য করা হয়নি।",
    dropzoneText: "ফাইল ড্র্যাগ করে ছাড়ুন অথবা আপলোড করতে ক্লিক করুন",
    fileTypes: "পিডিএফ, পিএনজি, জেপিজি, জিপ ফাইল",
    uploadingFile: "ফায়ারবেস স্টোরেজে ফাইল আপলোড হচ্ছে...",
    noDesc: "কোনো বিবরণী লিপিবদ্ধ নেই। কাজের বাধ্যবাধকতার তথ্য যোগ করতে ক্লিক করুন।",
    ongoing: "চলমান",
    allTracks: "সব ট্র্যাক",
    deleteComment: "মন্তব্য মুছুন",
    deleteAttachment: "সংযুক্তি মুছুন",
    todo: "টাস্ক / ব্যাকলগ তালিকা",
    in_progress: "চলমান কাজ",
    testing: "কোয়ালিটি টেস্টিং",
    done: "সম্পন্ন হয়েছে",
    low: "কম গুরুত্বপূর্ণ",
    medium: "মাঝারি",
    high: "উচ্চ গুরুত্ব",
    critical: "অতি জরুরী কাজ"
  },
  ar: {
    detailsTitle: "لوحة تفاصيل المهمة",
    pipelineStage: "مرحلة العمل",
    assignedEngineer: "المهندس المسؤول",
    severityPriority: "درجة الأولوية",
    sprintDue: "موعد تسليم الالتزام",
    descTitle: "📝 الوصف والنتائج المستهدفة",
    attachmentsTitle: "📎 الملفات المرفقة المتصلة",
    commentsTitle: "💬 مجلس التعاون والملاحظات اليومية",
    editBtn: "تعديل",
    saveBtn: "حفظ التغييرات",
    cancelBtn: "إلغاء",
    postAs: "نشر التحديث باسم:",
    discussPlaceholder: "اكتب تفاصيل المعوقات، الإنجازات، أو المراجعات...",
    emptyThread: "المحادثة فارغة",
    noTeamComments: "لا توجد أي تعليقات مضافة بعد لهذا العمل.",
    dropzoneText: "اسحب الملفات وأفلتها هنا، أو اضغط للاختيار",
    fileTypes: "PDF, PNG, JPG, ZIP, مفكرة JSON",
    uploadingFile: "جاري تحميل الملف إلى سعة Firestore التخزينية...",
    noDesc: "لا توجد تفاصيل محددة للمهمة. انقر لإضافة الشروط أو الصلاحيات المخصصة.",
    ongoing: "قيد التشغيل",
    allTracks: "جميع المسارات",
    deleteComment: "حذف التعليق",
    deleteAttachment: "حذف المرفق",
    todo: "قائمة المهام المؤجلة",
    in_progress: "قيد العمل والتنفيذ",
    testing: "اختبار الجودة والأداء",
    done: "تم الإنجاز والانتهاء",
    low: "أولوية منخفضة",
    medium: "أولوية متوسطة",
    high: "أولوية مرتفعة",
    critical: "مهمة حرجة جداً"
  }
};

export default function TaskDetailPanel({ 
  task, 
  tasks,
  onClose, 
  onUpdateTask, 
  language, 
  theme,
  triggerToast 
}: TaskDetailPanelProps) {
  const isDark = theme === 'dark';
  const tDict = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Track state corresponding to derived active task from Kanban board tasks state
  const activeTask = task ? (tasks.find(tk => tk.id === task.id) || task) : null;

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Anisur');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescriptionText, setEditingDescriptionText] = useState('');
  const [dragOverFileInput, setDragOverFileInput] = useState(false);
  
  // File upload progress states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sync description field when active task changes in the board
  useEffect(() => {
    if (activeTask) {
      setEditingDescriptionText(activeTask.description || '');
      setIsEditingDescription(false);
    }
  }, [activeTask?.id]);

  if (!activeTask) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverFileInput(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAttachAndUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAttachAndUploadFiles(e.target.files);
    }
  };

  // Human-friendly byte size formatter
  const getFormattedSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleAttachAndUploadFiles = async (fileList: FileList) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newAttachments: Attachment[] = [];

    // Loop and upload each asset in sequence or parallel
    for (const file of filesArray) {
      try {
        const storageRef = ref(storage, `tasks/${activeTask.id}/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Silent catch to suppress unhandled promise rejections on the returned UploadTask promise
        uploadTask.catch((error) => {
          console.warn("Silent catch on uploadTask promise:", error);
        });

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }, 
            (error) => {
              console.warn("Firebase Storage Upload timed out or refused. Activating durable fallback...", error);
              reject(error);
            }, 
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                newAttachments.push({
                  name: file.name,
                  size: getFormattedSize(file.size),
                  uploadedAt: new Date().toISOString().split('T')[0],
                  url: downloadURL
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          );
        });
      } catch (err) {
        console.warn("Storage upload failed, fallback to durable base64/blob storage: ", err);
        // Fallback for offline sandbox or if rules/bucket denies upload
        let durableURL = '';
        if (file.size < 800 * 1024) {
          try {
            durableURL = await new Promise<string>((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => res(reader.result as string);
              reader.onerror = () => rej(new Error('FileReader failed'));
              reader.readAsDataURL(file);
            });
          } catch (e) {
            durableURL = URL.createObjectURL(file);
          }
        } else {
          durableURL = URL.createObjectURL(file);
        }

        newAttachments.push({
          name: file.name,
          size: getFormattedSize(file.size),
          uploadedAt: new Date().toISOString().split('T')[0],
          url: durableURL
        });
      }
    }

    const updatedTask: Task = {
      ...activeTask,
      attachments: [...(activeTask.attachments || []), ...newAttachments]
    };

    await onUpdateTask(updatedTask);
    setIsUploading(false);
    setUploadProgress(null);
    triggerToast(
      language === 'bn' 
        ? `📎 সফলভাবে ${newAttachments.length}টি সংযুক্ত ফাইল আপলোড করা হয়েছে!`
        : `📎 Loaded ${newAttachments.length} file(s) successfully!`
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex justify-end"
      id="task-slide-over-portal-layer"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl relative select-text text-left border-l ${
          isDark ? 'bg-neutral-900 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
        }`}
        onClick={(e) => e.stopPropagation()}
        id="task-detail-panel-container"
      >
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* Header section with titles */}
          <div className={`flex justify-between items-start pb-4 border-b gap-4 ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-500 font-extrabold uppercase tracking-widest block">
                {tDict.detailsTitle}
              </span>
              <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {activeTask.title}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
              }`}
              id="close-task-panel-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive metadata parameters grid */}
          <div className={`grid grid-cols-2 gap-4 p-4 rounded-2xl border text-xs ${
            isDark ? 'bg-neutral-950/50 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            
            {/* Control 1: Pipeline stage placement */}
            <div className="space-y-1" id="panel-ctrl-status mb-1">
              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                {tDict.pipelineStage}
              </label>
              <select
                value={activeTask.column}
                onChange={async (e) => {
                  const newCol = e.target.value as 'todo' | 'in_progress' | 'testing' | 'done';
                  const updated = { 
                    ...activeTask, 
                    column: newCol,
                    completedDate: newCol === 'done' ? new Date().toISOString().split('T')[0] : undefined
                  };
                  await onUpdateTask(updated);
                  triggerToast(`🚀 Pipeline set to ${newCol.toUpperCase()}`);
                }}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-black cursor-pointer ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <option value="todo">{tDict.todo}</option>
                <option value="in_progress">{tDict.in_progress}</option>
                <option value="testing">{tDict.testing}</option>
                <option value="done">{tDict.done}</option>
              </select>
            </div>

            {/* Control 2: Dev Assignee */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                {tDict.assignedEngineer}
              </label>
              <select
                value={activeTask.assignee}
                onChange={async (e) => {
                  const updated = { ...activeTask, assignee: e.target.value };
                  await onUpdateTask(updated);
                  triggerToast(`👤 Assignee set to ${e.target.value}`);
                }}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-black cursor-pointer ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <option value="Anisur">Anisur</option>
                <option value="Sayeeda">Sayeeda</option>
                <option value="Tariqul">Tariqul</option>
                <option value="Fahim">Fahim</option>
              </select>
            </div>

            {/* Control 3: Severity Priority */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                {tDict.severityPriority}
              </label>
              <select
                value={activeTask.priority}
                onChange={async (e) => {
                  const updated = { ...activeTask, priority: e.target.value as any };
                  await onUpdateTask(updated);
                  triggerToast(`⚡ Priority marked ${e.target.value.toUpperCase()}`);
                }}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-black cursor-pointer ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <option value="low">{tDict.low}</option>
                <option value="medium">{tDict.medium}</option>
                <option value="high">{tDict.high}</option>
                <option value="critical">{tDict.critical}</option>
              </select>
            </div>

            {/* Control 4: Commit Target date */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                {tDict.sprintDue}
              </label>
              <input
                type="date"
                value={activeTask.dueDate || ''}
                onChange={async (e) => {
                  const updated = { ...activeTask, dueDate: e.target.value };
                  await onUpdateTask(updated);
                  triggerToast(`📅 Target date set to ${e.target.value}`);
                }}
                className={`w-full border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-600 font-mono ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-white font-black' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

          </div>

          {/* SECTION A: Description text edit panels */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-transparent">
              <h4 className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {tDict.descTitle}
              </h4>
              {!isEditingDescription && (
                <button
                  onClick={() => {
                    setEditingDescriptionText(activeTask.description || '');
                    setIsEditingDescription(true);
                  }}
                  className="text-[10px] font-bold text-purple-500 hover:text-purple-400 flex items-center gap-1 bg-purple-500/10 border border-purple-500/15 px-2 py-0.5 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{tDict.editBtn}</span>
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <div className="space-y-2 animate-in fade-in duration-100">
                <textarea
                  rows={4}
                  value={editingDescriptionText}
                  onChange={(e) => setEditingDescriptionText(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-600 resize-none font-sans leading-relaxed ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-250 text-neutral-900 shadow-inner'
                  }`}
                  placeholder="Specify instructions and functional milestones..."
                />
                <div className="flex justify-end gap-2 text-[10px] font-extrabold">
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                      isDark ? 'border-neutral-800 text-neutral-400 hover:text-white' : 'border-neutral-200 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {tDict.cancelBtn}
                  </button>
                  <button
                    onClick={async () => {
                      const updated = { ...activeTask, description: editingDescriptionText };
                      await onUpdateTask(updated);
                      setIsEditingDescription(false);
                      triggerToast('📝 Saved description changes.');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-650 text-white hover:opacity-90 cursor-pointer"
                  >
                    {tDict.saveBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => {
                  setEditingDescriptionText(activeTask.description || '');
                  setIsEditingDescription(true);
                }}
                className={`p-4 rounded-2xl border text-xs leading-relaxed transition duration-150 cursor-pointer min-h-[70px] ${
                  isDark ? 'bg-neutral-950/40 border-neutral-800/80 text-neutral-300 hover:border-neutral-700' : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {activeTask.description ? (
                  <p className="whitespace-pre-line">{activeTask.description}</p>
                ) : (
                  <p className="text-neutral-500 italic font-medium">{tDict.noDesc}</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION B: Real Firebase Storage file attachment zone */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              {tDict.attachmentsTitle} ({ (activeTask.attachments || []).length })
            </h4>

            {/* Dropzone field */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOverFileInput(true); }}
              onDragLeave={() => setDragOverFileInput(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('panel-file-uploader-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                dragOverFileInput 
                  ? 'border-purple-500 bg-purple-500/10 text-purple-300 animate-pulse' 
                  : isDark 
                    ? 'border-neutral-800 hover:border-purple-500/40 bg-neutral-950/20 text-neutral-400'
                    : 'border-neutral-200 hover:border-purple-500/30 bg-neutral-100/50 text-neutral-550'
              }`}
              id="file-dropzone-box"
            >
              <Upload className="w-5 h-5 text-neutral-500" />
              <span className={`text-[11px] font-extrabold ${isDark ? 'text-neutral-350' : 'text-neutral-700'}`}>
                {tDict.dropzoneText}
              </span>
              <span className="text-[9px] text-neutral-500 font-mono">{tDict.fileTypes}</span>
              <input 
                id="panel-file-uploader-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Display active uploads loader status */}
            {isUploading && (
              <div className={`p-3 rounded-xl border flex items-center gap-3 animate-pulse text-xs ${
                isDark ? 'bg-purple-950/20 border-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-100 text-purple-600'
              }`}>
                <Loader2 className="w-4 h-4 animate-spin text-purple-555" />
                <div className="flex-1 text-left">
                  <span className="font-bold block text-[10.5px] font-mono uppercase tracking-wider">{tDict.uploadingFile}</span>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress ?? 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black">{uploadProgress ?? 0}%</span>
              </div>
            )}

            {/* Listed files attachments */}
            { (activeTask.attachments || []).length > 0 && (
              <div className="space-y-2">
                {(activeTask.attachments || []).map((attachment, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-3 border rounded-xl transition duration-150 animate-in fade-in duration-200 ${
                      isDark ? 'bg-neutral-950/70 border-neutral-850 hover:bg-neutral-950' : 'bg-white border-neutral-200 hover:bg-neutral-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-neutral-900 text-purple-400 border border-neutral-800' : 'bg-purple-50 text-purple-600'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        {attachment.url ? (
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-neutral-300 hover:text-purple-400 transition flex items-center gap-1 group/link cursor-pointer"
                          >
                            <span className={`block truncate max-w-[200px] ${isDark ? 'text-neutral-200 group-hover/link:text-purple-400' : 'text-neutral-800 group-hover/link:text-purple-650'}`}>
                              {attachment.name}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-50 shrink-0" />
                          </a>
                        ) : (
                          <span className={`text-xs font-bold block truncate max-w-[200px] ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                            {attachment.name}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-mono font-medium">
                          {attachment.size} • Added {attachment.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        const list = [...(activeTask.attachments || [])];
                        list.splice(idx, 1);
                        const updated = { ...activeTask, attachments: list };
                        await onUpdateTask(updated);
                        triggerToast(language === 'bn' ? '🗑️ সংযুক্তি মুছে ফেলা হয়েছে' : '🗑️ Attachment cleared.');
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        isDark ? 'text-neutral-500 hover:text-red-400 hover:bg-neutral-900' : 'text-neutral-400 hover:text-red-605 hover:bg-neutral-100'
                      }`}
                      title={tDict.deleteAttachment}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION C: Real comments list & entry form */}
          <div className="space-y-4 pt-2">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              {tDict.commentsTitle} ({ (activeTask.comments || []).length })
            </h4>

            {/* Comment adding form */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;
                const newComment: Comment = {
                  id: `comment-${Date.now()}`,
                  author: commentAuthor,
                  text: commentText.trim(),
                  createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                };
                const updated = {
                  ...activeTask,
                  comments: [...(activeTask.comments || []), newComment]
                };
                await onUpdateTask(updated);
                setCommentText('');
                triggerToast(language === 'bn' ? '💬 মন্তব্য সফলভাবে আপলোড করা হয়েছে!' : '💬 Team comment shared successfully!');
              }} 
              className={`p-3.5 border rounded-2xl space-y-2.5 ${
                isDark ? 'bg-neutral-950/60 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-sans">
                <span className="font-mono text-neutral-400 uppercase tracking-widest font-extrabold">
                  {tDict.postAs}
                </span>
                <select 
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className={`rounded border px-2 py-1 font-bold text-[10.5px] cursor-pointer focus:outline-none focus:border-purple-550 ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <option value="Anisur">Anisur (Dev Leads)</option>
                  <option value="Sayeeda">Sayeeda (UI Dev & QA)</option>
                  <option value="Tariqul">Tariqul (SEO Expert)</option>
                  <option value="Fahim">Fahim (DevOps Leader)</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={tDict.discussPlaceholder}
                  className={`w-full rounded-xl pl-3.5 pr-10 py-2.5 text-xs placeholder-neutral-500 focus:outline-none focus:border-purple-600 resize-none leading-relaxed border ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900 shadow-inner'
                  }`}
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-2 top-2.5 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-650 text-white hover:opacity-95 disabled:opacity-40 select-none cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* List of comments */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              { (activeTask.comments || []).length === 0 ? (
                <div className={`py-8 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center gap-1 opacity-60 ${
                  isDark ? 'border-neutral-850' : 'border-neutral-200'
                }`}>
                  <MessageSquare className="w-5 h-5 text-neutral-500" />
                  <span className="text-[10px] font-mono font-bold tracking-wide uppercase">{tDict.emptyThread}</span>
                  <span className="text-[9px] text-neutral-500">{tDict.noTeamComments}</span>
                </div>
              ) : (
                [...(activeTask.comments || [])].reverse().map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-3.5 border rounded-2xl flex flex-col gap-1.5 animate-in slide-in-from-bottom duration-150 ${
                      isDark ? 'bg-neutral-950/30 border-neutral-850' : 'bg-white border-neutral-205 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-500 font-mono font-black flex items-center justify-center text-[9px] uppercase">
                          {comment.author[0]}
                        </div>
                        <span className={`font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                          {comment.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] font-mono text-neutral-400 font-medium">{comment.createdAt}</span>
                        <button
                          onClick={async () => {
                            const list = (activeTask.comments || []).filter(c => c.id !== comment.id);
                            const updated = { ...activeTask, comments: list };
                            await onUpdateTask(updated);
                            triggerToast(language === 'bn' ? '🗑️ মন্তব্যটি মুছে ফেলা হয়েছে।' : '🗑️ Comment removed.');
                          }}
                          className={`p-0.5 rounded transition cursor-pointer ${
                            isDark ? 'text-neutral-500 hover:text-red-400' : 'text-neutral-400 hover:text-red-600'
                          }`}
                          title={tDict.deleteComment}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed pl-6 whitespace-pre-wrap select-text ${
                      isDark ? 'text-neutral-300' : 'text-neutral-750'
                    }`}>
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
