import React, { useState, useMemo } from 'react';
import { 
  Users, ShoppingBag, FolderOpen, HelpCircle, FileUp, Award, DollarSign, Activity, Shield, FileText, 
  X, Check, Plus, Trash2, Search, SlidersHorizontal, ArrowUpRight, CheckCircle2, ChevronRight, 
  Smartphone, Mail, MapPin, RefreshCw, Send, Sliders, ShieldAlert, Key, Globe, LayoutGrid, Sparkles, Star, AlertCircle, Save, Download, Eye,
  MoreVertical, Edit
} from 'lucide-react';

interface CustomersManagerProps {
  theme: 'light' | 'dark';
  language: string;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  orders: any[];
  tickets: any[];
  projects: any[];
  triggerToast: (msg: string) => void;
  logAdminAction: (msg: string) => void;
  handleDownloadInvoicePdf: (order: any, customer: any) => void;
  checkPermission: (permission: string) => boolean;
  renderAccessDenied: (permission: string, title: string) => React.ReactNode;
  
  // Advanced filters state from parent
  custTypeFilter: string;
  setCustTypeFilter: (val: string) => void;
  custStatusFilter: string;
  setCustStatusFilter: (val: string) => void;
  custCountryFilter: string;
  setCustCountryFilter: (val: string) => void;
  custSpendFilter: string;
  setCustSpendFilter: (val: string) => void;
  custCityFilter: string;
  setCustCityFilter: (val: string) => void;
  custOrderCountFilter: string;
  setCustOrderCountFilter: (val: string) => void;
  custPaymentStatusFilter: string;
  setCustPaymentStatusFilter: (val: string) => void;
  custRegDateFilter: string;
  setCustRegDateFilter: (val: string) => void;

  // Active states
  selectedCustomerProfileId: string | null;
  setSelectedCustomerProfileId: (val: string | null) => void;
  activeProfileTab: string;
  setActiveProfileTab: (val: string) => void;
  selectedBulkCustomers: string[];
  setSelectedBulkCustomers: React.Dispatch<React.SetStateAction<string[]>>;
  showCommunicationModal: any;
  setShowCommunicationModal: (val: any) => void;
  custForm: any;
  setCustForm: React.Dispatch<React.SetStateAction<any>>;
  showAddCustomerModal: boolean;
  setShowAddCustomerModal: (val: boolean) => void;
  selectedCustomerIdForEdit: string | null;
  setSelectedCustomerIdForEdit: (val: string | null) => void;
  setCustomerSecurity: React.Dispatch<React.SetStateAction<any[]>>;
  setShowRegistrationSuccess: (val: any) => void;

  // Expanded/collapsible filter layout, delete verification modal, composers
  selectedCustForOrders: any | null;
  setSelectedCustForOrders: (val: any | null) => void;
  selectedCustForInvoices: any | null;
  setSelectedCustForInvoices: (val: any | null) => void;
  custDeleteConfirm: { isOpen: boolean; customerId: string; customerName: string } | null;
  setCustDeleteConfirm: (val: { isOpen: boolean; customerId: string; customerName: string } | null) => void;
  emailComposer: { isOpen: boolean; customerEmail: string; customerName: string; subject: string; body: string } | null;
  setEmailComposer: (val: { isOpen: boolean; customerEmail: string; customerName: string; subject: string; body: string } | null) => void;
  whatsappComposer: { isOpen: boolean; customerPhone: string; customerName: string; message: string } | null;
  setWhatsappComposer: (val: { isOpen: boolean; customerPhone: string; customerName: string; message: string } | null) => void;
  filtersExpanded: boolean;
  setFiltersExpanded: (val: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  usdBdtRate?: number;
}

export default function CustomersManager({
  theme,
  language,
  customers,
  setCustomers,
  orders,
  tickets,
  projects,
  triggerToast,
  logAdminAction,
  handleDownloadInvoicePdf,
  checkPermission,
  renderAccessDenied,
  usdBdtRate,

  // Advanced filters state
  custTypeFilter,
  setCustTypeFilter,
  custStatusFilter,
  setCustStatusFilter,
  custCountryFilter,
  setCustCountryFilter,
  custSpendFilter,
  setCustSpendFilter,
  custCityFilter,
  setCustCityFilter,
  custOrderCountFilter,
  setCustOrderCountFilter,
  custPaymentStatusFilter,
  setCustPaymentStatusFilter,
  custRegDateFilter,
  setCustRegDateFilter,

  // Active states
  selectedCustomerProfileId,
  setSelectedCustomerProfileId,
  activeProfileTab,
  setActiveProfileTab,
  selectedBulkCustomers,
  setSelectedBulkCustomers,
  showCommunicationModal,
  setShowCommunicationModal,
  custForm,
  setCustForm,
  showAddCustomerModal,
  setShowAddCustomerModal,
  selectedCustomerIdForEdit,
  setSelectedCustomerIdForEdit,
  setCustomerSecurity,
  setShowRegistrationSuccess,

  // CRM Workspace handles
  selectedCustForOrders,
  setSelectedCustForOrders,
  selectedCustForInvoices,
  setSelectedCustForInvoices,
  custDeleteConfirm,
  setCustDeleteConfirm,
  emailComposer,
  setEmailComposer,
  whatsappComposer,
  setWhatsappComposer,
  filtersExpanded,
  setFiltersExpanded,
  globalSearch,
  setGlobalSearch
}: CustomersManagerProps) {

  const isDark = theme === 'dark';

  // Floating Design Constants
  const cardBg = isDark ? 'bg-[#0F172A] border-white/[0.08]' : 'bg-[#FFFFFF] border-[#E2E8F0]';
  const textTitle = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMuted = isDark ? 'text-[#CBD5E1]' : 'text-[#475569]';
  const inputBg = isDark ? 'bg-[#111827] border-[#374151]' : 'bg-[#F8FAFC] border-[#E2E8F0]';
  const inputText = isDark ? 'text-[#FFFFFF]' : 'text-[#0F172A]';

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // CRM Detailed Portfolio Modal States
  const [crmModalCustomer, setCrmModalCustomer] = useState<any | null>(null);
  const [crmModalNotes, setCrmModalNotes] = useState<string>('');

  React.useEffect(() => {
    if (crmModalCustomer) {
      setCrmModalNotes(crmModalCustomer.notes || '');
    } else {
      setCrmModalNotes('');
    }
  }, [crmModalCustomer]);

  const handleSaveCrmModalNotes = () => {
    if (!crmModalCustomer) return;
    const cId = getCustId(crmModalCustomer);
    setCustomers(prev => prev.map(item => getCustId(item) === cId ? { ...item, notes: crmModalNotes } : item));
    setCrmModalCustomer(prev => prev ? { ...prev, notes: crmModalNotes } : null);
    triggerToast('✓ CRM Personalized Notes saved successfully and registry synced.');
    logAdminAction(`Updated CRM notes for customer ${getCustName(crmModalCustomer)}`);
  };

  // CRM Local Edit States for details view
  const [editName, setEditName] = useState<string>('');
  const [editCompanyName, setEditCompanyName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editWhatsapp, setEditWhatsapp] = useState<string>('');
  const [editDob, setEditDob] = useState<string>('');
  const [editGender, setEditGender] = useState<string>('');
  const [editCountry, setEditCountry] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editPostalCode, setEditPostalCode] = useState<string>('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState<string>('');
  const [editCustomerType, setEditCustomerType] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editWalletBalance, setEditWalletBalance] = useState<number>(0);
  const [editTotalSpent, setEditTotalSpent] = useState<number>(0);
  const [editTags, setEditTags] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');
  const [editWorkspaceFeatures, setEditWorkspaceFeatures] = useState<any>({});

  // Populate CRM Local Edit States
  React.useEffect(() => {
    if (selectedCustomerProfileId) {
      const cust = customers.find(cu => (cu.customer_id || cu.id || '') === selectedCustomerProfileId);
      if (cust) {
        setEditName(cust.customer_name || cust.name || '');
        setEditCompanyName(cust.companyName || '');
        setEditEmail(cust.customer_email || cust.email || '');
        setEditPhone(cust.customer_phone || cust.phone || '');
        setEditWhatsapp(cust.whatsapp || cust.customer_phone || cust.phone || '');
        setEditDob(cust.dob || '1995-01-01');
        setEditGender(cust.gender || 'Male');
        setEditCountry(cust.country || 'Bangladesh');
        setEditCity(cust.city || 'Dhaka');
        setEditAddress(cust.address || '');
        setEditPostalCode(cust.postalCode || '');
        setEditWebsiteUrl(cust.websiteUrl || '');
        setEditCustomerType(cust.customer_type || cust.customerType || 'Regular Client');
        setEditStatus(cust.customer_status || cust.status || 'active');
        setEditWalletBalance(Number(cust.walletBalance || 0));
        setEditTotalSpent(Number(cust.total_spent || cust.totalSpent || 0));
        setEditTags(cust.tags ? cust.tags.join(', ') : '');
        setEditPassword(cust.password || '');
        setEditWorkspaceFeatures(cust.workspaceFeatures || {
          projects: true,
          supportTickets: true,
          digitalStore: true,
          downloads: true,
          affiliateSystem: false,
          wallet: true,
          aiTools: true,
          notifications: true
        });
      }
    }
  }, [selectedCustomerProfileId, customers]);

  // Field mapper to support both standard camelCase state properties and snake_case database fields
  const getCustId = (c: any) => c.customer_id || c.id || '';
  const getCustName = (c: any) => c.customer_name || c.name || '';
  const getCustEmail = (c: any) => c.customer_email || c.email || '';
  const getCustPhone = (c: any) => c.customer_phone || c.phone || '';
  const getCustAvatar = (c: any) => c.customer_avatar || c.avatar || '';
  const getCustStatus = (c: any) => c.customer_status || c.status || 'active';
  const getCustType = (c: any) => c.customer_type || c.customerType || 'Regular Client';
  const getCustTotalSpent = (c: any) => Number(c.total_spent || c.totalSpent || 0);
  const getCustWallet = (c: any) => Number(c.walletBalance || 0);
  const getCustJoinedAt = (c: any) => c.created_at || c.joinedAt || '';
  const getCustNotes = (c: any) => c.notes || '';
  const getCustCountry = (c: any) => c.country || 'Bangladesh';
  const getCustCity = (c: any) => c.city || 'Dhaka';

  // Compile Dynamic CRM Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const todayStr = '2026-06-26';
    const newToday = customers.filter(c => getCustJoinedAt(c) === todayStr || getCustJoinedAt(c).includes(todayStr)).length;
    const active = customers.filter(c => getCustStatus(c) === 'active').length;
    const inactive = customers.filter(c => getCustStatus(c) === 'suspended' || getCustStatus(c) === 'blocked').length;
    const totalOrd = orders.length;
    const totalRev = orders
      .filter(o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const unpaidInv = orders.filter(o => o.paymentStatus === 'pending' || o.paymentStatus === 'unpaid').length;
    
    return {
      total,
      newToday,
      active,
      inactive,
      totalOrd,
      totalRev,
      unpaidInv,
      growth: '+18.4%'
    };
  }, [customers, orders]);

  // Compute filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // 1. Quick Search
      const term = globalSearch.toLowerCase();
      const idStr = String(getCustId(c)).toLowerCase();
      const nameStr = String(getCustName(c)).toLowerCase();
      const emailStr = String(getCustEmail(c)).toLowerCase();
      const phoneStr = String(getCustPhone(c)).toLowerCase();
      
      const matchSearch = 
        idStr.includes(term) ||
        nameStr.includes(term) ||
        emailStr.includes(term) ||
        phoneStr.includes(term);

      // 2. Type Filter
      const matchType = custTypeFilter === 'all' || getCustType(c) === custTypeFilter;

      // 3. Status Filter
      let matchStatus = true;
      if (custStatusFilter !== 'all') {
        if (custStatusFilter === 'vip') {
          matchStatus = getCustType(c) === 'VIP Client' || (c.tags && c.tags.includes('VIP'));
        } else {
          matchStatus = getCustStatus(c) === custStatusFilter;
        }
      }

      // 4. Country Filter
      const matchCountry = custCountryFilter === 'all' || getCustCountry(c) === custCountryFilter;

      // 5. City Filter
      const matchCity = custCityFilter === 'all' || getCustCity(c) === custCityFilter;

      // 6. Registration date filter
      let matchRegDate = true;
      if (custRegDateFilter !== 'all') {
        const joined = getCustJoinedAt(c) || '';
        if (custRegDateFilter === 'today') {
          matchRegDate = joined.includes('2026-06-26');
        } else if (custRegDateFilter === 'this-month') {
          matchRegDate = joined.startsWith('2026-06');
        } else if (custRegDateFilter === 'this-year') {
          matchRegDate = joined.startsWith('2026');
        }
      }

      // 7. Order count filter
      let matchOrderCount = true;
      if (custOrderCountFilter !== 'all') {
        const count = orders.filter(o => o.id === getCustId(c) || o.itemTitle.includes(getCustName(c))).length;
        if (custOrderCountFilter === '0') {
          matchOrderCount = count === 0;
        } else if (custOrderCountFilter === '1-5') {
          matchOrderCount = count >= 1 && count <= 5;
        } else if (custOrderCountFilter === '5+') {
          matchOrderCount = count > 5;
        }
      }

      // 8. Spending range filter
      let matchSpend = true;
      const spent = getCustTotalSpent(c);
      if (custSpendFilter !== 'all') {
        if (custSpendFilter === '0-100') {
          matchSpend = spent <= 100;
        } else if (custSpendFilter === '100-1000') {
          matchSpend = spent > 100 && spent <= 1000;
        } else if (custSpendFilter === '1000+') {
          matchSpend = spent > 1000;
        } else if (custSpendFilter === '0-500') {
          matchSpend = spent <= 500;
        } else if (custSpendFilter === '500-2000') {
          matchSpend = spent > 500 && spent <= 2000;
        } else if (custSpendFilter === '2000+') {
          matchSpend = spent > 2000;
        }
      }

      // 9. Payment Status filter
      let matchPaymentStatus = true;
      if (custPaymentStatusFilter !== 'all') {
        const clientOrders = orders.filter(o => o.id === getCustId(c) || o.itemTitle.includes(getCustName(c)));
        if (custPaymentStatusFilter === 'paid') {
          matchPaymentStatus = clientOrders.some(o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid');
        } else if (custPaymentStatusFilter === 'unpaid' || custPaymentStatusFilter === 'pending') {
          matchPaymentStatus = clientOrders.some(o => o.paymentStatus === 'pending');
        } else if (custPaymentStatusFilter === 'failed') {
          matchPaymentStatus = clientOrders.some(o => o.paymentStatus === 'failed');
        }
      }

      return matchSearch && matchType && matchStatus && matchCountry && matchCity && matchRegDate && matchOrderCount && matchSpend && matchPaymentStatus;
    });
  }, [customers, globalSearch, custTypeFilter, custStatusFilter, custCountryFilter, custCityFilter, custRegDateFilter, custOrderCountFilter, custSpendFilter, custPaymentStatusFilter, orders]);

  // Bulk actions triggers
  const handleBulkActivate = () => {
    setCustomers(prev => prev.map(c => selectedBulkCustomers.includes(getCustId(c)) ? { ...c, status: 'active', customer_status: 'active' } : c));
    triggerToast(`⚡ Bulk activation completed for ${selectedBulkCustomers.length} clients!`);
    logAdminAction(`Bulk unlocked active credentials access for ${selectedBulkCustomers.length} clients`);
    setSelectedBulkCustomers([]);
  };

  const handleBulkDeactivate = () => {
    setCustomers(prev => prev.map(c => selectedBulkCustomers.includes(getCustId(c)) ? { ...c, status: 'suspended', customer_status: 'suspended' } : c));
    triggerToast(`🔒 Bulk suspension completed for ${selectedBulkCustomers.length} profiles!`);
    logAdminAction(`Bulk placed credentials lockout for ${selectedBulkCustomers.length} customers`);
    setSelectedBulkCustomers([]);
  };

  const handleBulkMarkVIP = () => {
    setCustomers(prev => prev.map(c => selectedBulkCustomers.includes(getCustId(c)) ? { ...c, customerType: 'VIP Client', customer_type: 'VIP Client', tags: Array.from(new Set([...(c.tags || []), 'VIP'])) } : c));
    triggerToast(`⭐ Selected ${selectedBulkCustomers.length} accounts promoted to VIP tier successfully!`);
    logAdminAction(`Promoted ${selectedBulkCustomers.length} accounts to premium VIP retainer privileges`);
    setSelectedBulkCustomers([]);
  };

  const handleBulkBlock = () => {
    setCustomers(prev => prev.map(c => selectedBulkCustomers.includes(getCustId(c)) ? { ...c, status: 'blocked', customer_status: 'blocked' } : c));
    triggerToast(`🚫 Blocked ${selectedBulkCustomers.length} accounts!`);
    logAdminAction(`Banned and blacklisted ${selectedBulkCustomers.length} custom registrations`);
    setSelectedBulkCustomers([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you absolutely sure you want to permanently delete these ${selectedBulkCustomers.length} customers?`)) {
      setCustomers(prev => prev.filter(c => !selectedBulkCustomers.includes(getCustId(c))));
      triggerToast(`Purged selected ${selectedBulkCustomers.length} customers from the directory.`);
      logAdminAction(`Purged database records for ${selectedBulkCustomers.length} clients`);
      setSelectedBulkCustomers([]);
    }
  };

  const handleExportCSV = () => {
    const headers = "Customer ID,Full Name,Company,Email,Phone,Country,City,Status,Type,Spent\n";
    const rows = filteredCustomers.map(c => 
      `"${getCustId(c)}","${getCustName(c)}","${c.companyName || ''}","${getCustEmail(c)}","${getCustPhone(c)}","${getCustCountry(c)}","${getCustCity(c)}","${getCustStatus(c)}","${getCustType(c)}",$${getCustTotalSpent(c)}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `crm_customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`🎉 CSV export generated for ${filteredCustomers.length} profiles!`);
    logAdminAction(`Generated database backup spreadsheet in CSV formatting`);
  };

  const handleExportExcel = () => {
    const headers = "Customer ID\tFull Name\tCompany\tEmail\tPhone\tCountry\tCity\tStatus\tType\tSpent\n";
    const rows = filteredCustomers.map(c => 
      `${getCustId(c)}\t${getCustName(c)}\t${c.companyName || ''}\t${getCustEmail(c)}\t${getCustPhone(c)}\t${getCustCountry(c)}\t${getCustCity(c)}\t${getCustStatus(c)}\t${getCustType(c)}\t$${getCustTotalSpent(c)}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `crm_customers_export_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`🎉 Excel spreadsheet generated for ${filteredCustomers.length} profiles!`);
    logAdminAction(`Compiled excel data export for client directory`);
  };

  // Mark single as VIP
  const promoteToVIP = (c: any) => {
    setCustomers(prev => prev.map(item => getCustId(item) === getCustId(c) ? { ...item, customerType: 'VIP Client', customer_type: 'VIP Client', tags: Array.from(new Set([...(item.tags || []), 'VIP'])) } : item));
    triggerToast(`🎉 Customer ${getCustName(c)} is now marked as VIP!`);
    logAdminAction(`Elevated customer ${getCustName(c)} to VIP tier privileges`);
  };

  // Block single customer
  const blockCustomer = (c: any) => {
    const isCurrentlyBlocked = getCustStatus(c) === 'blocked';
    const nextStatus = isCurrentlyBlocked ? 'active' : 'blocked';
    setCustomers(prev => prev.map(item => getCustId(item) === getCustId(c) ? { ...item, status: nextStatus, customer_status: nextStatus } : item));
    triggerToast(isCurrentlyBlocked ? `✅ Customer ${getCustName(c)} has been unblocked!` : `🚫 Customer ${getCustName(c)} has been blocked!`);
    logAdminAction(`${isCurrentlyBlocked ? 'Unblocked' : 'Blocked'} registration workspace for ${getCustName(c)}`);
  };

  // Perform single delete
  const handleDeleteCustomer = (id: string, name: string) => {
    setCustomers(prev => prev.filter(c => getCustId(c) !== id));
    triggerToast(`Purged database files for customer ${name}.`);
    logAdminAction(`Purged database records for client ${name} (ID: ${id})`);
    setCustDeleteConfirm(null);
  };

  // Simulate refreshing loader
  const triggerRefreshSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast('🧹 Database synced and directories updated.');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* 1. STICKY TOP HEADER */}
      <div className={`sticky top-0 z-40 backdrop-blur-md ${isDark ? 'bg-[#0F172A]/90' : 'bg-[#FFFFFF]/90'} border-b ${isDark ? 'border-white/[0.08]' : 'border-[#E2E8F0]'} py-4 px-1 -mx-1 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#7C3AED] mb-1">
            <span>CRM & ERP PORTAL</span>
            <span>/</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>CUSTOMER INTELLIGENCE</span>
          </div>
          <h3 className={`text-2xl font-black tracking-tight ${textTitle} flex items-center gap-2`}>
            <Users className="w-6 h-6 text-[#7C3AED]" />
            👥 Client Portal
          </h3>
          <p className={`text-xs ${textMuted}`}>
            {selectedCustomerProfileId 
              ? 'Analyzing customer ledger portfolio, tracking transactions, invoices, tickets, and managing custom workspace permissions.' 
              : 'View, edit, and manage all customer register accounts, and audit metadata.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedCustomerProfileId && (
            <button
              onClick={() => {
                setSelectedCustomerProfileId(null);
                setActiveProfileTab('Overview');
              }}
              className={`h-[44px] px-4 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-neutral-200 text-slate-700 hover:text-neutral-900 shadow-sm'
              }`}
            >
              ← Back to Client Directory
            </button>
          )}

          {!selectedCustomerProfileId && (
            <button
              onClick={() => {
                setCustForm({
                  name: '',
                  companyName: '',
                  email: '',
                  phone: '',
                  whatsapp: '',
                  dob: '1995-01-01',
                  gender: 'Male',
                  country: 'Bangladesh',
                  city: 'Dhaka',
                  address: '',
                  postalCode: '',
                  websiteUrl: '',
                  customerType: 'Regular Client',
                  status: 'active',
                  tags: ['Regular'],
                  password: '',
                  workspaceFeatures: {
                    projects: true,
                    supportTickets: true,
                    digitalStore: true,
                    downloads: true,
                    affiliateSystem: false,
                    wallet: true,
                    aiTools: true,
                    notifications: true
                  }
                });
                setSelectedCustomerIdForEdit(null);
                setShowAddCustomerModal(true);
              }}
              style={{
                borderRadius: '14px',
                fontWeight: 600,
                height: '48px',
              }}
              className="px-5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] text-white text-xs transition-all flex items-center gap-1.5 shadow-[0_12px_30px_rgba(124,58,237,0.25)]"
            >
              <Plus className="w-4 h-4" /> Register New Customer
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP METRIC CARDS GRID */}
      {!selectedCustomerProfileId && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Customers", value: stats.total, desc: "Profiles saved", color: "text-[#7C3AED]", icon: Users },
            { title: "New Customers Today", value: stats.newToday, desc: "Verified registrations", color: "text-[#EC4899]", icon: Sparkles },
            { title: "Active Customers", value: stats.active, desc: "SaaS portal active", color: "text-[#22C55E]", icon: CheckCircle2 },
            { title: "Inactive Customers", value: stats.inactive, desc: "Suspended or blocked", color: "text-[#EF4444]", icon: ShieldAlert },
            { title: "Total Orders", value: stats.totalOrd, desc: "Invoiced services", color: "text-[#A855F7]", icon: ShoppingBag },
            { title: "Total Revenue", value: `৳${Math.round(stats.totalRev * (usdBdtRate || 118.5)).toLocaleString()}`, desc: `≈ $${Math.round(stats.totalRev).toLocaleString()} USD`, color: "text-[#22C55E]", icon: DollarSign },
            { title: "Unpaid Invoices", value: stats.unpaidInv, desc: "Payment required", color: "text-[#F59E0B]", icon: FileText },
            { title: "Growth Rate Today", value: stats.growth, desc: "Conversion scale", color: "text-[#22C55E]", icon: Activity }
          ].map((c, idx) => {
            const Icon = c.icon;
            return (
              <div 
                key={idx} 
                style={{ borderRadius: '20px' }}
                className={`p-5 border ${cardBg} shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group`}
              >
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-slate-400 group-hover:text-[#7C3AED] transition-colors">{c.title}</p>
                  <p className={`text-2xl font-black tracking-tight ${c.color} mt-1`}>{c.value}</p>
                  <p className="text-[10px] opacity-60 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {c.desc}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-neutral-900/60' : 'bg-neutral-100/60'} text-slate-400 group-hover:text-[#7C3AED] group-hover:bg-[#7C3AED]/10 transition-all`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. DIRECTORIES LIST VIEWS */}
      {!selectedCustomerProfileId ? (
        <>
          {/* SEARCH, ADVANCED FILTERS, BULK ACTIONS */}
          <div style={{ borderRadius: '20px' }} className={`p-6 border ${cardBg} shadow-2xl space-y-4`}>
            
            {/* Quick Search and Toggle Panel */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 text-slate-400" />
                <input
                  type="text"
                  placeholder="Smart Quick Search: Filter by Customer ID, Legal Name, Secure Email, or Phone..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-full text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-all ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50/50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className={`h-[44px] px-4 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition ${
                    isDark 
                      ? 'bg-neutral-950 hover:bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 text-slate-600 hover:text-neutral-900 shadow-sm'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
                  {filtersExpanded ? 'Hide Filters' : 'Advanced Filters'}
                </button>

                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setCustTypeFilter('all');
                    setCustStatusFilter('all');
                    setCustCountryFilter('all');
                    setCustSpendFilter('all');
                    setCustCityFilter('all');
                    setCustOrderCountFilter('all');
                    setCustPaymentStatusFilter('all');
                    setCustRegDateFilter('all');
                    triggerToast('🧹 Filter parameters cleared. All database files restored.');
                  }}
                  className={`h-[44px] px-4 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition ${
                    isDark 
                      ? 'bg-neutral-950 hover:bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 text-slate-600 hover:text-neutral-900 shadow-sm'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* EXPANDABLE ADVANCED FILTERS PANEL */}
            {filtersExpanded && (
              <div className="p-4 rounded-xl border border-dashed border-[#7C3AED]/20 bg-gradient-to-r from-[#7C3AED]/5 via-[#A855F7]/5 to-[#EC4899]/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* 1. Status */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Account status</label>
                  <select
                    value={custStatusFilter}
                    onChange={(e) => setCustStatusFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Status</option>
                    <option value="suspended">Suspended (Locked)</option>
                    <option value="blocked">Blocked (Banned)</option>
                    <option value="vip">VIP Retainers</option>
                  </select>
                </div>

                {/* 2. Registration Presets */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Registration Date</label>
                  <select
                    value={custRegDateFilter}
                    onChange={(e) => setCustRegDateFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Joined Times</option>
                    <option value="today">Joined Today (June 26)</option>
                    <option value="this-month">Registered This Month</option>
                    <option value="this-year">Joined This Year (2026)</option>
                  </select>
                </div>

                {/* 3. Geographic Country */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Country Location</label>
                  <select
                    value={custCountryFilter}
                    onChange={(e) => setCustCountryFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Countries</option>
                    {Array.from(new Set(customers.map(c => getCustCountry(c)).filter(Boolean))).map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Geographic City */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">City Location</label>
                  <select
                    value={custCityFilter}
                    onChange={(e) => setCustCityFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Cities</option>
                    {Array.from(new Set(customers.map(c => getCustCity(c)).filter(Boolean))).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Order Count */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Orders Track</label>
                  <select
                    value={custOrderCountFilter}
                    onChange={(e) => setCustOrderCountFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Quantities</option>
                    <option value="0">0 Invoiced Orders</option>
                    <option value="1-5">1 - 5 Placed Orders</option>
                    <option value="5+">5+ Regular Orders</option>
                  </select>
                </div>

                {/* 6. Spending range */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Spending Amount (LTV)</label>
                  <select
                    value={custSpendFilter}
                    onChange={(e) => setCustSpendFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Spendings</option>
                    <option value="0-100">$0 - $100 Spent</option>
                    <option value="100-1000">$100 - $1,000 Spent</option>
                    <option value="1000+">$1,000+ Enterprise Spent</option>
                  </select>
                </div>

                {/* 7. Customer Type */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Customer Type</label>
                  <select
                    value={custTypeFilter}
                    onChange={(e) => setCustTypeFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Regular Client">Regular Client</option>
                    <option value="VIP Client">VIP Client</option>
                    <option value="Corporate Client">Corporate Client</option>
                    <option value="Reseller">Reseller Privilege</option>
                    <option value="Affiliate Partner">Affiliate Promoter</option>
                  </select>
                </div>

                {/* 8. Payment status */}
                <div>
                  <label className="text-[10px] font-mono text-[#7C3AED] block mb-1 uppercase font-black tracking-wider">Payment Status</label>
                  <select
                    value={custPaymentStatusFilter}
                    onChange={(e) => setCustPaymentStatusFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg text-xs px-2.5 py-1.5 focus:border-[#7C3AED] outline-none font-semibold text-slate-300"
                  >
                    <option value="all">All Payment States</option>
                    <option value="paid">Has Completed Payments</option>
                    <option value="unpaid">Has Pending Payments</option>
                    <option value="failed">Has Failed Transactions</option>
                  </select>
                </div>

              </div>
            )}

            {/* BULK ACTIONS FLOATING TASK BAR */}
            {selectedBulkCustomers.length > 0 && (
              <div className="p-4 rounded-xl border border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] animate-pulse" />
                  <span className="text-xs font-mono font-black text-slate-200">
                    📂 {selectedBulkCustomers.length} Customer Accounts Checked for CRM Batch Actions
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button onClick={handleBulkActivate} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E] hover:text-white transition-all">
                    Activate
                  </button>
                  <button onClick={handleBulkDeactivate} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B] hover:text-white transition-all">
                    Deactivate
                  </button>
                  <button onClick={handleBulkMarkVIP} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white transition-all">
                    Mark VIP
                  </button>
                  <button onClick={handleBulkBlock} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all">
                    Block
                  </button>
                  <button onClick={handleBulkDelete} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-[#EF4444] text-white hover:bg-red-750 transition-all">
                    Delete Selected
                  </button>
                  <button onClick={() => setSelectedBulkCustomers([])} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-neutral-800 text-slate-400 hover:text-white transition-all">
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* CRM INTERACTIVE DATABASE TABLE */}
          <div style={{ borderRadius: '24px' }} className={`p-6 border ${cardBg} shadow-2xl space-y-4 overflow-x-auto relative`}>
            
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-gradient-to-b from-[#7C3AED] to-[#EC4899] rounded-full inline-block" />
                <h4 className="font-extrabold text-xs font-mono uppercase text-slate-400">
                  Client Registry Listings ({filteredCustomers.length} mapped profiles)
                </h4>
              </div>

              {/* Data Exporters */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Export:</span>
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1.5 text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#7C3AED] text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <FileUp className="w-3.5 h-3.5 text-orange-400" /> CSV Files
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-2.5 py-1.5 text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#7C3AED] text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-green-400" /> Excel Book
                </button>
                <button
                  onClick={triggerRefreshSimulation}
                  className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="Force Database Synchronisation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              /* PREMIUM SHIMMER LOADING SKELETONS */
              <div className="space-y-4 py-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                    <div className="w-6 h-6 bg-slate-800/60 rounded" />
                    <div className="w-20 h-5 bg-slate-800/60 rounded" />
                    <div className="flex-1 h-8 bg-slate-800/60 rounded" />
                    <div className="w-32 h-5 bg-slate-800/60 rounded" />
                    <div className="w-24 h-5 bg-slate-800/60 rounded" />
                    <div className="w-16 h-6 bg-slate-800/60 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredCustomers.length === 0 ? (
              /* ELEGANT EMPTY STATE */
              <div className="py-20 text-center max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-neutral-900/60 flex items-center justify-center border border-white/[0.08] mx-auto text-[#7C3AED]">
                  <Users className="w-8 h-8 opacity-40 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-neutral-200">No Customers Found</h5>
                  <p className="text-xs text-slate-500">No client database files matched your specified filter configurations inside system directory registers.</p>
                </div>
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setCustTypeFilter('all');
                    setCustStatusFilter('all');
                    setCustCountryFilter('all');
                    setCustSpendFilter('all');
                    setCustCityFilter('all');
                    setCustOrderCountFilter('all');
                    setCustPaymentStatusFilter('all');
                    setCustRegDateFilter('all');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-bold rounded-xl"
                >
                  Clear all search filters
                </button>
              </div>
            ) : (
              /* ACTUAL INTERACTIVE TABLE */
              <table className="w-full text-left border-collapse min-w-[1250px] text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[10px] tracking-wider bg-neutral-950/20 py-3">
                    <th className="py-3.5 px-3 text-center w-12">
                      <div 
                        onClick={() => {
                          const allIds = filteredCustomers.map(c => getCustId(c));
                          const areAllSelected = allIds.length > 0 && selectedBulkCustomers.length === allIds.length;
                          if (areAllSelected) {
                            setSelectedBulkCustomers([]);
                          } else {
                            setSelectedBulkCustomers(allIds);
                          }
                        }}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                          filteredCustomers.length > 0 && selectedBulkCustomers.length === filteredCustomers.length
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] border-transparent text-white'
                            : 'border-neutral-700 bg-neutral-900'
                        }`}
                      >
                        {filteredCustomers.length > 0 && selectedBulkCustomers.length === filteredCustomers.length && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </th>
                    <th className="py-3 px-3">Customer ID</th>
                    <th className="py-3 px-3">Profile Details</th>
                    <th className="py-3 px-3">Country / Location</th>
                    <th className="py-3 px-3">Registration Date</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Total Spent</th>
                    <th className="py-3 px-3">Last Order Date</th>
                    <th className="py-3 px-3">Customer status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust, idx) => {
                    const cId = getCustId(cust);
                    const cName = getCustName(cust);
                    const cEmail = getCustEmail(cust);
                    const cPhone = getCustPhone(cust);
                    const cStatus = getCustStatus(cust);
                    const cType = getCustType(cust);
                    const cCountry = getCustCountry(cust);
                    const cCity = getCustCity(cust);
                    const cJoined = getCustJoinedAt(cust);
                    const cSpent = getCustTotalSpent(cust);

                    const isChecked = selectedBulkCustomers.includes(cId);
                    
                    // Count real orders
                    const clientOrdersCount = orders.filter(o => o.id === cId || o.itemTitle.includes(cName)).length;
                    const lastOrderObj = orders.filter(o => o.id === cId || o.itemTitle.includes(cName)).sort((a,b) => b.date.localeCompare(a.date))[0];
                    const lastOrderDateStr = lastOrderObj ? lastOrderObj.date : (cust.last_order_date || 'N/A');

                    // Initials
                    const initials = cName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

                    return (
                      <tr 
                        key={cId} 
                        className={`border-b border-white/[0.04] transition-all hover:bg-white/[0.02] ${isChecked ? 'bg-[#7C3AED]/5' : ''}`}
                      >
                        
                        {/* Checkbox */}
                        <td className="py-3.5 px-3 text-center">
                          <div 
                            onClick={() => {
                              if (isChecked) {
                                setSelectedBulkCustomers(prev => prev.filter(id => id !== cId));
                              } else {
                                setSelectedBulkCustomers(prev => [...prev, cId]);
                              }
                            }}
                            className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all mx-auto ${
                              isChecked
                                ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] border-transparent text-white'
                                : 'border-neutral-700 bg-neutral-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </td>

                        {/* Customer ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-[#7C3AED]">
                          <span
                            onClick={() => setSelectedCustomerProfileId(cId)}
                            className="hover:underline cursor-pointer hover:text-[#EC4899] transition-all"
                            title="Click to view Customer Profile"
                          >
                            {cId}
                          </span>
                        </td>

                        {/* Profile Details */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center font-bold text-xs text-white border border-white/20 shadow-lg">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 
                                  onClick={() => setSelectedCustomerProfileId(cId)}
                                  className="font-extrabold text-neutral-200 hover:text-[#7C3AED] transition cursor-pointer"
                                >
                                  {cName}
                                </h5>
                                {cType === 'VIP Client' && (
                                  <span className="p-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-mono font-bold">VIP</span>
                                )}
                              </div>
                              <p className="text-[10px] opacity-60 font-mono mt-0.5">{cEmail}</p>
                              <p className="text-[9px] text-slate-500 font-mono">{cPhone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-3">
                          <div className="font-medium text-slate-300 font-mono">
                            {cCity}, {cCountry}
                          </div>
                        </td>

                        {/* Registration Date */}
                        <td className="py-3.5 px-3 font-mono text-slate-400">
                          {cJoined}
                        </td>

                        {/* Total Orders */}
                        <td className="py-3.5 px-3 font-mono text-slate-300 font-bold">
                          {clientOrdersCount} orders
                        </td>

                        {/* Spent Summary */}
                        <td className="py-3.5 px-3 font-mono font-bold text-[#22C55E]">
                          ${cSpent.toLocaleString()}
                        </td>

                        {/* Last Order Date */}
                        <td className="py-3.5 px-3 font-mono text-slate-400">
                          {lastOrderDateStr}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-black rounded-full border ${
                            cStatus === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                            cStatus === 'suspended' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                            cStatus === 'blocked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}>
                            {cStatus.toUpperCase()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right relative">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            
                            {/* View Profile */}
                            <button
                              onClick={() => setSelectedCustomerProfileId(cId)}
                              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                isDark 
                                  ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                              }`}
                              title="👁 View Profile CRM Portfolio"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* CRM Detailed Portfolio Modal */}
                            <button
                              onClick={() => setCrmModalCustomer(cust)}
                              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                isDark 
                                  ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#A855F7] hover:bg-[#7C3AED]/25 hover:text-white' 
                                  : 'bg-indigo-50 border-indigo-200 text-[#7C3AED] hover:bg-indigo-100 hover:text-[#7C3AED]/90 shadow-3xs'
                              }`}
                              title="💼 Open CRM Detailed Portfolio Modal"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Customer Profile */}
                            <button
                              onClick={() => {
                                setCustForm({
                                  name: cName,
                                  companyName: cust.companyName || '',
                                  email: cEmail,
                                  phone: cPhone,
                                  whatsapp: cust.whatsapp || cPhone,
                                  dob: cust.dob || '1995-01-01',
                                  gender: cust.gender || 'Male',
                                  country: cCountry,
                                  city: cCity,
                                  address: cust.address || '',
                                  postalCode: cust.postalCode || '',
                                  websiteUrl: cust.websiteUrl || '',
                                  customerType: cType,
                                  status: cStatus,
                                  tags: cust.tags || ['Regular'],
                                  password: cust.password || '',
                                  walletBalance: getCustWallet(cust),
                                  totalSpent: cSpent,
                                  workspaceFeatures: cust.workspaceFeatures || {
                                    projects: true,
                                    supportTickets: true,
                                    digitalStore: true,
                                    downloads: true,
                                    affiliateSystem: false,
                                    wallet: true,
                                    aiTools: true,
                                    notifications: true
                                  }
                                });
                                setSelectedCustomerIdForEdit(cId);
                                setShowAddCustomerModal(true);
                              }}
                              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                isDark 
                                  ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                              }`}
                              title="✏ Edit Customer Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* More Actions Menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRowMenuId(prev => prev === cId ? null : cId);
                                }}
                                className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                  isDark 
                                    ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                                }`}
                                title="More Actions"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {activeRowMenuId === cId && (
                                <div className={`absolute z-50 right-0 mt-1.5 w-56 rounded-xl border p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                                  isDark 
                                    ? 'bg-[#1e293b] border-white/[0.08] text-white shadow-black/40' 
                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/20'
                                }`}>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustForm({
                                        name: cName,
                                        companyName: cust.companyName || '',
                                        email: cEmail,
                                        phone: cPhone,
                                        whatsapp: cust.whatsapp || cPhone,
                                        dob: cust.dob || '1995-01-01',
                                        gender: cust.gender || 'Male',
                                        country: cCountry,
                                        city: cCity,
                                        address: cust.address || '',
                                        postalCode: cust.postalCode || '',
                                        websiteUrl: cust.websiteUrl || '',
                                        customerType: cType,
                                        status: cStatus,
                                        tags: cust.tags || ['Regular'],
                                        password: cust.password || '',
                                        walletBalance: getCustWallet(cust),
                                        totalSpent: cSpent,
                                        workspaceFeatures: cust.workspaceFeatures || {
                                          projects: true,
                                          supportTickets: true,
                                          digitalStore: true,
                                          downloads: true,
                                          affiliateSystem: false,
                                          wallet: true,
                                          aiTools: true,
                                          notifications: true
                                        }
                                      });
                                      setSelectedCustomerIdForEdit(cId);
                                      setShowAddCustomerModal(true);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-purple-500" />
                                    <span>✏️ Edit Customer Profile</span>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCustForOrders(cust);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                                    <span>View Orders History</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCustForInvoices(cust);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-teal-500" />
                                    <span>View Invoices Registry</span>
                                  </button>

                                  <a
                                    href={`https://wa.me/${cPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setActiveRowMenuId(null)}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200 inline-flex"
                                  >
                                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>WhatsApp Direct Chat</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEmailComposer({
                                        isOpen: true,
                                        customerEmail: cEmail,
                                        customerName: cName,
                                        subject: 'CRM Customer Update Notification',
                                        body: `Hello ${cName},\n\nWe are updating your account parameters inside our WebzoneBD directory.\n\nWarm regards,\nAdministrative Desk`
                                      });
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                  >
                                    <Mail className="w-3.5 h-3.5 text-[#EC4899]" />
                                    <span>Send Email</span>
                                  </button>

                                  {cType !== 'VIP Client' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        promoteToVIP(cust);
                                        setActiveRowMenuId(null);
                                      }}
                                      className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                    >
                                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                                      <span>Mark as VIP Customer</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      blockCustomer(cust);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-bold transition-all text-slate-700 dark:text-neutral-200"
                                  >
                                    <ShieldAlert className={`w-3.5 h-3.5 ${cStatus === 'blocked' ? 'text-slate-400' : 'text-rose-500'}`} />
                                    <span>{cStatus === 'blocked' ? "Restore Access" : "Block Customer"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustDeleteConfirm({
                                        isOpen: true,
                                        customerId: cId,
                                        customerName: cName
                                      });
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer font-bold transition-all text-rose-600 dark:text-rose-400 border-t border-slate-100 dark:border-white/[0.04] mt-1 pt-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Delete Profile</span>
                                  </button>

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

          </div>
        </>
      ) : (
        /* ========================================================
           4. CUSTOMER DETAILED PROFILE VIEW (CRM DIRECTORY DETAILED TABS)
           ======================================================== */
        (() => {
          const cust = customers.find(cu => getCustId(cu) === selectedCustomerProfileId);
          if (!cust) return <div className="p-12 text-center text-red-400 font-mono">Client File Purged. Re-index directory records.</div>;

          const cId = getCustId(cust);
          const cName = getCustName(cust);
          const cEmail = getCustEmail(cust);
          const cPhone = getCustPhone(cust);
          const cAvatar = getCustAvatar(cust);
          const cStatus = getCustStatus(cust);
          const cType = getCustType(cust);
          const cCountry = getCustCountry(cust);
          const cCity = getCustCity(cust);
          const cJoined = getCustJoinedAt(cust);
          const cSpent = getCustTotalSpent(cust);
          const cWallet = getCustWallet(cust);
          const cNotes = getCustNotes(cust);

          // Related models logs
          const clientOrders = orders.filter(o => o.id === cId || o.itemTitle.includes(cName));
          const clientProjects = projects.filter(p => p.clientId === cId || p.clientName === cName);
          const clientTickets = tickets.filter(t => t.userId === cId || t.subject.toLowerCase().includes(cName.toLowerCase()));

          // Render active profile tab inside details viewport
          return (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              
              {/* PROFILE HERO ROW CARD */}
              <style>{`
                .glassmorphism-card {
                  backdrop-filter: blur(20px);
                  border-radius: 24px;
                  transition: all 0.30s ease;
                }
                .glassmorphism-card:hover {
                  transform: translateY(-4px);
                }
              `}</style>

              <div style={{ borderRadius: '24px' }} className={`p-6 border ${cardBg} shadow-2xl relative overflow-hidden glassmorphism-card`}>
                {/* Background decorative gradient glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7C3AED]/10 via-[#A855F7]/10 to-[#EC4899]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

                <div className="flex flex-col xl:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[20px] bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] flex items-center justify-center font-black text-2xl text-white border-2 border-white/20 shadow-xl shadow-[#7C3AED]/20">
                      {cName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <h4 className="text-xl font-black text-neutral-100 tracking-tight">{cName}</h4>
                        <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${
                          cStatus === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {cStatus.toUpperCase()}
                        </span>
                      </div>
                      {(cEmail || cPhone) && (
                        <div className="text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-slate-300 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 justify-center md:justify-start font-mono">
                          {cEmail && (
                            <span className="flex items-center gap-1">
                              <span className="opacity-85">📧</span> {cEmail}
                            </span>
                          )}
                          {cEmail && cPhone && <span className="text-slate-600 dark:text-slate-700 hidden md:inline">•</span>}
                          {cPhone && (
                            <span className="flex items-center gap-1">
                              <span className="opacity-85">📞</span> {cPhone}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-[#CBD5E1] font-semibold mt-1">
                        {cust.companyName || 'Individual Client'} • <span className="text-[#EC4899]">{cType}</span>
                      </p>
                      {cust.websiteUrl && (
                        <p className="text-xs text-[#06B6D4] mt-1 flex items-center justify-center md:justify-start gap-1 font-semibold">
                          <span>🔗</span>
                          <a 
                            href={cust.websiteUrl.startsWith('http') ? cust.websiteUrl : `https://${cust.websiteUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-[#EC4899] transition-all font-mono"
                          >
                            {cust.websiteUrl}
                          </a>
                        </p>
                      )}
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        ID: {cId} | Mapped Location: {cCity}, {cCountry} | Registered: {cJoined}
                      </p>
                    </div>
                  </div>

                  {/* LTV CRM Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
                    {[
                      { label: "Total Spent", value: `$${cSpent.toLocaleString()}`, color: "text-[#22C55E]" },
                      { label: "Wallet Balance", value: `$${cWallet.toLocaleString()}`, color: "text-[#7C3AED]" },
                      { label: "Invoiced Orders", value: clientOrders.length, color: "text-slate-200" },
                      { label: "Support Tickets", value: clientTickets.length, color: "text-slate-300" }
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950/60 rounded-xl border border-white/[0.04] text-center min-w-[100px]">
                        <p className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                        <p className={`text-sm font-mono font-black mt-1 ${m.color}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* TABS SELECTOR (PREMIUM SAAS GLASSMORPHISM DESIGN) */}
              <div className="bg-white/80 dark:bg-[#1E293B]/85 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-[24px] p-2 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-6 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-0.5">
                  {[
                    { id: "Overview", label: "Basic Info", icon: Users },
                    { id: "Order History", label: "Orders", icon: ShoppingBag },
                    { id: "Invoice History", label: "Invoices", icon: FileText },
                    { id: "Payment History", label: "Payments", icon: DollarSign },
                    { id: "Support Tickets", label: "Support", icon: HelpCircle },
                    { id: "Activity Timeline", label: "Activity", icon: Activity },
                    { id: "Admin Notes & Gates", label: "Notes & Gates", icon: Shield }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeProfileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveProfileTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-[18px] text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer select-none relative ${
                          isActive
                            ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-md shadow-[#7C3AED]/20 scale-[1.01]'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-3 scale-110' : 'opacity-80 group-hover:scale-105'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB VIEWS CONTROLLER */}
              <div className="space-y-4">
                
                {/* A. OVERVIEW & CRM DASHBOARD */}
                {activeProfileTab === 'Overview' && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
                        triggerToast("⚠️ Legal full name, email, and phone coordinates are mandatory.");
                        return;
                      }
                      
                      setCustomers(prev => prev.map(c => {
                        const currentId = c.customer_id || c.id || '';
                        if (currentId === cId) {
                          return {
                            ...c,
                            name: editName,
                            customer_name: editName,
                            companyName: editCompanyName,
                            company_name: editCompanyName,
                            email: editEmail,
                            customer_email: editEmail,
                            phone: editPhone,
                            customer_phone: editPhone,
                            whatsapp: editWhatsapp,
                            dob: editDob,
                            gender: editGender,
                            country: editCountry,
                            city: editCity,
                            address: editAddress,
                            postalCode: editPostalCode,
                            websiteUrl: editWebsiteUrl,
                            customerType: editCustomerType,
                            customer_type: editCustomerType,
                            status: editStatus,
                            customer_status: editStatus,
                            tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
                            password: editPassword,
                            walletBalance: Number(editWalletBalance || 0),
                            wallet_balance: Number(editWalletBalance || 0),
                            totalSpent: Number(editTotalSpent || 0),
                            total_spent: Number(editTotalSpent || 0),
                            workspaceFeatures: editWorkspaceFeatures
                          };
                        }
                        return c;
                      }));
                      triggerToast(`🤝 Customer Profile for ${editName} compiled and updated safely!`);
                      logAdminAction(`Modified credentials and configurations for customer profile ${editName}`);
                    }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
                  >
                    
                    {/* General Demographic Profile Form Container */}
                    <div style={{ borderRadius: '20px' }} className={`lg:col-span-2 p-6 border ${cardBg} shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-5`}>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]">👤</span>
                            <span>Basic Information Settings</span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Configure customer display credentials, contact endpoints, and residential coordinates.
                          </p>
                        </div>
                      </div>

                      {/* Input fields grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Legal Full Name</label>
                          <input 
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                            placeholder="e.g. Imran Hasan"
                          />
                        </div>

                        {/* Company Registered Name */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Company Registered Name</label>
                          <input 
                            type="text"
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                            placeholder="e.g. Webzone BD Solution"
                          />
                        </div>

                        {/* Secure Email Coordinate */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Secure Email Coordinate</label>
                          <input 
                            type="email"
                            required
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                            placeholder="e.g. support@webzone.com"
                          />
                        </div>

                        {/* Primary Phone Number */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Primary Phone Number</label>
                          <input 
                            type="text"
                            required
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                            placeholder="e.g. +8801700112233"
                          />
                        </div>

                        {/* Secure WhatsApp Address */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Secure WhatsApp Address</label>
                          <input 
                            type="text"
                            value={editWhatsapp}
                            onChange={(e) => setEditWhatsapp(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                            placeholder="e.g. +8801864000005"
                          />
                        </div>

                        {/* Password (Portal Display Credentials) */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Portal Client Password</label>
                          <input 
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                            placeholder="Client Login Key"
                          />
                        </div>

                        {/* Country Location */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Country Location</label>
                          <input 
                            type="text"
                            value={editCountry}
                            onChange={(e) => setEditCountry(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                            placeholder="e.g. Bangladesh"
                          />
                        </div>

                        {/* City / District */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">City / District</label>
                          <input 
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                            placeholder="e.g. Dhaka"
                          />
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Postal / ZIP Code</label>
                          <input 
                            type="text"
                            value={editPostalCode}
                            onChange={(e) => setEditPostalCode(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                            placeholder="e.g. 1230"
                          />
                        </div>

                        {/* Website URL */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Website Address URL</label>
                          <input 
                            type="text"
                            value={editWebsiteUrl}
                            onChange={(e) => setEditWebsiteUrl(e.target.value)}
                            className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                            placeholder="e.g. https://domain.com"
                          />
                        </div>

                        {/* Detailed Residential Address */}
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          <label className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">Registered Billing Residence Address</label>
                          <textarea 
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            style={{ minHeight: '140px' }}
                            className="w-full p-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] resize-y"
                            placeholder="Enter detailed billing street details"
                          />
                        </div>

                      </div>

                      {/* Submit changes button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                        <button
                          type="submit"
                          style={{ height: '54px', borderRadius: '14px' }}
                          className="px-8 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-[0_12px_30px_rgba(124,58,237,0.35)] cursor-pointer flex items-center gap-2 text-sm uppercase tracking-wide"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>

                    </div>

                    {/* Right Hand Sidebar Panel: Financials & Feature Entitlement Gates */}
                    <div className="space-y-6">
                      
                      {/* Financial and demographic settings panel */}
                      <div style={{ borderRadius: '20px' }} className={`p-6 border ${cardBg} shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-5`}>
                        <h4 className="text-base font-black text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#EC4899]/10 text-[#EC4899]">📊</span>
                          <span>CRM Segmentation & Ledger</span>
                        </h4>

                        <div className="space-y-4">
                          
                          {/* Wallet Balance */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Wallet Balance ($)</label>
                            <input 
                              type="number"
                              value={editWalletBalance}
                              onChange={(e) => setEditWalletBalance(Number(e.target.value))}
                              className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                              placeholder="0.00"
                            />
                          </div>

                          {/* Total LTV Spent */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Total LTV Spent ($)</label>
                            <input 
                              type="number"
                              value={editTotalSpent}
                              onChange={(e) => setEditTotalSpent(Number(e.target.value))}
                              className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                              placeholder="0.00"
                            />
                          </div>

                          {/* Customer Type / Status */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Client Type</label>
                              <select
                                value={editCustomerType}
                                onChange={(e) => setEditCustomerType(e.target.value)}
                                className="w-full h-[56px] px-3.5 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                              >
                                <option value="Regular Client">Regular</option>
                                <option value="Agency Portfolio">Agency</option>
                                <option value="Enterprise VIP">VIP</option>
                                <option value="Strategic Partner">Partner</option>
                                <option value="Affiliate Partnership">Affiliate Partnership</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Lifecycle Status</label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full h-[56px] px-3.5 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="blocked">Blocked</option>
                              </select>
                            </div>
                          </div>

                          {/* Taxonomy Tags */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Metadata Taxonomy Tags</label>
                            <input 
                              type="text"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono"
                              placeholder="Regular, VIP, BD"
                            />
                          </div>

                          {/* Gender & DOB */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Gender</label>
                              <select
                                value={editGender}
                                onChange={(e) => setEditGender(e.target.value)}
                                className="w-full h-[56px] px-3.5 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">Birth Date</label>
                              <input 
                                type="date"
                                value={editDob}
                                onChange={(e) => setEditDob(e.target.value)}
                                className="w-full h-[56px] px-4 rounded-[14px] font-medium transition-all duration-300 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] font-mono text-xs"
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* SaaS Portal License Gating Toggles */}
                      <div style={{ borderRadius: '20px' }} className={`p-6 border ${cardBg} shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-4`}>
                        <h4 className="text-base font-black text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]">🔒</span>
                          <span>Workspace License Gates</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Enable or disable customer access nodes. Changes sync instantly across the tenant workspace.
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {[
                            { id: 'projects', label: 'Projects Area' },
                            { id: 'supportTickets', label: 'Ticket SLAs' },
                            { id: 'digitalStore', label: 'SaaS Store' },
                            { id: 'downloads', label: 'Software Hub' },
                            { id: 'affiliateSystem', label: 'Affiliate program' },
                            { id: 'wallet', label: 'Balance add' }
                          ].map(gate => {
                            const isEnabled = !!editWorkspaceFeatures[gate.id];
                            return (
                              <button
                                key={gate.id}
                                type="button"
                                onClick={() => {
                                  setEditWorkspaceFeatures((prev: any) => ({
                                    ...prev,
                                    [gate.id]: !prev[gate.id]
                                  }));
                                }}
                                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                                  isEnabled 
                                    ? 'bg-gradient-to-tr from-[#7C3AED]/10 to-[#EC4899]/5 border-[#7C3AED]/30 text-slate-800 dark:text-white shadow-sm'
                                    : 'bg-neutral-50/50 dark:bg-neutral-900/40 border-slate-200 dark:border-slate-800/80 text-slate-400'
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                  isEnabled ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white' : 'border border-slate-300 dark:border-slate-700'
                                }`}>
                                  {isEnabled && <Check className="w-3.5 h-3.5 font-bold" />}
                                </div>
                                <span className="text-[11px] font-bold">{gate.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </form>
                )}

                {/* B. ORDER HISTORY */}
                {activeProfileTab === 'Order History' && (
                  <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4 animate-in fade-in duration-300`}>
                    <h4 className="text-xs font-mono font-black text-[#7C3AED] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                      Service Orders and Purchases Ledger
                    </h4>

                    {clientOrders.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No purchases recorded in standard order ledger.</p>
                    ) : (
                      <table className="w-full text-left text-xs mb-0">
                        <thead>
                          <tr className="border-b border-white/[0.04] text-slate-400 font-mono text-[10px]">
                            <th className="py-2">Order ID</th>
                            <th className="py-2">Service Purchased</th>
                            <th className="py-2">Amount Paid</th>
                            <th className="py-2">Order Date</th>
                            <th className="py-2">Transaction Status</th>
                            <th className="py-2 text-right">Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientOrders.map((o: any) => (
                            <tr key={o.id} className="border-b border-white/[0.02]">
                              <td className="py-3 font-mono font-bold text-[#7C3AED]">{o.id}</td>
                              <td className="py-3 font-medium text-slate-200">{o.itemTitle || 'Custom Service Package'}</td>
                              <td className="py-3 font-mono text-slate-300 font-bold">${o.price}</td>
                              <td className="py-3 font-mono text-slate-400">{o.date}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                  o.paymentStatus === 'completed' || o.paymentStatus === 'paid'
                                    ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                                }`}>
                                  {o.paymentStatus?.toUpperCase() || 'COMPLETED'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDownloadInvoicePdf(o, cust)}
                                  className="p-1 rounded bg-neutral-950 border border-neutral-800 hover:border-[#7C3AED] text-slate-400 hover:text-white text-[10px] font-mono transition"
                                >
                                  PDF Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* C. INVOICE HISTORY */}
                {activeProfileTab === 'Invoice History' && (
                  <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4 animate-in fade-in duration-300`}>
                    <h4 className="text-xs font-mono font-black text-[#EC4899] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                      Invoice Receipt records
                    </h4>

                    {clientOrders.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No generated billing invoices found.</p>
                    ) : (
                      <table className="w-full text-left text-xs mb-0">
                        <thead>
                          <tr className="border-b border-white/[0.04] text-slate-400 font-mono text-[10px]">
                            <th className="py-2">Invoice No.</th>
                            <th className="py-2">Date Generated</th>
                            <th className="py-2">Client Description</th>
                            <th className="py-2">Invoiced Amount</th>
                            <th className="py-2">Billing Status</th>
                            <th className="py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientOrders.map((o: any, index) => (
                            <tr key={index} className="border-b border-white/[0.02]">
                              <td className="py-3 font-mono font-bold text-slate-300">#INV-{1000 + index}</td>
                              <td className="py-3 font-mono text-slate-400">{o.date}</td>
                              <td className="py-3 font-medium text-slate-200">SaaS Renewal / License Code</td>
                              <td className="py-3 font-mono text-slate-300 font-bold">${o.price}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                  o.paymentStatus === 'completed' || o.paymentStatus === 'paid'
                                    ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                                }`}>
                                  {o.paymentStatus === 'completed' || o.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDownloadInvoicePdf(o, cust)}
                                  className="p-1 px-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-[#EC4899] text-slate-300 hover:text-white text-[10px] font-mono transition"
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* D. PAYMENT HISTORY */}
                {activeProfileTab === 'Payment History' && (
                  <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4 animate-in fade-in duration-300`}>
                    <h4 className="text-xs font-mono font-black text-[#22C55E] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                      Payment Methods & Ledger History
                    </h4>

                    {clientOrders.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No processed payments registered in checkout pipeline.</p>
                    ) : (
                      <table className="w-full text-left text-xs mb-0">
                        <thead>
                          <tr className="border-b border-white/[0.04] text-slate-400 font-mono text-[10px]">
                            <th className="py-2">Transaction ID</th>
                            <th className="py-2">Date Mapped</th>
                            <th className="py-2">Method Gateway</th>
                            <th className="py-2">Wallet Impact</th>
                            <th className="py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientOrders.map((o: any, idx) => (
                            <tr key={idx} className="border-b border-white/[0.02]">
                              <td className="py-3 font-mono font-bold text-slate-300">TXN-{idx * 1111 + 5432}</td>
                              <td className="py-3 font-mono text-slate-400">{o.date}</td>
                              <td className="py-3 font-medium text-slate-200">{o.paymentMethod || 'Credit / Debit Card'}</td>
                              <td className="py-3 font-mono text-[#22C55E] font-bold">+${o.price} LTV</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                                  COMPLETED
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* E. SUPPORT TICKETS */}
                {activeProfileTab === 'Support Tickets' && (
                  <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4 animate-in fade-in duration-300`}>
                    <h4 className="text-xs font-mono font-black text-[#A855F7] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                      Client Support SLA Tickets Registry
                    </h4>

                    {clientTickets.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No support tickets found for this client.</p>
                    ) : (
                      <table className="w-full text-left text-xs mb-0">
                        <thead>
                          <tr className="border-b border-white/[0.04] text-slate-400 font-mono text-[10px]">
                            <th className="py-2">Ticket ID</th>
                            <th className="py-2">Subject Header</th>
                            <th className="py-2">Department</th>
                            <th className="py-2">Created Date</th>
                            <th className="py-2">Urgency SLA</th>
                            <th className="py-2">State</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientTickets.map((t: any) => (
                            <tr key={t.id} className="border-b border-white/[0.02]">
                              <td className="py-3 font-mono font-bold text-[#A855F7]">#{t.id}</td>
                              <td className="py-3 font-medium text-slate-200">{t.subject}</td>
                              <td className="py-3 text-slate-300 font-mono">{t.department || 'Technical Desk'}</td>
                              <td className="py-3 font-mono text-slate-400">{t.createdAt || '2026-06-12'}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                  t.priority === 'critical' || t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {t.priority?.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                  t.status === 'closed' ? 'bg-neutral-800 text-slate-400 border-neutral-700' : 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                }`}>
                                  {t.status?.toUpperCase() || 'OPEN'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* F. ACTIVITY TIMELINE */}
                {activeProfileTab === 'Activity Timeline' && (
                  <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4 animate-in fade-in duration-300`}>
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                      Administrative Audit Logs & Timelines
                    </h4>

                    <div className="relative border-l border-white/[0.08] ml-4 pl-6 space-y-6">
                      {[
                        { title: "Dashboard Session Lock Authorized", date: "2026-06-26 11:15", body: "Session handshake established via credential parameters successfully.", icon: CheckCircle2, bg: "bg-[#22C55E]" },
                        { title: "Modified Profile Parameters", date: "2026-06-25 09:30", body: "Legal address billing records mapped successfully to new ZIP coordinates.", icon: Sliders, bg: "bg-[#7C3AED]" },
                        { title: "Auto Invoice Dispatched Successfully", date: "2026-06-20 18:42", body: "System dispatch parameters dispatched PDF attachment to inbox.", icon: FileText, bg: "bg-amber-500" }
                      ].map((item, idx) => {
                        const ItemIcon = item.icon;
                        return (
                          <div key={idx} className="relative">
                            {/* Circle Dot */}
                            <span className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-white ring-4 ${isDark ? 'ring-slate-900' : 'ring-white'} ${item.bg}`}>
                              <ItemIcon className="w-3 h-3" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-neutral-200 text-xs">{item.title}</h5>
                                <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.body}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* G. ADMIN NOTES & PORTAL LICENSE ENTITLEMENT GATING */}
                {activeProfileTab === 'Admin Notes & Gates' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    
                    {/* Notes block */}
                    <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4`}>
                      <h4 className="text-xs font-mono font-black text-[#7C3AED] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                        Persistent administrative notes
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        These notes are exclusively visible to administrative role coordinates inside the control workspace. Change log history persists instantly.
                      </p>
                      <textarea
                        style={{ minHeight: '140px' }}
                        className="w-full text-xs font-mono p-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#7C3AED] text-slate-300 outline-none resize-none"
                        placeholder="Type notes here..."
                        value={cust.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomers(prev => prev.map(item => getCustId(item) === cId ? { ...item, notes: val } : item));
                        }}
                      />
                      <button
                        onClick={() => triggerToast('✓ Notes updated successfully.')}
                        style={{ borderRadius: '10px' }}
                        className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#A855F7] text-white font-bold text-xs"
                      >
                        Sync Notes to Registry
                      </button>
                    </div>

                    {/* Permissions and SaaS Gateways */}
                    <div style={{ borderRadius: '20px' }} className={`p-5 border ${cardBg} shadow-2xl space-y-4`}>
                      <h4 className="text-xs font-mono font-black text-[#EC4899] uppercase tracking-wider pb-2 border-b border-white/[0.05]">
                        SaaS Portal features gating
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Toggle user access instantly to modules. Changes apply instantly across customer client dashboard environments.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'projects', label: 'Projects area' },
                          { id: 'supportTickets', label: 'Ticket SLAs' },
                          { id: 'digitalStore', label: 'SaaS Storefront' },
                          { id: 'downloads', label: 'Software Area' },
                          { id: 'affiliateSystem', label: 'Affiliate program' },
                          { id: 'wallet', label: 'Balance add' }
                        ].map(gate => {
                          const hasFeature = cust.workspaceFeatures 
                            ? (cust.workspaceFeatures[gate.id] !== undefined ? !!cust.workspaceFeatures[gate.id] : (gate.id === 'affiliateSystem' ? false : true)) 
                            : (gate.id === 'affiliateSystem' ? false : true);
                          return (
                            <button
                              key={gate.id}
                              onClick={() => {
                                const currentFeats = cust.workspaceFeatures || {
                                  projects: true,
                                  supportTickets: true,
                                  digitalStore: true,
                                  downloads: true,
                                  affiliateSystem: false,
                                  wallet: true
                                };
                                const updatedFeats = {
                                  ...currentFeats,
                                  [gate.id]: !hasFeature
                                };
                                setCustomers(prev => prev.map(item => getCustId(item) === cId ? { ...item, workspaceFeatures: updatedFeats } : item));
                                triggerToast(`⚡ License Updated: ${gate.label} set to ${!hasFeature ? 'ENABLED':'DISABLED'}.`);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                hasFeature
                                  ? 'bg-[#7C3AED]/15 border-[#7C3AED]/40 text-[#7C3AED] shadow-md'
                                  : 'bg-neutral-950 border-neutral-850 opacity-50 text-slate-400'
                              }`}
                            >
                              <span className="text-[10px] font-mono uppercase font-black">{gate.label}</span>
                              <span className={`w-2.5 h-2.5 rounded-full ${hasFeature ? 'bg-[#7C3AED] animate-pulse' : 'bg-neutral-800'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })()
      )}

      {/* ========================================================
         CRM PORTFOLIO DETAILED VIEW & PERSISTENT NOTES MODAL
         ======================================================== */}
      {crmModalCustomer && (() => {
        const cId = getCustId(crmModalCustomer);
        const cName = getCustName(crmModalCustomer);
        const cEmail = getCustEmail(crmModalCustomer);
        const cPhone = getCustPhone(crmModalCustomer);
        const cStatus = getCustStatus(crmModalCustomer);
        const cType = getCustType(crmModalCustomer);
        const cCountry = getCustCountry(crmModalCustomer);
        const cCity = getCustCity(crmModalCustomer);
        const cJoined = getCustJoinedAt(crmModalCustomer);
        const cSpent = getCustTotalSpent(crmModalCustomer);
        const cWallet = getCustWallet(crmModalCustomer);

        // Filter orders and tickets matching this specific customer
        const clientOrders = orders.filter(o => o.id === cId || o.itemTitle?.includes(cName) || o.customerName === cName || o.customerEmail === cEmail);
        const clientTickets = tickets.filter(t => t.userId === cId || t.userEmail === cEmail || t.subject?.toLowerCase().includes(cName.toLowerCase()));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
            <div 
              style={{ 
                borderRadius: '24px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.12)', 
                backdropFilter: 'blur(20px)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)'
              }}
              className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0F172A]' : 'bg-[#FFFFFF]'} p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300 relative text-left`}
            >
              
              {/* Background decorative gradient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7C3AED]/10 via-[#A855F7]/10 to-[#EC4899]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200/60 dark:border-white/[0.08] pb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[18px] bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] flex items-center justify-center font-black text-xl text-white border border-white/20 shadow-lg">
                    {cName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        {cName}
                      </h4>
                      <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${
                        cStatus === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {cStatus.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[9px] font-mono font-bold rounded-md uppercase">
                        {cType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                      {crmModalCustomer.companyName || 'Private Account'} • Mapped ID: <span className="font-mono text-[#7C3AED] font-bold">{cId}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setCrmModalCustomer(null)} 
                  className={`p-2 rounded-xl border transition cursor-pointer active:scale-95 ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white' 
                      : 'bg-slate-100 border-slate-250 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM quick metrics row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {[
                  { label: "Total Spent", value: `$${cSpent.toLocaleString()}`, color: "text-[#22C55E]", desc: "LTV spent ledger" },
                  { label: "Wallet Balance", value: `$${cWallet.toLocaleString()}`, color: "text-[#7C3AED]", desc: "Available credits" },
                  { label: "Total Purchases", value: `${clientOrders.length} orders`, color: "text-[#A855F7]", desc: "Invoiced accounts" },
                  { label: "Support Tickets", value: `${clientTickets.length} cases`, color: "text-[#EC4899]", desc: "SLA status tracking" }
                ].map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-[16px] border ${isDark ? 'bg-neutral-950/60 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80'} text-center`}
                  >
                    <p className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.label}</p>
                    <p className={`text-xl font-mono font-black mt-1 ${m.color}`}>{m.value}</p>
                    <p className="text-[8px] text-slate-400 mt-1 font-mono">{m.desc}</p>
                  </div>
                ))}
              </div>

              {/* Body Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                
                {/* Left Column: CRM notes, contact details (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Contact cards */}
                  <div 
                    style={{ borderRadius: '20px' }} 
                    className={`p-5 border ${isDark ? 'bg-neutral-950/40 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80'} space-y-3.5`}
                  >
                    <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-white/[0.04] pb-2.5">
                      <Users className="w-4 h-4 text-[#7C3AED]" />
                      <h5 className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        CRM Contacts Dossier
                      </h5>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Secure Email Address</span>
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cEmail || 'No Email Record'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Cellular Contact Number</span>
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cPhone || 'No Phone Record'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Physical Registered Office</span>
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cCity}, {cCountry}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Customer Register Date</span>
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cJoined || 'January 2026'}</span>
                      </div>
                      {crmModalCustomer.websiteUrl && (
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Corporate Domain URL</span>
                          <a 
                            href={crmModalCustomer.websiteUrl.startsWith('http') ? crmModalCustomer.websiteUrl : `https://${crmModalCustomer.websiteUrl}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[#06B6D4] font-semibold hover:underline"
                          >
                            {crmModalCustomer.websiteUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personalized Notes Area */}
                  <div 
                    style={{ borderRadius: '20px' }} 
                    className={`p-5 border ${isDark ? 'bg-neutral-950/40 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80'} space-y-4`}
                  >
                    <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-white/[0.04] pb-2.5">
                      <FileText className="w-4 h-4 text-[#A855F7]" />
                      <h5 className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        CRM Personalized Notes
                      </h5>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Add private operational logs, customer behavioral traits, custom SLA parameters, or custom notes regarding this contact.
                    </p>

                    <div>
                      <textarea
                        style={{ 
                          minHeight: '140px',
                          borderRadius: '14px',
                          transition: '300ms'
                        }}
                        className={`w-full text-xs font-mono p-3 focus:outline-none resize-none border ${
                          isDark 
                            ? 'bg-[#111827] border-[#374151] text-white focus:border-[#7C3AED] focus:ring-[4px] focus:ring-[#7C3AED]/18' 
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-[#7C3AED] focus:ring-[4px] focus:ring-[#7C3AED]/18'
                        }`}
                        placeholder="Type customer notes and private insights here..."
                        value={crmModalNotes}
                        onChange={(e) => setCrmModalNotes(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleSaveCrmModalNotes}
                      style={{
                        height: '46px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        transition: '300ms'
                      }}
                      className="w-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] text-white text-xs shadow-md shadow-[#7C3AED]/20 hover:shadow-lg hover:shadow-[#7C3AED]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save CRM Notes
                    </button>
                  </div>

                </div>

                {/* Right Column: History pane (orders, tickets) (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Tab A: Past Orders */}
                  <div 
                    style={{ borderRadius: '20px' }} 
                    className={`p-5 border ${isDark ? 'bg-neutral-950/40 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80'} space-y-3`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/[0.04] pb-2.5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#22C55E]" />
                        <h5 className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Order & Transaction History ({clientOrders.length})
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Past Orders Mapped</span>
                    </div>

                    {clientOrders.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 font-mono">
                        No purchases recorded under this customer identity.
                      </div>
                    ) : (
                      <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2 font-mono">
                        {clientOrders.map((o: any, oIdx: number) => (
                          <div 
                            key={o.id || oIdx} 
                            className={`p-3 rounded-xl border ${
                              isDark ? 'bg-neutral-950 border-neutral-900/60' : 'bg-white border-slate-200'
                            } flex items-center justify-between text-xs`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#7C3AED]">{o.id}</span>
                                <span className="text-slate-400">•</span>
                                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'} truncate max-w-[180px]`} title={o.itemTitle}>
                                  {o.itemTitle || 'Custom Services'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span>📅 {o.date}</span>
                                <span>•</span>
                                <span>💰 ৳{Math.round(o.price * (usdBdtRate || 118.5)).toLocaleString()} (${o.price})</span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                              o.paymentStatus === 'completed' || o.paymentStatus === 'paid'
                                ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                : o.paymentStatus === 'failed'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {o.paymentStatus?.toUpperCase() || 'PAID'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tab B: Active Tickets */}
                  <div 
                    style={{ borderRadius: '20px' }} 
                    className={`p-5 border ${isDark ? 'bg-neutral-950/40 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80'} space-y-3`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/[0.04] pb-2.5">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#A855F7]" />
                        <h5 className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Active Helpdesk & Ticket SLAs ({clientTickets.length})
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Assigned SLA Cases</span>
                    </div>

                    {clientTickets.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 font-mono">
                        No active or historical support cases found for this account.
                      </div>
                    ) : (
                      <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2 font-mono">
                        {clientTickets.map((t: any, tIdx: number) => (
                          <div 
                            key={t.id || tIdx} 
                            className={`p-3 rounded-xl border ${
                              isDark ? 'bg-neutral-950 border-neutral-900/60' : 'bg-white border-slate-200'
                            } flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#A855F7]">#{t.id}</span>
                                <span className="text-slate-400">•</span>
                                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                  {t.subject}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2">
                                <span>🏢 {t.department || 'Technical Desk'}</span>
                                <span>•</span>
                                <span>📅 {t.createdAt || 'June 12'}</span>
                                <span>•</span>
                                <span className={`px-1 rounded text-[8px] font-bold ${
                                  t.priority === 'critical' || t.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-800 text-slate-300'
                                }`}>
                                  {t.priority?.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            <span className={`self-start md:self-auto px-2 py-0.5 rounded text-[8px] font-black border ${
                              t.status === 'closed'
                                ? 'bg-neutral-800 text-slate-400 border-neutral-700'
                                : t.status === 'answered'
                                ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {t.status?.toUpperCase() || 'OPEN'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================
         5. MODAL WINDOWS / DIALOG POPUPS (UPGRADED FORM CARDS GLASSMORPHISM)
         ======================================================== */}
      
      {/* A. CUSTOM RED DELETE CONFIRMATION MODAL */}
      {custDeleteConfirm?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            style={{ borderRadius: '24px', padding: '24px' }}
            className={`w-full max-w-md border ${isDark ? 'border-red-900/30 bg-[#0F172A]' : 'bg-white border-red-200'} shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200`}
          >
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-2">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-neutral-100 tracking-tight">Purge Mapped Customer Registry?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete this customer? This operation is completely irreversible and purges all historical spend logs.
              </p>
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl text-xs font-mono font-bold text-red-400">
                {custDeleteConfirm.customerName} (ID: {custDeleteConfirm.customerId})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCustDeleteConfirm(null)}
                className="py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-slate-300 transition"
              >
                Cancel / Keep File
              </button>
              <button
                onClick={() => handleDeleteCustomer(custDeleteConfirm.customerId, custDeleteConfirm.customerName)}
                className="py-2.5 rounded-xl bg-[#EF4444] hover:bg-red-700 text-white text-xs font-bold transition shadow-lg shadow-red-500/15"
              >
                Confirm Delete / Purge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. SINGLE ORDERS OVERLAY MODAL */}
      {selectedCustForOrders && (() => {
        const cId = getCustId(selectedCustForOrders);
        const cName = getCustName(selectedCustForOrders);
        const clientOrders = orders.filter(o => o.id === cId || o.itemTitle.includes(cName));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div style={{ borderRadius: '24px' }} className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto border ${cardBg} p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200`}>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-[#7C3AED]" />
                  <h4 className="text-base font-black text-neutral-100 tracking-tight">Purchase Ledger: {cName}</h4>
                </div>
                <button onClick={() => setSelectedCustForOrders(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {clientOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-12 text-center">No purchases recorded for this customer.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs mb-0">
                    <thead>
                      <tr className="border-b border-white/[0.05] text-slate-400 font-mono text-[10px]">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Service Purchased</th>
                        <th className="py-2">Amount Paid</th>
                        <th className="py-2">Order Date</th>
                        <th className="py-2">Payment status</th>
                        <th className="py-2 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientOrders.map((o: any) => (
                        <tr key={o.id} className="border-b border-white/[0.02]">
                          <td className="py-3 font-mono font-bold text-[#7C3AED]">{o.id}</td>
                          <td className="py-3 font-medium text-slate-200">{o.itemTitle || 'Custom Service Package'}</td>
                          <td className="py-3 font-mono text-slate-300 font-bold">${o.price}</td>
                          <td className="py-3 font-mono text-slate-400">{o.date}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                              {o.paymentStatus?.toUpperCase() || 'COMPLETED'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDownloadInvoicePdf(o, selectedCustForOrders)}
                              className="p-1 rounded bg-neutral-950 border border-neutral-800 hover:border-[#7C3AED] text-slate-400 hover:text-white text-[10px] font-mono transition"
                            >
                              Download Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* C. SINGLE INVOICES OVERLAY MODAL */}
      {selectedCustForInvoices && (() => {
        const cId = getCustId(selectedCustForInvoices);
        const cName = getCustName(selectedCustForInvoices);
        const clientOrders = orders.filter(o => o.id === cId || o.itemTitle.includes(cName));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div style={{ borderRadius: '24px' }} className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto border ${cardBg} p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200`}>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#EC4899]" />
                  <h4 className="text-base font-black text-neutral-100 tracking-tight">Official Invoices Directory: {cName}</h4>
                </div>
                <button onClick={() => setSelectedCustForInvoices(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {clientOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-12 text-center">No invoiced records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs mb-0">
                    <thead>
                      <tr className="border-b border-white/[0.05] text-slate-400 font-mono text-[10px]">
                        <th className="py-2">Invoice ID</th>
                        <th className="py-2">Date Generated</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Price Total</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientOrders.map((o: any, idx) => (
                        <tr key={idx} className="border-b border-white/[0.02]">
                          <td className="py-3 font-mono font-bold text-slate-300">#INV-{idx * 111 + 7654}</td>
                          <td className="py-3 font-mono text-slate-400">{o.date}</td>
                          <td className="py-3 text-slate-200 font-semibold">{o.itemTitle || 'SaaS Entitlement Services'}</td>
                          <td className="py-3 font-mono text-[#22C55E] font-extrabold">${o.price}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDownloadInvoicePdf(o, selectedCustForInvoices)}
                              className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white rounded text-[10px] font-mono transition"
                            >
                              Download Invoice PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* D. PREMIUM EMAIL COMPOSER MODAL */}
      {emailComposer?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div style={{ borderRadius: '24px' }} className={`w-full max-w-xl border ${cardBg} p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="text-[#EC4899]" />
                <h4 className="text-base font-black text-neutral-100 tracking-tight">Construct Secure Email Dispatch</h4>
              </div>
              <button onClick={() => setEmailComposer(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Recipient Name</span>
                <p className="font-bold text-slate-200 py-2 px-3 bg-neutral-950 border border-neutral-900 rounded-xl">{emailComposer.customerName}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Target Email Inbox</span>
                <p className="font-bold text-slate-200 py-2 px-3 bg-neutral-950 border border-neutral-900 rounded-xl">{emailComposer.customerEmail}</p>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Email Subject</label>
                <input
                  type="text"
                  value={emailComposer.subject}
                  onChange={(e) => setEmailComposer({ ...emailComposer, subject: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white focus:border-[#7C3AED] outline-none"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Message Content Body</label>
                <textarea
                  style={{ minHeight: '130px' }}
                  value={emailComposer.body}
                  onChange={(e) => setEmailComposer({ ...emailComposer, body: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs text-slate-200 focus:border-[#7C3AED] outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setEmailComposer(null)}
                className="py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-slate-300 transition"
              >
                Cancel Draft
              </button>
              <button
                onClick={() => {
                  triggerToast(`✉️ Correspondence email transmitted to ${emailComposer.customerEmail}!`);
                  logAdminAction(`Sent email update to ${emailComposer.customerName} via SMTP gateway`);
                  setEmailComposer(null);
                }}
                className="py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7C3AED]/20 hover:scale-[1.01] transition-all"
              >
                Transmit Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
