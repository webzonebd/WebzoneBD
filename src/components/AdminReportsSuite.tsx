import React, { useState, useEffect, useMemo } from 'react';
import AdminAdvancedAnalytics from './AdminAdvancedAnalytics';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Activity, Users, ShoppingBag, DollarSign, TrendingUp, Sliders, Sparkles, Key, 
  Clock, Trash2, Search, X, Download, Copy, Eye, Shield, ArrowRight, Check, AlertCircle,
  Globe, Laptop, Smartphone, HelpCircle, Layers, Percent, FileDown, RotateCw, Play,
  MapPin, Navigation, Compass, Star, Settings, MessageSquare, Tag, Award, Heart, CheckSquare,
  Printer, FileText, CheckCircle2, ChevronDown, ChevronUp, GripVertical, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  downloads?: number;
  rating?: number;
}

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'completed' | 'failed' | 'refunded' | 'pending' | 'processing';
  date: string;
  gateway?: string;
  customerCountry?: string;
  customerCity?: string;
}

interface SupportTicket {
  id: string;
  user: string;
  issue: string;
  priority: string;
  status: string;
}

interface AdminReportsSuiteProps {
  isDark: boolean;
  textTitle: string;
  panelBg: string;
  activeSubMenu: string;
  setActiveSubMenu: (tab: string) => void;
  logAdminAction: (action: string) => void;
  triggerToast: (msg: string) => void;
  checkPermission: (perm: string) => boolean;
  renderAccessDenied: (perm: string, label: string) => React.ReactNode;
  localActivityLogs: any[];
  setLocalActivityLogs: React.Dispatch<React.SetStateAction<any[]>>;
  products: Product[];
  orders: Order[];
  tickets: SupportTicket[];
  customers: any[];
  projects: any[];
  withdrawRequests: any[];
  affiliateList: any[];
  adminWhatsAppLeads?: any[];
  adminInquiries?: any[];
  coupons?: any[];
}

export const AdminReportsSuite: React.FC<AdminReportsSuiteProps> = ({
  isDark,
  textTitle,
  panelBg,
  activeSubMenu,
  setActiveSubMenu,
  logAdminAction,
  triggerToast,
  checkPermission,
  renderAccessDenied,
  localActivityLogs,
  setLocalActivityLogs,
  products = [],
  orders = [],
  tickets = [],
  customers = [],
  projects = [],
  withdrawRequests = [],
  affiliateList = [],
  adminWhatsAppLeads = [],
  adminInquiries = [],
  coupons = []
}) => {
  // 1. DATE RANGE FILTER FOR EXPORTS / GENERAL REPORTS
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | '7days' | '30days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'>('30days');
  const [customStartDate, setCustomStartDate] = useState('2026-06-01');
  const [customEndDate, setCustomEndDate] = useState('2026-07-08');

  // 2. AUTOMATIC LIVE REFRESH interval
  const [refreshInterval, setRefreshInterval] = useState<number>(10); // in seconds
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>(new Date().toLocaleTimeString());

  // 3. WIDGET SHOW/HIDE & RE-ORDER LAYOUT STATE (Drag & Drop system representation)
  const defaultWidgets = [
    { id: 'total-revenue', label: 'Total Revenue', visible: true, order: 1 },
    { id: 'total-orders', label: 'Total Orders', visible: true, order: 2 },
    { id: 'total-customers', label: 'Total Customers', visible: true, order: 3 },
    { id: 'active-services', label: 'Active Services', visible: true, order: 4 },
    { id: 'digital-sales', label: 'Digital Product Sales', visible: true, order: 5 },
    { id: 'monthly-growth', label: 'Monthly Growth Rate', visible: true, order: 6 },
    { id: 'conversion-rate', label: 'Conversion Rate', visible: true, order: 7 },
    { id: 'website-visitors', label: 'Website Visitors', visible: true, order: 8 },
    { id: 'support-tickets', label: 'Support Tickets', visible: true, order: 9 },
    { id: 'refund-requests', label: 'Refund Requests', visible: true, order: 10 }
  ];

  const [widgets, setWidgets] = useState<Array<{ id: string; label: string; visible: boolean; order: number }>>(() => {
    const saved = localStorage.getItem('webzone_reports_widgets_layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });

  const saveWidgetLayout = () => {
    localStorage.setItem('webzone_reports_widgets_layout', JSON.stringify(widgets));
    triggerToast("💾 Saved reports dashboard layout preferences successfully.");
    logAdminAction("Saved custom widget layout for Reports & Analytics dashboard");
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const moveWidgetOrder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...widgets].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(w => w.id === id);
    if (direction === 'up' && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }
    setWidgets(sorted);
  };

  // 4. VISITOR LIVE STATE (Dynamically Simulated)
  const [liveVisitors, setLiveVisitors] = useState<number>(() => Math.floor(120 + Math.random() * 50));
  const [onlineSessionHistory, setOnlineSessionHistory] = useState<any[]>([
    { time: '10:00', visitors: 110 },
    { time: '10:05', visitors: 115 },
    { time: '10:10', visitors: 125 },
    { time: '10:15', visitors: 130 },
    { time: '10:20', visitors: 122 },
    { time: '10:25', visitors: 140 },
    { time: '10:30', visitors: liveVisitors }
  ]);

  const [liveActivityFeed, setLiveActivityFeed] = useState<any[]>([
    { id: 'act-1', time: 'Just now', customer: 'Sabrina Yasmin', activity: 'Initiated checkout for Secure bKash API', ip: '103.112.55.12', location: 'Dhaka, BD', status: 'In Progress', type: 'order' },
    { id: 'act-2', time: '1m ago', customer: 'Kamrul Hasan', activity: 'Downloaded Multivendor eCommerce Code', ip: '103.230.104.9', location: 'Chittagong, BD', status: 'Completed', type: 'download' },
    { id: 'act-3', time: '3m ago', customer: 'Majid Al-Shehri', activity: 'Registered a premium customer profile', ip: '94.200.150.32', location: 'Riyadh, SA', status: 'Active', type: 'registration' },
    { id: 'act-4', time: '5m ago', customer: 'Sarah Connor', activity: 'Created high support ticket #TKT-9912', ip: '198.143.164.2', location: 'Los Angeles, US', status: 'Critical', type: 'support' },
    { id: 'act-5', time: '8m ago', customer: 'Abdur Rahman', activity: 'Approved milestone in Enterprise ERP', ip: '103.102.115.4', location: 'Sylhet, BD', status: 'Pending', type: 'service' }
  ]);

  // Handle auto-refresh simulator
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        // Randomly modify visitors & activity logs
        setLiveVisitors(prev => {
          const delta = Math.floor(Math.random() * 11) - 5;
          const newVal = Math.max(80, prev + delta);
          
          setOnlineSessionHistory(hist => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const updated = [...hist.slice(1), { time: timeStr, visitors: newVal }];
            return updated;
          });

          return newVal;
        });

        // Add a new activity
        const activities = [
          { customer: 'Zeeshan Rahman', activity: 'Visited /store/wordpress-theme', ip: '103.88.22.41', location: 'Khulna, BD', status: 'Stable', type: 'visit' },
          { customer: 'Anonymous Guest', activity: 'Initiated WhatsApp Inquiry', ip: '82.165.122.91', location: 'London, GB', status: 'New', type: 'support' },
          { customer: 'Enamul Haque', activity: 'Submitted project milestone review request', ip: '182.16.55.90', location: 'Dhaka, BD', status: 'Pending', type: 'service' },
          { customer: 'Doha IT Hub', activity: 'Made a Stripe Payment of $7,850', ip: '64.233.160.10', location: 'Doha, QA', status: 'Cleared', type: 'payment' }
        ];
        const picked = activities[Math.floor(Math.random() * activities.length)];
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setLiveActivityFeed(prev => [
          { id: `act-${Date.now()}`, time: 'Just now', ...picked },
          ...prev.map(item => item.time === 'Just now' ? { ...item, time: '1m ago' } : item).slice(0, 10)
        ]);

        setLastRefreshedTime(new Date().toLocaleTimeString());
        setIsRefreshing(false);
      }, 800);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // 5. CALCULATE REAL DATABASE METRICS
  const computedStats = useMemo(() => {
    // Total Revenue
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRev = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersCount = orders.length;
    const totalCustomersCount = customers.length;
    const activeProjectsCount = projects.filter(p => p.status === 'in_progress' || p.status === 'revision').length;
    
    // Digital catalog product downloads (simulate sum based on catalog)
    const digitalSalesCount = products.reduce((sum, p) => sum + (p.downloads || 0), 0) + orders.length * 3;
    
    // Growth rate (simulate based on orders dates or set dynamically)
    const monthlyGrowth = 18.45;
    
    // Conversion rate based on order count
    const conversionRate = 3.65;
    
    // Support tickets count
    const activeTicketsCount = tickets.filter(t => t.status !== 'resolved').length;

    // Refund requests
    const refundCount = orders.filter(o => o.status === 'refunded').length;

    return {
      totalRevenue: totalRev,
      totalOrders: totalOrdersCount,
      totalCustomers: totalCustomersCount,
      activeServices: activeProjectsCount || 5,
      digitalSales: digitalSalesCount || 2480,
      monthlyGrowth,
      conversionRate,
      websiteVisitors: liveVisitors * 84, // general daily estimate
      supportTickets: activeTicketsCount || tickets.length,
      refundRequests: refundCount
    };
  }, [orders, customers, projects, products, tickets, liveVisitors]);

  // Check Permissions
  if (!checkPermission('manage_orders')) {
    return <>{renderAccessDenied('manage_orders', '📊 Reports & Analytics Hub')}</>;
  }

  // Ensure active report tab aligns
  const validTabs = [
    'rep-analytics', 'rep-overview', 'rep-visitors', 'rep-customer', 'rep-sales', 'rep-store',
    'rep-services', 'rep-financial', 'rep-marketing', 'rep-device', 'rep-browser',
    'rep-realtime', 'rep-export'
  ];
  const currentReportTab = validTabs.includes(activeSubMenu) ? activeSubMenu : 'rep-overview';

  // 6. EXPORT FORMAT HANDLERS
  const generateCSV = (tabId: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (tabId === 'sales') {
      csvContent += "Order ID,Customer Name,Total Amount,Status,Date,Gateway\n";
      orders.forEach(o => {
        const orderIdSafe = o.id || '';
        const customerNameSafe = o.customerName || 'Guest';
        const totalAmountSafe = o.total !== undefined ? o.total : (o.price !== undefined ? o.price : 0);
        const statusSafe = o.status || o.paymentStatus || 'pending';
        const dateSafe = o.date || '';
        const gatewaySafe = o.gateway || o.paymentMethod || 'Stripe';
        csvContent += `"${orderIdSafe}","${customerNameSafe}",$${totalAmountSafe},"${statusSafe}","${dateSafe}","${gatewaySafe}"\n`;
      });
    } else if (tabId === 'customers') {
      csvContent += "Customer ID,Name,Company,Email,Phone,Country,Total Spent\n";
      customers.forEach(c => {
        csvContent += `"${c.id}","${c.name}","${c.companyName || 'N/A'}","${c.email}","${c.phone}","${c.country || 'BD'}",$${c.totalSpent || 0}\n`;
      });
    } else {
      csvContent += "Reports Analytics Export Center Matrix,WebzoneBD Enterprise Node\n";
      csvContent += `Report Type,${(currentReportTab || '').toUpperCase()}\n`;
      csvContent += `Generated At,${new Date().toLocaleString()}\n`;
      csvContent += `Live Visitors,${liveVisitors}\n`;
      csvContent += `Total System Revenue,$${computedStats.totalRevenue}\n`;
      csvContent += `Total System Orders,${computedStats.totalOrders}\n`;
      csvContent += `Total Customers,${computedStats.totalCustomers}\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Webzone_Report_${currentReportTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("📥 CSV Spreadsheet exported successfully.");
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text("WEBZONEBD BUSINESS INTELLIGENCE SYSTEM", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Generated At: ${new Date().toLocaleString()} (BST)`, 14, 28);
      doc.text(`Report Scope Segment: ${(currentReportTab || '').toUpperCase()}`, 14, 34);
      doc.text(`Date Filter Context: ${(dateFilter || '').toUpperCase()}`, 14, 40);
      
      doc.line(14, 45, 196, 45);
      
      // Main Stats block
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Executive Performance Summary", 14, 55);
      
      doc.setFontSize(11);
      doc.setFont("Helvetica", "normal");
      doc.text(`- Consolidated Revenue Gross: $${computedStats.totalRevenue.toLocaleString()}`, 14, 65);
      doc.text(`- Invoiced Sales Volume: ${computedStats.totalOrders} total completed orders`, 14, 72);
      doc.text(`- Client Portal Account Registrations: ${computedStats.totalCustomers} registered segments`, 14, 79);
      doc.text(`- Team Service Contracts Active: ${computedStats.activeServices} active milestones`, 14, 86);
      doc.text(`- Digital Catalog Template Downloads: ${computedStats.digitalSales} file download cycles`, 14, 93);
      doc.text(`- Live Virtual Online Visitors: ${liveVisitors} active sockets`, 14, 100);
      
      doc.line(14, 110, 196, 110);
      
      // Detail table based on current tab
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Fulfillment & Ledger Details", 14, 120);
      
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      let lineY = 130;
      
      orders.slice(0, 10).forEach((o, i) => {
        const orderIdSafe = (o.id || '').slice(-8).toUpperCase();
        const customerNameSafe = (o.customerName || 'Guest').padEnd(20);
        const orderPrice = o.total !== undefined ? o.total : (o.price !== undefined ? o.price : 0);
        const orderTotalSafe = orderPrice.toString().padEnd(6);
        const orderStatusSafe = (o.status || o.paymentStatus || 'pending').toUpperCase();
        const orderDateSafe = o.date || 'N/A';
        doc.text(`${orderIdSafe} | ${customerNameSafe} | $${orderTotalSafe} | ${orderStatusSafe} | ${orderDateSafe}`, 14, lineY);
        lineY += 8;
      });
      
      doc.save(`WebzoneBD_ExecutiveReport_${currentReportTab}_${Date.now()}.pdf`);
      triggerToast("📥 Premium Enterprise PDF Report downloaded successfully.");
      logAdminAction(`Exported PDF business report for segment: ${currentReportTab}`);
    } catch (e) {
      console.error(e);
      triggerToast("❌ PDF Generation failed. Fallback to CSV.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Recharts custom colors for premium gradient aesthetics
  const PURPLE_GRAD = ['#7C3AED', '#A855F7', '#EC4899'];
  const EMERALD_GRAD = ['#10B981', '#059669', '#34D399'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 7. PREMIUM GLASSMORPHIC NAVIGATION SELECTOR HEADER */}
      <div className={`p-6 rounded-[20px] border relative overflow-hidden ${
        isDark 
          ? 'bg-[#0F172A] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]' 
          : 'bg-white border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white">
                <Activity className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#7C3AED] dark:text-purple-400">
                Business Intelligence Center
              </span>
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform Reports & Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Platform BI center collecting, visualizing, and reporting telemetry for Customers, Orders, Services, Digital Store, Finance, Marketing, and Traffic.
            </p>
          </div>

          {/* Real-time Tickers */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-white/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div className="font-mono text-xs">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Online</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{liveVisitors} Sockets</span>
              </div>
            </div>

            {/* Refresh Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Refresh:</span>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 text-xs font-mono rounded-lg border dark:bg-slate-900 dark:border-white/10 dark:text-white border-slate-200"
              >
                <option value={0}>Disabled</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
              </select>
            </div>
            
            {/* Manual Trigger */}
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => {
                  setLastRefreshedTime(new Date().toLocaleTimeString());
                  setIsRefreshing(false);
                  triggerToast("🔄 Reports refreshed manually.");
                }, 600);
              }}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 13-Segment Submenu Matrix Selection */}
        <div className="mt-6 pt-6 border-t border-dashed border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'rep-analytics', label: '🚀 Advanced Analytics' },
              { id: 'rep-overview', label: '📊 Overview' },
              { id: 'rep-visitors', label: '👁️ Visitors' },
              { id: 'rep-customer', label: '👥 Customers' },
              { id: 'rep-sales', label: '📈 Sales' },
              { id: 'rep-store', label: '🛍️ Digital Store' },
              { id: 'rep-services', label: '💼 Services' },
              { id: 'rep-financial', label: '💳 Financial' },
              { id: 'rep-marketing', label: '📢 Marketing' },
              { id: 'rep-device', label: '💻 Devices' },
              { id: 'rep-browser', label: '🌐 Browsers' },
              { id: 'rep-realtime', label: '⚡ Live Feed' },
              { id: 'rep-export', label: '📥 Export Center' }
            ].map((tab) => {
              const isTabActive = currentReportTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubMenu(tab.id);
                    triggerToast(`Switched view to ${tab.label}`);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-[11px] font-black font-sans transition-all duration-200 cursor-pointer flex items-center justify-center text-center leading-tight border ${
                    isTabActive 
                      ? `bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-lg shadow-purple-500/25 scale-[1.02] border-transparent` 
                      : `text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white ${isDark ? 'border-white/[0.04]' : 'border-slate-200'}`
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8. RENDER SCREEN VIEWS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentReportTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* ==================================================
              0. ADVANCED ANALYTICS & BUSINESS INTELLIGENCE HUB
             ================================================== */}
          {currentReportTab === 'rep-analytics' && (
            <AdminAdvancedAnalytics
              language={'en'}
              theme={isDark ? 'dark' : 'light'}
              orders={orders as any}
              products={products as any}
              customers={customers as any}
              tickets={tickets as any}
              triggerToast={triggerToast}
            />
          )}

          {/* ==================================================
              1. DASHBOARD OVERVIEW
             ================================================== */}
          {currentReportTab === 'rep-overview' && (
            <div className="space-y-6">
              
              {/* Quick Launch Banner to Advanced Analytics */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                      <span>Interactive Advanced Analytics & Multi-Stream BI Hub</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">NEW</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Explore detailed Recharts visualizers for Total Sales, New Users, Popular Catalog items, and Marketing Campaign ROAS.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubMenu('rep-analytics')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-black hover:scale-105 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Launch Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Show/Hide widget panel and Layout settings */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-mono font-bold">Customize Overview KPI Widgets Grid:</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {widgets.map(w => (
                    <button
                      key={w.id}
                      onClick={() => toggleWidgetVisibility(w.id)}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                        w.visible 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent opacity-60'
                      }`}
                    >
                      {w.visible ? '✓' : '✗'} {w.label}
                    </button>
                  ))}
                  <button
                    onClick={saveWidgetLayout}
                    className="ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[10px] font-black font-mono hover:scale-105 active:scale-95 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Dynamic KPI widgets grid ordered by layout pref */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...widgets]
                  .sort((a, b) => a.order - b.order)
                  .filter(w => w.visible)
                  .map((widget) => {
                    let value = '';
                    let subtext = '';
                    let icon = <Activity className="w-5 h-5 text-purple-500" />;
                    let trendColor = 'text-emerald-500';
                    let miniGraphData = [
                      { val: 10 }, { val: 15 }, { val: 12 }, { val: 18 }, { val: 14 }, { val: 22 }, { val: 20 }
                    ];

                    switch (widget.id) {
                      case 'total-revenue':
                        value = `$${computedStats.totalRevenue.toLocaleString()}`;
                        subtext = '▲ +24% vs last month';
                        icon = <DollarSign className="w-5 h-5 text-emerald-500" />;
                        miniGraphData = [{ val: 12 }, { val: 22 }, { val: 19 }, { val: 28 }, { val: 32 }, { val: 40 }, { val: 45 }];
                        break;
                      case 'total-orders':
                        value = `${computedStats.totalOrders} Units`;
                        subtext = '▲ +12% YoY';
                        icon = <ShoppingBag className="w-5 h-5 text-purple-500" />;
                        miniGraphData = [{ val: 5 }, { val: 8 }, { val: 12 }, { val: 10 }, { val: 15 }, { val: 14 }, { val: 20 }];
                        break;
                      case 'total-customers':
                        value = `${computedStats.totalCustomers} Clients`;
                        subtext = '▲ +8% Growth rate';
                        icon = <Users className="w-5 h-5 text-sky-500" />;
                        miniGraphData = [{ val: 100 }, { val: 110 }, { val: 115 }, { val: 120 }, { val: 130 }, { val: 145 }, { val: 155 }];
                        break;
                      case 'active-services':
                        value = `${computedStats.activeServices} Active`;
                        subtext = '✓ Delivery rate 98.2%';
                        icon = <Award className="w-5 h-5 text-amber-500" />;
                        miniGraphData = [{ val: 2 }, { val: 3 }, { val: 4 }, { val: 4 }, { val: 5 }, { val: 5 }, { val: 6 }];
                        break;
                      case 'digital-sales':
                        value = `${computedStats.digitalSales} Files`;
                        subtext = '▲ +15% conversion';
                        icon = <Layers className="w-5 h-5 text-pink-500" />;
                        miniGraphData = [{ val: 10 }, { val: 18 }, { val: 15 }, { val: 24 }, { val: 28 }, { val: 32 }, { val: 38 }];
                        break;
                      case 'monthly-growth':
                        value = `${computedStats.monthlyGrowth}%`;
                        subtext = '▲ +2.1% peak trend';
                        icon = <TrendingUp className="w-5 h-5 text-fuchsia-500" />;
                        miniGraphData = [{ val: 12 }, { val: 14 }, { val: 15 }, { val: 14 }, { val: 16 }, { val: 17 }, { val: 18 }];
                        break;
                      case 'conversion-rate':
                        value = `${computedStats.conversionRate}%`;
                        subtext = '✓ High-tier SaaS';
                        icon = <Percent className="w-5 h-5 text-teal-500" />;
                        miniGraphData = [{ val: 2.5 }, { val: 3.1 }, { val: 2.8 }, { val: 3.4 }, { val: 3.2 }, { val: 3.5 }, { val: 3.65 }];
                        break;
                      case 'website-visitors':
                        value = `${liveVisitors}`;
                        subtext = 'Live online tracking';
                        icon = <Globe className="w-5 h-5 text-violet-500" />;
                        miniGraphData = [{ val: 110 }, { val: 125 }, { val: 120 }, { val: 135 }, { val: 130 }, { val: 142 }, { val: liveVisitors }];
                        break;
                      case 'support-tickets':
                        value = `${computedStats.supportTickets}`;
                        subtext = 'SLA resolution met';
                        icon = <MessageSquare className="w-5 h-5 text-indigo-500" />;
                        miniGraphData = [{ val: 15 }, { val: 12 }, { val: 10 }, { val: 8 }, { val: 6 }, { val: 4 }, { val: 3 }];
                        trendColor = 'text-amber-500';
                        break;
                      case 'refund-requests':
                        value = `${computedStats.refundRequests}`;
                        subtext = '✓ Loss rate <0.5%';
                        icon = <Clock className="w-5 h-5 text-rose-500" />;
                        miniGraphData = [{ val: 1 }, { val: 0 }, { val: 1 }, { val: 0 }, { val: 0 }, { val: 1 }, { val: 0 }];
                        trendColor = 'text-rose-500';
                        break;
                    }

                    return (
                      <div key={widget.id} className={`p-4 rounded-[20px] border relative transition-all duration-300 group hover:-translate-y-1 ${
                        isDark 
                          ? 'bg-[#0F172A] border-white/5 shadow-md hover:border-purple-500/30' 
                          : 'bg-white border-slate-200 shadow-sm hover:border-purple-500/30'
                      }`}>
                        
                        {/* Drag and Drop layout indicators */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-150 transition-all flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-md">
                          <button onClick={() => moveWidgetOrder(widget.id, 'up')} className="hover:text-purple-500 text-[10px] font-bold px-1 font-mono">▲</button>
                          <button onClick={() => moveWidgetOrder(widget.id, 'down')} className="hover:text-purple-500 text-[10px] font-bold px-1 font-mono">▼</button>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide block">{widget.label}</span>
                            <span className={`text-2xl font-mono font-black block mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
                          </div>
                          <span className="p-2 rounded-xl bg-slate-150/40 dark:bg-slate-900 border dark:border-white/5">{icon}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-[10px] font-bold ${trendColor}`}>{subtext}</span>
                          
                          {/* Mini sparkline graph */}
                          <div className="w-16 h-8 opacity-70">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={miniGraphData}>
                                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.5} fillOpacity={0.05} fill="#7C3AED" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>

              {/* Main consolidation area charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className={`lg:col-span-2 p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed dark:border-white/10 border-slate-200">
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                        <span>Executive Growth Projection Analytics</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Comparing direct completed checkout totals vs server connection socket loads.</p>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', Revenue: 12000, Visitors: 11000, Conversion: 3.1 },
                        { name: 'Feb', Revenue: 15400, Visitors: 13000, Conversion: 3.3 },
                        { name: 'Mar', Revenue: 18200, Visitors: 16500, Conversion: 3.5 },
                        { name: 'Apr', Revenue: 17100, Visitors: 15000, Conversion: 3.4 },
                        { name: 'May', Revenue: 19800, Visitors: 19000, Conversion: 3.8 },
                        { name: 'Jun', Revenue: computedStats.totalRevenue || 22400, Visitors: liveVisitors * 84, Conversion: 3.65 }
                      ]}>
                        <defs>
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                        <Area type="monotone" name="Revenue Gross ($)" dataKey="Revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#purpleGrad)" />
                        <Area type="monotone" name="Visitors" dataKey="Visitors" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#pinkGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Growth Rate bento widget cards */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Core Engine Latencies</h4>
                  
                  <div className="space-y-4 pt-2">
                    {[
                      { name: 'bKash Callback Endpoint Node', delay: '14ms', rate: '99.98%', pct: 98 },
                      { name: 'WordPress WP-JSON Import Engine', delay: '124ms', rate: '94.85%', pct: 85 },
                      { name: 'Google Cloud Run Ingress Proxy', delay: '8ms', rate: '100%', pct: 100 },
                      { name: 'Client Portal JWT Authenticator', delay: '22ms', rate: '99.91%', pct: 95 }
                    ].map((srv, idx) => (
                      <div key={idx} className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200">{srv.name}</span>
                          <span className="text-purple-400">{srv.delay}</span>
                        </div>
                        <div className="w-full bg-slate-250 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border dark:border-white/5">
                          <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-full" style={{ width: `${srv.pct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] opacity-60">
                          <span>Verified Connection</span>
                          <span>{srv.rate} uptime</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl border border-dashed border-[#7C3AED]/30 bg-[#7C3AED]/5 font-mono text-xs text-center">
                    <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1.5 animate-pulse" />
                    <span className="font-black text-slate-800 dark:text-white">Autorefresh Active Stream</span>
                    <p className="text-[10px] text-slate-400 mt-1">Platform telemetry synchronizing at 100% precision. Last refresh: {lastRefreshedTime}</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              2. VISITOR ANALYTICS
             ================================================== */}
          {currentReportTab === 'rep-visitors' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Sessions", val: liveVisitors, sub: "Live user connections" },
                  { label: "Current Online Sockets", val: `${Math.floor(liveVisitors * 1.4)} Channels`, sub: "WebSocket live nodes" },
                  { label: "Live Page Views", val: `${Math.floor(liveVisitors * 4.2)} Views`, sub: "Last 5 minute stream" },
                  { label: "Returning Visitors Rate", val: "34.8%", sub: "Cohort retention index" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-2xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Geographic analytics */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Geographic Analytics Node Distribution</h4>
                  <p className="text-xs text-slate-400 font-mono">Detailed metric index by country, city, regional ISP nodes, and b2b click volumes.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                          <th className="pb-3 font-semibold">Location (Country/City)</th>
                          <th className="pb-3 font-semibold text-right">Visitors</th>
                          <th className="pb-3 font-semibold text-right">Unique Visitors</th>
                          <th className="pb-3 font-semibold text-right">Page Views</th>
                          <th className="pb-3 font-semibold text-right">Avg Time</th>
                          <th className="pb-3 font-semibold text-right">Bounce Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {[
                          { node: '🇧🇩 Dhaka Division', visitors: 14820, unique: 11000, views: 54000, time: '14m 20s', bounce: '24.2%' },
                          { node: '🇧🇩 Chittagong Node', visitors: 8240, unique: 6100, views: 28000, time: '11m 05s', bounce: '28.5%' },
                          { node: '🇸🇦 Riyadh Capital Node', visitors: 3500, unique: 2800, views: 12400, time: '18m 45s', bounce: '18.1%' },
                          { node: '🇶🇦 Doha GCC Node', visitors: 2800, unique: 2200, views: 10800, time: '15m 12s', bounce: '20.4%' },
                          { node: '🇺🇸 Los Angeles West', visitors: 1200, unique: 980, views: 4200, time: '8m 40s', bounce: '34.8%' },
                          { node: '🇬🇧 London Central', visitors: 850, unique: 710, views: 2900, time: '10m 15s', bounce: '30.2%' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                            <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{row.node}</td>
                            <td className="py-2.5 text-right font-bold text-purple-400">{row.visitors.toLocaleString()}</td>
                            <td className="py-2.5 text-right">{row.unique.toLocaleString()}</td>
                            <td className="py-2.5 text-right">{row.views.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-black text-amber-500">{row.time}</td>
                            <td className="py-2.5 text-right text-rose-500 font-bold">{row.bounce}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Page analytics */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Page Route Performance & Traffic Volumes</h4>
                  <p className="text-xs text-slate-400 font-mono">Detailed routing telemetry measuring exit rates, unique hits, and path conversions.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                          <th className="pb-3 font-semibold">Page Route Target</th>
                          <th className="pb-3 font-semibold text-right">Views</th>
                          <th className="pb-3 font-semibold text-right">Unique Views</th>
                          <th className="pb-3 font-semibold text-right">Avg Time</th>
                          <th className="pb-3 font-semibold text-right">Exit Rate</th>
                          <th className="pb-3 font-semibold text-right">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {[
                          { page: '/store/bkash-payment-gateway', views: 24800, unique: 18500, time: '8m 42s', exit: '14.2%', conv: '5.85%' },
                          { page: '/services/website-development', views: 18200, unique: 14000, time: '11m 15s', exit: '18.1%', conv: '4.20%' },
                          { page: '/checkout', views: 12400, unique: 11000, time: '14m 50s', exit: '28.4%', conv: '22.84%' },
                          { page: '/blog/wordpress-bdt-setup', views: 8200, unique: 6100, viewsText: '8,200', time: '4m 12s', exit: '42.5%', conv: '1.24%' },
                          { page: '/store/wordpress-theme-pro', views: 6500, unique: 5200, time: '6m 22s', exit: '22.1%', conv: '3.80%' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                            <td className="py-2.5 font-bold text-[#7C3AED] dark:text-purple-400 max-w-[200px] truncate">{row.page}</td>
                            <td className="py-2.5 text-right font-bold text-slate-800 dark:text-white">{row.views.toLocaleString()}</td>
                            <td className="py-2.5 text-right">{row.unique.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-bold text-teal-500">{row.time}</td>
                            <td className="py-2.5 text-right text-rose-500 font-semibold">{row.exit}</td>
                            <td className="py-2.5 text-right text-emerald-500 font-bold">{row.conv}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              3. CUSTOMER REPORTS
             ================================================== */}
          {currentReportTab === 'rep-customer' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "New Registrations", val: customers.length, sub: "Registered users database size" },
                  { label: "Active Customers", val: customers.filter(c => c.status === 'active').length, sub: "Active SaaS portals" },
                  { label: "Premium Customers", val: customers.filter(c => c.customerType?.includes('VIP') || c.totalSpent > 1000).length, sub: "Spent > $1,000 threshold" },
                  { label: "Repeat Customers Rate", val: "78.4%", sub: "Multiple catalog transactions" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-2xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              {/* Customer charts and Cohorts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className={`lg:col-span-2 p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-4">Customer Acquisition & Growth Trend</h4>
                  
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Jan', Active: 80, VIP: 12, Guest: 30 },
                        { name: 'Feb', Active: 95, VIP: 15, Guest: 35 },
                        { name: 'Mar', Active: 120, VIP: 22, Guest: 40 },
                        { name: 'Apr', Active: 110, VIP: 20, Guest: 32 },
                        { name: 'May', Active: 135, VIP: 28, Guest: 48 },
                        { name: 'Jun', Active: computedStats.totalCustomers || 150, VIP: 34, Guest: 55 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Active" name="Active Portal Users" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="VIP" name="VIP/High Value Customers" fill="#EC4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">High-Value VIP Cohorts</h4>
                  
                  <div className="space-y-3 pt-2">
                    {customers
                      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
                      .slice(0, 5)
                      .map((c, idx) => (
                        <div key={idx} className="p-3 rounded-xl border dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="font-black block text-slate-800 dark:text-white">{c.name}</span>
                            <span className="text-[10px] text-slate-400 block">{c.companyName || 'Private Enterprise'}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#7C3AED] dark:text-purple-400 block">${(c.totalSpent || 0).toLocaleString()}</span>
                            <span className="text-[9px] text-emerald-500 font-bold">VIP Status</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              4. SALES REPORTS
             ================================================== */}
          {currentReportTab === 'rep-sales' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Daily Sales Invoiced", val: `$${(computedStats.totalRevenue / 30).toFixed(2)}`, sub: "Daily average checkouts" },
                  { label: "Weekly Sales Sum", val: `$${(computedStats.totalRevenue / 4.2).toFixed(2)}`, sub: "Weekly consolidated sales" },
                  { label: "Monthly Gross Sales", val: `$${computedStats.totalRevenue.toLocaleString()}`, sub: "Active billing interval total" },
                  { label: "Yearly Projected Sales", val: `$${(computedStats.totalRevenue * 12).toLocaleString()}`, sub: "Estimated base ARR" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className={`lg:col-span-2 p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-4">Consolidated Sales Trend & Revenue Progression</h4>
                  
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', Sales: 8200 },
                        { name: 'Feb', Sales: 11400 },
                        { name: 'Mar', Sales: 15100 },
                        { name: 'Apr', Sales: 13500 },
                        { name: 'May', Sales: 18400 },
                        { name: 'Jun', Sales: computedStats.totalRevenue || 22400 }
                      ]}>
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <Tooltip />
                        <Area type="monotone" name="Invoiced Revenue" dataKey="Sales" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">WooCommerce Top Categories Share</h4>
                  
                  <div className="w-full h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Web Dev Services', value: 45 },
                            { name: 'Digital Store Scripts', value: 35 },
                            { name: 'SEO Optimization Packs', value: 12 },
                            { name: 'Ad Campaigns Retainers', value: 8 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#7C3AED" />
                          <Cell fill="#A855F7" />
                          <Cell fill="#EC4899" />
                          <Cell fill="#E2E8F0" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> 45% Development</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" /> 35% Scripts Catalog</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> 12% SEO Packages</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> 8% Marketing</div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              5. DIGITAL STORE REPORTS
             ================================================== */}
          {currentReportTab === 'rep-store' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Product Downloads", val: `${computedStats.digitalSales} Files`, sub: "Clean ZIP/Tarball deliveries" },
                  { label: "Most Downloaded Product", val: "bKash API script", sub: "1,480 catalog downloads" },
                  { label: "License Activations Key", val: "3,248 Keys", sub: "Digital template compliance" },
                  { label: "Digital Store Conversion", val: "5.82%", sub: "Cart-to-completion index" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                <h4 className="font-black text-sm uppercase tracking-wider">WooCommerce Store Catalog Performance Matrix</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                        <th className="pb-3 font-semibold">Product Title</th>
                        <th className="pb-3 font-semibold text-right">Downloads Count</th>
                        <th className="pb-3 font-semibold text-right">Digital Gross Revenue</th>
                        <th className="pb-3 font-semibold text-right">Conversion Success Rate</th>
                        <th className="pb-3 font-semibold text-right">Satisfaction rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {[
                        { title: 'Secure bKash API Integration Script', downloads: 1480, rev: '$29,600', conv: '12.4%', rating: 4.9 },
                        { title: 'React Landing Glassmorphic Bundle Package', downloads: 1120, rev: '$16,800', conv: '8.5%', rating: 4.8 },
                        { title: 'Advanced SEO Crawler Optimization Package', downloads: 850, rev: '$8,500', conv: '6.2%', rating: 4.5 },
                        { title: 'WordPress Enterprise Multipurpose Theme', downloads: 730, rev: '$14,600', conv: '5.1%', rating: 4.7 }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{row.title}</td>
                          <td className="py-3 text-right text-purple-400 font-bold">{row.downloads.toLocaleString()}x</td>
                          <td className="py-3 text-right font-bold text-emerald-500">{row.rev}</td>
                          <td className="py-3 text-right text-teal-500 font-semibold">{row.conv}</td>
                          <td className="py-3 text-right text-amber-500 font-bold">★ {row.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              6. SERVICE REPORTS
             ================================================== */}
          {currentReportTab === 'rep-services' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Service Orders Invoiced", val: `${projects.length} Contracts`, sub: "Signed client portal files" },
                  { label: "Completed Projects", val: `${projects.filter(p => p.status === 'completed').length} Milestone`, sub: "Successfully delivered" },
                  { label: "Pending Projects Base", val: `${projects.filter(p => p.status === 'pending_brief').length} Briefs`, sub: "Awaiting customer design brief" },
                  { label: "Active Project Pipelines", val: `${projects.filter(p => p.status === 'in_progress').length} In Progress`, sub: "Under development cycle" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Team performance velocity */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Milestone SLA Performance & Velocities</h4>
                  <p className="text-xs text-slate-400 font-mono">Assigned engineering staff sprint velocities, delivery rate indices, and client ratings.</p>

                  <div className="space-y-4 pt-2">
                    {[
                      { staff: 'Anisur Rahman (Lead Dev)', rate: '98.2%', velocity: '95/100 pts', tasks: '12 completed' },
                      { staff: 'Sayeeda Yeasmin (Support Specialist)', rate: '94.5%', velocity: '88/100 pts', tasks: '45 tickets closed' },
                      { staff: 'Tariqul Islam (SEO Expert)', rate: '96.8%', velocity: '90/100 pts', tasks: '8 crawler optimizations' },
                      { staff: 'Fahim Morshed (DevOps Engineer)', rate: '100%', velocity: '98/100 pts', tasks: '4 database backups verified' }
                    ].map((row, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 flex justify-between items-center text-xs font-mono">
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200">{row.staff}</span>
                          <span className="text-[10px] text-slate-400 block">{row.tasks}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-purple-400 block">{row.rate} Deliverability</span>
                          <span className="text-[9px] text-emerald-500 font-bold">Velocity: {row.velocity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Satisfaction score cards */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Enterprise Retainers CSAT Tracker</h4>
                  
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <Star className="w-12 h-12 text-amber-500 fill-amber-500 mx-auto animate-bounce" />
                      <span className="text-4xl font-mono font-black block mt-3">4.92 / 5.0</span>
                      <p className="text-xs text-slate-400 mt-1">Global Client Satisfaction Index (BST)</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-3 inline-block">
                        EXCELLENT
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              7. FINANCIAL REPORTS
             ================================================== */}
          {currentReportTab === 'rep-financial' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Gross Revenue", val: `$${computedStats.totalRevenue.toLocaleString()}`, sub: "Consolidated system total" },
                  { label: "Estimated Net Profit", val: `$${(computedStats.totalRevenue * 0.85).toLocaleString()}`, sub: "85% direct margin estimate" },
                  { label: "Processing & Gateway Fees", val: `$${(computedStats.totalRevenue * 0.022).toLocaleString()}`, sub: "SSLCommerz & Stripe fees" },
                  { label: "Active Wallet Balances", val: `$1,820`, sub: "Customer deposits ledger" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Gateway Breakdown charts */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Gateway Transaction Volumes Breakdown</h4>
                  
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Stripe', Volume: computedStats.totalRevenue * 0.45 },
                        { name: 'bKash API', Volume: computedStats.totalRevenue * 0.35 },
                        { name: 'Nagad Node', Volume: computedStats.totalRevenue * 0.15 },
                        { name: 'PayPal GCC', Volume: computedStats.totalRevenue * 0.05 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <Tooltip />
                        <Bar dataKey="Volume" fill="#7C3AED" radius={[6, 6, 0, 0]}>
                          <Cell fill="#7C3AED" />
                          <Cell fill="#A855F7" />
                          <Cell fill="#EC4899" />
                          <Cell fill="#F59E0B" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gateway list */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Gateway Merchant Fee Rates Ledger</h4>
                  
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Stripe Global (Credit Card)', rate: '2.9% + $0.30', revenue: `$${(computedStats.totalRevenue * 0.45).toLocaleString()}`, status: 'Instant Settlement' },
                      { name: 'bKash API Commercial Node', rate: '1.85% flat', revenue: `$${(computedStats.totalRevenue * 0.35).toLocaleString()}`, status: '24h settlement' },
                      { name: 'Nagad Commercial Merchant API', rate: '1.80% flat', revenue: `$${(computedStats.totalRevenue * 0.15).toLocaleString()}`, status: '24h settlement' },
                      { name: 'PayPal Gateway (International)', rate: '3.4% + $0.30', revenue: `$${(computedStats.totalRevenue * 0.05).toLocaleString()}`, status: '48h settlement' }
                    ].map((gate, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 flex justify-between items-center text-xs font-mono">
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200">{gate.name}</span>
                          <span className="text-[10px] text-slate-400 block">Processing rate: {gate.rate}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-[#EC4899] block">{gate.revenue}</span>
                          <span className="text-[9px] text-emerald-500 font-bold">{gate.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              8. MARKETING REPORTS
             ================================================== */}
          {currentReportTab === 'rep-marketing' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Google Ads Spend", val: "$1,240", sub: "+450 Conversion Leads" },
                  { label: "Facebook Ads ROI", val: "3.42x", sub: "$850 spend / $2,900 return" },
                  { label: "Email CTR Campaign", val: "14.25%", sub: "WZ Newsletter campaign #26" },
                  { label: "Cost Per Lead (CPL)", val: "$2.75", sub: "✓ Enterprise target met" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Campaign performance cards */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Active Marketing Campaigns Performance</h4>
                  
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Google Search Ads (Target BD)', conversions: 340, spend: '$800', roi: '4.2x ROI' },
                      { name: 'Facebook Lead Campaign (GCC)', conversions: 120, spend: '$450', roi: '2.8x ROI' },
                      { name: 'Email Blaster Campaign #26', conversions: 85, spend: '$120', roi: '7.1x ROI' },
                      { name: 'WhatsApp CRM Broadcast Leads', conversions: 48, spend: '$0', roi: 'Organic Infinite' }
                    ].map((cmp, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 flex justify-between items-center text-xs font-mono">
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200">{cmp.name}</span>
                          <span className="text-[10px] text-slate-400 block">Conversions count: {cmp.conversions}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-purple-400 block">{cmp.roi}</span>
                          <span className="text-[9px] text-emerald-500 font-bold">Cost spend: {cmp.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion sources analysis */}
                <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                  <h4 className="font-black text-sm uppercase tracking-wider">Acquisition Funnel Metrics</h4>
                  
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Discovery', Leads: 1000 },
                        { name: 'Click', Leads: 600 },
                        { name: 'Engagement', Leads: 340 },
                        { name: 'Inquiry', Leads: 150 },
                        { name: 'Conversion', Leads: computedStats.totalOrders || 85 }
                      ]}>
                        <defs>
                          <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke={isDark ? "#475569" : "#94A3B8"} fontSize={10} fontFamily="JetBrains Mono" />
                        <Tooltip />
                        <Area type="monotone" name="Users in Stage" dataKey="Leads" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#leadsGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              9. DEVICE ANALYTICS
             ================================================== */}
          {currentReportTab === 'rep-device' && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                <h4 className="font-black text-sm uppercase tracking-wider">Device Type Session Analytics Matrix</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                        <th className="pb-3 font-semibold">Device Type Class</th>
                        <th className="pb-3 font-semibold text-right">Sessions Count</th>
                        <th className="pb-3 font-semibold text-right">Avg Session Duration</th>
                        <th className="pb-3 font-semibold text-right">Bounce Rate Index</th>
                        <th className="pb-3 font-semibold text-right">Checkout Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {[
                        { type: '📱 Smartphone / iOS & Android', sessions: 18450, time: '12m 45s', bounce: '24.2%', conversion: '4.85%' },
                        { type: '💻 Desktop / macOS & Windows PC', sessions: 11200, time: '18m 20s', bounce: '18.1%', conversion: '3.22%' },
                        { type: '平板 Tablet / iPad OS', sessions: 2800, unique: '3,500', time: '14m 10s', bounce: '22.4%', conversion: '2.50%' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{row.type}</td>
                          <td className="py-3 text-right text-purple-400 font-bold">{row.sessions.toLocaleString()}</td>
                          <td className="py-3 text-right font-bold text-teal-500">{row.time}</td>
                          <td className="py-3 text-right text-rose-500 font-semibold">{row.bounce}</td>
                          <td className="py-3 text-right text-emerald-500 font-bold">{row.conversion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              10. BROWSER ANALYTICS
             ================================================== */}
          {currentReportTab === 'rep-browser' && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                <h4 className="font-black text-sm uppercase tracking-wider">Web Browser Distribution Logs Matrix</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                        <th className="pb-3 font-semibold">Web Browser Software</th>
                        <th className="pb-3 font-semibold text-right">User Sessions</th>
                        <th className="pb-3 font-semibold text-right">Unique Visitors</th>
                        <th className="pb-3 font-semibold text-right">Bounce Rate Index</th>
                        <th className="pb-3 font-semibold text-right">Conversion Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {[
                        { browser: '🌐 Google Chrome Edge Node', sessions: 24800, visitors: 18500, bounce: '22.4%', conversion: '3.84%' },
                        { browser: '🍏 Apple Safari iOS/macOS', sessions: 8500, visitors: 6100, bounce: '24.2%', conversion: '4.22%' },
                        { browser: '🦊 Mozilla Firefox Developer', sessions: 2800, visitors: 2200, bounce: '18.1%', conversion: '2.80%' },
                        { browser: '🌐 Microsoft Edge Webview', sessions: 1200, visitors: 980, bounce: '30.2%', conversion: '2.10%' },
                        { browser: '🌐 Samsung Internet Mobile', sessions: 850, visitors: 710, bounce: '28.5%', conversion: '2.50%' },
                        { browser: '⭕ Opera Software Mini', sessions: 450, visitors: 320, bounce: '34.8%', conversion: '1.80%' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{row.browser}</td>
                          <td className="py-3 text-right text-purple-400 font-bold">{row.sessions.toLocaleString()}</td>
                          <td className="py-3 text-right">{row.visitors.toLocaleString()}</td>
                          <td className="py-3 text-right text-rose-500 font-semibold">{row.bounce}</td>
                          <td className="py-3 text-right text-emerald-500 font-bold">{row.conversion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              11. REAL-TIME MONITORING
             ================================================== */}
          {currentReportTab === 'rep-realtime' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Live Active Visitors", val: liveVisitors, sub: "TCP live sockets" },
                  { label: "Live System Orders", val: `${orders.filter(o => o.status === 'processing').length || 1} Processing`, sub: "Database transaction active" },
                  { label: "Live Support Requests", val: `${tickets.filter(t => t.status === 'open').length || 1} Open`, sub: "SLA ticket chats active" },
                  { label: "Live Registrations Core", val: "2 Registrations", sub: "Last 60 mins database check" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[20px] border text-center ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-black">{item.label}</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED] dark:text-purple-400 block mt-2">{item.val}</span>
                    <span className="text-[9px] font-mono text-emerald-500 block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>

              {/* Live activity feed columns: Time, Customer, Activity, IP Address, Location, Status */}
              <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-sm uppercase tracking-wider">Live Activity Stream Ledger</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
                    STABLE SOOCKET
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                        <th className="pb-3 font-semibold">Time Handshake</th>
                        <th className="pb-3 font-semibold">Customer Segment</th>
                        <th className="pb-3 font-semibold">Activity Event Trace</th>
                        <th className="pb-3 font-semibold">IP Address</th>
                        <th className="pb-3 font-semibold">Location Region</th>
                        <th className="pb-3 font-semibold text-right">Status Node</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {liveActivityFeed.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-all">
                          <td className="py-3 text-slate-400">{act.time}</td>
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{act.customer}</td>
                          <td className="py-3 font-sans text-purple-400 font-medium">{act.activity}</td>
                          <td className="py-3 text-slate-500">{act.ip}</td>
                          <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{act.location}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${
                              act.status === 'Completed' || act.status === 'Cleared' || act.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-purple-500/10 text-purple-400'
                            }`}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              12. EXPORT CENTER
             ================================================== */}
          {currentReportTab === 'rep-export' && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-[20px] border ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-white border-slate-200'} space-y-6`}>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider">Enterprise Export Hub & Audit Backups</h4>
                  <p className="text-xs text-slate-400 font-mono">Select dates, filter metrics, and download legally compliant corporate summaries directly as CSV spread files, printed page designs, or encrypted PDF formats.</p>
                </div>

                {/* Date range selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed dark:border-white/10 border-slate-200">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase font-mono">Date Range Scope Filter</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      className={`h-[56px] px-4 rounded-[14px] font-medium text-sm outline-none transition-all duration-300 cursor-pointer ${
                        isDark 
                          ? 'bg-[#111827] border-[#374151] text-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/18' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/18'
                      }`}
                    >
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="custom">Custom Date Range</option>
                    </select>
                  </div>

                  {dateFilter === 'custom' && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase font-mono">Custom Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className={`h-[56px] px-4 rounded-[14px] font-medium text-sm outline-none transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#111827] border-[#374151] text-white focus:border-[#7C3AED]' 
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-[#7C3AED]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase font-mono">Custom End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className={`h-[56px] px-4 rounded-[14px] font-medium text-sm outline-none transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#111827] border-[#374151] text-white focus:border-[#7C3AED]' 
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-[#7C3AED]'
                          }`}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Exporter actions with strict CSS button theme alignments */}
                <div className="flex flex-wrap gap-4 pt-6">
                  
                  <button
                    onClick={() => generatePDF()}
                    className="h-[54px] px-6 rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-semibold hover:scale-[1.02] shadow-lg shadow-purple-500/35 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export Encrypted PDF</span>
                  </button>

                  <button
                    onClick={() => generateCSV('sales')}
                    className="h-[54px] px-6 rounded-[14px] border border-transparent bg-slate-100/90 dark:bg-slate-900/60 text-slate-800 dark:text-white font-semibold hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-md"
                  >
                    <Layers className="w-5 h-5 text-purple-500" />
                    <span>Export Sales CSV Spreadsheet</span>
                  </button>

                  <button
                    onClick={() => generateCSV('customers')}
                    className="h-[54px] px-6 rounded-[14px] border border-transparent bg-slate-100/90 dark:bg-slate-900/60 text-slate-800 dark:text-white font-semibold hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-md"
                  >
                    <Users className="w-5 h-5 text-pink-500" />
                    <span>Export Customer Segments</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="h-[54px] px-6 rounded-[14px] border border-[#7C3AED]/30 bg-transparent text-[#7C3AED] dark:text-purple-400 font-semibold hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#7C3AED]/5"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Statement</span>
                  </button>
                </div>

                {/* Displaying raw preview logs list */}
                <div className="pt-6 border-t border-dashed dark:border-white/10 border-slate-200">
                  <h4 className="font-mono text-xs text-slate-400 mb-4 uppercase font-semibold">Active Transaction Ledger Draft Preview (Last 10 units)</h4>
                  
                  <div className="overflow-x-auto rounded-xl border dark:border-white/5 bg-slate-100/30 dark:bg-slate-900/40 p-4">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b dark:border-white/5 border-slate-100 opacity-60">
                          <th className="pb-3">Order Target</th>
                          <th className="pb-3">Customer User</th>
                          <th className="pb-3 text-right">Sum Invoiced</th>
                          <th className="pb-3 text-right">Billing System</th>
                          <th className="pb-3 text-right">Fulfillment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {orders.slice(0, 10).map((o, idx) => {
                          const orderIdSafe = (o.id || '').slice(-8).toUpperCase();
                          const customerNameSafe = o.customerName || 'Guest';
                          const orderPrice = o.total !== undefined ? o.total : (o.price !== undefined ? o.price : 0);
                          const orderStatusSafe = o.status || o.paymentStatus || 'pending';
                          return (
                            <tr key={idx} className="hover:bg-slate-900/10">
                              <td className="py-2.5 font-bold text-purple-400">#{orderIdSafe}</td>
                              <td className="py-2.5 text-slate-800 dark:text-slate-200 font-sans font-bold">{customerNameSafe}</td>
                              <td className="py-2.5 text-right font-black text-emerald-500">${orderPrice}</td>
                              <td className="py-2.5 text-right text-slate-400">{o.gateway || o.paymentMethod || 'Stripe API'}</td>
                              <td className="py-2.5 text-right">
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${
                                  orderStatusSafe === 'completed' || orderStatusSafe === 'paid'
                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                    : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {orderStatusSafe.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
