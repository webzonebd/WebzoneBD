import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Paperclip, Check, CheckCheck, Clock, User, ShieldCheck, Sparkles, 
  FileText, Download, X, Search, MessageSquare, AlertCircle, RefreshCw, 
  Tag, CheckCircle2, ListChecks, ChevronDown, ChevronUp, ArrowRight, 
  ExternalLink, UserCheck, HelpCircle, Briefcase, FileCode, Layers, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderMessage, OrderMessageAttachment, Language, UserSession } from '../types';

interface OrderProjectChatProps {
  order: Order;
  user: UserSession | null;
  language: Language;
  onClose?: () => void;
  isCompact?: boolean;
}

// Default staff member profiles based on WebzoneBD team structure
const STAFF_PROFILES: Record<string, { role: string; department: string; avatar: string; experience: string }> = {
  'Anisur Rahman': {
    role: 'Lead Full-Stack & Solutions Architect',
    department: 'Core Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    experience: '8+ yrs exp • Senior Lead'
  },
  'Sayeeda Yeasmin': {
    role: 'UI/UX & Frontend Delivery Specialist',
    department: 'Design & QA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    experience: '5+ yrs exp • Design Lead'
  },
  'Tariqul Islam': {
    role: 'Cloud Infrastructure & DevOps Engineer',
    department: 'Server Operations',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    experience: '6+ yrs exp • Systems Specialist'
  },
  'WebzoneBD Support': {
    role: 'Technical Project Coordinator',
    department: 'Client Success',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    experience: 'Active 24/7 Desk'
  }
};

export const OrderProjectChat: React.FC<OrderProjectChatProps> = ({
  order,
  user,
  language,
  onClose,
  isCompact = false
}) => {
  // Resolve assigned staff member
  const staffName = order.assignedStaff && STAFF_PROFILES[order.assignedStaff] 
    ? order.assignedStaff 
    : 'Anisur Rahman';
  const staffInfo = STAFF_PROFILES[staffName] || STAFF_PROFILES['Anisur Rahman'];

  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OrderMessage['category']>('requirement');
  const [attachedFiles, setAttachedFiles] = useState<OrderMessageAttachment[]>([]);
  const [isStaffTyping, setIsStaffTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRequirementChecklistOpen, setIsRequirementChecklistOpen] = useState(false);
  const [perspective, setPerspective] = useState<'client' | 'staff'>('client');
  const [autoStaffReplyEnabled, setAutoStaffReplyEnabled] = useState(true);
  const [isAttachmentPickerOpen, setIsAttachmentPickerOpen] = useState(false);

  // Requirements checklist state stored per order
  const [requirementsList, setRequirementsList] = useState<Array<{ id: string; text: string; status: 'agreed' | 'in_progress' | 'pending' }>>(() => {
    const saved = localStorage.getItem(`order_reqs_${order.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 'req-1', text: 'Project scope & baseline functional specs confirmed', status: 'agreed' },
      { id: 'req-2', text: 'Brand colors, typography & visual references reviewed', status: 'in_progress' },
      { id: 'req-3', text: 'Target database schema & payment gateways setup', status: 'pending' },
      { id: 'req-4', text: 'Staging preview & client feedback milestone', status: 'pending' },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translations
  const t = {
    chatTitle: language === 'bn' ? 'প্রজেক্ট রিকোয়ারমেন্টস ও স্টাফ চ্যাট' : language === 'ar' ? 'دردشة متطلبات المشروع مع الفريق' : 'Project Requirements & Staff Chat',
    assignedStaff: language === 'bn' ? 'দায়িত্বপ্রাপ্ত ইঞ্জিনিয়ার' : language === 'ar' ? 'الموظف المسؤول' : 'Assigned Engineer',
    onlineNow: language === 'bn' ? 'সরাসরি অনলাইন' : language === 'ar' ? 'متصل الآن' : 'Active & Online',
    responseTime: language === 'bn' ? 'সাধারণত ৫-১০ মিনিটে উত্তর দেন' : language === 'ar' ? 'يرد عادة في 5-10 دقائق' : 'Replies in 5-10 mins',
    scopeTracker: language === 'bn' ? 'প্রজেক্ট রিকোয়ারমেন্টস চেকলিস্ট' : language === 'ar' ? 'قائمة متطلبات المشروع' : 'Project Requirements Checklist',
    typePlaceholder: language === 'bn' ? 'প্রজেক্ট রিকোয়ারমেন্ট, ফিচার বা কোনো প্রশ্ন লিখুন...' : language === 'ar' ? 'اكتب متطلبات المشروع أو المواصفات هنا...' : 'Type project requirement, custom feature, or query...',
    send: language === 'bn' ? 'পাঠান' : language === 'ar' ? 'إرسال' : 'Send',
    attachFile: language === 'bn' ? 'ফাইল যুক্ত করুন' : language === 'ar' ? 'إرفاق ملف' : 'Attach File / Asset',
    quickRequirements: language === 'bn' ? 'কুইক টপিক ও রিকোয়ারমেন্টস:' : language === 'ar' ? 'موضوعات سريعة:' : 'Quick Requirement Topics:',
    switchView: language === 'bn' ? 'পরীক্ষা ভিউ পরিবর্তন' : language === 'ar' ? 'تبديل العرض' : 'Test Mode: Switch Role',
    clientRole: language === 'bn' ? 'ক্লায়েন্ট ভিউ' : language === 'ar' ? 'عرض العميل' : 'Client View',
    staffRole: language === 'bn' ? 'স্টাফ ভিউ' : language === 'ar' ? 'عرض الموظف' : 'Staff View',
    typing: language === 'bn' ? `${staffName} টাইপ করছেন...` : language === 'ar' ? `${staffName} يكتب الآن...` : `${staffName} is drafting a reply...`,
    noMessages: language === 'bn' ? 'এখনও কোনো বার্তা আদান-প্রদান হয়নি। প্রজেক্টের প্রয়োজনীয় ফিচার বা রেফারেন্স লিখে পাঠান।' : language === 'ar' ? 'لا توجد رسائل بعد. شارك متطلبات مشروعك مباشرة.' : 'No messages yet. Submit your project requirements or reference links to get started.',
    exportChat: language === 'bn' ? 'ট্রান্সক্রিপ্ট ডাউনলোড' : language === 'ar' ? 'تنزيل المحادثة' : 'Export Transcript',
  };

  // Category Badges Config
  const CATEGORIES: Record<NonNullable<OrderMessage['category']>, { label: string; labelBn: string; color: string; icon: any }> = {
    requirement: { label: 'Requirement', labelBn: 'রিকোয়ারমেন্ট', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: ListChecks },
    specification: { label: 'Technical Spec', labelBn: 'টেকনিক্যাল স্পেক', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', icon: FileCode },
    asset: { label: 'Asset / Mockup', labelBn: 'অ্যাসেট / মকআপ', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: FileText },
    revision: { label: 'Revision', labelBn: 'রিভিশন', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: RefreshCw },
    milestone: { label: 'Milestone', labelBn: 'মাইলস্টোন', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', icon: Layers },
    general: { label: 'General Query', labelBn: 'সাধারণ বার্তা', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', icon: MessageSquare }
  };

  // Pre-configured quick requirement templates
  const QUICK_REQUIREMENT_PRESETS = [
    {
      category: 'requirement' as const,
      label: language === 'bn' ? '📋 ফাংশনাল ব্রিফ' : '📋 Functional Brief',
      text: language === 'bn' 
        ? 'আসসালামু আলাইকুম! আমার এই প্রজেক্টের জন্য মূল ফ্রন্টএন্ড এবং ব্যাকএন্ড ফাংশনালিটিগুলো প্রয়োজন:'
        : 'Hello team! Here are the core functional requirements for this order:'
    },
    {
      category: 'specification' as const,
      label: language === 'bn' ? '⚙️ পেমেন্ট ও API স্পেক' : '⚙️ API & Gateway Setup',
      text: language === 'bn'
        ? 'আমাদের পেমেন্ট গেটওয়ের জন্য bKash, Nagad এবং SSLCommerz মার্চেন্ট কী কনফিগারেশন দরকার।'
        : 'We need payment gateway integration credentials configured for bKash, Nagad, and SSLCommerz API callbacks.'
    },
    {
      category: 'asset' as const,
      label: language === 'bn' ? '🎨 ডিজাইন রেফারেন্স' : '🎨 UI / Brand Assets',
      text: language === 'bn'
        ? 'ব্র্যান্ড লোগো, কালার প্যালেট এবং ডেমো লেআউট রেফারেন্স লিংক শেয়ার করছি।'
        : 'Sharing our brand palette hex codes, logo vector assets, and UI layout references for review.'
    },
    {
      category: 'milestone' as const,
      label: language === 'bn' ? '⏱️ ডেলিভারি সময়সূচি' : '⏱️ Timeline Query',
      text: language === 'bn'
        ? 'প্রথম ফেজের ডেমো বা স্টেজ প্রিভিউ লিঙ্ক কবে নাগাদ চেক করা সম্ভব হবে?'
        : 'Could you share an estimated timeline for the first staging milestone preview link?'
    }
  ];

  // Save requirements list changes
  useEffect(() => {
    localStorage.setItem(`order_reqs_${order.id}`, JSON.stringify(requirementsList));
  }, [requirementsList, order.id]);

  // Initial load & real-time sync via Firestore + LocalStorage fallback
  useEffect(() => {
    // 1. Load cached local messages first
    const cachedKey = `order_chat_${order.id}`;
    const cached = localStorage.getItem(cachedKey);
    let initialMessages: OrderMessage[] = [];

    if (cached) {
      try {
        initialMessages = JSON.parse(cached);
        setMessages(initialMessages);
      } catch (e) {
        console.warn('Failed to parse cached chat', e);
      }
    }

    // Seed default welcome message if totally empty
    if (initialMessages.length === 0) {
      const defaultWelcome: OrderMessage = {
        id: `sys-init-${order.id}`,
        orderId: order.id,
        senderId: 'staff-sys',
        senderName: staffName,
        senderRole: 'staff',
        senderAvatar: staffInfo.avatar,
        message: language === 'bn'
          ? `আসসালামু আলাইকুম! আমি ${staffName}, আপনার "${order.itemTitle}" অর্ডারের দায়িত্বপ্রাপ্ত টেকনিক্যাল লিড। প্রজেক্টের যেকোনো কাস্টম রিকোয়ারমেন্ট, ফিচার রিকুয়েস্ট বা স্পেসিফিকেশন এখানে সরাসরি জানাতে পারেন। আমরা অগ্রাধিকার দিয়ে কাজ সম্পন্ন করব!`
          : `Assalamu Alaikum! I am ${staffName}, your assigned lead engineer for "${order.itemTitle}". Feel free to share your specific functional requirements, design references, or milestones here. Our engineering team is ready to assist!`,
        createdAt: new Date().toISOString(),
        category: 'requirement',
        status: 'read'
      };
      initialMessages = [defaultWelcome];
      setMessages(initialMessages);
      localStorage.setItem(cachedKey, JSON.stringify(initialMessages));
    }

    // 2. Setup real-time Firestore listener on /orders/{orderId}/messages
    let unsubscribe: (() => void) | null = null;
    try {
      const messagesRef = collection(db, 'orders', order.id, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteMsgs: OrderMessage[] = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              orderId: data.orderId || order.id,
              senderId: data.senderId || 'anon',
              senderName: data.senderName || 'Anonymous',
              senderRole: data.senderRole || 'client',
              senderAvatar: data.senderAvatar,
              message: data.message || '',
              createdAt: data.createdAt || new Date().toISOString(),
              category: data.category || 'requirement',
              attachments: data.attachments || [],
              status: data.status || 'delivered'
            };
          });

          setMessages(remoteMsgs);
          localStorage.setItem(cachedKey, JSON.stringify(remoteMsgs));
        }
      }, (error) => {
        // Safe graceful fallback if offline or sandboxed
        console.info('Firestore onSnapshot active in resilient local mode:', error.message);
      });
    } catch (err) {
      console.warn('Real-time Firestore listener unavailable; operating in reactive storage mode.');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [order.id, staffName, staffInfo.avatar, language, order.itemTitle]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStaffTyping]);

  // Send Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const msgText = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!msgText && attachedFiles.length === 0) return;

    const isSendingAsStaff = perspective === 'staff';
    const senderName = isSendingAsStaff 
      ? staffName 
      : (user?.name || order.customerName || order.guestName || 'Client');
    const senderRole: OrderMessage['senderRole'] = isSendingAsStaff ? 'staff' : 'client';
    const senderAvatar = isSendingAsStaff 
      ? staffInfo.avatar 
      : (user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

    const newMsg: OrderMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      orderId: order.id,
      senderId: isSendingAsStaff ? 'staff-id' : (user?.id || 'client-id'),
      senderName,
      senderRole,
      senderAvatar,
      message: msgText,
      createdAt: new Date().toISOString(),
      category: selectedCategory,
      attachments: [...attachedFiles],
      status: 'sent'
    };

    // Update state immediately (optimistic UI)
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(`order_chat_${order.id}`, JSON.stringify(updated));

    setInputText('');
    setAttachedFiles([]);

    // Persist to real-time Firestore database
    try {
      const msgDocRef = doc(db, 'orders', order.id, 'messages', newMsg.id);
      await setDoc(msgDocRef, {
        id: newMsg.id,
        orderId: newMsg.orderId,
        senderId: newMsg.senderId,
        senderName: newMsg.senderName,
        senderRole: newMsg.senderRole,
        senderAvatar: newMsg.senderAvatar || null,
        message: newMsg.message,
        createdAt: newMsg.createdAt,
        category: newMsg.category,
        attachments: newMsg.attachments,
        status: 'delivered'
      });
    } catch (err) {
      console.info('Firestore message dispatch logged locally:', err);
    }

    // Auto Staff Reply Simulation if sent by client
    if (!isSendingAsStaff && autoStaffReplyEnabled) {
      setIsStaffTyping(true);
      setTimeout(async () => {
        setIsStaffTyping(false);
        const replyText = generateContextualStaffReply(msgText, selectedCategory, staffName, order.itemTitle, language);
        
        const staffMsg: OrderMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          orderId: order.id,
          senderId: 'staff-id',
          senderName: staffName,
          senderRole: 'staff',
          senderAvatar: staffInfo.avatar,
          message: replyText,
          createdAt: new Date().toISOString(),
          category: selectedCategory,
          status: 'delivered'
        };

        setMessages(prev => {
          const n = [...prev, staffMsg];
          localStorage.setItem(`order_chat_${order.id}`, JSON.stringify(n));
          return n;
        });

        try {
          const staffDoc = doc(db, 'orders', order.id, 'messages', staffMsg.id);
          await setDoc(staffDoc, {
            ...staffMsg,
            senderAvatar: staffInfo.avatar
          });
        } catch (e) {
          /* ignore */
        }
      }, 1600);
    }
  };

  // Generate responsive staff response based on requirement topic
  const generateContextualStaffReply = (
    clientQuery: string, 
    category: OrderMessage['category'], 
    engineerName: string, 
    productName: string,
    lang: Language
  ) => {
    const qLower = clientQuery.toLowerCase();
    
    if (lang === 'bn') {
      if (category === 'specification' || qLower.includes('api') || qLower.includes('bkash') || qLower.includes('database')) {
        return `ধন্যবাদ! আপনার টেকনিক্যাল স্পেসিফিকেশনগুলো নোট করা হয়েছে। আমরা এই প্রজেক্টের এপিআই হ্যান্ডলার ও সিকিউর কনফিগারেশনের সাথে এগুলো ইন্টিগ্রেট করে টেস্ট রান করব। যেকোনো আপডেট এখানে শেয়ার করব।`;
      }
      if (category === 'asset' || qLower.includes('design') || qLower.includes('logo') || qLower.includes('ui')) {
        return `ডিজাইন অ্যাসেট ও রেফারেন্সগুলোর জন্য ধন্যবাদ। আমাদের UI টিম আপনার নির্ধারিত ব্র্যান্ড প্যালেট অনুযায়ী লেআউট ফাইনাল করছে। কিছুক্ষণের মধ্যে প্রিভিউ শেয়ার করব।`;
      }
      if (category === 'milestone' || qLower.includes('delivery') || qLower.includes('time')) {
        return `আপনার মাইলস্টোন সংক্রান্ত অনুরোধ পেয়েছি। আমরা বর্তমানে মূল আর্কিটেকচার সম্পন্ন করছি। ২৪ থেকে ৪৮ ঘণ্টার মধ্যে স্টেজ প্রিভিউ রেডি হয়ে যাবে ইনশাআল্লাহ।`;
      }
      return `আসসালামু আলাইকুম! আপনার রিকোয়ারমেন্টটি আমাদের প্রজেক্ট ট্র্যাকিং বোর্ডে যুক্ত করা হয়েছে। আমি সরাসরি এই কাজের তদারকি করছি। কোনো পরিবর্তন প্রয়োজন হলে নির্দ্বিধায় মেসেজ দিন।`;
    }

    // English responses
    if (category === 'specification' || qLower.includes('api') || qLower.includes('database')) {
      return `Thank you! I have reviewed your technical specifications. I am logging these into our sprint tasks and verifying the API callback schemas for ${productName}. Will keep you updated right here!`;
    }
    if (category === 'asset' || qLower.includes('design') || qLower.includes('logo') || qLower.includes('color')) {
      return `Got your design and brand references! Our UI team will strictly adhere to your provided colorways and typographical preferences for this deployment.`;
    }
    if (category === 'milestone' || qLower.includes('timeline') || qLower.includes('deliver') || qLower.includes('status')) {
      return `Understood regarding the milestone timeline. Core modules are progressing steadily. You will receive a functional staging preview link directly through this dashboard as scheduled.`;
    }
    return `Assalamu Alaikum! Received your message regarding "${productName}". I have updated our engineering notes and will ensure your project parameters are fulfilled precisely.`;
  };

  // Handle mock file attachment
  const handleAddSampleAttachment = (type: 'pdf' | 'png' | 'json') => {
    let newAtt: OrderMessageAttachment;
    if (type === 'pdf') {
      newAtt = { name: 'Project_Specification_Brief.pdf', size: '1.4 MB', type: 'application/pdf' };
    } else if (type === 'png') {
      newAtt = { name: 'Homepage_Layout_Wireframe.png', size: '2.8 MB', type: 'image/png' };
    } else {
      newAtt = { name: 'API_Gateway_Configuration.json', size: '24 KB', type: 'application/json' };
    }
    setAttachedFiles(prev => [...prev, newAtt]);
    setIsAttachmentPickerOpen(false);
  };

  // Export Transcript
  const handleExportTranscript = () => {
    const header = `=======================================================\nWEBZONEBD IT SOLUTION - ORDER PROJECT CHAT TRANSCRIPT\nOrder ID: ${order.id}\nItem: ${order.itemTitle}\nAssigned Engineer: ${staffName} (${staffInfo.role})\nClient: ${user?.name || order.customerName || 'Client'}\nDate: ${new Date().toLocaleString()}\n=======================================================\n\n`;
    const body = messages.map(m => `[${new Date(m.createdAt).toLocaleTimeString()}] ${m.senderName} (${m.senderRole.toUpperCase()}): \n${m.category ? `[Category: ${m.category}] ` : ''}${m.message}\n${m.attachments && m.attachments.length > 0 ? `Attachments: ${m.attachments.map(a => a.name).join(', ')}\n` : ''}\n`).join('\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${order.id}_chat_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter messages by search query
  const filteredMessages = messages.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.message.toLowerCase().includes(q) || m.senderName.toLowerCase().includes(q);
  });

  return (
    <div className={`flex flex-col bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${isCompact ? 'h-[620px]' : 'h-[740px]'}`}>
      
      {/* 1. TOP HEADER: STAFF INFORMATION & ACTIVE STATUS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 shrink-0">
        
        {/* Staff details */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img 
              src={staffInfo.avatar} 
              alt={staffName} 
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" title={t.onlineNow} />
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white truncate">{staffName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {t.onlineNow}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
                • {staffInfo.experience}
              </span>
            </div>

            <p className="text-xs text-indigo-300 font-semibold truncate flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>{staffInfo.role}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">{t.responseTime}</span>
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          
          {/* Perspective toggle (for testing/staff response) */}
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPerspective('client')}
              className={`px-2.5 py-1 rounded-lg transition-all ${perspective === 'client' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Speak as Client"
            >
              {t.clientRole}
            </button>
            <button
              type="button"
              onClick={() => setPerspective('staff')}
              className={`px-2.5 py-1 rounded-lg transition-all ${perspective === 'staff' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Speak as Assigned Staff"
            >
              {t.staffRole}
            </button>
          </div>

          {/* Search Toggle */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-xl border transition ${isSearchOpen ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'}`}
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Export Transcript */}
          <button
            type="button"
            onClick={handleExportTranscript}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition"
            title={t.exportChat}
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close button if modalized */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800/80 hover:bg-rose-500/30 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 rounded-xl transition"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SEARCH BAR DROPDOWN */}
      {isSearchOpen && (
        <div className="bg-slate-100 dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-800 p-2.5 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter messages by keyword, requirement..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 2. ORDER CONTEXT & EXPANDABLE REQUIREMENTS CHECKLIST BANNER */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30 px-4 py-2.5 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-600 text-white shrink-0">
              {order.id.startsWith('Order-') ? order.id : `Order-${order.id.slice(-4)}`}
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {order.itemTitle}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsRequirementChecklistOpen(!isRequirementChecklistOpen)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>{t.scopeTracker}</span>
            {isRequirementChecklistOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Requirements Checklist Accordion */}
        <AnimatePresence>
          {isRequirementChecklistOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-1 pb-2 space-y-2 border-t border-indigo-100 dark:border-indigo-900/40 text-left text-xs"
            >
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' 
                  ? 'এই অর্ডারের জন্য গ্রাহক এবং ইঞ্জিনিয়ারদের মধ্যে নির্ধারিত রিকোয়ারমেন্টস পয়েন্টসমূহ:'
                  : 'Agreed requirements tracker between client and assigned engineering staff:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirementsList.map((req) => (
                  <div 
                    key={req.id}
                    className="flex items-start gap-2 p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-neutral-200 dark:border-slate-800 text-[11px]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setRequirementsList(prev => prev.map(r => r.id === req.id ? {
                          ...r,
                          status: r.status === 'agreed' ? 'in_progress' : r.status === 'in_progress' ? 'pending' : 'agreed'
                        } : r));
                      }}
                      className="mt-0.5 shrink-0"
                      title="Toggle milestone state"
                    >
                      {req.status === 'agreed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : req.status === 'in_progress' ? (
                        <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${req.status === 'agreed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {req.text}
                      </p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${req.status === 'agreed' ? 'text-emerald-600 dark:text-emerald-400' : req.status === 'in_progress' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. MESSAGES SCROLLABLE CONVERSATION AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-[#0B1120] text-left">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <MessageSquare className="w-12 h-12 stroke-[1.2] text-indigo-400 mb-3 opacity-60" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'কোনো বার্তা নেই' : 'Start Project Discussion'}
            </h4>
            <p className="text-xs max-w-sm mt-1 text-slate-500 leading-relaxed">
              {t.noMessages}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isClientMsg = msg.senderRole === 'client';
            const isStaffMsg = msg.senderRole === 'staff';
            const categoryMeta = msg.category ? CATEGORIES[msg.category] : CATEGORIES['general'];
            const CategoryIcon = categoryMeta.icon;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isClientMsg ? 'justify-end' : 'justify-start'}`}
              >
                {/* Staff Avatar on left */}
                {!isClientMsg && (
                  <div className="relative shrink-0 mt-1">
                    <img
                      src={msg.senderAvatar || staffInfo.avatar}
                      alt={msg.senderName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isClientMsg ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender metadata & category tag */}
                  <div className={`flex items-center gap-2 text-[11px] ${isClientMsg ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {msg.senderName}
                    </span>

                    {/* Category pill */}
                    {msg.category && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${categoryMeta.color}`}>
                        <CategoryIcon className="w-2.5 h-2.5" />
                        <span>{language === 'bn' ? categoryMeta.labelBn : categoryMeta.label}</span>
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Main Bubble */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                      isClientMsg
                        ? 'bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.message}

                    {/* Attached files in bubble */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/20 dark:border-slate-700 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                          {language === 'bn' ? 'সংযুক্ত ফাইল / অ্যাসেট:' : 'Attached Specifications & Assets:'}
                        </span>
                        {msg.attachments.map((att, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between gap-2 p-2 rounded-xl text-xs font-semibold ${
                              isClientMsg
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                            } transition`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
                              <span className="truncate">{att.name}</span>
                              {att.size && <span className="text-[10px] opacity-70">({att.size})</span>}
                            </div>
                            <span className="text-[10px] font-bold underline shrink-0 cursor-pointer">
                              Download
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Read receipts indicator */}
                  {isClientMsg && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                      <span>{msg.status === 'read' ? 'Seen by Engineer' : 'Delivered'}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  )}
                </div>

                {/* Client Avatar on right */}
                {isClientMsg && (
                  <div className="shrink-0 mt-1">
                    <img
                      src={msg.senderAvatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={msg.senderName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#2563EB]/20 shadow-sm"
                    />
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Typing indicator bubble */}
        {isStaffTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 justify-start"
          >
            <img 
              src={staffInfo.avatar} 
              alt={staffName} 
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-indigo-400/40"
            />
            <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 py-2.5 px-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1.5">
                {t.typing}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. QUICK REQUIREMENT PILLS ROW */}
      <div className="bg-slate-100/80 dark:bg-slate-900/90 border-t border-neutral-200/80 dark:border-slate-800/80 px-4 py-2 shrink-0 flex items-center gap-2 overflow-x-auto text-left">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {t.quickRequirements}
        </span>
        {QUICK_REQUIREMENT_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedCategory(preset.category);
              setInputText(prev => prev ? `${prev}\n${preset.text}` : preset.text);
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-neutral-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition whitespace-nowrap shrink-0"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 5. ATTACHMENT PREVIEWS CHIPS */}
      {attachedFiles.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border-t border-indigo-100 dark:border-indigo-900/30 px-4 py-2 flex items-center gap-2 flex-wrap text-xs shrink-0">
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
            Ready to attach:
          </span>
          {attachedFiles.map((f, i) => (
            <span 
              key={i} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400"
            >
              <FileText className="w-3 h-3" />
              <span>{f.name}</span>
              <button 
                type="button"
                onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                className="hover:text-rose-500 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 6. INPUT COMPOSER CONTROLS */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 shrink-0 space-y-2.5">
        
        {/* Category selector row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
              Category:
            </span>
            {(['requirement', 'specification', 'asset', 'milestone', 'general'] as const).map((cat) => {
              const meta = CATEGORIES[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {language === 'bn' ? meta.labelBn : meta.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            {/* Sample Asset Picker Popover Button */}
            <button
              type="button"
              onClick={() => setIsAttachmentPickerOpen(!isAttachmentPickerOpen)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-indigo-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>{t.attachFile}</span>
            </button>

            {isAttachmentPickerOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50 text-left text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <p className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">Attach project spec:</p>
                <button
                  type="button"
                  onClick={() => handleAddSampleAttachment('pdf')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  <span>Specification Brief (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleAttachment('png')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>UI Wireframe / Mockup (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleAttachment('json')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                  <span>API Callback Config (JSON)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Text Input & Send Row */}
        <div className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={t.typePlaceholder}
            rows={2}
            className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-neutral-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] resize-none transition"
          />

          <button
            type="button"
            disabled={!inputText.trim() && attachedFiles.length === 0}
            onClick={() => handleSendMessage()}
            className="p-3.5 bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md active:scale-95 disabled:opacity-40 disabled:hover:from-[#2563EB] disabled:hover:to-indigo-600 disabled:active:scale-100 transition shrink-0 cursor-pointer"
            title={t.send}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderProjectChat;
