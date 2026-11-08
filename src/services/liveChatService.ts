import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { safeLocalStorage as localStorage } from '../utils/storage';

export interface LiveChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: 'visitor' | 'staff' | 'bot' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface LiveChatSession {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  visitorLocation?: string;
  visitorPage?: string;
  visitorDevice?: string;
  department: string;
  status: 'active' | 'waiting' | 'resolved' | 'archived';
  startedAt: string;
  lastMessageAt: string;
  lastMessageText: string;
  unreadVisitorCount: number;
  unreadStaffCount: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  internalNotes?: string;
  rating?: number;
  isTypingVisitor?: boolean;
  isTypingStaff?: boolean;
  isCustomer?: boolean;
  customerUserId?: string;
  userRole?: 'customer' | 'visitor' | 'admin';
}

export interface LiveChatSettings {
  enabled: boolean;
  provider: 'native' | 'tawk' | 'both';
  tawkPropertyId: string;
  tawkWidgetId: string;
  welcomeMessageEn: string;
  welcomeMessageBn: string;
  welcomeMessageAr: string;
  operatingHours: string;
  soundEnabled: boolean;
  preChatFormRequired: boolean;
}

export const DEFAULT_LIVE_CHAT_SETTINGS: LiveChatSettings = {
  enabled: true,
  provider: 'both',
  tawkPropertyId: '',
  tawkWidgetId: 'default',
  welcomeMessageEn: "Assalamu Alaikum! Welcome to WebzoneBD Support. An agent or engineering specialist will be with you shortly. How can we help?",
  welcomeMessageBn: "আসসালামু আলাইকুম! ওয়েবজোনবিডি লাইভ সাপোর্টে আপনাকে স্বাগতম। কিছুক্ষণের মধ্যে আমাদের সাপোর্ট ইঞ্জিনিয়ার আপনাকে সহায়তা করবেন।",
  welcomeMessageAr: "السلام عليكم! مرحباً بكم في الدعم المباشر لـ WebzoneBD. سيتواصل معك أحد مهندسينا قريباً. كيف يمكننا مساعدتك؟",
  operatingHours: "24/7 Online Support Node (Riyadh & Dhaka)",
  soundEnabled: true,
  preChatFormRequired: true
};

const SETTINGS_KEY = 'webzone_live_chat_settings';
const SESSIONS_KEY = 'webzone_live_chat_sessions';
const MESSAGES_PREFIX = 'webzone_live_chat_msg_';
const BROADCAST_CHANNEL_NAME = 'webzone_live_chat_channel';
const PRESENCE_KEY = 'webzone_admin_presence_records';

export type AdminPresenceStatus = 'online' | 'away' | 'offline';

export interface AdminPresenceRecord {
  adminId: string;
  adminName: string;
  role?: string;
  status: AdminPresenceStatus;
  lastSeen: string; // ISO 8601 string
  location?: string;
  device?: string;
}

export interface AdminOverallStatus {
  status: AdminPresenceStatus;
  activeCount: number;
  awayCount: number;
  totalAdmins: number;
  onlineAdmins: AdminPresenceRecord[];
  lastChecked: string;
}

export type QuickReplyCategory = 'all' | 'domain' | 'hosting' | 'services' | 'marketplace' | 'billing' | 'greeting';

export interface CannedQuickReply {
  id: string;
  category: 'domain' | 'hosting' | 'services' | 'marketplace' | 'billing' | 'greeting';
  title: string;
  shortLabel: string;
  text: string;
  iconName?: string;
  tags?: string[];
}

export const CANNED_QUICK_REPLIES: CannedQuickReply[] = [
  // --- DOMAIN ---
  {
    id: 'canned_dom_01',
    category: 'domain',
    title: '.COM Domain Pricing & Registration',
    shortLabel: '🌐 .COM Price ($11.50)',
    text: 'Our international .COM domain registration is $11.50 (1,350 BDT/year) with instant DNS activation, free WHOIS privacy protection, and full nameserver control.',
    tags: ['domain', 'com', 'pricing', 'registration']
  },
  {
    id: 'canned_dom_02',
    category: 'domain',
    title: '.com.bd / .bd BTCL Registration Guide',
    shortLabel: '🌐 .com.bd BTCL Reg',
    text: 'We provide official 2-year BTCL .com.bd / .bd domain registration assistance. We take care of NID / Trade License verification and DNS delegation within 24-48 business hours.',
    tags: ['domain', 'bd', 'btcl', 'registration']
  },
  {
    id: 'canned_dom_03',
    category: 'domain',
    title: 'Domain Transfer to WebzoneBD',
    shortLabel: '🔄 Domain Transfer',
    text: 'To transfer your domain to WebzoneBD, please request the EPP/Auth code from your current registrar and ensure domain lock is disabled. Transfer completes in 1-5 days with zero website downtime.',
    tags: ['domain', 'transfer', 'epp']
  },
  {
    id: 'canned_dom_04',
    category: 'domain',
    title: 'WebzoneBD Nameservers & DNS Records',
    shortLabel: '⚙️ Nameservers Setup',
    text: 'Our official WebzoneBD nameservers are:\n• Primary: ns1.webzonebd.com\n• Secondary: ns2.webzonebd.com\nDNS changes propagate worldwide within 15 to 30 minutes.',
    tags: ['domain', 'dns', 'nameserver']
  },
  {
    id: 'canned_dom_05',
    category: 'domain',
    title: 'Custom Domain Connection Guide',
    shortLabel: '🔗 Connect Custom Domain',
    text: 'You can connect your custom domain to your WebzoneBD e-commerce website or Next.js app in 5 minutes via Cloudflare or cPanel by adding an A Record pointing to our server IP.',
    tags: ['domain', 'custom', 'connect']
  },

  // --- HOSTING ---
  {
    id: 'canned_host_01',
    category: 'hosting',
    title: 'BDIX NVMe Superfast Cloud Hosting',
    shortLabel: '⚡ BDIX NVMe Hosting',
    text: 'Our BDIX NVMe Hosting features direct Bangladesh Internet Exchange routing, LiteSpeed Web Server, 1Gbps unmetered port, and 10x faster load speeds for Bangladeshi visitors.',
    tags: ['hosting', 'bdix', 'nvme', 'speed']
  },
  {
    id: 'canned_host_02',
    category: 'hosting',
    title: 'Saudi & GCC Cloud NVMe Hosting',
    shortLabel: '🇸🇦 Saudi Cloud NVMe',
    text: 'For Saudi Arabia and Middle East clients, our Riyadh/Jeddah Tier-3 cloud hosting offers sub-20ms latency, 99.9% uptime SLA, DDoS shielding, and local Mada/Visa billing support.',
    tags: ['hosting', 'saudi', 'gcc', 'cloud']
  },
  {
    id: 'canned_host_03',
    category: 'hosting',
    title: 'cPanel, Free SSL & Auto App Installers',
    shortLabel: '🔒 cPanel & Free SSL',
    text: 'All WebzoneBD hosting plans include genuine cPanel, automated Let\'s Encrypt SSL certificates, unlimited corporate emails, and 1-click installers for WordPress, Node.js, and Laravel.',
    tags: ['hosting', 'cpanel', 'ssl', 'wordpress']
  },
  {
    id: 'canned_host_04',
    category: 'hosting',
    title: 'Automated Daily Offsite Backups',
    shortLabel: '💾 Daily JetBackups',
    text: 'Your website files and MySQL databases are automatically backed up daily to offsite storage with 30-day snapshot points. You can restore single files or full DBs anytime from cPanel.',
    tags: ['hosting', 'backup', 'restore']
  },
  {
    id: 'canned_host_05',
    category: 'hosting',
    title: 'Instant Hosting Plan Upgrade',
    shortLabel: '📈 Upgrade Storage / RAM',
    text: 'Need more NVMe storage, RAM, or CPU cores for seasonal traffic spikes? We can upgrade your hosting plan in seconds with zero downtime and seamless billing adjustment.',
    tags: ['hosting', 'upgrade', 'storage', 'ram']
  },

  // --- SERVICES ---
  {
    id: 'canned_serv_01',
    category: 'services',
    title: 'Custom Website & E-Commerce Development',
    shortLabel: '💻 Custom E-Commerce Dev',
    text: 'We develop custom high-converting e-commerce web applications using Next.js, React, and Node/Laravel with bKash/Nagad/Stripe payment gateways, courier API integration, and POS sync.',
    tags: ['services', 'ecommerce', 'web', 'development']
  },
  {
    id: 'canned_serv_02',
    category: 'services',
    title: 'B2B Custom ERP, Inventory & POS Software',
    shortLabel: '📊 Custom ERP & POS',
    text: 'Our enterprise ERP software includes real-time multi-branch warehouse inventory, customer accounts ledger, HR/payroll, barcode POS billing, and real-time executive profit reports.',
    tags: ['services', 'erp', 'pos', 'software']
  },
  {
    id: 'canned_serv_03',
    category: 'services',
    title: 'Custom Full-Stack Web App / SaaS Architecture',
    shortLabel: '⚡ Custom SaaS / Web App',
    text: 'Looking for a custom SaaS product? We architect scalable web platforms with complete unencrypted source code ownership, REST/GraphQL APIs, and automated Cloud Run / Docker deployment.',
    tags: ['services', 'saas', 'fullstack', 'react']
  },
  {
    id: 'canned_serv_04',
    category: 'services',
    title: 'Speed Optimization & Google PageSpeed 90+',
    shortLabel: '🚀 90+ Speed Optimization',
    text: 'We optimize slow websites to achieve 90+ Google PageSpeed scores, sub-second load times, image CDN delivery, Redis query caching, and complete Core Web Vitals compliance.',
    tags: ['services', 'speed', 'optimization', 'seo']
  },
  {
    id: 'canned_serv_05',
    category: 'services',
    title: 'Monthly SLA Maintenance & Bug Fixes',
    shortLabel: '🛠️ SLA Maintenance & Fixes',
    text: 'Our technical engineering team offers monthly maintenance SLAs covering security audits, malware cleanup, automated 24/7 uptime monitoring, bug fixes, and regular framework upgrades.',
    tags: ['services', 'maintenance', 'sla', 'bugfix']
  },

  // --- MARKETPLACE & SCRIPTS ---
  {
    id: 'canned_mkt_01',
    category: 'marketplace',
    title: 'Instant Script Download & Commercial License',
    shortLabel: '📦 Instant Download & License',
    text: 'As soon as your checkout is completed, your complete digital script package (ZIP) and unique lifetime commercial license key are instantly available in your dashboard under "My Downloads".',
    tags: ['marketplace', 'scripts', 'download', 'license']
  },
  {
    id: 'canned_mkt_02',
    category: 'marketplace',
    title: '100% Clean Unencrypted Source Code Guarantee',
    shortLabel: '📂 100% Unencrypted Source',
    text: 'Every digital product on WebzoneBD includes 100% full, unencrypted source code (TypeScript, React, Node.js / PHP Laravel) with no obfuscation or domain locks, plus detailed setup docs.',
    tags: ['marketplace', 'sourcecode', 'clean']
  },
  {
    id: 'canned_mkt_03',
    category: 'marketplace',
    title: 'Complimentary Installation & Setup Service',
    shortLabel: '🚀 Free Script Installation',
    text: 'We provide complimentary installation and configuration support on your cPanel or VPS within 2-4 hours for all purchased marketplace scripts and ready templates.',
    tags: ['marketplace', 'installation', 'setup']
  },
  {
    id: 'canned_mkt_04',
    category: 'marketplace',
    title: 'Live Interactive Demo & Admin Panel Access',
    shortLabel: '🔍 Live Demo Credentials',
    text: 'You can test our live interactive demo including the customer storefront and backend admin panel. Let me share the direct demo URL and test login credentials with you right now.',
    tags: ['marketplace', 'demo', 'test']
  },
  {
    id: 'canned_mkt_05',
    category: 'marketplace',
    title: 'Custom Feature Additions to Marketplace Scripts',
    shortLabel: '✨ Custom Modifications',
    text: 'Need custom features, design alterations, or unique payment gateways added to a marketplace script? Our engineering team can implement modifications tailored to your project.',
    tags: ['marketplace', 'customization', 'features']
  },

  // --- BILLING & ORDER ---
  {
    id: 'canned_bill_01',
    category: 'billing',
    title: 'Accepted Payment Methods (BD & KSA)',
    shortLabel: '💳 Payment Methods',
    text: 'We accept bKash Merchant, Nagad, Rocket, Bank Transfer, Visa/Mastercard (via SSLCommerz), Stripe, and Saudi Mada / STC Pay. Instant automated invoice receipt upon payment.',
    tags: ['billing', 'payment', 'bkash', 'card']
  },
  {
    id: 'canned_bill_02',
    category: 'billing',
    title: 'Order ID & License Verification Request',
    shortLabel: '🧾 Verify Order ID',
    text: 'Could you please share your 6-digit Order ID (e.g., #WBZ-10492) or registered email address so we can review your invoice and license key immediately?',
    tags: ['billing', 'order', 'license']
  },

  // --- GREETINGS & RESOLUTION ---
  {
    id: 'canned_greet_01',
    category: 'greeting',
    title: 'Assalamu Alaikum Welcome Greeting',
    shortLabel: '👋 Welcome Greeting',
    text: 'Assalamu Alaikum! Welcome to WebzoneBD Support. I am your assigned support engineer. How may I assist you with your domain, hosting, software, or marketplace order today?',
    tags: ['greeting', 'welcome']
  },
  {
    id: 'canned_greet_02',
    category: 'greeting',
    title: 'Issue Resolved & Closing Notice',
    shortLabel: '✅ Issue Resolved / Close',
    text: 'Thank you for reaching out to WebzoneBD Support! Your issue has been marked resolved. If you need any further assistance, feel free to reply anytime. Have a wonderful day!',
    tags: ['greeting', 'closing', 'resolved']
  }
];

export const INITIAL_ADMIN_PRESENCE: AdminPresenceRecord[] = [
  {
    adminId: 'stf-01',
    adminName: 'Anisur Rahman (Support Lead)',
    role: 'admin',
    status: 'online',
    lastSeen: new Date().toISOString(),
    location: 'Dhaka NOC Center',
    device: 'Desktop Chrome'
  },
  {
    adminId: 'stf-02',
    adminName: 'Sayeeda Yeasmin (Senior Support)',
    role: 'staff',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 40).toISOString(),
    location: 'Riyadh Cloud Desk',
    device: 'MacBook Pro'
  }
];

// Channel for cross-tab instant messaging synchronization
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Graceful fallback
}

// Initial default sessions for demo/seed preview
export const INITIAL_CHAT_SESSIONS: LiveChatSession[] = [
  {
    id: 'chat_seed_101',
    visitorId: 'vis_tanvir_98',
    visitorName: 'Tanvir Ahmed',
    visitorEmail: 'tanvir.dev@gmail.com',
    visitorPhone: '+8801712345678',
    visitorLocation: 'Dhaka, Bangladesh',
    visitorPage: '/services',
    visitorDevice: 'Chrome on macOS',
    department: 'Sales & Custom Software',
    status: 'active',
    startedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    lastMessageText: "Does WebzoneBD provide custom multi-vendor e-commerce platform source code?",
    unreadVisitorCount: 0,
    unreadStaffCount: 1,
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Sayeeda Yeasmin',
    internalNotes: 'Client interested in enterprise marketplace script with bKash and Nagad automation.',
    isCustomer: true,
    customerUserId: 'usr_tanvir_01',
    userRole: 'customer'
  },
  {
    id: 'chat_seed_102',
    visitorId: 'vis_faisal_44',
    visitorName: 'Faisal Al-Otaibi',
    visitorEmail: 'faisal.otaibi@riyadh-tech.sa',
    visitorPhone: '+966570511931',
    visitorLocation: 'Riyadh, Saudi Arabia',
    visitorPage: '/hosting',
    visitorDevice: 'Safari on iPhone 15 Pro',
    department: 'Technical & Cloud Hosting',
    status: 'waiting',
    startedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lastMessageText: "Hello, we need NVMe high-bandwidth cloud VPS setup in Saudi Arabia with dedicated IP.",
    unreadVisitorCount: 0,
    unreadStaffCount: 2,
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Anisur Rahman',
    internalNotes: 'VIP Saudi prospect. Wants managed cPanel & root SSH server.',
    isCustomer: true,
    customerUserId: 'usr_faisal_02',
    userRole: 'customer'
  },
  {
    id: 'chat_seed_103',
    visitorId: 'vis_sarah_21',
    visitorName: 'Sarah Khan',
    visitorEmail: 'sarah.khan@bloomagency.co',
    visitorPhone: '+8801864000005',
    visitorLocation: 'Chittagong, Bangladesh',
    visitorPage: '/marketplace',
    visitorDevice: 'Firefox on Windows 11',
    department: 'Order Status & Scripts',
    status: 'resolved',
    startedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    lastMessageText: "Thank you! I successfully received my order zip file and license key.",
    unreadVisitorCount: 0,
    unreadStaffCount: 0,
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Sayeeda Yeasmin',
    internalNotes: 'Order #QB-817290 verified and delivered smoothly. 5-star feedback received.',
    isCustomer: false,
    userRole: 'visitor'
  }
];

export const INITIAL_MESSAGES: Record<string, LiveChatMessage[]> = {
  'chat_seed_101': [
    {
      id: 'msg_101_1',
      chatId: 'chat_seed_101',
      senderId: 'vis_tanvir_98',
      senderName: 'Tanvir Ahmed',
      senderRole: 'visitor',
      message: "Assalamu Alaikum, I am looking for a custom e-commerce web application with mobile app API.",
      timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
      read: true
    },
    {
      id: 'msg_101_2',
      chatId: 'chat_seed_101',
      senderId: 'bot',
      senderName: 'WebzoneBD Bot',
      senderRole: 'bot',
      message: "Welcome Tanvir Ahmed! A senior software engineer has been notified and will assist you immediately.",
      timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
      read: true
    },
    {
      id: 'msg_101_3',
      chatId: 'chat_seed_101',
      senderId: 'stf-02',
      senderName: 'Sayeeda Yeasmin (Support Staff)',
      senderRole: 'staff',
      message: "Hello Tanvir! Yes, WebzoneBD builds high-scale custom React, Next.js, and Node/Laravel solutions with complete source ownership.",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      read: true
    },
    {
      id: 'msg_101_4',
      chatId: 'chat_seed_101',
      senderId: 'vis_tanvir_98',
      senderName: 'Tanvir Ahmed',
      senderRole: 'visitor',
      message: "Does WebzoneBD provide custom multi-vendor e-commerce platform source code?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      read: false
    }
  ],
  'chat_seed_102': [
    {
      id: 'msg_102_1',
      chatId: 'chat_seed_102',
      senderId: 'vis_faisal_44',
      senderName: 'Faisal Al-Otaibi',
      senderRole: 'visitor',
      message: "Marhaban, what are your dedicated VPS server specs available in KSA?",
      timestamp: new Date(Date.now() - 1000 * 60 * 68).toISOString(),
      read: true
    },
    {
      id: 'msg_102_2',
      chatId: 'chat_seed_102',
      senderId: 'vis_faisal_44',
      senderName: 'Faisal Al-Otaibi',
      senderRole: 'visitor',
      message: "Hello, we need NVMe high-bandwidth cloud VPS setup in Saudi Arabia with dedicated IP.",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: false
    }
  ],
  'chat_seed_103': [
    {
      id: 'msg_103_1',
      chatId: 'chat_seed_103',
      senderId: 'vis_sarah_21',
      senderName: 'Sarah Khan',
      senderRole: 'visitor',
      message: "Hello, I just ordered the Agency Portfolio script and wanted to check license activation.",
      timestamp: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
      read: true
    },
    {
      id: 'msg_103_2',
      chatId: 'chat_seed_103',
      senderId: 'stf-02',
      senderName: 'Sayeeda Yeasmin (Support Staff)',
      senderRole: 'staff',
      message: "Hi Sarah! Your license key and installation instructions have been dispatched to your email.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true
    },
    {
      id: 'msg_103_3',
      chatId: 'chat_seed_103',
      senderId: 'vis_sarah_21',
      senderName: 'Sarah Khan',
      senderRole: 'visitor',
      message: "Thank you! I successfully received my order zip file and license key.",
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      read: true
    }
  ]
};

// Clean, soft synthesized audio alert using Web Audio API
export function playChatNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Harmonic bell tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5
    gain2.gain.setValueAtTime(0.12, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch {
    // Gracefully handle any browser audio policy limitation
  }
}

// Helper: load Tawk.to script into document
export function loadTawkScript(propertyId: string, widgetId: string = 'default') {
  if (typeof window === 'undefined' || !propertyId) return;
  
  // Clean clean Property ID if user pasted full URL
  let cleanPropId = propertyId.trim();
  let cleanWidget = widgetId ? widgetId.trim() : 'default';

  if (cleanPropId.includes('tawk.to/')) {
    const parts = cleanPropId.split('tawk.to/')[1]?.split('/');
    if (parts && parts[0]) {
      cleanPropId = parts[0];
      if (parts[1]) cleanWidget = parts[1];
    }
  }

  const existingScript = document.getElementById('tawk-to-embed-script');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = 'tawk-to-embed-script';
  script.async = true;
  script.src = `https://embed.tawk.to/${cleanPropId}/${cleanWidget}`;
  script.charset = 'UTF-8';
  script.setAttribute('crossorigin', '*');
  script.onerror = () => {
    console.info('Tawk script standing by in offline/resilient mode.');
  };
  document.head.appendChild(script);
}

// Live Chat Service API
export const liveChatService = {
  getSettings(): LiveChatSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...DEFAULT_LIVE_CHAT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_LIVE_CHAT_SETTINGS;
  },

  async saveSettings(settings: LiveChatSettings): Promise<void> {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      // Save to Firestore if available
      try {
        await setDoc(doc(db, 'live_chat_settings', 'global_config'), settings, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'live_chat_settings/global_config');
      }
      broadcastChannel?.postMessage({ type: 'settings_updated', settings });
    } catch {
      // Ignore
    }
  },

  getStoredSessions(): LiveChatSession[] {
    try {
      const saved = localStorage.getItem(SESSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Seed initial sessions
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(INITIAL_CHAT_SESSIONS));
    // Also seed initial messages
    Object.entries(INITIAL_MESSAGES).forEach(([chatId, msgs]) => {
      localStorage.setItem(`${MESSAGES_PREFIX}${chatId}`, JSON.stringify(msgs));
    });
    return INITIAL_CHAT_SESSIONS;
  },

  saveSessions(sessions: LiveChatSession[]) {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      broadcastChannel?.postMessage({ type: 'sessions_updated', sessions });
    } catch {
      // Fallback
    }
  },

  getStoredMessages(chatId: string): LiveChatMessage[] {
    try {
      const saved = localStorage.getItem(`${MESSAGES_PREFIX}${chatId}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_MESSAGES[chatId] || [];
  },

  saveStoredMessages(chatId: string, messages: LiveChatMessage[]) {
    try {
      localStorage.setItem(`${MESSAGES_PREFIX}${chatId}`, JSON.stringify(messages));
      broadcastChannel?.postMessage({ type: 'messages_updated', chatId, messages });
    } catch {
      // Fallback
    }
  },

  // Subscribe to all chat sessions (Real-time listener with Firestore & local fallback)
  subscribeToSessions(callback: (sessions: LiveChatSession[]) => void): () => void {
    // Initial emit
    callback(this.getStoredSessions());

    // Listen to Firestore
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const q = query(collection(db, 'live_chats'), orderBy('lastMessageAt', 'desc'));
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const sessions = snapshot.docs.map(d => d.data() as LiveChatSession);
          this.saveSessions(sessions);
          callback(sessions);
        }
      }, () => {
        // Fallback silently to local storage
      });
    } catch {
      // Fallback
    }

    // BroadcastChannel listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'sessions_updated') {
        callback(event.data.sessions);
      }
    };
    broadcastChannel?.addEventListener('message', handleBroadcast);

    // Storage event for other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SESSIONS_KEY && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          // Fallback
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorage);
    };
  },

  // Subscribe to messages of a specific session
  subscribeToMessages(chatId: string, callback: (messages: LiveChatMessage[]) => void): () => void {
    callback(this.getStoredMessages(chatId));

    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const msgsCol = collection(db, 'live_chats', chatId, 'messages');
      const q = query(msgsCol, orderBy('timestamp', 'asc'));
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const messages = snapshot.docs.map(d => d.data() as LiveChatMessage);
          this.saveStoredMessages(chatId, messages);
          callback(messages);
        }
      }, () => {
        // Fallback silently to local storage
      });
    } catch {
      // Fallback
    }

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'messages_updated' && event.data?.chatId === chatId) {
        callback(event.data.messages);
      }
    };
    broadcastChannel?.addEventListener('message', handleBroadcast);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${MESSAGES_PREFIX}${chatId}` && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          // Fallback
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorage);
    };
  },

  // Find existing session for a logged-in customer or visitor
  findSessionByUser(userId?: string, email?: string): LiveChatSession | undefined {
    const sessions = this.getStoredSessions();
    if (userId) {
      const match = sessions.find(s => s.customerUserId === userId || s.visitorId === userId);
      if (match) return match;
    }
    if (email) {
      const match = sessions.find(s => s.visitorEmail && s.visitorEmail.toLowerCase() === email.toLowerCase());
      if (match) return match;
    }
    return undefined;
  },

  // Create new visitor or customer session
  async createVisitorSession(params: {
    visitorName: string;
    visitorEmail?: string;
    visitorPhone?: string;
    department?: string;
    initialMessage?: string;
    visitorLocation?: string;
    visitorPage?: string;
    visitorDevice?: string;
    isCustomer?: boolean;
    customerUserId?: string;
    userRole?: 'customer' | 'visitor';
  }): Promise<{ session: LiveChatSession; initialMessageObj?: LiveChatMessage }> {
    const id = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const visitorId = params.customerUserId || `vis_${Math.random().toString(36).slice(2, 9)}`;

    const session: LiveChatSession = {
      id,
      visitorId,
      visitorName: params.visitorName || (params.isCustomer ? 'Verified Customer' : 'Guest Visitor'),
      visitorEmail: params.visitorEmail || '',
      visitorPhone: params.visitorPhone || '',
      visitorLocation: params.visitorLocation || (typeof navigator !== 'undefined' && navigator.language?.includes('ar') ? 'Riyadh, Saudi Arabia' : 'Dhaka, Bangladesh'),
      visitorPage: params.visitorPage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      visitorDevice: params.visitorDevice || (typeof navigator !== 'undefined' ? `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} Browser` : 'Web Browser'),
      department: params.department || 'General Support',
      status: 'active',
      startedAt: now,
      lastMessageAt: now,
      lastMessageText: params.initialMessage || 'Session initiated',
      unreadVisitorCount: 0,
      unreadStaffCount: 1,
      assignedStaffId: 'stf-02',
      assignedStaffName: 'Sayeeda Yeasmin',
      isCustomer: Boolean(params.isCustomer),
      customerUserId: params.customerUserId || '',
      userRole: params.userRole || (params.isCustomer ? 'customer' : 'visitor')
    };

    const messages: LiveChatMessage[] = [];

    // Auto welcome bot greeting
    const welcomeText = this.getSettings().welcomeMessageEn;
    const botMsg: LiveChatMessage = {
      id: `msg_bot_${Date.now()}`,
      chatId: id,
      senderId: 'bot',
      senderName: 'WebzoneBD Support Bot',
      senderRole: 'bot',
      message: welcomeText,
      timestamp: now,
      read: true
    };
    messages.push(botMsg);

    let initialMessageObj: LiveChatMessage | undefined;
    if (params.initialMessage) {
      initialMessageObj = {
        id: `msg_${Date.now()}_1`,
        chatId: id,
        senderId: visitorId,
        senderName: session.visitorName,
        senderRole: 'visitor',
        message: params.initialMessage,
        timestamp: new Date(Date.now() + 50).toISOString(),
        read: false
      };
      messages.push(initialMessageObj);
    }

    // Save locally
    const allSessions = [session, ...this.getStoredSessions().filter(s => s.id !== id)];
    this.saveSessions(allSessions);
    this.saveStoredMessages(id, messages);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'live_chats', id), session);
      for (const m of messages) {
        await setDoc(doc(db, 'live_chats', id, 'messages', m.id), m);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `live_chats/${id}`);
    }

    // Chime if sound enabled
    if (this.getSettings().soundEnabled) {
      playChatNotificationSound();
    }

    return { session, initialMessageObj };
  },

  // Send visitor or customer message to Admin
  async sendVisitorMessage(
    chatId: string, 
    text: string, 
    senderName?: string, 
    senderId?: string,
    meta?: { isCustomer?: boolean; customerUserId?: string }
  ): Promise<LiveChatMessage> {
    const now = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const msg: LiveChatMessage = {
      id: msgId,
      chatId,
      senderId: senderId || 'visitor_user',
      senderName: senderName || 'Client',
      senderRole: 'visitor',
      message: text.trim(),
      timestamp: now,
      read: false
    };

    // Update local messages
    const currentMsgs = this.getStoredMessages(chatId);
    const updatedMsgs = [...currentMsgs, msg];
    this.saveStoredMessages(chatId, updatedMsgs);

    // Update local session
    const currentSessions = this.getStoredSessions();
    const updatedSessions = currentSessions.map(s => {
      if (s.id === chatId) {
        return {
          ...s,
          lastMessageAt: now,
          lastMessageText: text.trim(),
          status: s.status === 'resolved' ? 'active' : s.status,
          unreadStaffCount: (s.unreadStaffCount || 0) + 1,
          unreadVisitorCount: 0,
          isCustomer: meta?.isCustomer !== undefined ? meta.isCustomer : s.isCustomer,
          customerUserId: meta?.customerUserId || s.customerUserId,
          visitorName: senderName || s.visitorName
        } as LiveChatSession;
      }
      return s;
    });
    this.saveSessions(updatedSessions);

    // Sync Firestore
    try {
      await setDoc(doc(db, 'live_chats', chatId, 'messages', msgId), msg);
      await setDoc(doc(db, 'live_chats', chatId), {
        lastMessageAt: now,
        lastMessageText: text.trim(),
        status: 'active',
        unreadStaffCount: (updatedSessions.find(s => s.id === chatId)?.unreadStaffCount || 1)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `live_chats/${chatId}/messages/${msgId}`);
    }

    if (this.getSettings().soundEnabled) {
      playChatNotificationSound();
    }

    return msg;
  },

  // Send staff reply message from admin panel to customer/visitor
  async sendStaffMessage(chatId: string, text: string, staffName: string = 'Sayeeda Yeasmin (Support Staff)', staffId: string = 'stf-02'): Promise<LiveChatMessage> {
    const now = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const msg: LiveChatMessage = {
      id: msgId,
      chatId,
      senderId: staffId,
      senderName: staffName,
      senderRole: 'staff',
      message: text.trim(),
      timestamp: now,
      read: true
    };

    // Update local messages
    const currentMsgs = this.getStoredMessages(chatId);
    const updatedMsgs = [...currentMsgs, msg];
    this.saveStoredMessages(chatId, updatedMsgs);

    // Update session
    const currentSessions = this.getStoredSessions();
    const updatedSessions = currentSessions.map(s => {
      if (s.id === chatId) {
        return {
          ...s,
          lastMessageAt: now,
          lastMessageText: text.trim(),
          unreadStaffCount: 0,
          unreadVisitorCount: (s.unreadVisitorCount || 0) + 1,
          assignedStaffId: staffId,
          assignedStaffName: staffName
        } as LiveChatSession;
      }
      return s;
    });
    this.saveSessions(updatedSessions);

    // Sync Firestore
    try {
      await setDoc(doc(db, 'live_chats', chatId, 'messages', msgId), msg);
      await setDoc(doc(db, 'live_chats', chatId), {
        lastMessageAt: now,
        lastMessageText: text.trim(),
        unreadStaffCount: 0,
        unreadVisitorCount: (updatedSessions.find(s => s.id === chatId)?.unreadVisitorCount || 1),
        assignedStaffId: staffId,
        assignedStaffName: staffName
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `live_chats/${chatId}/messages/${msgId}`);
    }

    if (this.getSettings().soundEnabled) {
      playChatNotificationSound();
    }

    return msg;
  },

  // Update session status (e.g. resolve, archive, activate)
  async updateSessionStatus(chatId: string, status: 'active' | 'waiting' | 'resolved' | 'archived'): Promise<void> {
    const currentSessions = this.getStoredSessions();
    const updatedSessions = currentSessions.map(s => s.id === chatId ? { ...s, status } : s);
    this.saveSessions(updatedSessions);

    try {
      await setDoc(doc(db, 'live_chats', chatId), { status }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `live_chats/${chatId}`);
    }
  },

  async resolveSession(chatId: string): Promise<void> {
    return this.updateSessionStatus(chatId, 'resolved');
  },

  // Update internal staff notes
  async updateSessionNotes(chatId: string, notes: string): Promise<void> {
    const currentSessions = this.getStoredSessions();
    const updatedSessions = currentSessions.map(s => s.id === chatId ? { ...s, internalNotes: notes } : s);
    this.saveSessions(updatedSessions);

    try {
      await setDoc(doc(db, 'live_chats', chatId), { internalNotes: notes }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `live_chats/${chatId}`);
    }
  },

  // Delete chat session
  async deleteSession(chatId: string): Promise<void> {
    const currentSessions = this.getStoredSessions();
    const updatedSessions = currentSessions.filter(s => s.id !== chatId);
    this.saveSessions(updatedSessions);
    try {
      localStorage.removeItem(`${MESSAGES_PREFIX}${chatId}`);
    } catch {
      // Fallback
    }

    try {
      await deleteDoc(doc(db, 'live_chats', chatId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `live_chats/${chatId}`);
    }
  },

  // Simulate incoming test visitor chat from admin panel
  async simulateIncomingVisitorChat(): Promise<LiveChatSession> {
    const sampleNames = ['Habibur Rahman', 'Ziyad Al-Farhan', 'Nafisa Chowdhury', 'Majed Al-Ghamdi', 'Kamrul Hasan'];
    const sampleTopics = [
      'Inquiring about Custom B2B ERP Software',
      'Need help with Domain DNS and Saudi hosting activation',
      'Requesting a custom quote for eCommerce mobile apps',
      'Asking about WebzoneBD digital marketing package',
      'Question regarding payment via bKash / Saudi Bank Transfer'
    ];
    const sampleMessages = [
      "Assalamu Alaikum! We are looking to build a high-performance web portal for our business. Could you share your portfolio and pricing options?",
      "Marhaban! I saw your digital store products and want to know if you provide custom deployment support.",
      "Hello team, how long does it take to activate a .com domain with NVMe hosting?",
      "Can we integrate custom payment gateways into the WebzoneBD multi-vendor script?"
    ];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomTopic = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    const res = await this.createVisitorSession({
      visitorName: randomName,
      visitorEmail: `${randomName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      visitorPhone: '+8801864000005',
      department: randomTopic,
      initialMessage: randomMsg,
      visitorLocation: Math.random() > 0.5 ? 'Riyadh, Saudi Arabia' : 'Dhaka, Bangladesh',
      visitorPage: '/services',
      visitorDevice: 'Chrome / macOS'
    });

    return res.session;
  },

  // --- REAL-TIME ADMIN PRESENCE TRACKING ---

  getStoredAdminPresence(): AdminPresenceRecord[] {
    try {
      const saved = localStorage.getItem(PRESENCE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Seed initial presence
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(INITIAL_ADMIN_PRESENCE));
    return INITIAL_ADMIN_PRESENCE;
  },

  async saveStoredAdminPresence(records: AdminPresenceRecord[]): Promise<void> {
    try {
      localStorage.setItem(PRESENCE_KEY, JSON.stringify(records));
      broadcastChannel?.postMessage({ type: 'presence_updated', records });
      
      try {
        await setDoc(doc(db, 'live_chat_settings', 'admin_presence'), {
          records,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'live_chat_settings/admin_presence');
      }
    } catch {
      // Ignore
    }
  },

  calculateAdminOverallStatus(records: AdminPresenceRecord[]): AdminOverallStatus {
    const now = Date.now();
    const ONLINE_WINDOW_MS = 2.5 * 60 * 1000; // Active within 2.5 mins
    const AWAY_WINDOW_MS = 8 * 60 * 1000;     // Away/idle within 8 mins

    let activeCount = 0;
    let awayCount = 0;
    const onlineAdmins: AdminPresenceRecord[] = [];

    records.forEach(rec => {
      if (rec.status === 'offline') return;

      const age = now - new Date(rec.lastSeen).getTime();

      if (rec.status === 'online') {
        if (age <= ONLINE_WINDOW_MS) {
          activeCount++;
          onlineAdmins.push(rec);
        } else if (age <= AWAY_WINDOW_MS) {
          awayCount++;
        }
      } else if (rec.status === 'away') {
        if (age <= AWAY_WINDOW_MS) {
          awayCount++;
        }
      }
    });

    let overallStatus: AdminPresenceStatus = 'offline';
    if (activeCount > 0) {
      overallStatus = 'online';
    } else if (awayCount > 0) {
      overallStatus = 'away';
    } else {
      overallStatus = 'offline';
    }

    return {
      status: overallStatus,
      activeCount,
      awayCount,
      totalAdmins: records.length,
      onlineAdmins,
      lastChecked: new Date().toISOString()
    };
  },

  getAdminOverallStatus(): AdminOverallStatus {
    const records = this.getStoredAdminPresence();
    return this.calculateAdminOverallStatus(records);
  },

  async updateAdminHeartbeat(
    adminId: string, 
    adminName: string, 
    role: string = 'admin', 
    status: AdminPresenceStatus = 'online',
    meta?: { location?: string; device?: string }
  ): Promise<void> {
    const records = this.getStoredAdminPresence();
    const nowIso = new Date().toISOString();
    const index = records.findIndex(r => r.adminId === adminId);

    if (index >= 0) {
      records[index] = {
        ...records[index],
        adminName: adminName || records[index].adminName,
        role: role || records[index].role,
        status,
        lastSeen: nowIso,
        location: meta?.location || records[index].location,
        device: meta?.device || records[index].device
      };
    } else {
      records.push({
        adminId,
        adminName,
        role,
        status,
        lastSeen: nowIso,
        location: meta?.location || 'Operations Desk',
        device: meta?.device || (typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop') : 'Web')
      });
    }

    await this.saveStoredAdminPresence(records);
  },

  async setAdminPresenceStatus(adminId: string, status: AdminPresenceStatus): Promise<void> {
    const records = this.getStoredAdminPresence();
    const nowIso = new Date().toISOString();
    const index = records.findIndex(r => r.adminId === adminId);

    if (index >= 0) {
      records[index].status = status;
      records[index].lastSeen = nowIso;
      await this.saveStoredAdminPresence(records);
    }
  },

  async setAllAdminsStatus(status: AdminPresenceStatus): Promise<void> {
    const records = this.getStoredAdminPresence();
    const nowIso = new Date().toISOString();
    const updated = records.map(r => ({
      ...r,
      status,
      lastSeen: nowIso
    }));
    await this.saveStoredAdminPresence(updated);
  },

  subscribeToAdminPresence(callback: (overall: AdminOverallStatus) => void): () => void {
    // Initial emit
    callback(this.getAdminOverallStatus());

    // Timer to periodically re-evaluate age timeouts (Online -> Away -> Offline)
    const intervalId = setInterval(() => {
      callback(this.getAdminOverallStatus());
    }, 5000);

    // Listen to Firestore
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const presenceDocRef = doc(db, 'live_chat_settings', 'admin_presence');
      unsubscribeFirestore = onSnapshot(presenceDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.records)) {
            try {
              localStorage.setItem(PRESENCE_KEY, JSON.stringify(data.records));
            } catch {
              // Ignore
            }
            callback(this.calculateAdminOverallStatus(data.records));
          }
        }
      }, () => {
        // Fallback silently
      });
    } catch {
      // Fallback
    }

    // BroadcastChannel listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'presence_updated' && Array.isArray(event.data.records)) {
        callback(this.calculateAdminOverallStatus(event.data.records));
      }
    };
    broadcastChannel?.addEventListener('message', handleBroadcast);

    // Storage listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PRESENCE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          callback(this.calculateAdminOverallStatus(parsed));
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(intervalId);
      if (unsubscribeFirestore) unsubscribeFirestore();
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorage);
    };
  },

  startAdminHeartbeat(adminId: string, adminName: string, role: string = 'admin'): () => void {
    // Register initial online heartbeat
    this.updateAdminHeartbeat(adminId, adminName, role, 'online');

    // Heartbeat every 20 seconds
    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.updateAdminHeartbeat(adminId, adminName, role, 'online');
      }
    }, 20000);

    // Visibility change handler (away detection)
    let idleTimeout: any = null;
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        // Set to away if hidden for over 60 seconds
        idleTimeout = setTimeout(() => {
          this.setAdminPresenceStatus(adminId, 'away');
        }, 60000);
      } else {
        if (idleTimeout) clearTimeout(idleTimeout);
        this.updateAdminHeartbeat(adminId, adminName, role, 'online');
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      clearInterval(intervalId);
      if (idleTimeout) clearTimeout(idleTimeout);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }
};

