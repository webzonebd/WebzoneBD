import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, Clock, CreditCard, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, Truck, RefreshCw, ArrowUpDown, ShieldCheck, ExternalLink, 
  Copy, MessageCircle, HelpCircle, Inbox, Tag, Award, Sparkles, Plus,
  X, Download, Printer, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Language, Currency, UserSession } from '../types';
import OrderProjectChat from './OrderProjectChat';

interface UserOrderHistoryProps {
  orders: Order[];
  language: Language;
  currency: Currency;
  formatPrice: (usd: number) => string;
  user: UserSession | null;
  triggerToast: (msg: string) => void;
  onSeedDemoOrders?: () => void;
  onUpdateOrders?: (newOrders: Order[]) => void;
}

export default function UserOrderHistory({
  orders,
  language,
  currency,
  formatPrice,
  user,
  triggerToast,
  onSeedDemoOrders,
  onUpdateOrders
}: UserOrderHistoryProps) {
  // Helper to standardise Order IDs sequentially to e.g., Order-101, Order-102, Order-103
  const getOrderSerial = (orderId: string) => {
    if (orderId && orderId.startsWith('Order-')) return orderId;
    const idx = orders.findIndex(o => o.id === orderId);
    return idx !== -1 ? `Order-${101 + idx}` : (orderId || 'Order-101');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [payStatusFilter, setPayStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'>('date-desc');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [modalTab, setModalTab] = useState<'invoice' | 'chat'>('invoice');
  const [activeHistoryChatOrder, setActiveHistoryChatOrder] = useState<Order | null>(null);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState<string | null>(null);

  // Translate labels dynamically supporting English, Bengali, and Arabic
  const t = {
    title: {
      en: 'Track Orders & Status Hub',
      bn: 'অর্ডার ট্র্যাকিং ও ইতিহাস',
      ar: 'مركز تتبع الطلبات وحالتها'
    },
    subtitle: {
      en: 'Monitor real-time fulfillment progress, download credentials, and view payment ledgers.',
      bn: 'অর্ডারের রিয়েল-টাইম অগ্রগতি পর্যবেক্ষণ করুন, ক্রেডেনশিয়াল ডাউনলোড করুন এবং পেমেন্ট লেজার দেখুন।',
      ar: 'راقب تقدم الطلبات في الوقت الفعلي، وقم بتنزيل بيانات الاعتماد، واطلع على فواتير الدفع.'
    },
    searchPlaceholder: {
      en: 'Search by Product Name, Order ID or Gateway...',
      bn: 'প্রোডাক্টের নাম, অর্ডার আইডি বা গেটওয়ে দিয়ে খুঁজুন...',
      ar: 'البحث عن طريق اسم المنتج أو معرف الطلب...'
    },
    all: { en: 'All Statuses', bn: 'সব অবস্থা', ar: 'كل الحالات' },
    payStatus: { en: 'Payment Status', bn: 'পেমেন্ট অবস্থা', ar: 'حالة الدفع' },
    deliveryStatus: { en: 'Delivery Status', bn: 'ডেলিভারি অবস্থা', ar: 'حالة التوصيل' },
    sortByLabel: { en: 'Sort By', bn: 'সাজানোর ধরণ', ar: 'ترتيب حسب' },
    dateDesc: { en: 'Newest Date First', bn: 'সর্বশেষ আগে', ar: 'الأحدث أولاً' },
    dateAsc: { en: 'Oldest Date First', bn: 'সর্বপ্রথম আগে', ar: 'الأقدم أولاً' },
    priceDesc: { en: 'Price: High to Low', bn: 'মূল্য: বেশি থেকে কম', ar: 'السعر: من الأعلى للأقل' },
    priceAsc: { en: 'Price: Low to High', bn: 'মূল্য: কম থেকে বেশি', ar: 'السعر: من الأقل للأعلى' },
    noOrders: {
      en: 'No verified order records found on your profile.',
      bn: 'আপনার প্রোফাইলে কোনো অর্ডার রেকর্ড পাওয়া যায়নি।',
      ar: 'لم يتم العثور على أي سجلات طلبات تم تفعيلها في ملفك الشخصي.'
    },
    noOrdersDesc: {
      en: "Buy software packages from our Digital Store or log in to see your orders.",
      bn: 'আমাদের ডিজিটাল স্টোর থেকে আইটি সার্ভিস বা স্ক্রিপ্ট ক্রয় করুন অথবা অর্ডার দেখতে লগইন করুন।',
      ar: 'اشترِ حزم البرامج من متجرنا الرقمي أو قم بتسجيل الدخول لمشاهدة طلباتك.'
    },
    generateDemo: {
      en: 'Generate Premium Demo Orders',
      bn: 'প্রিমিয়াম ডেমো অর্ডার তৈরি করুন',
      ar: 'إنشاء طلبات تجريبية مميزة'
    },
    orderIdLabel: { en: 'Order ID', bn: 'অর্ডার নম্বর', ar: 'رقم التعريف' },
    dateLabel: { en: 'Date Placed', bn: 'অর্ডারের তারিখ', ar: 'تاريخ الطلب' },
    expectedDelivery: { en: 'Expected Delivery', bn: 'সম্ভাব্য ডেলিভারি', ar: 'التسليم المتوقع' },
    completedDate: { en: 'Fulfillment Completed', bn: 'ডেলিভারি সম্পন্ন', ar: 'اكتمل التسليم' },
    notDispatched: { en: 'Fulfillment Standby', bn: 'ডেলিভারি প্রক্রিয়াধীন', ar: 'انتظار الشحن' },
    trackingIdLabel: { en: 'Tracking Track ID', bn: 'প্যাকেজ ট্র্যাকিং আইডি', ar: 'معرف تتبع الشحنة' },
    payMethodLabel: { en: 'Payment Gateway', bn: 'পেমেন্ট গেটওয়ে', ar: 'بوابة الدفع' },
    subtotal: { en: 'Net Charged', bn: 'নেট চার্জ', ar: 'صافي الرسوم' },
    copySuccess: { en: 'Copied to clipboard!', bn: 'ক্লিপবোর্ডে কপি হয়েছে!', ar: 'تم النسخ إلى الحافظة!' },
    supportLink: { en: 'Request Live Assistance', bn: 'সরাসরি সহায়তা প্রয়োজন', ar: 'طلب مساعدة مباشرة' },
    downloadProduct: { en: 'Download Project Assets/Files', bn: 'প্রজেক্ট ফাইল ডাউনলোড', ar: 'تنزيل ملفات ومحتويات المشروع' },
    viewInvoiceDetail: {
      en: '🧾 Invoice',
      bn: '🧾 রসিদ দেখুন',
      ar: '🧾 الفاتورة'
    },
    viewPrintInvoice: {
      en: 'View & Print Detailed Invoice',
      bn: 'ইনভয়েস বিবরণ ও রসিদ মুদ্রণ',
      ar: 'عرض وطباعة تفاصيل الفاتورة'
    },
    trackingSteps: {
      placed: { en: 'Order Received', bn: 'অর্ডার ও পেমেন্ট প্রাপ্ত', ar: 'تم استلام الطلب' },
      processing: { en: 'Development Phase', bn: 'ডেভেলপমেন্ট পর্যায়', ar: 'مرحلة التطوير' },
      shipped: { en: 'Assets Deployment', bn: 'ডেলিভারি সম্পন্ন', ar: 'نشر الملفات والبرامج' },
      delivered: { en: 'Fully Delivered & Active', bn: 'সফলভাবে এ্যাক্টিভ ও লাইভ', ar: 'نشط ومستلم بالكامل' }
    },
    stats: {
      totalOrders: { en: 'Cumulative Orders', bn: 'মোট অর্ডার সংখ্যা', ar: 'إجمالي الطلبات' },
      totalSpent: { en: 'Total Client Invested', bn: 'মোট পেমেন্ট পরিশোধ', ar: 'إجمالي المستثمر' },
      activeDelivery: { en: 'Active Deliveries', bn: 'চলতি ডেলিভারি', ar: 'شحنات قيد المعالجة' }
    }
  };

  // Safe Fallback translation retriever
  const l = (key: keyof typeof t) => {
    return t[key][language] || t[key]['en'];
  };

  // Helper check for nested translations
  const stepLabel = (step: 'placed' | 'processing' | 'shipped' | 'delivered') => {
    return t.trackingSteps[step][language] || t.trackingSteps[step]['en'];
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    triggerToast(l('copySuccess'));
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Compute stats based on actual orders
  const paidOrders = orders.filter(o => o.paymentStatus === 'completed');
  const countTotalOrders = orders.length;
  const countTotalSpent = paidOrders.reduce((sum, o) => sum + o.price, 0);
  const countActiveDeliveries = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;

  const handleLocalSeed = () => {
    if (onSeedDemoOrders) {
      onSeedDemoOrders();
      return;
    }

    // Default standalone seeding for local order persistence
    const dateToday = new Date().toISOString().split('T')[0];
    const dateMinus2 = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateMinus7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const demOrders: Order[] = [
      {
        id: 'WZD-' + Math.floor(100000 + Math.random() * 900000),
        itemTitle: 'Enterprise cPanel Cloud Hosting (Ultra Power Boost Plan)',
        price: 89.00,
        date: dateToday,
        paymentMethod: 'PipraPay Wallet API',
        paymentStatus: 'completed',
        trackingId: 'TRK-HOST-' + Math.floor(1000 + Math.random() * 9000),
        status: 'processing',
        transactionId: 'TXN-HOST-99120ASDF',
        downloadUrl: 'https://webzonebd.com/dl/boost-hosting-guide.pdf'
      },
      {
        id: 'WZD-' + Math.floor(100000 + Math.random() * 900000),
        itemTitle: 'Multi-Vendor E-Commerce Laravel Core Pro (Extended License)',
        price: 249.00,
        date: dateMinus2,
        paymentMethod: 'bKash Merchant Pay',
        paymentStatus: 'completed',
        trackingId: 'TRK-SOFT-' + Math.floor(1000 + Math.random() * 9000),
        status: 'shipped',
        transactionId: 'TXN-BKASH-7F12999',
        downloadUrl: 'https://github.com/webzonebd/ecommerce-core-pro'
      },
      {
        id: 'WZD-' + Math.floor(100000 + Math.random() * 900000),
        itemTitle: 'Custom SMS Gateway API Module & Integration Configuration',
        price: 45.00,
        date: dateMinus7,
        paymentMethod: 'Nagad Mobile SDK',
        paymentStatus: 'completed',
        trackingId: 'TRK-SMS-' + Math.floor(1000 + Math.random() * 9000),
        status: 'delivered',
        transactionId: 'TXN-NAGAD-D912E11',
        downloadUrl: 'https://webzonebd.com/dl/sms-module-dist.zip'
      }
    ];

    if (onUpdateOrders) {
      onUpdateOrders(demOrders);
      triggerToast('🎉 3 premium seed orders populated on your dashboard console!');
    } else {
      // Direct localStorage backup update
      const existing = orders.length > 0 ? orders : [];
      const merged = [...existing, ...demOrders];
      localStorage.setItem('webzone_orders', JSON.stringify(merged));
      triggerToast('🎉 Premium seed orders generated! Please click reload to capture.');
    }
  };

  // Expected Delivery Calculator based on order.date
  const getExpectedDeliveryText = (ord: Order) => {
    const oDate = new Date(ord.date);
    if (isNaN(oDate.getTime())) return '3-5 Working Days';

    if (ord.status === 'delivered') {
      const delDate = new Date(oDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      return delDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    // Still processing/shipped
    const daysToAdd = ord.status === 'shipped' ? 1 : 3;
    const estDate = new Date(oDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const dayStr = estDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const suffix = language === 'bn' ? ' (নিশ্চিত অগ্রগতি)' : language === 'ar' ? ' (تقدم مضمون)' : ' (Guaranteed Progress)';
    return dayStr + suffix;
  };

  // Core tracking stepper step numeric mapping helper
  const getFulfillmentStepValue = (status: Order['status'], payStatus: Order['paymentStatus']) => {
    if (status === 'delivered') return 3;
    if (status === 'shipped') return 2;
    if (status === 'processing' || payStatus === 'completed') return 1;
    return 0; // pending or failed
  };

  // Filter and Sort orders list array
  const processedOrders = orders
    .filter(ord => {
      // Search Box matcher
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ord.itemTitle.toLowerCase().includes(q);
        const matchesId = ord.id.toLowerCase().includes(q) || getOrderSerial(ord.id).toLowerCase().includes(q);
        const matchesGate = ord.paymentMethod.toLowerCase().includes(q);
        const matchesTrack = ord.trackingId?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesId && !matchesGate && !matchesTrack) {
          return false;
        }
      }

      // Payment Status filtering tab
      if (payStatusFilter !== 'all' && ord.paymentStatus !== payStatusFilter) {
        return false;
      }

      // Delivery Status tracking filtering tab
      if (deliveryStatusFilter !== 'all') {
        const orderDelState = ord.status || 'pending';
        if (deliveryStatusFilter === 'pending' && orderDelState !== 'pending') return false;
        if (deliveryStatusFilter === 'processing' && orderDelState !== 'processing') return false;
        if (deliveryStatusFilter === 'shipped' && orderDelState !== 'shipped') return false;
        if (deliveryStatusFilter === 'delivered' && orderDelState !== 'delivered') return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      return 0;
    });

  return (
    <div id="order_tracker_wrapper" className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Header Banner Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 dark:from-slate-850 dark:to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none translate-x-12 -translate-y-12" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-405/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider text-cyan-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fulfillment Hub Connected</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight">
            {l('title')}
          </h2>
          <p className="text-xs md:text-sm text-cyan-100/90 max-w-2xl font-sans mt-1">
            {l('subtitle')}
          </p>
        </div>
      </div>

      {/* THREE GLOWING STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Orders Card */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
              {language === 'bn' ? t.stats.totalOrders.bn : language === 'ar' ? t.stats.totalOrders.ar : t.stats.totalOrders.en}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {countTotalOrders}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Invoices</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-cyan-400">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
              {language === 'bn' ? t.stats.totalSpent.bn : language === 'ar' ? t.stats.totalSpent.ar : t.stats.totalSpent.en}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#10B981] font-mono">
                {formatPrice(countTotalSpent)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium font-mono">{currency}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
              {language === 'bn' ? t.stats.activeDelivery.bn : language === 'ar' ? t.stats.activeDelivery.ar : t.stats.activeDelivery.en}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-sky-500 dark:text-cyan-400 font-mono">
                {countActiveDeliveries}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">In Transit</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-cyan-400">
            <Truck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
        
        {/* Search Input bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] text-slate-950 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={l('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Payment Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wide font-mono">
              {l('payStatus')}
            </label>
            <div className="relative">
              <select
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-350 focus:outline-none cursor-pointer appearance-none"
                value={payStatusFilter}
                onChange={(e) => setPayStatusFilter(e.target.value as any)}
              >
                <option value="all">{l('all')}</option>
                <option value="completed">{language === 'bn' ? 'পরিশোধিত' : 'Completed (Paid)'}</option>
                <option value="pending">{language === 'bn' ? 'বকেয়া' : 'Pending'}</option>
                <option value="failed">{language === 'bn' ? 'ব্যর্থ' : 'Failed'}</option>
              </select>
              <Filter className="absolute right-3.5 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Delivery Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wide font-mono">
              {l('deliveryStatus')}
            </label>
            <div className="relative">
              <select
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-350 focus:outline-none cursor-pointer appearance-none"
                value={deliveryStatusFilter}
                onChange={(e) => setDeliveryStatusFilter(e.target.value as any)}
              >
                <option value="all">{l('all')}</option>
                <option value="pending">{language === 'bn' ? 'অপেক্ষা করছে' : 'Order Placed (Pending)'}</option>
                <option value="processing">{language === 'bn' ? 'প্রক্রিয়াধীন' : 'Development Phase'}</option>
                <option value="shipped">{language === 'bn' ? 'ডেলিভার করা হয়েছে' : 'Assets Deployment Done'}</option>
                <option value="delivered">{language === 'bn' ? 'সফল লাইভ' : 'Delivered & Completed'}</option>
              </select>
              <Truck className="absolute right-3.5 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wide font-mono">
              {l('sortByLabel')}
            </label>
            <div className="relative">
              <select
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-350 focus:outline-none cursor-pointer appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date-desc">{l('dateDesc')}</option>
                <option value="date-asc">{l('dateAsc')}</option>
                <option value="price-desc">{l('priceDesc')}</option>
                <option value="price-asc">{l('priceAsc')}</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

        </div>

      </div>

      {/* ORDERS LIST CONTAINER */}
      <div className="space-y-4">
        
        <AnimatePresence mode="popLayout">
          {processedOrders.length === 0 ? (
            
            /* Empty State component offering Simulation */
            <motion.div 
              key="empty-orders-state"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-slate-850 rounded-3xl p-10 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm"
            >
              <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/10">
                <Inbox className="w-8 h-8 stroke-[1.8]" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {l('noOrders')}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed">
                  {l('noOrdersDesc')}
                </p>
              </div>

              {/* No simulated demo button allowed */}
            </motion.div>

          ) : (
            
            /* Real Dynamic rendered Invoice Order loops */
            processedOrders.map((ord, index) => {
              const isExpanded = expandedOrderId === ord.id;
              const stepIndex = getFulfillmentStepValue(ord.status, ord.paymentStatus);
              
              // Payment badge color matching definitions
              const payBadges = {
                completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10',
                pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10',
                failed: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10'
              };

              const ordStatus = ord.status || 'pending';
              const delBadges = {
                pending: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800',
                processing: 'bg-blue-500/10 text-[#2563EB] dark:text-cyan-400 border border-blue-500/10',
                shipped: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/10',
                delivered: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10'
              };

              return (
                <motion.div 
                  key={ord.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.38, 
                    delay: Math.min(index * 0.05, 0.35),
                    ease: [0.21, 0.47, 0.32, 0.98] 
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={`bg-white dark:bg-[#1E293B] border rounded-3xl overflow-hidden transition-colors duration-300 shadow-sm hover:shadow-md ${
                    isExpanded 
                      ? 'border-indigo-500 ring-1 ring-indigo-500/30 dark:border-cyan-500/60 dark:ring-cyan-500/20' 
                      : 'border-slate-200 hover:border-slate-350 dark:border-slate-850 dark:hover:border-slate-800'
                  }`}
                >
                
                {/* Header overview row */}
                <div 
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  
                  {/* Item Description metadata Column */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-[#0f172a] rounded-2xl shrink-0 mt-0.5 border border-slate-100 dark:border-slate-900">
                      <Truck className={`w-5 h-5 ${
                        ordStatus === 'delivered' ? 'text-emerald-500' :
                        ordStatus === 'shipped' ? 'text-pink-500' :
                        ordStatus === 'processing' ? 'text-[#2563EB]' : 'text-slate-400'
                      }`} />
                    </div>
                    
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                        {ord.itemTitle}
                      </h4>
                      
                      {/* Meta tokens details bar */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-400 font-mono mt-1">
                        <span className="font-extrabold text-[#2563EB] dark:text-cyan-400">
                          #{getOrderSerial(ord.id)}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{ord.date}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="flex items-center gap-1 font-bold text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{l('expectedDelivery')}: {getExpectedDeliveryText(ord)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing / Badges Status Row */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t border-dashed border-slate-100 dark:border-slate-850 md:border-t-0">
                    
                    {/* Big Bold custom formatted Price Tag */}
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white leading-tight">
                      {formatPrice(ord.price)}
                    </span>

                    {/* Status badges row */}
                    <div className="flex items-center gap-2">
                      <motion.span 
                        key={`pay-${ord.paymentStatus}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono ${payBadges[ord.paymentStatus] || payBadges.completed}`}
                      >
                        {ord.paymentStatus === 'completed' ? (language === 'bn' ? 'পরিশোধিত' : 'Paid') : (language === 'bn' ? 'বকেয়া' : ord.paymentStatus)}
                      </motion.span>
                      <motion.span 
                        key={`del-${ordStatus}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono ${delBadges[ordStatus]}`}
                      >
                        {ordStatus === 'delivered' ? (language === 'bn' ? 'ডেলিভার্ড' : 'Delivered') :
                         ordStatus === 'shipped' ? (language === 'bn' ? 'প্রেরিত' : 'Shipped') :
                         ordStatus === 'processing' ? (language === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing') :
                         (language === 'bn' ? 'অপেক্ষমাণ' : 'Pending')}
                      </motion.span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderForModal(ord);
                        }}
                        className="text-[9px] font-black uppercase py-0.5 px-2 rounded-md font-mono bg-indigo-50 hover:bg-slate-100 text-[#2563EB] dark:bg-[#0f172a] dark:text-cyan-400 dark:hover:bg-slate-805 border border-indigo-200/50 dark:border-slate-800 transition flex items-center gap-0.5 cursor-pointer shrink-0"
                        title="View Detailed Itemized Invoice"
                      >
                        {l('viewInvoiceDetail')}
                      </button>
                      <div className="text-slate-400 group-hover:text-indigo-500 transition duration-200">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Animated Collapsed Body Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-dashed border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden"
                    >
                      <div className="p-6 space-y-6 text-left">
                        {/* 1. VISUAL STEPPER TRACKER */}
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                            {language === 'bn' ? 'ডেলিভারি ট্র্যাকিং অগ্রগতি' : language === 'ar' ? 'مسار تقدم توصيل الشحنة' : 'Real-Time Fulfillment Timeline'}
                          </h5>

                          {/* Stepper Grid map */}
                          <div className="relative pt-2">
                            {/* Horizontal connection line behind circles */}
                            <div className="absolute top-7 left-[12%] right-[12%] h-[3px] bg-slate-200 dark:bg-slate-800 -z-0" />
                            
                            {/* Progress Filled Connection line */}
                            <div 
                              className="absolute top-7 left-[12%] h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-450 -z-0 transition-all duration-500"
                              style={{ width: `${stepIndex === 3 ? '76%' : stepIndex === 2 ? '50%' : stepIndex === 1 ? '25%' : '0%'}` }}
                            />

                            <div className="grid grid-cols-4 relative z-10">
                              
                              {/* Step 1: Placed */}
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs ring-4 transition ${
                                  stepIndex >= 0 
                                    ? 'bg-blue-600 text-white ring-blue-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 ring-transparent'
                                }`}>
                                  1
                                </div>
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-tight block">
                                  {stepLabel('placed')}
                                </span>
                              </div>

                              {/* Step 2: Processing */}
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs ring-4 transition ${
                                  stepIndex >= 1 
                                    ? 'bg-indigo-600 text-white ring-indigo-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 ring-transparent'
                                }`}>
                                  2
                                </div>
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-tight block">
                                  {stepLabel('processing')}
                                </span>
                              </div>

                              {/* Step 3: Shipped */}
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs ring-4 transition ${
                                  stepIndex >= 2 
                                    ? 'bg-pink-600 text-white ring-pink-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 ring-transparent'
                                }`}>
                                  3
                                </div>
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-tight block">
                                  {stepLabel('shipped')}
                                </span>
                              </div>

                              {/* Step 4: Delivered */}
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs ring-4 transition ${
                                  stepIndex >= 3 
                                    ? 'bg-emerald-600 text-white ring-emerald-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 ring-transparent'
                                }`}>
                                  4
                                </div>
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-tight block">
                                  {stepLabel('delivered')}
                                </span>
                              </div>

                            </div>
                          </div>
                        </div>

                        {/* 2. ORDER SPECIFICS / METADATA LEDGER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-150 dark:border-slate-850">
                          
                          {/* Left Panel Meta */}
                          <div className="space-y-3 text-xs">
                            <h6 className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-cyan-400 font-mono">
                              {language === 'bn' ? 'অর্ডারের বিবরণ ও ট্র্যাকিং' : 'Transaction Information'}
                            </h6>

                            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
                              
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">{l('orderIdLabel')}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-black text-slate-850 dark:text-slate-200">{getOrderSerial(ord.id)}</span>
                                  <button 
                                    onClick={() => handleCopyText(getOrderSerial(ord.id), ord.id)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-700 rounded transition"
                                    title="Copy Order ID"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {ord.trackingId && (
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">{l('trackingIdLabel')}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-black text-indigo-600 dark:text-cyan-405">{ord.trackingId}</span>
                                    <button 
                                      onClick={() => handleCopyText(ord.trackingId || '', ord.id + '-tr')}
                                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-700 rounded transition"
                                      title="Copy Tracking ID"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">{l('payMethodLabel')}</span>
                                <span className="font-medium text-slate-705 dark:text-slate-300">{ord.paymentMethod}</span>
                              </div>

                              {ord.transactionId && (
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">{language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</span>
                                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{ord.transactionId}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400">{l('subtotal')}</span>
                                <span className="font-black font-mono text-slate-900 dark:text-white">{formatPrice(ord.price)}</span>
                              </div>

                            </div>
                          </div>

                          {/* Right Panel Actions & Help */}
                          <div className="space-y-3">
                            <h6 className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-cyan-400 font-mono">
                              {language === 'bn' ? 'ডিজিটাল এক্সেস ও সাপোর্ট' : 'Fulfillment Assets & Operations'}
                            </h6>

                            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 h-[calc(100%-24px)] min-h-[140px]">
                              <div>
                                {ord.paymentStatus === 'completed' && ord.downloadUrl ? (
                                  <div className="space-y-2">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-500 font-mono block">
                                      🛡️ Assets Ready for deployment
                                    </span>
                                    <p className="text-[11px] text-slate-400 leading-normal">
                                      You can download direct scripts, licensing logs, and credentials to execute local build containers instantly.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-500 font-mono block">
                                      ⌛ Verification pending
                                    </span>
                                    <p className="text-[11px] text-slate-400 leading-normal">
                                      Our software operations unit is preparing the setup license key. Verification takes less than 3 hours typically.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action buttons list */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {ord.paymentStatus === 'completed' && ord.downloadUrl && (
                                  <a
                                    href={ord.downloadUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-white bg-gradient-to-r from-emerald-650 to-teal-650 hover:from-emerald-700 hover:to-teal-700 shadow-sm transition"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{l('downloadProduct')}</span>
                                  </a>
                                )}

                                <button
                                  onClick={() => {
                                    setSelectedOrderForModal(ord);
                                    setModalTab('invoice');
                                  }}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 shadow-sm transition cursor-pointer"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>{l('viewPrintInvoice')}</span>
                                </button>

                                <button
                                  onClick={() => setActiveHistoryChatOrder(ord)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{language === 'bn' ? 'স্টাফ চ্যাট 💬' : 'Staff Chat 💬'}</span>
                                </button>
                                
                                <a
                                  href={`https://wa.me/966570511931?text=${encodeURIComponent(`Hello WebzoneBD! I need assistance with my Order ID #${ord.id}${ord.transactionId ? ` (TrxID: ${ord.transactionId})` : ''}`)}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-slate-700 hover:text-slate-900 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 hover:dark:bg-slate-850 shadow-xs transition"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{l('supportLink')}</span>
                                </a>
                              </div>

                            </div>

                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                </motion.div>
              );
            })
          )}
        </AnimatePresence>

      </div>

      {/* DETAILED ITEMIZED BILLING / INVOICE MODAL */}
      <AnimatePresence>
        {selectedOrderForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            {/* Backdrop closes the modal */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForModal(null)}
              className="absolute inset-0 bg-transparent cursor-default"
            />

            {/* Modal Window Sheet */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white dark:bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-20 flex flex-col max-h-[90vh]"
            >
              
              {/* Header Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalTab('invoice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      modalTab === 'invoice'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ইনভয়েস 🧾' : 'Invoice 🧾'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab('chat')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      modalTab === 'chat'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'স্টাফ চ্যাট 💬' : 'Requirements Chat 💬'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block tracking-wider uppercase font-bold">#{getOrderSerial(selectedOrderForModal.id)}</span>
                  <button
                    onClick={() => {
                      setSelectedOrderForModal(null);
                      setModalTab('invoice');
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition cursor-pointer"
                    aria-label="Close invoice details modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {modalTab === 'chat' ? (
                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                  <OrderProjectChat
                    order={selectedOrderForModal}
                    user={user}
                    language={language}
                    isCompact={true}
                    onClose={() => {
                      setSelectedOrderForModal(null);
                      setModalTab('invoice');
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Modal Core Body (Scrollable) */}
                  <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs font-sans">
                
                {/* Brand & Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-150 dark:border-slate-900">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold tracking-wider text-[#2563EB] dark:text-cyan-400 font-mono uppercase block">WEBZONE BD</span>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium">
                      Webzone IT & Cloud Operations Ltd.<br />
                      Level 4, Webzone Tower, West Panthapath<br />
                      Dhaka - 1212, Bangladesh<br />
                      Email: billing@webzonebd.com
                    </p>
                  </div>

                  <div className="sm:text-right space-y-1.5 min-w-[140px]">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider block font-mono">Ledger Status</span>
                    
                    <div className="flex flex-wrap sm:justify-end gap-1.5">
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono border ${
                        selectedOrderForModal.paymentStatus === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15'
                      }`}>
                        {selectedOrderForModal.paymentStatus === 'completed' ? (language === 'bn' ? 'পরিশোধিত' : 'PAID') : (language === 'bn' ? 'বকেয়া' : 'PENDING')}
                      </span>
                      
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono border ${
                        selectedOrderForModal.status === 'delivered' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15' :
                        selectedOrderForModal.status === 'shipped' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/15' :
                        selectedOrderForModal.status === 'processing' ? 'bg-blue-500/10 text-[#2563EB] dark:text-cyan-400 border-blue-500/15' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {selectedOrderForModal.status === 'delivered' ? (language === 'bn' ? 'ডেলিভার্ড' : 'Delivered') :
                         selectedOrderForModal.status === 'shipped' ? (language === 'bn' ? 'প্রেরিত' : 'Shipped') :
                         selectedOrderForModal.status === 'processing' ? (language === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing') :
                         (language === 'bn' ? 'অপেক্ষমাণ' : 'Pending')}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono mt-1 block">
                      Placed On: {selectedOrderForModal.date}
                    </div>
                  </div>
                </div>

                {/* Billed To / Target Deployment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Billed To Client Details */}
                  <div className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900/50">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                      {language === 'bn' ? 'গ্রাহকের বিবরণ' : language === 'ar' ? 'بيانات المشتري' : 'Billed TO (Customer)'}
                    </span>
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        {user?.name || user?.username || 'Webzone VIP Client'}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{user?.email || ' VIP.Client@webzonebd.com'}</p>
                      <p className="text-slate-405 text-[9.5px] leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-850 mt-1">
                        Client Rating: ★★★★★ VIP Brand<br />
                        Authorized Location: Webzone Server Hub
                      </p>
                    </div>
                  </div>

                  {/* Target Delivery & Cloud Parameters info */}
                  <div className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900/50">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                      {language === 'bn' ? 'ডিপ্লয়মেন্ট ও ডেলিভারি ঠিকানা' : language === 'ar' ? 'عنوان التسليم والترخيص' : 'Deployment License Destination'}
                    </span>
                    <div className="space-y-1 text-slate-600 dark:text-slate-300">
                      <p className="font-extrabold text-slate-800 dark:text-slate-205">
                        Host Target: {selectedOrderForModal.trackingId?.includes('SMS') ? 'SMS Gateway Router Port' : selectedOrderForModal.trackingId?.includes('SOFT') ? 'GitHub Git Private Core Repo' : 'Dedicated Cloud Host - Frankfurt'}
                      </p>
                      <div className="pt-0.5 text-[10px] text-slate-550 dark:text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1 font-mono">
                          <span>License Domain: </span>
                          <span className="text-[#2563EB] dark:text-cyan-405 underline">clientdomain-{selectedOrderForModal.id.slice(4)}.com</span>
                        </div>
                        <p className="text-[9.5px] text-slate-405 mt-1">
                          Delivery Lead Time: {getExpectedDeliveryText(selectedOrderForModal)}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Itemized cost ledger table */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                    {language === 'bn' ? 'আইটেমাইজড খরচ হিসাব' : language === 'ar' ? 'تفصيل التكلفة والخدمات' : 'Itemized Ledger Cost Breakdown'}
                  </span>

                  <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#111827]/30">
                    
                    {/* Table Headers */}
                    <div className="grid grid-cols-12 bg-slate-50 dark:bg-[#0f172a] p-3 border-b border-slate-150 dark:border-slate-800 text-[9.5px] font-black uppercase text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                      <div className="col-span-8">Product / Service Statement</div>
                      <div className="col-span-4 text-right">Amount ({currency})</div>
                    </div>

                    {/* Table Body - Line Item */}
                    <div className="grid grid-cols-12 p-4 border-b border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-350 bg-white/50 dark:bg-transparent">
                      <div className="col-span-8 space-y-1">
                        <p className="font-black text-slate-900 dark:text-white text-xs leading-snug">
                          {selectedOrderForModal.itemTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal font-medium">
                          Multi-tier digital software download package license with setup configuration assist.
                        </p>
                      </div>
                      <div className="col-span-4 text-right font-mono font-black text-slate-900 dark:text-white self-center">
                        {formatPrice(selectedOrderForModal.price * 0.95)}
                      </div>
                    </div>

                    {/* Inclusive Add-on: installation */}
                    <div className="grid grid-cols-12 p-3.5 border-b border-slate-100 dark:border-slate-800 text-slate-405 text-xs bg-slate-50/10">
                      <div className="col-span-8">
                        <p className="font-bold text-slate-500 dark:text-slate-400">VM Cloud Server Setup Installation Setup Assistance</p>
                      </div>
                      <div className="col-span-4 text-right font-mono font-extrabold text-emerald-500">
                        FREE (PROMO INCLUDED)
                      </div>
                    </div>

                    {/* Math totals ledger box */}
                    <div className="p-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-150 dark:border-slate-800 font-mono text-[10.5px] space-y-2">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Base Cost Net Price:</span>
                        <span>{formatPrice(selectedOrderForModal.price * 0.95)}</span>
                      </div>

                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Government VAT & Tax (5.0%):</span>
                        <span>{formatPrice(selectedOrderForModal.price * 0.05)}</span>
                      </div>

                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>SSL Deployment Security Layer Fee:</span>
                        <span className="text-emerald-500 font-bold uppercase text-[9.5px]">WAIVED</span>
                      </div>

                      <div className="flex justify-between pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-black">
                        <span className="uppercase tracking-wider">Grand Total Net Paid:</span>
                        <span className="text-indigo-650 dark:text-cyan-400 font-mono text-xs font-black">
                          {formatPrice(selectedOrderForModal.price)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Gateway Metadata Seal */}
                <div className="p-4 rounded-2xl bg-[#0f172a] text-slate-400 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10px] leading-relaxed">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-black uppercase text-slate-500 block">Gateway Ledger Hash</span>
                    <p className="text-slate-350">
                      Method: {selectedOrderForModal.paymentMethod}<br />
                      Txn Hash: {selectedOrderForModal.transactionId || 'TXN-SHIELD-' + selectedOrderForModal.id}<br />
                      Security level: Multi-factor tokenized (PipraPay/SSLV2)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-black uppercase text-slate-500 block">System Verification Stamp</span>
                    <p className="text-cyan-405 font-black flex items-center gap-1 text-[10.5px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Webzone Safe Transaction Certified
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      Generated electronically. Secure blockchain copy logged.
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-slate-155 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] flex flex-col sm:flex-row items-center justify-end gap-3.5">
                <button
                  onClick={() => {
                    const docId = selectedOrderForModal.id;
                    setIsDownloadingInvoice(docId);
                    setTimeout(() => {
                      setIsDownloadingInvoice(null);
                      triggerToast(`📥 Invoice WZ-${docId} printed to your cache!`);
                      window.print();
                    }, 1100);
                  }}
                  disabled={isDownloadingInvoice !== null}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-[#2563EB] dark:hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-md"
                >
                  {isDownloadingInvoice ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Generating Invoice PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Invoice PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-205 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 transition cursor-pointer bg-white dark:bg-[#1e293b]"
                >
                  <Printer className="w-4 h-4 text-indigo-505 dark:text-cyan-400" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedOrderForModal(null);
                    setModalTab('invoice');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition border-0 cursor-pointer text-center"
                >
                  Close
                </button>
              </div>

                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standalone Project Requirements Chat Modal */}
      <AnimatePresence>
        {activeHistoryChatOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveHistoryChatOrder(null)}
              className="absolute inset-0 bg-transparent cursor-default"
            />
            <div className="relative w-full max-w-3xl z-20">
              <OrderProjectChat
                order={activeHistoryChatOrder}
                user={user}
                language={language}
                onClose={() => setActiveHistoryChatOrder(null)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
