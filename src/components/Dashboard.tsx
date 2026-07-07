import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  User, Clipboard, Download, MessageSquare, ShieldCheck, 
  Send, Plus, Trash2, Key, Ticket, UserCheck, HelpCircle,
  Database, RefreshCw, Smartphone, DollarSign, List, Image,
  Activity, ArrowRightLeft, FileCode, CheckCircle2, TrendingUp,
  Home, Package, Rocket, Wallet, Heart, Users, Settings, LogOut,
  ChevronRight, Lock, Shield, CreditCard, ExternalLink, Cpu, Check, AlertCircle,
  Search, Calendar, ArrowUpDown, Filter, Clock, Loader2, Tag, Bell,
  ChevronUp, ChevronDown, Folder, Globe, Languages, Truck, Inbox,
  Printer, MoreHorizontal, ShoppingCart
} from 'lucide-react';
import { Order, SupportTicket, Language, Theme, UserSession, Currency, ActivityLog, Product } from '../types';
import ProfileSettingsCenter from './ProfileSettingsCenter';
import Sidebar from './Sidebar';
import { DashboardWidgets } from './DashboardWidgets';
import UserOrderHistory from './UserOrderHistory';
import CompanyRevenueDashboard from './CompanyRevenueDashboard';

interface DashboardProps {
  language: Language;
  theme: Theme;
  user: UserSession | null;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  orders: Order[];
  tickets: SupportTicket[];
  addSupportTicket: (ticket: SupportTicket) => void;
  addTicketReply: (ticketId: string, message: string, sender: 'user' | 'admin') => void;
  triggerToast: (msg: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onUpdateUser: (user: UserSession) => void;
  activityLogs: ActivityLog[];
  onAddActivityLog: (log: string) => void;
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onUpdateProductRating?: (idOrName: string, rating: number, comment: string) => void;
  currencySettings?: any;
  setLanguage?: (lang: Language) => void;
  setTheme?: (theme: Theme) => void;
  onUpdateOrders?: (orders: Order[]) => void;
  deleteOrder?: (id: string) => void;
}

const getDaysRemaining = (expiryDateStr: string): number => {
  if (!expiryDateStr) return 999;
  const expiryDate = new Date(expiryDateStr);
  if (isNaN(expiryDate.getTime())) return 999;
  const today = new Date();
  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function Dashboard({
  language,
  theme,
  user,
  onLogout,
  onNavigate,
  orders,
  tickets,
  addSupportTicket,
  addTicketReply,
  triggerToast,
  currency,
  setCurrency,
  onUpdateUser,
  activityLogs,
  onAddActivityLog,
  products,
  onAddProduct,
  onUpdateProductRating,
  currencySettings,
  setLanguage,
  setTheme,
  onUpdateOrders,
  deleteOrder
}: DashboardProps) {
  // Sync page state through tab tracking
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('webzone_dashboard_active_tab');
    if (saved) {
      localStorage.removeItem('webzone_dashboard_active_tab');
      return saved;
    }
    return 'dashboard';
  });

  // Helper to standardise Order IDs sequentially to match AdminPanel
  const getOrderSerial = (orderId: string) => {
    if (!orderId) return 'Order-101';
    if (orderId.startsWith('Order-')) return orderId;
    const idx = orders.findIndex(o => o.id === orderId);
    return idx !== -1 ? `Order-${101 + idx}` : orderId;
  };

  // Collapsible Sidebar state persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('webzone_dashboard_sidebar_collapsed') === 'true';
  });

  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    localStorage.setItem('webzone_dashboard_sidebar_collapsed', String(collapsed));
  };

  // Interactive order tracking state
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>(() => {
    const trackable = orders.filter(o => o.paymentStatus !== 'pending');
    return trackable.length > 0 ? trackable[0].id : 'demo';
  });
  const [orderTrackingSteps, setOrderTrackingSteps] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = { 'demo': 4 }; // Default demo order to step 4 (delivered)
    orders.forEach(o => {
      if (o.status === 'delivered' || o.paymentStatus === 'completed') {
        initial[o.id] = 4;
      } else if (o.status === 'shipped') {
        initial[o.id] = 3;
      } else if (o.status === 'processing') {
        initial[o.id] = 2;
      } else if (o.paymentStatus === 'failed') {
        initial[o.id] = 1;
      } else {
        initial[o.id] = 0;
      }
    });
    return initial;
  });
  const [cancellationRequests, setCancellationRequests] = useState<Record<string, boolean>>({});
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<{ isOpen: boolean; orderId: string | null; itemTitle: string }>({ isOpen: false, orderId: null, itemTitle: '' });
  const [ratingOrderModalId, setRatingOrderModalId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<Record<string, { rating: number; comment: string }>>(() => {
    try {
      const saved = localStorage.getItem('webzone_submitted_feedback');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveFeedback = (orderId: string, rating: number, comment: string) => {
    setSubmittedFeedback(prev => {
      const next = { ...prev, [orderId]: { rating, comment } };
      localStorage.setItem('webzone_submitted_feedback', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    setOrderTrackingSteps(prev => {
      const updated = { ...prev };
      orders.forEach(o => {
        if (updated[o.id] === undefined) {
          if (o.status === 'delivered' || o.paymentStatus === 'completed') {
            updated[o.id] = 4;
          } else if (o.status === 'shipped') {
            updated[o.id] = 3;
          } else if (o.status === 'processing') {
            updated[o.id] = 2;
          } else if (o.paymentStatus === 'failed') {
            updated[o.id] = 1;
          } else {
            updated[o.id] = 0;
          }
        }
      });
      return updated;
    });
    const trackable = orders.filter(o => o.paymentStatus !== 'pending');
    if (trackable.length > 0 && selectedTrackingOrderId === 'demo') {
      setSelectedTrackingOrderId(trackable[trackable.length - 1].id);
    }
  }, [orders]);

  // Listen for storage changes to instantly update dashboard tab if redirected from Header quick links
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('webzone_dashboard_active_tab');
      if (saved) {
        setActiveTab(saved);
        localStorage.removeItem('webzone_dashboard_active_tab');
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Sync profile details
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Guest User');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'guest@webzonebd.com');
  const [profileWhatsApp, setProfileWhatsApp] = useState(user?.phone || '1864000005');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [phoneCode, setPhoneCode] = useState(user?.phoneCode || '+880');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [taxId, setTaxId] = useState(user?.taxId || '');
  
  const [billingStreet, setBillingStreet] = useState(user?.billingStreet || 'Road 4, Block F, Banani');
  const [billingCity, setBillingCity] = useState(user?.billingCity || 'Dhaka');
  const [billingState, setBillingState] = useState(user?.billingState || 'Dhaka Division');
  const [billingCountry, setBillingCountry] = useState(user?.billingCountry || 'Bangladesh');
  const [billingPostal, setBillingPostal] = useState(user?.billingPostal || '1213');

  // Change Password States & Toggles
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurPass, setShowCurPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  // 2FA state & advanced security options
  const [tfaEnabled, setTfaEnabled] = useState(user?.tfaEnabled || false);
  const [emailOtpEnabled, setEmailOtpEnabled] = useState(true);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);
  const [whatsappOtpEnabled, setWhatsappOtpEnabled] = useState(false);

  // Basic Information States
  const [profileUsername, setProfileUsername] = useState(user?.username || 'imranh9900');
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '1711223344');
  const [profileWhatsAppNumber, setProfileWhatsAppNumber] = useState(user?.phone || '1864051151');
  const [profileCountry, setProfileCountry] = useState(user?.country || 'Bangladesh');
  const [profileCity, setProfileCity] = useState(user?.billingCity || 'Dhaka');
  const [profileTimezone, setProfileTimezone] = useState('Asia/Dhaka (GMT+6)');
  const [profileLanguageSelection, setProfileLanguageSelection] = useState('English');

  // Billing Address States
  const [billingName, setBillingName] = useState(user?.name || 'Imran Hasan');
  const [addressLine2, setAddressLine2] = useState('Block F, Banani');

  // Notification Preferences switches states
  const [emailNotification, setEmailNotification] = useState(true);
  const [orderNotification, setOrderNotification] = useState(true);
  const [invoiceNotification, setInvoiceNotification] = useState(true);
  const [affiliateNotification, setAffiliateNotification] = useState(true);
  const [ticketNotification, setTicketNotification] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [promoOffers, setPromoOffers] = useState(false);
  const [whatsAppNotification, setWhatsAppNotification] = useState(true);

  // Preference switches states (compat with existing code logic)
  const [prefOrder, setPrefOrder] = useState(user?.prefOrder ?? true);
  const [prefMilestone, setPrefMilestone] = useState(user?.prefMilestone ?? true);
  const [prefSupport, setPrefSupport] = useState(user?.prefSupport ?? true);
  const [prefRenewal, setPrefRenewal] = useState(user?.prefRenewal ?? false);

  // Linked accounts
  const [googleConnected, setGoogleConnected] = useState(user?.googleConnected ?? true);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(user?.githubConnected ?? false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  // Profile Active Sub Tab
  const [profileSubTab, setProfileSubTab] = useState<'basic' | 'security' | 'sessions' | 'billing' | 'noti' | 'social' | 'privacy'>('basic');

  // My Orders Filtering & Sorting States
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [orderDateSort, setOrderDateSort] = useState<'desc' | 'asc'>('desc');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderDateRangeFilter, setOrderDateRangeFilter] = useState<'all' | '30days' | '90days' | 'thisyear'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [openActionDropdownId, setOpenActionDropdownId] = useState<string | null>(null);
  const [editingNotesOrder, setEditingNotesOrder] = useState<Order | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  // Login Sessions List with simulated removal state
  const [loginSessions, setLoginSessions] = useState([
    { id: '1', device: 'Chroma Book Pro 16', browser: 'Chrome 125.0', os: 'Windows 11', ip: '103.84.148.29', country: 'Bangladesh', time: 'Active Now (Current Device)', isCurrent: true },
    { id: '2', device: 'Apple iPhone 15 Pro Max', browser: 'Safari Mobile', os: 'iOS 17.4', ip: '103.84.148.33', country: 'Bangladesh', time: 'June 02, 2026 12:44 PM', isCurrent: false },
    { id: '3', device: 'MacBook Pro M3 Core', browser: 'Brave Browser', os: 'macOS Sonoma', ip: '192.168.1.1', country: 'United States', time: 'May 28, 2026 09:12 AM', isCurrent: false }
  ]);

  // Vendor project submitter
  const [vendorProdName, setVendorProdName] = useState('');
  const [vendorProdPrice, setVendorProdPrice] = useState(49);
  const [vendorProdCategory, setVendorProdCategory] = useState<'php' | 'wordpress' | 'laravel' | 'mobile'>('php');
  const [vendorProdDesc, setVendorProdDesc] = useState('');
  const [vendorProdImage, setVendorProdImage] = useState<string>('');
  const [vendorProdImageFile, setVendorProdImageFile] = useState<File | null>(null);

  // Hostinger, WHMCS, and premium SaaS platform state additions
  // Hostinger, WHMCS, and premium SaaS platform state additions loaded persistently or empty for new visitors
  const [domains, setDomains] = useState<any[]>(() => {
    const saved = localStorage.getItem(`webzone_domains_${user?.id || 'guest'}`);
    if (saved) return JSON.parse(saved);
    // Return preseeded domains with dynamic expiry dates (within 30 days)
    const today = new Date();
    const datePlus12 = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const datePlus45 = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const datePlus5 = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();
    return [
      { id: 'dom-101', domainName: 'my-corporate-site.com', status: 'Active', registeredAt: '2025-07-15', expiresAt: datePlus12, whoisLocked: true },
      { id: 'dom-102', domainName: 'webzone-dev-sandbox.net', status: 'Active', registeredAt: '2025-08-01', expiresAt: datePlus45, whoisLocked: true },
      { id: 'dom-103', domainName: 'custom-app-demo.xyz', status: 'Active', registeredAt: '2025-06-12', expiresAt: datePlus5, whoisLocked: false }
    ];
  });

  const [hostingPackages, setHostingPackages] = useState<any[]>(() => {
    const saved = localStorage.getItem(`webzone_hosting_packages_${user?.id || 'guest'}`);
    if (saved) return JSON.parse(saved);
    // Return preseeded hosting packages with dynamic expiry dates
    const today = new Date();
    const datePlus12 = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const datePlus5 = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();
    return [
      { id: 'hst-101', tierName: 'Managed VPS Hosting - SSD Pro', primaryDomain: 'my-corporate-site.com', ssdSpaceUsed: 12, ssdSpaceLimit: 50, cpuUsage: 28, status: 'Active', expiresAt: datePlus12 },
      { id: 'hst-102', tierName: 'Shared BDIX Hosting - Light', primaryDomain: 'custom-app-demo.xyz', ssdSpaceUsed: 2.4, ssdSpaceLimit: 10, cpuUsage: 14, status: 'Active', expiresAt: datePlus5 }
    ];
  });

  const [services, setServices] = useState<any[]>(() => {
    const saved = localStorage.getItem(`webzone_services_${user?.id || 'guest'}`);
    if (saved) return JSON.parse(saved);
    
    const isPreseededUser = ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-105', 'usr-vendor', 'usr-admin', 'usr-webzonebd-admin'].includes(user?.id || '');
    if (!isPreseededUser) return [];

    return [
      {
        id: 'srv-pos',
        name: 'POS Software Development Solution',
        category: 'Business Software Solutions',
        status: 'In Progress',
        progress: 35,
        dueDate: '2026-07-20',
        assignedTeam: 'WebzoneBD Enterprise Team Alpha',
        phases: { design: 'Completed', development: 'In Progress', testing: 'Pending', deployment: 'Pending' },
        timeline: 'Initial database layout and wireframes complete. Core POS transaction ledger system coding started.'
      }
    ];
  });



  const [rewardPoints, setRewardPoints] = useState<number>(() => {
    const saved = localStorage.getItem(`webzone_reward_points_${user?.id || 'guest'}`);
    return saved ? parseInt(saved) : 0;
  });

  const [rewardHistory, setRewardHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem(`webzone_reward_history_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState([
    { code: 'WEBZONE50', discount: '50% Off Domain', status: 'Active', type: 'Domain' },
    { code: 'HOSTFREE3', discount: '3 Months Free Hosting', status: 'Active', type: 'Hosting' },
    { code: 'ITGROWTH15', discount: '15% Off Custom Services', status: 'Claimed', type: 'Services' }
  ]);

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem(`webzone_notifications_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : [
      { id: 'not-welcome', title: '👋 Welcome to WebzoneBD!', message: 'Explore ready-made IT services, customize parameters, and build a digital footprint.', type: 'system', date: 'Just now', read: false }
    ];
  });

  // Real-time tracking of order updates to alert the customer
  const prevOrdersRef = useRef<Order[]>([]);

  useEffect(() => {
    if (prevOrdersRef.current && prevOrdersRef.current.length > 0) {
      orders.forEach(currentOrder => {
        const prevOrder = prevOrdersRef.current.find(o => o.id === currentOrder.id);
        if (prevOrder && prevOrder.paymentStatus === 'pending' && currentOrder.paymentStatus === 'completed') {
          const congratsMessage = language === 'bn' 
            ? `🎉 অভিনন্দন! আপনার অর্ডার #${currentOrder.id} ("${currentOrder.itemTitle}") সফলভাবে পরিশোধিত এবং সম্পূর্ণ হয়েছে। ডাউনলোড লিঙ্ক এখন প্রস্তুত!`
            : `🎉 Congratulations! Your Order #${currentOrder.id} ("${currentOrder.itemTitle}") has been verified & completed. Digital Code files are now unlocked and ready for download!`;
            
          triggerToast(congratsMessage);
          
          const newNotification = {
            id: `not-${currentOrder.id}-${Date.now()}`,
            title: language === 'bn' ? '✅ পেমেন্ট নিশ্চিত করা হয়েছে!' : '✅ Payment Confirmed & Completed!',
            message: language === 'bn'
              ? `আপনার অর্ডার #${currentOrder.id} ("${currentOrder.itemTitle}") পেমেন্ট সফলভাবে নিশ্চিত করা হয়েছে। আপনার ডিজিটাল ফাইল ড্যাশবোর্ড থেকে ডাউনলোড করুন।`
              : `Your payment for Order #${currentOrder.id} ("${currentOrder.itemTitle}") is confirmed. Your digital assets are now ready for download in the main dashboard or download center.`,
            type: 'billing',
            date: language === 'bn' ? 'সরাসরি আপডেট' : 'Just Now',
            read: false,
            meta: { orderId: currentOrder.id }
          };
          
          setNotifications(prevNotifs => {
            const updated = [newNotification, ...prevNotifs];
            localStorage.setItem(`webzone_notifications_${user?.id || 'guest'}`, JSON.stringify(updated));
            return updated;
          });

          onAddActivityLog(`System generated Order Confirmed notification for Order #${currentOrder.id}`);
        }
      });
    }
    prevOrdersRef.current = orders;
  }, [orders, language, user?.id, triggerToast, onAddActivityLog]);

  // Sync live broadcast offer into notifications roster automatically
  useEffect(() => {
    const liveMsg = localStorage.getItem('site_wide_broadcast_notification');
    if (!liveMsg) return;

    const liveLink = localStorage.getItem('site_wide_broadcast_link') || '';
    const liveLinkText = localStorage.getItem('site_wide_broadcast_link_text') || 'Claim Offer';
    const bId = localStorage.getItem('site_wide_broadcast_id') || 'site-wide-offer-promo';

    const alreadyExists = notifications.some(n => n.id === bId || (n.type === 'offer' && n.message === liveMsg));
    if (!alreadyExists) {
      const bNotif = {
        id: bId,
        title: language === 'bn' ? '🎁 বিশেষ অফার ঘোষণা করা হয়েছে!' : '🎁 Special Site-wide Offer Announced!',
        message: liveMsg,
        type: 'offer',
        link: liveLink || undefined,
        linkText: liveLinkText,
        date: 'Just now',
        read: false
      };
      setNotifications(prev => {
        const updated = [bNotif, ...prev];
        localStorage.setItem(`webzone_notifications_${user?.id || 'guest'}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [language, user?.id, notifications]);

  const [businessStats, setBusinessStats] = useState({
    seoScore: 88,
    googleRanking: '#3 Local IT Solution Bangladesh',
    googleProfileStatus: 'Verified & Active On Maps',
    activeCampaigns: '3 Active Lead Streams',
    leadGeneration: 148,
    trafficHistory: [
      { month: 'Jan', visitors: 1200 },
      { month: 'Feb', visitors: 1850 },
      { month: 'Mar', visitors: 2400 },
      { month: 'Apr', visitors: 3100 },
      { month: 'May', visitors: 4600 }
    ]
  });

  const [adminWidgets, setAdminWidgets] = useState({
    welcomeCard: true,
    profileCompletion: false,
    statsGrid: true,
    recentActivity: false,
    cloudVmSpecs: false,
    quickShortcuts: true,
    projectProgress: true,
    businessGrowth: false,
    rewardsCenter: true,
    notificationCentre: true,
    affiliatePromo: true,
    layoutType: 'Modern Grid Layout',
    customerPermissions: 'Premium Business VIP Account License',
    pointMultiplier: 1.5,
    payoutRate: '15% Flat Rate'
  });

  // Modern SaaS My Services 4-Step Tab State
  const [myServicesSubTab, setMyServicesSubTab] = useState<'suggest' | 'purchased' | 'phases' | 'timeline'>('suggest');
  const [selectedSuggestedService, setSelectedSuggestedService] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [checkoutService, setCheckoutService] = useState<any>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutCountry, setCheckoutCountry] = useState<'bangladesh' | 'saudi_arabia' | 'other'>('bangladesh');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'piprapay' | 'wallet' | 'stcpay' | 'alrajhi_bank' | 'manual_cash'>('piprapay');
  const [manualAccount, setManualAccount] = useState('');
  const [manualTid, setManualTid] = useState('');

  // Support thread creation
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTicketForChat, setActiveTicketForChat] = useState<SupportTicket | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Affiliate Dashboard states
  const [withdrawAmt, setWithdrawAmt] = useState('25');
  const [withdrawGateway, setWithdrawGateway] = useState('bKash');
  const [customAffSuffix, setCustomAffSuffix] = useState('campaign_bd');
  const [copiedAffLink, setCopiedAffLink] = useState(false);

  // Dynamic affiliate program registration states
  const [affiliateStatus, setAffiliateStatus] = useState<'unregistered' | 'pending' | 'approved' | 'suspended'>('unregistered');
  const [affiliateProfile, setAffiliateProfile] = useState<any>(null);
  const [affiliateReferralsList, setAffiliateReferralsList] = useState<any[]>([]);
  const [promoChannel, setPromoChannel] = useState('Personal Blog & Tech Portal');
  const [promoCountry, setPromoCountry] = useState('Bangladesh');
  const [payoutDetails, setPayoutDetails] = useState('');

  useEffect(() => {
    if (!user) return;
    const savedList = localStorage.getItem('webzone_affiliate_list');
    const list = savedList ? JSON.parse(savedList) : [
      { userId: 'usr-101', name: 'Imran Hasan', code: 'PARTNER-IMRAN', referrals: 24, commissionEarned: 1240, status: 'approved', channel: 'Personal Tech Blog', commissionRate: 20, registeredAt: '2025-10-15', balance: 140, clicks: 1482, paymentDetails: 'bKash: 01711223344' },
      { userId: 'usr-102', name: 'Al-Shehri Majid', code: 'PARTNER-MAJID', referrals: 58, commissionEarned: 3500, status: 'approved', channel: 'Riyadh Hosting Network', commissionRate: 25, registeredAt: '2025-11-20', balance: 840, clicks: 3120, paymentDetails: 'PayPal: majid@saudiweb.com' },
      { userId: 'usr-103', name: 'Zeeshan Rahman', code: 'PARTNER-ZEESHAN', referrals: 8, commissionEarned: 320, status: 'approved', channel: 'YouTube Channel', commissionRate: 15, registeredAt: '2026-01-11', balance: 0, clicks: 540, paymentDetails: 'Nagad: 01864051151' },
      { userId: 'usr-105', name: 'Enamul Haque', code: 'AFF-ENAMUL', referrals: 15, commissionEarned: 560, status: 'approved', channel: 'Dhaka Host Group LLC', commissionRate: 15, registeredAt: '2025-11-10', balance: 120, clicks: 420, paymentDetails: 'bKash: 01912345678' },
    ];
    
    const match = list.find((a: any) => a.userId === user.id);
    if (match) {
      setAffiliateProfile(match);
      setAffiliateStatus(match.status);
    } else {
      setAffiliateStatus('unregistered');
      setAffiliateProfile(null);
    }

    const savedRefs = localStorage.getItem('webzone_affiliate_referrals');
    const refs = savedRefs ? JSON.parse(savedRefs) : [
      { id: 'ref-1', affiliateId: 'usr-101', affiliateCode: 'PARTNER-IMRAN', referredUserName: 'Anwar Hossain', productName: 'Corporate Portal Dynamic Development', saleAmount: 450, commissionEarned: 90, campaignSuffix: 'tech_post', date: '2026-06-12', status: 'approved' },
      { id: 'ref-2', affiliateId: 'usr-102', affiliateCode: 'PARTNER-MAJID', referredUserName: 'Bander Al-Harbi', productName: 'Premium VPS Dedicated Node', saleAmount: 1200, commissionEarned: 300, campaignSuffix: 'hosting_campaign', date: '2026-06-11', status: 'approved' }
    ];
    const filteredRefs = refs.filter((r: any) => r.affiliateId === user.id);
    setAffiliateReferralsList(filteredRefs);
  }, [user, activeTab]);

  const handleAffiliateRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const generatedCode = `AFF-${user.name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPartner = {
      userId: user.id,
      name: user.name,
      email: user.email,
      code: generatedCode,
      status: 'pending',
      channel: promoChannel,
      paymentDetails: `${withdrawGateway}: ${payoutDetails}`,
      commissionRate: 15,
      clicks: 0,
      referrals: 0,
      totalEarned: 0,
      balance: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      country: promoCountry
    };

    const savedList = localStorage.getItem('webzone_affiliate_list');
    const currentList = savedList ? JSON.parse(savedList) : [
      { userId: 'usr-101', name: 'Imran Hasan', code: 'PARTNER-IMRAN', referrals: 24, commissionEarned: 1240, status: 'approved', channel: 'Personal Tech Blog', commissionRate: 20, registeredAt: '2025-10-15', balance: 140, clicks: 1482, paymentDetails: 'bKash: 01711223344' },
      { userId: 'usr-102', name: 'Al-Shehri Majid', code: 'PARTNER-MAJID', referrals: 58, commissionEarned: 3500, status: 'approved', channel: 'Riyadh Hosting Network', commissionRate: 25, registeredAt: '2025-11-20', balance: 840, clicks: 3120, paymentDetails: 'PayPal: majid@saudiweb.com' },
      { userId: 'usr-103', name: 'Zeeshan Rahman', code: 'PARTNER-ZEESHAN', referrals: 8, commissionEarned: 320, status: 'approved', channel: 'YouTube Channel', commissionRate: 15, registeredAt: '2026-01-11', balance: 0, clicks: 540, paymentDetails: 'Nagad: 01864051151' },
      { userId: 'usr-105', name: 'Enamul Haque', code: 'AFF-ENAMUL', referrals: 15, commissionEarned: 560, status: 'approved', channel: 'Dhaka Host Group LLC', commissionRate: 15, registeredAt: '2025-11-10', balance: 120, clicks: 420, paymentDetails: 'bKash: 01912345678' },
    ];
    currentList.push(newPartner);
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(currentList));

    setAffiliateProfile(newPartner);
    setAffiliateStatus('pending');
    triggerToast('🎉 Growth Partner application successfully logged! Review in progress...');
  };

  const handleSimulateAffiliateClick = () => {
    if (!affiliateProfile || !user) return;
    const savedList = localStorage.getItem('webzone_affiliate_list');
    const currentList = savedList ? JSON.parse(savedList) : [];
    const updated = currentList.map((a: any) => {
      if (a.userId === user.id) {
        return { ...a, clicks: (a.clicks || 0) + 1 };
      }
      return a;
    });
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(updated));
    const matched = updated.find((a: any) => a.userId === user.id);
    setAffiliateProfile(matched);
    triggerToast('🔗 Simulated Referral Click logged! Affiliate Clicks incremented (+1 click)');
  };

  const handleSimulatePromotionSale = () => {
    if (!affiliateProfile || !user) return;
    const productPrice = 250; // Dynamic Web solution
    const rate = affiliateProfile.commissionRate || 15;
    const comm = parseFloat((productPrice * (rate / 100)).toFixed(2));

    // Update partner profile
    const savedList = localStorage.getItem('webzone_affiliate_list');
    const currentList = savedList ? JSON.parse(savedList) : [];
    const updatedList = currentList.map((a: any) => {
      if (a.userId === user.id) {
        return { 
          ...a, 
          referrals: (a.referrals || 0) + 1, 
          commissionEarned: (a.commissionEarned || 0) + comm, 
          balance: parseFloat(((a.balance || 0) + comm).toFixed(2))
        };
      }
      return a;
    });
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(updatedList));
    const matched = updatedList.find((a: any) => a.userId === user.id);
    setAffiliateProfile(matched);

    // Add referral record
    const savedRefs = localStorage.getItem('webzone_affiliate_referrals');
    const refs = savedRefs ? JSON.parse(savedRefs) : [];
    const newRef = {
      id: "ref-sim-" + Math.floor(10000 + Math.random() * 90000),
      affiliateId: user.id,
      affiliateCode: affiliateProfile.code,
      referredUserName: "Mock Referred Client (" + ['Rahim Uddin', 'Karim Al-Hasan', 'Saeed Chowdhury', 'Yousuf Ali'][Math.floor(Math.random() * 4)] + ")",
      productName: 'E-Commerce Enterprise Starter Stack',
      saleAmount: productPrice,
      commissionEarned: comm,
      campaignSuffix: customAffSuffix || 'dashboard_sandbox',
      date: new Date().toISOString().split('T')[0],
      status: 'approved'
    };
    refs.push(newRef);
    localStorage.setItem('webzone_affiliate_referrals', JSON.stringify(refs));
    setAffiliateReferralsList(refs.filter((r: any) => r.affiliateId === user.id));

    triggerToast(`💸 Simulated Referral Order completed! Commission of $${comm} credited to your available balance!`);
  };

  const handleAffiliateWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !affiliateProfile) return;
    const amountFloat = parseFloat(withdrawAmt);

    if (isNaN(amountFloat) || amountFloat <= 0) {
      triggerToast('Error: Invalid payout request amount.');
      return;
    }

    if (amountFloat < 20) {
      triggerToast('⚠️ Minimum withdrawal limit threshold is $20.00 USD.');
      return;
    }

    if (amountFloat > affiliateProfile.balance) {
      triggerToast('⚠️ Insufficient available partner funds! Withdrawable balance is $' + affiliateProfile.balance + ' USD.');
      return;
    }

    // Deduct partner balance immediately
    const savedList = localStorage.getItem('webzone_affiliate_list');
    const currentList = savedList ? JSON.parse(savedList) : [];
    const updatedList = currentList.map((a: any) => {
      if (a.userId === user.id) {
        return { ...a, balance: parseFloat((a.balance - amountFloat).toFixed(2)) };
      }
      return a;
    });
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(updatedList));
    const matched = updatedList.find((a: any) => a.userId === user.id);
    setAffiliateProfile(matched);

    // Create withdrawal request
    const savedWithdrawals = localStorage.getItem('webzone_admin_withdrawals');
    const withdrawals = savedWithdrawals ? JSON.parse(savedWithdrawals) : [];
    const newRequest = {
      id: "tx-" + Math.floor(1000 + Math.random() * 9000),
      partnerId: user.id,
      partnerName: user.name,
      partnerCode: affiliateProfile.code,
      amout: amountFloat,
      method: withdrawGateway,
      details: payoutDetails || `Registered mobile payload address`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    withdrawals.push(newRequest);
    localStorage.setItem('webzone_admin_withdrawals', JSON.stringify(withdrawals));

    triggerToast(`💸 Withdraw ticket for $${amountFloat} via ${withdrawGateway} submitted! Authorized in under 24 hours.`);
  };

  const handleAutoApproveSelfDev = () => {
    if (!user) return;
    const savedList = localStorage.getItem('webzone_affiliate_list');
    const currentList = savedList ? JSON.parse(savedList) : [];
    let matched = currentList.find((a: any) => a.userId === user.id);
    if (!matched) {
      matched = {
        userId: user.id,
        name: user.name,
        email: user.email,
        code: `AFF-${user.name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        status: 'approved',
        channel: 'Personal Blog',
        paymentDetails: 'bKash: 01700000000',
        commissionRate: 15,
        clicks: 12,
        referrals: 1,
        totalEarned: 15,
        balance: 15,
        registeredAt: new Date().toISOString().split('T')[0],
        country: 'Bangladesh'
      };
      currentList.push(matched);
    } else {
      matched.status = 'approved';
    }
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(currentList));
    setAffiliateProfile(matched);
    setAffiliateStatus('approved');
    triggerToast('⚡ Developer Sandbox Override: Grow partner approved!');
  };

  // Wallet deposit simulated state
  const [depositAmount, setDepositAmount] = useState('50');
  const [depositChannel, setDepositChannel] = useState<'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Stripe'>('bKash');
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`webzone_wallet_balance_${user?.id || 'guest'}`);
    return saved ? parseFloat(saved) : 0.00;
  });

  // Aliases and state bridges for full-featured billing, DNS, and hosting integrations
  const userWalletBalance = walletBalance;
  const setUserWalletBalance = setWalletBalance;

  const [dnsRecords, setDnsRecords] = useState(() => {
    const isPreseededUser = ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-105', 'usr-vendor', 'usr-admin', 'usr-webzonebd-admin'].includes(user?.id || '');
    if (!isPreseededUser) return [];
    return [
      { id: 'dns-1', type: 'A', host: '@', value: '103.84.148.29', ttl: '3600' },
      { id: 'dns-2', type: 'CNAME', host: 'www', value: 'webzonebd-ecommerce.com', ttl: '14400' },
      { id: 'dns-3', type: 'MX', host: '@', value: 'mail.webzonebd.com (Priority: 10)', ttl: '3600' }
    ];
  });

  const activeHosting = hostingPackages;
  const setActiveHosting = setHostingPackages;

  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

  const setWishlistedItems = (arg: any) => {
    if (!user || !onUpdateUser) return;
    const currentList = products.filter(prod => user?.wishlistedProductIds?.includes(prod.id));
    const newList = typeof arg === 'function' ? arg(currentList) : arg;
    const newIds = newList.map((x: any) => x.id);
    onUpdateUser({
      ...user,
      wishlistedProductIds: newIds
    });
  };

  const [purchasedLicensesList, setPurchasedLicensesList] = useState<any[]>([]);

  // Project Portal Simulated State
  const [activeProjectTab, setActiveProjectTab] = useState<'details' | 'milestones' | 'chat'>('details');
  const [projectComments, setProjectComments] = useState<{sender: string, text: string, time: string}[]>(() => {
    const isPreseededUser = ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-105', 'usr-vendor', 'usr-admin', 'usr-webzonebd-admin'].includes(user?.id || '');
    if (!isPreseededUser) return [];
    return [
      { sender: 'developer', text: 'আসসালামু আলাইকুম, we have successfully drafted the UI mockup screens based on your parameters. Let us know your feedback.', time: '10:15 AM' },
      { sender: 'user', text: 'Looks magnificent. Please configure bKash checkout APIs in the production container next.', time: '11:42 AM' },
      { sender: 'developer', text: 'Understood. We are wrapping the webhook configurations. Deployment is slated for Friday.', time: '11:50 AM' }
    ];
  });
  const [commentInput, setCommentInput] = useState('');

  // Licensing Verification Engine Simulated States
  const [domainToVerify, setDomainToVerify] = useState('');
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
  const [licenseVerificationResult, setLicenseVerificationResult] = useState<'success' | 'failure' | null>(null);

  // AI Domain Generator Custom States
  const [toggleDemoRole, setToggleDemoRole] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiGeneratedDomains, setAiGeneratedDomains] = useState<any[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // General Domain Search State
  const [domainSearchQuery, setDomainSearchQuery] = useState('');
  const [domainSearchStatus, setDomainSearchStatus] = useState<'idle' | 'searching' | 'available' | 'error'>('idle');

  // Request Custom Project Form States
  const [reqProjectTitle, setReqProjectTitle] = useState('');
  const [reqProjectCategory, setReqProjectCategory] = useState('E-commerce Digital Store');
  const [reqProjectBudget, setReqProjectBudget] = useState('$100 - $300');
  const [reqProjectTech, setReqProjectTech] = useState('React + Node.js (Full Stack)');
  const [reqProjectDetails, setReqProjectDetails] = useState('');

  // Sync profile details when changed
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfileWhatsApp(user.phone);
      if (user.avatar) setProfileAvatar(user.avatar);
    }
  }, [user]);

  // Synchronize wallet balance to storage
  useEffect(() => {
    localStorage.setItem(`webzone_wallet_balance_${user?.id || 'guest'}`, walletBalance.toString());
  }, [walletBalance, user]);

  useEffect(() => {
    localStorage.setItem(`webzone_domains_${user?.id || 'guest'}`, JSON.stringify(domains));
  }, [domains, user]);

  useEffect(() => {
    localStorage.setItem(`webzone_hosting_packages_${user?.id || 'guest'}`, JSON.stringify(hostingPackages));
  }, [hostingPackages, user]);

  useEffect(() => {
    localStorage.setItem(`webzone_services_${user?.id || 'guest'}`, JSON.stringify(services));
  }, [services, user]);



  useEffect(() => {
    localStorage.setItem(`webzone_reward_points_${user?.id || 'guest'}`, rewardPoints.toString());
  }, [rewardPoints, user]);

  useEffect(() => {
    localStorage.setItem(`webzone_reward_history_${user?.id || 'guest'}`, JSON.stringify(rewardHistory));
  }, [rewardHistory, user]);

  useEffect(() => {
    localStorage.setItem(`webzone_notifications_${user?.id || 'guest'}`, JSON.stringify(notifications));
  }, [notifications, user]);

  const addSuggestedService = (type: 'gbp' | 'growth' | 'store') => {
    let newSrv: any = null;
    if (type === 'gbp') {
      newSrv = {
        id: 'srv-gbp',
        name: 'Google Business Profile Setup Service',
        category: 'SEO / Google Maps Optimization',
        status: 'In Progress',
        progress: 10,
        dueDate: '2026-06-12',
        assignedTeam: 'SEO Growth Wizards',
        phases: { design: 'Completed', development: 'In Progress', testing: 'Pending', deployment: 'Pending' },
        timeline: 'Google verification code dispatched'
      };
    } else if (type === 'growth') {
      newSrv = {
        id: 'srv-growth',
        name: 'Business Growth Packages',
        category: 'Growth Strategy',
        status: 'In Progress',
        progress: 15,
        dueDate: '2026-06-25',
        assignedTeam: 'Premium Engineers Group B',
        phases: { design: 'In Progress', development: 'Pending', testing: 'Pending', deployment: 'Pending' },
        timeline: 'Marketing funnel planning & analytics calibration'
      };
    } else if (type === 'store') {
      newSrv = {
        id: 'srv-store',
        name: 'Digital Marketplace Store',
        category: 'E-commerce Solutions',
        status: 'In Progress',
        progress: 8,
        dueDate: '2026-07-02',
        assignedTeam: 'WebzoneBD Core Product Dept',
        phases: { design: 'Completed', development: 'In Progress', testing: 'Pending', deployment: 'Pending' },
        timeline: 'Gateway endpoints binding with SSLCommerz / bKash sandbox'
      };
    }

    if (newSrv) {
      if (services.some(s => s.id === newSrv.id)) {
        triggerToast(`⚠️ "${newSrv.name}" is already active in your services catalog.`);
        return;
      }
      setServices(prev => [...prev, newSrv]);
      onAddActivityLog(`Activated recommended setup contract: ${newSrv.name}`);
      triggerToast(`✨ Successfully added "${newSrv.name}" to your Custom Services!`);
    }
  };

  const handleDepositFund = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerToast('⚠️ Please specify a valid deposit token amount.');
      return;
    }
    setWalletBalance(prev => prev + amt);
    onAddActivityLog(`Deposited $${amt.toFixed(2)} via ${depositChannel}`);
    triggerToast(`💳 Success! $${amt.toFixed(2)} added securely via ${depositChannel} live portal API.`);
    setDepositAmount('50');
  };

  const handlePostProjectComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = { sender: 'user', text: commentInput, time: 'Just now' };
    setProjectComments(prev => [...prev, newComment]);
    setCommentInput('');
    onAddActivityLog(`Posted update comment inside Project Portal: "${commentInput.slice(0, 30)}..."`);
    
    setTimeout(() => {
      setProjectComments(prev => [...prev, {
        sender: 'developer',
        text: 'Thank you for your feedback! Our engineering lead is reviewing your remarks and will coordinate within our current development sprint cycle.',
        time: 'Just now'
      }]);
    }, 1500);
  };

  const handleVerifyLicenseDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainToVerify.trim()) {
      triggerToast('⚠️ Please input a domain address to execute connection sweep.');
      return;
    }
    setIsVerifyingLicense(true);
    setLicenseVerificationResult(null);
    onAddActivityLog(`Initiated licensing sweep protocol for domain: ${domainToVerify}`);

    setTimeout(() => {
      setIsVerifyingLicense(false);
      setLicenseVerificationResult('success');
      triggerToast('🛡️ Licensing validation verified! Domain registered successfully.');
    }, 1200);
  };

  // Pricing Formatter Helper
  const formatPrice = (usd: number) => {
    let cur = currency;
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates;
      if (!currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
    }
    const rate = rates[cur] ?? 1.0;
    const converted = usd * rate;

    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // Generate a premium visual PDF summary of invoice transaction details
  const generateVisualPDFInvoice = (ord: Order) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors styling definition
      const primaryColor = [37, 99, 235]; // #2563EB
      const secondaryColor = [71, 85, 105]; // #475569
      const darkColor = [15, 23, 42]; // #0F172A
      const lightBg = [248, 250, 252]; // #F8FAFC
      const borderColor = [226, 232, 240]; // #E2E8F0

      // Accent top ribbon band
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 8, 'F');

      // Corporate Brand Header title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('WEBZONEBD', 15, 22);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Premium Software, Scripts, Domain & SSD Cloud hosting', 15, 27);

      // INVOICE Header Section (Top Right Alignment)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('INVOICE', 195, 22, { align: 'right' });

      // Invoice metadata fields
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Invoice ID: #${getOrderSerial(ord.id)}`, 195, 28, { align: 'right' });
      doc.text(`Place Date: ${ord.date}`, 195, 33, { align: 'right' });
      doc.text(`Payment: ${ord.paymentMethod.toUpperCase()}`, 195, 38, { align: 'right' });

      // Clean horizontal separating divider rule
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.4);
      doc.line(15, 45, 195, 45);

      // Left Column: Business details
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('FROM:', 15, 53);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('WebzoneBD IT Solutions Ltd.', 15, 58);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Dhaka Office: House 4, Block F, Banani Road, Dhaka 1213', 15, 63);
      doc.text('Saudi Arabia Online Node Support Hub', 15, 67);
      doc.text('Contact WhatsApp: +966-570511931', 15, 71);
      doc.text('Email: support@webzonebd.com', 15, 75);

      // Right Column: Client / Customer billing details
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('BILLED TO:', 110, 53);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(profileName, 110, 58);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      const orgStr = companyName ? `${companyName} (${taxId ? 'VAT: ' + taxId : 'Individual'})` : 'Individual Consumer';
      doc.text(orgStr, 110, 63);
      doc.text(`Email: ${profileEmail}`, 110, 67);
      doc.text(`Phone: ${phoneCode} ${profileWhatsApp}`, 110, 71);
      
      const addrLine1 = billingStreet;
      const addrLine2 = `${billingCity}, ${billingState}, ${billingPostal}`;
      const addrLine3 = billingCountry;
      doc.text(addrLine1, 110, 75);
      doc.text(addrLine2, 110, 79);
      doc.text(addrLine3, 110, 83);

      // Separator rule
      doc.line(15, 90, 195, 90);

      // Calculations table values
      const taxRate = 0.15; // 15% VAT
      const discountRate = 0.20; // 20% Discount
      const basePriceUsd = ord.price / ((1 - discountRate) * (1 + taxRate));
      const discountAmountUsd = basePriceUsd * discountRate;
      const subtotalValueUsd = basePriceUsd - discountAmountUsd;
      const taxAmountUsd = subtotalValueUsd * taxRate;

      // Header gray background rect
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(15, 97, 180, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Product Description / License Item', 18, 102);
      doc.text('Qty', 130, 102, { align: 'center' });
      doc.text('Unit Rate', 155, 102, { align: 'right' });
      doc.text('Total', 192, 102, { align: 'right' });

      // Table Header separation line
      doc.line(15, 105, 195, 105);

      // Table Row
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      
      let displayTitle = ord.itemTitle;
      if (displayTitle.length > 55) {
        displayTitle = displayTitle.substring(0, 52) + '...';
      }

      doc.text(displayTitle, 18, 111);
      doc.text('1', 130, 111, { align: 'center' });
      doc.text(formatPrice(basePriceUsd), 155, 111, { align: 'right' });
      doc.text(formatPrice(basePriceUsd), 192, 111, { align: 'right' });

      // Table Bottom separator line
      doc.line(15, 115, 195, 115);

      // Financial columns alignments
      const finXLabel = 145;
      const finXVal = 192;
      let curY = 122;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      
      doc.text('Base Retail Price:', finXLabel, curY);
      doc.text(formatPrice(basePriceUsd), finXVal, curY, { align: 'right' });
      
      curY += 6;
      doc.text('Promo Coupon (20%):', finXLabel, curY);
      doc.setTextColor(16, 185, 129); // emerald green
      doc.text(`-${formatPrice(discountAmountUsd)}`, finXVal, curY, { align: 'right' });
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

      curY += 6;
      doc.text('Discounted Subtotal:', finXLabel, curY);
      doc.text(formatPrice(subtotalValueUsd), finXVal, curY, { align: 'right' });

      curY += 6;
      doc.text('VAT & IT Service Tax (15%):', finXLabel, curY);
      doc.text(`+${formatPrice(taxAmountUsd)}`, finXVal, curY, { align: 'right' });

      // Solid line for net total header
      curY += 4;
      doc.line(135, curY, 195, curY);

      curY += 6;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Grand Total Paid:', finXLabel, curY);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(formatPrice(ord.price), finXVal, curY, { align: 'right' });

      // Visual Status badge Stamp (Left side of financials)
      let stampColor = [16, 185, 129]; // Emerald (completed)
      let stampText = 'PAID / SECURED';
      if (ord.paymentStatus === 'failed') {
        stampColor = [239, 68, 68]; // Crimson
        stampText = 'PAYMENT FAILED';
      } else if (ord.paymentStatus === 'pending') {
        stampColor = [245, 158, 11]; // Amber
        stampText = 'PENDING CLEAR';
      }

      doc.setDrawColor(stampColor[0], stampColor[1], stampColor[2]);
      doc.setLineWidth(0.8);
      // Stamp rectangle box outline
      doc.rect(15, 125, 60, 16);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(stampColor[0], stampColor[1], stampColor[2]);
      doc.text(stampText, 45, 135, { align: 'center' });
      doc.setFontSize(6.5);
      doc.text('CRYPTOGRAPHIC LICENSING VALID', 45, 139, { align: 'center' });

      // Sync sub-labels 
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Payment Gateway: ${ord.paymentMethod.toUpperCase()}`, 15, 147);
      doc.text(`Licensing Node Code: ${ord.id.toUpperCase().replace('ORD-', 'WZB-NODE-')}`, 15, 151);

      // Terms list & bottom declarations
      const footerY = 250;
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(15, footerY - 5, 195, footerY - 5);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Declaration & Terms of Digital Delivery', 15, footerY);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('1. This is a system-generated electronic invoice securing full digital licenses under GPL regulations.', 15, footerY + 4);
      doc.text('2. Downloaded software/scripts are instantly registered on our node database for support ticket authentication.', 15, footerY + 8);
      doc.text('3. Cloud hosting purchases operate with dedicated automatic cPanel allocation setups.', 15, footerY + 12);
      doc.text('Contact Hotline: +966-570511931 | Website: https://webzonebd.com | support@webzonebd.com', 15, footerY + 16);

      // Dark elegant footer accent ribbon bar
      doc.setFillColor(30, 41, 59); // Slate 800
      doc.rect(0, 285, 210, 12, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('SECURE CRYPTOGRAPHIC TRANSACTION GATE • POWERED BY WEBZONEBD SYSTEMS', 105, 292, { align: 'center' });

      // Save PDF output
      doc.save(`invoice_WEBZONEBD_${getOrderSerial(ord.id)}.pdf`);
      triggerToast('📥 Visual PDF summary downloaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('🚨 Failed to compile custom dynamic PDF invoice. Please use the Print Memo fallback.');
    }
  };

  // Image Upload Parser
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("⚠️ Upload failed! File is too heavy. Maximum allowed limit is 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setProfileAvatar(base64Data);
        if (user) {
          const updatedUser = { ...user, avatar: base64Data };
          onUpdateUser(updatedUser);
          onAddActivityLog(`Updated profile avatar schema.`);
          triggerToast("✨ Profile avatar parsed and persistent successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Basic Name and Email validation
    if (!profileName.trim()) {
      triggerToast("⚠️ Full Name is required!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail)) {
      triggerToast("⚠️ Please enter a valid email address!");
      return;
    }

    // 2. Phone validation
    const cleanPhone = profileWhatsApp.replace(/\D/g, '');
    if (cleanPhone.length < 6 || cleanPhone.length > 15) {
      triggerToast("⚠️ Phone number should be between 6 and 15 digits!");
      return;
    }

    // 3. Optional Password changes validation
    if (curPass || newPass || confPass) {
      if (!curPass) {
        triggerToast("⚠️ Current password is required to save password modifications.");
        return;
      }
      if (newPass.length < 6) {
        triggerToast("⚠️ New password must be at least 6 characters long.");
        return;
      }
      if (newPass !== confPass) {
        triggerToast("⚠️ Confirmed password does not match new password!");
        return;
      }
      onAddActivityLog("Changed account security credentials password.");
      setCurPass('');
      setNewPass('');
      setConfPass('');
      triggerToast("🔑 Password updated and rotated successfully!");
    }

    if (user) {
      const updatedUser: UserSession = {
        ...user,
        name: profileName,
        email: profileEmail,
        phone: profileWhatsApp,
        avatar: profileAvatar,
        phoneCode,
        companyName,
        taxId,
        billingStreet,
        billingCity,
        billingState,
        billingCountry,
        billingPostal,
        tfaEnabled,
        prefOrder,
        prefMilestone,
        prefSupport,
        prefRenewal,
        googleConnected,
        githubConnected
      };
      onUpdateUser(updatedUser);
      onAddActivityLog(`Updated client profile details info config.`);
      triggerToast("💾 Success! Account settings and security configurations saved securely.");
    }
  };

  const handleVendorProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorProdName || !vendorProdDesc) {
      triggerToast("⚠️ Please supply necessary script parameters.");
      return;
    }
    const newPr: Product = {
      id: "vendor-" + Date.now(),
      name: vendorProdName,
      nameBn: vendorProdName,
      nameAr: vendorProdName,
      category: vendorProdCategory as any,
      price: vendorProdPrice,
      rating: 4.8,
      reviewsCount: 1,
      description: vendorProdDesc,
      descriptionBn: vendorProdDesc,
      descriptionAr: vendorProdDesc,
      features: ["Verified Vendor Asset", "Certified compliance source code"],
      featuresBn: ["ভেন্ডর অনুমোদিত সোর্স কোড"],
      featuresAr: ["كود أمان معتمد للبيع"],
      image: vendorProdImage || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80",
      demoUrl: "https://demo.webzonebd.com",
      downloadUrl: "https://webzonebd.com/downloads/vendor-code.zip",
      tags: [vendorProdCategory, "Vendor Studio Release"],
      views: 12
    };
    onAddProduct(newPr);
    onAddActivityLog(`Created vendor script catalog product: ${vendorProdName}`);
    triggerToast(`🎉 Success! "${vendorProdName}" successfully cataloged in the Marketplace.`);
    setVendorProdName('');
    setVendorProdDesc('');
    setVendorProdImage('');
    setVendorProdImageFile(null);
  };

  const handleScriptDownload = (order: Order) => {
    try {
      const sanitizedName = order.itemTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const licenseKeyString = `WB-${order.id.slice(4).toUpperCase()}-9218-${Math.floor(1000 + Math.random() * 9000)}`;
      const demoContent = `========================================================================
WEBZONEBD IT SOLUTION - SECURE LICENSED DIGITAL PACKAGE
========================================================================
License Key Code: ${licenseKeyString}
License Owner  : ${profileName} (${profileEmail})
Assigned Order  : ${order.itemTitle}
Order Ref ID   : ${order.id}
Transaction     : ${order.paymentMethod}
Date Stamp      : ${new Date().toLocaleDateString()}
Value Paid      : ${formatPrice(order.price)}

THIS REPRESENTS A SECURE AUTHENTICATE ZIP FILE EMBEDDED WITH SECURITY SCRIPTS.
ALL PHP DEPENDENCIES ARE CONFIGURED FOR SERVERS UPWARD OF VERSION 8.1.
========================================================================
🛡️ WebzoneBD 24/7 Technical Support Center • Bangladesh: +8801864000005`;

      const blob = new Blob([demoContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizedName}_installation_pack.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onAddActivityLog(`Downloaded asset file zip pack: ${order.itemTitle}`);
      triggerToast(language === 'bn' ? `ডাউনলোড শুরু হয়েছে: ${order.itemTitle}` : `ZIP Download triggered successfully for: ${order.itemTitle}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      triggerToast("⚠️ Subject and details fields are mandatory.");
      return;
    }
    const newTicket: SupportTicket = {
      id: "tkt-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
      subject: ticketSubject,
      category: "Secure Web cPanel Configuration",
      priority: ticketPriority,
      message: ticketMessage,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      replies: [
        {
          sender: 'user',
          message: ticketMessage,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    addSupportTicket(newTicket);
    onAddActivityLog(`Raised technical support ticket thread: "${ticketSubject}"`);
    triggerToast(language === 'bn' ? "নতুন টেকনিক্যাল সাপোর্ট টিকিট তৈরি হয়েছে!" : "Emergency support ticket launched successfully!");
    setTicketSubject('');
    setTicketMessage('');
    setTicketModalOpen(false);

    setTimeout(() => {
      const responseText = `Hello ${profileName}, thank you for contacting WebzoneBD Support. We have logged your ticket "${ticketSubject}" as "${ticketPriority.toUpperCase()}" priority. A senior developer will examine the database or port setup in less than 10 minutes.`;
      addTicketReply(newTicket.id, responseText, 'admin');
    }, 2500);
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage || !activeTicketForChat) return;

    addTicketReply(activeTicketForChat.id, chatMessage, 'user');
    setChatMessage('');

    setTimeout(() => {
      const responseText = `Understood your parameters. We have assigned this ticket to our senior systems administrator for immediate intervention.`;
      addTicketReply(activeTicketForChat.id, responseText, 'admin');
    }, 2000);
  };

  useEffect(() => {
    if (activeTicketForChat) {
      const updated = tickets.find(t => t.id === activeTicketForChat.id);
      if (updated) setActiveTicketForChat(updated);
    }
  }, [tickets, activeTicketForChat]);

  // Security credentials permissions
  const canAccessVendor = user?.role === 'vendor' || user?.role === 'admin';
  const canAccessStaff = user?.role === 'staff' || user?.role === 'admin';

  const isNewClient = orders.length === 0 && !toggleDemoRole;
  const displayedServices = services;
  const displayedHostingPackages = hostingPackages;
  const displayedDomains = domains;

  // Extract wishlisted products from the master list using IDs synced dynamically inside the User object
  const wishlistedItems = products.filter(prod => user?.wishlistedProductIds?.includes(prod.id));



  // Auto-derived licenses from client purchases mapping
  const activeLicensesLists = orders.map((ord, idx) => ({
    id: `LIC-${ord.id}`,
    itemTitle: ord.itemTitle,
    key: `WB-${ord.id.slice(4).toUpperCase()}-9218-${1000 + (idx * 27)}`,
    domain: `clientwebsite-${ord.id.slice(4)}.com`,
    status: 'active',
    createdAt: ord.date
  }));

  interface SubMenuItem {
    id: string;
    label: string;
    labelBn: string;
  }

  interface MenuItem {
    id: string;
    label: string;
    labelBn: string;
    subMenus?: SubMenuItem[];
  }

  // Sidebar Menu Layout listing hierarchical mapping
  const clientMenus: MenuItem[] = [
    { id: 'dashboard', label: '🏠 Dashboard', labelBn: '🏠 ড্যাশবোর্ড' },
    {
      id: 'my-orders',
      label: '📦 My Orders',
      labelBn: '📦 আমার অর্ডার'
    },
    {
      id: 'downloads',
      label: '⬇️ Download Center',
      labelBn: '⬇️ ডাউনলোডস সেন্টার'
    },
    {
      id: 'wishlist',
      label: '❤️ Saved Wishlist',
      labelBn: '❤️ আমার উইশলিস্ট'
    },

    {
      id: 'billing',
      label: '🧾 Billing & Invoices',
      labelBn: '🧾 বিলিং ও ইনভয়েস'
    },
    {
      id: 'affiliate-program',
      label: '🤝 Affiliate Program',
      labelBn: '🤝 এফিলিয়েট প্রোগ্রাম'
    },
    {
      id: 'profile',
      label: '⚙️ Account Settings',
      labelBn: '⚙️ অ্যাকাউন্ট সেটিংস'
    }
  ];

  // Expanded menu section state handler (WordPress / Hostinger visual mechanics)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
    const saved = localStorage.getItem('webzone_dashboard_active_tab') || 'dashboard';
    if (saved.includes('order')) return 'my-orders';
    if (saved.includes('domain') || ['active-domains', 'renew-domains', 'dns-manager', 'whois-lookup'].includes(saved)) return 'my-domains';
    if (saved.includes('hosting') || ['active-hosting', 'hosting-performance', 'cpanel-login'].includes(saved)) return 'my-hosting';
    if (saved.includes('service') || ['active-services', 'project-phases', 'timeline-map'].includes(saved)) return 'my-services';
    if (saved.includes('download') || ['software-downloads', 'purchased-files', 'product-updates', 'download-history'].includes(saved)) return 'downloads';
    if (saved.includes('wishlist') || ['saved-products', 'saved-services'].includes(saved)) return 'wishlist';
    if (saved.includes('ticket') || ['open-tickets', 'create-ticket', 'whatsapp-telegram'].includes(saved)) return 'tickets';
    if (saved.includes('billing') || ['pending-invoices', 'paid-invoices', 'wallet-funds', 'payment-history'].includes(saved)) return 'billing';
    if (saved.includes('affiliate') || ['affiliate-dashboard', 'referral-links', 'referral-qrs'].includes(saved)) return 'affiliate-program';
    if (['basic', 'security', 'sessions', 'billing-info', 'noti', 'social', 'privacy'].includes(saved)) return 'profile';
    return 'dashboard';
  });

  // Watch and synchronize state mapping dynamically on route triggers
  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'digital-store') {
        if (onNavigate) {
          onNavigate('marketplace');
        }
        const prevTab = localStorage.getItem('webzone_dashboard_last_valid_tab') || 'dashboard';
        setActiveTab(prevTab);
        return;
      } else {
        localStorage.setItem('webzone_dashboard_last_valid_tab', activeTab);
      }
      if (activeTab.includes('order')) setExpandedMenu('my-orders');
      else if (activeTab.includes('domain') || ['active-domains', 'renew-domains', 'dns-manager', 'whois-lookup'].includes(activeTab)) setExpandedMenu('my-domains');
      else if (activeTab.includes('hosting') || ['active-hosting', 'hosting-performance', 'cpanel-login'].includes(activeTab)) setExpandedMenu('my-hosting');
      else if (activeTab.includes('service') || ['active-services', 'project-phases', 'timeline-map'].includes(activeTab)) setExpandedMenu('my-services');
      else if (activeTab === 'downloads' || activeTab.includes('download') || ['software-downloads', 'purchased-files', 'product-updates', 'download-history'].includes(activeTab)) setExpandedMenu('downloads');
      else if (activeTab.includes('wishlist') || ['saved-products', 'saved-services'].includes(activeTab)) setExpandedMenu('wishlist');
      else if (activeTab.includes('ticket') || ['open-tickets', 'create-ticket', 'whatsapp-telegram'].includes(activeTab)) setExpandedMenu('tickets');
      else if (activeTab.includes('billing') || ['pending-invoices', 'paid-invoices', 'wallet-funds', 'payment-history'].includes(activeTab)) setExpandedMenu('billing');
      else if (activeTab.includes('affiliate') || ['affiliate-dashboard', 'referral-links', 'referral-qrs'].includes(activeTab)) setExpandedMenu('affiliate-program');
      else if (['profile', 'basic', 'security', 'sessions', 'billing-info', 'noti', 'social', 'privacy'].includes(activeTab)) setExpandedMenu('profile');
      else if (activeTab === 'dashboard') setExpandedMenu('dashboard');
    }
    // Handle special automatic support ticket modal trigger
    if (activeTab === 'create-ticket') {
      setTicketModalOpen(true);
    }
  }, [activeTab]);

  const getHierarchyPath = () => {
    if (activeTab === 'dashboard') {
      return { parent: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', child: null };
    }
    if (activeTab === 'vendor') {
      return { parent: language === 'bn' ? 'ভেন্ডর স্টুডিও' : 'Vendor Studio Workspace', child: null };
    }
    if (activeTab === 'staff') {
      return { parent: language === 'bn' ? 'স্টাফ অ্যাডমিন' : 'Staff Admin Dashboard', child: null };
    }

    
    // Find in clientMenus
    for (const menu of clientMenus) {
      if (menu.id === activeTab) {
        return {
          parent: language === 'bn' ? menu.labelBn : menu.label,
          child: null
        };
      }
      if (menu.subMenus) {
        const sub = menu.subMenus.find(s => s.id === activeTab);
        if (sub) {
          return {
            parent: language === 'bn' ? menu.labelBn : menu.label,
            child: language === 'bn' ? sub.labelBn : sub.label
          };
        }
      }
    }
    return { parent: activeTab, child: null };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Double-span Premium Container wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Premium Collapsible Responsive Navigation Component */}
          <Sidebar
            language={language}
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            expandedMenu={expandedMenu}
            setExpandedMenu={setExpandedMenu}
            walletBalance={walletBalance}
            currency={currency}
            setCurrency={setCurrency}
            triggerToast={triggerToast}
            formatPrice={formatPrice}
            onLogout={onLogout}
            onAddActivityLog={onAddActivityLog}
            clientMenus={clientMenus}
            canAccessVendor={canAccessVendor}
            canAccessStaff={canAccessStaff}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={handleSetSidebarCollapsed}
            theme={theme}
            setTheme={setTheme}
          />

          {/* RIGHT CONTENT PANEL: Interactive SaaS Pages Switch Board */}
          <div className={`${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'} transition-all duration-300 space-y-6`}>
            
            {/* Elegant Hierarchical Location Breadcrumb */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800/80 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-slate-400 font-sans">
                <span className="hover:text-indigo-650 dark:hover:text-cyan-400 transition cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  {language === 'bn' ? 'পোর্টাল হোম' : 'Portal Home'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                
                {/* Parent category tab link/badge */}
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-50 dark:bg-[#0EA5E9]/10 text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-cyan-900/15`}>
                  {getHierarchyPath().parent}
                </span>

                {getHierarchyPath().child && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">/</span>
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-[#0EA5E9]/10 text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-cyan-900/15 rounded-md text-[11px] font-extrabold">
                      {getHierarchyPath().child}
                    </span>
                  </>
                )}
              </div>

              {/* Status Indicator bubble */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-extrabold font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider select-none">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {language === 'bn' ? 'সিস্টেম অনলাইন' : 'Console Active'}
              </div>
            </div>
            
            {/* 1.🏠 ACTIVE VIEW: DASHBOARD INSIGHT HUB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300 font-sans">
                


                {/* 1. WELCOME CARD */}
                {adminWidgets.welcomeCard && (
                  <div className="relative rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-white p-6 sm:p-8 overflow-hidden shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-cyan-200 px-3 py-1 rounded-full text-[10px] font-black font-mono tracking-wider">
                            🌟 {adminWidgets.customerPermissions.toUpperCase()}
                          </span>
                          <span className="bg-emerald-500 text-slate-950 font-sans text-[10px] font-bold px-2 py-0.5 rounded-md">
                            VIP MEMBER
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-none text-white font-sans">
                          {language === 'bn' ? `স্বাগতম, ${profileName}` : `Welcome back, ${profileName}`} 👋
                        </h2>
                        
                        {isNewClient ? (
                          <div className="bg-neutral-950/40 border border-white/10 rounded-2xl p-4 sm:p-5 text-left space-y-3.5 mt-3 text-xs font-sans leading-relaxed text-slate-100 max-w-2xl">
                            <p className="font-extrabold text-[#38BDF8] flex items-center gap-1.5 border-b border-white/10 pb-2">
                              <span>📋</span> {language === 'bn' ? 'নতুন গ্রাহক গাইডলাইন (Getting Started Guidelines)' : 'New Customer Getting Started Guidelines'}
                            </p>
                            <ul className="space-y-2.5 list-none p-0 m-0">
                              <li className="flex items-start gap-2.5">
                                <span className="p-0.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center shrink-0">১</span>
                                <span>
                                  {language === 'bn' 
                                    ? 'আমাদের ক্যাটালগ বা ডিজিটাল স্টোর থেকে রেডিমেড কোড স্ক্রিপ্ট, ওয়েবসাইট সলিউশন অথবা কাস্টম প্রজেক্ট পছন্দ করুন।' 
                                    : 'Select a premium pre-built script, website template, or custom package from our Solutions Registry or Digital Store.'}
                                </span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="p-0.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center shrink-0">২</span>
                                <span>
                                  {language === 'bn' 
                                    ? 'আপনার পছন্দের প্যাকেজটি সরাসরি অ্যাকাউন্ট ওয়ালেট বা অনলাইন পেমেন্টের মাধ্যমে অর্ডার করুন।' 
                                    : 'Purchase your desired system securely using standard local checkout methods or wallet credits.'}
                                </span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="p-0.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center shrink-0">৩</span>
                                <span>
                                  {language === 'bn' 
                                    ? 'অর্ডার শেষ হওয়ার ৫-১০ মিনিটের মধ্যেই আপনার ডাউনলোড সেন্টার ও লাইসেন্স কি ড্যাশবোর্ডে সচল হয়ে যাবে।' 
                                    : 'Upon verification, your script archives, updates access, and dynamic licensing tools boot up automatically.'}
                                </span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="p-0.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center shrink-0">৪</span>
                                <span>
                                  {language === 'bn' 
                                    ? 'যেকোনো সাহায্যের জন্য ২৪/৭ সাপোর্ট টিকেট তৈরি করুন অথবা সরাসরি আমাদের হোয়াটসঅ্যাপ নাম্বারে যোগাযোগ করুন।' 
                                    : 'Reach out to our customer service 24/7 by lodging a Ticket or pinging our engineering leads on WhatsApp.'}
                                </span>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-white/90">
                            <div>
                              <span className="text-[10px] text-cyan-200 uppercase block">Account Group</span>
                              <span className="font-extrabold text-[11px] truncate block max-w-[160px]">{adminWidgets.customerPermissions.split(' ')[0]} SLA</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-cyan-200 uppercase block">Membership Code</span>
                              <span className="font-extrabold text-[11px] block text-cyan-100">WZD-94420-PRM</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-cyan-200 uppercase block">Customer Since</span>
                              <span className="font-extrabold text-[11px] block">Jan 15, 2023</span>
                            </div>
                          </div>
                        )}

                        {/* Quick action shortcuts as premium pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-4">
                          <button onClick={() => { 
                            if (isNewClient && onNavigate) onNavigate('services');
                            else { setActiveTab('my-services'); triggerToast('Loading WebzoneBD Custom Developers Desk...'); }
                          }} className="p-2 px-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-black uppercase rounded-xl transition cursor-pointer">
                            {isNewClient ? (language === 'bn' ? 'সার্ভিস কিনুন 🚀' : 'Browse Services 🚀') : 'Order Service 🚀'}
                          </button>
                          <button onClick={() => { 
                            if (isNewClient && onNavigate) onNavigate('marketplace');
                            else { setActiveTab('my-services'); triggerToast('Loading WebzoneBD Digital Store Solutions...'); }
                          }} className="p-2 px-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-black uppercase rounded-xl transition cursor-pointer">
                            {language === 'bn' ? 'ডিজিটাল স্টোর 🛒' : 'Go Digital Store 🛒'}
                          </button>
                          <button onClick={() => { setTicketModalOpen(true); }} className="p-2 px-3 bg-amber-500 hover:bg-amber-600 font-bold active:scale-95 text-slate-950 text-[11px] uppercase rounded-xl transition cursor-pointer">
                            Open support ticket 🎫
                          </button>
                        </div>
                      </div>

                      {/* Interactive click-through Balance block */}
                      <div 
                        onClick={() => { 
                          setActiveTab('billing'); 
                          setExpandedMenu('billing');
                          triggerToast('Directing to Billing & Invoices section 🧾...');
                          setTimeout(() => {
                            const elem = document.getElementById('pre-fund-balance');
                            if (elem) {
                              elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 150);
                        }}
                        className="bg-white/10 backdrop-blur-md hover:bg-white/15 rounded-2xl p-5 border border-white/10 space-y-2 w-full md:w-auto font-mono text-center md:text-left min-w-[220px] flex flex-col justify-between shrink-0 transition-all cursor-pointer hover:scale-[1.02] active:scale-98 group shadow-lg"
                        title={language === 'bn' ? 'বিলিং এবং ইনভয়েস পেজে যেতে ক্লিক করুন' : 'Click parameters to open Billing & Invoices panel'}
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-cyan-200 block group-hover:text-cyan-100 transition-colors">
                            {language === 'bn' ? 'চলতি ব্যালেন্স 💳' : 'AVAILABLE WALLET 💳'}
                          </span>
                          <span className="text-3xl font-black text-white block mt-1 group-hover:text-emerald-300 transition-colors">
                            {formatPrice(walletBalance)}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveTab('billing'); 
                            setExpandedMenu('billing');
                            triggerToast('Directing to Pre-Fund Balance section 💳...');
                            setTimeout(() => {
                              const elem = document.getElementById('pre-fund-balance');
                              if (elem) {
                                elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 150);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-[11px] uppercase rounded-xl transition shadow-lg shadow-[#10B981]/20 cursor-pointer hover:scale-[1.02] active:scale-95 mt-2"
                        >
                          ➕ Add Funds Quick
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🚚 REAL-TIME ORDER LOGISTICS & STEPPER TRACKING SUMMARY SECTION */}
                <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-xl space-y-6">
                  {/* Header metadata */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 font-sans tracking-tight">
                        <Package className="w-5.5 h-5.5 text-indigo-500 animate-pulse" />
                        <span>
                          {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও লজিস্টিকস গেটওয়ে' : 'Order Tracking & Dispatch Pipeline'}
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-400 dark:text-slate-400 leading-normal max-w-2xl">
                        {language === 'bn'
                          ? 'আপনার ক্রয়কৃত পিএইচপি স্ক্রিপ্ট, থিম এবং কাস্টম ডাটাবেস অটোমেশনের চলমান অবস্থা এবং প্রসেসিং টাইমলাইন দেখুন।'
                          : 'Monitor real-time server compilation, license keys activation, and source code handover timelines.'}
                      </p>
                    </div>
                    <span className="inline-flex self-start md:self-center items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0 uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      {language === 'bn' ? 'সরাসরি ডিসপ্যাচ রুট সচল' : 'Live Logistics Dispatch Link'}
                    </span>
                  </div>

                  {(() => {
                    const trackableOrdersList = orders.filter(o => o.paymentStatus !== 'pending').map(o => ({
                      id: o.id,
                      itemTitle: o.itemTitle,
                      price: o.price,
                      date: o.date,
                      paymentMethod: o.paymentMethod,
                      paymentStatus: o.paymentStatus as any,
                      trackingId: o.trackingId || (o.paymentStatus === 'completed' ? `WZD-${o.id.toUpperCase()}-TRK-GLOBAL` : undefined),
                      status: o.status || (o.paymentStatus === 'completed' ? 'delivered' : 'processing')
                    }));

                    if (trackableOrdersList.length === 0) {
                      return (
                        <div className="text-center py-12 px-4 rounded-3xl bg-neutral-50/50 dark:bg-slate-900/10 border border-dashed border-neutral-200 dark:border-slate-800 space-y-4">
                          <Inbox className="w-12 h-12 mx-auto text-neutral-400 dark:text-slate-500 stroke-[1.5]" />
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {language === 'bn' ? 'কোনো সক্রিয় ট্র্যাকযোগ্য অর্ডার নেই' : 'No Active Trackable Orders'}
                          </h4>
                          <p className="text-xs text-neutral-450 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            {language === 'bn'
                              ? 'আপনার প্রোফাইলে কোনো সক্রিয় অর্ডার ট্র্যাক করার মতো নেই। একটি নতুন অর্ডার করার পর তার রিয়েল-টাইম ডিসপ্যাচ অগ্রগতি এখানে দেখতে পাবেন।'
                              : 'You have no active orders to track. Once you log in and purchase from our digital store, your real-time script development and delivery tracker will show up here.'}
                          </p>
                        </div>
                      );
                    }

                    const activeTrackedOrder = trackableOrdersList.find(o => o.id === selectedTrackingOrderId) || trackableOrdersList[0];
                    const activeStep = orderTrackingSteps[activeTrackedOrder.id] !== undefined ? orderTrackingSteps[activeTrackedOrder.id] : 3;

                    // Standard Pipeline steps structures
                    const trackingSteps = [
                      {
                        titleEn: "Order Registered",
                        titleBn: "অর্ডার নথিবদ্ধকরণ",
                        descEn: "Customer checkout successfully initiated, processing authorization token.",
                        descBn: "ক্রয় রিকোয়েস্টটি সিস্টেমে যুক্ত করা হয়েছে এবং ভেরিফিকেশনের জন্য পাঠানো হয়েছে।"
                      },
                      {
                        titleEn: "Payment Verified",
                        titleBn: "পেমেন্ট নিশ্চিতকরণ",
                        descEn: "Secure funds cleared via gateway API ledger. Billing record upgraded.",
                        descBn: "অটোমেটেড গেটওয়ের মাধ্যমে পরিশোধ সফলভাবে সম্পন্ন হয়েছে ও ইনভয়েস লেজার সচল করা হয়েছে।"
                      },
                      {
                        titleEn: "Software Compilation",
                        titleBn: "ফাইল ও লাইসেন্স প্রস্তুতকরণ",
                        descEn: "Decrypting software packages, importing core schemas, registering API shields.",
                        descBn: "প্রিমিয়াম ফাইলসমূহ রিডিউল করে আপনার ইউনিক অ্যাকাউন্ট লাইসেন্স কি ডিক্রিপ্ট করা হচ্ছে।"
                      },
                      {
                        titleEn: "Dispatched to Portal",
                        titleBn: "ফাইল ডাউনলোড সেন্টারে প্রেরণ",
                        descEn: "Secure archive compiled, files and cryptographic key updated in customer center.",
                        descBn: "সিস্টেম জিপ প্যাকেজ এবং সোর্স কোড কাস্টমারের ব্যক্তিগত ডাউনলোড প্যানেলে পাঠানো হয়েছে।"
                      },
                      {
                        titleEn: "Active & Secure",
                        titleBn: "সম্পূর্ণ সচল ও নিরাপদ",
                        descEn: "Automation engine running. License signed as active, live checks fully online.",
                        descBn: "অটোমেশন লাইসেন্স ভেরিফাইড। গ্রাহক ফাইল নামিয়ে ডেপ্লয়মেন্ট করতে সম্পূর্ণ প্রস্তুত।"
                      }
                    ];

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column 1: Order Selector Panel */}
                        <div className="space-y-3 lg:border-r lg:border-neutral-100 lg:dark:border-slate-800 lg:pr-5">
                          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1 font-mono text-left">
                            {language === 'bn' ? 'অর্ডার তালিকা নির্বাচন করুন' : 'Select Order to Track'} ({trackableOrdersList.length})
                          </p>

                          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                            {trackableOrdersList.map(ord => {
                              const isSelected = ord.id === activeTrackedOrder.id;
                              const ordStep = orderTrackingSteps[ord.id] !== undefined ? orderTrackingSteps[ord.id] : 4;
                              return (
                                <div
                                  key={ord.id}
                                  onClick={() => setSelectedTrackingOrderId(ord.id)}
                                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-blue-50/70 dark:bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                                      : 'bg-slate-50/50 dark:bg-slate-950/45 border-neutral-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-[10px] font-black text-indigo-500 dark:text-cyan-400">
                                      #{getOrderSerial(ord.id)}
                                    </span>
                                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md ${
                                      cancellationRequests[ord.id]
                                        ? 'bg-rose-500/15 text-rose-500'
                                        : ordStep === 4 
                                        ? 'bg-emerald-500/15 text-emerald-500' 
                                        : 'bg-amber-500/15 text-amber-500 animate-pulse'
                                    }`}>
                                      {cancellationRequests[ord.id]
                                        ? (language === 'bn' ? '⏳ বাতিল পেন্ডিং' : '⏳ Cancel Pending')
                                        : ordStep === 4 
                                        ? (language === 'bn' ? '✓ সমাপ্ত' : '✓ Completed') 
                                        : `${language === 'bn' ? 'ধাপ' : 'Stage'} ${ordStep + 1}/5`}
                                    </span>
                                  </div>
                                  <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 mt-1.5 line-clamp-1">
                                    {ord.itemTitle}
                                  </h4>
                                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-dashed border-neutral-200 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">
                                    <span>{ord.date}</span>
                                    <span className="font-black text-slate-700 dark:text-slate-350">
                                      {formatPrice(ord.price)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Columns 2-3: Stepper Pipeline Visual */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Tracking Details Banner */}
                          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-neutral-150 dark:border-slate-850 text-left space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-xs font-black text-slate-800 dark:text-white font-mono flex items-center gap-1">
                                <span>TRACKING:</span>
                                <span className="text-indigo-500 font-black">#{getOrderSerial(activeTrackedOrder.id)}</span>
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400">
                                {language === 'bn' ? 'পেমেন্ট গেটওয়ে:' : 'Via:'} <strong className="font-bold text-slate-600 dark:text-slate-300">{activeTrackedOrder.paymentMethod}</strong>
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <p className="text-xs font-black text-slate-900 dark:text-slate-200 line-clamp-2 max-w-lg">
                                {activeTrackedOrder.itemTitle}
                              </p>
                              
                              {/* Request Cancellation Button */}
                              {activeStep < 4 ? (
                                <button
                                  onClick={() => {
                                    if (cancellationRequests[activeTrackedOrder.id]) return;
                                    setCancellationRequests(prev => ({
                                      ...prev,
                                      [activeTrackedOrder.id]: true
                                    }));
                                    const logMessage = `Request Cancellation - Order #${activeTrackedOrder.id} (${activeTrackedOrder.itemTitle.substring(0, 40)}...) at Processing Stage ${activeStep + 1}`;
                                    onAddActivityLog(logMessage);
                                    triggerToast(language === 'bn' ? "অর্ডার বাতিলের অনুরোধ জমা দেওয়া হয়েছে ⚙️" : "Cancellation request successfully submitted ⚙️");
                                  }}
                                  disabled={cancellationRequests[activeTrackedOrder.id]}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-205 shrink-0 ${
                                    cancellationRequests[activeTrackedOrder.id]
                                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-not-allowed'
                                      : 'bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 cursor-pointer active:scale-95'
                                  }`}
                                >
                                  {cancellationRequests[activeTrackedOrder.id] ? (
                                    <span>⏳ {language === 'bn' ? 'বাতিলকরণ প্রক্রিয়াধীন' : 'Cancellation Pending'}</span>
                                  ) : (
                                    <span>🚫 {language === 'bn' ? 'বাতিল অনুরোধ করুন' : 'Request Cancellation'}</span>
                                  )}
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {submittedFeedback[activeTrackedOrder.id] ? (
                                    <div className="flex flex-col items-end text-right">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20 select-none">
                                        ✓ {language === 'bn' ? 'মতারত দেওয়া হয়েছে' : 'Feedback Submitted'}
                                      </span>
                                      <span className="text-[10px] text-amber-500 font-bold mt-1">
                                        {"★".repeat(submittedFeedback[activeTrackedOrder.id].rating)}{"☆".repeat(5 - submittedFeedback[activeTrackedOrder.id].rating)}
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setRatingOrderModalId(activeTrackedOrder.id);
                                        setRatingStars(5);
                                        setRatingComment('');
                                      }}
                                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 dark:text-white font-black text-[10px] uppercase rounded-xl tracking-wider shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer transition flex items-center gap-1 shrink-0"
                                    >
                                      <span>⭐ {language === 'bn' ? 'মতামত ও রেটিং দিন' : 'Rate Product'}</span>
                                    </button>
                                  )}
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20 shrink-0 select-none">
                                    ✓ {language === 'bn' ? 'সম্পূর্ণ ডেলিভারড' : 'Fully Active-Secure'}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Display Tracking ID when status is shipped (3) or delivered (4) */}
                            {(activeStep === 3 || activeStep === 4) && activeTrackedOrder.trackingId && (
                              <div className="mt-2.5 p-3 rounded-xl bg-indigo-500/5 dark:bg-cyan-500/5 border border-indigo-500/15 dark:border-cyan-500/15 text-[11px] text-indigo-700 dark:text-cyan-400 font-mono tracking-wide flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Truck className="w-3.5 h-3.5 text-indigo-505 dark:text-cyan-400 animate-pulse" />
                                  <span className="font-sans font-bold text-slate-700 dark:text-slate-300">
                                    {language === 'bn' ? 'ডেলিভারি ট্র্যাকিং আইডি:' : 'SHIPPED/DELIVERED TRACKING ID:'}
                                  </span>
                                  <span className="font-extrabold select-all bg-indigo-500/10 dark:bg-cyan-500/10 px-2 py-0.5 rounded text-indigo-600 dark:text-cyan-300 border border-indigo-500/10">
                                    {activeTrackedOrder.trackingId}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-sans font-black px-2 py-0.5 rounded uppercase self-start sm:self-auto ${
                                  activeStep === 4
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                }`}>
                                  {activeStep === 4 
                                    ? (language === 'bn' ? 'ডেলিভারড' : 'Delivered Status') 
                                    : (language === 'bn' ? 'পাঠানো হয়েছে (Shipped)' : 'Shipped Status')
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Stepper Steps Trail */}
                          <div className="relative pl-6 space-y-6 text-left border-l-2 border-neutral-200 dark:border-slate-800/90 ml-3">
                            {trackingSteps.map((step, index) => {
                              const isCompleted = index < activeStep;
                              const isCurrent = index === activeStep;
                              const isUpcoming = index > activeStep;

                              return (
                                <div key={index} className="relative group transition-all">
                                  {/* Bullet Marker */}
                                  <span className={`absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full font-mono text-[10px] font-black border transition-all duration-300 ${
                                    isCompleted
                                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                                      : isCurrent
                                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 animate-pulse'
                                      : 'bg-white dark:bg-slate-900 border-neutral-300 dark:border-slate-800 text-slate-400'
                                  }`}>
                                    {isCompleted ? '✓' : index + 1}
                                  </span>

                                  {/* Step main block */}
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className={`text-xs font-black tracking-tight ${
                                        isCompleted
                                          ? 'text-emerald-500'
                                          : isCurrent
                                          ? 'text-indigo-500 dark:text-cyan-400'
                                          : 'text-slate-450 dark:text-slate-500'
                                      }`}>
                                        {language === 'bn' ? step.titleBn : step.titleEn}
                                      </h4>

                                      {/* Interactive status pill */}
                                      {isCurrent && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 dark:text-cyan-400 text-[8px] font-black font-sans uppercase rounded animate-pulse">
                                          <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                                          {language === 'bn' ? 'চলমান প্রসেস' : 'Active Stage'}
                                        </span>
                                      )}
                                      {isCompleted && (
                                        <span className="text-[8px] font-mono font-black text-emerald-500/70 uppercase">
                                          {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-[11px] leading-relaxed ${
                                      isCurrent 
                                        ? 'text-slate-705 dark:text-slate-300 font-medium' 
                                        : 'text-neutral-450 dark:text-slate-400'
                                    }`}>
                                      {language === 'bn' ? step.descBn : step.descEn}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Dynamic Dispatch simulator tools */}
                          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-neutral-150 dark:border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="font-mono text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                {language === 'bn' ? 'লাইভ ডিসপ্যাচ সিমুলেটর ⚙️' : 'Live Stage Simulator ⚙️'}
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setOrderTrackingSteps(prev => ({
                                    ...prev,
                                    [activeTrackedOrder.id]: Math.max(0, activeStep - 1)
                                  }));
                                  triggerToast(language === 'bn' ? "পূর্ববর্তী ধাপে স্থানান্তর করা হয়েছে" : "Moved logistics stage backward");
                                }}
                                disabled={activeStep === 0}
                                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-250 dark:border-slate-700 font-extrabold rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1"
                              >
                                {language === 'bn' ? '← পূর্ববর্তী ধাপ' : '← Prev Stage'}
                              </button>
                              <span className="font-mono font-black text-slate-800 dark:text-white px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                {activeStep + 1} / 5
                              </span>
                              <button
                                onClick={() => {
                                  setOrderTrackingSteps(prev => ({
                                    ...prev,
                                    [activeTrackedOrder.id]: Math.min(4, activeStep + 1)
                                  }));
                                  triggerToast(language === 'bn' ? "পরবর্তী ধাপে স্থানান্তর করা হয়েছে" : "Moved logistics stage forward");
                                }}
                                disabled={activeStep === 4}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white font-extrabold rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-md shadow-indigo-600/10"
                              >
                                {language === 'bn' ? 'পরবর্তী ধাপ →' : 'Next Stage →'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* DYNAMIC DASHBOARD WIDGET MODULES */}
                <DashboardWidgets
                  language={language}
                  theme={theme}
                  user={user}
                  domains={domains}
                  setDomains={setDomains}
                  hostingPackages={hostingPackages}
                  setHostingPackages={setHostingPackages}
                  services={services}
                  setServices={setServices}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  tickets={tickets}
                  orders={orders}
                  setActiveTab={setActiveTab}
                  setExpandedMenu={setExpandedMenu}
                  setTicketModalOpen={setTicketModalOpen}
                  setActiveTicketForChat={setActiveTicketForChat}
                  triggerToast={triggerToast}
                  onAddActivityLog={onAddActivityLog}
                  formatPrice={formatPrice}
                  isNewClient={isNewClient}
                  onUpdateOrders={onUpdateOrders}
                />

                {/* PREVIOUS STATIC DASHBOARD PORTLETS (SAFETY DEACTIVATED) */}
                {false && (<>
                {/* 2. PROFILE COMPLETION METER */}
                {adminWidgets.profileCompletion && (
                  <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-5 text-left shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Account Security & Profile Completion
                        </h4>
                        <span className="font-mono text-xs font-black text-rose-500 dark:text-cyan-405">
                          {((emailVerified ? 20 : 0) + (phoneVerified ? 20 : 0) + (profileWhatsAppNumber ? 20 : 0) + (companyName ? 20 : 0) + (tfaEnabled ? 20 : 0))}% Completed
                        </span>
                      </div>
                      
                      <div className="h-2.5 bg-neutral-150 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div 
                          className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] transition-all duration-500" 
                          style={{ width: `${((emailVerified ? 20 : 0) + (phoneVerified ? 20 : 0) + (profileWhatsAppNumber ? 20 : 0) + (companyName ? 20 : 0) + (tfaEnabled ? 20 : 0))}%` }} 
                        />
                      </div>

                      <p className="text-[11px] text-neutral-450 dark:text-slate-400 mt-1 leading-normal">
                        Complete your identity attributes & security configurations to safeguard domains & hosting and achieve absolute Whitelabel verification.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0 font-mono text-[10px]">
                      <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                        <span className="font-bold text-slate-500 block">EMAIL VERIFIED</span>
                        <span className="font-black text-emerald-500">✓ YES (+20%)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                        <span className="font-bold text-slate-500 block">WHATSAPP LINK</span>
                        <button onClick={() => { setActiveTab('profile'); triggerToast('Update WhatsApp number in Settings'); }} className="font-black text-indigo-500 hover:underline">✓ SYNC (+20%)</button>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                        <span className="font-bold text-slate-500 block">COMPANY NAME</span>
                        <button 
                          onClick={() => {
                            setCompanyName('WebzoneBD Enterprise Cloud');
                            triggerToast('Company info populated!');
                            onAddActivityLog('Updated client profile company name to: WebzoneBD Enterprise Cloud');
                          }} 
                          className={`font-black uppercase ${companyName ? 'text-emerald-500' : 'text-amber-500 hover:underline'}`}
                        >
                          {companyName ? '✓ POPULATED' : '+ ADD (+20%)'}
                        </button>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                        <span className="font-bold text-slate-500 block">2FA SHIELD</span>
                        <button 
                          onClick={() => {
                            setTfaEnabled(!tfaEnabled);
                            triggerToast(tfaEnabled ? 'Two-Factor Authentication deactivated.' : '✓ Two-Factor Authentication activated and armed!');
                            onAddActivityLog(tfaEnabled ? 'Deactivated 2FA shield' : 'Activated 2FA multi-factor cryptographic security keys');
                          }} 
                          className={`font-black ${tfaEnabled ? 'text-emerald-500' : 'text-amber-500 hover:underline animate-shimmer'}`}
                        >
                          {tfaEnabled ? '🛡️ ACTIVE' : '❌ ENABLE (+20%)'}
                        </button>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                        <span className="font-bold text-slate-500 block">PHONE VERIFIED</span>
                        <span className="font-black text-emerald-500">✓ VERIFIED</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BENTO TOTAL METRICS GRIDS OVERVIEW */}
                {adminWidgets.statsGrid && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider text-left pl-1">📉 Real-Time Client Assets Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      {/* 1. Total Orders widget */}
                      <div onClick={() => { setActiveTab('my-orders'); onAddActivityLog('Navigated to orders panel'); }} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Total Active Orders</span>
                          <div className="p-2.5 bg-indigo-50 dark:bg-slate-900 text-indigo-500 dark:text-indigo-400 rounded-xl group-hover:scale-105 transition-transform"><Package className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{orders.length}</p>
                        <div className="text-[10px] text-emerald-525 font-bold mt-2 font-sans flex items-center gap-1">
                          {isNewClient ? (
                            <span className="text-blue-500 dark:text-cyan-400">{language === 'bn' ? 'অর্ডার করতে ক্লিক করুন' : 'Click to place order'}</span>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 1 Completed • 1 Pending Renewal
                            </>
                          )}
                        </div>
                      </div>

                      {/* 2. Active Services widget */}
                      <div onClick={() => setActiveTab('my-services')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Active SaaS Services</span>
                          <div className="p-2.5 bg-cyan-50 dark:bg-slate-900 text-[#06B6D4] dark:text-cyan-400 rounded-xl group-hover:scale-105 transition-transform"><TrendingUp className="w-5 h-5 animate-pulse" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{displayedServices.filter(s=>s.status==='In Progress' || s.status==='Active').length}</p>
                        <div className="text-[10px] text-slate-450 dark:text-slate-400 mt-2 block font-mono">
                          {isNewClient ? (
                            <span className="text-neutral-400">{language === 'bn' ? 'কোন চলমান সার্ভিস নেই' : 'No active services'}</span>
                          ) : (
                            <>Avg Project Progress: <strong className="text-cyan-400 text-xs font-black">68%</strong></>
                          )}
                        </div>
                      </div>

                      {/* 3. Active Hosting packages */}
                      <div onClick={() => setActiveTab('my-hosting')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Hosting Packages</span>
                          <div className="p-2.5 bg-emerald-50 dark:bg-slate-900 text-emerald-500 rounded-xl group-hover:scale-105 transition-transform"><Cpu className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{displayedHostingPackages.length}</p>
                        <div className="text-[10px] text-emerald-400 font-bold mt-2 font-mono flex items-center gap-1 justify-between">
                          {isNewClient ? (
                            <span className="text-emerald-500">{language === 'bn' ? 'হোস্টিং কিনতে ক্লিক করুন' : 'Purchase super hosting'}</span>
                          ) : (
                            <>
                              <span>✓ Litespeed NVMe v3</span>
                              <span className="bg-emerald-500/10 text-emerald-450 px-1 py-0.5 rounded text-[8px] uppercase font-bold">CPANEL OK</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 4. Active Domains */}
                      <div onClick={() => setActiveTab('my-domains')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">My Managed Domains</span>
                          <div className="p-2.5 bg-sky-50 dark:bg-slate-900 text-sky-500 rounded-xl group-hover:scale-105 transition-transform"><CheckCircle2 className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{displayedDomains.length}</p>
                        <div className="text-[10px] text-rose-500 font-bold mt-2 font-sans flex items-center gap-1">
                          {isNewClient ? (
                            <span className="text-sky-500">{language === 'bn' ? 'ডোমেইন রেজিস্টার' : 'Register your domain'}</span>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Alert: 1 Domain Expired!
                            </>
                          )}
                        </div>
                      </div>

                      {/* 5. Support tickets pending state */}
                      <div onClick={() => setActiveTab('tickets')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Support tickets</span>
                          <div className="p-2.5 bg-[#7C3AED]/5 text-[#7C3AED] rounded-xl group-hover:scale-105 transition-transform"><Ticket className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{tickets.length}</p>
                        <div className="text-[10px] text-indigo-500 font-bold mt-2 font-sans">
                          SLA technical support live
                        </div>
                      </div>

                      {/* 6. Pending invoices widget (Interactive quickpay) */}
                      <div className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Pending Invoices</span>
                          <div className="p-2.5 bg-rose-50 dark:bg-slate-900 text-rose-500 rounded-xl"><DollarSign className="w-5 h-5" /></div>
                        </div>
                        
                        {walletBalance >= 15 && orders.length > 0 ? (
                          <div className="mt-1 space-y-1.5">
                            <p className="text-2xl font-black font-mono text-rose-500">1 Unpaid ($15.00)</p>
                            <button
                              onClick={() => {
                                setWalletBalance(prev => prev - 15);
                                onAddActivityLog('Executed interactive instant invoice payment of $15.00 for script update');
                                triggerToast('💳 WebzoneBD WHMCS Invoice #48521 Cleared Successfully!');
                              }}
                              className="w-full py-1 text-center bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-extrabold text-[9px] uppercase rounded-lg transition-colors cursor-pointer block"
                            >
                              ⚡ Pay Invoice Dynamic
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2 text-emerald-500 font-bold font-sans text-xs flex items-center gap-1">
                            <span>✓ All Invoices Cleared!</span>
                          </div>
                        )}
                        <span className="text-[8px] text-neutral-400 block mt-1 font-mono hover:underline cursor-pointer" onClick={() => setActiveTab('billing')}>Currency: Dynamic USD/SAR/BDT</span>
                      </div>

                      {/* 7. Affiliate earnings */}
                      <div onClick={() => setActiveTab('affiliate-program')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Affiliate Commissions</span>
                          <div className="p-2.5 bg-lime-50 dark:bg-slate-900 text-lime-600 rounded-xl group-hover:scale-105 transition-transform"><Users className="w-5 h-5" /></div>
                        </div>
                        <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">$230.50 Approved</p>
                        <div className="text-[10px] text-slate-450 dark:text-slate-405 mt-2 font-mono flex items-center justify-between">
                          <span>Clicks: 1,450 API</span>
                          <span className="bg-indigo-500 text-slate-950 font-black px-1.5 py-0.5 rounded text-[8px] uppercase">RANK: PRO</span>
                        </div>
                      </div>

                      {/* 8. Wishlist Items */}
                      <div onClick={() => setActiveTab('wishlist')} className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
                          <span className="text-[10px] uppercase font-bold tracking-wider">Saved Wishlist Items</span>
                          <div className="p-2.5 bg-rose-50 dark:bg-slate-900 text-rose-500 rounded-xl group-hover:scale-105 transition-transform"><Heart className="w-5 h-5 fill-rose-500/10" /></div>
                        </div>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{wishlistedItems.length}</p>
                        <div className="text-[10px] text-[#2563EB] dark:text-[#6366F1] font-bold mt-2 font-sans hover:underline">
                          View Saved Products & Services &rarr;
                        </div>
                      </div>

                    </div>

                    {/* Combined Real-Time Client Assets & Ordered Services List */}
                    <div className="bg-white dark:bg-[#0F172A] border border-neutral-150 dark:border-slate-800/80 rounded-3xl p-6 shadow-md text-left mt-6 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 gap-3">
                        <div>
                          <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-cyan-400 font-sans flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-50 dark:bg-slate-900 rounded-lg text-indigo-500"><List className="w-4 h-4" /></span>
                            <span>আমার সচল সার্ভিসসমূহ ও অর্ডারকৃত সলিউশন</span>
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Real-Time Client Assets Summary - Active developments, running SaaS solutions, and premium marketplace scripts purchased.</p>
                        </div>
                        <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase font-black tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Tracker Active
                        </span>
                      </div>

                      {displayedServices.length === 0 && orders.length === 0 ? (
                        <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 text-left space-y-4">
                          <p className="text-xs text-[#2563EB] dark:text-cyan-400 font-extrabold font-sans flex items-center gap-1">
                            <span>💡</span> {language === 'bn' ? 'প্রস্তাবিত বা সাজেস্টেড সার্ভিসসমূহ (Recommended Services):' : 'Recommended Premium IT Services & Modules:'}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {language === 'bn'
                              ? 'বর্তমানে আপনার অ্যাকাউন্টে কোনো সচল সার্ভিস বা ক্রয়কৃত প্রোডাক্ট পাওয়া যায়নি। আপনার ব্যবসা অনলাইনে সম্প্রসারণের জন্য আমাদের রেডি স্ক্রিপ্ট স্টোর চেক করুন অথবা কাস্টম আইটি সার্ভিস কিনুন:'
                              : 'No purchased solutions or running SaaS programs were identified for your active business ID. Launch a service or buy standard script elements to deploy tools:'}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3">
                              <div>
                                <span className="p-1 px-2 border border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400 rounded text-[9px] font-mono uppercase font-bold">
                                  📍 Google Maps SEO
                                </span>
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug mt-1.5">Google Business Profile Setup Service</h4>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                  {language === 'bn'
                                    ? 'গুগল লোকাল ম্যাপস র‍্যাংকিং সেটআপ, সাইটেশন ও ইনস্ট্যান্ট লোকাল কাস্টমার রিচ অর্জন করুন।'
                                    : 'Boost map citation scores, integrate local high-density keywords, and conquer first-page localized search results.'}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (onNavigate) onNavigate('services');
                                  else setActiveTab('my-services');
                                  triggerToast(language === 'bn' ? 'সার্ভিস ক্যাটাগরি লোড হচ্ছে...' : 'Opening expert services section...');
                                }}
                                className="w-full py-1.5 text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                🛍️ {language === 'bn' ? 'সার্ভিসটি কিনুন' : 'Purchase Service'}
                              </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3">
                              <div>
                                <span className="p-1 px-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-405 rounded text-[9px] font-mono uppercase font-bold">
                                  📈 Growth Plan
                                </span>
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug mt-1.5">Business Growth Packages</h4>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                  {language === 'bn'
                                    ? 'স্টার্টআপ স্কেলিং প্যাকেজ, লিড ড্যাশবোর্ড, সোশ্যাল মার্কেটিং অটোমেশন ফানেল সেটআপ।'
                                    : 'Optimize conversion loops, integrate bulk Twilio SMS API setups, and configure client CRM spreadsheets.'}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (onNavigate) onNavigate('services');
                                  else setActiveTab('my-services');
                                  triggerToast(language === 'bn' ? 'গ্রোথ প্যাকেজ ক্যাটালগ খুলছে...' : 'Opening corporate tools desk...');
                                }}
                                className="w-full py-1.5 text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                🛍️ {language === 'bn' ? 'প্যাকেজটি কিনুন' : 'Order Solution'}
                              </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3">
                              <div>
                                <span className="p-1 px-2 border border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded text-[9px] font-mono uppercase font-bold">
                                  🛍️ E-commerce
                                </span>
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug mt-1.5">Digital Store (Pre-built Scripts)</h4>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                  {language === 'bn'
                                    ? 'রেডিমেড স্ক্রিপ্ট স্টোর, কাস্টম পেমেন্ট গেটওয়ে (bKash/Nagad), এবং স্বয়ংক্রিয় ডেলিভারি ফানেল।'
                                    : 'Deploy instant digital retail shops optimized with dynamic secure checkouts and auto bKash/Nagad validation.'}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (onNavigate) onNavigate('marketplace');
                                  else triggerToast(language === 'bn' ? 'রেডি স্ক্রিপ্ট ডিজিটাল স্টোর লোড হচ্ছে...' : 'Opening script store...');
                                }}
                                className="w-full py-1.5 text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                🛒 {language === 'bn' ? 'ডিজিটাল স্টোর দেখুন' : 'Buy Ready Script'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 font-sans">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            
                            {/* Render Active custom services (from local services state) */}
                            {displayedServices.map(srv => (
                              <div key={srv.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/85 flex flex-col justify-between gap-3 hover:border-indigo-500/30 transition-all duration-200">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="p-1 px-2 border border-indigo-500/20 bg-indigo-500/5 text-indigo-505 dark:text-indigo-400 rounded text-[9px] font-mono uppercase font-bold">
                                      💼 Custom SaaS / IT Service
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-400 font-bold">{srv.id}</span>
                                  </div>
                                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">{srv.name}</h4>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                                    <span>Team: <strong className="text-indigo-400 font-semibold">{srv.assignedTeam}</strong></span>
                                    <span>•</span>
                                    <span>Due Date: <strong className="text-slate-450 dark:text-slate-400 font-semibold">{srv.dueDate}</strong></span>
                                  </div>
                                </div>

                                <div className="space-y-1 pt-2 border-t border-slate-150 dark:border-slate-805">
                                  <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                    <span className="text-slate-500">Milestone Progress:</span>
                                    <span className="text-[#2563EB] dark:text-cyan-400">{srv.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-neutral-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-300" style={{ width: `${srv.progress}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Render Orders/Purchases (from orders prop) */}
                            {orders.map(ord => (
                              <div key={ord.id} className="p-4 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/15 flex flex-col justify-between gap-3 hover:border-[#10B981]/40 transition-all duration-200">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="p-1 px-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-405 rounded text-[9px] font-mono uppercase font-bold">
                                      🛍️ Digital Store Licensed script
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-400 font-bold">{getOrderSerial(ord.id)}</span>
                                  </div>
                                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">{ord.itemTitle}</h4>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                                    <span>Date Ordered: <strong className="font-bold text-slate-500">{ord.date}</strong></span>
                                    <span>•</span>
                                    <span>Price Paid: <strong className="text-[#10B981] font-extrabold">{formatPrice(ord.price)}</strong></span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-150 dark:border-[#10B981]/15 flex items-center justify-between gap-2">
                                  <div className="inline-flex items-center gap-1 text-[9px] text-[#10B981] font-black uppercase">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Active License Security Sync
                                  </div>
                                  <button 
                                    onClick={() => {
                                      triggerToast(`Initializing Secure Script Download Protocol for solution reference: #${getOrderSerial(ord.id)}`);
                                      onAddActivityLog(`SaaS Digital Store download asset fetched: ID #${getOrderSerial(ord.id)}`);
                                    }}
                                    className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[9px] uppercase rounded-xl transition cursor-pointer"
                                  >
                                    ⚡ Download
                                  </button>
                                </div>
                              </div>
                            ))}

                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Sub row: System health performance specs / Quick Actions shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Virtual server performance stats widgets */}
                  {adminWidgets.cloudVmSpecs && (
                    <div className="md:col-span-2 bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-left space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-[#2563EB] dark:text-[#6366F1]" />
                          <h3 className="text-sm font-black uppercase tracking-wider">Cloud VM & WHMCS Server Infrastructure</h3>
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wide px-2 py-0.5 bg-gradient-to-r from-[#2563EB]/15 to-[#7C3AED]/15 text-[#2563EB] dark:text-[#A78BFA] rounded">ACTIVE MASTER CORES</span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>SaaS VM Ingress Load Thresholds:</span>
                            <span className="font-mono font-bold text-[#10B981]">14% Average Allocation</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-300" style={{ width: '14%' }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Redis Socket Database Performance:</span>
                            <span className="font-mono font-bold text-[#10B981]">44% Allocated Space</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-300" style={{ width: '44%' }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Dedicated SSL/TLS Sandboxing Port Guard:</span>
                            <span className="font-mono font-bold text-[#10B981]">100% Secure Handshake Uptime</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300" style={{ width: '100%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Quick Launch Panel shortcuts */}
                  {adminWidgets.statsGrid && (
                    <div className="md:col-span-1 bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-left space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-wider pb-3 border-b border-neutral-100 dark:border-slate-800/80">Support Helpdesks</h3>
                      
                      <div className="space-y-2.5">
                        <button
                          onClick={() => setActiveTab('tickets')}
                          className="w-full text-left p-3 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/50 bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-between text-xs font-bold transition duration-300 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
                            <span>Technical Live ticket Support</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-450 group-hover:translate-x-0.5 transition" />
                        </button>

                        <button
                          onClick={() => { setActiveTab('billing'); onAddActivityLog('Loaded billing invoices tab'); }}
                          className="w-full text-left p-3 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/50 bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-between text-xs font-bold transition duration-300 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span>Master Billing & Ledger API</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-450 group-hover:translate-x-0.5 transition" />
                        </button>

                        <button
                          onClick={() => setActiveTab('profile')}
                          className="w-full text-left p-3 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/50 bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-between text-xs font-bold transition duration-300 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-[#10B981]" />
                            <span>Profile Security Settings Portal</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-450 group-hover:translate-x-0.5 transition" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* BUSINESS GROWTH ACCELERATOR CENTER */}
                {adminWidgets.businessGrowth && (
                  <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-left space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider">🚀 WebzoneBD Business Growth Accelerator</h3>
                      </div>
                      <span className="font-mono text-xs bg-indigo-500/10 text-indigo-500 dark:text-cyan-405 px-3 py-1 rounded-full uppercase font-black">
                        Dynamic Marketing Dashboard
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Global SEO Audit Rating</span>
                        <p className="text-2.5xl font-black mt-1 text-indigo-500 font-mono">{businessStats.seoScore} / 100</p>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                          <div className="h-full bg-indigo-505 bg-gradient-to-r from-[#2563EB] to-cyan-405" style={{ width: '88%' }} />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Google Ranking status</span>
                        <p className="text-lg font-black mt-1 text-emerald-500">{businessStats.googleRanking}</p>
                        <span className="text-[10px] text-slate-450 mt-1 block font-mono">Top organic keyword indexes</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Google Business Maps</span>
                        <p className="text-lg font-black mt-1 text-[#06B6D4]">{businessStats.googleProfileStatus}</p>
                        <span className="text-[10px] text-slate-450 mt-1 block font-mono">100% compliance checked</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Active CRM Lead Generation</span>
                        <p className="text-2.5xl font-black mt-1 text-purple-500 font-mono">{businessStats.leadGeneration} Organic Leads</p>
                        <span className="text-[10px] text-slate-450 mt-1 block font-sans font-bold">✓ 3 Active Lead Streams connected</span>
                      </div>
                    </div>
                  </div>
                )}
                </>)}

                {/* 'Recent Activity' Widget */}
                {adminWidgets.recentActivity && (
                  <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#2563EB] dark:text-[#6366F1]" />
                        <h3 className="text-sm font-black uppercase tracking-wider font-sans">
                          {language === 'bn' ? 'সাম্প্রতিক ক্রিয়াকলাপ' : 'Recent Account Activity'}
                        </h3>
                      </div>

                    </div>

                    <div className="divide-y divide-neutral-100 dark:divide-slate-800/50">
                      {activityLogs.length === 0 ? (
                        <p className="text-xs text-neutral-400 text-center py-6 font-semibold">
                          {language === 'bn' ? 'কোনো সাম্প্রতিক ক্রিয়াকলাপ পাওয়া যায়নি' : 'No recent activity found'}
                        </p>
                      ) : (
                        activityLogs.slice(-5).reverse().map((log) => (
                          <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs transition duration-200 group/item hover:bg-slate-50/50 dark:hover:bg-slate-900/10 px-2 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-cyan-400 rounded-lg shrink-0 group-hover/item:scale-105 transition-transform">
                                <Activity className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-neutral-800 dark:text-slate-200">{log.action}</p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-neutral-400 dark:text-slate-500 font-mono mt-0.5">
                                  <span>Terminal IP: <span className="text-[#10B981] font-bold">{log.ipAddress}</span></span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="truncate max-w-[150px] sm:max-w-md">{log.userAgent}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-neutral-400 dark:text-slate-400 font-mono whitespace-nowrap bg-neutral-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-center">{log.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 🚚 ACTIVE VIEW: অর্ডার ট্র্যাকিং (Order Tracking Status) */}
            {activeTab === 'order-tracker' && (
              <UserOrderHistory
                orders={orders}
                language={language}
                currency={currency}
                formatPrice={formatPrice}
                user={user}
                triggerToast={triggerToast}
                onUpdateOrders={onUpdateOrders}
              />
            )}

            {/* 📈 ACTIVE VIEW: রেভিনিউ প্রবৃদ্ধি ও লেখচিত্র (Company Revenue & Growth Analytics) */}
            {activeTab === 'revenue-analytics' && (
              <CompanyRevenueDashboard
                language={language}
                theme={theme}
                orders={orders}
                currency={currency}
                triggerToast={triggerToast}
                isAdmin={user?.role === 'admin'}
              />
            )}

            {/* 2.📦 ACTIVE VIEW: আমার অর্ডার (My Orders) */}
            {activeTab === 'my-orders' && (() => {
              const filteredOrders = orders.filter((ord) => {
                // status filter
                if (orderStatusFilter !== 'all' && ord.paymentStatus !== orderStatusFilter) {
                  return false;
                }
                
                // search query filter
                if (orderSearchQuery.trim()) {
                  const q = orderSearchQuery.toLowerCase();
                  const matchesTitle = ord.itemTitle.toLowerCase().includes(q);
                  const matchesId = ord.id.toLowerCase().includes(q) || getOrderSerial(ord.id).toLowerCase().includes(q);
                  const matchesMethod = ord.paymentMethod.toLowerCase().includes(q);
                  if (!matchesTitle && !matchesId && !matchesMethod) {
                    return false;
                  }
                }

                // date range filter
                if (orderDateRangeFilter !== 'all') {
                  const oDate = new Date(ord.date);
                  const today = new Date();
                  if (orderDateRangeFilter === '30days') {
                    const limit = new Date();
                    limit.setDate(today.getDate() - 30);
                    if (oDate < limit) return false;
                  } else if (orderDateRangeFilter === '90days') {
                    const limit = new Date();
                    limit.setDate(today.getDate() - 90);
                    if (oDate < limit) return false;
                  } else if (orderDateRangeFilter === 'thisyear') {
                    const limit = new Date(today.getFullYear(), 0, 1);
                    if (oDate < limit) return false;
                  }
                }

                return true;
              }).sort((a, b) => {
                const timeA = new Date(a.date).getTime();
                const timeB = new Date(b.date).getTime();
                return orderDateSort === 'desc' ? timeB - timeA : timeA - timeB;
              });

              return (
                <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-left animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400">আমার অর্ডার (My Purchase Catalog)</h3>
                      <p className="text-xs text-neutral-400 mt-1">Detailed records of invoices paid, billing methods, and licensing status.</p>
                    </div>
                    <span className="font-mono text-[10px] bg-sky-500/10 text-[#2563EB] dark:text-cyan-400 px-3 py-1 rounded-full uppercase font-black">
                       Transaction Clear Channel Enabled
                    </span>
                  </div>

                  {/* SUMMARY STATS CARDS ROW */}
                  {(() => {
                    const successfulOrders = orders.filter((o) => o.paymentStatus === 'completed');
                    const totalSuccessfulOrders = successfulOrders.length;
                    const totalSpentVal = successfulOrders.reduce((sum, o) => sum + o.price, 0);
                    const pendingOrdersCount = orders.filter((o) => o.paymentStatus === 'pending').length;
                    const activeTicketsCount = tickets.filter((t) => t.status !== 'closed').length;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Successful Orders */}
                        <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                              {language === 'bn' ? 'সফল অর্ডার' : 'Successful Orders'}
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                {totalSuccessfulOrders}
                              </span>
                              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold whitespace-nowrap">
                                {language === 'bn' ? 'পরিশোধিত' : 'Fully Paid'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Total Spent */}
                        <div className="bg-gradient-to-br from-[#2563EB]/5 to-sky-500/5 dark:from-[#2563EB]/10 dark:to-sky-500/10 border border-[#2563EB]/10 dark:border-blue-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-[#2563EB]/10 text-[#2563EB] dark:text-cyan-400 rounded-xl shrink-0">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                              {language === 'bn' ? 'মোট সফল ব্যয়' : 'Total Spent'}
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                {formatPrice(totalSpentVal)}
                              </span>
                              <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-bold whitespace-nowrap">
                                {language === 'bn' ? 'বিনিয়োগিত' : 'Invested'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pending Orders Count - Requested placement */}
                        <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/10 dark:border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                              {language === 'bn' ? 'অপেক্ষমাণ অর্ডার' : 'Pending Order'}
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                {pendingOrdersCount}
                              </span>
                              <span className={`text-[10px] font-bold whitespace-nowrap ${pendingOrdersCount > 0 ? 'text-amber-600 dark:text-amber-400 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`}>
                                {pendingOrdersCount > 0 ? (language === 'bn' ? 'যাচাই করা হচ্ছে' : 'Verifying') : (language === 'bn' ? 'কোনোটি নেই' : 'None')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Active Tickets */}
                        <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-500/10 dark:border-purple-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-purple-500/10 text-[#7C3AED] dark:text-purple-400 rounded-xl shrink-0">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                              {language === 'bn' ? 'সক্রিয় সাপোর্ট টিকিট' : 'Active Support Tickets'}
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                {activeTicketsCount}
                              </span>
                              <span className={`text-[10px] font-bold whitespace-nowrap ${activeTicketsCount > 0 ? 'text-purple-550 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`}>
                                {activeTicketsCount > 0 ? (language === 'bn' ? 'অপেক্ষমান টিকিট' : 'Awaiting Support') : (language === 'bn' ? 'কোনো সমস্যা নেই' : 'Resolved')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ADVANCED FILTER SYSTEM */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    {/* DATE RANGE FILTER */}
                    <div className="md:col-span-6">
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          value={orderDateRangeFilter}
                          onChange={(e) => setOrderDateRangeFilter(e.target.value as any)}
                          className="w-full appearance-none text-xs font-bold pl-9 pr-8 py-2.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] cursor-pointer text-slate-705 dark:text-slate-200"
                        >
                          <option value="all">{language === 'bn' ? 'সকল সময়ের' : 'All Time'}</option>
                          <option value="30days">{language === 'bn' ? 'গত ৩০ দিন' : 'Last 30 Days'}</option>
                          <option value="90days">{language === 'bn' ? 'গত ৯০ দিন' : 'Last 90 Days'}</option>
                          <option value="thisyear">{language === 'bn' ? 'চলতি বছর' : 'This Year'}</option>
                        </select>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">▼</span>
                      </div>
                    </div>

                    {/* DATE SORT */}
                    <div className="md:col-span-3">
                      <button
                        type="button"
                        onClick={() => setOrderDateSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 min-w-0">
                          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{language === 'bn' ? 'তারিখ' : 'Date'}</span>
                        </span>
                        <span className="text-[9px] font-mono font-black uppercase text-[#2563EB] dark:text-cyan-400">
                          {orderDateSort === 'desc' ? (language === 'bn' ? 'নতুন' : 'New') : (language === 'bn' ? 'পুরনো' : 'Old')}
                        </span>
                      </button>
                    </div>

                    {/* RESET FILTERS */}
                    <div className="md:col-span-3">
                      <button
                        type="button"
                        disabled={orderStatusFilter === 'all' && orderDateRangeFilter === 'all' && orderDateSort === 'desc'}
                        onClick={() => {
                          setOrderStatusFilter('all');
                          setOrderSearchQuery('');
                          setOrderDateRangeFilter('all');
                          setOrderDateSort('desc');
                        }}
                        className="w-full py-2.5 px-3 border border-dashed border-slate-230 dark:border-slate-800 rounded-xl text-neutral-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 disabled:opacity-40 disabled:hover:bg-transparent disabled:border-slate-200/50 disabled:dark:border-slate-800/30 text-xs font-bold transition cursor-pointer"
                      >
                        {language === 'bn' ? 'রিসেট 🔄' : 'Reset 🔄'}
                      </button>
                    </div>
                  </div>

                  {/* STATUS FILTER PILLS */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1.5">
                       {language === 'bn' ? 'স্ট্যাটাস ফিল্টার:' : 'Filter Status:'}
                    </span>
                    {[
                      { key: 'all', label: 'All', labelBn: 'সকল', count: orders.length, color: 'indigo' },
                      { key: 'pending', label: 'Pending', labelBn: 'অপেক্ষমাণ', count: orders.filter(o => o.paymentStatus === 'pending').length, color: 'amber' },
                      { key: 'completed', label: 'Paid / Completed', labelBn: 'পরিশোধিত', count: orders.filter(o => o.paymentStatus === 'completed').length, color: 'emerald' },
                      { key: 'failed', label: 'Failed', labelBn: 'ব্যর্থ', count: orders.filter(o => o.paymentStatus === 'failed').length, color: 'rose' }
                    ].map((pill) => {
                      const isSelected = orderStatusFilter === pill.key;
                      return (
                        <button
                          key={pill.key}
                          type="button"
                          onClick={() => setOrderStatusFilter(pill.key as any)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                            isSelected
                              ? pill.color === 'emerald'
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/15 scale-[1.01]'
                                : pill.color === 'rose'
                                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/15 scale-[1.01]'
                                  : pill.color === 'amber'
                                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/15 scale-[1.01]'
                                    : 'bg-[#2563EB] text-white shadow-sm shadow-indigo-600/15 scale-[1.01]'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span>{language === 'bn' ? pill.labelBn : pill.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-550 dark:text-slate-400'}`}>
                            {pill.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-neutral-450 dark:text-slate-400">
                      <FileCode className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-neutral-400" />
                      <p className="text-sm font-semibold">{language === 'bn' ? 'কোনো ক্রয় বা অর্ডার পাওয়া যায়নি' : 'No purchases or orders found'}</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-neutral-450 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                      <Filter className="w-10 h-10 mx-auto mb-3 stroke-[1.5] text-[#2563EB] dark:text-cyan-400 animate-pulse" />
                      <p className="text-sm font-extrabold">{language === 'bn' ? 'ফিল্টার অনুসারী কোনো ফলাফল পাওয়া যায়নি' : 'No matching invoice records option'}</p>
                      <p className="text-xs text-neutral-400 mt-1.5">{language === 'bn' ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন বা রিসেট করে আবার চেষ্টা করুন' : 'Your active criteria did not fetch results. Click reset to review complete catalogs.'}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderStatusFilter('all');
                          setOrderSearchQuery('');
                          setOrderDateRangeFilter('all');
                          setOrderDateSort('desc');
                        }}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-indigo-600 text-white text-xs font-black rounded-xl hover:opacity-95 shadow-md active:scale-95 transition"
                      >
                        {language === 'bn' ? 'ফিল্টার পরিবর্তন করুন বা রিসেট 🔄' : 'Clear Active Filters 🔄'}
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/[0.06] relative">
                      <table className="w-full text-left border-collapse min-w-[1000px] text-xs">
                        <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-neutral-900 border-b border-slate-100 dark:border-white/[0.08]">
                          <tr className="text-purple-400 font-bold uppercase font-mono text-[10px] tracking-wider">
                            <th className="py-3.5 px-4">Invoice ID</th>
                            <th className="py-3.5 px-3">Products / Services</th>
                            <th className="py-3.5 px-3">Order Date</th>
                            <th className="py-3.5 px-3 text-right">Amount</th>
                            <th className="py-3.5 px-3">Payment Method</th>
                            <th className="py-3.5 px-3">Payment Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06] font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                          {filteredOrders.map((ord) => (
                            <React.Fragment key={ord.id}>
                              <tr 
                                onClick={() => setSelectedInvoice(ord)}
                                title={language === 'bn' ? 'অর্ডার মেমো ও বিবরণী দেখতে ক্লিক করুন' : 'Click anywhere on this row to open comprehensive order details & invoice'}
                                className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer select-none ${expandedOrderId === ord.id ? 'bg-purple-600/[0.02] dark:bg-purple-500/[0.02]' : ''}`}
                              >
                                <td className="py-3.5 px-4 font-mono font-bold">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedInvoice(ord);
                                    }}
                                    className="text-purple-500 hover:text-purple-400 hover:underline flex items-center gap-1 focus:outline-none font-bold"
                                  >
                                    <span>{getOrderSerial(ord.id)}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-65" />
                                  </button>
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="font-semibold truncate max-w-[240px] dark:text-white" title={ord.itemTitle}>{ord.itemTitle}</div>
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-[8px] font-bold uppercase tracking-wide inline-block mt-1">
                                    {ord.itemTitle.toLowerCase().includes('hosting') ? 'Hosting' : ord.itemTitle.toLowerCase().includes('domain') ? 'Domain' : 'Script Solution'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 font-mono opacity-80 whitespace-nowrap">
                                  {ord.date ? ord.date.slice(0, 16).replace('T', ' ') : 'N/A'}
                                </td>
                                <td className="py-3.5 px-3 text-right font-black font-mono text-purple-400 text-sm whitespace-nowrap">
                                  {formatPrice(ord.price)}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="font-mono font-bold uppercase tracking-wide opacity-80 flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-slate-400" />
                                    {ord.paymentMethod || 'SSLCommerz'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  {(() => {
                                    let style = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                                    if (ord.paymentStatus === 'completed') {
                                      style = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                                    } else if (ord.paymentStatus === 'failed') {
                                      style = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                                    }
                                    return (
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans ${style}`}>
                                        {ord.paymentStatus === 'completed' ? 'Paid' : ord.paymentStatus.toUpperCase()}
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenActionDropdownId(openActionDropdownId === ord.id ? null : ord.id);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-55 hover:bg-neutral-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-neutral-210 dark:border-slate-700 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm"
                                    >
                                      <span>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</span>
                                      <ChevronDown className="w-3 h-3 transition-transform duration-200" style={{ transform: openActionDropdownId === ord.id ? 'rotate(180deg)' : 'none' }} />
                                    </button>

                                    {openActionDropdownId === ord.id && (
                                      <>
                                        {/* Invisible overlay for click-outside closure */}
                                        <div 
                                          className="fixed inset-0 z-30 bg-transparent cursor-default" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenActionDropdownId(null);
                                          }}
                                        />
                                        <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-xl shadow-xl z-40 py-1 px-1.5 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                                          {/* Track */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id);
                                              setOpenActionDropdownId(null);
                                            }}
                                            className={`w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold transition duration-150 rounded-lg cursor-pointer ${
                                              expandedOrderId === ord.id 
                                                ? 'bg-purple-600 text-white' 
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                            }`}
                                          >
                                            <Truck className={`w-3.5 h-3.5 mr-2 shrink-0 ${expandedOrderId === ord.id ? 'text-white' : 'text-purple-500'}`} />
                                            <span>{language === 'bn' ? 'ট্র্যাক করুন 🚚' : 'Track 🚚'}</span>
                                          </button>

                                          {/* Download File Link */}
                                          {ord.paymentStatus === 'completed' ? (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleScriptDownload(ord);
                                                setOpenActionDropdownId(null);
                                              }}
                                              className="w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-150 rounded-lg cursor-pointer"
                                            >
                                              <Download className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" />
                                              <span>{language === 'bn' ? 'ডাউনলোড ফাইল লিংক 📥' : 'Download File Link 📥'}</span>
                                            </button>
                                          ) : (
                                            <div
                                              className="w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 rounded-lg"
                                              title={language === 'bn' ? 'ডাউনলোড করতে পেমেন্ট করুন' : 'Pay to download'}
                                            >
                                              <Download className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                                              <span>{language === 'bn' ? 'ডাউনলোড ফাইল লিংক 🔒' : 'Download File Link 🔒'}</span>
                                            </div>
                                          )}

                                          {/* Invoice */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedInvoice(ord);
                                              setOpenActionDropdownId(null);
                                            }}
                                            className="w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-150 rounded-lg cursor-pointer"
                                          >
                                            <CreditCard className="w-3.5 h-3.5 mr-2 text-blue-500 shrink-0" />
                                            <span>{language === 'bn' ? 'রসিদ 🧾' : 'Invoice 🧾'}</span>
                                          </button>

                                          {/* Notes */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingNotesOrder(ord);
                                              setTempNotesText(ord.orderNotes || '');
                                              setOpenActionDropdownId(null);
                                            }}
                                            className="w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-150 rounded-lg cursor-pointer"
                                          >
                                            <ShoppingCart className="w-3.5 h-3.5 mr-2 text-amber-500 shrink-0" />
                                            <span>{language === 'bn' ? 'নোট 📝' : 'Notes 📝'}</span>
                                          </button>

                                          {/* Divider */}
                                          <div className="my-1 border-t border-neutral-100 dark:border-slate-800" />

                                          {/* Delete */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDeleteConfirmOrder({
                                                isOpen: true,
                                                orderId: ord.id,
                                                itemTitle: ord.itemTitle
                                              });
                                              setOpenActionDropdownId(null);
                                            }}
                                            className="w-full flex items-center px-2.5 py-2 text-[11px] font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition duration-150 rounded-lg cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-550 shrink-0" />
                                            <span>{language === 'bn' ? 'মুছুন 🗑️' : 'Delete 🗑️'}</span>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {expandedOrderId === ord.id && (
                                <tr className="bg-slate-50/50 dark:bg-slate-900/40">
                                  <td colSpan={7} className="px-6 py-6 border-t border-b border-neutral-100 dark:border-slate-800/80">
                                    <div className="max-w-3xl mx-auto space-y-5 animate-in slide-in-from-top-2 duration-300">
                                      
                                      {/* Header details card */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 border border-neutral-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
                                        <div>
                                          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                            {language === 'bn' ? 'অর্ডার ট্র্যাকিং সিস্টেম' : 'ORDER STATUS TRACKING'}
                                          </h4>
                                          <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">#{getOrderSerial(ord.id)}</span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-extrabold truncate max-w-[200px] sm:max-w-sm">{ord.itemTitle}</span>
                                          </div>
                                        </div>
                                        <div className="text-left sm:text-right shrink-0">
                                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono block">
                                            {language === 'bn' ? 'অর্ডারের তারিখ' : 'Order PlacedAt'}
                                          </span>
                                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                                            {ord.date}
                                          </span>
                                        </div>
                                      </div>

                                      {/* STEPS TIMELINE INTEGRATION */}
                                      <div className="relative py-4">
                                        {/* Horizontal connection line (hidden on mobile) */}
                                        <div className="absolute top-[38px] left-[15%] right-[15%] h-1 bg-slate-200 dark:bg-slate-800 rounded-full -translate-y-1/2 hidden sm:block">
                                          <div 
                                            className={`h-full bg-gradient-to-r from-[#2563EB] to-emerald-500 rounded-full transition-all duration-700 ${
                                              ord.paymentStatus === 'completed'
                                                ? 'w-full'
                                                : ord.paymentStatus === 'pending'
                                                  ? 'w-1/2'
                                                  : 'w-1/2 bg-red-500'
                                            }`} 
                                          />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                                          {/* Step 1: Processing */}
                                          {(() => {
                                            const status = ord.paymentStatus;
                                            const isDone = true; // Always processing started
                                            const isAct = status === 'pending';
                                            return (
                                              <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2.5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md transition-all duration-300 z-10 border-2 ${
                                                  isAct
                                                    ? 'bg-amber-500 text-white border-white dark:border-[#1E293B] animate-pulse ring-4 ring-amber-500/10'
                                                    : 'bg-[#2563EB] text-white border-white dark:border-[#1E293B] ring-4 ring-[#2563EB]/10'
                                                }`}>
                                                  {isAct ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                </div>
                                                <div className="text-left sm:text-center">
                                                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                                                    {language === 'bn' ? '১. প্রক্রিয়াকরণ' : 'Processing'}
                                                  </h5>
                                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold max-w-[160px] sm:mx-auto">
                                                    {status === 'completed' 
                                                      ? (language === 'bn' ? 'অর্ডার সফলভাবে যাচাই করা হয়েছে' : 'Order analyzed & processed')
                                                      : (language === 'bn' ? 'পেমেন্ট চেক ও সিকিউরিট স্ক্যানিং' : 'Secure algorithmic checkout analysis')}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })()}

                                          {/* Step 2: Payment Verified */}
                                          {(() => {
                                            const status = ord.paymentStatus;
                                            const isDone = status === 'completed';
                                            const isAct = status === 'pending';
                                            const isFail = status === 'failed';
                                            return (
                                              <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2.5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md transition-all duration-300 z-10 border-2 ${
                                                  isDone
                                                    ? 'bg-[#2563EB] text-white border-white dark:border-[#1E293B] ring-4 ring-[#2563EB]/10'
                                                    : isAct
                                                      ? 'bg-amber-500 text-white border-white dark:border-[#1E293B] animate-pulse ring-4 ring-amber-500/10'
                                                      : isFail
                                                        ? 'bg-rose-500 text-white border-white dark:border-[#1E293B] ring-4 ring-rose-500/10'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : isAct ? <Loader2 className="w-5 h-5 animate-spin" /> : isFail ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div className="text-left sm:text-center">
                                                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                                                    {language === 'bn' ? '২. পেমেন্ট ভেরিফাইড' : 'Payment Verified'}
                                                  </h5>
                                                  <p className={`text-[10px] font-semibold max-w-[160px] sm:mx-auto ${isFail ? 'text-rose-500 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {isDone
                                                      ? (language === 'bn' ? 'পেমেন্ট গেটওয়েতে সম্পূর্ণ ক্লিয়ার হয়েছে' : 'Payment approved and synced')
                                                      : isAct
                                                        ? (language === 'bn' ? 'ব্যাংক এপিআই প্রতিক্রিয়ার অপেক্ষা' : 'Awaiting provider confirmation')
                                                        : isFail
                                                          ? (language === 'bn' ? 'লেনদেনটি বাতিল বা প্রত্যাখ্যান হয়েছে' : 'Declined transaction gateway block')
                                                          : (language === 'bn' ? 'পেমেন্ট ভেরিফিকেশন হবে' : 'Pending payment validation')}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })()}

                                          {/* Step 3: Download Ready */}
                                          {(() => {
                                            const status = ord.paymentStatus;
                                            const isDone = status === 'completed';
                                            const isFail = status === 'failed';
                                            return (
                                              <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2.5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md transition-all duration-300 z-10 border-2 ${
                                                  isDone
                                                    ? 'bg-emerald-500 text-white border-white dark:border-[#1E293B] ring-4 ring-emerald-500/10'
                                                    : isFail
                                                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                  {isDone ? <Download className="w-5 h-5 stroke-[2.5]" /> : <Lock className="w-5 h-5 opacity-70" />}
                                                </div>
                                                <div className="text-left sm:text-center">
                                                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                                                    {language === 'bn' ? '৩. ডাউনলোড রেডি' : 'Download Ready'}
                                                  </h5>
                                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold max-w-[160px] sm:mx-auto">
                                                    {isDone
                                                      ? (language === 'bn' ? 'কোড ফাইল এবং লাইসেন্স প্রস্তুত' : 'Zip archive & products unleashed')
                                                      : isFail
                                                                                                                 ? (language === 'bn' ? 'পেমেন্ট ব্যর্থ হওয়ায় লকড' : 'Locked due to transaction decline')
                                                         : (language === 'bn' ? 'পেমেন্ট ক্লিয়ার হলেই চালু হবে' : 'Will populate upon payment verification')}
                                                   </p>
                                                 </div>
                                               </div>
                                             );
                                           })()}
                                         </div>
                                       </div>

                                       {/* Informative description banner */}
                                       <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-neutral-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 text-left">
                                         <div className="p-1 rounded-lg bg-[#2563EB]/5 shrink-0 mt-0.5">
                                           <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                                         </div>
                                         <div className="space-y-1">
                                           <p className="font-bold flex items-center gap-1.5 text-neutral-800 dark:text-slate-100 text-xs">
                                             <span>{language === 'bn' ? 'অর্ডার প্রসেসিং নোট:' : 'Delivery & Operations Status:'}</span>
                                           </p>
                                           <p className="text-slate-400 dark:text-slate-500 leading-normal text-[11px] font-medium">
                                             {ord.paymentStatus === 'completed'
                                               ? (language === 'bn' ? 'ইনভয়েস সম্পন্ন হওয়ায় ফাইল এখন সম্পূর্ণ রিলিজড! যেকোনো সময় "ZIP Code file" বাটনে ক্লিক করে কোড সোর্স ডাউনলোড করতে পারেন।' : 'Your invoice parameters verified perfectly. ZIP compilation has initialized and deployed. Complete archive access is granted above.')
                                               : ord.paymentStatus === 'pending'
                                                 ? (language === 'bn' ? 'আপনার পেমেন্ট বর্তমানে স্বয়ংক্রিয় গেটওয়েতে ক্লিয়ারেন্স ভেরিফিকেশনে রয়েছে। সাধারণত ৫-১০ মিনিট সময়ে এটি সম্পন্ন হয়।' : 'Our instant validation algorithms are auditing the payment confirmation with bkash/Stripe modules. Re-evaluating gateway status automatically.')
                                                 : (language === 'bn' ? 'লেনদেনে গেটওয়ে ত্রুটির কারণে পেমেন্ট প্রসেসিং ব্যর্থ হয়েছে। পুনরায় চেষ্টা করার জন্য মেথড বা ফান্ডস চেক করে বিলিং পেজে যান অথবা ২৪/৭ সাপোর্ট টিকেটে হেল্প নিন।' : 'Transaction decline recorded at standard routing filters. To bypass checkout block, confirm credentials and retry checkout or contact support via tickets.')}
                                           </p>
                                         </div>
                                       </div>

                                     </div>
                                   </td>
                                 </tr>
                               )}
                             </React.Fragment>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                 </div>
               );
             })()}
            {/* DEDICATED PENDING ORDERS SUMMARY & ACTIVE SUPPORT TICKETS SECTION */}
            {activeTab === 'my-orders' && (() => {
              const pendingOrders = orders.filter(o => o.paymentStatus === 'pending');
              const activeTickets = tickets.filter(t => t.status !== 'closed');

              return (
                <div className="bg-white/85 dark:bg-[#0F172A]/90 backdrop-blur-[20px] border border-neutral-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6 text-left mt-6 animate-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* PENDING ORDERS SUMMARY */}
                    <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/10 dark:border-amber-500/20 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Clock className="w-5 h-5 animate-pulse" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-tight">
                              {language === 'bn' ? '⏰ অপেক্ষমান অর্ডার তালিকা (Pending Orders)' : '⏰ Pending Orders Summary'}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {language === 'bn' ? 'ভেরিফিকেশনের জন্য অপেক্ষায় থাকা ডিজিটাল পারচেজ' : 'Digital purchases currently in payment verification'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-mono font-black animate-pulse">
                          {pendingOrders.length}
                        </span>
                      </div>

                      {pendingOrders.length === 0 ? (
                        <div className="bg-white/40 dark:bg-slate-900/40 rounded-xl p-5 text-center border border-dashed border-amber-500/10 dark:border-amber-500/20">
                          <span className="text-lg">💡</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                            {language === 'bn' ? 'বর্তমানে কোনো অপেক্ষমাণ অর্ডার নেই।' : 'No pending orders require payment verification.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {pendingOrders.map(ord => (
                            <div 
                              key={ord.id}
                              className="group bg-white dark:bg-[#1E293B] border border-amber-500/20 rounded-xl p-3 hover:border-amber-500/40 hover:shadow-sm transition-all text-left flex items-center justify-between gap-3 animate-in fade-in"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                                    #{getOrderSerial(ord.id)}
                                  </span>
                                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold truncate max-w-[150px] sm:max-w-[200px]">
                                    {ord.itemTitle}
                                  </span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-semibold mt-1">
                                  {language === 'bn' ? 'টাকা:' : 'Price:'} <strong className="text-slate-700 dark:text-slate-300 font-mono">${ord.price}</strong> • {ord.paymentMethod}
                                </p>
                              </div>
                              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                                  <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-500" />
                                  {language === 'bn' ? 'যাচাই হচ্ছে' : 'VERIFYING'}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {ord.date}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ACTIVE SUPPORT TICKETS */}
                    <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-500/10 dark:border-purple-500/20 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-[#7C3AED] dark:text-purple-400 uppercase tracking-tight">
                              {language === 'bn' ? '🎫 সক্রিয় সাপোর্ট টিকেট তালিকা (Support Tickets)' : '🎫 Active Support Tickets'}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {language === 'bn' ? 'আপনার ওপেন বা এনসার্ড সেশন হেল্পডেস্ক সমুহ' : 'Your unresolved technical & billing helpdesk queries'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#7C3AED] text-white px-2.5 py-0.5 rounded-full font-mono font-black">
                          {activeTickets.length}
                        </span>
                      </div>

                      {activeTickets.length === 0 ? (
                        <div className="bg-white/40 dark:bg-slate-900/40 rounded-xl p-5 text-center border border-dashed border-purple-500/10 dark:border-purple-500/20">
                          <span className="text-lg">✨</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                            {language === 'bn' ? 'কোনো সক্রিয় সাপোর্ট মেমোরেন্ডাম নেই।' : 'No active support tickets found.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {activeTickets.map(tkt => (
                            <div 
                              key={tkt.id}
                              onClick={() => {
                                setActiveTab('tickets');
                                setActiveTicketForChat(tkt);
                                onAddActivityLog(`Navigated to active ticket ${tkt.id} from Purchase Catalog`);
                              }}
                              className="group cursor-pointer bg-white dark:bg-[#1E293B] border border-purple-500/20 rounded-xl p-3 hover:border-[#7C3AED] hover:shadow-sm transition-all text-left flex items-center justify-between gap-3 animate-in fade-in"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md">
                                    #{tkt.id}
                                  </span>
                                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold truncate max-w-[150px] sm:max-w-[200px]">
                                    {tkt.subject}
                                  </span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-semibold mt-1">
                                  {language === 'bn' ? 'বিভাগ:' : 'Category:'} <strong className="text-slate-700 dark:text-slate-300 font-semibold">{tkt.category}</strong> • {language === 'bn' ? 'অগ্রাধিকার:' : 'Priority:'} <span className={tkt.priority === 'high' ? 'text-rose-500 font-bold' : 'text-slate-500'}>{tkt.priority.toUpperCase()}</span>
                                </p>
                              </div>
                              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${
                                  tkt.status === 'answered'
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-pulse'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${tkt.status === 'answered' ? 'bg-emerald-500' : 'bg-indigo-500 animate-ping'}`} />
                                  {tkt.status.toUpperCase()}
                                </span>
                                <span className="text-[9px] text-[#7C3AED] dark:text-purple-400 font-black group-hover:underline">
                                  {language === 'bn' ? 'চ্যাটে যান →' : 'Chat →'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })()}

            {(activeTab === 'my-services' || activeTab.includes('service') || ['active-services', 'project-phases', 'timeline-map'].includes(activeTab)) && (
              <div className="bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-[20px] border border-neutral-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                
                {/* Header info */}
                <div className="pb-4 border-b border-neutral-100 dark:border-slate-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="p-1 px-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-mono text-[9px] font-black rounded uppercase tracking-wider">
                      Active custom contract
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <span>🚀</span>
                      <span>
                        {language === 'bn' ? 'অর্ডারকৃত সার্ভিস ও প্রজেক্ট পোর্টাল' : language === 'ar' ? 'بوابة إدارة المشاريع المخصصة' : 'My Purchased Services Section'}
                      </span>
                      <span className="text-neutral-400 dark:text-slate-500 font-normal text-xs">
                        ({language === 'bn' ? 'অর্ডারকৃত সার্ভিস সমূহ' : 'My Services'})
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {language === 'bn' 
                        ? 'আপনার চলমান কাস্টম আইটি প্রজেক্টের রিয়েল-টাইম মাইলস্টোন অগ্রগতি ট্র্যাকিং, কিউএ কমপ্লায়েন্স ডাটা, ফাইল ডাউনলোড করা এবং ডেভেলপার টিমের সাথে মিটিং বুক বা চ্যাট ফোরাম।'
                        : 'Track milestones progress, review compliance specs, and change requirements dynamically with WebzoneBD architects.'}
                    </p>
                  </div>
                  <span className="p-1.5 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-black rounded-xl flex items-center gap-1.5 whitespace-nowrap border border-emerald-500/20 shadow-sm">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    ENGAGED TEAM SLA-24H
                  </span>
                </div>

                {/* DISPLAY 4 HORIZONTAL TABS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-neutral-150 dark:border-slate-800/50 pb-4">
                  <button
                    onClick={() => {
                      setMyServicesSubTab('suggest');
                    }}
                    className={`px-3 py-2.5 rounded-xl transition duration-200 font-sans text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                      myServicesSubTab === 'suggest'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 scale-[1.01]'
                        : 'bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/40 dark:border-slate-850/60 text-neutral-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>🧭</span>
                    <span>{language === 'bn' ? 'সাজেস্টেড সার্ভিসেস' : language === 'ar' ? 'الخدمات المقترحة' : 'Suggest Services'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMyServicesSubTab('purchased');
                    }}
                    className={`px-3 py-2.5 rounded-xl transition duration-200 font-sans text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                      myServicesSubTab === 'purchased'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 scale-[1.01]'
                        : 'bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/40 dark:border-slate-850/60 text-neutral-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>📦</span>
                    <span>{language === 'bn' ? 'ক্রয়কৃত সার্ভিস সমূহ' : language === 'ar' ? 'الخدمات المشتراة' : 'Purchased Services'}</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full text-white">{displayedServices.length}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMyServicesSubTab('phases');
                    }}
                    className={`px-3 py-2.5 rounded-xl transition duration-200 font-sans text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                      myServicesSubTab === 'phases'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 scale-[1.01]'
                        : 'bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/40 dark:border-slate-850/60 text-neutral-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>📈</span>
                    <span>{language === 'bn' ? 'ডেলিভারি ফেজ ও কিউএ' : language === 'ar' ? 'مراحل التطوير وضمان الجودة' : 'Development Phases & QA'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMyServicesSubTab('timeline');
                    }}
                    className={`px-3 py-2.5 rounded-xl transition duration-200 font-sans text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                      myServicesSubTab === 'timeline'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 scale-[1.01]'
                        : 'bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/40 dark:border-slate-850/60 text-neutral-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>💬</span>
                    <span>{language === 'bn' ? 'টাইমলাইন ও কারিগরি চ্যাট' : language === 'ar' ? 'الجدول الزمني والمناقشات' : 'Timeline & Discussions'}</span>
                  </button>
                </div>

                {/* TAB 1: SUGGEST SERVICES CATALOG VIEW */}
                {myServicesSubTab === 'suggest' && (
                  <div className="space-y-6 animate-in fade-in duration-200 text-left">
                    <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-900/50 border border-indigo-100/50 dark:border-slate-800 flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <p className="text-xs text-neutral-600 dark:text-slate-350 leading-relaxed">
                        {language === 'bn'
                          ? 'আপনার বিজনেস গ্রোথ বৃদ্ধি করতে ও কাস্টমার এনগেজমেন্ট বাড়াতে আমাদের আর্কিটেক্ট টিমের তৈরি করা কিছু হাই-কনভার্টিং আইটি সলিউশন নিচে সাজেস্ট করা হলো। যেকোনো সার্ভিসের বিস্তারিত দেখতে এবং সরাসরি ওয়ালেট বা অনলাইন পেমেন্ট গেটওয়ের মাধ্যমে একাউন্টে সচল করতে নিচে ক্লিক করুন।'
                          : 'Unlock premium growth by purchasing recommended customizable services directly. WebzoneBD features automated ledger setup, multi-payment options, secure wallet integrations, and full SLA support.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        {
                          id: 'gbp',
                          name: 'Google Business Profile Setup & Optimization',
                          nameBn: 'গুগল বিজনেস প্রোফাইল সেটআপ এবং অপ্টিমাইজেশন',
                          category: 'Local SEO / Maps',
                          price: 150,
                          priceBDT: 15000,
                          priceSAR: 600,
                          emoji: '🗺️',
                          themeColor: 'from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5',
                          textHex: 'text-sky-500',
                          description: 'গুগল সার্চ ও ম্যাপসে সফলভাবে তালিকাভুক্তকরণ, লোকাল কীওয়ার্ড ইন্টিগ্রেশন এবং ম্যাপস প্রথম পেজ র‍্যাংকিং সুবিধা।',
                          features: ['Direct Verification Assistance', 'Local Keyword research report', 'Figma optimized visual covers', '24h compliance audit check']
                        },
                        {
                          id: 'store',
                          name: 'E-Commerce Solutions & Payment Gateways',
                          nameBn: 'ই-কমার্স সলিউশন ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
                          category: 'Digital E-commerce Platforms',
                          price: 350,
                          priceBDT: 35000,
                          priceSAR: 1400,
                          emoji: '🛒',
                          themeColor: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5',
                          textHex: 'text-emerald-500',
                          description: 'বিকাশ, রকেট, নগদ, STC Pay গেটওয়ে সরাসরি ইন্টিগ্রেশন সহ কাস্টম রেসপন্সিভ রিটেইল ট্র্যাকিং স্টোর।',
                          features: ['Dynamic cart logic & checkouts', 'Bkash/Nagad auto API validation', 'Inventory auto-catalog code', 'SLA lifetime database upkeep']
                        },
                        {
                          id: 'laravel',
                          name: 'Laravel Custom SaaS System Development',
                          nameBn: 'লারাভেল কাস্টম ওয়েব অ্যাপ্লিকেশন এবং সার্ভার সমাধান',
                          category: 'SaaS Software Development',
                          price: 500,
                          priceBDT: 50000,
                          priceSAR: 2000,
                          emoji: '⚙️',
                          themeColor: 'from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5',
                          textHex: 'text-purple-500',
                          description: 'পিএইচপি লারাভেল এবং সুরক্ষিত ফ্রেমওয়ার্কে আপনার যেকোনো ব্যবসায়িক রিকোয়ারমেন্ট অনুযায়ী কাস্টম সিস্টেম আর্কিটেকচার।',
                          features: ['Strict role permission layers', 'Secure PostgreSQL/MySQL schemas', 'REST APIs for App integration', 'Docker & Nginx reverse proxy']
                        },
                        {
                          id: 'school',
                          name: 'Full-Featured School Management System',
                          nameBn: 'ডিজিটাল স্কুল ও কলেজ এডুকেশন পোর্টাল ও অটোমেশন',
                          category: 'Management Portals',
                          price: 400,
                          priceBDT: 40000,
                          priceSAR: 1600,
                          emoji: '🎓',
                          themeColor: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5',
                          textHex: 'text-amber-500',
                          description: 'ভর্তি ফরম, মাসিক টিউশন ফি ড্যাশবোর্ড, রেজাল্ট শিট জেনারেশন এবং অভিভাবকদের মোবাইল নোটিফিকেশন এসএমএস পোর্টাল।',
                          features: ['Interactive student/teacher counters', 'Dynamic PDF transcript exports', 'Teletalk & Bulk SMS gateways', 'Full accounting billing modules']
                        },
                        {
                          id: 'pos',
                          name: 'POS Software, Barcode & Inventory System',
                          nameBn: 'কাস্টম পিওএস সফটওয়্যার ও ইনভেন্টরি ম্যানেজমেন্ট',
                          category: 'Core Business Software',
                          price: 250,
                          priceBDT: 25000,
                          priceSAR: 1000,
                          emoji: '📊',
                          themeColor: 'from-indigo-500/10 to-rose-500/10 dark:from-indigo-500/5 dark:to-rose-500/5',
                          textHex: 'text-indigo-500',
                          description: 'বারকোড স্ক্যানার রিডিং, অফলাইন-সেফ ক্যাশিয়ার ড্যাশবোর্ড, কাস্টম ভাউচার থার্মাল প্রিন্ট ও রিয়েল-টাইম লাভ ক্ষতি হিসাব পোর্টাল।',
                          features: ['Instant barcode thermal templates', 'Customer dual-ledger module', 'Multi-branch storage alerts', 'Sales automated excel imports']
                        }
                      ].map((pkg) => (
                        <div
                          key={pkg.id}
                          className="bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between gap-5 text-left border-t-4 hover:scale-[1.01]"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="p-1 px-2.5 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 font-mono text-[9px] font-bold rounded-lg uppercase tracking-wider">
                                {pkg.category}
                              </span>
                              <span className="text-xl">{pkg.emoji}</span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-sans font-black text-xs text-slate-900 dark:text-white leading-snug">
                                {language === 'bn' ? pkg.nameBn : pkg.name}
                              </h4>
                              <p className="text-[10px] text-neutral-450 dark:text-slate-400 leading-relaxed line-clamp-3">
                                {pkg.description}
                              </p>
                            </div>

                            <div className="p-3 bg-neutral-50 dark:bg-slate-950/60 rounded-2xl border border-neutral-100 dark:border-slate-850">
                              <div className="flex items-center justify-between">
                                <span className="font-sans text-[10px] text-neutral-400">{language === 'bn' ? 'স্টাটিং প্রাইস' : 'Starting Price'}</span>
                                <span className="font-mono text-xs font-black text-indigo-500">
                                  {language === 'bn' 
                                    ? `৳${pkg.priceBDT.toLocaleString()}` 
                                    : language === 'ar' 
                                    ? `SAR ${pkg.priceSAR.toLocaleString()}` 
                                    : `$${pkg.price.toLocaleString()}`}
                                </span>
                              </div>
                            </div>

                            <ul className="space-y-1 text-[10px] text-neutral-550 dark:text-slate-350 font-sans pl-1">
                              {pkg.features.map((ft, idx) => (
                                <li key={idx} className="flex items-center gap-1.5 font-semibold">
                                  <span className="text-emerald-500 shrink-0">✓</span>
                                  <span className="truncate">{ft}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-neutral-100 dark:border-slate-850 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedSuggestedService(pkg);
                                setDetailsModalOpen(true);
                              }}
                              className="flex-1 py-2 border border-neutral-250 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-800 text-neutral-600 dark:text-slate-300 font-bold text-[10px] rounded-xl transition cursor-pointer"
                            >
                              📄 {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                            </button>
                            <button
                              onClick={() => {
                                setCheckoutService(pkg);
                                setCheckoutModalOpen(true);
                              }}
                              className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-black text-[10px] rounded-xl transition cursor-pointer shadow-sm shadow-blue-500/10 uppercase"
                            >
                              🛒 {language === 'bn' ? 'অনলাইন ক্রয়' : 'Buy Now'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: MY PURCHASED SERVICES LIST */}
                {myServicesSubTab === 'purchased' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {displayedServices.length === 0 ? (
                      <div className="p-12 border border-dashed border-neutral-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
                        <span className="text-4xl block">📦</span>
                        <h4 className="font-sans font-black text-sm text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? 'কোনো কাস্টম প্রজেক্ট শুরু করা হয়নি' : 'No custom active development contracts'}
                        </h4>
                        <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                          {language === 'bn'
                            ? 'বর্তমানে আপনার একাউন্টের আন্ডারে কোনো চলমান সফটওয়্যার ডেভেলপমেন্ট বা কাস্টম প্রজেক্ট সচল নেই। একটি নতুন লাইসেন্স চালু করতে "Suggest Services" ট্যাবটি চেক করুন।'
                            : 'Currently no custom contracts have been launched. Select from our list of Suggested Services to instantly pre-fund and configure a system.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left font-sans">
                        {displayedServices.map((srv) => {
                          const isCompleted = srv.progress === 100;
                          const activeColor = isCompleted ? 'from-emerald-500 to-teal-400' : 'from-blue-600 to-indigo-500';
                          return (
                            <div
                              key={srv.id}
                              className="p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/50 dark:border-slate-805 rounded-xl flex flex-col justify-between gap-5 shadow-sm"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className={`p-1 px-2.5 rounded-lg border font-mono text-[9px] font-black uppercase tracking-wider ${
                                    isCompleted 
                                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                      : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                  }`}>
                                    {language === 'bn' ? (isCompleted ? 'সচল' : 'চলমান') : srv.status}
                                  </span>
                                  <span className="font-mono text-[9px] text-neutral-400 dark:text-slate-500 font-bold">
                                    SLA Target: {srv.dueDate}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h4 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                                    {srv.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                                    Assigned Hub: <strong className="text-indigo-500 dark:text-cyan-405 font-bold">{srv.assignedTeam}</strong>
                                  </p>
                                </div>

                                {/* Milestone complete progress bar with subtle glow */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-neutral-400 dark:text-slate-500 font-bold">{language === 'bn' ? 'মাইলস্টোন সম্পন্ন:' : 'Milestones Complete:'}</span>
                                    <span className="font-black text-indigo-500 dark:text-cyan-405">{srv.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-neutral-200 dark:bg-slate-950 rounded-full overflow-hidden shrink-0 shadow-inner">
                                    <div
                                      className={`h-full bg-gradient-to-r ${activeColor} rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                                      style={{ width: `${srv.progress}%` }}
                                    />
                                  </div>
                                  <p className="text-[9.5px] text-neutral-450 dark:text-slate-400 leading-snug font-mono italic">
                                    {language === 'bn' ? 'চলমান ধাপ: ' : 'Active status: '} "{srv.timeline}"
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3.5 border-t border-neutral-150 dark:border-slate-800/80 space-y-3">
                                {/* ASSETS & DOCUMENTS SUB-SECTION */}
                                <div className="p-3 bg-neutral-100/50 dark:bg-slate-950/60 rounded-2xl border border-neutral-200/40 dark:border-slate-850/50">
                                  <div className="flex items-center justify-between pb-2 border-b border-neutral-150 dark:border-slate-800/40 mb-2">
                                    <h5 className="font-mono text-[9px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                      <Folder className="w-3.5 h-3.5 text-indigo-500" />
                                      {language === 'bn' ? 'দলিল ও প্রজেক্ট ফাইল ফোল্ডার' : 'Assets & Project Documents Folder'}
                                    </h5>
                                    <span className="text-[9px] font-mono text-[#10B981] font-bold">✓ SSL SECURED</span>
                                  </div>

                                  <div className="space-y-2 font-mono text-[10px]">
                                    <div className="flex items-center justify-between hover:bg-neutral-200/30 dark:hover:bg-slate-900/40 p-1 rounded transition">
                                      <span className="text-slate-650 dark:text-slate-350 truncate pr-2">📄 SLA_Enterprise_Requirement_v1.2.pdf</span>
                                      <button 
                                        onClick={() => triggerToast('Successfully downloaded Project SLA Certificate!')} 
                                        className="text-indigo-500 hover:underline hover:text-indigo-400 shrink-0 font-bold"
                                      >
                                        Download ⬇️
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between hover:bg-neutral-200/30 dark:hover:bg-slate-900/40 p-1 rounded transition">
                                      <span className="text-slate-650 dark:text-slate-350 truncate pr-2">🎨 Figma_UI_Mockups_Dashboard_Final.png</span>
                                      <button 
                                        onClick={() => triggerToast('Successfully copied Figma Visual board CDN link!')} 
                                        className="text-indigo-500 hover:underline hover:text-indigo-400 shrink-0 font-bold"
                                      >
                                        Copy Link 🔗
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between hover:bg-neutral-200/30 dark:hover:bg-slate-900/40 p-1 rounded transition">
                                      <span className="text-indigo-500 dark:text-cyan-455 font-bold truncate pr-3">🔑 staging_sandbox_access.json</span>
                                      <button 
                                        onClick={() => triggerToast('Credentials configuration copied to clipboard!')} 
                                        className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-cyan-405 px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                                      >
                                        COPY CREDENTIALS
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setMyServicesSubTab('timeline');
                                      setCommentInput(`Request status update on "${srv.name}" and estimated completion date.`);
                                      triggerToast('Opened Discussion board');
                                    }}
                                    className="flex-1 py-1.5 border border-neutral-250 dark:border-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-850 text-neutral-600 dark:text-neutral-300 font-bold text-[10px] rounded-xl transition cursor-pointer"
                                  >
                                    🕒 {language === 'bn' ? 'আপডেট রিকোয়েস্ট' : 'Request Update'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setServices(prev => prev.map(s => {
                                        if (s.id === srv.id) {
                                          const nextP = Math.min(100, s.progress + 5);
                                          onAddActivityLog(`Manually simulated milestones progress for ${s.name} to ${nextP}%`);
                                          triggerToast(`✨ Incremented milestones progress to ${nextP}%`);
                                          return { ...s, progress: nextP, status: nextP === 100 ? 'Active' : s.status };
                                        }
                                        return s;
                                      }));
                                    }}
                                    className="flex-1 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-cyan-405 font-bold text-[10px] rounded-xl transition cursor-pointer"
                                  >
                                    📈 {language === 'bn' ? 'অগ্রগতি বাড়ান (+৫%)' : 'Increment (+5%)'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: DEVELOPMENT PHASES CHECKS */}
                {myServicesSubTab === 'phases' && (
                  <div className="space-y-5 animate-in fade-in duration-200 text-left">
                    <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-slate-900/40 border border-neutral-150 dark:border-slate-800">
                      <span className="p-1 px-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-[9px] font-black rounded uppercase tracking-wider">
                        SLA QUALITY ASSURANCE CONTROL
                      </span>
                      <h4 className="font-sans font-black text-xs text-slate-950 dark:text-white mt-2 mb-1">
                        {language === 'bn' ? '🛠️ কাস্টম সফটওয়্যার কিউএ এবং ফেজ অপ্টিমাইজেশন ট্র্যাকার' : '🛠️ Global Quality Assurance Phase Tracker'}
                      </h4>
                      <p className="text-[11px] text-neutral-405 leading-relaxed">
                        {language === 'bn'
                          ? 'WebzoneBD আর্কিটেক্টদের তৈরি প্রতিটি প্রজেক্ট ৪টি প্রধান লাইফসাইকেল ফেজ অতিক্রম করে। প্রতিটি ফেজের জন্য রিয়েল-টাইম অডিট ও টেস্টিং করা হয় যাতে কমপ্লায়েন্স ও সর্বোচ্চ পারফরম্যান্স নিশ্চিত করা যায়।'
                          : 'Our systems pass through 4 strict quality engineering gates to ensure response speed, database scale limits, and compliance benchmarks.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                      
                      {/* Phase 1 */}
                      <div className="p-4 rounded-3xl bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border-2 border-emerald-500/30 dark:border-emerald-500/20 rounded-xl space-y-2 text-left relative shadow-[0_0_15px_rgba(16,185,129,0.08)]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded uppercase">
                            Phase 1: Completed ✓
                          </span>
                          <span className="text-emerald-500">🟢</span>
                        </div>
                        <h5 className="font-black text-slate-950 dark:text-white leading-tight">
                          {language === 'bn' ? 'ধাপ ১: ইউআই ডিজাইন ও প্রোটোটাইপ উইন্ডো' : 'Wireframing and UX Visualization'}
                        </h5>
                        <p className="font-sans text-[11px] text-neutral-450 dark:text-slate-400 leading-normal">
                          {language === 'bn'
                            ? 'কাস্টমার ড্যাশবোর্ড, ডাটাবেস উইজেট এবং মোবাইল viewport স্পেসিফিকেশন অনুমোদিত এবং সিগনেচার করা হয়েছে।'
                            : 'Figma mockups approved, responsiveness breakpoints calibrated, and user interaction loops finalized.'}
                        </p>
                      </div>

                      {/* Phase 2 */}
                      <div className="p-4 rounded-3xl bg-amber-500/[0.02] dark:bg-amber-500/[0.01] border-2 border-amber-500/40 dark:border-amber-500/25 rounded-xl space-y-2 text-left relative shadow-[0_0_18px_rgba(245,158,11,0.12)]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded uppercase animate-pulse">
                            Phase 2: In Progress ⚡
                          </span>
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                        </div>
                        <h5 className="font-black text-slate-950 dark:text-white leading-tight">
                          {language === 'bn' ? 'ধাপ ২: ডাটাবেস আর্কিটেকচার ও এপিআই এন্ডপয়েন্ট বাইন্ডিং' : 'Database Schema Engineering & Endpoint Sync'}
                        </h5>
                        <p className="font-sans text-[11px] text-neutral-450 dark:text-slate-400 leading-normal">
                          {language === 'bn'
                            ? 'পোস্টগ্রেস এসকিউএল ডাটাবেস ডিজাইন এবং পেমেন্ট গেটওয়ে বিকাশ, রকেট, নগদ-এর ব্যাকএন্ড এপিআই স্যান্ডবক্সিং কাজ চলছে।'
                            : 'Deploying robust database schemas, index caching rules, and establishing connection locks with core payment APIs.'}
                        </p>
                        <div className="h-1.5 bg-neutral-200 dark:bg-slate-950 rounded-full overflow-hidden mt-1 max-w-[200px]">
                          <div className="h-full bg-amber-500 animate-pulse rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      {/* Phase 3 */}
                      <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-slate-900 border-2 border-neutral-200/50 dark:border-slate-805 rounded-xl space-y-2 text-left relative opacity-65 hover:opacity-100 transition duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[9px] bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400 px-2 py-0.5 rounded uppercase">
                            Phase 3: Pending
                          </span>
                          <span className="text-slate-400">⚪</span>
                        </div>
                        <h5 className="font-black text-slate-950 dark:text-white leading-tight">
                          {language === 'bn' ? 'ধাপ ৩: সিকিউরিটি ইন্টিগ্রেশন ও অডিটিং' : 'Integration Testing & Security SSL Audit'}
                        </h5>
                        <p className="font-sans text-[11px] text-neutral-450 dark:text-slate-400 leading-normal">
                          {language === 'bn'
                            ? 'সার্ভার স্যান্ডবক্স এনভায়রনমেন্টে ব্যাকএন্ড প্রক্সি রুট চেকিং, এসএসএল হ্যান্ডশেক টেস্ট এবং হ্যাকিং প্রতিরোধক সিকিউরিটি অডিট।'
                            : 'Perform automated stress testing, sanitize user inputs, check session hijacking safeguards, and audit API load capacities.'}
                        </p>
                      </div>

                      {/* Phase 4 */}
                      <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-slate-900 border-2 border-neutral-200/50 dark:border-slate-805 rounded-xl space-y-2 text-left relative opacity-65 hover:opacity-100 transition duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[9px] bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400 px-2 py-0.5 rounded uppercase">
                            Phase 4: Pending
                          </span>
                          <span className="text-slate-400">⚪</span>
                        </div>
                        <h5 className="font-black text-slate-950 dark:text-white leading-tight">
                          {language === 'bn' ? 'ধাপ ৪: ফাইনাল লঞ্চ ও সোর্স কোড ডেলিভারি' : 'Standalone Production Release'}
                        </h5>
                        <p className="font-sans text-[11px] text-neutral-450 dark:text-slate-400 leading-normal">
                          {language === 'bn'
                            ? 'কাস্টমারের মূল ডোমেনে ক্লাউড ভিএম কনটেইনারের মাধ্যমে লাইভ রিলিজ এবং রুট সোর্স কোড জিপ হ্যান্ডওভার।'
                            : 'Rerouting custom nameservers to designated WHMCS servers and packaging final zip distributions folders.'}
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 4: TIMELINE MAP & DISCUSSIONS */}
                {myServicesSubTab === 'timeline' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    
                    {/* Left Column: Scope Specs */}
                    <div className="lg:col-span-4 space-y-4 text-left">
                      <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/60 border border-neutral-200/50 dark:border-slate-805 space-y-4 font-mono text-xs">
                        <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block pb-1 border-b border-neutral-250 dark:border-slate-800">
                          SLA Scope Metadata
                        </span>

                        <div className="space-y-0.5">
                          <span className="text-neutral-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-bold">
                            Assigned Partner Developer:
                          </span>
                          <span className="font-sans font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                            👨‍💻 WebzoneBD Architects Dept.
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-neutral-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-bold">
                            Estimated Completion:
                          </span>
                          <span className="font-black text-blue-500 dark:text-cyan-405">
                            July 20, 2026
                          </span>
                        </div>

                        <div className="space-y-2 text-left">
                          <span className="text-neutral-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-bold">
                            Deployed Tech Specs:
                          </span>
                          <div className="flex flex-wrap gap-1 font-sans text-[9px] font-extrabold">
                            {['Docker Containers', 'Nginx Gateway API', 'Laravel PHP / Node.js', 'PostgreSQL Secure Server', 'Tailwind GUI Framework'].map(sc => (
                              <span key={sc} className="bg-neutral-150 dark:bg-slate-800 text-neutral-850 dark:text-slate-350 px-2 py-0.5 rounded-lg border border-neutral-200/20 dark:border-slate-700/20">
                                {sc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-neutral-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-bold">
                            SaaS Staging Sandbox URL:
                          </span>
                          <a
                            href="https://enterprise-staging.webzonebd.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sky-505 dark:text-cyan-405 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            enterprise-staging.webzonebd.com
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Dynamic Chat Room */}
                    <div className="lg:col-span-8 flex flex-col justify-between gap-4 text-left">
                      <div className="p-4 bg-neutral-50 dark:bg-slate-950/40 rounded-3xl border border-neutral-200/50 dark:border-slate-805 flex-1 flex flex-col justify-between gap-4 shadow-inner">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-150 dark:border-slate-800/40 mb-1">
                          <span className="font-mono text-[9px] uppercase font-black tracking-widest text-[#2563EB] dark:text-cyan-405">
                            💬 ACTIVE MEETING DISCUSSIONS
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Live SLA Chat Feed</span>
                        </div>

                        {/* Message list panel */}
                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                          {projectComments.map((cm, idx) => {
                            const isUser = cm.sender === 'user';
                            return (
                              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 max-w-[85%] rounded-2xl text-xs space-y-1 ${
                                  isUser 
                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                                    : 'bg-neutral-100 dark:bg-slate-850/60 text-slate-850 dark:text-slate-200 rounded-tl-none border border-neutral-200/10'
                                }`}>
                                  <div className="flex items-center justify-between gap-6 opacity-75 font-mono text-[8.5px]">
                                    <span className="font-black">
                                      {isUser ? (language === 'bn' ? 'আপনি (কাস্টমার)' : 'You (Client)') : '👨‍💻 WebzoneBD Software Lead'}
                                    </span>
                                    <span>{cm.time}</span>
                                  </div>
                                  <p className="leading-relaxed font-sans">{cm.text}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handlePostProjectComment} className="pt-3 border-t border-neutral-150 dark:border-slate-800/40 flex gap-2">
                          <input
                            type="text"
                            required
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder={language === 'bn' ? 'ডেভেলপার টিমের জন্য রিকোয়ারমেন্ট বা নোটিফিকেশন টাইপ করুন...' : 'Type specific message or update request for the assigned partner team...'}
                            className="flex-1 bg-white dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 focus:border-indigo-500 px-4 py-2.5 text-xs rounded-xl focus:outline-none transition font-sans text-slate-850 dark:text-white"
                          />
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-xs font-black rounded-xl cursor-pointer hover:opacity-90 transition active:scale-95 shrink-0 uppercase"
                          >
                            Send ✉️
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* 4.⬇️ ACTIVE VIEW: ডাউনলোডস (Downloads) */}
            {activeTab === 'downloads' && (
              <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-left animate-in fade-in duration-300">
                <div className="pb-3 border-b border-[#F1F5F9] dark:border-slate-800">
                  <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400">⬇️ ডাউনলোডস (Genuine Script Archive ZIP Downloads)</h3>
                  <p className="text-xs text-neutral-400 mt-1">Download clean, updated, genuine script archives for your purchased marketplace packages.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 space-y-4">
                    <Download className="w-12 h-12 mx-auto stroke-[1.5] text-[#2563EB]/40 animate-bounce" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {language === 'bn' ? 'বর্তমানে কোনো ডাউনলোড ফাইল প্রস্তুত নেই' : 'No Download Files Available at this Time'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      {language === 'bn'
                        ? 'আপনার অ্যাকাউন্টের অধীনে ক্রয়কৃত কোনো স্ক্রিপ্ট বা প্রোডাক্টের ফাইল পাওয়া যায়নি। অনুগ্রহ করে আমাদের ডিজিটাল স্টোর অথবা ওয়েবসাইট ক্যাটালগ থেকে আপনার পছন্দের সিস্টেমটি অর্ডার করে ডাউনলোড ফাইল সচল করুন।'
                        : 'No script packages found beneath this account. Instantly acquire digital codes or services to populate downloads archives.'}
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                      <button onClick={() => { if (onNavigate) onNavigate('marketplace'); else triggerToast('Loading WebzoneBD Digital Store...'); }} className="p-2 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-sm">
                        🛒 {language === 'bn' ? 'ডিজিটাল স্টোর স্ক্রিপ্ট কিনুন' : 'Browse Digital Store'}
                      </button>
                      <button onClick={() => { if (onNavigate) onNavigate('services'); else setActiveTab('my-services'); }} className="p-2 py-1.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl transition cursor-pointer">
                        💼 {language === 'bn' ? 'সার্ভিসসমূহ দেখুন' : 'Explore IT Services'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-5 rounded-2xl border border-neutral-150 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]/30 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <span className="p-1 px-2.5 bg-[#2563EB]/10 text-[#2563EB] font-mono text-[9px] font-bold rounded uppercase">ZIP package</span>
                          <h4 className="text-sm font-black text-neutral-900 dark:text-white mt-2">{ord.itemTitle}</h4>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Purchase Order Ref: {ord.id}</p>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 dark:border-slate-900/60 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-450 font-mono">Size Limit: ~24.8MB</span>
                          <button
                            onClick={() => handleScriptDownload(ord)}
                            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:scale-[1.02] text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> Descend Code ZIP
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5.🔑 ACTIVE VIEW: আমার লাইসেন্স (My Licenses) */}
            {/* 4.🌐 ACTIVE VIEW: ডোমেইন ম্যানেজমেন্ট (My Domains & DNS Manager) */}
            {(activeTab === 'my-domains' || activeTab.includes('domain')) && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="pb-3 border-b border-neutral-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="p-1 px-2.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-mono text-[9px] font-bold rounded uppercase">Active Domains Ledger</span>
                    <h3 className="text-base font-extrabold text-[#2563EB] mt-1.5 dark:text-cyan-405">🌐 Registered Domain Portfolios (ডোমেইনসমূহ)</h3>
                    <p className="text-xs text-neutral-400">Manage nameservers redirects, configure DNS zones (A, MX, CNAME, TXT), and configure WHOIS privacy protocols.</p>
                  </div>
                  <span className="p-1.5 px-3 bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                    🔐 SECURE WHOIS PRIVACY
                  </span>
                </div>

                {/* Sub Tab selection */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 font-mono text-xs">
                  <button 
                    onClick={() => setActiveTab('my-domains')}
                    className={`px-4 py-2 rounded-xl transition font-bold ${activeTab === 'my-domains' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400'}`}
                  >
                    🔍 Domain Portfolio ({domains.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('dns-manager')}
                    className={`px-4 py-2 rounded-xl transition font-bold ${activeTab === 'dns-manager' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400'}`}
                  >
                    🛠️ DNS Zone Record Editor
                  </button>
                  <button 
                    onClick={() => setActiveTab('register-domains')}
                    className={`px-4 py-2 rounded-xl transition font-bold ${activeTab === 'register-domains' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400'}`}
                  >
                    🛒 Register New Domain
                  </button>
                </div>

                {/* TAB 1: DOMAIN DIRECTORY LIST */}
                {activeTab === 'my-domains' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedDomains.length === 0 ? (
                        <div className="p-12 border border-dashed border-neutral-200 dark:border-slate-800 rounded-3xl text-center space-y-4 col-span-2">
                          <span className="text-4xl block">🌐</span>
                          <h4 className="font-sans font-black text-sm text-slate-800 dark:text-slate-200">
                            {language === 'bn' ? 'কোনো নিবন্ধিত ডোমেইন পাওয়া যায়নি' : 'No Registered Domains'}
                          </h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                            {language === 'bn'
                              ? 'আপনার এই অ্যাকাউন্টের অধীনে বর্তমানে কোনো সক্রিয় ডোমেইন রেজিস্ট্রেশন নেই। আজই নতুন কোনো কাস্টম প্রজেক্ট শুরু করতে ডোমেইন রেজিস্টার করুন।'
                              : 'Protect your unique digital brand name. Secure your desired domain suffix instantly.'}
                          </p>
                          <button onClick={() => setActiveTab('register-domains')} className="p-2.5 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl transition cursor-pointer active:scale-95 shadow-sm">
                            🛒 {language === 'bn' ? 'ডোমেইন রেজিস্টার করুন' : 'Search & Register Domain'}
                          </button>
                        </div>
                      ) : (
                        displayedDomains.map(dom => {
                          const daysRemaining = getDaysRemaining(dom.expiresAt);
                          return (
                          <div key={dom.id} className={`p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border space-y-4 transition-all duration-300 ${
                            daysRemaining <= 30
                              ? 'border-rose-400/40 dark:border-rose-900/60 shadow-[0_0_15px_rgba(239,68,68,0.05)] bg-rose-50/10 dark:bg-rose-950/5'
                              : 'border-slate-150 dark:border-slate-850'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-slate-400 font-bold">Domain ID: {dom.id}</span>
                              <div className="flex items-center gap-1.5">
                                {daysRemaining <= 30 && (
                                  <span className={`p-1 px-2 border rounded-md text-[9px] font-mono tracking-wider font-extrabold uppercase animate-pulse flex items-center gap-1 ${
                                    daysRemaining <= 0
                                      ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                      : 'bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                                  }`}>
                                    ⚠️ {daysRemaining <= 0 ? 'Expired' : `Expires in ${daysRemaining}d`}
                                  </span>
                                )}
                                <span className={`p-1 px-2 border rounded-md text-[9px] font-mono tracking-wider font-extrabold uppercase ${
                                  dom.status === 'Active' ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                }`}>
                                  {dom.status}
                                </span>
                              </div>
                            </div>

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-[#2563EB] dark:text-[#38BDF8] text-base font-mono">{dom.domainName}</h4>
                            <p className="text-[11px] text-slate-400 font-mono">Registered Since: <strong className="text-slate-250 font-semibold">{dom.registeredAt}</strong></p>
                            <p className="text-[11px] text-slate-400 font-mono">Renews / Expires: <strong className="text-[#EF4444] font-semibold">{dom.expiresAt}</strong></p>
                          </div>

                          <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-mono">WHOIS Privacy:</span>
                              <button 
                                onClick={() => {
                                  setDomains(prev => prev.map(d => {
                                    if (d.id === dom.id) {
                                      const nextp = !d.whoisLocked;
                                      triggerToast(`${d.domainName} WHOIS Protection is now ${nextp ? 'ENABLED' : 'DISABLED'}`);
                                      onAddActivityLog(`Toggled WHOIS protection state to ${nextp} for domain: ${d.domainName}`);
                                      return { ...d, whoisLocked: nextp };
                                    }
                                    return d;
                                  }));
                                }}
                                className={`p-1 px-2.5 rounded-lg text-[10px] font-mono font-bold transition ${
                                  dom.whoisLocked ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                                }`}
                              >
                                {dom.whoisLocked ? '🔒 Private (Locked)' : '🔓 Exposed (Public)'}
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                triggerToast(`Opening DNS Editor zone file for ${dom.domainName}`);
                                setActiveTab('dns-manager');
                              }}
                              className="px-2.5 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-black rounded-lg transition"
                            >
                              Manage Zone ⚙️
                            </button>
                          </div>
                        </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: DNS RECORDS CONFIG */}
                {activeTab === 'dns-manager' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-500 text-xs font-mono">
                      ⚠️ 💡 DNS Zone modifications standard resolution latency is 2 to 24 hours depending on client nameserver cached TTL structures.
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/40">
                      <table className="w-full text-xs font-mono text-left whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-950/60 uppercase text-[9px] font-bold text-slate-400 tracking-wider">
                            <th className="p-3.5 px-4">DNS Name / Host</th>
                            <th className="p-3.5">Record Type</th>
                            <th className="p-3.5">IP Value / Target Destination</th>
                            <th className="p-3.5">TTL</th>
                            <th className="p-3.5 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                          {dnsRecords.map(rc => (
                            <tr key={rc.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                              <td className="p-3.5 px-4 font-black">{rc.name}</td>
                              <td className="p-3.5"><span className="p-1 px-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-cyan-300 rounded text-[9px] font-black">{rc.type}</span></td>
                              <td className="p-3.5 text-slate-500 dark:text-slate-300">{rc.value}</td>
                              <td className="p-3.5 text-slate-400">{rc.ttl} (sec)</td>
                              <td className="p-3.5 text-center">
                                <button 
                                  onClick={() => {
                                    setDnsRecords(prev => prev.filter(r => r.id !== rc.id));
                                    triggerToast(`DNS Record deleted successfully for hostname: ${rc.name}`);
                                    onAddActivityLog(`Pruned A/CNAME/MX DNS Zone Record reference ID: ${rc.id}`);
                                  }}
                                  className="text-xs text-rose-500 hover:scale-[1.04] transition"
                                >
                                  ❌ Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add records form */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                      <h4 className="font-mono font-bold text-xs uppercase tracking-wide text-slate-400 mb-3 text-left">➕ Add Custom DNS Zone Record</h4>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const target = e.currentTarget;
                          const nameVal = (target.elements.namedItem('hostname') as HTMLInputElement).value;
                          const typeVal = (target.elements.namedItem('recType') as HTMLSelectElement).value;
                          const destVal = (target.elements.namedItem('destination') as HTMLInputElement).value;
                          const ttlVal = parseInt((target.elements.namedItem('ttl') as HTMLInputElement).value) || 14400;

                          const nr = {
                            id: Math.random().toString(),
                            name: nameVal,
                            type: typeVal,
                            value: destVal,
                            ttl: ttlVal
                          };

                          setDnsRecords(prev => [...prev, nr]);
                          triggerToast(`DNS Record for "${nameVal}" added! propagation configured.`);
                          onAddActivityLog(`Registered new DNS Zone Record: ${nameVal} -> ${destVal} (${typeVal})`);
                          target.reset();
                        }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs"
                      >
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Host (e.g. www)</label>
                          <input required name="hostname" placeholder="e.g. mail" className="w-full p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Record Type</label>
                          <select name="recType" className="w-full p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
                            <option value="A">A (IPv4 Address)</option>
                            <option value="CNAME">CNAME (Alias)</option>
                            <option value="MX">MX (Mail Server)</option>
                            <option value="TXT">TXT (Verification Text)</option>
                          </select>
                        </div>
                        <div className="space-y-1 text-left col-span-1 md:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Target IP / Value destination</label>
                          <div className="flex gap-2">
                            <input required name="destination" placeholder="e.g. 192.168.1.1 or priority server" className="flex-1 p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800" />
                            <input type="hidden" name="ttl" value="14400" />
                            <button type="submit" className="px-5 bg-[#2563EB] hover:bg-blue-600 font-extrabold text-white rounded-xl transition cursor-pointer">
                              Add
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB 3: REGISTER DOMAIN PORTAL */}
                {activeTab === 'register-domains' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#2563EB]/5 to-[#7C3AED]/5 border border-slate-100 dark:border-slate-800 text-xs text-left space-y-4">
                      <h4 className="font-mono font-black text-xs uppercase tracking-wide text-slate-400">🛒 Purchase Domain from Available Extension Ledger</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Input your target domain name to purchase. Registrations are funded instantly from your current wallet balance:
                      </p>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const target = e.currentTarget;
                          const searchName = (target.elements.namedItem('domSearch') as HTMLInputElement).value;
                          const extension = (target.elements.namedItem('domExt') as HTMLSelectElement).value;
                          const finalDomain = searchName + extension;
                          const priceIdx = extension === '.com' ? 12.00 : extension === '.xyz' ? 2.50 : extension === '.bd' ? 15.00 : 9.50;

                          if (userWalletBalance < priceIdx) {
                            triggerToast("Error: Account wallet balance is insufficient! Click 'Billing' to add funds.");
                            return;
                          }

                          // deduct & append
                          setUserWalletBalance(prev => prev - priceIdx);
                          const newDom = {
                            id: (domains.length + 1).toString(),
                            domainName: finalDomain,
                            status: 'Active',
                            registeredAt: new Date().toLocaleDateString(),
                            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            whoisLocked: true
                          };

                          setDomains(prev => [...prev, newDom]);
                          triggerToast(`Congratulations! "${finalDomain}" successfully purchased and registered!`);
                          onAddActivityLog(`Instantly registered new domain portfolio: ${finalDomain} (Debited $${priceIdx.toFixed(2)})`);
                          target.reset();
                        }}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <input name="domSearch" required placeholder="e.g. startupidea" className="flex-1 p-3 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl font-mono text-xs font-bold focus:outline-none" />
                        <select name="domExt" className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500">
                          <option value=".com">.com ($12.00/yr)</option>
                          <option value=".net">.net ($9.50/yr)</option>
                          <option value=".xyz">.xyz ($2.50/yr)</option>
                          <option value=".bd">.com.bd ($15.00/yr)</option>
                        </select>
                        <button type="submit" className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:scale-[1.02] text-slate-950 font-black text-xs rounded-xl cursor-pointer transition">
                          Verify & Buy Domain 🚀
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5.💻 ACTIVE VIEW: হোস্টিং ম্যানেজমেন্ট (My Hosting Packages Center) */}
            {(activeTab === 'my-hosting' || activeTab.includes('hosting')) && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="pb-3 border-b border-neutral-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
                  <div>
                    <span className="p-1 px-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-[9px] font-bold rounded uppercase">cPanel Node Containers</span>
                    <h3 className="text-base font-extrabold text-[#2563EB] mt-1.5 dark:text-cyan-405">💻 Web Hosting Server Quotas (হোস্টিং সমূহ)</h3>
                    <p className="text-xs text-neutral-400">Monitor SSD disk usages, trigger sandbox daily automatic backups, and proxy SSO link loops directly into cPanel dashboard config.</p>
                  </div>
                  <span className="p-1.5 px-3 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                    🟢 INGRESS PORT ONLINE
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {activeHosting.map(host => {
                    const cpuPercent = host.cpuUsage || 28;
                    const ssdPercent = Math.round((host.ssdSpaceUsed / host.ssdSpaceLimit) * 100);
                    const daysRemaining = host.expiresAt ? getDaysRemaining(host.expiresAt) : 999;

                    return (
                      <div key={host.id} className={`p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border space-y-5 transition-all duration-300 ${
                        daysRemaining <= 30
                          ? 'border-rose-400/40 dark:border-rose-900/60 shadow-[0_0_15px_rgba(239,68,68,0.05)] bg-rose-50/10 dark:bg-rose-950/5'
                          : 'border-slate-150 dark:border-slate-850'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-slate-400 block">CONTAINER SERIAL ID: {host.id}</span>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wide">{host.tierName}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                triggerToast("Connecting to WHMCS SSO token servers... Handshaking...");
                                setTimeout(() => {
                                  triggerToast("🔐 SSO Login bypass approved! Opening cPanel backend dashboard...");
                                  onAddActivityLog(`Constructed bypass SSO secure handshake with hosting cPanel server container: ${host.primaryDomain}`);
                                }, 800);
                              }}
                              className="px-3 py-1.5 bg-[#2563EB]/10 text-[#2563EB] dark:text-cyan-400 font-mono text-[10px] font-bold rounded-lg hover:bg-slate-100 transition"
                            >
                              ⚡ Launch cPanel Dashboard
                            </button>
                            {host.expiresAt && daysRemaining <= 30 && (
                              <span className={`p-1 px-2 border rounded-md text-[9px] font-mono tracking-wider font-extrabold uppercase animate-pulse flex items-center gap-1 ${
                                daysRemaining <= 0
                                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                  : 'bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                              }`}>
                                ⚠️ {daysRemaining <= 0 ? 'Expired' : `Expires in ${daysRemaining}d`}
                              </span>
                            )}
                            <span className="p-1 px-2.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[9px] font-mono font-bold rounded uppercase">
                              Active
                            </span>
                          </div>
                        </div>

                        {/* Usage progress states bars */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* CPU Gauge */}
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-xs text-left space-y-2">
                            <div className="flex justify-between items-center font-mono font-bold">
                              <span className="text-slate-400 text-[10px]">CPU CORE POWER</span>
                              <span className="text-[#2563EB]">{cpuPercent}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-600 to-[#7C3AED]" style={{ width: `${cpuPercent}%` }} />
                            </div>
                          </div>

                          {/* RAM Gauge */}
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-xs text-left space-y-2">
                            <div className="flex justify-between items-center font-mono font-bold">
                              <span className="text-slate-400 text-[10px]">MEMORY CONCURRENT (1GB RAM)</span>
                              <span className="text-emerald-500">42%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '42%' }} />
                            </div>
                          </div>

                          {/* SSD Gauge */}
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-xs text-left space-y-2">
                            <div className="flex justify-between items-center font-mono font-bold">
                              <span className="text-slate-400 text-[10px]">SSD DISK SPACE</span>
                              <span className="text-indigo-400">{host.ssdSpaceUsed}GB / {host.ssdSpaceLimit}GB ({ssdPercent}%)</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${ssdPercent}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between gap-1.5 flex-wrap font-mono text-xs">
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-[10px] text-slate-400">Primary Server Domain URL: <strong className="text-indigo-400 underline font-semibold">{host.primaryDomain}</strong></span>
                            {host.expiresAt && (
                              <span className="text-[10px] text-slate-400">Renews / Expires: <strong className={`${daysRemaining <= 30 ? 'text-[#EF4444]' : 'text-slate-500'} font-semibold`}>{host.expiresAt}</strong></span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (userWalletBalance < 8.00) {
                                  triggerToast("Insufficient wallet funds! Add at least $8.00 in your Billing ledger.");
                                  return;
                                }
                                setUserWalletBalance(prev => prev - 8.00);
                                setActiveHosting(prev => prev.map(hp => {
                                  if (hp.id === host.id) {
                                    return { ...hp, ssdSpaceLimit: hp.ssdSpaceLimit + 10 };
                                  }
                                  return hp;
                                }));
                                triggerToast("Success! Upgraded SSD disk quota by +10GB dynamically!");
                                onAddActivityLog(`Upgraded SSD limits targets for tier hosting domain: ${host.primaryDomain} (Debited $8.00)`);
                              }}
                              className="px-3 py-1.5 bg-[#10B981]/15 text-[#10B981] hover:scale-[1.02] active:scale-95 transition rounded-lg font-bold"
                            >
                              Add +10GB Storage space ($8.00) 🛡️
                            </button>

                            <button
                              onClick={() => {
                                triggerToast("Compiling full folder paths snapshot into tar.gz backup script...");
                                setTimeout(() => {
                                  triggerToast("Backup created successfully! (saved locally as whmcs-backup-bin.tar.gz)");
                                  onAddActivityLog(`Triggered host backup scheduler snapshot generation for domain: ${host.primaryDomain}`);
                                }, 900);
                              }}
                              className="px-3 py-1.5 bg-neutral-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-neutral-300 transition"
                            >
                              📦 Daily Backup
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6.💰 ACTIVE VIEW: আমার ওয়ালেট (My Wallet) */}
            {/* 6.💰 ACTIVE VIEW: বিলিং ও ইনভয়েস (Billing, Invoices & Credits Workspace) */}
            {(activeTab === 'my-wallet' || activeTab.includes('billing') || activeTab.includes('invoice')) && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="pb-3 border-b border-neutral-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="p-1 px-2 text-white bg-gradient-to-r from-amber-500 to-amber-600 font-mono text-[9px] font-bold rounded uppercase">WHMCS Payment ledger</span>
                    <h3 className="text-base font-extrabold text-[#2563EB] dark:text-[#38BDF8] mt-1.5">💳 Account Billing Center (বিলিং ও পেমেন্ট)</h3>
                    <p className="text-xs text-neutral-400">Add account credits, settle pending invoices instantly, and download official payment receipts.</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400 text-[11px] font-bold">Wallet Credit:</span>
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl font-black text-sm">
                      ${userWalletBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Billing Summary Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-left space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Pending Invoices Debt</span>
                    <p className="text-base font-black">${pendingInvoices.reduce((acc, current) => acc + (current.status === 'Unpaid' ? current.amount : 0), 0).toFixed(2)}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-left space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Paid Lifetime Bills</span>
                    <p className="text-base font-black">${pendingInvoices.reduce((acc, current) => acc + (current.status === 'Paid' ? current.amount : 0), 0).toFixed(2)}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-500 text-left space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Active Billing Profile</span>
                    <p className="font-extrabold text-[11px] mt-1 text-slate-300">Active Client ID: {user?.id || '#9832'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Settle Invoices */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono text-left">🧾 Outstanding Statements & Invoices</h4>
                    
                    <div className="space-y-3 font-sans">
                      {pendingInvoices.length === 0 ? (
                        <div className="p-8 text-center bg-[#F8FAFC] dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {language === 'bn' ? 'কোনো বকেয়া বিল বা ইনভয়েস পাওয়া যায়নি।' : 'No outstanding statements or unpaid invoices found.'}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {language === 'bn' ? 'আপনার অ্যাকাউন্টের সকল পেমেন্ট সম্পূর্ণ পরিশোধিত।' : 'Your account payments are fully synchronized and up to date.'}
                          </p>
                        </div>
                      ) : (
                        pendingInvoices.map(inv => {
                          const styleClass = inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20';
                          return (
                            <div key={inv.id} className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1 text-left">
                                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Invoice No: #{inv.id} • {inv.dueDate}</span>
                                <h5 className="font-extrabold text-sm ml-0.5">{inv.description}</h5>
                                <p className="text-xs font-mono font-black text-[#2563EB] dark:text-[#38BDF8]">${inv.amount.toFixed(2)} <span className={`p-0.5 px-2 rounded-md text-[9px] font-bold uppercase border ml-1.5 ${styleClass}`}>{inv.status}</span></p>
                              </div>

                              <div className="flex gap-2 shrink-0">
                                {inv.status === 'Unpaid' ? (
                                  <button
                                    onClick={() => {
                                      if (userWalletBalance < inv.amount) {
                                        triggerToast(`Insufficient funds! Need $${inv.amount.toFixed(2)}. Please add funds to wallet.`);
                                        return;
                                      }
                                      // Settle invoice
                                      setUserWalletBalance(prev => prev - inv.amount);
                                      setPendingInvoices(prev => prev.map(p => p.id === inv.id ? { ...p, status: 'Paid' } : p));
                                      triggerToast(`Success! Invoice #${inv.id} settled successfully!`);
                                      onAddActivityLog(`Settled and Paid Invoice Code #${inv.id}: ${inv.description} (Debited $${inv.amount.toFixed(2)})`);
                                    }}
                                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 font-black text-xs text-white rounded-xl cursor-pointer"
                                  >
                                    Pay with Balance 💳
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      triggerToast(`Generating PDF file receipt layout for invoice #${inv.id}... Done!`);
                                      const mockText = `WEBZONEBD IT INVOICE -- NO: #${inv.id}\nSettled via Account Wallet Credits\nItem Description: ${inv.description}\nPaid Total: $${inv.amount.toFixed(2)}\nThank you for choosing standard services.`;
                                      const element = document.createElement("a");
                                      const file = new Blob([mockText], { type: 'text/plain' });
                                      element.href = URL.createObjectURL(file);
                                      element.download = `Invoice-${inv.id}.txt`;
                                      document.body.appendChild(element);
                                      element.click();
                                    }}
                                    className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-black text-xs text-slate-500 rounded-xl cursor-pointer"
                                  >
                                    Download PDF 📄
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pre-Fund Wallet */}
                  <div className="lg:col-span-5 space-y-5">
                    <form 
                      id="pre-fund-balance"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.currentTarget;
                        const depAmt = parseFloat((target.elements.namedItem('amountVal') as HTMLInputElement).value) || 0;
                        const depChan = (target.elements.namedItem('gatewayChan') as HTMLSelectElement).value;

                        setUserWalletBalance(prev => prev + depAmt);
                        triggerToast(`Deposited $${depAmt.toFixed(2)} top-up fund successfully!`);
                        onAddActivityLog(`Deposited account pre-fund credits: $${depAmt.toFixed(2)} via ${depChan}`);
                        target.value = '';
                        target.reset();
                      }}
                      className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-4"
                    >
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono text-left">📈 Pre-Fund Account Balance</h4>
                      
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">Deposit Amount ($ USD)</label>
                        <input
                          required
                          name="amountVal"
                          type="number"
                          min="1"
                          placeholder="e.g. 50"
                          className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] font-mono font-black text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">Payment Interface Gateway</label>
                        <select name="gatewayChan" className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-xs font-bold text-slate-500 focus:outline-none">
                          <option value="bKash Quick Gateway">bKash Instant Checkout</option>
                          <option value="Nagad Mobile Checkout">Nagad FinTech Link</option>
                          <option value="Rocket Cash Gateway">DBBL Rocket</option>
                          <option value="Stripe Card Gateway">Stripe Secure SSL Core</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-black uppercase text-xs rounded-xl shadow cursor-pointer transition"
                      >
                        Deposit Simulated Credits ➕
                      </button>
                    </form>

                    <div className="p-4 rounded-xl bg-indigo-500/5 text-slate-500 text-[10px] font-mono leading-relaxed text-left">
                      💡 Wallet pre-funded credits are structural snapshots of checkout sandboxes and never involve real fiat processing or financial debt transactions.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8.🤝 ACTIVE VIEW: এফিলিয়েট প্রোগ্রাম (Affiliate Program) */}
            {activeTab === 'affiliate-program' && (
              <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-8 text-left animate-in fade-in duration-300">
                
                {/* 1. STATE: UNREGISTERED / NOT REGISTERED YET */}
                {affiliateStatus === 'unregistered' && (
                  <div className="space-y-6">
                    <div className="border-b border-neutral-150 dark:border-slate-800 pb-4">
                      <h3 className="text-base font-extrabold text-[#F59E0B] flex items-center gap-1.5">
                        <span>🤝 এফিলিয়েট পার্টনারশিপ রেজিস্ট্রেশন (Partner Program Onboarding)</span>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        WebzoneBD-এর আধুনিক এফিলিয়েট সিস্টেমে যুক্ত হয়ে আমাদের হাই-এন্ড আইটি সল্যুশন প্রচার করুন এবং সফল সেলসে সর্বোচ্চ ৫০% পর্যন্ত কমিশন উপার্জন করুন।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Onboarding form card */}
                      <form onSubmit={handleAffiliateRegisterSubmit} className="md:col-span-7 p-6 rounded-2xl border border-neutral-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-4 text-xs">
                        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wide">পার্টনারশিপ আবেদন ফর্ম</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Promotion Channel / Medium</label>
                            <input 
                              type="text" 
                              required 
                              value={promoChannel} 
                              onChange={(e) => setPromoChannel(e.target.value)} 
                              placeholder="e.g. Technology Blog, YouTube, Facebook Group"
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded text-xs text-neutral-900 dark:text-white"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Target Audience Region</label>
                            <select 
                              value={promoCountry} 
                              onChange={(e) => setPromoCountry(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded text-xs text-neutral-900 dark:text-white font-bold"
                            >
                              <option value="Bangladesh">Bangladesh</option>
                              <option value="Saudi Arabia">Saudi Arabia</option>
                              <option value="Middle East">Middle East (Gulf Region)</option>
                              <option value="Global">Global Reach</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-[#F59E0B] font-bold block">Preferred Payout Wallet</label>
                            <select
                              value={withdrawGateway}
                              onChange={(e) => setWithdrawGateway(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded text-xs text-neutral-900 dark:text-white font-bold"
                            >
                              <option value="bKash">bKash (BD Fintech)</option>
                              <option value="Nagad">Nagad (BD Post Fintech)</option>
                              <option value="Rocket">Rocket (DBBL Wallet)</option>
                              <option value="PayPal">PayPal (Global Payout)</option>
                              <option value="Bank">Direct Wire bank Transfer</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Your Payment Address/Details</label>
                            <input 
                              type="text" 
                              required 
                              value={payoutDetails} 
                              onChange={(e) => setPayoutDetails(e.target.value)} 
                              placeholder="e.g. Phone number or Bank IBAN"
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded text-xs text-neutral-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 text-[10px] leading-relaxed text-amber-600 dark:text-amber-400 space-y-1">
                          <p className="font-bold">📋 Terms Checklist:</p>
                          <p>• You agree not to perform self-purchases via own referral parameters.</p>
                          <p>• Commission tracks successfully on cookies matching standard WebzoneBD packages.</p>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            className="bg-purple-650 hover:bg-purple-600 text-white font-extrabold px-6 py-2.5 rounded-lg text-xs uppercase transition tracking-wider flex-1 cursor-pointer"
                          >
                            Submit Grow Partner Application ✅
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleAutoApproveSelfDev}
                            className="bg-neutral-900 dark:bg-slate-850 hover:opacity-90 text-yellow-450 font-black px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer"
                          >
                            ⚡ Sandbox Bypass
                          </button>
                        </div>
                      </form>

                      {/* Info side column */}
                      <div className="md:col-span-5 space-y-4">
                        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 text-white space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 font-mono">Commission Tier Levels</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between pb-1 border-b border-slate-800 text-[11px]">
                              <span className="text-neutral-400">Regular Tier</span>
                              <span className="text-emerald-400 font-bold">15% Commission Rate</span>
                            </div>
                            <div className="flex justify-between pb-1 border-b border-slate-800 text-[11px]">
                              <span className="text-neutral-400">Bronze Power Partner</span>
                              <span className="text-emerald-400 font-bold">20% Commission Rate</span>
                            </div>
                            <div className="flex justify-between pb-1 border-b border-slate-800 text-[11px]">
                              <span className="text-neutral-400">Gold Elite (VIP Referral)</span>
                              <span className="text-emerald-400 font-bold">25% - 40% Custom Rate</span>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-slate-400">
                            Our administrators continuously optimize rate ratios per-partner inside the dynamic admin control, guaranteeing higher yields for high converting channels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. STATE: PENDING FOR SCREENING */}
                {affiliateStatus === 'pending' && (
                  <div className="p-8 text-center rounded-3xl border border-amber-500/25 bg-amber-500/5 space-y-6 text-xs max-w-2xl mx-auto py-10">
                    <span className="h-10 w-10 bg-amber-500/10 text-[#F59E0B] rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-pulse">⏳</span>
                    <div className="space-y-2">
                      <h4 className="text-sm font-extrabold text-amber-500 text-center uppercase tracking-wider">আবেদন প্রক্রিয়াধীন রয়েছে (Application Review Pending)</h4>
                      <p className="text-xs text-neutral-550 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                        ধন্যবাদ! আপনার পার্টনারশিপ আবেদনটি আমাদের সিস্টেমে সফলভাবে সংরক্ষিত রয়েছে। আমাদের অ্যাডমিন প্যানেল টিম আপনার প্রমোশন চ্যানেল যাচাই করে অ্যাকাউন্ট অ্যাক্টিভেট করে দিবে।
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-1.5 font-mono text-[10px] text-slate-300 max-w-md mx-auto">
                      <p><span className="text-slate-550">Applicant:</span> {user?.name}</p>
                      <p><span className="text-slate-550">Channel:</span> {promoChannel}</p>
                      <p><span className="text-slate-550">Wallet:</span> {withdrawGateway}</p>
                      <p><span className="text-slate-555">Payout Address:</span> {payoutDetails || 'Simulated payout field'}</p>
                      <p className="text-purple-400 animate-pulse"><span className="text-slate-550">SLA Status:</span> Validation in progress...</p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={handleAutoApproveSelfDev}
                        className="px-5 py-2 bg-purple-650 hover:bg-purple-600 text-white font-extrabold rounded-lg uppercase tracking-wider text-[11px] cursor-pointer"
                      >
                        🚀 Sandbox Bypass (Instant Self-Approve)
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. STATE: APPROVED (THE FULLY FEATURED AFFILIATE DASHBOARD) */}
                {affiliateStatus === 'approved' && affiliateProfile && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Header bar widget design */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-150 dark:border-slate-800">
                      <div>
                        <h3 className="text-base font-extrabold text-purple-600 dark:text-purple-400">🤝 এফিলিয়েট প্রোগ্রাম (Growth Partner Commission Platform)</h3>
                        <p className="text-xs text-neutral-500">Promote licensed tools with unique referral parameters and earn high yields.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-black uppercase rounded">
                          Account: APPROVED PARTNER
                        </span>
                        <button 
                          onClick={handleAutoApproveSelfDev}
                          title="Reset settings/Balance to default seeds"
                          className="p-1 bg-red-100 text-red-500 rounded text-[9px] hover:bg-red-200 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Stat Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-black">Referrals Clicks</span>
                        <p className="text-xl font-black mt-1 font-mono text-neutral-900 dark:text-neutral-100">{(affiliateProfile.clicks || 0).toLocaleString()} Clicks</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-black">Formed Sales / Signups</span>
                        <p className="text-xl font-black mt-1 font-mono text-neutral-900 dark:text-neutral-100">{(affiliateProfile.referrals || 0).toLocaleString()} referrals</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-black">Lifetime Earned Profits</span>
                        <p className="text-xl font-black mt-1 font-mono text-emerald-500">${(affiliateProfile.commissionEarned || 0).toFixed(2)} USD</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-black text-purple-500">Withdrawable Balance</span>
                        <p className="text-xl font-black mt-1 font-mono text-purple-500">${(affiliateProfile.balance || 0).toFixed(2)} USD</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Block - Token customization & Sandbox utilities */}
                      <div className="lg:col-span-10 xl:col-span-7 space-y-6">
                        
                        {/* Token deploy panel */}
                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase font-mono tracking-wider text-amber-600 dark:text-amber-400">Deploy Referral Token</h4>
                            <span className="text-[10px] text-pink-400 font-mono font-bold">RATE CAP: {affiliateProfile.commissionRate || 15}%</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/?ref=${affiliateProfile.code}&camp=${customAffSuffix}`}
                              className="bg-neutral-150 dark:bg-slate-950 p-2 text-[10px] font-mono rounded-lg flex-1 text-cyan-500 select-all border border-slate-800 text-xs py-2.5"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/?ref=${affiliateProfile.code}&camp=${customAffSuffix}`);
                                setCopiedAffLink(true);
                                triggerToast('📋 Referral link copied to your clipboard!');
                                setTimeout(() => setCopiedAffLink(false), 2000);
                              }}
                              className="p-2 px-4 bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90 text-slate-900 font-black rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer"
                            >
                              {copiedAffLink ? 'Copied' : 'Copy'}
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase block">Campaign channel tag Suffix</label>
                            <input
                              type="text"
                              value={customAffSuffix}
                              onChange={(e) => setCustomAffSuffix(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                              placeholder="e.g. facebook_ads_bd"
                              className="w-full p-2.5 bg-neutral-100 dark:bg-[#0F172A] rounded border border-neutral-300 dark:border-slate-800 text-xs font-mono font-bold text-neutral-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Interactive Sandbox Traffic Emulator */}
                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4 text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                            <h4 className="font-bold text-purple-400 font-mono text-[11px] uppercase tracking-wide">Developer testing sandbox toolkit</h4>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-mono animate-pulse uppercase">active emulator</span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Use these actions to simulate referral traffic and referred clicks/orders instantly on this sandbox environment. This lets you observe conversions inside your ledger and the administrator panel immediately!
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <button
                              onClick={handleSimulateAffiliateClick}
                              className="p-3 rounded-xl bg-neutral-950 border border-neutral-805 hover:border-purple-500 text-left transition space-y-1 cursor-pointer"
                            >
                              <span className="font-bold text-white block text-xs">🔗 Simulate URL Click</span>
                              <span className="text-[9px] text-[#00E5FF] block font-mono">Increment Clicks count (+1 Click)</span>
                            </button>

                            <button
                              onClick={handleSimulatePromotionSale}
                              className="p-3 rounded-xl bg-neutral-950 border border-neutral-805 hover:border-emerald-500 text-left transition space-y-1 cursor-pointer"
                            >
                              <span className="font-bold text-white block text-xs">💰 Simulate Referred Order</span>
                              <span className="text-[9px] text-emerald-400 block font-mono">Generate $250.00 purchase commission</span>
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Right Block - Withdraw Commission forms */}
                      <div className="lg:col-span-10 xl:col-span-5 space-y-4">
                        <form
                          onSubmit={handleAffiliateWithdrawalSubmit}
                          className="p-5 rounded-2xl border border-neutral-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]/40 text-xs space-y-3"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400">Withdrawal request form</h4>
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-400 font-mono uppercase">Payout Quantity ($ USD)</span>
                              <span className="text-[#00E5FF] font-black">Min limit: $20.00</span>
                            </div>
                            <input
                              type="number"
                              min="20"
                              max="2000"
                              required
                              value={withdrawAmt}
                              onChange={(e) => setWithdrawAmt(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded font-mono font-bold text-sm text-neutral-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-mono block">Mobile FinTech Transfer Gateway Channel</label>
                            <select
                              value={withdrawGateway}
                              onChange={(e) => setWithdrawGateway(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded font-bold text-xs animate-none"
                            >
                              <option value="bKash">bKash Personal Agent</option>
                              <option value="Rocket">Rocket DBA Smart Wallet</option>
                              <option value="Nagad">Nagad FinTech</option>
                              <option value="PayPal">PayPal (Fast release)</option>
                              <option value="Bank">Direct Wire transfer</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-mono block">Registered address/Receiver wallet number</label>
                            <input 
                              type="text" 
                              required 
                              value={payoutDetails} 
                              onChange={(e) => setPayoutDetails(e.target.value)} 
                              placeholder="e.g. PayPal mail or bKash phone"
                              className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-300 dark:border-slate-800 rounded font-bold text-xs"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-purple-650 hover:bg-purple-650 text-white font-black tracking-wide uppercase rounded font-mono text-xs transition cursor-pointer"
                          >
                            Transmit Withdrawal Release Request
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* BOTTOM DYNAMIC MODULE - YOUR CONVERSION HISTORY LEDGER */}
                    <div className="space-y-4 pt-2 border-t border-neutral-150 dark:border-slate-800">
                      <div>
                        <h4 className="font-extrabold text-[#F59E0B] text-xs font-mono uppercase tracking-wider">Your Referral Conversions history ledger</h4>
                        <p className="text-[10px] text-neutral-500">List of successful orders credited to your partner session code.</p>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-slate-800 text-xs">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-[#5B21B6]/10 dark:bg-[#5B21B6]/20 text-[9px] uppercase font-mono tracking-wider text-slate-500 border-b border-neutral-200 dark:border-slate-800">
                            <tr>
                              <th className="p-3">Conversion ID</th>
                              <th className="p-3">Referred Client</th>
                              <th className="p-3">Purchased Product/Service</th>
                              <th className="p-3">Total Cost</th>
                              <th className="p-3">Com % Amount</th>
                              <th className="p-3">Campaign Channel</th>
                              <th className="p-3">Conversion Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-slate-800 bg-white dark:bg-transparent text-neutral-650 dark:text-neutral-350">
                            {affiliateReferralsList.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-4 text-center italic text-slate-500">No referral conversions found yet. Spread your link to start earning!</td>
                              </tr>
                            ) : (
                              affiliateReferralsList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition font-mono text-[10.5px]">
                                  <td className="p-3 font-semibold text-purple-600">#{item.id}</td>
                                  <td className="p-3 font-sans font-medium text-neutral-900 dark:text-neutral-200">{item.referredUserName}</td>
                                  <td className="p-3 font-sans text-neutral-650 dark:text-neutral-400 truncate max-w-[150px]">{item.productName}</td>
                                  <td className="p-3 text-neutral-500">${item.saleAmount}</td>
                                  <td className="p-3 text-emerald-500 font-bold">${item.commissionEarned}</td>
                                  <td className="p-3">
                                    <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-[8.5px] rounded text-slate-400">
                                      {item.campaignSuffix}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-400">{item.date}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. STATE: SUSPENDED OR LOCKED APPLICANTS */}
                {affiliateStatus === 'suspended' && (
                  <div className="p-8 text-center rounded-3xl border border-red-500/25 bg-red-500/5 space-y-4 max-w-xl mx-auto py-10">
                    <span className="h-10 w-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold font-mono">⚠️</span>
                    <h4 className="text-sm font-extrabold text-red-500 text-center uppercase tracking-wider">পার্টনার অ্যাকাউন্ট সাময়িকভাবে স্থগিত</h4>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
                      দুঃখিত, ট্রাফিক পলিসি লঙ্ঘনের কারণে আপনার এই এফিলিয়েট পার্টনার অ্যাকাউন্টটি অ্যাডমিন টিম সাময়িকভাবে স্থগিত করেছে। বিস্তারিত জানতে দয়া করে সাপোর্ট টিকেটের মাধ্যমে বিলিং বা সিকিউরিটি ডিপার্টমেন্টে যোগাযোগ করুন।
                    </p>
                    <button 
                      onClick={handleAutoApproveSelfDev}
                      className="mt-3 px-5 py-2 bg-neutral-900 text-yellow-400 border border-yellow-500/20 text-xs font-black uppercase rounded hover:opacity-95 cursor-pointer"
                    >
                      Bypass Suspension (Sandbox Dev Reset)
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* 7.❤️ ACTIVE VIEW: উইশলিস্ট (Wishlist) */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-left animate-in fade-in duration-300">
                <div className="pb-3 border-b border-neutral-100 dark:border-slate-800">
                  <span className="p-1 px-2 text-white bg-gradient-to-r from-red-500 to-rose-600 font-mono text-[9px] font-bold rounded uppercase">My saved bookmarks</span>
                  <h3 className="text-base font-extrabold text-[#EF4444] mt-1">❤️ Saved Favorites (আপনার উইশলিস্ট)</h3>
                  <p className="text-xs text-neutral-400 mt-1">Ready to launch? Purchase saved items instantly with your pre-funded account balance.</p>
                </div>

                {wishlistedItems.length === 0 ? (
                  <div className="text-center py-16 text-neutral-450">
                    <Heart className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-[#EF4444]" />
                    <p className="text-xs font-semibold">Your favorite item list is empty. Explore services inside WebzoneBD catalog and click heart button!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistedItems.map((prod) => (
                      <div key={prod.id} className="p-4 rounded-xl border border-neutral-150 dark:border-slate-855 bg-[#F8FAFC] dark:bg-slate-900 flex gap-4">
                        <img 
                          referrerPolicy="no-referrer"
                          src={prod.image} 
                          alt="catalog item preview illustration" 
                          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-800"
                        />
                        <div className="flex-1 space-y-1 text-left min-w-0">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white truncate" title={prod.name}>
                            {language === 'bn' ? prod.nameBn : prod.name}
                          </h4>
                          <span className="text-[10px] font-mono text-emerald-500 block font-black">${prod.price.toFixed(2)}</span>
                          <p className="text-[10px] text-neutral-400 truncate leading-snug">{prod.description}</p>
                          <div className="pt-2 flex gap-1.5">
                            <button 
                              onClick={() => {
                                if (userWalletBalance < prod.price) {
                                  triggerToast(`Insufficient funds! Need $${prod.price.toFixed(2)}. Add funds under Billing first.`);
                                  return;
                                }
                                setUserWalletBalance(prev => prev - prod.price);
                                setWishlistedItems(prev => prev.filter(x => x.id !== prod.id));
                                triggerToast(`Success! Purchased ${prod.name} with wallet funds! Setup is beginning.`);
                                onAddActivityLog(`Licensed and deployed codebase: ${prod.name} (Debited $${prod.price.toFixed(2)} from wallet balance)`);
                                
                                if (setPurchasedLicensesList) {
                                  setPurchasedLicensesList((prev: any) => [
                                    ...prev,
                                    {
                                      id: `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
                                      product: prod.name,
                                      licensedTo: "testuser@webzone.corp",
                                      status: "Active",
                                      updatedAt: new Date().toISOString().split('T')[0]
                                    }
                                  ]);
                                }
                              }}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[10px] rounded cursor-pointer transition"
                            >
                              Buy with Wallet 🛒
                            </button>
                            <button 
                              onClick={() => {
                                setWishlistedItems(prev => prev.filter(x => x.id !== prod.id));
                                triggerToast(`Removed ${prod.name} from wishlist.`);
                              }}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 font-bold text-[10px] rounded cursor-pointer transition"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 7.5.🔔 ACTIVE VIEW: নোটিফিকেশন সেন্টার (Notification Center Panel) */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-light-150 dark:border-slate-800">
                  <div>
                    <span className="p-1 px-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 font-mono text-[9px] font-bold rounded uppercase">System Alerts Feed</span>
                    <h3 className="text-base font-extrabold text-blue-500 dark:text-blue-400 mt-1.5 font-sans">🔔 System Notifications Center</h3>
                    <p className="text-xs text-neutral-400 font-sans">Track critical actions, domain expiries, SSL handshake alerts, and security telemetry logs in one place.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      triggerToast("⚡ All notifications marked as read!");
                      onAddActivityLog("Marked all system notifications as read.");
                    }}
                    className="p-2 px-3.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-mono font-black rounded-xl text-xs cursor-pointer transition"
                  >
                    Mark All Read Check ✔
                  </button>
                </div>

                <div className="space-y-3 font-sans">
                  {notifications.map(not => {
                    const badgeClass = not.type === 'domain' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                      not.type === 'hosting' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                                      not.type === 'affiliate' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                      not.type === 'offer' ? 'bg-pink-500/10 text-pink-550 dark:text-pink-400 border-pink-500/20 font-black animate-pulse' :
                                      'bg-blue-500/10 text-blue-500 border-blue-500/20';

                    return (
                      <div key={not.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-150 ${not.read ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 opacity-85' : 'bg-blue-500/5 dark:bg-blue-500/5 border-blue-500/15'}`}>
                        <div className="space-y-1 text-left min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 px-2 rounded text-[9px] font-mono font-bold uppercase border ${badgeClass}`}>{not.type}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{not.date}</span>
                          </div>
                          <h5 className={`text-sm font-extrabold truncate ${not.read ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>{not.title}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{not.message}</p>
                          
                          {not.link && (
                            <div className="pt-2">
                              <a
                                href={not.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-550 hover:to-indigo-550 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-sm active:scale-95 shrink-0"
                              >
                                🎁 {not.linkText || 'Claim Offer'}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {!not.read ? (
                            <button
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === not.id ? { ...n, read: true } : n));
                                triggerToast("Alert flagged as read!");
                              }}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-500 font-bold text-[10px] rounded-lg cursor-pointer transition"
                            >
                              Mark Read
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-500 font-black px-2 py-1 bg-emerald-500/10 rounded-lg">Read ✔</span>
                          )}
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.filter(n => n.id !== not.id));
                              triggerToast("Notification discarded!");
                            }}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-[10px] rounded-lg cursor-pointer transition"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7.6.⭐ ACTIVE VIEW: রিওয়ার্ড ও লয়ালটি (Rewards & Loyalty Center) */}
            {activeTab === 'rewards' && (
              <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-light-150 dark:border-slate-800">
                  <div>
                    <span className="p-1 px-2 text-white bg-gradient-to-r from-amber-500 to-amber-600 font-mono text-[9px] font-bold rounded uppercase">VIP Loyalty rewards program</span>
                    <h3 className="text-base font-extrabold text-amber-500 dark:text-amber-400 mt-1 font-sans">⭐ Star Coins & Loyalty Rewards</h3>
                    <p className="text-xs text-neutral-400 font-sans">Earn Star Points on hosting renewals, domain purchases, and convert them to cold wallet balance.</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400 text-[11px] font-bold">Reward Coins:</span>
                    <span className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl font-black text-sm">
                      ✨ {rewardPoints} Points
                    </span>
                  </div>
                </div>

                {/* Point exchange matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {/* Exchange Form Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-yellow-600/5 border border-amber-500/10 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">🌟 Star Points Conversion Gateway</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Exchange your loyalty coins for direct account credits to settle invoices or registers new hosting packages. Standard rate: <b>1,000 Points = $5.00 Wallet credits</b>.</p>
                    
                    <button
                      onClick={() => {
                        if (rewardPoints < 1000) {
                          triggerToast("Failed: You need at least 1,000 loyalty points to request wallet exchange!");
                          return;
                        }
                        setRewardPoints(prev => prev - 1000);
                        setUserWalletBalance(prev => prev + 5.00);
                        setRewardHistory(prev => [
                          { id: `pt-${Math.floor(100+Math.random()*900)}`, source: 'Loyalty star points wallet exchange debit', points: -1000, date: new Date().toISOString().split('T')[0] },
                          ...prev
                        ]);
                        triggerToast("Success! Exchanged 1,000 points for $5.00 Wallet credits instantly!");
                        onAddActivityLog("Exchanged 1,000 Loyalty points for $5.05 Wallet pre-funded balance.");
                      }}
                      className="p-3 w-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl tracking-wider shadow cursor-pointer transition hover:opacity-90 font-mono"
                    >
                      Exchange 1,000 Coins → Get $5.00 Credited 💳
                    </button>
                  </div>

                  {/* Active Promo Codes List */}
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">🎫 Active Promo & Coupon inventory</h4>
                    
                    <div className="space-y-3 font-sans">
                      {coupons.map((c, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center gap-2 text-xs">
                          <div>
                            <span className="font-mono bg-blue-500/10 text-blue-500 p-1 px-2.5 rounded-md font-bold text-[10px] tracking-wide uppercase">{c.code}</span>
                            <span className="text-[10px] text-slate-400 block mt-1.5">{c.discount} ({c.type})</span>
                          </div>
                          
                          {c.status === 'Active' ? (
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.map((x, i) => i === idx ? { ...x, status: 'Claimed' } : x));
                                setRewardPoints(prev => prev + 150);
                                triggerToast(`Success! Claimed coupon code code ${c.code} for +150 loyalty coins!`);
                                onAddActivityLog(`Redeemed VIP reward coupon code: ${c.code}`);
                              }}
                              className="px-3 py-1 bg-[#2563EB] hover:bg-blue-600 font-bold text-[10px] text-white rounded cursor-pointer transition"
                            >
                              Claim Points 🎁
                            </button>
                          ) : (
                            <span className="text-slate-500 font-mono text-[10px] bg-slate-100 dark:bg-slate-850 p-1 rounded">Redeemed ✔</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Point Logs list */}
                <div className="space-y-3 font-mono text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">📈 Stars & Coins Ledger history logs</h4>
                  <div className="border border-neutral-154 dark:border-slate-805 rounded-2xl overflow-hidden font-sans">
                    <table className="w-full text-left font-mono">
                      <thead className="bg-[#F8FAFC] dark:bg-slate-905 text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                        <tr>
                          <th className="p-3">Reference Txn ID</th>
                          <th className="p-3">Referral action description</th>
                          <th className="p-3 font-bold text-slate-405">Stars Modification</th>
                          <th className="p-3 text-slate-401">SLA Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-150 dark:divide-slate-850 font-medium text-slate-200 text-[11px]">
                        {rewardHistory.map((h, i) => (
                          <tr key={h.id || i}>
                            <td className="p-3 text-slate-400">{h.id}</td>
                            <td className="p-3 text-slate-300 font-sans">{h.source}</td>
                            <td className={`p-3 font-bold ${h.points > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                              {h.points > 0 ? `+${h.points}` : h.points} Points
                            </td>
                            <td className="p-3">{h.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 9.🎫 ACTIVE VIEW: সাপোর্ট টিকেট (Support Tickets) */}
            {activeTab === 'tickets' && (
              <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-150 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-[#7C3AED] dark:text-purple-400">🎫 সাপোর্ট টিকেট (24/7 Priority Emergency Helpdesk)</h3>
                    <p className="text-xs text-neutral-400 mt-1">Submit server SSH parameters or port credentials to resolve system configuration issues.</p>
                  </div>
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4" /> Open Support Request
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12 text-neutral-450">
                    <Ticket className="w-12 h-12 mx-auto mb-2 stroke-[1.5] text-neutral-400" />
                    <p className="text-sm font-semibold">Support Desk Queue parameters empty. Submit coupon or query log records.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets.map((tkt) => (
                      <div 
                        key={tkt.id}
                        className={`p-5 rounded-2xl border transition duration-200 text-left ${
                          activeTicketForChat?.id === tkt.id
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-neutral-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="p-1 px-1.5 text-[9px] uppercase font-mono font-bold bg-neutral-100 dark:bg-slate-800 text-neutral-500 rounded">
                            Ticket Ref: {tkt.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tkt.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-neutral-500/15 text-neutral-400'}`}>
                              {tkt.priority} priority
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-500 uppercase">
                              {tkt.status}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm font-black text-neutral-900 dark:text-white line-clamp-1 mb-1">{tkt.subject}</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{tkt.message}</p>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-slate-800/80">
                          <span className="text-[10px] text-neutral-450 font-mono">Replies Logged: {tkt.replies.length}</span>
                          <button
                            onClick={() => setActiveTicketForChat(tkt)}
                            className="text-xs font-black text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                          >
                            Live Support Room <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTicketForChat && (
                  <div className="p-5 rounded-2xl border border-neutral-150 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]/30 text-xs text-left space-y-4">
                    <div className="pb-3 border-b border-neutral-200 dark:border-slate-850 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">Active session check: {activeTicketForChat.subject}</h4>
                        <p className="text-[11px] text-neutral-450 mt-1 font-mono">Reference ticket system code ID: {activeTicketForChat.id}</p>
                      </div>
                      <button
                        onClick={() => setActiveTicketForChat(null)}
                        className="px-2.5 py-1 bg-red-500/10 text-red-500 font-bold rounded"
                      >
                        Leave chat
                      </button>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] dark:bg-black/40 rounded-xl space-y-3.5 max-h-52 overflow-y-auto min-h-[90px]">
                      {activeTicketForChat.replies.map((rp, index) => {
                        const isAdm = rp.sender === 'admin';
                        return (
                          <div key={index} className={`flex ${isAdm ? 'justify-start' : 'justify-end'}`}>
                            <div className={`p-3 max-w-[80%] rounded-2xl ${isAdm ? 'bg-[#F1F5F9] dark:bg-[#1E293B] text-neutral-800 dark:text-neutral-250 rounded-tl-none' : 'bg-emerald-500 text-slate-950 rounded-tr-none font-semibold'}`}>
                              <span className="text-[9px] font-mono text-neutral-400 block pb-1">{isAdm ? '👨‍💻 System Engineer' : 'Customer (You)'}</span>
                              <p className="leading-relaxed">{rp.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handlePostReply} className="flex gap-2.5">
                      <input
                        type="text"
                        required
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Write support parameters credentials logs detail..."
                        className="flex-1 p-2.5 bg-white dark:bg-[#0F172A] border border-neutral-250 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-450 font-black rounded-xl transition"
                      >
                        Transmit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 10.⚙️ ACTIVE VIEW: Profile সেটিংস (Profile Settings) */}
            {(activeTab === 'profile' || ['basic', 'security', 'sessions', 'billing-info', 'noti', 'social', 'privacy'].includes(activeTab)) && (
              <ProfileSettingsCenter
                language={language}
                user={user}
                ordersCount={orders.length}
                ticketsCount={tickets.length}
                walletBalance={walletBalance}
                formatPrice={formatPrice}
                triggerToast={triggerToast}
                onUpdateUser={onUpdateUser}
                onAddActivityLog={onAddActivityLog}
                setLanguage={setLanguage}
                setTheme={setTheme}
                theme={theme}
                initialActiveTab={
                  activeTab === 'profile'
                    ? 'basic'
                    : activeTab === 'billing-info'
                    ? 'billing'
                    : (activeTab as any)
                }
              />
            )}

            {activeTab === 'profile-legacy' && (
              <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8 shadow-xl text-left max-w-4xl mx-auto animate-in fade-in duration-300 space-y-8">
                
                {/* Header Information Indicator */}
                <div className="pb-4 border-b border-neutral-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
                      <Settings className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                      <span>{language === 'bn' ? 'প্রোফাইল সেটিংস (Profile Settings)' : 'Profile Command Center'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Configure authenticated system credentials, company VAT records, legal billing addresses, and linked gateways.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-505 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-[11px] font-mono font-bold w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span>VERIFIED CLIENT STATUS</span>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdateSubmit} className="space-y-8">
                  
                  {/* SECTION 1: Personal & Company Info */}
                  <div className="bg-[#F8FAFC] dark:bg-[#111827]/40 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#A855F7] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>1. Personal & Company Info</span>
                    </h4>

                    {/* Avatar Upload / Remove Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/40">
                      <div className="relative group self-center sm:self-auto">
                        {/* Radial Glow Ring behind avatar */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] dark:from-[#6366F1] dark:to-[#8B5CF6] opacity-30 blur-md group-hover:opacity-60 transition-all duration-300" />
                        
                        <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] dark:from-[#6366F1] dark:to-[#8B5CF6]">
                          <div className="relative rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] p-[2px]">
                            {profileAvatar ? (
                              <img 
                                src={profileAvatar} 
                                alt="custom client avatar selector file" 
                                className="w-16 h-16 rounded-full object-cover ring-1 ring-neutral-200 transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-black text-xl uppercase tracking-tighter select-none transition-transform duration-300 group-hover:scale-105">
                                {profileName.slice(0, 2)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Input Label overlay */}
                        <label className="absolute bottom-0 right-0 bg-slate-900 border border-slate-700/80 p-1.5 rounded-full text-[#10B981] hover:text-white cursor-pointer hover:scale-110 transition shadow-lg">
                          <Image className="w-3.5 h-3.5" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarFile}
                          />
                        </label>
                      </div>

                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Premium Identification Picture</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-450 leading-relaxed">
                          Supports SVG vector paths, high-res PNG, or JPEG. Max upload size limited to 2MB. Fits cleanly into global client areas.
                        </p>
                        {profileAvatar && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileAvatar('');
                              triggerToast("🗑️ Custom picture successfully unhooked. Reverted to default initials.");
                            }}
                            className="mt-1.5 px-3 py-1 text-[9px] font-black text-red-500 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition duration-200 cursor-pointer"
                          >
                            Remove Static File
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Standard Name, Email, Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Full Registered Name</label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-slate-500 dark:text-slate-450">Verified Email Address</label>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-550 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                            ✓ ACTIVE_SLA
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      
                      {/* WhatsApp Code + Contact Number */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">WhatsApp Phone Connection</label>
                        <div className="flex gap-2">
                          <select 
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value)}
                            className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-slate-800 px-2 rounded-xl text-center focus:outline-none text-[#0F172A] dark:text-[#F8FAFC]"
                          >
                            <option value="+880">🇧🇩 +880</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+91">🇮🇳 +91</option>
                          </select>
                          <input
                            type="text"
                            required
                            value={profileWhatsApp}
                            onChange={(e) => setProfileWhatsApp(e.target.value)}
                            placeholder="1864000005"
                            className="flex-1 rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200 font-mono"
                          />
                        </div>
                      </div>

                      {/* VAT & Business details */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Company Name <span className="text-[10px] text-slate-400 font-normal">(Optional for B2B)</span></label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Webzone BD Ltd"
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none "
                        />
                      </div>

                    </div>

                    {/* VAT Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Tax / VAT ID <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></label>
                        <input
                          type="text"
                          value={taxId}
                          placeholder="e.g. VAT-8829591"
                          onChange={(e) => setTaxId(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] font-mono focus:outline-none"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-3.5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2.5 mt-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-500 dark:text-slate-405 font-medium leading-relaxed">
                            B2B credentials will show up directly inside legal PDF invoices for server hostings & licensed transactions custom records.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Billing Address Structure */}
                  <div className="bg-[#F8FAFC] dark:bg-[#111827]/40 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#A855F7] flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>2. Billing Address (For generating legal PDF invoices)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Street Address</label>
                        <input
                          type="text"
                          value={billingStreet}
                          onChange={(e) => setBillingStreet(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">City</label>
                        <input
                          type="text"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">State / Division</label>
                        <input
                          type="text"
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Country</label>
                        <input
                          type="text"
                          value={billingCountry}
                          onChange={(e) => setBillingCountry(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-450">Postal Code</label>
                        <input
                          type="text"
                          value={billingPostal}
                          onChange={(e) => setBillingPostal(e.target.value)}
                          className="w-full rounded-xl border bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Account Security */}
                  <div className="bg-[#F8FAFC] dark:bg-[#111827]/40 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#A855F7] flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>3. Account Security Management</span>
                    </h4>

                    {/* Change Password Panel */}
                    <div className="p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 space-y-4">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-205">Update Password Key</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                        <div className="space-y-1.5">
                          <label className="text-slate-500">Current Password</label>
                          <input
                            type="password"
                            value={curPass}
                            onChange={(e) => setCurPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-500">New Secure Password</label>
                          <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-500">Confirm Password</label>
                          <input
                            type="password"
                            value={confPass}
                            onChange={(e) => setConfPass(e.target.value)}
                            placeholder="Repeat new keys"
                            className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-slate-800 px-3.5 py-3 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2FA Toggle switch */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] flex items-center gap-1.5">
                          🛡️ Two-Factor Authentication (2FA) Setup
                          {tfaEnabled && <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-555 px-1.5 py-0.5 rounded uppercase">ACTIVE</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-450">
                          Adds an extra Layer of visual security check. Approves login attempts via registered mobile OTP.
                        </p>
                      </div>

                      {/* Custom toggle button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !tfaEnabled;
                          setTfaEnabled(nextVal);
                          onAddActivityLog(`Toggled Two-Factor authentication parameter to ${nextVal.toString().toUpperCase()}`);
                          triggerToast(nextVal ? "🛡️ 2FA Activated successfully! You will request OTP vectors next authorization." : "⚠️ Two-Factor constraints disabled.");
                        }}
                        className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer flex items-center ${tfaEnabled ? 'bg-gradient-to-r from-emerald-500 to-green-500 justify-end' : 'bg-neutral-305 dark:bg-slate-800 justify-start'}`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
                      </button>
                    </div>

                  </div>

                  {/* SECTION 4: Notification Preferences */}
                  <div className="bg-[#F8FAFC] dark:bg-[#111827]/40 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#A855F7] flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-violet-500" />
                      <span>4. Notification Preferences Settings</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      
                      <label className="flex items-start gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={prefOrder}
                          onChange={(e) => setPrefOrder(e.target.checked)}
                          className="w-4.5 h-4.5 mt-0.5 rounded text-indigo-600 focus:ring-0 border-neutral-300 dark:border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Order & Purchase Receipts</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Send PDF transaction copies instantly via registered communications email box.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={prefMilestone}
                          onChange={(e) => setPrefMilestone(e.target.checked)}
                          className="w-4.5 h-4.5 mt-0.5 rounded text-indigo-600 focus:ring-0 border-neutral-300 dark:border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Project & Milestone Updates</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Alert when UI designers or backend developers push verified milestone updates.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={prefSupport}
                          onChange={(e) => setPrefSupport(e.target.checked)}
                          className="w-4.5 h-4.5 mt-0.5 rounded text-indigo-600 focus:ring-0 border-neutral-300 dark:border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Support Ticket Replies</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Trigger ping indicators when system administrative agents answer ticket chat queries.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={prefRenewal}
                          onChange={(e) => setPrefRenewal(e.target.checked)}
                          className="w-4.5 h-4.5 mt-0.5 rounded text-indigo-600 focus:ring-0 border-neutral-300 dark:border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Subscription & Renewal Alerts</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Send warnings 7 days prior to hosting core renewals, cPanel plans, or source code updates.</p>
                        </div>
                      </label>

                    </div>
                  </div>

                  {/* SECTION 5: Linked Social Accounts */}
                  <div className="bg-[#F8FAFC] dark:bg-[#111827]/40 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#A855F7] flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-505 animate-pulse" />
                      <span>5. Connected Social Accounts</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Google Gateway */}
                      <div className="p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center font-bold text-red-505">G</div>
                          <div>
                            <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">Google Connection</p>
                            <p className="text-[9px] text-[#10B981] font-bold">✓ Connected to Webzone Core</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (googleConnected && !githubConnected) {
                              triggerToast("⚠️ At least one connected authentication gateway is required!");
                              return;
                            }
                            const val = !googleConnected;
                            setGoogleConnected(val);
                            onAddActivityLog(`Toggled Google single sign-on connection to ${val}`);
                            triggerToast(val ? "✓ Successfully verified Google link" : "🗑️ Disconnected Google oauth authentication.");
                          }}
                          className={`px-3 py-1 text-[10px] font-black rounded-lg transition ${googleConnected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-neutral-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                        >
                          {googleConnected ? 'Disconnect' : 'Connect Account'}
                        </button>
                      </div>

                      {/* GitHub Gateway */}
                      <div className="p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white border border-slate-700/60 flex items-center justify-center font-bold">Git</div>
                          <div>
                            <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">GitHub Developer Platform</p>
                            <p className="text-[9px] text-slate-400">{githubConnected ? '✓ Authenticated API linked' : 'No credential keys linked'}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (githubConnected && !googleConnected) {
                              triggerToast("⚠️ At least one connected authentication gateway is required!");
                              return;
                            }
                            const val = !githubConnected;
                            setGithubConnected(val);
                            onAddActivityLog(`Toggled GitHub single sign-on connection to ${val}`);
                            triggerToast(val ? "✓ Successfully authorized secure GitHub linkage" : "🗑️ Removed GitHub single-sign on permissions.");
                          }}
                          className={`px-3 py-1 text-[10px] font-black rounded-lg transition ${githubConnected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-[#E0E7FF] dark:bg-slate-800 text-indigo-650 dark:text-slate-205'}`}
                        >
                          {githubConnected ? 'Disconnect' : 'Connect Account'}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Submission and Saving Actions */}
                  <div className="pt-4 flex items-center justify-between border-t border-neutral-100 dark:border-slate-800/80">
                    <p className="text-[10px] text-slate-400 dark:text-slate-450 italic font-medium">
                      🔒 Secured via SHA-256 cloud container algorithms
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#6366F1] dark:to-[#8B5CF6] hover:brightness-110 text-white font-extrabold rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200"
                    >
                      {language === 'bn' ? 'সেভ সেটিংস 💾' : 'Save Profile Configs 💾'}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 11.🛠️ VENDOR MODULE: (Admin view) */}
            {activeTab === 'vendor' && canAccessVendor && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                <div className="lg:col-span-1 space-y-4 text-left">
                  <div className="bg-gradient-to-tr from-cyan-500/15 to-blue-500/5 p-5 rounded-3xl border border-slate-800 text-white space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Vendor Commission splits records</h4>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Unsettled Commissions Ledger:</span>
                      <span className="text-2xl font-black font-mono text-white">$1,850.00</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-2 bg-slate-900/60 rounded">
                        <span>Splits ratio:</span>
                        <span className="text-emerald-400 block font-bold">80% Contractor</span>
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded">
                        <span>Direct orders mapped:</span>
                        <span className="text-[#06B6D4] block font-bold">42 downloads</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4">
                  <h3 className="text-base font-extrabold text-[#06B6D4]">Upload New Premium Script Catalog</h3>
                  <form onSubmit={handleVendorProductSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="">Script Name Title</label>
                        <input
                          type="text"
                          required
                          value={vendorProdName}
                          onChange={(e) => setVendorProdName(e.target.value)}
                          placeholder="e.g. BDPost premium SaaS Solution"
                          className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-800 p-2.5 rounded-xl text-neutral-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="">Rate ($ USD)</label>
                          <input
                            type="number"
                            required
                            min="5"
                            value={vendorProdPrice}
                            onChange={(e) => setVendorProdPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-800 p-2.5 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="">Port category</label>
                          <select
                            value={vendorProdCategory}
                            onChange={(e) => setVendorProdCategory(e.target.value as any)}
                            className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-800 p-2.5 rounded-xl focus:outline-none text-neutral-900 dark:text-white"
                          >
                            <option value="php">PHP Script</option>
                            <option value="wordpress">WordPress Theme</option>
                            <option value="laravel">Laravel Framework</option>
                            <option value="mobile">Kotlin/Java WebView</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 font-semibold">
                      <label className="">Product features details description</label>
                      <textarea
                        required
                        rows={3}
                        value={vendorProdDesc}
                        onChange={(e) => setVendorProdDesc(e.target.value)}
                        placeholder="Explain technical configurations parameters..."
                        className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-800 p-2.5 rounded-xl text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    {/* CUSTOM PRODUCT THUMBNAIL FILE INPUT WITH IMAGE PREVIEW */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">Custom Product Image Thumbnail (Optional)</label>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                          <div 
                            className="border-2 border-dashed border-slate-705 dark:border-slate-800 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors relative"
                            onClick={() => document.getElementById('vendor-thumbnail-input')?.click()}
                          >
                            <input
                              type="file"
                              id="vendor-thumbnail-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setVendorProdImageFile(file);
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setVendorProdImage(reader.result as string);
                                    triggerToast("📸 Core thumbnail loaded successfully!");
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="space-y-1">
                              <span className="block text-[#06B6D4] font-bold text-[11px]">Click to upload product graphic asset</span>
                              <span className="block text-[9px] text-neutral-400">Supports PNG, JPG, WEBP formats</span>
                            </div>
                          </div>
                        </div>

                        {vendorProdImage && (
                          <div className="w-24 h-24 rounded-xl border border-slate-705 dark:border-slate-800 overflow-hidden relative group shrink-0 shadow bg-slate-900/60 flex items-center justify-center">
                            <img 
                              src={vendorProdImage} 
                              alt="New Product Preview" 
                              className="w-full h-full object-cover" 
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVendorProdImage('');
                                setVendorProdImageFile(null);
                                triggerToast("Reset thumbnail placeholder.");
                              }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer"
                    >
                      Publish Item in WebzoneBD Live Digital Store Catalog
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 12.🛡️ STAFF MODULE: (Admin view) */}
            {activeTab === 'staff' && canAccessStaff && (
              <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="pb-3 border-b border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="text-base font-extrabold text-purple-400">Assigned Pending Support Tickets Queue ({tickets.length})</h3>
                    <p className="text-xs text-neutral-400">System management clearance Level_2 active.</p>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-slate-800 space-y-4">
                  {tickets.map((tk) => (
                    <div key={tk.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                      <p className="font-extrabold text-neutral-900 dark:text-white">{tk.subject}</p>
                      <p className="text-neutral-450 font-mono text-[10px]">Reference: {tk.id} • Assigned Staff: Lead Moderator • SLA Priority: {tk.priority.toUpperCase()}</p>
                      <button
                        onClick={() => {
                          setActiveTab('tickets');
                          setActiveTicketForChat(tk);
                        }}
                        className="text-xs text-emerald-500 font-black hover:underline"
                      >
                        Enter Live Engineering Chat Thread →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* ⚡ 'Quick Actions' Floating Action Button & Menu */}
            {user?.role !== 'admin' && user?.role !== 'super_admin' && (
              <div className="fixed bottom-20 md:bottom-6 right-6 z-45 font-sans">
                <div className="relative">
                  {/* Backdrop overlay when open to easily dismiss */}
                  {quickActionsOpen && (
                    <div 
                      className="fixed inset-0 bg-transparent z-0" 
                      onClick={() => setQuickActionsOpen(false)}
                    />
                  )}

                  {/* Floating Menu Card */}
                  {quickActionsOpen && (
                    <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xl p-4 space-y-2.5 z-10 animate-in fade-in slide-in-from-bottom-5 duration-250 text-left">
                      <div className="pb-2 border-b border-neutral-100 dark:border-slate-800/80">
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase flex items-center gap-1.5">
                          <span className="text-amber-500">⚡</span> Quick Actions Control
                        </h4>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal mt-0.5">Instant redirects to hot features</p>
                      </div>

                      <div className="space-y-1.5">
                        {/* 1. Create New Support Ticket */}
                        <button
                          onClick={() => {
                            setActiveTab('create-ticket');
                            setExpandedMenu('tickets');
                            setQuickActionsOpen(false);
                            onAddActivityLog('Used Quick Actions floating menu to access Create New Support Ticket');
                            triggerToast('Redirected to: Create New Support Ticket');
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-[#111827] flex items-center gap-3 transition cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-300"
                        >
                          <div className="p-1.5 bg-[#7C3AED]/15 text-[#7C3AED] rounded-md">
                            <Ticket className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <p className="truncate">Create Ticket 🎫</p>
                            <span className="text-[9px] text-neutral-450 font-mono block">Technical Helpdesk SLA</span>
                          </div>
                        </button>

                        {/* 2. Add Wallet Funds */}
                        <button
                          onClick={() => {
                            setActiveTab('billing');
                            setExpandedMenu('billing');
                            setQuickActionsOpen(false);
                            onAddActivityLog('Used Quick Actions floating menu to access Add Wallet Funds');
                            triggerToast('Redirected to: Pre-Fund Account Balance 💰');
                            setTimeout(() => {
                              const elem = document.getElementById('pre-fund-balance');
                              if (elem) {
                                elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 150);
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-[#111827] flex items-center gap-3 transition cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-300"
                        >
                          <div className="p-1.5 bg-[#14B8A6]/15 text-[#14B8A6] rounded-md">
                            <Wallet className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <p className="truncate">Add Wallet Funds 💰</p>
                            <span className="text-[9px] text-neutral-450 font-mono block">Deposit automated WHMCS</span>
                          </div>
                        </button>

                        {/* 3. View Latest Downloads */}
                        <button
                          onClick={() => {
                            setActiveTab('downloads');
                            setExpandedMenu('downloads');
                            setQuickActionsOpen(false);
                            onAddActivityLog('Used Quick Actions floating menu to access View Latest Downloads');
                            triggerToast('Redirected to: Genuine Script Downloads');
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-[#111827] flex items-center gap-3 transition cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-300"
                        >
                          <div className="p-1.5 bg-[#2563EB]/15 text-[#2563EB] rounded-md">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <p className="truncate">View Downloads ⬇️</p>
                            <span className="text-[9px] text-neutral-450 font-mono block">Access genuine code ZIPs</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Floating Action Button (FAB) Trigger */}
                  <button
                    onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                    style={{ minWidth: '48px', minHeight: '48px' }}
                    className="relative group p-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white flex items-center justify-center shadow-xl hover:shadow-[#2563EB]/20 hover:scale-[1.08] transition-all duration-300 z-10 active:scale-95 cursor-pointer border border-white/10"
                    title="Quick Actions Menu Launcher"
                  >
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                    <Plus className={`w-5 h-5 transition-transform duration-300 z-10 ${quickActionsOpen ? 'rotate-45' : ''}`} />
                    
                    {/* Small decorative notification glow dot */}
                    {!quickActionsOpen && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white dark:border-[#1E293B] shadow-sm z-20">
                        <span className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 🧾 Spectacular Invoice Modal overlay view */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div id="print-area-invoice" className="bg-white text-neutral-900 dark:bg-[#111827] dark:text-neutral-100 max-w-2xl w-full rounded-3xl border border-neutral-200 dark:border-slate-850 shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all max-h-[90vh] overflow-y-auto">
            
            {/* Ambient accent background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2563EB]/10 to-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header / Brand details */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-150 dark:border-slate-800 pb-6 mb-6">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold tracking-wider text-xl uppercase">WEBZONEBD</span>
                  <span className="text-cyan-500 font-bold tracking-wide text-sm font-mono ml-1.5">IT Solution</span>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-relaxed font-sans max-w-sm">
                    Premium Smart Digital Solutions, Custom Software Engineering & Secure Web Cloud Infrastructure services.
                  </p>
                </div>
                <div className="text-left sm:text-right font-sans">
                  <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 font-mono text-[9px] uppercase font-black">
                    {language === 'bn' ? 'অফিসিয়াল অর্ডার মেমো' : 'OFFICIAL INVOICE'}
                  </span>
                  <p className="text-xs font-black text-neutral-900 dark:text-white mt-3">Invoice Ref: <b className="font-mono text-blue-600 dark:text-cyan-400">{getOrderSerial(selectedInvoice.id)}</b></p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-1">Date: {selectedInvoice.date}</p>
                  <p className={`text-[10px] font-black font-mono mt-0.5 uppercase ${
                    selectedInvoice.paymentStatus === 'completed'
                      ? 'text-emerald-500'
                      : selectedInvoice.paymentStatus === 'pending'
                        ? 'text-amber-505'
                        : 'text-rose-500'
                  }`}>
                    Status: {selectedInvoice.paymentStatus === 'completed' ? (language === 'bn' ? 'পরিশোধিত (Paid)' : 'Completed (Paid)') : selectedInvoice.paymentStatus === 'pending' ? (language === 'bn' ? 'অপেক্ষমান (Pending)' : 'Awaiting Payment') : (language === 'bn' ? 'বাতিলকৃত (Failed)' : 'Transaction Failed')}
                  </p>
                </div>
              </div>

              {/* Client and Gateway specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-neutral-150 dark:border-slate-800 pb-6 mb-6 text-xs leading-relaxed">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2 font-black">
                    {language === 'bn' ? 'গ্রাহকের বিবরণী:' : 'BILL TO CUSTOMER:'}
                  </p>
                  <p className="font-extrabold text-neutral-900 dark:text-white text-sm">{profileName}</p>
                  <p className="text-neutral-500 dark:text-slate-400 mt-1 font-mono">{profileEmail}</p>
                  <p className="text-neutral-500 dark:text-slate-400 mt-0.5 font-mono">WhatsApp: {profileWhatsApp}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2 font-black">
                    {language === 'bn' ? 'লেনদেনের বিবরণী:' : 'TRANSACTION DETAILS:'}
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold mt-1">
                    {language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'} <span className="text-blue-600 dark:text-cyan-405 font-black uppercase font-mono">{selectedInvoice.paymentMethod}</span>
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1 text-[11px]">
                    GPL Legal License: <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Authorized GPL Sandbox</span>
                  </p>
                </div>
              </div>

              {/* ORDER ASSETS DOWNLOAD SECTION (IF COMPLETED/PAID) */}
              {selectedInvoice.paymentStatus === 'completed' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-emerald-600 dark:text-teal-400 font-mono uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {language === 'bn' ? 'ডাউনলোড লিংক প্রস্তুত' : 'DIGITAL ASSETS READY'}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <span>{language === 'bn' ? 'অনুমোদিত জিপ কোড ফাইল ডাউনলোড' : 'Authorized ZIP Source Code'}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {language === 'bn' ? 'লাইসেন্স কি এবং কমপ্লিট সোর্স কোড ইনক্লুডেড।' : 'Full package, GPL keys, and configuration deployment scripts.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleScriptDownload(selectedInvoice)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer text-xs shrink-0"
                  >
                    <Download className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
                    <span>{language === 'bn' ? 'ZIP ডাউনলোড করুন' : 'Download ZIP Archive'}</span>
                  </button>
                </div>
              )}

              {/* Bill Details products table */}
              <div className="mb-5 text-left">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2.5 font-black">
                  {language === 'bn' ? 'অর্ডারকৃত আইটেম:' : 'PURCHASED LINE ITEM:'}
                </p>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-slate-800 text-neutral-400 font-mono text-[9px] uppercase tracking-wider">
                      <th className="py-2.5">{language === 'bn' ? 'প্রোডাক্ট / স্ক্রিপ্ট নাম' : 'Software Solution / Script Asset'}</th>
                      <th className="py-2.5 text-right font-mono">{language === 'bn' ? 'মূল্য' : 'Licensed Rate'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="py-3 pr-4">
                        <p className="font-black text-neutral-900 dark:text-white text-xs">{selectedInvoice.itemTitle}</p>
                        <p className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
                          {language === 'bn' ? 'সাপোর্ট অ্যাক্সেস • লাইফটাইম ফ্রি আপডেট' : 'Verified Digital Product Delivery • GPL Full Setup Included'}
                        </p>
                      </td>
                      <td className="py-3 text-right font-mono font-black text-sm text-neutral-900 dark:text-white">
                        {/* Calculate derived prices dynamically based on exact formula */}
                        {(() => {
                          const taxRate = 0.15;
                          const discountRate = 0.20;
                          const basePrice = selectedInvoice.price / ((1 - discountRate) * (1 + taxRate));
                          return formatPrice(basePrice);
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial summaries featuring precise derived Taxes, Discounts, and subtotal */}
              {(() => {
                const taxRate = 0.15; // 15% VAT
                const discountRate = 0.20; // 20% Discount
                
                // basePrice before coupon was applied
                const basePrice = selectedInvoice.price / ((1 - discountRate) * (1 + taxRate));
                const discountAmount = basePrice * discountRate;
                const subtotalValue = basePrice - discountAmount;
                const taxAmount = subtotalValue * taxRate;
                const couponCode = getOrderSerial(selectedInvoice.id).toUpperCase().replace('ORD-', 'WZB-WELCOME-');

                return (
                  <div className="bg-neutral-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-neutral-150 dark:border-slate-800 space-y-3 text-xs text-left">
                    
                    {/* Raw original price */}
                    <div className="flex justify-between font-mono text-neutral-500 dark:text-slate-400">
                      <span>{language === 'bn' ? 'সাধারণ লেভেল প্রাইস:' : 'Base Retail Price:'}</span>
                      <span className="line-through">{formatPrice(basePrice)}</span>
                    </div>

                    {/* Applied coupon discount */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-neutral-500 dark:text-slate-400 font-medium">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        <span>{language === 'bn' ? 'প্রযুক্ত কুপন ডিসকাউন্ট:' : 'Applied Promo Coupon:'}</span>
                        <span className="bg-blue-150 text-[#2563EB] dark:bg-blue-500/10 dark:text-cyan-404 text-[10px] px-2 py-0.5 rounded font-mono font-black uppercase">
                          {couponCode}
                        </span>
                      </span>
                      <span className="font-mono text-emerald-500 font-extrabold">
                        -{formatPrice(discountAmount)} (-20%)
                      </span>
                    </div>

                    {/* Subtotal after discount */}
                    <div className="flex justify-between font-mono text-neutral-600 dark:text-slate-300 border-t border-neutral-100 dark:border-slate-800/60 pt-2.5">
                      <span>{language === 'bn' ? 'ডিসকাউন্টেড সাব-টোটাল:' : 'Discounted Subtotal:'}</span>
                      <span>{formatPrice(subtotalValue)}</span>
                    </div>

                    {/* Government tax and IT service VAT */}
                    <div className="flex justify-between text-neutral-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        {language === 'bn' ? 'সরকারি ভ্যাট ও আইটি সার্ভিস ট্যাক্স (১৫%):' : 'Government VAT & IT service tax (15%):'}
                        <span className="cursor-help text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-1 rounded-full font-mono font-bold" title="Applied according to modern digital commerce standards.">i</span>
                      </span>
                      <span className="font-mono">+{formatPrice(taxAmount)}</span>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between font-mono font-black border-t border-neutral-250 dark:border-slate-800 pt-3 text-neutral-950 dark:text-white text-sm">
                      <span className="text-xs uppercase tracking-wider">{language === 'bn' ? 'প্যাকেজের মোট মূল্য:' : 'Total Package Price:'}</span>
                      <span className="text-neutral-900 dark:text-white text-base font-extrabold">{formatPrice(selectedInvoice.price)}</span>
                    </div>

                    {selectedInvoice.advancePercent !== undefined && selectedInvoice.advancePercent < 100 && (
                      <div className="pt-2.5 border-t border-dashed border-neutral-250 dark:border-slate-800 space-y-2.5">
                        <div className="flex justify-between font-mono font-bold text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {language === 'bn' ? `অগ্রিম পরিশোধিত (${selectedInvoice.advancePercent}%):` : `Paid Advance (${selectedInvoice.advancePercent}%):`}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">
                            {formatPrice(selectedInvoice.advanceAmount || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between font-mono font-bold text-xs">
                          <span className="text-amber-500">
                            {language === 'bn' ? 'বকেয়া বাকি (Remaining Due):' : 'Remaining Due Amount:'}
                          </span>
                          <span className="text-amber-500 text-sm font-extrabold">
                            {formatPrice(selectedInvoice.dueAmount || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Close Controls */}
            <div className="mt-8 flex justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-neutral-210 dark:border-slate-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-neutral-900 dark:text-white text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'bn' ? 'প্রিন্ট মেমো 🖨️' : 'Print Memo 🖨️'}</span>
              </button>
              <button
                type="button"
                onClick={() => generateVisualPDFInvoice(selectedInvoice!)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ডাউনলোড পিডিএফ 📥' : 'Download PDF Invoice 📥'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-black rounded-lg transition duration-205 cursor-pointer font-sans shadow-md"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Details'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EMERGENCY SUPPORT TICKET CREATION INTERFACE */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-slate-800 animate-in zoom-in duration-200 text-left">
            <div className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-200 font-extrabold">WebzoneBD support ticket</span>
                <h3 className="text-base font-extrabold">Open Technical Investigation</h3>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="p-1 px-2 text-xs bg-slate-800 rounded font-mono text-white cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-neutral-400 font-bold uppercase tracking-wider block font-mono text-[9px]">Ticket Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Domain cPanel SSL handshake failed"
                  className="w-full bg-neutral-100 dark:bg-slate-950 p-2.5 rounded-xl text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 font-bold uppercase tracking-wider block font-mono text-[9px]">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full bg-neutral-100 dark:bg-slate-950 p-2.5 rounded-xl text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="low">Low - General Information</option>
                  <option value="medium">Medium - Design issue</option>
                  <option value="high">High - Production server offline urgency</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 font-bold uppercase tracking-wider block font-mono text-[9px]">Server log credentials parameters</label>
                <textarea
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={4}
                  placeholder="Paste details logs parameters or port setups..."
                  className="w-full bg-neutral-100 dark:bg-slate-955 p-2.5 rounded-xl text-neutral-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black rounded-xl uppercase text-xs cursor-pointer"
              >
                Submit support ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ⭐ DIGITAL PRODUCT FEEDBACK & RATING MODAL */}
      {ratingOrderModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="feedback-rating-modal-container">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-slate-800 animate-in zoom-in duration-200 text-left">
            <div className="bg-gradient-to-r from-amber-500 to-indigo-600 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-200 font-extrabold">
                  {language === 'bn' ? 'ডিজিটাল প্রোডাক্ট রিভিউ ও রেটিং' : 'Digital Product Feedback Center'}
                </span>
                <h3 className="text-base font-extrabold">
                  {language === 'bn' ? 'আপনার সোর্স কোড রেটিং দিন' : 'Rate Your Source Code / Script'}
                </h3>
              </div>
              <button
                onClick={() => setRatingOrderModalId(null)}
                className="p-1 px-2 text-xs bg-slate-900 rounded-lg hover:bg-slate-800 font-mono text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <p className="text-xs text-slate-505 dark:text-slate-400 leading-normal font-medium">
                {language === 'bn' 
                  ? 'আপনার অর্ডারকৃত ডিজিটাল স্ক্রিপ্ট বা সোর্স কোডের ডেভেলপমেন্ট কোয়ালিটি এবং ফিচার রেটিং দিন। আপনার মতামত আমাদের সার্ভিস উন্নত করতে সাহায্য করবে।'
                  : 'Let other developers know about your experience. Your feedback will calculate and update the primary product rating schema immediately.'
                }
              </p>

              {/* Star Rating Controls */}
              <div className="space-y-2">
                <label className="text-neutral-400 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono text-[9px]">
                  {language === 'bn' ? 'রেটিং (তারকা চিহ্ন নির্বাচন করুন)' : 'Product Rating Level'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    >
                      <span className={star <= ratingStars ? "text-amber-500 font-sans" : "text-neutral-300 dark:text-slate-700 font-sans"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                    {ratingStars} / 5 {language === 'bn' ? 'তারকা' : 'Stars'}
                  </span>
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-1.5">
                <label className="text-neutral-400 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono text-[9px]">
                  {language === 'bn' ? 'আপনার মন্তব্য লিখুন' : 'Short Developer Comment / Review'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: চমৎকার কোড স্ট্রাকচার, চমৎকার পেমেন্ট ইন্টিগ্রেশন!' : 'e.g. Excellent modular code, very easy setup process with custom db schemas.'}
                  className="w-full bg-neutral-100 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-3 rounded-xl text-neutral-900 dark:text-white focus:outline-none resize-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingOrderModalId(null)}
                  className="flex-1 py-2.5 bg-neutral-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-xl uppercase text-xs cursor-pointer hover:bg-neutral-200 dark:hover:bg-slate-700 transition"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const matchedOrder = orders.find(o => o.id === ratingOrderModalId) || { id: ratingOrderModalId, itemTitle: "WHMCS Automated bKash & Rocket Premium Integration Script" };
                    if (onUpdateProductRating) {
                      onUpdateProductRating(matchedOrder.itemTitle, ratingStars, ratingComment);
                    }
                    saveFeedback(ratingOrderModalId!, ratingStars, ratingComment);
                    triggerToast(language === 'bn' ? "পণ্য রেটিং সফলভাবে হালনাগাদ করা হয়েছে! ধন্যবাদ!" : "Digital product rating submitted! Average score updated.");
                    setRatingOrderModalId(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-black rounded-xl uppercase text-xs cursor-pointer hover:scale-[1.01] active:scale-95 transition"
                >
                  {language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Localized Deletion Safety Dialogue for Orders */}
      {deleteConfirmOrder.isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-neutral-900 dark:text-white shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Red accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-650 via-rose-500 to-orange-500" />
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5 flex-1 w-full text-left">
                <h4 className="text-sm font-black tracking-tight uppercase font-sans text-red-600 dark:text-red-400">
                  {language === 'bn' ? 'অর্ডার মুছে ফেলবেন?' : 'Delete Order?'}
                </h4>
                <p className="text-xs opacity-75 leading-relaxed font-sans mt-1">
                  {language === 'bn' 
                    ? `আপনি কি নিশ্চিত যে আপনি অর্ডার #${deleteConfirmOrder.orderId} ("${deleteConfirmOrder.itemTitle}") মুছে ফেলতে চান?`
                    : `Are you sure you want to delete Order #${deleteConfirmOrder.orderId} ("${deleteConfirmOrder.itemTitle}")?`
                  }
                </p>
                <p className="text-xs font-semibold text-rose-500 dark:text-rose-450 mt-1">
                  {language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'you ar sure ?'}
                </p>
                <span className="text-[10px] text-red-500 font-semibold block bg-red-500/5 px-2 py-1 rounded border border-red-500/10 mt-2 font-mono">
                  🚨 {language === 'bn' ? 'এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'This action cannot be undone.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOrder({ isOpen: false, orderId: null, itemTitle: '' })}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {language === 'bn' ? 'না, রাখুন' : 'No, Keep'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmOrder.orderId && deleteOrder) {
                    deleteOrder(deleteConfirmOrder.orderId);
                    triggerToast(language === 'bn' 
                      ? `🗑️ অর্ডার #${deleteConfirmOrder.orderId} সফলভাবে মুছে ফেলা হয়েছে।`
                      : `🗑️ Order #${deleteConfirmOrder.orderId} successfully deleted.`
                    );
                    onAddActivityLog(`Deleted purchase receipt for Order #${deleteConfirmOrder.orderId}`);
                  }
                  setDeleteConfirmOrder({ isOpen: false, orderId: null, itemTitle: '' });
                }}
                className="px-4 py-1.5 text-xs font-black bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {language === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 Interactive Order Notes Modal */}
      {editingNotesOrder && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-neutral-900 dark:text-white shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Top decorative gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-600" />
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-neutral-150 dark:border-slate-800">
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-black tracking-tight uppercase flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <ShoppingCart className="w-4 h-4 text-amber-500" />
                  <span>{language === 'bn' ? 'অর্ডার নোটস' : 'Order Notes'}</span>
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-slate-400">
                  {language === 'bn' ? `অর্ডার আইডি: #${getOrderSerial(editingNotesOrder.id)}` : `Order ID: #${getOrderSerial(editingNotesOrder.id)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingNotesOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="py-4 space-y-4 text-left">
              <div className="bg-neutral-50 dark:bg-slate-900/50 p-3 rounded-xl border border-neutral-150 dark:border-slate-800/60">
                <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">
                  {language === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Item'}
                </span>
                <span className="text-xs font-bold text-neutral-800 dark:text-slate-200 block">
                  {editingNotesOrder.itemTitle}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-neutral-500 dark:text-slate-450 tracking-wider flex items-center gap-1">
                  <span>📝</span>
                  <span>{language === 'bn' ? 'স্পেশাল নোট / নির্দেশনা' : 'Special Notes / Instructions'}</span>
                </label>
                <textarea
                  rows={5}
                  value={tempNotesText}
                  onChange={(e) => setTempNotesText(e.target.value)}
                  placeholder={language === 'bn' ? 'এখানে আপনার অর্ডারের বিশেষ নির্দেশনা বা তথ্য লিখুন...' : 'Write custom order notes, hosting choices, domain setups or specific details...'}
                  className="w-full text-xs sm:text-sm font-semibold bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] p-3.5 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-650 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingNotesOrder(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingNotesOrder.id && onUpdateOrders) {
                    const updated = orders.map(o => o.id === editingNotesOrder.id ? { ...o, orderNotes: tempNotesText } : o);
                    onUpdateOrders(updated);
                    triggerToast(language === 'bn' ? 'অর্ডার নোট সফলভাবে সংরক্ষণ করা হয়েছে।' : 'Order notes successfully saved.');
                    onAddActivityLog(`Updated notes for Order #${editingNotesOrder.id}`);
                  } else {
                    triggerToast(language === 'bn' ? 'ত্রুটি: আপডেট করা সম্ভব হয়নি।' : 'Error: Unable to update order notes.');
                  }
                  setEditingNotesOrder(null);
                }}
                className="px-5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
