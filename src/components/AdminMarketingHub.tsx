import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit, Check, X, Search, Filter, Download, Send, Sparkles, 
  Phone, Bell, MessageSquare, Globe, Users, UserCheck, Award, ShoppingBag, 
  FileText, Mail, Sliders, AlertCircle, TrendingUp, Activity, Clock, 
  Calendar, DollarSign, CheckCircle, RefreshCw, Play, Settings, Bot, ArrowRight, Clipboard
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminMarketingHubProps {
  activeSubMenu: string;
  triggerToast: (msg: string) => void;
  isDark: boolean;
  language: 'en' | 'bn' | 'ar';
}

export default function AdminMarketingHub({ 
  activeSubMenu, 
  triggerToast, 
  isDark,
  language 
}: AdminMarketingHubProps) {
  
  const isBng = language === 'bn';

  // State for SMS Campaigns
  const [smsCampaigns, setSmsCampaigns] = useState([
    { id: 'SMS-001', name: 'Eid Al-Adha Promo', template: 'Get 25% off on all VPS hosting plans with code EID25!', recipients: 1245, sentAt: '2026-06-15', status: 'delivered', clicks: 312 },
    { id: 'SMS-002', name: 'Domain Renewal Reminder', template: 'Your domain is about to expire. Renew today to avoid suspension.', recipients: 340, sentAt: '2026-07-02', status: 'delivered', clicks: 189 },
    { id: 'SMS-003', name: 'Black Friday Alert', template: 'Unbelievable offer! Up to 50% discount live now.', recipients: 4200, sentAt: 'Scheduled (2026-11-27)', status: 'scheduled', clicks: 0 },
  ]);
  const [newSmsName, setNewSmsName] = useState('');
  const [newSmsTemplate, setNewSmsTemplate] = useState('');
  const [smsGateway, setSmsGateway] = useState('twilio');

  // State for Push Notifications
  const [pushCampaigns, setPushCampaigns] = useState([
    { id: 'PSH-101', title: '⚡ Flash Sale Live!', message: 'Flat 30% discount on BDIX VPS nodes. Use coupon FLASH30.', sentAt: '2026-07-04', clicks: 520, ctr: '12.4%', status: 'Active' },
    { id: 'PSH-102', title: '🛠️ Server Maintenance Alert', message: 'US-East Node undergoing 10 mins optimization. No data loss.', sentAt: '2026-07-01', clicks: 1800, ctr: '85.2%', status: 'Completed' },
  ]);
  const [newPushTitle, setNewPushTitle] = useState('');
  const [newPushMessage, setNewPushMessage] = useState('');

  // State for WhatsApp Campaigns
  const [whatsAppCampaigns, setWhatsAppCampaigns] = useState([
    { id: 'WAP-201', name: 'Customer Welcome Bot Promo', template: 'Hello {{1}}, welcome to WebzoneBD. Enjoy free setup on your first order.', recipients: 820, sentAt: '2026-07-05', status: 'delivered', replies: 142 },
    { id: 'WAP-202', name: 'Premium Hosting Launch', template: 'Dear Partner, our premium high-frequency servers are now live.', recipients: 450, sentAt: '2026-06-20', status: 'delivered', replies: 88 },
  ]);
  const [newWapName, setNewWapName] = useState('');
  const [newWapTemplate, setNewWapTemplate] = useState('');

  // State for Social Campaigns
  const [socialCampaigns, setSocialCampaigns] = useState([
    { id: 'SOC-301', platform: 'Facebook', campaign: 'Eid Mega Giveaway Campaign', budget: 150, reach: 45000, engagement: 8200, status: 'Active' },
    { id: 'SOC-302', platform: 'Instagram', campaign: 'Laravel Dev Bundle Ads', budget: 200, reach: 38000, engagement: 6100, status: 'Active' },
    { id: 'SOC-303', platform: 'LinkedIn', campaign: 'Corporate IT Solutions B2B', budget: 350, reach: 18000, engagement: 1950, status: 'Completed' },
  ]);
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('Facebook');
  const [newSocialBudget, setNewSocialBudget] = useState(100);

  // State for Affiliate Partners
  const [affiliates, setAffiliates] = useState([
    { code: 'IMRAN50', partner: 'Imran Hasan', balance: 450.00, totalEarnings: 1820.00, referrals: 38, rate: '15%', status: 'Active' },
    { code: 'ZEESHAN10', partner: 'Zeeshan Rahman', balance: 120.00, totalEarnings: 840.00, referrals: 15, rate: '10%', status: 'Active' },
    { code: 'MAJID_IT', partner: 'Al-Shehri Majid', balance: 0.00, totalEarnings: 310.00, referrals: 8, rate: '12%', status: 'Suspended' },
  ]);
  const [newAffPartner, setNewAffPartner] = useState('');
  const [newAffCode, setNewAffCode] = useState('');
  const [newAffRate, setNewAffRate] = useState('10%');

  // State for Referral Program
  const [referrals, setReferrals] = useState([
    { id: 'REF-001', referrer: 'Rashed Khan', referee: 'Farhan Ahmed', reward: 15, code: 'RASHED77', status: 'Claimed', date: '2026-07-06' },
    { id: 'REF-002', referrer: 'Tasnim Alam', referee: 'Sadia Chowdhury', reward: 15, code: 'TASNIM12', status: 'Pending Verification', date: '2026-07-07' },
  ]);
  const [newRefReward, setNewRefReward] = useState(15);

  // State for Loyalty Program
  const [loyaltyTiers, setLoyaltyTiers] = useState([
    { name: 'Bronze', threshold: '0 - 500 Points', members: 124, cashback: '2%', perk: 'Standard Support' },
    { name: 'Silver', threshold: '501 - 2000 Points', members: 68, cashback: '5%', perk: 'Priority Ticket Support' },
    { name: 'Gold VIP', threshold: '2001+ Points', members: 19, cashback: '8%', perk: 'Dedicated Account Manager + Free Migration' },
  ]);
  const [pointsRate, setPointsRate] = useState(1); // 1 point per $ spent

  // State for Abandoned Cart Recovery
  const [abandonedCarts, setAbandonedCarts] = useState([
    { id: 'CRT-401', client: 'Karim Ullah', items: '2x High-Frequency VPS', value: 89, abandonedTime: '3 hours ago', recoveryStatus: 'Sms Sent', alertColor: 'text-amber-500' },
    { id: 'CRT-402', client: 'Michael S.', items: '1x BDIX Domain Registration + Hosting', value: 35, abandonedTime: '12 hours ago', recoveryStatus: 'Recovered', alertColor: 'text-emerald-500' },
    { id: 'CRT-403', client: 'Javed Alam', items: '1x Nagad Gateway Integration Service', value: 120, abandonedTime: '2 days ago', recoveryStatus: 'No Action Taken', alertColor: 'text-rose-500' },
  ]);

  // State for Lead Management
  const [leads, setLeads] = useState([
    { id: 'LED-501', name: 'Apex Logistics Ltd', email: 'it@apexbd.com', phone: '01712345678', source: 'Corporate Contact Us Form', service: 'Custom Web ERP Development', status: 'New Lead' },
    { id: 'LED-502', name: 'Dr. Shahabuddin', email: 'shahab@medicall.org', phone: '01898765432', source: 'VPS landing page chat popup', service: 'Managed HIPAA Cloud Node', status: 'In Discussion' },
    { id: 'LED-503', name: 'Rupali Bank Agent', email: 'digital@rupali.com', phone: '01511223344', source: 'API Partner Application', service: 'Bkash Merchant API Gateway', status: 'Converted' },
  ]);
  const [leadSearch, setLeadSearch] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadService, setNewLeadService] = useState('');

  // State for Newsletter Subscribers
  const [subscribers, setSubscribers] = useState([
    { id: 'SUB-1', email: 'admin@itbd-solutions.com', date: '2026-07-05', source: 'Footer Form', active: true },
    { id: 'SUB-2', email: 'kazi.nasir@gmail.com', date: '2026-07-03', source: 'Ebook Lead-gen Popup', active: true },
    { id: 'SUB-3', email: 'rezaul_hoque@outlook.com', date: '2026-06-28', source: 'Checkout opt-in', active: true },
  ]);
  const [newSubEmail, setNewSubEmail] = useState('');

  // State for Marketing Automation Workflows
  const [workflows, setWorkflows] = useState([
    { id: 'WFL-01', name: 'New Signup Welcome Campaign', triggers: 'On User Registration', steps: '3 Steps (Welcome Mail -> 24h SMS -> 48h Coupon Offer)', active: true },
    { id: 'WFL-02', name: 'BDIX Renewal Sequence', triggers: '15 Days before Expiry', steps: '2 Steps (WhatsApp notification -> 7 days SMS alert)', active: true },
    { id: 'WFL-03', name: 'High-Value Cart Recovery', triggers: 'Cart Abandoned > $100', steps: '2 Steps (Auto-apply EID10 Coupon -> WhatsApp Alert)', active: false },
  ]);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState('On User Registration');

  // Marketing Global Settings
  const [smtpServer, setSmtpServer] = useState('smtp.webzonebd.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [fbPixelId, setFbPixelId] = useState('78129038290138');
  const [gaMeasurementId, setGaMeasurementId] = useState('G-WEBD990XX');

  // Analytics Chart Data
  const analyticsData = [
    { name: 'Jan', revenue: 4000, campaigns: 3, recovery: 2400 },
    { name: 'Feb', revenue: 4500, campaigns: 4, recovery: 2210 },
    { name: 'Mar', revenue: 5100, campaigns: 5, recovery: 2290 },
    { name: 'Apr', revenue: 4800, campaigns: 6, recovery: 2000 },
    { name: 'May', revenue: 6100, campaigns: 8, recovery: 2181 },
    { name: 'Jun', revenue: 7500, campaigns: 11, recovery: 2500 },
    { name: 'Jul', revenue: 8900, campaigns: 14, recovery: 3400 },
  ];

  // Helper functions
  const handleAddSmsCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSmsName || !newSmsTemplate) return;
    const item = {
      id: `SMS-00${smsCampaigns.length + 1}`,
      name: newSmsName,
      template: newSmsTemplate,
      recipients: Math.floor(Math.random() * 2000) + 100,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'delivered',
      clicks: 0
    };
    setSmsCampaigns([item, ...smsCampaigns]);
    setNewSmsName('');
    setNewSmsTemplate('');
    triggerToast('📣 SMS Campaign broadcasted successfully!');
  };

  const handleAddPushCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPushTitle || !newPushMessage) return;
    const item = {
      id: `PSH-${100 + pushCampaigns.length + 1}`,
      title: newPushTitle,
      message: newPushMessage,
      sentAt: new Date().toISOString().split('T')[0],
      clicks: 0,
      ctr: '0.0%',
      status: 'Active'
    };
    setPushCampaigns([item, ...pushCampaigns]);
    setNewPushTitle('');
    setNewPushMessage('');
    triggerToast('🔔 Browser Push notification broadcast sent!');
  };

  const handleAddWhatsAppCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWapName || !newWapTemplate) return;
    const item = {
      id: `WAP-${200 + whatsAppCampaigns.length + 1}`,
      name: newWapName,
      template: newWapTemplate,
      recipients: Math.floor(Math.random() * 1500) + 50,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'delivered',
      replies: 0
    };
    setWhatsAppCampaigns([item, ...whatsAppCampaigns]);
    setNewWapName('');
    setNewWapTemplate('');
    triggerToast('💬 WhatsApp Business Campaign dispatched successfully!');
  };

  const handleAddSocialCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialName) return;
    const item = {
      id: `SOC-${300 + socialCampaigns.length + 1}`,
      platform: newSocialPlatform,
      campaign: newSocialName,
      budget: Number(newSocialBudget),
      reach: 0,
      engagement: 0,
      status: 'Active'
    };
    setSocialCampaigns([item, ...socialCampaigns]);
    setNewSocialName('');
    setNewSocialBudget(100);
    triggerToast('📢 Social media campaign scheduled in the marketing stream.');
  };

  const handleAddAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffPartner || !newAffCode) return;
    const item = {
      code: newAffCode.toUpperCase(),
      partner: newAffPartner,
      balance: 0.00,
      totalEarnings: 0.00,
      referrals: 0,
      rate: newAffRate,
      status: 'Active'
    };
    setAffiliates([item, ...affiliates]);
    setNewAffPartner('');
    setNewAffCode('');
    triggerToast('💰 Affiliate account registered and code activated.');
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail) return;
    const item = {
      id: `LED-${500 + leads.length + 1}`,
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone || 'N/A',
      source: 'Admin Manual Entry',
      service: newLeadService || 'Consultation Offer',
      status: 'New Lead'
    };
    setLeads([item, ...leads]);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadService('');
    triggerToast('🎯 Potential new customer lead logged.');
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail) return;
    const item = {
      id: `SUB-${subscribers.length + 1}`,
      email: newSubEmail,
      date: new Date().toISOString().split('T')[0],
      source: 'Direct Admin Registration',
      active: true
    };
    setSubscribers([item, ...subscribers]);
    setNewSubEmail('');
    triggerToast('📧 Newsletter subscriber added.');
  };

  const handleAddWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName) return;
    const item = {
      id: `WFL-0${workflows.length + 1}`,
      name: newWorkflowName,
      triggers: newWorkflowTrigger,
      steps: '2 Steps (Instant email followed by scheduled delay check)',
      active: true
    };
    setWorkflows([item, ...workflows]);
    setNewWorkflowName('');
    triggerToast('🤖 Automation trigger pipeline created successfully!');
  };

  const exportCSV = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0] || {}).join(",") + "\n"
      + data.map(e => Object.values(e).map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`📥 Exported ${filename}.csv successfully!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Visual Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-black font-sans uppercase tracking-tight bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            📣 {isBng ? 'মার্কেটিং ও প্রচারণা স্যুট' : 'ENTERPRISE MARKETING SUITE'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isBng ? 'স্বয়ংক্রিয় বিপণন, এসএমএস, পুশ এবং বিশ্লেষণ নিয়ন্ত্রণ করুন।' : 'Manage SMS, WhatsApp campaigns, loyalty rewards, cart recovery & subscribers.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportCSV(analyticsData, "marketing_analytics_report")}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-[11px] font-bold text-slate-700 dark:text-white flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
          <button 
            onClick={() => triggerToast("🤖 Gemini AI has optimized 3 campaigns for better conversions this week!")}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white hover:scale-[1.02] active:scale-95 transition-all text-[11px] font-bold flex items-center gap-1.5 shadow-[0_12px_24px_rgba(124,58,237,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Insights Panel</span>
          </button>
        </div>
      </div>

      {/* Real-time Enterprise Campaign Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaign Reach', value: '118.2K', change: '+14.2%', color: 'from-blue-500 to-indigo-500', icon: Globe },
          { label: 'Automated SMS Dispatched', value: '5,785', change: '99.4% Delivery', color: 'from-purple-500 to-fuchsia-500', icon: Phone },
          { label: 'Cart Recovered Revenue', value: '$2,840.50', change: '+24.1% Recovery', color: 'from-emerald-500 to-teal-500', icon: ShoppingBag },
          { label: 'Active Affiliates', value: '41 Members', change: '$4,150 Paid Out', color: 'from-pink-500 to-rose-500', icon: Users }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/5 shadow-md flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{stat.label}</span>
              <span className="text-xl font-black text-slate-900 dark:text-white block font-mono">{stat.value}</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Pane corresponding to the specific SubMenu */}
      
      {/* 1. SMS MARKETING WORKSPACE */}
      {activeSubMenu === 'mkt-sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddSmsCampaign} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-500" />
                <span>Launch New SMS Broadcast</span>
              </h3>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Campaign Reference Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramadan Server Offer"
                  value={newSmsName}
                  onChange={(e) => setNewSmsName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">SMS Gateway API Partner</label>
                <select 
                  value={smsGateway} 
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                >
                  <option value="twilio">Twilio SMS API</option>
                  <option value="infobip">Infobip Carrier Services</option>
                  <option value="bulksms">BulkSMS BD Gateway</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Broadcaster SMS Body Copy</label>
                <textarea 
                  rows={4} 
                  placeholder="Write promotional SMS text copy (Max 160 characters per SMS credit)..."
                  value={newSmsTemplate}
                  onChange={(e) => setNewSmsTemplate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none resize-none"
                  maxLength={160}
                  required
                />
                <span className="text-[9px] text-right block opacity-55">{newSmsTemplate.length}/160 Characters used</span>
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Blast Promotional List</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Historical SMS Campaigns Broadcast Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">Campaign ID</th>
                      <th className="p-3">Campaign Name</th>
                      <th className="p-3">Template Copy</th>
                      <th className="p-3">Recipients</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Ctr Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {smsCampaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-purple-400 font-bold">{c.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{c.name}</td>
                        <td className="p-3 max-w-xs truncate text-slate-500">{c.template}</td>
                        <td className="p-3">{c.recipients} users</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            c.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>{c.status}</span>
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">{c.clicks} clicks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PUSH NOTIFICATIONS */}
      {activeSubMenu === 'mkt-push' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddPushCampaign} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-pink-500" />
                <span>Browser Push Notification</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Notification Bold Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 🔥 WebzoneBD Flash Sale!"
                  value={newPushTitle}
                  onChange={(e) => setNewPushTitle(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Notification Description Message</label>
                <textarea 
                  rows={3} 
                  placeholder="Enter the push body copy (keep it concise and urgent)..."
                  value={newPushMessage}
                  onChange={(e) => setNewPushMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>Publish Push Alert</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Web Browser Push Campaigns</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">ID</th>
                      <th className="p-3">Push Title</th>
                      <th className="p-3">Message Body</th>
                      <th className="p-3">Published Date</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3">CTR Rate</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {pushCampaigns.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-fuchsia-400 font-bold">{p.id}</td>
                        <td className="p-3 font-sans font-black text-slate-800 dark:text-white">{p.title}</td>
                        <td className="p-3 text-slate-500 max-w-[200px] truncate">{p.message}</td>
                        <td className="p-3">{p.sentAt}</td>
                        <td className="p-3">{p.clicks} clicks</td>
                        <td className="p-3 text-emerald-400 font-bold">{p.ctr}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500">{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHATSAPP MARKETING */}
      {activeSubMenu === 'mkt-whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddWhatsAppCampaign} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp Bulk Campaign</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. VIP Member Discount"
                  value={newWapName}
                  onChange={(e) => setNewWapName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">WhatsApp Campaign Template</label>
                <textarea 
                  rows={4} 
                  placeholder="Hello {{1}}, enjoy special offer using variable placeholders..."
                  value={newWapTemplate}
                  onChange={(e) => setNewWapTemplate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Blast WhatsApp Lists</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">WhatsApp Business API Dispatch Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">ID</th>
                      <th className="p-3">Campaign Name</th>
                      <th className="p-3">Message Template</th>
                      <th className="p-3">Recipients</th>
                      <th className="p-3">Sent At</th>
                      <th className="p-3">User Replies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {whatsAppCampaigns.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-emerald-400 font-bold">{w.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{w.name}</td>
                        <td className="p-3 text-slate-500 max-w-[200px] truncate">{w.template}</td>
                        <td className="p-3">{w.recipients} users</td>
                        <td className="p-3">{w.sentAt}</td>
                        <td className="p-3 text-purple-400 font-bold">{w.replies} replies</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SOCIAL MEDIA CAMPAIGNS */}
      {activeSubMenu === 'mkt-social' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddSocialCampaign} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Social Post Scheduler</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Campaign / Ads Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Facebook retargeting"
                  value={newSocialName}
                  onChange={(e) => setNewSocialName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Platform</label>
                  <select 
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">X / Twitter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Budget ($)</label>
                  <input 
                    type="number" 
                    value={newSocialBudget}
                    onChange={(e) => setNewSocialBudget(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Initialize Campaign Ads</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Paid Social Media Marketing Stream</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">ID</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Campaign Ads Name</th>
                      <th className="p-3">Allocated Budget</th>
                      <th className="p-3">Tracked Reach</th>
                      <th className="p-3">Engagements</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {socialCampaigns.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-blue-400 font-bold">{s.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{s.platform}</td>
                        <td className="p-3 font-sans font-medium text-slate-500">{s.campaign}</td>
                        <td className="p-3 text-slate-900 dark:text-white font-bold">${s.budget} USD</td>
                        <td className="p-3 font-sans text-slate-450">{s.reach ? s.reach.toLocaleString() : 'Pending launch'}</td>
                        <td className="p-3 text-emerald-400 font-bold">{s.engagement ? s.engagement.toLocaleString() : '0'}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                          }`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. AFFILIATE MARKETING */}
      {activeSubMenu === 'mkt-affiliate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddAffiliate} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>Register Affiliate Partner</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Partner Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Karim IT Solution"
                  value={newAffPartner}
                  onChange={(e) => setNewAffPartner(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Unique Code</label>
                  <input 
                    type="text" 
                    placeholder="KARIM10"
                    value={newAffCode}
                    onChange={(e) => setNewAffCode(e.target.value.toUpperCase())}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono font-bold text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none uppercase"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Commission Rate</label>
                  <select 
                    value={newAffRate}
                    onChange={(e) => setNewAffRate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  >
                    <option value="10%">10% Base Rate</option>
                    <option value="12%">12% Premium Rate</option>
                    <option value="15%">15% VIP Leader Rate</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-650 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard Affiliate</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Enterprise Affiliate Partners Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">Code</th>
                      <th className="p-3">Affiliate Partner</th>
                      <th className="p-3">Commission Rate</th>
                      <th className="p-3">Unpaid Balance</th>
                      <th className="p-3">Total Earnings</th>
                      <th className="p-3">Total Referrals</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {affiliates.map((a) => (
                      <tr key={a.code} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-purple-400 font-bold">{a.code}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{a.partner}</td>
                        <td className="p-3 text-slate-450">{a.rate}</td>
                        <td className="p-3 text-emerald-400 font-bold">${a.balance.toFixed(2)}</td>
                        <td className="p-3 font-bold">${a.totalEarnings.toFixed(2)}</td>
                        <td className="p-3">{a.referrals} conversions</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            a.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REFERRAL PROGRAM */}
      {activeSubMenu === 'mkt-referral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                <span>Referral Commission Rule</span>
              </h3>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Referral Cash Reward ($)</label>
                <input 
                  type="number" 
                  value={newRefReward}
                  onChange={(e) => setNewRefReward(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827]/50 border border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-400 block">System Automation Rules</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  When a new user registers using a unique referral code, both the referrer and referee will automatically receive credit worth <strong>${newRefReward}</strong> into their digital service wallet upon first paid order clearance.
                </p>
              </div>

              <button 
                onClick={() => triggerToast("⚙️ Referral program configuration updated.")}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
              >
                <span>Apply Referral Rules</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Live Referral Program Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">ID</th>
                      <th className="p-3">Referrer Name</th>
                      <th className="p-3">Referee Signed Up</th>
                      <th className="p-3">Referral Code</th>
                      <th className="p-3">Commission Earned</th>
                      <th className="p-3">Audit Date</th>
                      <th className="p-3">Action Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {referrals.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-indigo-400 font-bold">{r.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{r.referrer}</td>
                        <td className="p-3 font-sans text-slate-500">{r.referee}</td>
                        <td className="p-3 font-bold text-purple-400">{r.code}</td>
                        <td className="p-3 text-emerald-400 font-bold">${r.reward}</td>
                        <td className="p-3">{r.date}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            r.status === 'Claimed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. LOYALTY & REWARDS */}
      {activeSubMenu === 'mkt-loyalty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Loyalty Configuration</span>
              </h3>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Reward Points Allocation Rate</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    value={pointsRate}
                    onChange={(e) => setPointsRate(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  />
                  <span className="text-xs font-bold shrink-0 text-slate-500">Points per $ spent</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827]/50 border border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-[10px] font-black uppercase text-pink-500 block">Redemption Ratio</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Every 100 loyalty points accrued can be redeemed for <strong>$1.00</strong> of service vouchers automatically inside the user shopping cart interface.
                </p>
              </div>

              <button 
                onClick={() => triggerToast("⚙️ Loyalty Points system updated successfully.")}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all"
              >
                <span>Save Loyalty Configurations</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Customer VIP Tiers & Loyalty Distribution</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">VIP Tier Tier Name</th>
                      <th className="p-3">Required Threshold Points</th>
                      <th className="p-3">Subscribed Members</th>
                      <th className="p-3">Cashback Rebate (%)</th>
                      <th className="p-3">Exclusive Priority Perks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {loyaltyTiers.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 font-sans font-black text-purple-400">{t.name}</td>
                        <td className="p-3 text-slate-900 dark:text-white font-bold">{t.threshold}</td>
                        <td className="p-3 font-sans text-slate-500">{t.members} users</td>
                        <td className="p-3 text-emerald-400 font-bold">{t.cashback}</td>
                        <td className="p-3 font-sans text-slate-450">{t.perk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. ABANDONED CART RECOVERY */}
      {activeSubMenu === 'mkt-abandoned' && (
        <div className="space-y-6">
          <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-black">Abandoned Carts Activity Watcher</h3>
                <p className="text-[11px] opacity-60">Automatically track users who left products in their carts and recover with automated campaigns.</p>
              </div>
              <button 
                onClick={() => triggerToast("⚡ Bulk recovery trigger issued. Sending automated SMS, WhatsApp & Email reminders!")}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-md"
              >
                Trigger Bulk recovery Blasters
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                    <th className="p-3">Cart ID</th>
                    <th className="p-3">Client Customer</th>
                    <th className="p-3">Items in Cart</th>
                    <th className="p-3">Cart Value</th>
                    <th className="p-3">Abandoned Duration</th>
                    <th className="p-3">Recovery Campaign Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                  {abandonedCarts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="p-3 text-amber-500 font-bold">{c.id}</td>
                      <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{c.client}</td>
                      <td className="p-3 font-sans text-slate-500">{c.items}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">${c.value} USD</td>
                      <td className="p-3 text-slate-450">{c.abandonedTime}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          c.recoveryStatus === 'Recovered' ? 'bg-emerald-500/10 text-emerald-500' :
                          c.recoveryStatus === 'Sms Sent' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>{c.recoveryStatus}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => triggerToast(`✉️ Manual personalized recovery email sent to ${c.client}.`)}
                          className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-[9px] mr-2"
                        >
                          Send Recovery Mail
                        </button>
                        <button 
                          onClick={() => triggerToast(`💬 Recovery Coupon code applied. WhatsApp alert dispatched.`)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px]"
                        >
                          WhatsApp Alert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. LEAD MANAGEMENT */}
      {activeSubMenu === 'mkt-leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddLead} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Manually Log Potential Lead</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Lead Name / Corp Entity</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Tech Solutions"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +88017..."
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Interested Service / Segment</label>
                <input 
                  type="text" 
                  placeholder="e.g. Enterprise CRM Integration"
                  value={newLeadService}
                  onChange={(e) => setNewLeadService(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Customer Lead</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black">Lead Pipeline Database CRM</h3>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Leads..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">ID</th>
                      <th className="p-3">Lead Entity</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">Source Channel</th>
                      <th className="p-3">Service Focus</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {leads.filter(l => l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.email.toLowerCase().includes(leadSearch.toLowerCase())).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-purple-400 font-bold">{lead.id}</td>
                        <td className="p-3 font-sans font-black text-slate-800 dark:text-white">{lead.name}</td>
                        <td className="p-3 font-sans">
                          <span className="block">{lead.email}</span>
                          <span className="text-[10px] opacity-40 block">{lead.phone}</span>
                        </td>
                        <td className="p-3 font-sans text-slate-450">{lead.source}</td>
                        <td className="p-3 font-sans text-slate-500 font-bold">{lead.service}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-500' :
                            lead.status === 'In Discussion' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-fuchsia-500/10 text-fuchsia-500'
                          }`}>{lead.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. NEWSLETTER SUBSCRIBERS */}
      {activeSubMenu === 'mkt-newsletter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddSubscriber} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Onboard Subscriber</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Subscriber Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. partner@infotech.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Email Member</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Newsletter Subscriptions List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">Subscriber ID</th>
                      <th className="p-3">Email Contact Address</th>
                      <th className="p-3">Registration Date</th>
                      <th className="p-3">Source Funnel</th>
                      <th className="p-3">Audited Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {subscribers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-purple-400 font-bold">{s.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{s.email}</td>
                        <td className="p-3">{s.date}</td>
                        <td className="p-3 font-sans text-slate-500">{s.source}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500">Active subscriber</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. MARKETING AUTOMATION */}
      {activeSubMenu === 'mkt-automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddWorkflow} className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Marketing Workflow Trigger</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Workflow Funnel Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. On-Signup sequence"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">System Event Trigger</label>
                <select 
                  value={newWorkflowTrigger}
                  onChange={(e) => setNewWorkflowTrigger(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                >
                  <option value="On User Registration">On User Registration</option>
                  <option value="15 Days before Expiry">15 Days before Expiry</option>
                  <option value="Cart Abandoned > $100">Cart Abandoned &gt; $100</option>
                  <option value="On Order Completed">On Order Completed</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Active Pipeline</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
              <h3 className="text-sm font-black mb-4">Enterprise Automation & Engagement Workflows</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-white/5 opacity-60 text-[10px] uppercase font-bold tracking-wider pb-2">
                      <th className="p-3">Workflow ID</th>
                      <th className="p-3">Automated Funnel Name</th>
                      <th className="p-3">System Trigger Action</th>
                      <th className="p-3">Trigger Steps Count</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {workflows.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-purple-400 font-bold">{w.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-white">{w.name}</td>
                        <td className="p-3 font-sans text-slate-500">{w.triggers}</td>
                        <td className="p-3 text-slate-450">{w.steps}</td>
                        <td className="p-3">
                          <button 
                            onClick={() => {
                              const updated = workflows.map(item => item.id === w.id ? { ...item, active: !item.active } : item);
                              setWorkflows(updated);
                              triggerToast(`🤖 Workflow "${w.name}" status toggled.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              w.active ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'
                            }`}
                          >
                            {w.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. MARKETING SETTINGS */}
      {activeSubMenu === 'mkt-settings' && (
        <div className="p-6 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6">
          <h3 className="text-sm font-black flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <Sliders className="w-4 h-4 text-purple-500" />
            <span>Global Marketing Configuration Panel</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">Email Broadcaster SMTP Server</h4>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">SMTP Outgoing Host Server</label>
                <input 
                  type="text" 
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">SMTP Outgoing Port (SSL)</label>
                <input 
                  type="number" 
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">Web Analytics & Ad Retargeting</h4>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Facebook Pixel ID Code</label>
                <input 
                  type="text" 
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Google Analytics Measurement ID</label>
                <input 
                  type="text" 
                  value={gaMeasurementId}
                  onChange={(e) => setGaMeasurementId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
            <button 
              onClick={() => triggerToast("⚙️ Global marketing credentials updated successfully!")}
              className="px-6 h-12 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-semibold text-xs hover:scale-[1.02] active:scale-95 shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Marketing Settings Credentials</span>
            </button>
          </div>
        </div>
      )}

      {/* Standard Recharts Analytics Dashboard */}
      <div className="p-6 rounded-[24px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-lg">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <Activity className="w-4 h-4 text-purple-500" />
          <span>Marketing conversion Performance Chart</span>
        </h3>
        <div className="h-64 w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={isDark ? '#a1a1aa' : '#64748b'} />
              <YAxis stroke={isDark ? '#a1a1aa' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#3f3f46' : '#cbd5e1' }} />
              <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Total Campaign Return ($)" />
              <Area type="monotone" dataKey="recovery" stroke="#EC4899" fillOpacity={1} fill="url(#colorRec)" strokeWidth={2} name="Cart Recovered Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
