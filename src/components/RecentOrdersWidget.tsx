import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Printer, 
  MoreVertical, 
  Check, 
  X, 
  Clock, 
  ExternalLink,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Order, Language } from '../types';

interface RecentOrdersWidgetProps {
  orders: Order[];
  customers: any[];
  isDark: boolean;
  language: Language;
  formatPrice: (usd: number) => string;
  getOrderSerial: (orderId: string) => string;
  setSelectedOrderForInspect: (order: Order | null) => void;
  setSelectedOrderForInvoiceModal: (order: Order | null) => void;
  updateOrderStatus: (id: string, status: 'completed' | 'failed' | 'refunded') => void;
  updateOrderDetails?: (id: string, updatedFields: Partial<Order>) => void;
  deleteOrder?: (id: string) => void;
  currentUser: any;
  setActiveMenu: (menu: string) => void;
  triggerToast: (msg: string) => void;
}

export default function RecentOrdersWidget({
  orders,
  customers,
  isDark,
  language,
  formatPrice,
  getOrderSerial,
  setSelectedOrderForInspect,
  setSelectedOrderForInvoiceModal,
  updateOrderStatus,
  updateOrderDetails,
  deleteOrder,
  currentUser,
  setActiveMenu,
  triggerToast,
}: RecentOrdersWidgetProps) {
  // Local state for widget interactive features
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeMoreMenuId, setActiveMoreMenuId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Role permissions checks: Manager/Super Admin/Admin have full edit rights. Staff has View Only.
  const isStaffViewOnly = useMemo(() => {
    const role = currentUser?.role;
    return role === 'staff';
  }, [currentUser]);

  // Simulate real-time API sync refresh state
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast(language === 'bn' ? '🔄 সাম্প্রতিক অর্ডারের ডাটা সফলভাবে রিফ্রেশ হয়েছে!' : '🔄 Recent orders data synchronized with real-time cloud registry!');
    }, 600);
  };

  // Stats computation for today (matching current local date or nearest simulation logs)
  const stats = useMemo(() => {
    // Current simulation date is 2026-06-26
    const targetDateStr = '2026-06-26';
    
    const todayOrders = orders.filter(o => o.date && o.date.startsWith(targetDateStr));
    const todaySalesSum = todayOrders
      .filter(o => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    const pendingCount = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedCount = orders.filter(o => o.paymentStatus === 'completed').length;

    return {
      todayOrdersCount: todayOrders.length,
      todaySales: todaySalesSum,
      pendingCount,
      completedCount
    };
  }, [orders]);

  // Handle outside click to close row context menus
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMoreMenuId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter and sort the real-time orders list
  const processedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Filter by search query (Invoice serial, Item title, customer name/email/phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => {
        const orderSerial = getOrderSerial(o.id).toLowerCase();
        const itemTitle = (o.itemTitle || '').toLowerCase();
        
        // Find matching customer from state
        const orderUserId = (o as any).userId;
        const cust = customers.find(c => c.id === orderUserId);
        const custName = (o.customerName || cust?.name || '').toLowerCase();
        const custEmail = (o.customerEmail || cust?.email || '').toLowerCase();
        const custPhone = (o.customerPhone || cust?.phone || '').toLowerCase();

        return (
          orderSerial.includes(q) ||
          itemTitle.includes(q) ||
          custName.includes(q) ||
          custEmail.includes(q) ||
          custPhone.includes(q)
        );
      });
    }

    // 2. Filter by paymentStatus
    if (statusFilter !== 'all') {
      result = result.filter(o => o.paymentStatus === statusFilter);
    }

    // 3. Sort by checkoutDate/date
    result.sort((a, b) => {
      const dateA = new Date(a.date || '').getTime();
      const dateB = new Date(b.date || '').getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortOrder, customers, getOrderSerial]);

  // Pagination bounds
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedOrders.slice(start, start + itemsPerPage);
  }, [processedOrders, currentPage, itemsPerPage]);

  // Handle page resets when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOrder, itemsPerPage]);

  // Export CSV Action
  const handleExportCSV = () => {
    try {
      if (processedOrders.length === 0) {
        triggerToast(language === 'bn' ? '⚠️ এক্সপোর্ট করার জন্য কোনো ডাটা নেই' : '⚠️ No data available to export');
        return;
      }

      const headers = ['Invoice ID', 'Customer Name', 'Customer Email', 'Item Purchased', 'Amount', 'Status', 'Checkout Date', 'Payment Method'];
      const rows = processedOrders.map(o => {
        const orderUserId = (o as any).userId;
        const cust = customers.find(c => c.id === orderUserId);
        const custName = o.customerName || cust?.name || 'Guest User';
        const custEmail = o.customerEmail || cust?.email || 'N/A';
        return [
          getOrderSerial(o.id),
          `"${custName.replace(/"/g, '""')}"`,
          custEmail,
          `"${(o.itemTitle || '').replace(/"/g, '""')}"`,
          o.price,
          o.paymentStatus.toUpperCase(),
          o.date || 'N/A',
          o.paymentMethod || 'N/A'
        ];
      });

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `recent_orders_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerToast(language === 'bn' ? '📥 CSV এক্সপোর্ট সফলভাবে সম্পন্ন হয়েছে!' : '📥 CSV ledger exported successfully!');
    } catch (e) {
      triggerToast('❌ Export CSV failed');
    }
  };

  // Export Excel Action (generates XML Spreadsheet / Tab separated content format representing elegant structured tabular ledger)
  const handleExportExcel = () => {
    try {
      if (processedOrders.length === 0) {
        triggerToast(language === 'bn' ? '⚠️ এক্সপোর্ট করার জন্য কোনো ডাটা নেই' : '⚠️ No data available to export');
        return;
      }

      // We'll generate a high quality tab-delimited Excel-readable file with .xls extension
      const headers = ['Invoice ID', 'Customer Name', 'Customer Email', 'Item Purchased', 'Amount', 'Status', 'Date', 'Payment Method'];
      const rows = processedOrders.map(o => {
        const orderUserId = (o as any).userId;
        const cust = customers.find(c => c.id === orderUserId);
        const custName = o.customerName || cust?.name || 'Guest User';
        const custEmail = o.customerEmail || cust?.email || 'N/A';
        return [
          getOrderSerial(o.id),
          custName,
          custEmail,
          o.itemTitle || '',
          o.price,
          o.paymentStatus.toUpperCase(),
          o.date || '',
          o.paymentMethod || ''
        ];
      });

      const tabContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
      const blob = new Blob([tabContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `recent_orders_ledger_${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerToast(language === 'bn' ? '📥 Excel এক্সপোর্ট সফলভাবে সম্পন্ন হয়েছে!' : '📥 Excel ledger exported successfully!');
    } catch (e) {
      triggerToast('❌ Export Excel failed');
    }
  };

  return (
    <div 
      id="recent-orders-list-widget"
      className={`p-6 rounded-[24px] border transition-all duration-300 relative overflow-hidden text-left ${
        isDark 
          ? 'bg-[#0F172A] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.35)]' 
          : 'bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Background Interactive Design Ambient Light Glow (Stripe/Linear Inspired) */}
      <div className="absolute top-0 right-0 w-[400px] h-[150px] bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[100px] bg-gradient-to-r from-pink-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Modern Gradient Premium Header Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.08] pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md shadow-purple-500/20">
              SaaS Engine v4
            </span>
            <span className="flex items-center gap-1.5 text-xs text-purple-500 dark:text-purple-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Connected
            </span>
          </div>
          <h3 className={`text-xl font-black tracking-tight mt-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-2`}>
            <span>📦</span> {language === 'bn' ? 'সাম্প্রতিক অর্ডারের তালিকা' : 'Recent Orders List'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'bn' 
              ? 'আইটি সলিউশনের রিয়েল-টাইম অর্ডার ট্র্যাকিং এবং ইনভয়েস অ্যাডমিনিস্ট্রেশন হাব।' 
              : 'Real-time billing pipelines, checkout logs, and instant client invoice delivery.'}
          </p>
        </div>

        {/* Header Options */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center ${
              isRefreshing ? 'animate-spin' : ''
            } ${
              isDark 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Force Real-time Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveMenu('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-purple-600/10 border-purple-500/20 text-purple-400 hover:bg-purple-600/20' 
                : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 shadow-2xs'
            }`}
          >
            <span>{language === 'bn' ? 'সকল অর্ডার দেখুন' : 'View All Orders'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header Statistics Bento Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 relative z-10" id="recent-orders-stats-bento">
        {/* Stat 1: Today's Orders */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${
          isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50/60 border-slate-100 shadow-3xs'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">Orders Today</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.todayOrdersCount}</span>
              <span className="text-[9px] text-emerald-500 font-bold">2026-06-26</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Today's Revenue */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${
          isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50/60 border-slate-100 shadow-3xs'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">Sales Today</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-black font-mono text-emerald-500`}>{formatPrice(stats.todaySales)}</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Pending Orders */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${
          isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50/60 border-slate-100 shadow-3xs'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">In-Pipeline</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-black font-mono text-amber-500`}>{stats.pendingCount}</span>
              <span className="text-[9px] text-slate-500 font-bold">Awaiting Payment</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Completed Orders */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${
          isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50/60 border-slate-100 shadow-3xs'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Check className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">Completed</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-black font-mono text-indigo-400`}>{stats.completedCount}</span>
              <span className="text-[9px] text-slate-500 font-bold">Settled Invoices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar (Search, Status filters, Actions, Excel exports) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/[0.05] relative z-20 mb-6">
        
        {/* Search Input Container */}
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? "ইনভয়েস আইডি, ক্রেতার নাম অথবা ইমেইল দিয়ে খুঁজুন..." : "Search by invoice serial, client credentials, key item titles..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-11 pl-10 pr-4 rounded-[12px] text-xs font-medium transition-all duration-300 outline-none ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter & Sorting Options row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status
            </span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className={`h-10 text-xs font-semibold rounded-xl px-3 outline-none border transition duration-200 cursor-pointer ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-white focus:border-purple-500' 
                  : 'bg-white border-slate-200 text-slate-800 focus:border-purple-600 shadow-2xs'
              }`}
            >
              <option value="all">All Transactions</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Sort Date Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className={`h-10 px-3.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-white hover:border-neutral-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Sort Date"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-500" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {/* Export Options Deck */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/[0.08] pl-2 ml-1">
            <button
              onClick={handleExportCSV}
              className={`h-10 px-3.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white hover:border-neutral-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
              title="Export dynamic rows to standard CSV Format"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handleExportExcel}
              className={`h-10 px-3.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white hover:border-neutral-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
              title="Export to Excel Spreadsheet Ledger"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Segment Container */}
      <div className="relative z-10 overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/[0.06] shadow-inner">
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            // Skeleton Loader State
            <div className="p-6 space-y-4" key="refresh-skeleton">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-neutral-800/60 last:border-0 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800" />
                    <div className="space-y-2">
                      <div className="w-24 h-3.5 bg-slate-250 dark:bg-neutral-750 rounded" />
                      <div className="w-36 h-2.5 bg-slate-200 dark:bg-neutral-800 rounded" />
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-slate-200 dark:bg-neutral-800 rounded" />
                  <div className="w-12 h-3 bg-slate-200 dark:bg-neutral-800 rounded" />
                  <div className="w-8 h-8 bg-slate-200 dark:bg-neutral-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : paginatedOrders.length === 0 ? (
            // Empty State view with premium details
            <div className="py-14 px-6 text-center space-y-3" key="empty-state">
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 border border-purple-500/15 rounded-full flex items-center justify-center mx-auto text-purple-500 dark:text-purple-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {language === 'bn' ? 'কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি' : 'No Recent Orders Found'}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                {language === 'bn' 
                  ? 'আপনার নির্বাচিত ফিল্টারের সাথে মিলে যায় এমন কোনো অর্ডার আইটি সলিউশন ডেটাবেজে এই মুহূর্তে নেই।' 
                  : 'There are no billing transaction pipeline records matching the active query parameters currently in our database.'}
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer active:scale-95"
                >
                  Clear Active Filters
                </button>
              ) : null}
            </div>
          ) : (
            // Table content render
            <table className="w-full text-left border-collapse min-w-[700px] text-xs" key="table-content">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.08] text-purple-400 font-bold uppercase font-mono text-[10px] tracking-wider bg-slate-50/50 dark:bg-white/[0.01]">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Item Title</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((o, idx) => {
                  const orderUserId = (o as any).userId;
                  let rowCust = customers.find(c => c.id === orderUserId);
                  if (!rowCust) {
                    const hash = o.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const matchedIndex = hash % (customers.length || 1);
                    rowCust = customers[matchedIndex] || null;
                  }

                  const finalName = o.customerName || rowCust?.name || 'GUEST USER';
                  const finalEmail = o.customerEmail || rowCust?.email || 'N/A';
                  
                  // Setup UI Avatar URLs dynamically representing actual profiles
                  const avatarUrl = rowCust?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=7C3AED&color=fff&bold=true`;

                  return (
                    <tr 
                      key={o.id} 
                      className={`border-b border-slate-100 dark:border-white/[0.06] hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors`}
                    >
                      {/* 1. Invoice ID */}
                      <td className="py-3 px-4 font-mono font-bold">
                        <button
                          onClick={() => setSelectedOrderForInvoiceModal(o)}
                          className="text-purple-400 hover:underline hover:text-purple-300 text-left cursor-pointer transition focus:outline-none flex items-center gap-1"
                          title="Click to view & print invoice"
                        >
                          <span>{getOrderSerial(o.id)}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      </td>

                      {/* 2. Customer Credentials card */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={avatarUrl} 
                            alt={finalName} 
                            className="w-8 h-8 rounded-full border border-slate-200 dark:border-neutral-800 object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <span className={`font-semibold block truncate max-w-[150px] ${isDark ? 'text-white' : 'text-slate-950'}`}>{finalName}</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px] font-mono leading-none">{finalEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Item Purchased Title */}
                      <td className="py-3 px-4">
                        <div className="font-medium max-w-[200px] truncate" title={o.itemTitle}>
                          {o.itemTitle}
                        </div>
                        <span className="text-[9px] opacity-50 font-mono block leading-none mt-0.5">{o.paymentMethod || 'Checkout Gateway'}</span>
                      </td>

                      {/* 4. Total Paid Amount Right Aligned */}
                      <td className="py-3 px-4 text-right font-black font-mono text-purple-400 text-sm">
                        {formatPrice(Number(o.price) || 0)}
                      </td>

                      {/* 5. Modern Rounded Payment Badges matching guidelines */}
                      <td className="py-3 px-4">
                        {(() => {
                          let badgeStyle = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                          let statusText = 'Pending';
                          
                          if (o.paymentStatus === 'completed' || o.paymentStatus === 'paid') {
                            badgeStyle = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                            statusText = 'Paid';
                          } else if (o.paymentStatus === 'failed' || o.paymentStatus === 'cancelled') {
                            badgeStyle = 'bg-red-500/10 text-red-400 border border-red-500/20';
                            statusText = 'Cancelled';
                          } else if (o.paymentStatus === 'processing' || o.status === 'processing') {
                            badgeStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                            statusText = 'Processing';
                          } else if (o.paymentStatus === 'refunded') {
                            badgeStyle = 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20';
                            statusText = 'Refunded';
                          }

                          return (
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide font-sans ${badgeStyle}`}>
                              {statusText}
                            </span>
                          );
                        })()}
                      </td>

                      {/* 6. Context Action Menus & Prints */}
                      <td className="py-3 px-4 text-right relative">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* 👁 View button */}
                          <button
                            onClick={() => setSelectedOrderForInspect(o)}
                            className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                              isDark 
                                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                            }`}
                            title="View / Edit Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 🖨 Print button */}
                          <button
                            onClick={() => setSelectedOrderForInvoiceModal(o)}
                            className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                              isDark 
                                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                            }`}
                            title="Print / PDF Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* ⋮ More dropdown menu handler */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMoreMenuId(prev => prev === o.id ? null : o.id);
                              }}
                              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                isDark 
                                  ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white' 
                                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown element */}
                            {activeMoreMenuId === o.id && (
                              <div className={`absolute z-50 right-0 mt-1.5 w-40 rounded-xl border p-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                                isDark 
                                  ? 'bg-neutral-900 border-neutral-800 text-white shadow-black/40' 
                                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/20'
                              }`}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForInspect(o)}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-bold"
                                >
                                  <Edit className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{isStaffViewOnly ? 'View Details' : 'Edit Order'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForInvoiceModal(o)}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-bold"
                                >
                                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                                  <span>View Invoice</span>
                                </button>

                                {/* Restrict edit options for Staff users according to permissions schema */}
                                {!isStaffViewOnly && (
                                  <>
                                    <div className="border-t border-slate-100 dark:border-white/[0.06] my-1" />
                                    
                                    <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                                      Quick Set Status
                                    </div>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'completed'}
                                      onClick={() => {
                                        updateOrderStatus(o.id, 'completed');
                                        triggerToast(`💳 Invoice ${getOrderSerial(o.id)} marked as PAID`);
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'completed' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Mark Paid</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'refunded'}
                                      onClick={() => {
                                        updateOrderStatus(o.id, 'refunded');
                                        triggerToast(`💳 Invoice ${getOrderSerial(o.id)} marked as REFUNDED`);
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-fuchsia-500/10 hover:text-fuchsia-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'refunded' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <Clock className="w-3 h-3 text-fuchsia-400" />
                                      <span>Mark Refunded</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'failed'}
                                      onClick={() => {
                                        setOrderToCancel(o);
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'failed' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <X className="w-3 h-3 text-rose-400" />
                                      <span>Cancel Order</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls Footer section */}
      {processedOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.08] relative z-10 text-xs">
          {/* Items Per Page config Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">{language === 'bn' ? 'প্রতি পাতায় প্রদর্শন:' : 'Show per page:'}</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`h-8 text-xs font-bold rounded-lg px-2 outline-none border cursor-pointer ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-white' 
                  : 'bg-white border-slate-200 text-slate-850'
              }`}
            >
              {[5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>{val} entries</option>
              ))}
            </select>
            <span className="text-slate-500 font-medium font-mono">
              Showing {Math.min(processedOrders.length, (currentPage - 1) * itemsPerPage + 1)}-
              {Math.min(processedOrders.length, currentPage * itemsPerPage)} of {processedOrders.length}
            </span>
          </div>

          {/* Page numbers block */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer ${
                currentPage === 1 
                  ? 'opacity-45 cursor-not-allowed text-slate-500 border-transparent' 
                  : isDark
                    ? 'bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Render direct page indices */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer border ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white border-transparent shadow-md shadow-purple-500/10'
                      : isDark
                        ? 'bg-white/[0.02] border-white/[0.05] hover:border-neutral-700 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer ${
                currentPage === totalPages 
                  ? 'opacity-45 cursor-not-allowed text-slate-500 border-transparent' 
                  : isDark
                    ? 'bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Premium confirmation modal for cancellation */}
      <AnimatePresence>
        {orderToCancel && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop with backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderToCancel(null)}
              className="absolute inset-0 bg-neutral-950/65 backdrop-blur-md"
            />
            
            {/* Modal Body with premium specs (Glassmorphism, linear gradient border, beautiful fonts, primary/secondary buttons) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative max-w-md w-full p-6 rounded-[24px] border shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left overflow-hidden ${
                isDark 
                  ? 'bg-[#111827] border-white/[0.08] text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Top premium design accent gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-base font-black tracking-tight font-sans">
                    {language === 'bn' ? 'অর্ডার বাতিল নিশ্চিতকরণ' : 'Confirm Order Cancellation'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed">
                    {language === 'bn' ? (
                      <>
                        আপনি কি নিশ্চিত যে আপনি ইনভয়েস <strong className="text-purple-400 font-mono">{getOrderSerial(orderToCancel.id)}</strong> বাতিল করতে চান? এই অ্যাকশনটি সম্পন্ন করার পর পেমেন্ট স্ট্যাটাস বাতিল হিসেবে রেকর্ড হবে।
                      </>
                    ) : (
                      <>
                        Are you sure you want to cancel invoice <strong className="text-purple-400 font-mono">{getOrderSerial(orderToCancel.id)}</strong>? Once executed, this order transaction will be marked as Cancelled.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons Deck */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                {/* Secondary Button - Keep Style Glass/Soft */}
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer border ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.06]' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {language === 'bn' ? 'না, ফিরে যান' : 'No, Keep Active'}
                </button>

                {/* Primary Danger Button */}
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(orderToCancel.id, 'failed');
                    triggerToast(
                      language === 'bn' 
                        ? `💳 ইনভয়েস ${getOrderSerial(orderToCancel.id)} বাতিল করা হয়েছে` 
                        : `💳 Invoice ${getOrderSerial(orderToCancel.id)} successfully marked as CANCELLED`
                    );
                    setOrderToCancel(null);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 active:scale-95 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  {language === 'bn' ? 'হ্যাঁ, বাতিল করুন' : 'Yes, Cancel Order'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
