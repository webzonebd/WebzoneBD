import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, ShieldCheck, 
  RotateCcw, Lock, LogIn, UserPlus, CheckCircle2,
  AlertCircle, ChevronRight, ArrowLeft, ExternalLink,
  Users, Check, CheckCheck, Clock, Shield, Sliders,
  Globe, User, Phone, Mail, PhoneCall
} from 'lucide-react';
import { Language, UserSession } from '../types';
import { 
  liveChatService, 
  LiveChatSession, 
  LiveChatMessage, 
  LiveChatSettings,
  AdminOverallStatus,
  AdminPresenceStatus,
  CANNED_QUICK_REPLIES,
  QuickReplyCategory,
  loadTawkScript
} from '../services/liveChatService';

// High-fidelity Custom SVG Brand Icons
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.634 1.974 14.161.95 11.531.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.974.521 3.9 1.508 5.592l-.993 3.624 3.738-.973zm10.748-7.234c-.29-.145-1.716-.845-1.982-.94-.265-.097-.457-.145-.65.145-.19.29-.738.94-.905 1.133-.166.19-.332.215-.622.07-1.113-.557-1.907-1.02-2.67-2.333-.186-.316.186-.294.532-.98.093-.19.047-.356-.023-.5-.07-.145-.65-1.564-.89-2.143-.233-.562-.49-.485-.674-.495-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.716-.7 1.961-1.374.244-.673.244-1.25.17-1.372-.074-.122-.27-.195-.56-.34z" />
  </svg>
);

const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.59-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.03.5.15.13.1.17.24.18.34.02.08.03.22.02.35z" />
  </svg>
);

const MessengerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.31 2 2 6.04 2 11c0 2.82 1.41 5.34 3.61 6.94.19.14.3.36.3.59l-.02 1.83c0 .32.32.55.61.43l2.05-.82c.16-.06.35-.06.51-.01 1 .28 2.06.43 3.14.43 5.69 0 10-4.04 10-9s-4.31-9-10-9zm1.09 11.23l-2.05-2.19-4 2.19 4.4-4.68 2.05 2.19 4-2.19-4.4 4.68z" />
  </svg>
);

interface LiveChatWidgetProps {
  language: Language;
  currentPage?: string;
  user?: UserSession | null;
  isAdmin?: boolean;
  onOpenAdminChat?: () => void;
  onOpenAuth?: (view?: 'login' | 'register') => void;
  currency?: string;
  theme?: string;
}

const ACTIVE_CHAT_SESSION_STORAGE_KEY = 'webzone_visitor_active_chat_id';

const CANNED_STAFF_REPLIES = [
  "Assalamu Alaikum! How can I assist with your project today?",
  "Could you please share your 6-digit Order ID or email?",
  "Yes! We offer custom React/Node development with full source code.",
  "Our NVMe hosting includes 99.9% uptime SLA, cPanel & free SSL.",
  "Our engineering team is reviewing your requirements right away."
];

export default function LiveChatWidget({ 
  language, 
  currentPage = '/', 
  user, 
  isAdmin = false,
  onOpenAdminChat,
  onOpenAuth 
}: LiveChatWidgetProps) {
  const isUserAdmin = Boolean(isAdmin || (user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor')));

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'channels'>('live');
  const [isAnyPopupActive, setIsAnyPopupActive] = useState(false);

  // Settings
  const [settings, setSettings] = useState<LiveChatSettings>(liveChatService.getSettings());

  // --- VISITOR & CUSTOMER CHAT STATE ---
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_CHAT_SESSION_STORAGE_KEY) || null;
  });
  const [currentSession, setCurrentSession] = useState<LiveChatSession | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);

  // Visitor & Customer Form Fields (Name, Mobile Number, Email Address are mandatory before entering chat)
  const [visitorName, setVisitorName] = useState(user?.name || '');
  const [visitorPhone, setVisitorPhone] = useState(user?.phone || '');
  const [visitorEmail, setVisitorEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState('Website & E-Commerce');
  const [initialInquiry, setInitialInquiry] = useState('');
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [visitorPreChatMode, setVisitorPreChatMode] = useState<'visitor' | 'login'>('visitor');

  // Visitor typing input
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // --- ADMIN OPERATOR STATE ---
  const [adminSessions, setAdminSessions] = useState<LiveChatSession[]>([]);
  const [adminSelectedSessionId, setAdminSelectedSessionId] = useState<string | null>(null);
  const [adminSelectedMessages, setAdminSelectedMessages] = useState<LiveChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isAdminReplying, setIsAdminReplying] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState<'operator' | 'visitor'>('operator');
  const [adminQuickCategory, setAdminQuickCategory] = useState<QuickReplyCategory>('all');
  const [adminQueueFilter, setAdminQueueFilter] = useState<'all' | 'customers' | 'visitors' | 'waiting'>('all');

  // Real-time admin presence status ('online' | 'away' | 'offline')
  const [adminPresence, setAdminPresence] = useState<AdminOverallStatus>(() => liveChatService.getAdminOverallStatus());
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adminMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-sync visitor credentials with logged in user & restore customer session
  useEffect(() => {
    if (user) {
      if (!visitorName || visitorName.startsWith('Guest')) {
        setVisitorName(user.name || '');
      }
      if (!visitorEmail) {
        setVisitorEmail(user.email || '');
      }
      if (!visitorPhone && user.phone) {
        setVisitorPhone(user.phone || '');
      }
      if (!activeChatId && !isUserAdmin) {
        const existing = liveChatService.findSessionByUser(user.id, user.email);
        if (existing) {
          setActiveChatId(existing.id);
          localStorage.setItem(ACTIVE_CHAT_SESSION_STORAGE_KEY, existing.id);
        }
      }
    }
  }, [user, isUserAdmin, activeChatId]);

  // Load Tawk.to if configured
  useEffect(() => {
    const chatSettings = liveChatService.getSettings();
    setSettings(chatSettings);

    if ((chatSettings.provider === 'tawk' || chatSettings.provider === 'both') && chatSettings.tawkPropertyId) {
      loadTawkScript(chatSettings.tawkPropertyId, chatSettings.tawkWidgetId);
    }
  }, []);

  // Popup overlay detector
  useEffect(() => {
    const checkPopups = () => {
      const hasCart = document.getElementById('shopping-cart-slideover-panel');
      const hasOrderModal = document.getElementById('wbd-whatsapp-order-modal');
      const hasAuth = document.getElementById('auth-popup-container');
      const hasSuccess = document.getElementById('congratulations-success-popup');
      setIsAnyPopupActive(!!(hasCart || hasOrderModal || hasAuth || hasSuccess));
    };

    checkPopups();
    window.addEventListener('wbd_popup_changed', checkPopups);
    window.addEventListener('whatsapp_order_modal_opened', checkPopups);
    window.addEventListener('whatsapp_order_modal_closed', checkPopups);
    const interval = setInterval(checkPopups, 350);

    return () => {
      window.removeEventListener('wbd_popup_changed', checkPopups);
      window.removeEventListener('whatsapp_order_modal_opened', checkPopups);
      window.removeEventListener('whatsapp_order_modal_closed', checkPopups);
      clearInterval(interval);
    };
  }, []);

  // Subscribe to visitor's active session & messages
  useEffect(() => {
    if (!activeChatId) {
      setCurrentSession(null);
      setMessages([]);
      return;
    }

    const unsubSessions = liveChatService.subscribeToSessions((allSessions) => {
      const found = allSessions.find(s => s.id === activeChatId);
      if (found) {
        setCurrentSession(found);
      }
    });

    const unsubMessages = liveChatService.subscribeToMessages(activeChatId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      unsubSessions();
      unsubMessages();
    };
  }, [activeChatId]);

  // Subscribe to all sessions for Admin view
  useEffect(() => {
    if (!isUserAdmin) return;
    const unsub = liveChatService.subscribeToSessions((all) => {
      setAdminSessions(all);
    });
    return () => unsub();
  }, [isUserAdmin]);

  // Subscribe to selected session's messages for Admin view
  useEffect(() => {
    if (!adminSelectedSessionId) {
      setAdminSelectedMessages([]);
      return;
    }
    const unsub = liveChatService.subscribeToMessages(adminSelectedSessionId, (msgs) => {
      setAdminSelectedMessages(msgs);
      setTimeout(() => {
        adminMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsub();
  }, [adminSelectedSessionId]);

  // Subscribe to real-time admin presence (Online / Away / Offline)
  useEffect(() => {
    const unsubPresence = liveChatService.subscribeToAdminPresence((status) => {
      setAdminPresence(status);
    });

    let stopHeartbeat: (() => void) | null = null;
    if (isUserAdmin && user) {
      stopHeartbeat = liveChatService.startAdminHeartbeat(user.id, user.name, user.role || 'admin');
    }

    return () => {
      unsubPresence();
      if (stopHeartbeat) stopHeartbeat();
    };
  }, [isUserAdmin, user]);

  // Admin manually toggles status
  const handleSetOperatorStatus = async (newStatus: AdminPresenceStatus) => {
    setIsUpdatingStatus(true);
    if (user?.id) {
      await liveChatService.setAdminPresenceStatus(user.id, newStatus);
    }
    await liveChatService.setAllAdminsStatus(newStatus);
    setIsUpdatingStatus(false);
  };

  if (isAnyPopupActive) {
    return null;
  }

  // Count active/waiting sessions for admin badge
  const adminWaitingCount = adminSessions.filter(s => s.status === 'waiting' || (s.status === 'active' && s.unreadStaffCount > 0)).length;
  const adminActiveCount = adminSessions.filter(s => s.status === 'active' || s.status === 'waiting').length;
  const adminSelectedSession = adminSessions.find(s => s.id === adminSelectedSessionId);

  // Localized text dictionary
  const textDict = {
    en: {
      headerTitle: isUserAdmin ? "Admin Live Support Desk" : user ? "Customer Live Support" : "WebzoneBD Live Support",
      headerSubtitle: isUserAdmin ? "Real-time Operator Dispatch & Chat" : "Direct Chat with WebzoneBD Engineers",
      onlineStatus: isUserAdmin ? "Support Agent Online" : "Support Staff Online (Typical reply: < 2 mins)",
      statusOnline: "Online",
      statusAway: "Away",
      statusOffline: "Offline",
      onlineSubtitle: "Staff Online (Typical reply: < 2 mins)",
      awaySubtitle: "Staff Away (Replies in 5-15 mins)",
      offlineSubtitle: "Staff Offline (Leave message / WhatsApp)",
      awayNotice: "Our support engineers are temporarily away from the console. You can leave your message below and we will respond in 5-15 mins.",
      offlineNotice: "Support operators are currently offline. Leave your inquiry below or connect 24/7 on WhatsApp.",
      tabLive: isUserAdmin ? "🛡️ Live Support Desk" : user ? "👤 Customer Chat" : "💬 Live Chat",
      tabChannels: "⚡ WhatsApp & Call",
      authRequiredTitle: "Customer Account Login",
      authRequiredDesc: "Log in with your customer account to connect previous orders, verify your identity with IT engineers, and save persistent ticket history.",
      btnLogin: "Log In to Customer Account",
      btnRegister: "Create Free Account",
      authBenefit1: "Direct connection with verified IT engineers",
      authBenefit2: "Persistent chat history & order linking",
      authBenefit3: "Priority SLA response time (< 2 mins)",
      authNote: "Prefer instant guest messaging? You can chat as visitor or WhatsApp without an account.",
      verifiedClient: "Verified Customer Session",
      guestVisitor: "Guest Visitor Session",
      startChatTitle: user ? "Message Support Admin (Customer Desk)" : "Start Live Chat with Support Admin",
      startChatDesc: "Visitors and customers can send inquiries directly to the WebzoneBD Admin desk.",
      nameLabel: "Your Name",
      namePlaceholder: "e.g. Tanvir Ahmed",
      contactLabel: "Email or WhatsApp",
      contactPlaceholder: "e.g. name@email.com or +8801...",
      deptLabel: "Inquiry Topic",
      msgLabel: "How can we help you?",
      msgPlaceholder: "Briefly describe your question or project...",
      btnStart: "Send Message to Admin",
      btnStartVisitor: "Start Visitor Chat Now",
      placeholder: user ? "Type your customer message to admin..." : "Write a message to support admin...",
      btnSend: "Send",
      btnEnd: "New Inquiry",
      directPhone: "Direct Line: +966 57 051 1931 / 0186 400 0005",
      quickSupport: "Riyadh & Dhaka Technical Hubs Active"
    },
    bn: {
      headerTitle: isUserAdmin ? "এডমিন লাইভ সাপোর্ট ডেস্ক" : user ? "কাস্টমার লাইভ সাপোর্ট" : "ওয়েবজোনবিডি লাইভ সাপোর্ট",
      headerSubtitle: isUserAdmin ? "রিয়েল-টাইম লাইভ চ্যাট কন্ট্রোল" : "এডমিনের সাথে সরাসরি লাইভ চ্যাট",
      onlineStatus: isUserAdmin ? "সাপোর্ট এজেন্ট অনলাইন" : "সাপোর্ট স্টাফ অনলাইনে আছেন (গড় উত্তর: < ২ মিনিট)",
      statusOnline: "অনলাইন",
      statusAway: "ব্যস্ত / দূরে",
      statusOffline: "অফলাইন",
      onlineSubtitle: "স্টাফ অনলাইনে আছেন (উত্তর: < ২ মিনিট)",
      awaySubtitle: "স্টাফ সাময়িক দূরে (উত্তর: ৫-১৫ মিনিট)",
      offlineSubtitle: "স্টাফ অফলাইনে (মেসেজ রাখুন / হোয়াটসঅ্যাপ)",
      awayNotice: "আমাদের সাপোর্ট ইঞ্জিনিয়াররা সাময়িকভাবে ডেস্ক থেকে দূরে আছেন। আপনি মেসেজ রেখে যেতে পারেন, ৫-১৫ মিনিটে উত্তর দেওয়া হবে।",
      offlineNotice: "সাপোর্ট অপারেটর বর্তমানে অফলাইনে আছেন। আপনার বার্তাটি পাঠান অথবা ২৪/৭ হোয়াটসঅ্যাপে যোগাযোগ করুন।",
      tabLive: isUserAdmin ? "🛡️ এডমিন ডেস্ক" : user ? "👤 কাস্টমার চ্যাট" : "💬 লাইভ চ্যাট",
      tabChannels: "⚡ হোয়াটসঅ্যাপ ও কল",
      authRequiredTitle: "কাস্টমার একাউন্ট লগইন",
      authRequiredDesc: "আপনার পূর্বের অর্ডার লিঙ্ক করতে এবং চ্যাট হিস্টোরি সুরক্ষিত রাখতে কাস্টমার একাউন্টে লগইন করুন বা ফ্রিতে একাউন্ট খুলুন।",
      btnLogin: "কাস্টমার লগইন",
      btnRegister: "নতুন একাউন্ট খুলুন",
      authBenefit1: "সরাসরি অভিজ্ঞ আইটি ইঞ্জিনিয়ারের সাথে চ্যাট",
      authBenefit2: "পূর্বের অর্ডার ও চ্যাট হিস্টোরি লিঙ্ক সুবিধা",
      authBenefit3: "অগ্রাধিকার ভিত্তিতে দ্রুততম সমাধান (< ২ মিনিট)",
      authNote: "লগইন ছাড়াও সরাসরি ভিজিটর হিসেবে বা হোয়াটসঅ্যাপে মেসেজ পাঠাতে পারবেন।",
      verifiedClient: "ভেরিফাইড কাস্টমার সেশন",
      guestVisitor: "গেস্ট ভিজিটর সেশন",
      startChatTitle: user ? "এডমিনকে বার্তা পাঠান (কাস্টমার ডেস্ক)" : "এডমিনের সাথে লাইভ চ্যাট শুরু করুন",
      startChatDesc: "ভিজিটর ও কাস্টমার সরাসরি এডমিনকে মেসেজ পাঠাতে পারবেন।",
      nameLabel: "আপনার নাম",
      namePlaceholder: "যেমন: তানভীর আহমেদ",
      contactLabel: "ইমেইল বা হোয়াটসঅ্যাপ",
      contactPlaceholder: "যেমন: name@email.com বা 017...",
      deptLabel: "অনুসন্ধানের বিষয়",
      msgLabel: "আমরা কীভাবে সহায়তা করতে পারি?",
      msgPlaceholder: "আপনার প্রশ্ন বা প্রজেক্টের সংক্ষিপ্ত বিবরণ দিন...",
      btnStart: "এডমিনকে মেসেজ পাঠান",
      btnStartVisitor: "ভিজিটর চ্যাট শুরু করুন",
      placeholder: user ? "এডমিনের জন্য আপনার বার্তাটি লিখুন..." : "আপনার বার্তাটি লিখুন...",
      btnSend: "পাঠান",
      btnEnd: "নতুন চ্যাট",
      directPhone: "হেল্পলাইন: +966 57 051 1931 / 0186 400 0005",
      quickSupport: "রিয়াদ ও ঢাকা টেকনিক্যাল হাব সক্রিয়"
    },
    ar: {
      headerTitle: isUserAdmin ? "مكتب الدعم المباشر للإدارة" : user ? "الدعم المباشر للعملاء" : "الدعم المباشر WebzoneBD",
      headerSubtitle: "الدعم الفوري والهندسة التقنية",
      onlineStatus: "الدعم متصل الآن (الرد في أقل من دقيقتين)",
      statusOnline: "متصل",
      statusAway: "غير متاح مؤقتاً",
      statusOffline: "غير متصل",
      onlineSubtitle: "الفريق متصل (الرد في أقل من دقيقتين)",
      awaySubtitle: "الفريق غير متاح مؤقتاً (الرد خلال 5-15 دقيقة)",
      offlineSubtitle: "الفريق غير متصل (يمكنك ترك رسالة أو واتساب)",
      awayNotice: "فريقنا الهندسي غير متاح مؤقتاً في لوحة التحكم. اترك رسالتك وسنرد خلال 5-15 دقيقة.",
      offlineNotice: "فريق الدعم غير متصل حالياً. اترك رسالتك أو تواصل معنا على مدار الساعة عبر واتساب.",
      tabLive: isUserAdmin ? "🛡️ مكتب الدعم" : user ? "👤 محادثة العميل" : "💬 محادثة مباشرة",
      tabChannels: "⚡ واتساب وهاتف",
      authRequiredTitle: "تسجيل الدخول مطلوب للمحادثة",
      authRequiredDesc: "لضمان أولوية الدعم الهندسي وتتبع تاريخ استفساراتك، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد مجاناً.",
      btnLogin: "تسجيل الدخول",
      btnRegister: "إنشاء حساب جديد",
      authBenefit1: "اتصال مباشر مع مهندسي الدعم الفني",
      authBenefit2: "حفظ سجل المحادثات وربط الطلبات",
      authBenefit3: "أولوية الرد من مراكز الرياض ودكا",
      authNote: "استفسار عاجل بدون حساب؟ يمكنك مراسلتنا فوراً عبر الواتساب أو كزائر.",
      verifiedClient: "جلسة عميل موثقة",
      guestVisitor: "جلسة زائر عادي",
      startChatTitle: "ابدأ محادثة مباشرة مع فريق الدعم",
      startChatDesc: "يمكن للزوار والعملاء مراسلة إدارة الدعم الفني فوراً.",
      nameLabel: "الاسم",
      namePlaceholder: "مثال: فيصل العتيبي",
      contactLabel: "البريد الإلكتروني أو الواتساب",
      contactPlaceholder: "example@domain.com أو +966...",
      deptLabel: "موضوع الاستفسار",
      msgLabel: "كيف يمكننا مساعدتك اليوم؟",
      msgPlaceholder: "اكتب تفاصيل استفسارك أو طلبك التقني...",
      btnStart: "إرسال الرسالة للإدارة",
      btnStartVisitor: "بدء المحادثة كزائر",
      placeholder: "اكتب رسالتك إلى مهندس الدعم...",
      btnSend: "إرسال",
      btnEnd: "محادثة جديدة",
      directPhone: "الهاتف المباشر: +966 57 051 1931",
      quickSupport: "مراكز الدعم بالرياض ودكا جاهزة للخدمة"
    }
  };

  const t = textDict[language] || textDict.en;

  // Trigger Auth Popup
  const handleOpenAuthModal = (view: 'login' | 'register') => {
    if (onOpenAuth) {
      onOpenAuth(view);
    } else {
      window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { view } }));
    }
  };

  // Handle Start Visitor or Customer Chat Session (Enforces Name, Mobile Number, and Email Address)
  const handleStartChatSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = visitorName.trim();
    const phone = visitorPhone.trim();
    const email = visitorEmail.trim();

    // 1. Mandatory Name Validation
    if (!name || name.length < 2) {
      setFormError(
        language === 'bn' 
          ? 'দয়া করে আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)।' 
          : language === 'ar' 
          ? 'يرجى إدخال اسمك الكامل (حرفين على الأقل).' 
          : 'Please provide your full name (minimum 2 characters).'
      );
      return;
    }

    // 2. Mandatory Mobile Number Validation
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!phone || cleanPhone.length < 7) {
      setFormError(
        language === 'bn' 
          ? 'দয়া করে সঠিক মোবাইল নাম্বার লিখুন (যেমন: 017XXXXXXXX বা +880...)' 
          : language === 'ar' 
          ? 'يرجى إدخال رقم هاتف محمول صحيح للتواصل.' 
          : 'Please enter a valid mobile number (e.g. 017XXXXXXXX or +880...).'
      );
      return;
    }

    // 3. Mandatory Email Address Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFormError(
        language === 'bn' 
          ? 'দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন (যেমন: name@example.com)' 
          : language === 'ar' 
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح (مثال: name@example.com)' 
          : 'Please enter a valid email address (e.g. name@example.com).'
      );
      return;
    }

    setIsStartingChat(true);

    try {
      const isCustomer = Boolean(user && user.role !== 'admin');
      const result = await liveChatService.createVisitorSession({
        visitorName: name,
        visitorEmail: email,
        visitorPhone: phone,
        department,
        initialMessage: initialInquiry.trim() || (isCustomer 
          ? `Assalamu Alaikum! I am customer ${name} (${phone}). I have an inquiry regarding WebzoneBD services.` 
          : `Assalamu Alaikum! I would like to inquire about WebzoneBD IT services. (Name: ${name}, Phone: ${phone}, Email: ${email})`),
        visitorPage: currentPage,
        isCustomer,
        customerUserId: user?.id,
        userRole: isCustomer ? 'customer' : 'visitor'
      });

      setActiveChatId(result.session.id);
      localStorage.setItem(ACTIVE_CHAT_SESSION_STORAGE_KEY, result.session.id);
      setCurrentSession(result.session);
    } catch {
      // Fallback
    } finally {
      setIsStartingChat(false);
    }
  };

  // Handle Send Visitor or Customer Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim() || !activeChatId || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const text = newMessageText.trim();
      setNewMessageText('');
      const isCustomer = Boolean(user && user.role !== 'admin');
      await liveChatService.sendVisitorMessage(
        activeChatId, 
        text, 
        user?.name || currentSession?.visitorName || (isCustomer ? 'Customer' : 'Visitor'),
        user?.id || currentSession?.visitorId || 'vis_user',
        {
          isCustomer,
          customerUserId: user?.id
        }
      );
    } catch {
      // Fallback
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle Admin Staff Reply
  const handleAdminSendReply = async (customMsg?: string) => {
    const text = (customMsg || adminReplyText).trim();
    if (!text || !adminSelectedSessionId || isAdminReplying) return;

    setIsAdminReplying(true);
    try {
      await liveChatService.sendStaffMessage(
        adminSelectedSessionId,
        text,
        user?.name || 'Support Specialist',
        user?.id || 'admin_op'
      );
      setAdminReplyText('');
    } catch {
      // Fallback
    } finally {
      setIsAdminReplying(false);
    }
  };

  // Handle Admin Resolve Session
  const handleAdminResolve = async () => {
    if (!adminSelectedSessionId) return;
    try {
      await liveChatService.resolveSession(adminSelectedSessionId);
    } catch {
      // Fallback
    }
  };

  // End / Reset chat
  const handleEndChat = () => {
    if (confirm(language === 'bn' ? 'আপনি কি নতুন চ্যাট শুরু করতে চান?' : 'Start a fresh live chat session?')) {
      setActiveChatId(null);
      localStorage.removeItem(ACTIVE_CHAT_SESSION_STORAGE_KEY);
      setInitialInquiry('');
    }
  };

  // WhatsApp click handler
  const handleStartWhatsApp = (text?: string) => {
    const cleanMsg = encodeURIComponent(
      text || initialInquiry || "Assalamu Alaikum WebzoneBD, I would like to inquire about your premium IT solutions and custom system scripts."
    );
    window.open(`https://wa.me/966570511931?text=${cleanMsg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 md:left-6 z-50 flex flex-col items-start gap-2.5 font-sans" id="live-chat-floating-root">
      
      {/* Expanded Live Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.2, 
              y: 40,
              x: -15,
              transformOrigin: "bottom left"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: 0,
              transformOrigin: "bottom left"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.2, 
              y: 40,
              x: -15,
              transformOrigin: "bottom left"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 380, 
              damping: 26, 
              mass: 0.85 
            }}
            className="w-[320px] sm:w-[390px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-slate-200/90 dark:border-slate-800/90 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl text-left will-change-transform flex flex-col max-h-[600px]"
          >
            {/* Header with macOS dots and Tab Switcher */}
            <div className={`p-4 text-white relative border-b border-white/10 shrink-0 ${
              isUserAdmin 
                ? 'bg-gradient-to-r from-cyan-700 via-indigo-700 to-slate-900' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-slate-900 dark:via-blue-950/50 dark:to-slate-900'
            }`}>
              
              {/* Row 1: Brand Title + Status Badge (Left) & Actions (Admin Hub / End / Close X) (Right) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h4 className="font-extrabold text-[13px] sm:text-[14px] tracking-tight text-white truncate flex items-center gap-1">
                    {isUserAdmin && <Shield className="w-3 h-3 text-cyan-300 shrink-0" />}
                    <span>{t.headerTitle}</span>
                    <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                  </h4>

                  {/* Real-time status pill */}
                  {adminPresence.status === 'online' ? (
                    <span 
                      id="live-chat-status-indicator-online"
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                      </span>
                      <span>{t.statusOnline}</span>
                    </span>
                  ) : adminPresence.status === 'away' ? (
                    <span 
                      id="live-chat-status-indicator-away"
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/30 text-amber-200 border border-amber-400/50 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                      </span>
                      <span>{t.statusAway}</span>
                    </span>
                  ) : (
                    <span 
                      id="live-chat-status-indicator-offline"
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-600/60 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                      <span>{t.statusOffline}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isUserAdmin ? (
                    <button
                      onClick={() => {
                        if (onOpenAdminChat) {
                          onOpenAdminChat();
                        } else {
                          localStorage.setItem('webzone_admin_active_menu', 'live-chat');
                          window.location.href = '/admin';
                        }
                        setIsOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer border border-white/20 shadow-xs"
                      title="Open Full Live Chat Control Center"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{language === 'bn' ? 'এডমিন প্যানেল' : 'Admin Hub'}</span>
                    </button>
                  ) : user && activeChatId ? (
                    <button
                      onClick={handleEndChat}
                      className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                      title="Start fresh conversation"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t.btnEnd}</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: SLA & Admins Active Count (Left) + Operator Status Toggle (Right) */}
              <div className="mt-1.5 pt-1.5 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap">
                {/* SLA and Active Admins Count */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] leading-tight text-white/90 font-medium truncate">
                  <span>
                    {adminPresence.status === 'online' 
                      ? t.onlineSubtitle 
                      : adminPresence.status === 'away' 
                        ? t.awaySubtitle 
                        : t.offlineSubtitle}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-cyan-200 font-mono font-bold">
                    {adminPresence.activeCount > 0 
                      ? `${adminPresence.activeCount} Admin${adminPresence.activeCount > 1 ? 's' : ''} Active`
                      : adminPresence.awayCount > 0 
                        ? `${adminPresence.awayCount} Admin Away` 
                        : '0 Active'}
                  </span>
                </div>

                {/* Inline Operator Status Switcher for Admin */}
                {isUserAdmin && (
                  <div className="inline-flex items-center bg-black/40 rounded-md p-0.5 border border-white/10 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleSetOperatorStatus('online')}
                      disabled={isUpdatingStatus}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
                        adminPresence.status === 'online' ? 'bg-emerald-500 text-white shadow-xs' : 'text-white/70 hover:text-white'
                      }`}
                      title={`Status: Online (${adminPresence.activeCount} active node)`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                      <span>Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetOperatorStatus('away')}
                      disabled={isUpdatingStatus}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
                        adminPresence.status === 'away' ? 'bg-amber-500 text-white shadow-xs' : 'text-white/70 hover:text-white'
                      }`}
                      title="Status: Away"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      <span>Away</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetOperatorStatus('offline')}
                      disabled={isUpdatingStatus}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
                        adminPresence.status === 'offline' ? 'bg-slate-700 text-white shadow-xs' : 'text-white/70 hover:text-white'
                      }`}
                      title="Status: Offline"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Offline</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Primary Navigation Tabs */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 bg-black/20 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('live')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'live' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{t.tabLive}</span>
                  {isUserAdmin ? (
                    adminWaitingCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black leading-tight">
                        {adminWaitingCount}
                      </span>
                    )
                  ) : (
                    !user && <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('channels')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'channels' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{t.tabChannels}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: LIVE CHAT STREAM */}
            {activeTab === 'live' && (
              <div className="flex-1 flex flex-col min-h-[350px] max-h-[460px] bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
                
                {/* CASE A: ADMIN LOGGED IN -> RENDER ADMIN OPERATOR CONSOLE */}
                {isUserAdmin ? (
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    
                    {/* Admin Switcher Bar: Operator Queue vs Test Visitor View */}
                    <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setAdminViewMode('operator')}
                          className={`px-2 py-1 rounded-md text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${
                            adminViewMode === 'operator'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          <Users className="w-3 h-3" />
                          <span>Queue ({adminSessions.length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminViewMode('visitor')}
                          className={`px-2 py-1 rounded-md text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${
                            adminViewMode === 'visitor'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Test Client View</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAdminChat) {
                            onOpenAdminChat();
                          } else {
                            localStorage.setItem('webzone_admin_active_menu', 'live-chat');
                            window.location.href = '/admin';
                          }
                          setIsOpen(false);
                        }}
                        className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Full Panel</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {adminViewMode === 'operator' ? (
                      adminSelectedSessionId && adminSelectedSession ? (
                        /* ADMIN VIEWING A SPECIFIC VISITOR CHAT */
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                          {/* Selected Session Header */}
                          <div className="px-3 py-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setAdminSelectedSessionId(null)}
                              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center gap-1 text-[10.5px] font-bold"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                            </button>

                            <div className="min-w-0 text-center flex-1">
                              <div className="flex items-center justify-center gap-1.5">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                                  {adminSelectedSession.visitorName}
                                </h5>
                                {adminSelectedSession.isCustomer ? (
                                  <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                                    Customer
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-slate-200 text-slate-700 dark:text-slate-800 dark:text-slate-300">
                                    Visitor
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-center flex-wrap gap-2 text-[8.5px] text-slate-500 font-mono mt-0.5">
                                {adminSelectedSession.visitorPhone && (
                                  <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>{adminSelectedSession.visitorPhone}</span>
                                  </span>
                                )}
                                {adminSelectedSession.visitorEmail && (
                                  <span className="flex items-center gap-0.5 truncate max-w-[130px]">
                                    <Mail className="w-2.5 h-2.5" />
                                    <span>{adminSelectedSession.visitorEmail}</span>
                                  </span>
                                )}
                                <span>{adminSelectedSession.department}</span>
                              </div>
                            </div>

                            <button
                              onClick={handleAdminResolve}
                              className="px-2 py-1 rounded-md text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                              title="Mark resolved"
                            >
                              Resolve
                            </button>
                          </div>

                          {/* Messages Area */}
                          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                            {adminSelectedMessages.map((m) => {
                              const isVisitor = m.senderRole === 'visitor';
                              const isStaff = m.senderRole === 'staff';

                              return (
                                <div
                                  key={m.id}
                                  className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center gap-1 mb-0.5 px-1">
                                    <span className="text-[9px] font-bold text-slate-400">
                                      {isStaff ? 'You (Staff)' : m.senderName || 'Client'}
                                    </span>
                                    <span className="text-[8px] text-slate-400 font-mono">
                                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div
                                    className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-2xs ${
                                      isStaff
                                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-xs'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap">{m.message}</p>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={adminMessagesEndRef} />
                          </div>

                          {/* Canned Quick Responses Horizontal Hub (Admin Mode) */}
                          <div className="bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 space-y-1">
                            {/* Horizontal Category Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                              {[
                                { id: 'all', label: 'All' },
                                { id: 'domain', label: '🌐 Domain' },
                                { id: 'hosting', label: '⚡ Hosting' },
                                { id: 'services', label: '💻 Services' },
                                { id: 'marketplace', label: '🛒 Marketplace' },
                                { id: 'billing', label: '💳 Payment' }
                              ].map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setAdminQuickCategory(cat.id as QuickReplyCategory)}
                                  className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold whitespace-nowrap transition cursor-pointer ${
                                    adminQuickCategory === cat.id
                                      ? 'bg-indigo-600 text-white shadow-2xs'
                                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>

                            {/* Horizontal Quick Reply Chips */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                              {(adminQuickCategory === 'all'
                                ? CANNED_QUICK_REPLIES
                                : CANNED_QUICK_REPLIES.filter(r => r.category === adminQuickCategory)
                              ).map((reply) => (
                                <button
                                  key={reply.id}
                                  type="button"
                                  onClick={() => handleAdminSendReply(reply.text)}
                                  className="px-2 py-1 rounded-full text-[9px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition cursor-pointer shadow-2xs"
                                  title={`${reply.title}\n\n${reply.text}\n\n(Click to send to customer immediately)`}
                                >
                                  <span>{reply.shortLabel}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dedicated Admin Reply Field Console */}
                          <div className="px-3 py-1.5 bg-slate-100/90 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
                            <span className="font-black text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Admin Reply Field &rarr; {adminSelectedSession.visitorName}</span>
                              {adminSelectedSession.isCustomer ? (
                                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                                  Customer
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  Visitor
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">Live Dispatch</span>
                          </div>

                          {/* Admin Reply Form */}
                          <form onSubmit={(e) => { e.preventDefault(); handleAdminSendReply(); }} className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-2">
                            <input
                              type="text"
                              value={adminReplyText}
                              onChange={(e) => setAdminReplyText(e.target.value)}
                              placeholder={`Reply as Admin to ${adminSelectedSession.visitorName}...`}
                              className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              disabled={!adminReplyText.trim() || isAdminReplying}
                              className="p-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl transition cursor-pointer shadow-md disabled:opacity-40"
                              title="Send Admin Reply"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      ) : (
                        /* ADMIN VIEWING ALL INCOMING CLIENT SESSIONS (WITH CUSTOMER VS VISITOR FILTERS) */
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                          {/* Filter Pills Header */}
                          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
                            {[
                              { id: 'all', label: `All (${adminSessions.length})` },
                              { id: 'customers', label: `Customers (${adminSessions.filter(s => s.isCustomer).length})` },
                              { id: 'visitors', label: `Visitors (${adminSessions.filter(s => !s.isCustomer).length})` },
                              { id: 'waiting', label: `Waiting (${adminWaitingCount})` },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setAdminQueueFilter(tab.id as 'all' | 'customers' | 'visitors' | 'waiting')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-black whitespace-nowrap transition cursor-pointer ${
                                  adminQueueFilter === tab.id
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Sessions List */}
                          <div className="flex-1 p-3 overflow-y-auto space-y-2">
                            {(() => {
                              const filteredList = adminSessions.filter(s => {
                                if (adminQueueFilter === 'customers') return s.isCustomer;
                                if (adminQueueFilter === 'visitors') return !s.isCustomer;
                                if (adminQueueFilter === 'waiting') return s.status === 'waiting';
                                return true;
                              });

                              if (filteredList.length === 0) {
                                return (
                                  <div className="p-8 text-center space-y-2">
                                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                      No conversations in this view
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      New customer and visitor inquiries will show up here live.
                                    </p>
                                  </div>
                                );
                              }

                              return filteredList.map((s) => {
                                const isWaiting = s.status === 'waiting';
                                const isResolved = s.status === 'resolved';

                                return (
                                  <button
                                    key={s.id}
                                    onClick={() => setAdminSelectedSessionId(s.id)}
                                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-cyan-500/50 hover:shadow-sm transition flex items-center justify-between gap-2.5 cursor-pointer group"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                          {s.visitorName}
                                        </span>
                                        {s.isCustomer ? (
                                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                                            <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                                            <span>Customer</span>
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                                            <span>Visitor</span>
                                          </span>
                                        )}
                                        <span className={`px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase ${
                                          isWaiting 
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 animate-pulse' 
                                            : isResolved 
                                              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' 
                                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                                        }`}>
                                          {s.status}
                                        </span>
                                        {(s.unreadStaffCount || 0) > 0 && (
                                          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[8px] font-black">
                                            {s.unreadStaffCount} new
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                                        {s.lastMessageText || "New chat initiated"}
                                      </p>
                                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap mt-0.5">
                                        {s.visitorPhone && (
                                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                            📞 {s.visitorPhone}
                                          </span>
                                        )}
                                        {s.visitorEmail && (
                                          <span className="text-slate-500 truncate max-w-[110px]">
                                            ✉️ {s.visitorEmail}
                                          </span>
                                        )}
                                        <span>• {s.department} • {new Date(s.lastMessageAt || s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition shrink-0" />
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )
                    ) : (
                      /* ADMIN VIEWING TEST CLIENT PRE-CHAT / CONVERSATION VIEW */
                      <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {activeChatId ? (
                          <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                              {messages.map((m) => (
                                <div key={m.id} className={`flex flex-col ${m.senderRole === 'visitor' ? 'items-end' : 'items-start'}`}>
                                  <div className="p-2.5 rounded-2xl max-w-[85%] text-xs bg-indigo-600 text-white">
                                    {m.message}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
                              <input
                                type="text"
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                placeholder="Test customer message..."
                                className="flex-1 text-xs p-2 border rounded-xl"
                              />
                              <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl">
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>
                        ) : (
                          <form onSubmit={handleStartChatSession} className="p-4 space-y-3">
                            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Simulate New Customer Chat Session
                            </h5>
                            <textarea
                              rows={2}
                              value={initialInquiry}
                              onChange={(e) => setInitialInquiry(e.target.value)}
                              placeholder="Test message from client..."
                              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                            />
                            <button
                              type="submit"
                              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                            >
                              Launch Test Session
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* CASE B: VISITOR / CUSTOMER VIEW */
                  activeChatId ? (
                    /* ACTIVE CHAT CONVERSATION FOR CUSTOMER / VISITOR */
                    <>
                      {/* Sub-header status bar with Customer Contact Credentials */}
                      <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">
                            {user ? 'Customer Live Chatbot' : 'Visitor Live Chatbot'}
                          </span>
                          {user ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                              Customer
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              Visitor
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveChatId(null);
                            setCurrentSession(null);
                            localStorage.removeItem(ACTIVE_CHAT_SESSION_STORAGE_KEY);
                            setFormError(null);
                          }}
                          className="text-[9px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline"
                          title="নতুন তথ্য দিয়ে চ্যাট শুরু করুন"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>{language === 'bn' ? 'নতুন চ্যাট' : 'New Chat'}</span>
                        </button>
                      </div>

                      {/* Customer Verified Info Strip */}
                      <div className="px-3.5 py-1 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[9px] text-slate-600 dark:text-slate-300 font-mono">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            👤 {currentSession?.visitorName || visitorName || user?.name}
                          </span>
                          {(currentSession?.visitorPhone || visitorPhone || user?.phone) && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                              📞 {currentSession?.visitorPhone || visitorPhone || user?.phone}
                            </span>
                          )}
                          {(currentSession?.visitorEmail || visitorEmail || user?.email) && (
                            <span className="truncate max-w-[120px] text-slate-500">
                              ✉️ {currentSession?.visitorEmail || visitorEmail || user?.email}
                            </span>
                          )}
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[8.5px] uppercase shrink-0">
                          {language === 'bn' ? 'সংযুক্ত' : 'Connected'}
                        </span>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3">
                        {messages.map((m) => {
                          const isVisitor = m.senderRole === 'visitor';
                          const isBot = m.senderRole === 'bot';

                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                            >
                              <div className="flex items-center gap-1 mb-0.5 px-1">
                                <span className="text-[9.5px] font-black text-slate-400">
                                  {isVisitor 
                                    ? (user?.name || visitorName || 'You') 
                                    : isBot 
                                      ? 'WebzoneBD Bot' 
                                      : 'WebzoneBD Admin (Live Operator)'}
                                </span>
                                <span className="text-[8.5px] text-slate-400 font-mono">
                                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div
                                className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-2xs ${
                                  isVisitor
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                                    : isBot
                                      ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 rounded-tl-xs'
                                      : 'bg-white dark:bg-slate-850 border-2 border-indigo-200/80 dark:border-indigo-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                                }`}
                              >
                                {!isVisitor && !isBot && (
                                  <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-cyan-400 mb-1 pb-1 border-b border-indigo-100 dark:border-slate-700">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Official Admin Response</span>
                                  </div>
                                )}
                                <p className="whitespace-pre-wrap">{m.message}</p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Customer Quick Suggestion Chips (Horizontal Ribbon) */}
                      <div className="px-2.5 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                          <span>Quick Inquire:</span>
                        </span>
                        {[
                          { label: '🌐 .COM & BTCL Domain', prompt: 'I want to inquire about domain registration (.COM & .com.bd) pricing and DNS setup.' },
                          { label: '⚡ BDIX NVMe Hosting', prompt: 'What are your high-speed BDIX NVMe cloud hosting packages and prices?' },
                          { label: '💻 Custom Web / ERP App', prompt: 'I need a custom e-commerce web application / ERP software with bKash/Nagad.' },
                          { label: '🛒 Marketplace Scripts', prompt: 'I want to purchase a ready marketplace script and need the live demo & admin credentials.' },
                          { label: '📦 Order & License Status', prompt: 'Could you please check my order status, commercial license, and invoice?' },
                          { label: '💬 Talk to Engineer', prompt: 'Assalamu Alaikum! I would like to speak directly with an engineering specialist.' },
                        ].map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewMessageText(sug.prompt)}
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition cursor-pointer shadow-2xs hover:border-blue-300"
                            title={sug.prompt}
                          >
                            {sug.label}
                          </button>
                        ))}
                      </div>

                      {/* Customer Chatbot Field & Message Form */}
                      <div className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Customer Chatbot Field &rarr; Admin Desk</span>
                        </span>
                        <span className="text-[9px] text-slate-400">Instant Admin Dispatch</span>
                      </div>
                      <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          placeholder="Type your message to WebzoneBD Admin..."
                          className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim() || isSendingMessage}
                          className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition cursor-pointer shadow-md disabled:opacity-40"
                          title={t.btnSend}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  ) : !user ? (
                    /* VISITOR PRE-CHAT SCREEN (CHOICE BETWEEN INSTANT GUEST CHAT & CUSTOMER LOGIN) */
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                      {/* Mode Segmented Controls */}
                      <div className="p-2.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVisitorPreChatMode('visitor')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            visitorPreChatMode === 'visitor'
                              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Guest Visitor Chat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisitorPreChatMode('login')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            visitorPreChatMode === 'login'
                              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Customer Login</span>
                        </button>
                      </div>

                      {visitorPreChatMode === 'visitor' ? (
                        /* GUEST VISITOR CHAT FORM (REQUIRES NAME, MOBILE NUMBER, AND EMAIL) */
                        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                                <span>{language === 'bn' ? 'লাইভ চ্যাট সহায়তা' : 'Live Chat Support'}</span>
                              </h4>
                              <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                                {language === 'bn' ? '৩টি তথ্য আবশ্যক' : '3 Fields Required'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {language === 'bn'
                                ? 'চ্যাটিং শুরু করতে আপনার নাম, মোবাইল নাম্বার এবং ইমেইল অ্যাড্রেস প্রদান করুন।'
                                : 'Please provide your Name, Mobile Number, and Email Address to start chatting.'}
                            </p>
                          </div>

                          {/* Error Notice */}
                          {formError && (
                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 shadow-xs animate-shake">
                              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <div className="leading-tight">
                                <span className="font-bold block">{formError}</span>
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleStartChatSession} className="space-y-3">
                            {/* 1. Full Name */}
                            <div>
                              <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                                  <span>{language === 'bn' ? '১. আপনার পুরো নাম' : '1. Full Name'}</span>
                                  <span className="text-rose-500 font-black">*</span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-normal">
                                  {language === 'bn' ? 'আবশ্যক' : 'Required'}
                                </span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={visitorName}
                                  onChange={(e) => {
                                    setVisitorName(e.target.value);
                                    if (formError) setFormError(null);
                                  }}
                                  placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                                  className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                    formError && (!visitorName.trim() || visitorName.trim().length < 2)
                                      ? 'border-rose-500 ring-1 ring-rose-500'
                                      : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                                  } focus:outline-none`}
                                />
                                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                              </div>
                            </div>

                            {/* 2. Mobile Number */}
                            <div>
                              <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>{language === 'bn' ? '২. মোবাইল নাম্বার' : '2. Mobile Number'}</span>
                                  <span className="text-rose-500 font-black">*</span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-normal">
                                  {language === 'bn' ? 'কল / হোয়াটসঅ্যাপ' : 'Direct / WhatsApp'}
                                </span>
                              </label>
                              <div className="relative">
                                <input
                                  type="tel"
                                  value={visitorPhone}
                                  onChange={(e) => {
                                    setVisitorPhone(e.target.value);
                                    if (formError) setFormError(null);
                                  }}
                                  placeholder={language === 'bn' ? 'যেমন: 01712345678 বা +880...' : 'e.g. 01712345678 or +880...'}
                                  className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                    formError && (!visitorPhone.trim() || visitorPhone.trim().length < 7)
                                      ? 'border-rose-500 ring-1 ring-rose-500'
                                      : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                                  } focus:outline-none`}
                                />
                                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                              </div>
                            </div>

                            {/* 3. Email Address */}
                            <div>
                              <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                                  <span>{language === 'bn' ? '৩. ইমেইল অ্যাড্রেস' : '3. Email Address'}</span>
                                  <span className="text-rose-500 font-black">*</span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-normal">
                                  {language === 'bn' ? 'ইনভয়েস / সাপোর্ট' : 'Invoices & Reply'}
                                </span>
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={visitorEmail}
                                  onChange={(e) => {
                                    setVisitorEmail(e.target.value);
                                    if (formError) setFormError(null);
                                  }}
                                  placeholder={language === 'bn' ? 'যেমন: user@example.com' : 'e.g. user@example.com'}
                                  className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                    formError && (!visitorEmail.trim() || !visitorEmail.includes('@'))
                                      ? 'border-rose-500 ring-1 ring-rose-500'
                                      : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                                  } focus:outline-none`}
                                />
                                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                              </div>
                            </div>

                            {/* Department / Topic */}
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                                {language === 'bn' ? 'বিষয় বা বিভাগ:' : 'Department / Topic:'}
                              </label>
                              <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none cursor-pointer"
                              >
                                <option value="Website & E-Commerce">Website & E-Commerce Development</option>
                                <option value="Custom Software & ERP">Custom Software & B2B ERP</option>
                                <option value="NVMe Hosting & Domain">NVMe Cloud Hosting & Domain</option>
                                <option value="Digital Store & Scripts">Digital Store Scripts & Licenses</option>
                                <option value="Technical Support">Technical Support & Fixes</option>
                              </select>
                            </div>

                            {/* Initial Message */}
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                                {language === 'bn' ? 'আপনার মেসেজ বা প্রশ্ন:' : 'Your Inquiry:'}
                              </label>
                              <textarea
                                rows={2}
                                value={initialInquiry}
                                onChange={(e) => setInitialInquiry(e.target.value)}
                                placeholder={language === 'bn' ? 'অ্যাডমিনকে আপনার বার্তা লিখুন...' : 'Type your message for admin...'}
                                className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                              />
                              {/* Quick Topic Prompts */}
                              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1.5 pb-0.5">
                                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider shrink-0">Topics:</span>
                                {[
                                  { label: '🌐 Domain Reg', dept: 'NVMe Hosting & Domain', text: 'I want to register a domain (.COM / .com.bd) and need DNS assistance.' },
                                  { label: '⚡ NVMe Hosting', dept: 'NVMe Hosting & Domain', text: 'I want to inquire about BDIX NVMe hosting plans and cPanel setup.' },
                                  { label: '💻 E-Com / ERP', dept: 'Website & E-Commerce', text: 'I need a custom website / ERP system with bKash/Nagad integration.' },
                                  { label: '🛒 Ready Script', dept: 'Digital Store & Scripts', text: 'I need live demo access and license details for marketplace scripts.' },
                                ].map((topic, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setDepartment(topic.dept);
                                      setInitialInquiry(topic.text);
                                    }}
                                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition cursor-pointer"
                                  >
                                    {topic.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isStartingChat}
                              className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>
                                {isStartingChat 
                                  ? (language === 'bn' ? 'চ্যাটিংয়ে নেওয়া হচ্ছে...' : 'Connecting to Chat...') 
                                  : (language === 'bn' ? 'তথ্য জমা দিয়ে চ্যাটিং শুরু করুন' : 'Submit Details & Start Live Chat')}
                              </span>
                            </button>
                          </form>

                          <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400">
                              Have an account?{' '}
                              <button
                                type="button"
                                onClick={() => setVisitorPreChatMode('login')}
                                className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                              >
                                Log in as Customer
                              </button>{' '}
                              to link with order history.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* CUSTOMER LOGIN SCREEN */
                        <div className="flex-1 p-5 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/15 to-indigo-600/25 dark:from-blue-500/20 dark:to-indigo-500/35 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 shadow-inner">
                            <Lock className="w-7 h-7" />
                          </div>

                          <div className="space-y-1 max-w-[290px]">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                              Customer Account Login
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Log in to chat with Admin as a verified customer, track your past inquiries, tickets, and software orders.
                            </p>
                          </div>

                          {/* Benefits list */}
                          <div className="w-full bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-2 text-[10px] sm:text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Verified Customer Badge for priority attention</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Persistent chat history linked across your devices</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-[10.5px] text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Direct access to order status, invoices & software licenses</span>
                            </div>
                          </div>

                          {/* Login & Register Buttons */}
                          <div className="w-full space-y-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenAuthModal('login')}
                              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-2 active:scale-98"
                            >
                              <LogIn className="w-4 h-4" />
                              <span>{t.btnLogin}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenAuthModal('register')}
                              className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition flex items-center justify-center gap-2"
                            >
                              <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{t.btnRegister}</span>
                            </button>
                          </div>

                          {/* Direct WhatsApp fallback */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 w-full text-center">
                            <p className="text-[10px] text-slate-400 mb-1">Prefer instant messaging app?</p>
                            <button
                              type="button"
                              onClick={() => handleStartWhatsApp()}
                              className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>Message on WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* LOGGED-IN CUSTOMER PRE-CHAT INITIATION FORM */
                    <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
                      
                      {/* Logged in customer verified badge */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/70 dark:border-blue-800/50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</span>
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-400 border border-blue-300 dark:border-blue-800">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Customer Account</span>
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-mono">{user.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Presence notice if staff is away or offline */}
                      {adminPresence.status === 'away' && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 shadow-2xs">
                          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold text-[11px] block">{t.statusAway}</span>
                            <span className="text-[10px] text-amber-800/90 dark:text-amber-300/90">{t.awayNotice}</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                          <span>Customer Chatbot Field &bull; Inquire with Admin</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          Your conversation is linked directly to your customer account and routed to our admin support team.
                        </p>
                      </div>

                      {/* Form Error Notice */}
                      {formError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 shadow-xs animate-shake">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold block">{formError}</span>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleStartChatSession} className="space-y-3">
                        {/* 1. Customer Name */}
                        <div>
                          <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                              <span>{language === 'bn' ? '১. কাস্টমার নাম' : '1. Customer Name'}</span>
                              <span className="text-rose-500 font-black">*</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              {language === 'bn' ? 'আবশ্যক' : 'Required'}
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={visitorName}
                              onChange={(e) => {
                                setVisitorName(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder={language === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'}
                              className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                formError && (!visitorName.trim() || visitorName.trim().length < 2)
                                  ? 'border-rose-500 ring-1 ring-rose-500'
                                  : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                              } focus:outline-none`}
                            />
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        {/* 2. Customer Mobile Number (Mandatory) */}
                        <div>
                          <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{language === 'bn' ? '২. মোবাইল নাম্বার' : '2. Mobile Number'}</span>
                              <span className="text-rose-500 font-black">*</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              {language === 'bn' ? 'কল ও হোয়াটসঅ্যাপ' : 'Direct & WhatsApp'}
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={visitorPhone}
                              onChange={(e) => {
                                setVisitorPhone(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder={language === 'bn' ? 'যেমন: 01712345678 বা +880...' : 'e.g. 01712345678 or +880...'}
                              className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                formError && (!visitorPhone.trim() || visitorPhone.trim().length < 7)
                                  ? 'border-rose-500 ring-1 ring-rose-500'
                                  : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                              } focus:outline-none`}
                            />
                            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        {/* 3. Customer Email Address (Mandatory) */}
                        <div>
                          <label className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                              <span>{language === 'bn' ? '৩. ইমেইল অ্যাড্রেস' : '3. Email Address'}</span>
                              <span className="text-rose-500 font-black">*</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              {language === 'bn' ? 'ইনভয়েস ও রিপ্লাই' : 'Invoices & Reply'}
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={visitorEmail}
                              onChange={(e) => {
                                setVisitorEmail(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder={language === 'bn' ? 'যেমন: customer@example.com' : 'e.g. customer@example.com'}
                              className={`w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border ${
                                formError && (!visitorEmail.trim() || !visitorEmail.includes('@'))
                                  ? 'border-rose-500 ring-1 ring-rose-500'
                                  : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500'
                              } focus:outline-none`}
                            />
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        {/* Department Selection */}
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                            {t.deptLabel}:
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none cursor-pointer"
                          >
                            <option value="Website & E-Commerce">Website & E-Commerce Development</option>
                            <option value="Custom Software & ERP">Custom Software & B2B ERP</option>
                            <option value="NVMe Hosting & Domain">NVMe Cloud Hosting & Domain</option>
                            <option value="Digital Store & Scripts">Digital Store Scripts & Licenses</option>
                            <option value="Technical Support">Technical Support & Fixes</option>
                          </select>
                        </div>

                        {/* Inquiry Message */}
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                            {t.msgLabel}:
                          </label>
                          <textarea
                            rows={2}
                            value={initialInquiry}
                            onChange={(e) => setInitialInquiry(e.target.value)}
                            placeholder={t.msgPlaceholder}
                            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          />
                          {/* Quick Topic Prompts Horizontal Row */}
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1.5 pb-0.5">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider shrink-0">Quick Topic:</span>
                            {[
                              { label: '🌐 Domain Reg', dept: 'NVMe Hosting & Domain', text: 'I want to register a domain (.COM / .com.bd) and need DNS assistance.' },
                              { label: '⚡ NVMe Hosting', dept: 'NVMe Hosting & Domain', text: 'I want to inquire about BDIX NVMe hosting plans and cPanel setup.' },
                              { label: '💻 E-Com / ERP', dept: 'Website & E-Commerce', text: 'I need a custom website / ERP system with bKash/Nagad integration.' },
                              { label: '🛒 Ready Script', dept: 'Digital Store & Scripts', text: 'I need live demo access and license details for marketplace scripts.' },
                              { label: '🛠️ Support & Fixes', dept: 'Technical Support', text: 'I have a technical question or issue with my existing service.' },
                            ].map((topic, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setDepartment(topic.dept);
                                  setInitialInquiry(topic.text);
                                }}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition cursor-pointer"
                              >
                                {topic.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isStartingChat}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {isStartingChat 
                              ? (language === 'bn' ? 'চ্যাটিংয়ে নেওয়া হচ্ছে...' : 'Connecting to Admin...') 
                              : (language === 'bn' ? 'তথ্য নিশ্চিত করে চ্যাটিং শুরু করুন' : `Start Chat with Admin as ${visitorName || user.name || 'Customer'}`)}
                          </span>
                        </button>
                      </form>
                    </div>
                  )
                )}

              </div>
            )}

            {/* TAB 2: WHATSAPP, TELEGRAM & QUICK CHANNELS */}
            {activeTab === 'channels' && (
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 overflow-y-auto">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {language === 'bn' 
                    ? "আপনি সরাসরি আমাদের হোয়াটসঅ্যাপ, টেলিগ্রাম বা হটলাইনে কল করেও দ্রুত পরামর্শ পেতে পারেন।" 
                    : language === 'ar'
                    ? "يمكنكم أيضاً التواصل الفوري معنا عبر الواتساب، التلغرام أو الاتصال المباشر على الخطوط الساخنة."
                    : "Connect instantly with our Riyadh and Dhaka team via WhatsApp, Telegram, or direct priority helpline."}
                </p>

                {/* Direct Channel Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStartWhatsApp()}
                    className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <div className="p-2 rounded-full bg-emerald-500 text-white shadow-xs">
                      <WhatsAppIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => window.open('https://t.me/webzonebdit', '_blank', 'noopener,noreferrer')}
                    className="p-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/15 text-sky-600 dark:text-sky-400 transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <div className="p-2 rounded-full bg-sky-500 text-white shadow-xs">
                      <TelegramIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black">Telegram</span>
                  </button>

                  <button
                    onClick={() => window.open('https://www.facebook.com/Webzonebd', '_blank', 'noopener,noreferrer')}
                    className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <div className="p-2 rounded-full bg-blue-600 text-white shadow-xs">
                      <MessengerIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black">Messenger</span>
                  </button>
                </div>

                {/* Direct Hotline Cards */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:+8801864000005"
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  >
                    <span className="text-xl">🇧🇩</span>
                    <div className="min-w-0">
                      <span className="text-[8px] text-slate-400 block font-bold">Bangladesh</span>
                      <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-200">0186 400 0005</span>
                    </div>
                  </a>

                  <a
                    href="tel:+966570511931"
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  >
                    <span className="text-xl">🇸🇦</span>
                    <div className="min-w-0">
                      <span className="text-[8px] text-slate-400 block font-bold">Saudi Arabia</span>
                      <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-200">057 051 1931</span>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Window Footer */}
            <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 text-center text-[9.5px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Encrypted Socket</span>
              </span>
              <span>{isUserAdmin ? "Staff Operator Node Active" : "Riyadh & Dhaka Node"}</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Horizontal Controller Bar & Dock System */}
      <div className="flex items-center gap-2" id="live-chat-horizontal-dock-container">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative ${
            isOpen 
              ? 'bg-neutral-800 dark:bg-slate-900 border border-neutral-700/50 dark:border-slate-800' 
              : isUserAdmin
                ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-cyan-500/30'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/25 dark:shadow-cyan-400/10'
          }`}
          title={isUserAdmin ? "Admin Live Support Hub" : "WebzoneBD Live Support"}
          aria-label="Toggle Live Assist"
        >
          {!isOpen && (
            <>
              <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isUserAdmin ? 'bg-cyan-400/30' : 'bg-blue-500/30'}`} />
              <span className={`absolute -inset-1 rounded-full border animate-pulse ${isUserAdmin ? 'border-cyan-300/50' : 'border-cyan-400/40'}`} />
            </>
          )}
          
          {isOpen ? (
            <X className="w-4 h-4 sm:w-6 sm:h-6 rotate-0 transition-transform duration-300" />
          ) : (
            <div className="flex items-center justify-center relative">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              {isUserAdmin ? (
                <span className={`h-3 w-3 rounded-full border-2 border-slate-900 absolute -top-1 -right-1 flex items-center justify-center text-[7px] font-black ${
                  adminPresence.status === 'online' ? 'bg-cyan-400 text-slate-950' : adminPresence.status === 'away' ? 'bg-amber-400 text-slate-950' : 'bg-slate-500 text-white'
                }`}>
                  ★
                </span>
              ) : !user ? (
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white absolute -top-1 -right-1" title="Login required" />
              ) : adminPresence.status === 'online' ? (
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-1 -right-1 animate-pulse" title="Operators Online" />
              ) : adminPresence.status === 'away' ? (
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white absolute -top-1 -right-1 animate-pulse" title="Operators Away" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 border-2 border-white absolute -top-1 -right-1" title="Operators Offline" />
              )}
            </div>
          )}
        </motion.button>

        {/* Small live pulse tag next to launcher */}
        <div 
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md select-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          {isUserAdmin ? (
            <>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                adminPresence.status === 'online' ? 'bg-cyan-400 animate-pulse' : adminPresence.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
              <span className="text-[10px] font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent font-sans uppercase">
                {language === 'bn' 
                  ? `এডমিন লাইভ ডেস্ক (${adminPresence.status === 'online' ? 'অনলাইন' : adminPresence.status === 'away' ? 'ব্যস্ত' : 'অফলাইন'})` 
                  : `Admin Hub (${adminPresence.status.toUpperCase()})`}
              </span>
              {adminWaitingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black leading-tight animate-bounce">
                  {adminWaitingCount}
                </span>
              )}
            </>
          ) : !user ? (
            <>
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-[10px] font-extrabold tracking-tight text-slate-700 dark:text-slate-300 font-sans uppercase">
                {language === 'bn' ? 'লাইভ চ্যাট (লগইন প্রয়োজন)' : language === 'ar' ? 'المحادثة (تسجيل الدخول)' : 'Live Chat (Login)'}
              </span>
            </>
          ) : adminPresence.status === 'online' ? (
            <>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              <span className="text-[10px] font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 font-sans uppercase">
                {language === 'bn' ? 'লাইভ সাপোর্ট (অনলাইন)' : language === 'ar' ? 'الدعم المباشر (متصل)' : 'Live Chat (Online)'}
              </span>
            </>
          ) : adminPresence.status === 'away' ? (
            <>
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
              <span className="text-[10px] font-extrabold tracking-tight text-amber-600 dark:text-amber-400 font-sans uppercase">
                {language === 'bn' ? 'লাইভ সাপোর্ট (ব্যস্ত/দূরে)' : language === 'ar' ? 'الدعم المباشر (غير متاح)' : 'Live Chat (Away)'}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-slate-400 rounded-full shrink-0" />
              <span className="text-[10px] font-extrabold tracking-tight text-slate-500 dark:text-slate-400 font-sans uppercase">
                {language === 'bn' ? 'লাইভ সাপোর্ট (অফলাইন)' : language === 'ar' ? 'الدعم المباشر (غير متصل)' : 'Live Chat (Offline)'}
              </span>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
