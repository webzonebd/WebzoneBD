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
  Coins 
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

  if (user?.role === 'admin') {
    /* =========================================================================
       ADMIN PRIVILEGED CONTROL CENTER
       ========================================================================= */
    const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + o.price, 0);
    const activeClientsCount = 4; // Mocked aggregate metrics represented visually
    const systemMemory = '12.4 GB / 32 GB';
    const cpuPerformance = '14% Load';

    return (
      <div className="space-y-6">
        
        {/* Statistics Metric cards represent general administrative nodes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total System Revenue</span>
            <p className="text-2.5xl font-black text-indigo-500 dark:text-cyan-400 mt-1">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total System Orders</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Client Accounts Info</span>
            <p className="text-2.5xl font-black text-slate-900 dark:text-white mt-1">{activeClientsCount}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Tickets Requiring Attention</span>
            <p className="text-2.5xl font-black text-amber-500 mt-1">{tickets.filter(t => t.status === 'open').length}</p>
          </div>
        </div>

        {/* Administration Platform Utility Panel */}
        <div className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-md space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-cyan-405 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
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
              <span className="p-1 px-2.5 bg-indigo-500/10 text-indigo-500 text-[8px] font-black uppercase rounded self-start">Cache healthy</span>
            </div>
          </div>
        </div>

      </div>
    );
  } else {
    /* =========================================================================
       PREMIUM ACTIVE DATA CLIENT VIEW
       ========================================================================= */
    // Generate 6 months of historical billing data and aggregate with completed orders
    const chartData = (() => {
      // Standard baseline monthly spending representing typical hostings + custom service orders
      const baselines: Record<string, { products: number; services: number }> = {
        '01': { products: 12.00, services: 45.00 },
        '02': { products: 0.00, services: 15.00 },
        '03': { products: 24.00, services: 30.00 },
        '04': { products: 18.00, services: 55.00 },
        '05': { products: 8.50, services: 40.00 },
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
