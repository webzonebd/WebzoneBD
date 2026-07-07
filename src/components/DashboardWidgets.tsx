import React, { useState } from 'react';
import { 
  DollarSign, 
  List, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  ShieldAlert, 
  CloudLightning, 
  ChevronRight, 
  Coins,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RotateCw,
  Eye,
  Edit2,
  Printer,
  MoreVertical,
  X,
  Check,
  Users,
  ShoppingBag,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Plus,
  Lock,
  CheckCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Area, Line } from 'recharts';

interface DashboardWidgetsProps {
  language: 'en' | 'bn';
  theme: 'light' | 'dark';
  user: any;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  domains: any[];
  setDomains: React.Dispatch<React.SetStateAction<any[]>>;
  orders: any[];
  tickets: any[];
  setTicketModalOpen: (open: boolean) => void;
  setActiveTicketForChat: (ticket: any) => void;
  setActiveTab: (tab: string) => void;
  triggerToast: (msg: string) => void;
  onAddActivityLog: (log: string) => void;
  onUpdateOrders?: (newOrders: any[]) => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  language,
  theme,
  user,
  walletBalance,
  setWalletBalance,
  services,
  setServices,
  domains,
  setDomains,
  orders,
  tickets,
  setTicketModalOpen,
  setActiveTicketForChat,
  setActiveTab,
  triggerToast,
  onAddActivityLog,
  onUpdateOrders,
}) => {
  // Common visual helpers (e.g., price formattings)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Hosting Packages matching client products
  const hostingPackages = orders.filter(o => o.productId === 'host-gold' || o.productId === 'host-basic' || o.productId === 'host-vps');

  // Request Custom Project Form States
  const [reqProjectTitle, setReqProjectTitle] = useState('');
  const [reqProjectCategory, setReqProjectCategory] = useState('E-commerce Digital Store');
  const [reqProjectBudget, setReqProjectBudget] = useState('$100 - $300');
  const [reqProjectTech, setReqProjectTech] = useState('React + Node.js (Full Stack)');
  const [reqProjectDetails, setReqProjectDetails] = useState('');

  // Daily Sales & Order performance analytics state and memoized calculator
  const [adminTimeframe, setAdminTimeframe] = useState<'7days' | '30days'>('7days');
  const [adminMetric, setAdminMetric] = useState<'both' | 'revenue' | 'volume'>('both');

  // Recent Orders List Widget States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderForView, setSelectedOrderForView] = useState<any | null>(null);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<any | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<string | null>(null);
  const [isInvoicePrintOpen, setIsInvoicePrintOpen] = useState<any | null>(null);

  const adminTrendData = React.useMemo(() => {
    const days = [];
    const limit = adminTimeframe === '7days' ? 7 : 30;
    
    for (let i = limit - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const label = d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { 
        month: 'short', 
        day: 'numeric',
        ...(adminTimeframe === '7days' ? { weekday: 'short' } : {}) 
      });
      
      const dayTransactions = orders.filter(o => o.date === dateStr);
      const dayRevenue = dayTransactions
        .filter(o => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + (o.price || 0), 0);
      const completedCount = dayTransactions.filter(o => o.paymentStatus === 'completed').length;
      
      const daySeed = d.getDate();
      const mockOrdersCount = (daySeed % 3) + 1;
      const mockRevenueAmt = mockOrdersCount * (45 + (daySeed % 7) * 15);
      
      days.push({
        dateKey: dateStr,
        name: label,
        [language === 'bn' ? 'আয় ($)' : 'Revenue ($)']: dayTransactions.length > 0 ? parseFloat(dayRevenue.toFixed(2)) : mockRevenueAmt,
        [language === 'bn' ? 'অর্ডার' : 'Orders']: dayTransactions.length > 0 ? dayTransactions.length : mockOrdersCount,
        [language === 'bn' ? 'সম্পন্ন' : 'Completed']: dayTransactions.length > 0 ? completedCount : Math.max(0, mockOrdersCount - 1),
      });
    }
    return days;
  }, [orders, adminTimeframe, language]);

  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'editor' || user?.role === 'staff' || user?.role === 'manager';
  const isStaffViewOnly = user?.role === 'staff';

  // State sync effect to reset pagination on searches/filters
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, statusFilter, sortDirection]);

  if (isStaffOrAdmin) {
    /* =========================================================================
       ADMIN PRIVILEGED CONTROL CENTER (WITH RECENT ORDERS WIDGET)
       ========================================================================= */
    const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + o.price, 0);
    
    // Dynamic calculations for summary statistics section
    const todayStr = new Date().toISOString().split('T')[0];
    const ordersToday = orders.filter(o => o.date === todayStr);
    const totalOrdersToday = ordersToday.length;
    const totalSalesToday = ordersToday.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + (o.price || 0), 0);
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;

    const activeClientsCount = 4; // Mocked aggregate metrics represented visually
    const systemMemory = '12.4 GB / 32 GB';
    const cpuPerformance = '14% Load';

    // Filters, Search & Sort Logic for Recent Orders List
    const filteredOrders = orders.filter(ord => {
      const invIndex = orders.indexOf(ord);
      const invId = `INV-${1001 + invIndex}`.toLowerCase();
      const customerName = (ord.customerName || ord.guestName || "Client Account").toLowerCase();
      const customerEmail = (ord.customerEmail || ord.guestEmail || "client@webzonebd.com").toLowerCase();
      const itemTitle = ord.itemTitle.toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch = invId.includes(query) || customerName.includes(query) || customerEmail.includes(query) || itemTitle.includes(query);

      let matchesStatus = true;
      if (statusFilter === 'paid') {
        matchesStatus = ord.paymentStatus === 'completed';
      } else if (statusFilter === 'pending') {
        matchesStatus = ord.paymentStatus === 'pending';
      } else if (statusFilter === 'processing') {
        matchesStatus = ord.status === 'processing' || ord.status === 'shipped';
      } else if (statusFilter === 'cancelled') {
        matchesStatus = ord.paymentStatus === 'failed';
      } else if (statusFilter === 'refunded') {
        matchesStatus = ord.paymentStatus === 'refunded';
      }

      return matchesSearch && matchesStatus;
    });

    // Sort by Date
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // Pagination
    const pageSize = 5;
    const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
    const paginatedOrders = sortedOrders.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

    // Helpers
    const getAvatarGradient = (name: string) => {
      const charCode = name.charCodeAt(0) || 65;
      const gradients = [
        'from-violet-500 to-fuchsia-500',
        'from-blue-500 to-indigo-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-rose-500 to-pink-500',
        'from-cyan-500 to-blue-500'
      ];
      return gradients[charCode % gradients.length];
    };

    const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        triggerToast(language === 'bn' ? 'সাম্প্রতিক অর্ডারের তালিকা রিফ্রেশ করা হয়েছে! 🔄' : 'Recent orders data refreshed! 🔄');
      }, 800);
    };

    const handleUpdateOrder = (updatedOrder: any) => {
      if (isStaffViewOnly) {
        triggerToast('🔒 Staff accounts are configured as View Only. Edit locked!');
        return;
      }
      if (onUpdateOrders) {
        const updatedOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        onUpdateOrders(updatedOrders);
        triggerToast('Order updated successfully! 🎉');
        onAddActivityLog(`Updated order details for Invoice ID: INV-${updatedOrder.id}`);
        setSelectedOrderForEdit(null);
      } else {
        triggerToast('Database sync simulated inside sandbox! 🎉');
        setSelectedOrderForEdit(null);
      }
    };

    const handleQuickStatusChange = (orderId: string, newPaymentStatus: 'pending' | 'completed' | 'failed' | 'refunded', newDeliveryStatus?: 'pending' | 'processing' | 'shipped' | 'delivered') => {
      if (isStaffViewOnly) {
        triggerToast('🔒 Staff accounts are configured as View Only. Edit locked!');
        return;
      }
      const matchedOrder = orders.find(o => o.id === orderId);
      if (matchedOrder && onUpdateOrders) {
        const updated = {
          ...matchedOrder,
          paymentStatus: newPaymentStatus,
          ...(newDeliveryStatus ? { status: newDeliveryStatus } : {})
        };
        const updatedOrders = orders.map(o => o.id === orderId ? updated : o);
        onUpdateOrders(updatedOrders);
        triggerToast(`Status changed successfully to ${newPaymentStatus.toUpperCase()}! ⚡`);
        onAddActivityLog(`Quick changed status of order ${orderId} to paymentStatus: ${newPaymentStatus}`);
      }
      setIsMoreMenuOpen(null);
    };

    const handleExportCSV = () => {
      const headers = ["Invoice ID", "Customer Name", "Customer Email", "Item Title", "Amount", "Payment Status", "Order Status", "Created At"];
      const rows = sortedOrders.map((ord) => {
        const invId = `INV-${1001 + orders.indexOf(ord)}`;
        const name = ord.customerName || ord.guestName || "Client Account";
        const email = ord.customerEmail || ord.guestEmail || "client@webzonebd.com";
        return [
          invId,
          `"${name.replace(/"/g, '""')}"`,
          email,
          `"${ord.itemTitle.replace(/"/g, '""')}"`,
          ord.price,
          ord.paymentStatus.toUpperCase(),
          (ord.status || 'pending').toUpperCase(),
          ord.date
        ];
      });
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `WebzoneBD_Recent_Orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('📦 Recent Orders CSV file exported successfully!');
      onAddActivityLog('Exported Recent Orders list to CSV spreadsheet.');
    };

    const handleExportExcel = () => {
      const headers = ["Invoice ID", "Customer Name", "Customer Email", "Item Purchased", "Total Price", "Payment Status", "Order Delivery Status", "Created At"];
      const rows = sortedOrders.map((ord) => {
        const invId = `INV-${1001 + orders.indexOf(ord)}`;
        const name = ord.customerName || ord.guestName || "Client Account";
        const email = ord.customerEmail || ord.guestEmail || "client@webzonebd.com";
        return [
          invId,
          name,
          email,
          ord.itemTitle,
          `$${ord.price.toFixed(2)}`,
          ord.paymentStatus.toUpperCase(),
          (ord.status || 'pending').toUpperCase(),
          ord.date
        ];
      });
      
      const content = [headers.join("\t"), ...rows.map(e => e.join("\t"))].join("\n");
      const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `WebzoneBD_Recent_Orders_${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('📊 Recent Orders Excel spreadsheet exported successfully!');
      onAddActivityLog('Exported Recent Orders list as Excel spreadsheet.');
    };

    return (
      <div className="space-y-6">
        
        {/* Statistics Metric cards represent general administrative nodes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800/80 text-left shadow-sm">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total System Revenue</span>
            <p className="text-2.5xl font-black text-indigo-550 mt-1 text-[#7C3AED] dark:text-cyan-400">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800/80 text-left shadow-sm">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total System Orders</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
          </div>
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800/80 text-left shadow-sm">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Client Accounts Info</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{activeClientsCount}</p>
          </div>
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800/80 text-left shadow-sm">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Tickets Requiring Attention</span>
            <p className="text-2.5xl font-black text-amber-500 mt-1">{tickets.filter(t => t.status === 'open').length}</p>
          </div>
        </div>

        {/* ==========================================
            📊 SaaS PREMIUM GLASSMORPHIC SUMMARY STATISTICS
            ========================================== */}
        <div id="saas-order-summary-stats" className="space-y-3.5 mt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] animate-pulse" />
              <span>{language === 'bn' ? 'আজকের অর্ডার ও পেমেন্ট পারফরম্যান্স' : "Today's Order & Payment Performance"}</span>
            </h4>
            <span className="text-[10px] font-mono bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#A855F7] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {language === 'bn' ? 'লাইভ ফিড' : 'Live Feed'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Orders Today */}
            <div id="stat-card-orders-today" className="relative group overflow-hidden bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-[20px] border border-slate-150 dark:border-white/10 rounded-[24px] p-5 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-400">
                    {language === 'bn' ? 'আজ মোট অর্ডার' : 'Total Orders Today'}
                  </span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1.5 font-mono">
                    {totalOrdersToday}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-tr from-[#7C3AED]/10 to-[#EC4899]/10 rounded-[14px] text-[#7C3AED] dark:text-[#A855F7] group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-450 dark:text-slate-500">
                <span>{language === 'bn' ? 'নতুন ক্রিয়েট করা' : 'Newly logged'}</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-semibold text-slate-500 dark:text-slate-400">
                  {todayStr}
                </span>
              </div>
            </div>

            {/* Card 2: Total Sales Today */}
            <div id="stat-card-sales-today" className="relative group overflow-hidden bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-[20px] border border-slate-150 dark:border-white/10 rounded-[24px] p-5 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#22C55E] to-[#10B981]" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-400">
                    {language === 'bn' ? 'আজ মোট বিক্রি' : 'Total Sales Today'}
                  </span>
                  <p className="text-3xl font-black text-[#22C55E] mt-1.5 font-mono">
                    {formatPrice(totalSalesToday)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-tr from-[#22C55E]/10 to-[#10B981]/10 rounded-[14px] text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-450 dark:text-slate-500">
                <span>{language === 'bn' ? 'পরিশোধিত পেমেন্ট' : 'Completed checkouts'}</span>
                <span className="text-[#22C55E] font-bold">
                  {ordersToday.filter(o => o.paymentStatus === 'completed').length} {language === 'bn' ? 'টি' : 'tx'}
                </span>
              </div>
            </div>

            {/* Card 3: Pending Orders */}
            <div id="stat-card-pending-orders" className="relative group overflow-hidden bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-[20px] border border-slate-150 dark:border-white/10 rounded-[24px] p-5 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#F59E0B] to-[#D97706]" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-400">
                    {language === 'bn' ? 'অপেক্ষমাণ অর্ডার' : 'Pending Orders'}
                  </span>
                  <p className="text-3xl font-black text-[#F59E0B] mt-1.5 font-mono">
                    {pendingOrders}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-tr from-[#F59E0B]/10 to-[#D97706]/10 rounded-[14px] text-[#F59E0B] group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-450 dark:text-slate-500">
                <span>{language === 'bn' ? 'অ্যাকশন প্রয়োজন' : 'Requires verification'}</span>
                <span className="font-mono bg-amber-50 dark:bg-amber-500/10 text-[#F59E0B] px-1.5 py-0.5 rounded font-semibold">
                  {orders.length > 0 ? Math.round((pendingOrders / orders.length) * 100) : 0}% {language === 'bn' ? 'মোট' : 'of total'}
                </span>
              </div>
            </div>

            {/* Card 4: Completed Orders */}
            <div id="stat-card-completed-orders" className="relative group overflow-hidden bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-[20px] border border-slate-150 dark:border-white/10 rounded-[24px] p-5 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#7C3AED] to-[#A855F7]" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-400">
                    {language === 'bn' ? 'সম্পন্ন অর্ডার' : 'Completed Orders'}
                  </span>
                  <p className="text-3xl font-black text-[#7C3AED] dark:text-[#A855F7] mt-1.5 font-mono">
                    {completedOrders}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-tr from-[#7C3AED]/10 to-[#A855F7]/10 rounded-[14px] text-[#7C3AED] dark:text-[#A855F7] group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-450 dark:text-slate-500">
                <span>{language === 'bn' ? 'সফল ও পরিশোধিত' : 'Fully paid & settled'}</span>
                <span className="font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                  {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}% {language === 'bn' ? 'মোট' : 'of total'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            📦 BRAND NEW PREMIUM SaaS RECENT ORDERS LIST WIDGET
            ========================================== */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800/80 rounded-[24px] shadow-xl p-6 text-left relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Decorative Gradient Line at top */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

          {/* Widget Header with Premium Styling */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-2 bg-gradient-to-tr from-[#7C3AED]/10 to-[#EC4899]/10 rounded-xl text-[#7C3AED] dark:text-[#A855F7]">📦</span>
                <span>{language === 'bn' ? 'সাম্প্রতিক অর্ডারের তালিকা' : 'Recent Orders List'}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {language === 'bn' ? 'ড্যাশবোর্ড অ্যাডমিনদের জন্য সাম্প্রতিক অর্ডারগুলো দ্রুত পর্যবেক্ষণ ও ম্যানেজ করার প্যানেল।' : 'Rapid oversight and status transitions of system-wide client purchases.'}
              </p>
            </div>

            {/* Quick Actions Header Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Refresh Button with animation */}
              <button 
                type="button"
                onClick={handleRefresh}
                className="p-2.5 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#374151] rounded-xl text-slate-650 dark:text-slate-350 transition duration-300 cursor-pointer active:scale-95"
                title={language === 'bn' ? 'রিফ্রেশ করুন' : 'Refresh list'}
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#7C3AED]' : ''}`} />
              </button>

              {/* Export CSV Button */}
              <button 
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#374151] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition duration-300 cursor-pointer active:scale-95 font-sans"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              {/* Export Excel Button */}
              <button 
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/15 dark:border-[#EC4899]/15 rounded-xl text-xs font-semibold text-[#7C3AED] dark:text-[#EC4899] transition duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-[#7C3AED]/20 hover:to-[#EC4899]/20 active:scale-95 font-sans"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>

              {/* View All Orders tab switch */}
              <button 
                type="button"
                onClick={() => { setActiveTab('my-orders'); triggerToast('Navigating to detailed order records center...'); }}
                className="px-3.5 py-2.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 active:scale-95 transition-all duration-300 cursor-pointer font-sans"
              >
                {language === 'bn' ? 'সকল অর্ডার দেখুন' : 'View All Orders'}
              </button>
            </div>
          </div>

          {/* Filters, Sort, Search row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-4 border-b border-slate-100 dark:border-slate-800/60">
            {/* Search Input following spec */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'bn' ? 'অর্ডার আইডি, কাস্টমার বা পণ্য দিয়ে খুঁজুন...' : 'Search by Invoice ID, Customer name or item title...'}
                className="w-full h-14 pl-12 pr-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300 placeholder-slate-450 dark:placeholder-slate-500 font-sans"
              />
            </div>

            {/* Filter Dropdown following spec */}
            <div className="md:col-span-3 relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-14 pl-4 pr-10 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300 appearance-none hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer font-sans"
              >
                <option value="all">{language === 'bn' ? 'সকল পেমেন্ট স্ট্যাটাস' : 'All Statuses'}</option>
                <option value="paid">{language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid (Green)'}</option>
                <option value="pending">{language === 'bn' ? 'অপেক্ষমাণ (Pending)' : 'Pending (Orange)'}</option>
                <option value="processing">{language === 'bn' ? 'চলমান (Processing)' : 'Processing (Blue)'}</option>
                <option value="cancelled">{language === 'bn' ? 'বাতিলকৃত (Cancelled)' : 'Cancelled (Red)'}</option>
                <option value="refunded">{language === 'bn' ? 'রিফান্ডেড (Refunded)' : 'Refunded (Purple)'}</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Date switch following spec */}
            <div className="md:col-span-3">
              <button 
                type="button"
                onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="w-full h-14 px-4 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] hover:border-slate-300 dark:hover:border-slate-600 rounded-[14px] text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between transition duration-300 cursor-pointer active:scale-98 font-sans"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-[#A855F7]" />
                  <span>{language === 'bn' ? 'তারিখ অনুসারে সাজান' : 'Sort by Date'}</span>
                </div>
                <span className="text-xs bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-0.5 rounded-md font-mono uppercase shrink-0 ml-1">
                  {sortDirection === 'desc' ? (language === 'bn' ? 'নতুন আগে' : 'Newest') : (language === 'bn' ? 'পুরনো আগে' : 'Oldest')}
                </span>
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left font-sans">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans">
                    <th scope="col" className="py-4 font-mono">Invoice ID</th>
                    <th scope="col" className="py-4">Customer</th>
                    <th scope="col" className="py-4 text-right">Amount</th>
                    <th scope="col" className="py-4 text-center">Status</th>
                    <th scope="col" className="py-4 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {isRefreshing ? (
                    /* SKELETON LOADER ROWS following specs */
                    Array.from({ length: 4 }).map((_, rIdx) => (
                      <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                        <td className="py-4.5 font-mono"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                        <td className="py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="space-y-1.5">
                              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-850 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4.5 text-right"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                        <td className="py-4.5 text-center"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" /></td>
                        <td className="py-4.5 text-right"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedOrders.length === 0 ? (
                    /* EMPTY STATE DESIGN following specs */
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3.5 max-w-sm mx-auto font-sans">
                          <span className="p-4 bg-gradient-to-tr from-amber-500/10 to-rose-500/10 rounded-full text-amber-500 text-3xl">📭</span>
                          <h4 className="text-base font-extrabold text-slate-800 dark:text-white">
                            {language === 'bn' ? 'কোন সাম্প্রতিক অর্ডার পাওয়া যায়নি' : 'No Recent Orders Found'}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {language === 'bn' ? 'আপনার বর্তমান অনুসন্ধান বা ফিল্টারের সাথে মেলানো কোন অর্ডার রেকর্ড নেই।' : 'We couldn\'t find any records matching your active search or filter selection.'}
                          </p>
                          <button 
                            type="button"
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                            className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-[#7C3AED] border border-[#E2E8F0] dark:border-[#374151] rounded-xl transition duration-300 cursor-pointer"
                          >
                            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((ord) => {
                      const invIndex = orders.indexOf(ord);
                      const invId = `INV-${1001 + invIndex}`;
                      const customerName = ord.customerName || ord.guestName || "Client Account";
                      const customerEmail = ord.customerEmail || ord.guestEmail || "client@webzonebd.com";

                      // Status Badge details
                      let statusText = 'Pending';
                      let badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

                      if (ord.paymentStatus === 'completed') {
                        statusText = 'Paid';
                        badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                      } else if (ord.paymentStatus === 'refunded') {
                        statusText = 'Refunded';
                        badgeStyle = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
                      } else if (ord.paymentStatus === 'failed') {
                        statusText = 'Cancelled';
                        badgeStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
                      } else if (ord.status === 'processing' || ord.status === 'shipped') {
                        statusText = 'Processing';
                        badgeStyle = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-550/20';
                      }

                      return (
                        <tr key={ord.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200">
                          {/* Invoice ID as Link */}
                          <td className="py-4.5 font-mono text-xs font-bold">
                            <button 
                              type="button"
                              onClick={() => setSelectedOrderForView(ord)}
                              className="text-[#7C3AED] dark:text-[#A855F7] hover:underline hover:text-[#EC4899] font-black cursor-pointer"
                            >
                              {invId}
                            </button>
                          </td>

                          {/* Customer with Avatar */}
                          <td className="py-4.5">
                            <div className="flex items-center gap-3 font-sans">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarGradient(customerName)} text-white font-black text-xs flex items-center justify-center shadow-md shadow-violet-500/10 uppercase select-none shrink-0`}>
                                {customerName.charAt(0)}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition duration-200 truncate max-w-[150px] sm:max-w-[200px]">
                                  {customerName}
                                </span>
                                <span className="text-[11px] text-slate-450 dark:text-slate-500 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                                  {customerEmail}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-4.5 text-right font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                            {formatPrice(ord.price)}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4.5 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${badgeStyle} font-sans`}>
                              <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5" />
                              {statusText}
                            </span>
                          </td>

                          {/* Action Items */}
                          <td className="py-4.5 text-right relative pr-2">
                            <div className="flex items-center justify-end gap-1.5 font-sans">
                              {/* View Action */}
                              <button 
                                type="button"
                                onClick={() => setSelectedOrderForView(ord)}
                                className="p-2 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] dark:hover:bg-[#A855F7]/10 dark:hover:text-[#A855F7] rounded-lg text-slate-500 dark:text-slate-400 transition cursor-pointer"
                                title="View Order Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Action */}
                              <button 
                                type="button"
                                onClick={() => {
                                  if (isStaffViewOnly) {
                                    triggerToast('🔒 Staff accounts are configured as View Only. Edit locked!');
                                  } else {
                                    setSelectedOrderForEdit(ord);
                                  }
                                }}
                                className={`p-2 rounded-lg transition cursor-pointer ${
                                  isStaffViewOnly 
                                    ? 'bg-[#F1F5F9]/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                    : 'bg-[#F8FAFC] dark:bg-[#111827] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] dark:hover:bg-[#A855F7]/10 dark:hover:text-[#A855F7] text-slate-500 dark:text-slate-400'
                                }`}
                                title={isStaffViewOnly ? "Edit Locked (Staff View Only)" : "Edit Order Status"}
                              >
                                {isStaffViewOnly ? <Lock className="w-3.5 h-3.5" /> : <Edit2 className="w-4 h-4" />}
                              </button>

                              {/* Print Action */}
                              <button 
                                type="button"
                                onClick={() => setIsInvoicePrintOpen(ord)}
                                className="p-2 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] dark:hover:bg-[#A855F7]/10 dark:hover:text-[#A855F7] rounded-lg text-slate-500 dark:text-slate-400 transition cursor-pointer"
                                title="Print commercial Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              {/* More Menu Trigger */}
                              <div className="relative">
                                <button 
                                  type="button"
                                  onClick={() => setIsMoreMenuOpen(prev => prev === ord.id ? null : ord.id)}
                                  className="p-2 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition cursor-pointer active:scale-95"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* More Menu Dropdown list */}
                                {isMoreMenuOpen === ord.id && (
                                  <>
                                    <div className="fixed inset-0 z-30" onClick={() => setIsMoreMenuOpen(null)} />
                                    <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-40 py-1 font-mono text-[10px] animate-in fade-in duration-150">
                                      <div className="px-3 py-2 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                        Quick State Transition
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={() => handleQuickStatusChange(ord.id, 'completed')}
                                        className="w-full text-left px-3.5 py-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-bold flex items-center gap-1.5"
                                      >
                                        ✓ Mark as Paid
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => handleQuickStatusChange(ord.id, 'pending')}
                                        className="w-full text-left px-3.5 py-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-bold flex items-center gap-1.5"
                                      >
                                        ⚡ Mark as Pending
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => handleQuickStatusChange(ord.id, 'pending', 'processing')}
                                        className="w-full text-left px-3.5 py-2 text-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-500/10 font-bold flex items-center gap-1.5"
                                      >
                                        ⚙️ Set as Processing
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => handleQuickStatusChange(ord.id, 'failed')}
                                        className="w-full text-left px-3.5 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold flex items-center gap-1.5"
                                      >
                                        ✕ Cancel Order
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => handleQuickStatusChange(ord.id, 'refunded')}
                                        className="w-full text-left px-3.5 py-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 font-bold flex items-center gap-1.5"
                                      >
                                        💳 Refund Amount
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer with Pagination */}
          {sortedOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-sans">
              <span className="text-xs text-slate-450 dark:text-slate-500 font-mono">
                Showing <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(sortedOrders.length, (currentPageNum - 1) * pageSize + 1)}-{Math.min(sortedOrders.length, currentPageNum * pageSize)}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{sortedOrders.length}</span> order entries
              </span>

              {/* Prev/Next buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
                  disabled={currentPageNum === 1}
                  className="p-2 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl text-slate-650 dark:text-slate-400 transition cursor-pointer active:scale-95 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, pIdx) => {
                  const pNum = pIdx + 1;
                  const isCurrent = pNum === currentPageNum;
                  return (
                    <button
                      key={`page-${pNum}`}
                      type="button"
                      onClick={() => setCurrentPageNum(pNum)}
                      className={`w-9 h-9 text-xs font-mono font-bold rounded-xl transition cursor-pointer active:scale-95 ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow shadow-violet-500/20'
                          : 'bg-[#F8FAFC] dark:bg-[#111827] text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#374151]'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPageNum === totalPages}
                  className="p-2 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl text-slate-650 dark:text-slate-400 transition cursor-pointer active:scale-95 disabled:pointer-events-none"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Admin Sales & Orders Performance Trend Chart */}
        <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-[24px] p-6 text-left shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black uppercase text-indigo-650 dark:text-[#A855F7] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500 animate-pulse" />
                <span>{language === 'bn' ? 'বিক্রয় ও অর্ডার পারফরম্যান্স গ্রাফ (Sales & Orders Trends)' : 'Daily Sales & Order Performance'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                {language === 'bn' 
                  ? 'দৈনিক অর্ডার ভলিউম এবং সাকসেসফুল ট্রানজ্যাকশন ও রেভিনিউ ট্রেন্ড এনালাইসিস।' 
                  : 'Daily purchase trends mapping system-wide order volume and successful transactional revenue.'}
              </p>
            </div>
            
            {/* Visual configuration toggles */}
            <div className="flex flex-wrap items-center gap-2.5 font-sans">
              <div className="inline-flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <button 
                  type="button"
                  onClick={() => { setAdminTimeframe('7days'); onAddActivityLog('Switched admin trend timeframe to 7 days'); }}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition-all ${
                    adminTimeframe === '7days' 
                      ? 'bg-white dark:bg-slate-800 text-[#7C3AED] dark:text-cyan-405 shadow-sm' 
                      : 'text-slate-450 hover:text-slate-800'
                  }`}
                >
                  7 {language === 'bn' ? 'দিন' : 'Days'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setAdminTimeframe('30days'); onAddActivityLog('Switched admin trend timeframe to 30 days'); }}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition-all ${
                    adminTimeframe === '30days' 
                      ? 'bg-white dark:bg-slate-800 text-[#7C3AED] dark:text-cyan-405 shadow-sm' 
                      : 'text-slate-450 hover:text-slate-800'
                  }`}
                >
                  30 {language === 'bn' ? 'দিন' : 'Days'}
                </button>
              </div>

              <div className="inline-flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <button 
                  type="button"
                  onClick={() => setAdminMetric('both')}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition-all ${
                    adminMetric === 'both' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-450'
                  }`}
                >
                  {language === 'bn' ? 'উভয়' : 'All'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAdminMetric('revenue')}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition-all ${
                    adminMetric === 'revenue' ? 'bg-white dark:bg-slate-800 text-[#7C3AED] shadow-sm' : 'text-slate-450'
                  }`}
                >
                  {language === 'bn' ? 'আয়' : 'Sales'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAdminMetric('volume')}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition-all ${
                    adminMetric === 'volume' ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-sm' : 'text-slate-450'
                  }`}
                >
                  {language === 'bn' ? 'ভলিউম' : 'Volume'}
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-80 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={adminTrendData} margin={{ top: 10, right: -5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1E293B' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                {adminMetric === 'both' && (
                  <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                )}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF', 
                    borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                
                {/* Secondary metric chart items mapping */}
                {(adminMetric === 'both' || adminMetric === 'revenue') && (
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey={language === 'bn' ? 'আয় ($)' : 'Revenue ($)'} 
                    fill="url(#colorAdminRevenue)" 
                    stroke="#7C3AED" 
                    strokeWidth={2}
                    name={language === 'bn' ? 'মোট রেভিনিউ ($)' : 'Gross Sales ($)'}
                  />
                )}
                
                {(adminMetric === 'both' || adminMetric === 'volume') && (
                  <Bar 
                    yAxisId={adminMetric === 'both' ? 'right' : 'left'}
                    dataKey={language === 'bn' ? 'অর্ডার' : 'Orders'} 
                    fill="#38BDF8" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={30}
                    name={language === 'bn' ? 'অর্ডার ভলিউম' : 'Order Volume'}
                  />
                )}

                {adminMetric === 'both' && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey={language === 'bn' ? 'সম্পন্ন' : 'Completed'} 
                    stroke="#0EA5E9" 
                    strokeWidth={2} 
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Administration Platform Utility Panel */}
        <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-[24px] p-6 text-left shadow-md space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase text-[#7C3AED] dark:text-[#A855F7] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#7C3AED]" />
              <span>Administrative Core Suffixes Control</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-slate-900 border border-neutral-150 dark:border-slate-800/60 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Compute Infrastructure</span>
                <p className="text-slate-900 dark:text-white font-extrabold text-sm">{cpuPerformance}</p>
              </div>
              <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded self-start">Optimal Node status</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-slate-900 border border-neutral-150 dark:border-slate-800/60 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">RAM Buffering scale</span>
                <p className="text-slate-900 dark:text-white font-extrabold text-sm">{systemMemory}</p>
              </div>
              <span className="p-1 px-2.5 bg-[#7C3AED]/10 text-[#7C3AED] text-[8px] font-black uppercase rounded self-start font-sans">Cache healthy</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            📦 BRAND NEW PREMIUM SaaS DIALOGS/OVERLAYS
            ========================================== */}
        
        {/* VIEW ORDER DETAILS MODAL */}
        {selectedOrderForView && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-250">
            <div className="bg-white dark:bg-[#0F172A] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] max-w-lg w-full p-6 space-y-6 relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-2 bg-[#7C3AED]/10 text-[#7C3AED] rounded-xl text-xs font-mono">ID</span>
                  <span>Invoice INV-{1001 + orders.indexOf(selectedOrderForView)}</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => setSelectedOrderForView(null)}
                  className="p-2 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-xl text-slate-500 hover:text-rose-500 transition cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] col-span-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Purchased Item</span>
                  <p className="text-slate-900 dark:text-white font-extrabold text-sm font-sans">{selectedOrderForView.itemTitle}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Customer Name</span>
                  <p className="text-slate-950 dark:text-white font-bold text-sm font-sans">{selectedOrderForView.customerName || selectedOrderForView.guestName || "Client Account"}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Customer Email</span>
                  <p className="text-slate-950 dark:text-white font-bold text-sm truncate">{selectedOrderForView.customerEmail || selectedOrderForView.guestEmail || "client@webzonebd.com"}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Total Pricing</span>
                  <p className="text-[#7C3AED] dark:text-[#A855F7] font-black text-sm">{formatPrice(selectedOrderForView.price)}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Payment Method</span>
                  <p className="text-slate-950 dark:text-white font-bold text-sm uppercase">{selectedOrderForView.paymentMethod || "DIRECT_PORTAL"}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Payment Status</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border mt-1 font-sans ${
                    selectedOrderForView.paymentStatus === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : selectedOrderForView.paymentStatus === 'refunded'
                        ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                        : selectedOrderForView.paymentStatus === 'failed'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {selectedOrderForView.paymentStatus || 'pending'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151]">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Delivery Status</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border mt-1 font-sans ${
                    selectedOrderForView.status === 'delivered'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : selectedOrderForView.status === 'processing' || selectedOrderForView.status === 'shipped'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {selectedOrderForView.status || 'pending'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] col-span-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Purchase Date & Metadata</span>
                  <div className="flex justify-between mt-1 text-slate-650 dark:text-slate-350 font-sans">
                    <span>Created Date:</span>
                    <span className="font-bold font-mono">{selectedOrderForView.date}</span>
                  </div>
                  {selectedOrderForView.transactionId && (
                    <div className="flex justify-between mt-1 text-slate-650 dark:text-slate-350 font-sans">
                      <span>Transaction ID:</span>
                      <span className="font-bold text-[#7C3AED] font-mono">{selectedOrderForView.transactionId}</span>
                    </div>
                  )}
                  {selectedOrderForView.orderNotes && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Order Notes:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-sans mt-0.5 whitespace-pre-wrap text-[11px] leading-relaxed">
                        {selectedOrderForView.orderNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 font-sans">
                <button 
                  type="button"
                  onClick={() => { setIsInvoicePrintOpen(selectedOrderForView); setSelectedOrderForView(null); }}
                  className="px-4 py-2 bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/20 text-[#7C3AED] dark:text-[#EC4899] text-xs font-extrabold rounded-xl transition duration-300 cursor-pointer hover:shadow hover:scale-[1.01]"
                >
                  🖨 Print Invoice
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedOrderForView(null)}
                  className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-xs font-extrabold text-slate-700 dark:text-slate-300 rounded-xl transition duration-300 cursor-pointer active:scale-95"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ORDER MODAL */}
        {selectedOrderForEdit && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-250">
            <div className="bg-white dark:bg-[#0F172A] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] max-w-lg w-full p-6 relative overflow-hidden text-left font-sans animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-2 bg-gradient-to-tr from-[#7C3AED]/10 to-[#EC4899]/10 rounded-xl text-[#7C3AED]">✏️</span>
                  <span>Edit Invoice INV-{1001 + orders.indexOf(selectedOrderForEdit)}</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="p-2 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-xl text-slate-500 hover:text-rose-500 transition cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form container conforming to spec */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const updated = {
                    ...selectedOrderForEdit,
                    customerName: target.customerName.value,
                    customerEmail: target.customerEmail.value,
                    price: parseFloat(target.price.value) || 0,
                    paymentStatus: target.paymentStatus.value,
                    status: target.status.value,
                    orderNotes: target.orderNotes.value,
                  };
                  handleUpdateOrder(updated);
                }}
                className="space-y-4 pt-4 text-xs"
              >
                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Customer Name</label>
                  <input 
                    type="text"
                    name="customerName"
                    defaultValue={selectedOrderForEdit.customerName || selectedOrderForEdit.guestName || "Client Account"}
                    required
                    className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Customer Email */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Customer Email Address</label>
                  <input 
                    type="email"
                    name="customerEmail"
                    defaultValue={selectedOrderForEdit.customerEmail || selectedOrderForEdit.guestEmail || "client@webzonebd.com"}
                    required
                    className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Two Column details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pricing field */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Total Price ($)</label>
                    <input 
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={selectedOrderForEdit.price || 0}
                      required
                      className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300 font-mono"
                    />
                  </div>

                  {/* Payment status dropdown conforming to dropdown guidelines */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Payment Status</label>
                    <select
                      name="paymentStatus"
                      defaultValue={selectedOrderForEdit.paymentStatus || 'pending'}
                      className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300 cursor-pointer"
                    >
                      <option value="completed">Paid (Completed)</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Cancelled / Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Order delivery status */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Order/Delivery Status</label>
                    <select
                      name="status"
                      defaultValue={selectedOrderForEdit.status || 'pending'}
                      className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300 cursor-pointer"
                    >
                      <option value="pending">Pending Queue</option>
                      <option value="processing">Processing Setup</option>
                      <option value="shipped">Service Active (Shipped)</option>
                      <option value="delivered">Completed / Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Textarea Notes with premium scrollbar */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-650 dark:text-slate-300">Order / Config Notes</label>
                  <textarea 
                    name="orderNotes"
                    defaultValue={selectedOrderForEdit.orderNotes || ""}
                    rows={4}
                    placeholder="Enter customer specific hosting configurations, workspace metadata..."
                    className="w-full min-h-[140px] p-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-transparent transition-all duration-300 resize-y"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button 
                    type="button"
                    onClick={() => setSelectedOrderForEdit(null)}
                    className="px-5 h-[54px] rounded-[14px] font-semibold border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition duration-300 cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 h-[54px] rounded-[14px] font-semibold text-white bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] transition-all duration-300 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PRINTABLE INVOICE VIEW */}
        {isInvoicePrintOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-250 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-[24px] shadow-2xl max-w-2xl w-full p-8 space-y-6 relative border border-slate-250 text-left my-8 font-sans">
              {/* Top controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-slate-100 rounded-lg text-slate-650">🖨️</span>
                  <span className="text-sm font-extrabold text-slate-700 font-mono">Invoice Preview Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs rounded-xl hover:shadow transition duration-200 cursor-pointer"
                  >
                    🖨️ Print Now
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsInvoicePrintOpen(null)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Area Starts */}
              <div className="space-y-6">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 uppercase">
                      <span>WebzoneBD</span>
                      <span className="text-[#7C3AED]">IT Solution</span>
                    </h1>
                    <p className="text-[10px] text-slate-450 mt-0.5 leading-normal font-medium uppercase tracking-wider">
                      Corporate Software & Hosting Provider
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <h2 className="text-base font-black text-[#7C3AED] uppercase">COMMERCIAL INVOICE</h2>
                    <p className="text-xs font-bold text-slate-800 mt-1">Invoice ID: #INV-{1001 + orders.indexOf(isInvoicePrintOpen)}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Date Issued: {isInvoicePrintOpen.date}</p>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-6 text-xs border-y border-slate-100 py-4.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">Billed To</span>
                    <p className="font-bold text-slate-800 text-sm">{isInvoicePrintOpen.customerName || isInvoicePrintOpen.guestName || "Client Account"}</p>
                    <p className="text-slate-500 mt-1 truncate">{isInvoicePrintOpen.customerEmail || isInvoicePrintOpen.guestEmail || "client@webzonebd.com"}</p>
                    {isInvoicePrintOpen.customerPhone && (
                      <p className="text-slate-500 mt-0.5 font-mono">{isInvoicePrintOpen.customerPhone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">Company Details</span>
                    <p className="font-bold text-slate-800 text-sm">WebzoneBD IT Solutions</p>
                    <p className="text-slate-500 mt-1">H-12, Sector 07, Uttara Sector-7</p>
                    <p className="text-slate-500 mt-0.5">Dhaka, Bangladesh</p>
                    <p className="text-slate-500 mt-0.5 font-mono">billing@webzonebd.com</p>
                  </div>
                </div>

                {/* Table items */}
                <table className="min-w-full divide-y divide-slate-150 text-xs">
                  <thead>
                    <tr className="font-extrabold uppercase text-slate-400 text-[10px] tracking-wider">
                      <th className="py-2.5 text-left">Purchased Product / Service</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-slate-900 text-sm">{isInvoicePrintOpen.itemTitle}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">Payment Method: {isInvoicePrintOpen.paymentMethod?.toUpperCase() || 'DIRECT'}</span>
                      </td>
                      <td className="py-4 text-center font-mono font-bold text-slate-800">1</td>
                      <td className="py-4 text-right font-mono font-bold text-slate-800">${isInvoicePrintOpen.price.toFixed(2)}</td>
                      <td className="py-4 text-right font-mono font-bold text-slate-900">${isInvoicePrintOpen.price.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Subtotal Calculation block */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <div className="w-64 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span className="font-bold">${isInvoicePrintOpen.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Discount (0%):</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>VAT / TAX (0%):</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-150 font-sans">
                      <span>Net Payable:</span>
                      <span className="text-[#7C3AED] font-mono">${isInvoicePrintOpen.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Signature Row */}
                <div className="flex justify-between items-end pt-12 text-slate-400 text-[10px]">
                  <div>
                    <p className="text-slate-550 italic leading-relaxed max-w-xs font-sans">
                      Thank you for choosing WebzoneBD. For any assistance contact helpdesk@webzonebd.com
                    </p>
                  </div>
                  <div className="text-center w-40 space-y-1.5 font-mono">
                    <div className="border-t border-slate-300 pt-1.5 font-bold text-slate-700 uppercase">
                      Authorized Sign
                    </div>
                    <p className="text-[8px] text-slate-400 uppercase font-sans">Billing Department</p>
                  </div>
                </div>
              </div>
              {/* Printable Area Ends */}
            </div>
          </div>
        )}

      </div>
    );
  } else {
    /* =========================================================================
       PREMIUM ACTIVE DATA CLIENT VIEW
       ========================================================================= */
    // Generate 6 months of historical billing data and aggregate with completed orders
    const chartData = (() => {
      // Standard baseline monthly spending representing typical hostings + custom service orders
      const isPreseededUser = ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-105', 'usr-vendor', 'usr-admin', 'usr-webzonebd-admin'].includes(user?.id || '');
      const baselines: Record<string, { products: number; services: number }> = isPreseededUser ? {
        '01': { products: 12.00, services: 45.00 },
        '02': { products: 0.00, services: 15.00 },
        '03': { products: 24.00, services: 30.00 },
        '04': { products: 18.00, services: 55.00 },
        '05': { products: 8.50, services: 40.00 },
        '06': { products: 0.00, services: 0.00 },
      } : {
        '01': { products: 0.00, services: 0.00 },
        '02': { products: 0.00, services: 0.00 },
        '03': { products: 0.00, services: 0.00 },
        '04': { products: 0.00, services: 0.00 },
        '05': { products: 0.00, services: 0.00 },
        '06': { products: 0.00, services: 0.00 },
      };

      // Force-add any user orders matching completed billing
      orders.forEach(order => {
        if (order.paymentStatus !== 'completed') return;
        try {
          const parts = order.date.split('-');
          if (parts.length >= 2) {
            const year = parts[0];
            const month = parts[1]; // '01', '02', '03' etc.
            if (year === '2026' && baselines[month]) {
              const isProduct = !!order.productId;
              if (isProduct) {
                baselines[month].products += order.price;
              } else {
                baselines[month].services += order.price;
              }
            }
          }
        } catch (err) {
          console.error('Error compiling chart: ', err);
        }
      });

      const monthKeys = ['01', '02', '03', '04', '05', '06'];
      const englishNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const bengaliNames = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];

      return monthKeys.map((key, idx) => {
        const name = language === 'bn' ? bengaliNames[idx] : englishNames[idx];
        const productsVal = parseFloat(baselines[key].products.toFixed(2));
        const servicesVal = parseFloat(baselines[key].services.toFixed(2));
        const totalVal = parseFloat((productsVal + servicesVal).toFixed(2));

        return {
          name,
          [language === 'bn' ? 'প্রোডাক্ট' : 'Products']: productsVal,
          [language === 'bn' ? 'সার্ভিস' : 'Services']: servicesVal,
          [language === 'bn' ? 'মোট ব্যয়' : 'Total Spend']: totalVal,
        };
      });
    })();

    const chartTotalSpent = chartData.reduce((acc, curr) => {
      const v = curr[language === 'bn' ? 'মোট ব্যয়' : 'Total Spend'] as number;
      return acc + (v || 0);
    }, 0);

    return (
      <div className="space-y-6">

        {/* Real-time stats header summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Services Active</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{services.length}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Managed Suffixes</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{domains.length}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Cloud Web Hostings</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{hostingPackages.length}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Orders</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
          </div>
        </div>

        {/* Interactive Billing & Spending Summary Chart */}
        <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-cyan-405 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                <span>{language === 'bn' ? 'বিলিং সারসংক্ষেপ (Billing Summary)' : 'Billing Summary Analytics'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                {language === 'bn' 
                  ? 'বিগত ৬ মাসের প্রোডাক্ট ও সার্ভিস ভিত্তিক মোট খরচের গ্রাফিক্যাল বিশ্লেষণ।' 
                  : 'Graphical analysis of monthly spending on products, templates, and core software services.'}
              </p>
            </div>
            
            {/* Real-time Summary Indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2 py-1 bg-indigo-500/10 text-indigo-650 dark:text-cyan-300 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                <span>{language === 'bn' ? 'গড় ব্যয়: $৩৮.৯০' : 'AVG: $38.90/MO'}</span>
              </div>
              <div className="p-2 py-1 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-500/20">
                <span>{language === 'bn' ? `মোট পরিশোধিত: $${chartTotalSpent.toFixed(2)}` : `TOTAL PAID: $${chartTotalSpent.toFixed(2)}`}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 pt-2 font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} 
                  strokeDasharray="3 3" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: any) => [`$${value}`, undefined]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
                {/* Products category represented as a Bar */}
                <Bar 
                  dataKey={language === 'bn' ? 'প্রোডাক্ট' : 'Products'} 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={18}
                />
                {/* Services category represented as a smooth Area */}
                <Area 
                  type="monotone" 
                  dataKey={language === 'bn' ? 'সার্ভিস' : 'Services'} 
                  fill="url(#colorServices)" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                />
                {/* Cumulative Monthly Total represented as a Line */}
                <Line 
                  type="monotone" 
                  dataKey={language === 'bn' ? 'মোট ব্যয়' : 'Total Spend'} 
                  stroke="#0EA5E9" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 1: Active Services */}
        <div className="w-full">
          
          {/* Active Services */}
          <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-md space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-cyan-405 flex items-center gap-2">
                  <List className="w-5 h-5 text-indigo-505 text-indigo-500" />
                  <span>{language === 'bn' ? 'চলতি সক্রিয় সার্ভিস সমূহ (Active Services)' : 'My Active Services'}</span>
                </h3>
                <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full uppercase font-black uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
                </span>
              </div>
              
              <div className="space-y-3">
                {services.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">{language === 'bn' ? 'কোনো সক্রিয় সার্ভিস পাওয়া হয়নি' : 'No active services registered.'}</p>
                ) : (
                  services.map((srv) => (
                    <div key={srv.id} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs leading-normal">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2 bg-indigo-500/10 text-indigo-500 dark:text-cyan-405 rounded font-mono text-[8px] uppercase font-black">
                            {srv.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {srv.id}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white leading-snug">{srv.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Team: <strong className="text-indigo-400 font-bold">{srv.assignedTeam}</strong></span>
                          <span>•</span>
                          <span>Due: <strong className="text-rose-400 font-bold">{srv.dueDate}</strong></span>
                        </div>
                      </div>
                      <span className={`p-1 px-2.5 border rounded-full text-[8px] font-mono tracking-wider font-extrabold uppercase shrink-0 self-start sm:self-center text-center ${
                        srv.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {srv.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Open Tickets */}
        <div className="w-full">

          {/* Open Tickets */}
          <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-cyan-405 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#7C3AED]" />
                <span>{language === 'bn' ? 'সাপোর্ট টিকিট সমূহ (Open Tickets)' : 'Open Support Tickets'}</span>
              </h3>
              <button onClick={() => setTicketModalOpen(true)} className="text-[10px] font-mono font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-xl transition uppercase active:scale-95 cursor-pointer">
                + {language === 'bn' ? 'নতুন টিকিট' : 'New Ticket'}
              </button>
            </div>

            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
                  <p className="text-xs text-slate-400 font-medium">✨ {language === 'bn' ? 'কোনো সক্রিয় সাপোর্ট টিকিট নেই' : 'No active client help desk cases open.'}</p>
                </div>
              ) : (
                tickets.slice(0, 3).map((tkt) => (
                  <div key={tkt.id} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs leading-normal">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[9px]">
                        <span className="font-bold text-slate-400">ID: {tkt.id}</span>
                        <span className={`p-0.5 px-2 rounded text-[8px] font-black uppercase ${
                          tkt.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {tkt.priority} Priority
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-850 dark:text-white leading-snug">{tkt.subject}</h4>
                      <p className="text-slate-400 text-[10px] font-mono mt-0.5">Category: <span className="text-indigo-400 font-semibold">{tkt.category}</span></p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                      <span className={`p-1 px-2 text-[8px] font-mono font-black border rounded uppercase tracking-wider ${
                        tkt.status === 'open' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-[#2563EB]/10 text-cyan-405 border-cyan-800/10'
                      }`}>
                        {tkt.status}
                      </span>
                      <button 
                        onClick={() => {
                          setActiveTicketForChat(tkt);
                          setActiveTab('tickets');
                        }}
                        className="px-2.5 py-1 text-slate-950 bg-amber-400 hover:bg-amber-500 font-black text-[8px] uppercase rounded-lg transition cursor-pointer"
                      >
                        💬 {language === 'bn' ? 'চ্যাট খুলুন' : 'Join Chat'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }
};
