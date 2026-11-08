import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, Search, Check, CheckCheck, Clock, User, 
  Settings, Trash2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, 
  ExternalLink, Phone, Mail, MapPin, Globe, Laptop, ShieldCheck, 
  HelpCircle, ChevronRight, X, Volume2, VolumeX, Plus, FileText,
  Smile, CornerDownRight, Tag, Shield
} from 'lucide-react';
import { 
  liveChatService, 
  LiveChatSession, 
  LiveChatMessage, 
  LiveChatSettings,
  AdminOverallStatus,
  AdminPresenceStatus,
  CANNED_QUICK_REPLIES,
  QuickReplyCategory,
  CannedQuickReply,
  playChatNotificationSound 
} from '../services/liveChatService';

interface AdminLiveChatProps {
  language: 'en' | 'bn' | 'ar';
  theme: 'light' | 'dark';
  triggerToast: (msg: string) => void;
  currentUser?: any;
}

export default function AdminLiveChat({
  language,
  theme,
  triggerToast,
  currentUser
}: AdminLiveChatProps) {
  const isDark = theme === 'dark';

  // --- STATE ---
  const [sessions, setSessions] = useState<LiveChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'waiting' | 'resolved'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'visitor'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [settings, setSettings] = useState<LiveChatSettings>(liveChatService.getSettings());
  const [isSending, setIsSending] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Quick reply category filter ('all' | 'domain' | 'hosting' | 'services' | 'marketplace' | 'billing' | 'greeting')
  const [cannedCategory, setCannedCategory] = useState<QuickReplyCategory>('all');

  // Real-time admin presence status ('online' | 'away' | 'offline')
  const [adminPresence, setAdminPresence] = useState<AdminOverallStatus>(() => liveChatService.getAdminOverallStatus());
  const [isUpdatingPresence, setIsUpdatingPresence] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real-time presence subscription and auto-heartbeat
  useEffect(() => {
    const unsubPresence = liveChatService.subscribeToAdminPresence((presence) => {
      setAdminPresence(presence);
    });

    const currentAdminId = currentUser?.id || 'admin_operator_primary';
    const currentAdminName = currentUser?.name || 'Admin Engineer';
    const stopHeartbeat = liveChatService.startAdminHeartbeat(currentAdminId, currentAdminName, currentUser?.role || 'admin');

    return () => {
      unsubPresence();
      stopHeartbeat();
    };
  }, [currentUser]);

  const handleAdminStatusChange = async (newStatus: AdminPresenceStatus) => {
    setIsUpdatingPresence(true);
    const currentAdminId = currentUser?.id || 'admin_operator_primary';
    await liveChatService.setAdminPresenceStatus(currentAdminId, newStatus);
    await liveChatService.setAllAdminsStatus(newStatus);
    setIsUpdatingPresence(false);
    triggerToast(
      newStatus === 'online' 
        ? 'Admin status updated to Online (Customer chat shows Online)' 
        : newStatus === 'away' 
          ? 'Admin status updated to Away (Customer chat shows Away notice)' 
          : 'Admin status updated to Offline (Customer chat shows Offline notice)'
    );
  };

  // Instant one-click direct send for canned responses
  const handleDirectSendCanned = async (text: string) => {
    if (!activeSessionId || isSending) return;
    setIsSending(true);
    try {
      const adminName = currentUser?.name || 'Support Specialist';
      const adminId = currentUser?.id || 'admin_op';
      await liveChatService.sendStaffMessage(activeSessionId, text, adminName, adminId);
      setReplyText('');
      triggerToast('Quick reply sent instantly to customer');
    } catch {
      triggerToast('Failed to send quick response');
    } finally {
      setIsSending(false);
    }
  };

  // Load and subscribe to sessions
  useEffect(() => {
    const unsub = liveChatService.subscribeToSessions((updatedSessions) => {
      setSessions(updatedSessions);
      // Auto-select first session if none selected
      if (!activeSessionId && updatedSessions.length > 0) {
        setActiveSessionId(updatedSessions[0].id);
      }
    });

    return () => unsub();
  }, [activeSessionId]);

  // Subscribe to messages of active session
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (currentSession) {
      setNotesText(currentSession.internalNotes || '');
    }

    const unsub = liveChatService.subscribeToMessages(activeSessionId, (updatedMsgs) => {
      setMessages(updatedMsgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsub();
  }, [activeSessionId, sessions]);

  // Active session object
  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Filtered sessions
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = 
      s.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.visitorEmail && s.visitorEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.lastMessageText && s.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : s.status === statusFilter;
    const isCustomerSession = Boolean(s.isCustomer || s.userRole === 'customer');
    const matchesRole = 
      roleFilter === 'all' 
        ? true 
        : roleFilter === 'customer' 
          ? isCustomerSession 
          : !isCustomerSession;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate statistics
  const totalCount = sessions.length;
  const customerCount = sessions.filter(s => s.isCustomer || s.userRole === 'customer').length;
  const visitorCount = sessions.filter(s => !s.isCustomer && s.userRole !== 'customer').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;
  const waitingCount = sessions.filter(s => s.status === 'waiting' || (s.unreadStaffCount && s.unreadStaffCount > 0) || (s.unreadVisitorCount && s.unreadVisitorCount > 0)).length;
  const resolvedCount = sessions.filter(s => s.status === 'resolved').length;

  // Handle staff message send
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeSessionId || isSending) return;

    setIsSending(true);
    const staffName = currentUser?.name ? `${currentUser.name} (Support Staff)` : 'Sayeeda Yeasmin (Support Staff)';
    const staffId = currentUser?.id || 'stf-02';

    try {
      await liveChatService.sendStaffMessage(activeSessionId, replyText.trim(), staffName, staffId);
      setReplyText('');
      triggerToast(language === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে' : 'Reply sent successfully');
    } catch {
      triggerToast('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  // Change status
  const handleStatusChange = async (status: 'active' | 'waiting' | 'resolved' | 'archived') => {
    if (!activeSessionId) return;
    await liveChatService.updateSessionStatus(activeSessionId, status);
    triggerToast(language === 'bn' ? `স্ট্যাটাস পরিবর্তিত: ${status}` : `Session status changed to ${status}`);
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!activeSessionId) return;
    await liveChatService.updateSessionNotes(activeSessionId, notesText);
    triggerToast(language === 'bn' ? 'অভ্যন্তরীণ নোট সেভ হয়েছে' : 'Internal agent notes saved');
  };

  // Delete session
  const handleDeleteSession = async (chatId: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি এই চ্যাট সেশনটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this live chat session?')) {
      await liveChatService.deleteSession(chatId);
      if (activeSessionId === chatId) {
        const remaining = sessions.filter(s => s.id !== chatId);
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
      triggerToast(language === 'bn' ? 'চ্যাট সেশন মুছে ফেলা হয়েছে' : 'Chat session deleted');
    }
  };

  // Simulate new incoming chat
  const handleSimulateVisitor = async () => {
    setIsSimulating(true);
    try {
      const newSession = await liveChatService.simulateIncomingVisitorChat();
      setActiveSessionId(newSession.id);
      triggerToast(language === 'bn' ? `⚡ নতুন ভিজিটর চ্যাট এসেছে: ${newSession.visitorName}` : `⚡ New visitor chat request from ${newSession.visitorName}`);
    } catch {
      triggerToast('Could not simulate visitor chat.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    await liveChatService.saveSettings(settings);
    setShowSettingsModal(false);
    triggerToast(language === 'bn' ? 'লাইভ চ্যাট সেটিংস সংরক্ষিত হয়েছে!' : 'Live Chat & Tawk.to settings saved successfully!');
  };

  // Helper relative time
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6" id="admin-live-chat-management-view">
      
      {/* Top Header & Analytics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-mono font-black uppercase tracking-wider">
              Real-time Helpdesk
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Socket / Firestore Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Live Chat Support Center</span>
            <MessageSquare className="w-6 h-6" />
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-0.5">
            Manage incoming live chat requests from website visitors, reply in real-time, and manage Tawk.to or native widget settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Real-time Operator Status Controller */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/20 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 font-bold">
              Operator Presence:
            </span>
            <div className="inline-flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => handleAdminStatusChange('online')}
                disabled={isUpdatingPresence}
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminPresence.status === 'online'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Broadcast Online status to all visitors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>Online</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdminStatusChange('away')}
                disabled={isUpdatingPresence}
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminPresence.status === 'away'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Broadcast Away status to all visitors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                <span>Away</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdminStatusChange('offline')}
                disabled={isUpdatingPresence}
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminPresence.status === 'offline'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Broadcast Offline status to all visitors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Offline</span>
              </button>
            </div>
            <span className="text-[9.5px] font-mono text-cyan-200 font-bold px-1.5 border-l border-white/15">
              {adminPresence.activeCount} active node(s)
            </span>
          </div>

          <button
            onClick={handleSimulateVisitor}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Simulate an incoming live visitor chat for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Visitor Chat'}</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white text-indigo-700 hover:bg-white/90 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Tawk.to & Chat Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Total Inquiries</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All registered chat sessions</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Customer Chats</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{customerCount}</p>
          <span className="text-[10px] text-slate-400">Logged-in verified customers</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-bold">Visitor Chats</span>
            <Globe className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black mt-1 text-sky-600 dark:text-sky-400">{visitorCount}</p>
          <span className="text-[10px] text-slate-400">Guest & unauthenticated visitors</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Waiting / Needs Reply</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">{waitingCount}</p>
          <span className="text-[10px] text-slate-400">Awaiting admin operator response</span>
        </div>
      </div>

      {/* Main Two-Column Live Chat Interface */}
      <div className={`rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]`}>
        
        {/* LEFT COLUMN: Chat Sessions List (4 cols) */}
        <div className={`lg:col-span-4 border-r ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'} flex flex-col`}>
          
          {/* Search and Filters Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, visitor, email, topic..."
                className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Row 1: Role Type Filters (Customer vs Visitor) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[9.5px] font-black">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                  roleFilter === 'all'
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-black shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                All Chats ({sessions.length})
              </button>
              <button
                onClick={() => setRoleFilter('customer')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 flex items-center gap-1 ${
                  roleFilter === 'customer'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Customers ({customerCount})</span>
              </button>
              <button
                onClick={() => setRoleFilter('visitor')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 flex items-center gap-1 ${
                  roleFilter === 'visitor'
                    ? 'bg-sky-600 text-white font-black shadow-xs'
                    : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Visitors ({visitorCount})</span>
              </button>
            </div>

            {/* Row 2: Status Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[9.5px] font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Status: All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                  statusFilter === 'active'
                    ? 'bg-emerald-600 text-white font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('waiting')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                  statusFilter === 'waiting'
                    ? 'bg-amber-600 text-white font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Waiting ({waitingCount})
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                  statusFilter === 'resolved'
                    ? 'bg-slate-700 text-white font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 max-h-[550px]">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">No chat sessions found</p>
                <p className="text-[10px] text-slate-500 mt-1">Try changing filters or simulate a test chat</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = session.id === activeSessionId;
                const isCustomer = Boolean(session.isCustomer || session.userRole === 'customer');
                const hasUnread = (session.unreadStaffCount || 0) > 0 || (session.unreadVisitorCount || 0) > 0;
                const unreadNum = (session.unreadStaffCount || 0) + (session.unreadVisitorCount || 0);

                return (
                  <div
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={`p-3.5 transition-all duration-150 cursor-pointer text-left relative ${
                      isSelected
                        ? isDark 
                          ? 'bg-blue-950/40 border-l-4 border-blue-500' 
                          : 'bg-blue-50/80 border-l-4 border-blue-600'
                        : isDark
                          ? 'hover:bg-slate-900/60'
                          : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative shrink-0">
                          <div className={`w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-xs ${
                            isCustomer 
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500' 
                              : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                          }`}>
                            {session.visitorName.charAt(0).toUpperCase()}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            session.status === 'resolved' ? 'bg-slate-400' : 'bg-emerald-500'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-xs font-black truncate ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-800 dark:text-slate-100'}`}>
                              {session.visitorName}
                            </h4>
                            {isCustomer ? (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
                                Customer
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0 border border-sky-500/20">
                                Visitor
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{session.visitorLocation || 'Online User'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9.5px] text-slate-400 font-mono font-medium">
                          {formatTimeAgo(session.lastMessageAt)}
                        </span>
                        {hasUnread && (
                          <span className="block mt-0.5 ml-auto w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black leading-none flex items-center justify-center shadow-xs">
                            {unreadNum}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Snippet */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                      {session.lastMessageText || 'Chat initiated'}
                    </p>

                    {/* Customer Contact Line (Phone & Email) */}
                    {(session.visitorPhone || session.visitorEmail) && (
                      <div className="flex items-center gap-2 mt-1 text-[9.5px] font-mono">
                        {session.visitorPhone && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{session.visitorPhone}</span>
                          </span>
                        )}
                        {session.visitorEmail && (
                          <span className="text-slate-400 truncate max-w-[130px]">
                            {session.visitorEmail}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Department Tag & Status */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold truncate max-w-[170px]">
                        {session.department}
                      </span>
                      {session.status === 'waiting' && (
                        <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          Waiting Reply
                        </span>
                      )}
                      {session.status === 'resolved' && (
                        <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-slate-500/15 text-slate-500">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Thread & Agent Console (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900">
          
          {activeSession ? (
            <>
              {/* Active Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                    {activeSession.visitorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {activeSession.visitorName}
                      </h3>
                      {Boolean(activeSession.isCustomer || activeSession.userRole === 'customer') ? (
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Customer</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>Guest Visitor</span>
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold font-mono uppercase ${
                        activeSession.status === 'active' 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : activeSession.status === 'waiting'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-500/15 text-slate-600 dark:text-slate-400'
                      }`}>
                        {activeSession.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeSession.visitorEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{activeSession.visitorEmail}</span>
                        </span>
                      )}
                      {activeSession.visitorPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{activeSession.visitorPhone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{activeSession.visitorPage || '/'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                    className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                      showInternalNotes
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                    title="Staff Internal Notes"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Notes</span>
                  </button>

                  <select
                    value={activeSession.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="waiting">Waiting Reply</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    onClick={() => handleDeleteSession(activeSession.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                    title="Delete Chat Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Internal Notes Flyout (Optional) */}
              {showInternalNotes && (
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex-1 w-full">
                    <span className="text-[10px] font-mono uppercase font-black text-amber-700 dark:text-amber-400 block mb-1">
                      Private Agent Internal Notes (Invisible to Visitor)
                    </span>
                    <input
                      type="text"
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="e.g. Needs quote by Monday; budget ~৳1,50,000; interested in Saudi Cloud hosting."
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer self-end sm:self-auto"
                  >
                    Save Notes
                  </button>
                </div>
              )}

              {/* Conversation Messages Scroll View */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 max-h-[420px] bg-slate-50/40 dark:bg-slate-950/30">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No messages yet in this session.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isStaff = msg.senderRole === 'staff';
                    const isBot = msg.senderRole === 'bot';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                            {isStaff ? (msg.senderName || 'Support Staff') : isBot ? 'WebzoneBD Bot' : msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs leading-relaxed font-sans shadow-xs ${
                            isStaff
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                              : isBot
                                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 rounded-tl-xs'
                                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Canned Quick Responses Horizontal Hub */}
              <div className="bg-slate-100/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 p-2 space-y-1.5">
                {/* Row 1: Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1 mr-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick Reply:</span>
                  </span>
                  {[
                    { id: 'all', label: 'All', count: CANNED_QUICK_REPLIES.length },
                    { id: 'domain', label: '🌐 Domain', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'domain').length },
                    { id: 'hosting', label: '⚡ Hosting', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'hosting').length },
                    { id: 'services', label: '💻 Services', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'services').length },
                    { id: 'marketplace', label: '🛒 Marketplace', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'marketplace').length },
                    { id: 'billing', label: '💳 Payment/Order', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'billing').length },
                    { id: 'greeting', label: '👋 Greetings', count: CANNED_QUICK_REPLIES.filter(r => r.category === 'greeting').length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCannedCategory(cat.id as QuickReplyCategory)}
                      className={`px-2 py-0.5 rounded-md text-[9.5px] font-black tracking-tight shrink-0 transition cursor-pointer flex items-center gap-1 ${
                        cannedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[8.5px] px-1 py-0.2 rounded-full font-mono ${
                        cannedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Row 2: Horizontal Quick Reply Pills with Insert & Instant-Send */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {(cannedCategory === 'all'
                    ? CANNED_QUICK_REPLIES
                    : CANNED_QUICK_REPLIES.filter(r => r.category === cannedCategory)
                  ).map((item) => (
                    <div
                      key={item.id}
                      className="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 rounded-lg p-0.5 shrink-0 shadow-2xs hover:border-blue-400 dark:hover:border-cyan-500/60 transition group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setReplyText(item.text);
                          triggerToast(`Ready reply loaded: ${item.title}`);
                        }}
                        className="px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 text-left transition cursor-pointer flex items-center gap-1"
                        title={`${item.title}\n\n${item.text}\n\n(Click to insert into message box)`}
                      >
                        <span>{item.shortLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectSendCanned(item.text)}
                        disabled={isSending}
                        className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition cursor-pointer border-l border-slate-100 dark:border-slate-800"
                        title="Send this ready response immediately to the customer"
                      >
                        <Send className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Admin Reply Field Console */}
              <div className="px-3.5 py-1.5 bg-slate-100/90 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>
                    Admin Reply Console &mdash; Responding to: <strong className="text-blue-600 dark:text-cyan-400">{activeSession.visitorName}</strong> 
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800">
                      {Boolean(activeSession.isCustomer || activeSession.userRole === 'customer') ? 'Customer' : 'Visitor'}
                    </span>
                  </span>
                </span>
                <span className="text-[9.5px] text-slate-400 font-mono hidden sm:inline">
                  Instant Socket / Firestore Sync
                </span>
              </div>

              {/* Staff Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={`Write your admin reply to ${activeSession.visitorName}... (Press Ctrl+Enter or click Send)`}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSending}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed self-stretch"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send Reply</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">No Chat Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select a live session from the left column to view the visitor's conversation history and send real-time responses.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* TAWK.TO & LIVE CHAT INTEGRATION SETTINGS MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Live Chat & Tawk.to Integration Settings
                    </h3>
                    <p className="text-xs text-slate-500">Configure chat providers, widget properties, and automation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Provider Selection */}
                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                    Live Chat Provider Mode:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div
                      onClick={() => setSettings({ ...settings, provider: 'native' })}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        settings.provider === 'native'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-cyan-400 font-black'
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs">Built-in Live Chat</span>
                        {settings.provider === 'native' && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Zero setup. Full real-time Firestore synchronization & admin response center.
                      </p>
                    </div>

                    <div
                      onClick={() => setSettings({ ...settings, provider: 'tawk' })}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        settings.provider === 'tawk'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-black'
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs">Tawk.to Integration</span>
                        {settings.provider === 'tawk' && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Embed official Tawk.to widget and manage conversations on Tawk.to mobile & web apps.
                      </p>
                    </div>

                    <div
                      onClick={() => setSettings({ ...settings, provider: 'both' })}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        settings.provider === 'both'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-400 font-black'
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs">Hybrid Mode</span>
                        {settings.provider === 'both' && <Check className="w-4 h-4 text-indigo-500" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Use WebzoneBD live chat by default, with instant Tawk.to switch capability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tawk.to Credentials Configuration */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Tawk.to Connection Parameters
                    </span>
                    <a
                      href="https://dashboard.tawk.to"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
                    >
                      Open Tawk.to Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 font-bold block mb-1">
                        Tawk.to Property ID:
                      </label>
                      <input
                        type="text"
                        value={settings.tawkPropertyId}
                        onChange={(e) => setSettings({ ...settings, tawkPropertyId: e.target.value })}
                        placeholder="e.g. 64a... or embed code url"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 font-bold block mb-1">
                        Widget ID (Default: 'default'):
                      </label>
                      <input
                        type="text"
                        value={settings.tawkWidgetId}
                        onChange={(e) => setSettings({ ...settings, tawkWidgetId: e.target.value })}
                        placeholder="default"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 leading-relaxed font-sans">
                    💡 <strong>Where to find your Tawk.to ID:</strong> Log into <a href="https://dashboard.tawk.to" target="_blank" rel="noreferrer" className="underline text-blue-500">tawk.to</a> &gt; Click <em>Administration</em> (gear icon) &gt; Select <em>Channels &gt; Chat Widget</em> &gt; Copy the Property ID from the direct chat link.
                  </div>
                </div>

                {/* Operating Hours & Audio alerts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Operating Hours Label:
                    </label>
                    <input
                      type="text"
                      value={settings.operatingHours}
                      onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                      placeholder="e.g. 24/7 Online Support Node"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Audio Chime Alerts</span>
                      <span className="text-[10px] text-slate-500">Synthesized audio on new message</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !settings.soundEnabled;
                        setSettings({ ...settings, soundEnabled: next });
                        if (next) playChatNotificationSound();
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-200 ${
                        settings.soundEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                </div>

                {/* Welcome Message (English) */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Automated Welcome Message (English):
                  </label>
                  <textarea
                    rows={2}
                    value={settings.welcomeMessageEn}
                    onChange={(e) => setSettings({ ...settings, welcomeMessageEn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Welcome Message (Bengali) */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Automated Welcome Message (Bengali):
                  </label>
                  <textarea
                    rows={2}
                    value={settings.welcomeMessageBn}
                    onChange={(e) => setSettings({ ...settings, welcomeMessageBn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
