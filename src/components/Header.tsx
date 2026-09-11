import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Globe, Sun, Moon, ShoppingBag, User, Settings, 
  Menu, X, Trash2, Tag, Percent, ArrowRight, ShieldCheck,
  Smartphone, UserCheck, Key, LogOut, ArrowRightLeft,
  ChevronDown, ChevronUp, ChevronRight, Mail, Phone,
  Facebook, Linkedin, Youtube, Search, Code, Server, Sparkles, Layers, Cpu,
  ExternalLink, HelpCircle, Briefcase, Settings2, Laptop, Database, Globe2,
  BookOpen, Heart, Bell, UserPlus, LogIn, Coins,
  Star, Bot, MessageSquare, Flame, CheckCircle, Users, Wifi, Copy, Check, Upload,
  Eye, EyeOff, Camera, QrCode, ArrowUp, Download, Store, Zap, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, CartItem, Coupon, UserSession, Currency, Product } from '../types';
import { sampleCoupons, sampleProducts } from '../data';
import { catalogServicesData, fixedPackagesData } from './ServicesData';
import { initialLocalBlogs } from './BlogData';
import { sendOrderToWhatsApp, constructWhatsAppOrderSummaryMessage } from '../utils/whatsapp';
import { MegaMenuDesktop } from './MegaMenuDesktop';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent) => void;
  cart: CartItem[];
  removeFromCart: (index: number) => void;
  applyCouponToCart: (couponCode: string) => string | null;
  removeCouponFromCart?: () => void;
  resetCart: () => void;
  addSimulatedOrder: (method: string, guestInfo?: any) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  userEmail: string;
  user: UserSession | null;
  onLogout: () => void;
  onLoginClick: (view?: 'login' | 'register', role?: 'customer' | 'affiliate') => void;
  onLoginSuccess?: (user: UserSession) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  setSearchTerm?: (val: string) => void;
  wishlist: string[];
  toggleWishlist?: (productId: string) => void;
  addToCart?: (product: Product) => void;
  currencySettings?: any;
  setCurrencySettings?: (settings: any) => void;
  triggerToast: (msg: string) => void;
  cartOpen?: boolean;
  setCartOpen?: (open: boolean) => void;
  currencyRates?: any;
  verificationSettings?: any;
  bdMethods?: any;
  saMethods?: any;
  intlMethods?: any;
  customMethods?: any[];
}

interface AutoCheckoutQrGeneratorProps {
  gateway: string;
  orderTotalFormatted: string;
  orderTotalNumber: number;
  currency: Currency;
  language: Language;
  triggerToast: (msg: string) => void;
  merchantNumber?: string;
  accountName?: string;
  accountNo?: string;
  bankBranch?: string;
  routingNo?: string;
  swiftCode?: string;
  instructions?: string;
  defaultColorHex?: string;
}

function AutoCheckoutQrGenerator({
  gateway,
  orderTotalFormatted,
  orderTotalNumber,
  currency,
  language,
  triggerToast,
  merchantNumber,
  accountName,
  accountNo,
  bankBranch,
  routingNo,
  swiftCode,
  instructions,
  defaultColorHex
}: AutoCheckoutQrGeneratorProps) {
  const [payloadType, setPayloadType] = useState<'pay_amount' | 'invoice' | 'tel_direct'>('pay_amount');
  const [qrTheme, setQrTheme] = useState<'brand' | 'royal' | 'slate'>('brand');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const brandColorHex = useMemo(() => {
    if (defaultColorHex) return defaultColorHex;
    if (gateway.includes('bKash')) return 'd1245e';
    if (gateway.includes('Nagad')) return 'f15a22';
    if (gateway.includes('Rocket')) return '8c2aeb';
    if (gateway.includes('Cellfin')) return '0081d6';
    if (gateway.includes('Islami')) return '059669';
    if (gateway.includes('STC')) return '7c3aed';
    if (gateway.includes('Alraji') || gateway.includes('Al Rajhi')) return '1d4ed8';
    if (gateway.includes('USD')) return '059669';
    return '7c3aed';
  }, [gateway, defaultColorHex]);

  const activeColorHex = 
    qrTheme === 'royal' ? '7c3aed' :
    qrTheme === 'slate' ? '0f172a' : brandColorHex;

  const targetIdentifier = merchantNumber || accountNo || '01864000005';

  const qrPayload = useMemo(() => {
    if (payloadType === 'tel_direct') {
      return targetIdentifier.replace(/\s/g, '');
    }
    if (payloadType === 'invoice') {
      return `WebzoneBD Payment Invoice\nGateway: ${gateway}\nAmount Due: ${orderTotalFormatted}\nRecipient: ${accountName || 'Webzone BD Merchant'}\nAccount/Wallet: ${targetIdentifier}\nStatus: Pending Payment`;
    }
    return `Pay ${orderTotalFormatted} via ${gateway} to ${targetIdentifier} [Ref: WebzoneBD Order Total ${orderTotalFormatted}]`;
  }, [payloadType, gateway, orderTotalFormatted, targetIdentifier, accountName]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${activeColorHex}&data=${encodeURIComponent(qrPayload)}`;

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${gateway.replace(/\s+/g, '_')}_Order_${orderTotalFormatted.replace(/[^a-zA-Z0-9]/g, '')}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      triggerToast(language === 'bn' ? "পেমেন্ট কিউআর কোড ডাউনলোড হয়েছে!" : "Payment QR Code saved to device! 📲");
    } catch (err) {
      window.open(qrImageUrl, '_blank');
      triggerToast(language === 'bn' ? "নতুন ট্যাবে QR কোড দেখানো হয়েছে!" : "QR Code opened in a new tab!");
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
    triggerToast(language === 'bn' ? "পেমেন্ট ডেটা কপি করা হয়েছে!" : "Payment details & total copied!");
  };

  const handleAppLaunch = () => {
    if (gateway.includes('bKash')) {
      window.open('bkash://', '_blank');
      triggerToast(language === 'bn' ? "বিকাশ অ্যাপ ওপেন করা হচ্ছে বা ডায়াল করুন *247#" : "Opening bKash App or Dial *247#");
    } else if (gateway.includes('Nagad')) {
      window.open('nagad://', '_blank');
      triggerToast(language === 'bn' ? "নগদ অ্যাপ ওপেন করা হচ্ছে বা ডায়াল করুন *167#" : "Opening Nagad App or Dial *167#");
    } else if (gateway.includes('Cellfin')) {
      window.open('cellfin://', '_blank');
      triggerToast(language === 'bn' ? "সেলফিন অ্যাপ ওপেন করা হচ্ছে" : "Opening Cellfin App");
    } else if (gateway.includes('STC')) {
      window.open('stcpay://', '_blank');
      triggerToast("Opening STC Pay App");
    } else {
      triggerToast(language === 'bn' ? "কিউআর কোড স্ক্যান করে পেমেন্ট সম্পূর্ণ করুন" : "Scan QR code to process payment");
    }
  };

  return (
    <div className="w-full my-3 p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#080d19]/90 shadow-sm transition-all duration-300 font-sans">
      {/* Top Banner with Auto-Generated Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30">
            <QrCode className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-neutral-900 dark:text-white block leading-tight">
              {language === 'bn' ? 'অটোমেটিক কিউআর কোড জেনারেটর' : 'Automatic Payment QR Generator'}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 block">
              {gateway} • {language === 'bn' ? 'তাৎক্ষণিক মোবাইল স্ক্যান' : 'Instant Mobile Scanning'}
            </span>
          </div>
        </div>

        {/* Dynamic Total Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-black font-mono shadow-xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{language === 'bn' ? `সর্বমোট: ${orderTotalFormatted}` : `Order Total: ${orderTotalFormatted}`}</span>
        </div>
      </div>

      {/* Interactive Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {/* Payload Selector */}
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-black mb-1">
            {language === 'bn' ? 'পেমেন্ট এনকোডিং টাইপ' : 'Encoded QR Data'}
          </span>
          <div className="flex gap-1 p-0.5 bg-neutral-100 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800 w-full">
            <button
              type="button"
              onClick={() => setPayloadType('pay_amount')}
              className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                payloadType === 'pay_amount'
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-cyan-400 shadow-xs border border-violet-500/30'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {language === 'bn' ? 'টাকা সমেত পে' : 'Amount Payload'}
            </button>
            <button
              type="button"
              onClick={() => setPayloadType('invoice')}
              className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                payloadType === 'invoice'
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-cyan-400 shadow-xs border border-violet-500/30'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {language === 'bn' ? 'ইনভয়েস' : 'Invoice'}
            </button>
            <button
              type="button"
              onClick={() => setPayloadType('tel_direct')}
              className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                payloadType === 'tel_direct'
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-cyan-400 shadow-xs border border-violet-500/30'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {language === 'bn' ? 'নাম্বার' : 'Number'}
            </button>
          </div>
        </div>

        {/* QR Color Theme Selector */}
        <div className="flex flex-col items-center sm:items-end">
          <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-black mb-1">
            {language === 'bn' ? 'কিউআর থিম' : 'QR Style Theme'}
          </span>
          <div className="flex gap-1 p-0.5 bg-neutral-100 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setQrTheme('brand')}
              className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                qrTheme === 'brand'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-indigo-500/30'
                  : 'text-neutral-500'
              }`}
            >
              {language === 'bn' ? 'ব্র্যান্ড' : 'Brand'}
            </button>
            <button
              type="button"
              onClick={() => setQrTheme('royal')}
              className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                qrTheme === 'royal'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs border border-purple-500/30'
                  : 'text-neutral-500'
              }`}
            >
              Royal
            </button>
            <button
              type="button"
              onClick={() => setQrTheme('slate')}
              className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all cursor-pointer ${
                qrTheme === 'slate'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-500/30'
                  : 'text-neutral-500'
              }`}
            >
              Slate
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Center Showcase */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative group p-3 bg-white dark:bg-[#0c1222] rounded-2xl border border-neutral-200 dark:border-slate-800 shadow-md transition-all duration-300 hover:shadow-lg max-w-[180px]">
          {/* Subtle Glow Ring */}
          <div 
            className="absolute -inset-1 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm pointer-events-none"
            style={{ backgroundColor: `#${activeColorHex}` }}
          />
          
          <div className="relative w-[150px] h-[150px] bg-neutral-50 dark:bg-[#080c18] rounded-xl p-2 border border-neutral-150 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            <img 
              src={qrImageUrl} 
              alt={`${gateway} Payment QR Code`}
              className="w-full h-full object-contain rounded transition-transform duration-300 group-hover:scale-105 pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="text-[8.5px] font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-tight uppercase">
              {orderTotalFormatted} Auto-Encoded
            </span>
          </div>
        </div>

        {/* Action Toolbar underneath QR code */}
        <div className="flex items-center gap-2 mt-3 w-full max-w-xs">
          {/* Download Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadQr}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-neutral-100 dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 text-neutral-800 dark:text-white text-[10px] font-black hover:border-violet-500 transition-all cursor-pointer shadow-2xs"
            title="Download QR Image"
          >
            <Download className="w-3.5 h-3.5 text-violet-500" />
            <span>{language === 'bn' ? 'ডাউনলোড' : 'Download QR'}</span>
          </motion.button>

          {/* Copy Payload Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyPayload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-neutral-100 dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 text-neutral-800 dark:text-white text-[10px] font-black hover:border-violet-500 transition-all cursor-pointer shadow-2xs"
            title="Copy QR Payload"
          >
            {copiedPayload ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">{language === 'bn' ? 'কপিড!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-500" />
                <span>{language === 'bn' ? 'কপি পে-লোড' : 'Copy Payload'}</span>
              </>
            )}
          </motion.button>

          {/* Mobile App Launch button if MFS / STC Pay */}
          {(gateway.includes('bKash') || gateway.includes('Nagad') || gateway.includes('Cellfin') || gateway.includes('STC')) && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAppLaunch}
              className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500 hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Open Mobile Payment App"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        {/* Concise Scanning Guide */}
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed text-center max-w-sm">
          {language === 'bn' 
            ? `আপনার মোবাইল ক্যামেরা অথবা ${gateway} অ্যাপ দিয়ে কিউআর কোড স্ক্যান করুন। মোট মূল্য ${orderTotalFormatted} স্বয়ংক্রিয়ভাবে সংযুক্ত করা হয়েছে।`
            : `Scan this QR code with your mobile camera or ${gateway} app. The ${orderTotalFormatted} total is auto-encoded.`}
        </p>
      </div>
    </div>
  );
}

export default function Header({
  language,
  setLanguage,
  theme,
  setTheme,
  cart,
  removeFromCart,
  applyCouponToCart,
  removeCouponFromCart,
  resetCart,
  addSimulatedOrder,
  currentPage,
  setCurrentPage,
  isAdmin,
  setIsAdmin,
  userEmail,
  user,
  onLogout,
  onLoginClick,
  onLoginSuccess,
  currency,
  setCurrency,
  setSearchTerm,
  wishlist = [],
  toggleWishlist,
  addToCart,
  currencySettings,
  setCurrencySettings,
  triggerToast,
  cartOpen: propCartOpen,
  setCartOpen: propSetCartOpen,
  currencyRates,
  verificationSettings,
  bdMethods,
  saMethods,
  intlMethods,
  customMethods
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCartOpen, setLocalCartOpen] = useState(false);
  const cartOpen = propCartOpen !== undefined ? propCartOpen : localCartOpen;
  const setCartOpen = propSetCartOpen !== undefined ? propSetCartOpen : setLocalCartOpen;

  // Fallbacks for payment configurations
  const baseBdMethods = bdMethods || {
    bkash: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'bkash_mid_9901_key', instructions: 'Send Money or Personal transfer directly to our bKash personal wallet.', qrCode: '' },
    nagad: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'nagad_api_secure_token', instructions: 'Send Money directly to our secure Nagad Personal Wallet.', qrCode: '' },
    rocket: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: '', instructions: 'Direct Mobile Cash-in or Send Money via Rocket wallet.', qrCode: '' },
    cellfin: { enabled: true, number: '0186400 0005', instructions: 'Initiate prompt cellfin transfer directly to our wallet.', qrCode: '' },
    islamiBank: { enabled: true, bankName: 'Islami Bank Bangladesh PLC', accountName: 'MD IMRAN HOSSAIN', accountNumber: '20501290204369912', iban: 'BD03IBBL20501290204369912', swift: 'IBBLBDDHXXX', qrCode: '' }
  };

  const baseSaMethods = saMethods || {
    stcPay: { enabled: true, walletNumber: '+966 57 051 1931', instructions: 'Transfer via STC Pay mobile app directly to our wallet.', qrCode: '' },
    alRajhi: { enabled: true, bankName: 'Al Rajhi Bank Saudi Arabia 🇸🇦', accountName: 'MD IMRAN HOSSAIN', accountNumber: '621000010006086016528', iban: 'SA56 8000 0621 6080 1601 6528', swift: 'RJHISARI', qrCode: '' }
  };

  // Ensure real/correct numbers are always used to match logged-in checkout details
  const finalBdMethods = {
    bkash: { ...baseBdMethods.bkash, number: '0186400 0005', instructions: 'Send Money or Personal transfer directly to our bKash personal wallet.' },
    nagad: { ...baseBdMethods.nagad, number: '0186400 0005', instructions: 'Send Money directly to our secure Nagad Personal Wallet.' },
    rocket: { ...baseBdMethods.rocket, number: '0186400 0005', instructions: 'Direct Mobile Cash-in or Send Money via Rocket wallet.' },
    cellfin: { ...baseBdMethods.cellfin, number: '0186400 0005', instructions: 'Initiate prompt cellfin transfer directly to our wallet.' },
    islamiBank: { ...baseBdMethods.islamiBank, accountName: 'MD IMRAN HOSSAIN', accountNumber: '20501290204369912', iban: 'BD03IBBL20501290204369912' }
  };

  const finalSaMethods = {
    stcPay: { ...baseSaMethods.stcPay, walletNumber: '+966 57 051 1931' },
    alRajhi: { ...baseSaMethods.alRajhi, bankName: 'Al Rajhi Bank Saudi Arabia 🇸🇦', accountName: 'MD IMRAN HOSSAIN', accountNumber: '621000010006086016528', iban: 'SA56 8000 0621 6080 1601 6528', swift: 'RJHISARI' }
  };

  const finalIntlMethods = intlMethods || {
    paypal: { enabled: true, email: 'billing@webzonebd.com', clientId: 'AX_M_MOCK_PAYPAL_CLIENT_ID_9921', secretKey: 'E_M_MOCK_SECRET_KEY_8820' },
    bankTransfer: { enabled: true, bankName: 'HSBC International', accountHolder: 'WebzoneBD Global Ltd', accountNumber: '4005001234566', iban: 'GB88MIDL4005001234566', swift: 'MIDLGB22' }
  };

  // Active MFS resolver helper
  const getActiveMfsDetails = (gatewayName: string) => {
    switch (gatewayName) {
      case 'bKash Wallet':
        return {
          name: 'bKash (বিকাশ)',
          number: finalBdMethods.bkash?.number || '0186400 0005',
          instructions: finalBdMethods.bkash?.instructions || (language === 'bn' ? 'আমাদের বিকাশ নাম্বারে সেন্ড মানি অথবা পার্সোনাল টু পার্সোনাল ট্রান্সফার সম্পন্ন করুন।' : 'Send Money or Personal transfer directly to our bKash personal wallet.'),
          qrColor: 'd1245e',
          qrCodeUrl: finalBdMethods.bkash?.qrCode || '',
          type: finalBdMethods.bkash?.type || 'personal'
        };
      case 'Nagad Digital':
        return {
          name: 'Nagad (নগদ)',
          number: finalBdMethods.nagad?.number || '0186400 0005',
          instructions: finalBdMethods.nagad?.instructions || (language === 'bn' ? 'আমাদের নগদ নাম্বারে সরাসরি টাকা পাঠিয়ে আপনার ট্রানজেকশন ক্লিয়ার করুন।' : 'Send Money directly to our secure Nagad Personal Wallet.'),
          qrColor: 'f15a22',
          qrCodeUrl: finalBdMethods.nagad?.qrCode || '',
          type: finalBdMethods.nagad?.type || 'personal'
        };
      case 'Rocket Wallet':
        return {
          name: 'Rocket (রকেট)',
          number: finalBdMethods.rocket?.number || '0186400 0005',
          instructions: finalBdMethods.rocket?.instructions || (language === 'bn' ? 'ডাচ বাংলা ব্যাংক রকেট ওয়ালেট সার্ভিস ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন।' : 'Direct Mobile Cash-in or Send Money via Rocket wallet.'),
          qrColor: '8c2aeb',
          qrCodeUrl: finalBdMethods.rocket?.qrCode || '',
          type: finalBdMethods.rocket?.type || 'personal'
        };
      case 'Cellfin Payment':
        return {
          name: 'Cellfin Card',
          number: finalBdMethods.cellfin?.number || '0186400 0005',
          instructions: finalBdMethods.cellfin?.instructions || (language === 'bn' ? 'ইসলামী ব্যাংক সেলফিন অ্যাকাউন্টে সহজে ফান্ড ট্রান্সফার বা টাকা পাঠান।' : 'Initiate prompt cellfin transfer directly to our wallet.'),
          qrColor: '0081d6',
          qrCodeUrl: finalBdMethods.cellfin?.qrCode || '',
          type: 'personal'
        };
      default:
        return {
          name: 'bKash (বিকাশ)',
          number: '0186400 0005',
          instructions: '',
          qrColor: 'd1245e',
          qrCodeUrl: '',
          type: 'personal'
        };
    }
  };

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);

  // Unified Type for Wishlisted Item
  interface WishlistItem {
    id: string;
    type: 'product' | 'service' | 'package' | 'blog';
    title: string;
    titleBn: string;
    titleAr: string;
    image: string;
    category: string;
    categoryBn: string;
    categoryAr: string;
    shortDetails: string;
    shortDetailsBn: string;
    shortDetailsAr: string;
    price?: number;
    discountPrice?: number;
    originalItem: any;
  }

  // Construct a unified list of wishlisted items from products, services, packages, and blogs
  const getWishlistDetails = (): WishlistItem[] => {
    const items: WishlistItem[] = [];
    const addedIds = new Set<string>();

    // Dynamic products source from webzone_store_products
    let activeProducts = sampleProducts;
    const storedProds = localStorage.getItem('webzone_store_products');
    if (storedProds) {
      try {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeProducts = parsed;
        }
      } catch (e) {}
    }

    // Dynamic services source from webzone_services_catalog
    let activeServices = catalogServicesData;
    const storedSrvs = localStorage.getItem('webzone_services_catalog');
    if (storedSrvs) {
      try {
        const parsed = JSON.parse(storedSrvs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeServices = parsed;
        }
      } catch (e) {}
    }

    wishlist.forEach(id => {
      if (addedIds.has(id)) return;

      // 1. Check Store Products
      const product = activeProducts.find(p => p.id === id);
      if (product) {
        addedIds.add(id);
        items.push({
          id: product.id,
          type: 'product',
          title: product.name,
          titleBn: product.nameBn || product.name,
          titleAr: product.nameAr || product.name,
          image: product.image,
          category: product.category,
          categoryBn: product.category,
          categoryAr: product.category,
          shortDetails: product.description || '',
          shortDetailsBn: product.description || '',
          shortDetailsAr: product.description || '',
          price: product.price,
          discountPrice: product.discountPrice,
          originalItem: product
        });
        return;
      }

      // 2. Check Custom Services
      const customService = activeServices.find(s => s.id === id);
      if (customService) {
        addedIds.add(id);
        items.push({
          id: customService.id,
          type: 'service',
          title: customService.title,
          titleBn: customService.titleBn || customService.title,
          titleAr: customService.titleAr || customService.title,
          image: customService.image,
          category: customService.category,
          categoryBn: customService.categoryBn || customService.category,
          categoryAr: customService.categoryAr || customService.category,
          shortDetails: customService.shortDescription,
          shortDetailsBn: customService.shortDescriptionBn || customService.shortDescription,
          shortDetailsAr: customService.shortDescriptionAr || customService.shortDescription,
          price: customService.startingPrice,
          originalItem: customService
        });
        return;
      }

      // 3. Check Fixed Packages
      const packageService = fixedPackagesData.find(pkg => pkg.id === id);
      if (packageService) {
        addedIds.add(id);
        items.push({
          id: packageService.id,
          type: 'package',
          title: packageService.name,
          titleBn: packageService.nameBn || packageService.name,
          titleAr: packageService.nameAr || packageService.name,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
          category: packageService.category,
          categoryBn: packageService.categoryBn || packageService.category,
          categoryAr: packageService.categoryAr || packageService.category,
          shortDetails: `Revisions: ${packageService.revisions}. Delivery: ${packageService.deliveryDays} Days.`,
          shortDetailsBn: `রিভিশন: ${packageService.revisions}, ডেলিভারি: ${packageService.deliveryDays} দিন।`,
          shortDetailsAr: `تعديلات: ${packageService.revisions}، تسليم: ${packageService.deliveryDays} يوم`,
          price: packageService.price,
          originalItem: packageService
        });
        return;
      }

      // 4. Check Blog Posts
      const blogPost = initialLocalBlogs.find(b => b.id === id);
      if (blogPost) {
        addedIds.add(id);
        items.push({
          id: blogPost.id,
          type: 'blog',
          title: blogPost.title,
          titleBn: blogPost.titleBn || blogPost.title,
          titleAr: blogPost.titleAr || blogPost.title,
          image: blogPost.image,
          category: blogPost.category,
          categoryBn: blogPost.categoryBn || blogPost.category,
          categoryAr: blogPost.categoryAr || blogPost.category,
          shortDetails: blogPost.summary,
          shortDetailsBn: blogPost.summaryBn || blogPost.summary,
          shortDetailsAr: blogPost.summaryAr || blogPost.summary,
          originalItem: blogPost
        });
        return;
      }
    });

    return items;
  };

  // Premium Mega Menu States
  const [navDomainQuery, setNavDomainQuery] = useState('');
  const [navDomainTld, setNavDomainTld] = useState('.com');
  const [aiMenuInput, setAiMenuInput] = useState('');
  const [aiMenuResponse, setAiMenuResponse] = useState<string>('Welcome to WebzoneBD AI assistant! Choose a preset prompt below or type your query...');
  const [aiMenuLoading, setAiMenuLoading] = useState(false);

  const handleNavDomainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navDomainQuery.trim()) {
      triggerToast(language === 'bn' ? 'দয়া করে একটি ডোমেইন নাম লিখুন' : 'Please insert a domain name');
      return;
    }
    const cleanSld = navDomainQuery.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
    const cleanTld = navDomainTld;
    triggerToast(language === 'bn' ? 'আপনাকে WHMCS ডোমেন নিবন্ধন এ রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting you to WHMCS Domain Registration...');
    setTimeout(() => {
      window.location.href = `https://host.webzonebd.com/cart.php?a=add&domain=register&sld=${cleanSld}&tld=${cleanTld}`;
    }, 1000);
  };

  const triggerAiMenuConsultation = (topicKey: string) => {
    setAiMenuLoading(true);
    setAiMenuResponse(language === 'bn' ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing server parameters...');
    setTimeout(() => {
      let ans = '';
      if (topicKey === 'bdix') {
        ans = language === 'bn' 
          ? '🚀 BDIX হোস্টিংয়ে ডাটা সরাসরি ঢাকা ডেটা-সেন্টার দিয়ে রাউট হয়, যার ফলে বাংলাদেশের ভিজিটরদের জন্য সাইট লোড স্পিড ১০ গুন বৃদ্ধি পায় এবং ৫ মিলি-সেকেন্ডের কম ল্যাটেন্সি পাওয়া যায়!'
          : '🚀 BDIX Hosting routes local visitor traffic straight through Dhaka internet exchange points. This reduces latency to under 5ms, making website operations 10x faster!';
      } else if (topicKey === 'plan') {
         ans = language === 'bn'
          ? '🌟 নতুন ব্লগ ও ওয়ার্ডপ্রেসের জন্য BDIX Shared Starter বা Business প্ল্যানটি দারুণ। বড় কাস্টম বা ইকমার্স সাইটের জন্য dedicated VPS Host সলিউশন সম্পূর্ণ আদর্শ।'
          : '🌟 For standard WordPress/Laravel apps, our BDIX Shared Business or Premium SSD plans work best. For busy automated portals, BDIX Managed VPS gives dedicated cores.';
      } else if (topicKey === 'migrate') {
         ans = language === 'bn'
          ? '📦 আমরা সম্পূর্ণ ফ্রিতে আগের হোস্টিং থেকে সব ডাটা জিরো ডাউনটাইমে আমাদের ক্লাউড সিস্টেমে স্থানান্তর করে থাকি। সার্ভার অর্ডারের পর ক্লায়েন্ট প্যানেলে জাস্ট একটি টিকেট খুলুন!'
          : '📦 We provide 100% free migration of your previous cPanel backup directly into our high-performance BDIX cloud with zero downtime. Just open a ticket!';
      }
      setAiMenuResponse(ans);
      setAiMenuLoading(false);
      triggerToast(language === 'bn' ? 'এজেন্ট উত্তর সফল!' : 'Webzone AI replied successfully!');
    }, 500);
  };

  const handleAiMenuCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMenuInput.trim()) return;
    setAiMenuLoading(true);
    setAiMenuResponse(language === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Scanning database indices...');
    const query = aiMenuInput.toLowerCase();
    setTimeout(() => {
      let ans = '';
      if (query.includes('hosting') || query.includes('হোস্টিং') || query.includes('server')) {
        ans = language === 'bn' ? '💡 আমরা Webzone BDIX NVMe SSD Shared Hosting সাজেস্ট করি যা মাত্র ৳৯৯/মাস থেকে শুরু!' : '💡 We highly recommend our ultra-fast BDIX NVMe SSD Shared plans starting from ৳99/mo with LiteSpeed cache!';
      } else if (query.includes('domain') || query.includes('ডোমেইন')) {
        ans = language === 'bn' ? '💡 আপনি আমাদের সার্চ বক্স দিয়ে যেকোনো ডোমেইন রেজিস্টার করতে পারেন; WHMCS দিয়ে সরাসরি নিরাপদ পেমেন্ট নিশ্চিত করা হয়।' : '💡 You can register popular extensions (.com, .net, .org) directly. Checkout is handled securely via WHMCS.';
      } else if (query.includes('support') || query.includes('সাপোর্ট') || query.includes('help')) {
        ans = language === 'bn' ? '💡 আমরা ২৪/৭ লাইভ হোয়াটসঅ্যাপ এবং কাস্টমার পোর্টাল টিকেট সাপোর্ট প্রদান করে থাকি। যেকোনো জরুরি সার্ভার হেল্পের জন্য নিচে লাইভ চ্যাট করুন!' : '💡 We deliver guaranteed 24/7 technical help over WhatsApp, Client portal, and Hotline. Average ticket response is just 15 minutes!';
      } else {
        ans = language === 'bn' ? '💡 আপনার প্রশ্নের জন্য ধন্যবাদ! অনুগ্রহ করে নিচে থাকা লাইভ সাপোর্ট বাটনে ক্লিক করে সরাসরি আমাদের কাস্টমার এজেন্টের সাথে চ্যাট করুন।' : '💡 Interesting query! For custom developers quotes or manual deployment guides, select our Live WhatsApp Support agent below.';
      }
      setAiMenuResponse(ans);
      setAiMenuInput('');
      setAiMenuLoading(false);
      triggerToast('AI assistance update');
    }, 600);
  };

  const handleLiveSupportClick = () => {
    triggerToast(language === 'bn' ? 'আমাদের ২৪/৭ হোয়াটসঅ্যাপ প্রতিনিধির সাথে যোগাযোগ করা হচ্ছে...' : 'Initiating secure stream with our 24/7 WhatsApp support...');
    setTimeout(() => {
      window.open('https://wa.me/966570511931', '_blank');
    }, 800);
  };
  
  // Right Sidebar Customer Authentication panel states
  const [drawerAuthView, setDrawerAuthView] = useState<'login' | 'register' | 'forgot' | 'otp' | 'reset'>('login');
  const [custEmail, setCustEmail] = useState('');
  const [custPass, setCustPass] = useState('');
  const [custPassConfirm, setCustPassConfirm] = useState('');
  const [custFullName, setCustFullName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custOtpCode, setCustOtpCode] = useState('');
  const [custNewPass, setCustNewPass] = useState('');
  const [authDrawerLoading, setAuthDrawerLoading] = useState(false);
  const [authDrawerError, setAuthDrawerError] = useState('');
  const [authDrawerSuccess, setAuthDrawerSuccess] = useState('');
  const [tempRegUser, setTempRegUser] = useState<UserSession | null>(null);

  // Enhanced Register State & Validation Fields
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [custFullNameTouched, setCustFullNameTouched] = useState(false);
  const [custEmailTouched, setCustEmailTouched] = useState(false);
  const [custPhoneTouched, setCustPhoneTouched] = useState(false);
  const [custPassTouched, setCustPassTouched] = useState(false);
  const [custPassConfirmTouched, setCustPassConfirmTouched] = useState(false);

  const getPasswordStrength = (pass: string): 'Weak' | 'Medium' | 'Strong' => {
    if (!pass) return 'Weak';
    if (pass.length < 8) return 'Weak';
    let requirementsMet = 0;
    if (/[A-Z]/.test(pass)) requirementsMet++;
    if (/[a-z]/.test(pass)) requirementsMet++;
    if (/[0-9]/.test(pass)) requirementsMet++;
    if (/[^A-Za-z0-9]/.test(pass)) requirementsMet++;
    
    if (requirementsMet <= 2) return 'Weak';
    if (requirementsMet === 3) return 'Medium';
    return 'Strong';
  };
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const lastAppliedCodeRef = useRef<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutSelectedMethod, setCheckoutSelectedMethod] = useState<string | null>(null);
  const [stcPayExpanded, setStcPayExpanded] = useState(false);
  const [stcPayCopied, setStcPayCopied] = useState(false);
  const [bdtPaymentCopied, setBdtPaymentCopied] = useState(false);
  const [copiedBankAccNo, setCopiedBankAccNo] = useState(false);
  const [copiedBankAccName, setCopiedBankAccName] = useState(false);
  const [copiedBankRouting, setCopiedBankRouting] = useState(false);
  const [copiedAlrajiAccNo, setCopiedAlrajiAccNo] = useState(false);
  const [copiedAlrajiAccName, setCopiedAlrajiAccName] = useState(false);
  const [copiedAlrajiIban, setCopiedAlrajiIban] = useState(false);
  const [copiedAlrajiSwift, setCopiedAlrajiSwift] = useState(false);
  const [selectedRegisteredGateway, setSelectedRegisteredGateway] = useState<string>(() => localStorage.getItem('webzone_selected_registered_gateway') || '');
  const [headerQrMode, setHeaderQrMode] = useState<'brand' | 'royal' | 'slate'>('brand');
  const [headerQrType, setHeaderQrType] = useState<'tel' | 'invoice' | 'standard'>('invoice');
  const [deletingCartIndex, setDeletingCartIndex] = useState<number | null>(null);
  
  // Guest checkout details for frictionless direct checkouts
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'login'>('guest');
  const [showAccountBenefitsTooltip, setShowAccountBenefitsTooltip] = useState(false);
  const [guestName, setGuestName] = useState(() => localStorage.getItem('webzone_guest_name') || '');
  const [guestPhone, setGuestPhone] = useState(() => localStorage.getItem('webzone_guest_phone') || '');
  const [guestEmail, setGuestEmail] = useState(() => localStorage.getItem('webzone_guest_email') || '');
  const [guestTransactionId, setGuestTransactionId] = useState(() => localStorage.getItem('webzone_guest_transaction_id') || '');
  const [guestReceipt, setGuestReceipt] = useState('');
  const [guestReceiptName, setGuestReceiptName] = useState('');
  const [selectedGuestGateway, setSelectedGuestGateway] = useState<string>(() => localStorage.getItem('webzone_selected_guest_gateway') || '');
  const [guestValidationError, setGuestValidationError] = useState('');
  const [orderNotes, setOrderNotes] = useState(() => localStorage.getItem('webzone_order_notes') || '');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Sync state values to localStorage
  useEffect(() => {
    localStorage.setItem('webzone_selected_registered_gateway', selectedRegisteredGateway);
  }, [selectedRegisteredGateway]);

  useEffect(() => {
    localStorage.setItem('webzone_guest_name', guestName);
  }, [guestName]);

  useEffect(() => {
    localStorage.setItem('webzone_guest_phone', guestPhone);
  }, [guestPhone]);

  useEffect(() => {
    localStorage.setItem('webzone_guest_email', guestEmail);
  }, [guestEmail]);

  useEffect(() => {
    localStorage.setItem('webzone_guest_transaction_id', guestTransactionId);
  }, [guestTransactionId]);

  useEffect(() => {
    localStorage.setItem('webzone_selected_guest_gateway', selectedGuestGateway);
  }, [selectedGuestGateway]);

  useEffect(() => {
    localStorage.setItem('webzone_order_notes', orderNotes);
  }, [orderNotes]);

  // Premium Multiple Screenshot & Payment Receipt photo upload state
  const [guestReceiptsList, setGuestReceiptsList] = useState<{name: string, url: string}[]>([]);

  useEffect(() => {
    if (guestReceiptsList.length > 0) {
      setGuestReceipt(guestReceiptsList[0].url); // primary receipt for existing checkout logic
      setGuestReceiptName(guestReceiptsList.map(r => r.name).join(', '));
    } else {
      setGuestReceipt('');
      setGuestReceiptName('');
    }
  }, [guestReceiptsList]);

  // 🎉 PREMIUM CONGRATULATIONS SUCCESS POPUP FOR SHOPPING CART ORDERS
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [successItems, setSuccessItems] = useState<{name: string, price: number}[]>([]);
  const [successTotal, setSuccessTotal] = useState(0);
  const [successPaymentMethod, setSuccessPaymentMethod] = useState('');
  const [successRecipientName, setSuccessRecipientName] = useState('');
  const [successTransactionId, setSuccessTransactionId] = useState('');
  const [copiedOrderMsg, setCopiedOrderMsg] = useState(false);

  useEffect(() => {
    setIsPaymentConfirmed(false);
  }, [selectedGuestGateway, selectedRegisteredGateway, cartOpen]);

  // Sender details for registered BDT payment verification
  const [senderName, setSenderName] = useState(() => localStorage.getItem('webzone_sender_name') || '');
  const [senderNumber, setSenderNumber] = useState(() => localStorage.getItem('webzone_sender_number') || '');
  const [senderTrxId, setSenderTrxId] = useState(() => localStorage.getItem('webzone_sender_trx_id') || '');

  useEffect(() => {
    localStorage.setItem('webzone_sender_name', senderName);
  }, [senderName]);

  useEffect(() => {
    localStorage.setItem('webzone_sender_number', senderNumber);
  }, [senderNumber]);

  useEffect(() => {
    localStorage.setItem('webzone_sender_trx_id', senderTrxId);
  }, [senderTrxId]);

  useEffect(() => {
    if (user) {
      setSenderName(user.name || localStorage.getItem('webzone_sender_name') || '');
      if (user.phone) {
        setSenderNumber(user.phone || localStorage.getItem('webzone_sender_number') || '');
      } else {
        setSenderNumber(localStorage.getItem('webzone_sender_number') || '');
      }
    } else {
      setSenderName(localStorage.getItem('webzone_sender_name') || '');
      setSenderNumber(localStorage.getItem('webzone_sender_number') || '');
    }
  }, [user]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileDropdownOpenMobile, setProfileDropdownOpenMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [guestDropdownOpenDesktop, setGuestDropdownOpenDesktop] = useState(false);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRefMobile = useRef<HTMLDivElement>(null);
  const guestDropdownRefDesktop = useRef<HTMLDivElement>(null);
  const wishlistDropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (profileDropdownRefMobile.current && !profileDropdownRefMobile.current.contains(event.target as Node)) {
        setProfileDropdownOpenMobile(false);
      }
      if (guestDropdownRefDesktop.current && !guestDropdownRefDesktop.current.contains(event.target as Node)) {
        setGuestDropdownOpenDesktop(false);
      }
      if (wishlistDropdownRef.current && !wishlistDropdownRef.current.contains(event.target as Node)) {
        setWishlistOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');

  const [desktopLanguageOpen, setDesktopLanguageOpen] = useState(false);
  const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);

  const [discountAmount, setDiscountAmount] = useState(0);

  // Reset/calculate coupon discount based on cart items
  useEffect(() => {
    if (cart.length === 0) {
      setDiscountAmount(0);
      localStorage.removeItem('webzone_active_coupon_code');
    } else {
      const totalDiscount = cart.reduce((acc, item) => {
        if (item.appliedCoupon) {
          const price = item.product.discountPrice || item.product.price;
          return acc + (price * item.appliedCoupon.discountPercent / 100);
        }
        return acc;
      }, 0);
      setDiscountAmount(totalDiscount);
    }
  }, [cart]);

  // Sync coupon code and success state when cart has applied coupon
  useEffect(() => {
    const activeCode = localStorage.getItem('webzone_active_coupon_code');
    if (activeCode && cart.some(item => item.appliedCoupon)) {
      setCouponCode(activeCode);
      if (lastAppliedCodeRef.current !== activeCode) {
        lastAppliedCodeRef.current = activeCode;
        setCouponSuccess(language === 'bn' ? `কুপন "${activeCode}" প্রযোজ্য হয়েছে!` : `Coupon "${activeCode}" applied!`);
      }
    } else if (!cart.some(item => item.appliedCoupon)) {
      setCouponCode('');
      lastAppliedCodeRef.current = null;
    }
  }, [cart, language]);

  // Auto-dismiss coupon feedback after 4 seconds
  useEffect(() => {
    if (couponSuccess) {
      const timer = setTimeout(() => {
        setCouponSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [couponSuccess]);

  useEffect(() => {
    if (couponError) {
      const timer = setTimeout(() => {
        setCouponError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [couponError]);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price;
  }, 0);

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const errorMsg = applyCouponToCart(couponCode);
    if (errorMsg) {
      setCouponError(errorMsg);
    } else {
      const upper = couponCode.toUpperCase();
      const match = sampleCoupons?.find(c => c.code === upper);
      if (match) {
        setCouponSuccess(`Coupon "${upper}" applied successfully!`);
        setDiscountAmount(subtotal * (match.discountPercent / 100));
      } else {
        if (upper === 'WEBZONE20' || upper === 'SAVE20') {
          setCouponSuccess('Coupon applied successfully! 20% discount applied.');
          setDiscountAmount(subtotal * 0.20);
        } else if (upper === 'WELCOME10') {
          setCouponSuccess('Welcome Coupon applied! 10% discount applied.');
          setDiscountAmount(subtotal * 0.10);
        } else {
          setCouponSuccess('Coupon applied successfully!');
          setDiscountAmount(subtotal * 0.15);
        }
      }
    }
  };

  const handleRemoveCoupon = () => {
    if (removeCouponFromCart) {
      removeCouponFromCart();
    }
    setCouponCode('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  const handleSimulatePayment = (method: string) => {
    if (!user && checkoutMode === 'guest') {
      if (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim()) {
        setGuestValidationError(language === 'bn' ? 'দয়া করে সবগুলো তথ্য পূরণ করুন!' : language === 'ar' ? 'يرجى ملء جميع الحقول!' : 'Please fill out all fields before processing payment.');
        return;
      }
      setGuestValidationError('');
    }

    if (user && (currency === 'BDT' || currency === 'SAR')) {
      if (!senderName.trim() || !senderNumber.trim() || !senderTrxId.trim()) {
        triggerToast(language === 'bn' ? 'দয়া করে প্রেরকের নাম, নম্বর এবং ট্রানজেকশন আইডি পূরণ করুন!' : 'Please fill out all payment details: Sender Name, Phone/Account Number and Transaction ID.');
        return;
      }
      if (!isPaymentConfirmed) {
        triggerToast(language === 'bn' ? 'দয়া করে নিশ্চিত করুন যে আপনি পেমেন্ট করেছেন!' : 'Please confirm that you have paid by checking the confirmation box.');
        return;
      }
    }

    const generatedOrderId = `WBD-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsToSave = cart.map(item => ({
      name: item.product.name,
      price: item.product.discountPrice || item.product.price
    }));
    const totalToSave = total;
    const recipientToSave = user ? (senderName || user.name || '') : (guestName || '');

    setCheckoutSuccess(true);
    setCheckoutSelectedMethod(method);
    setTimeout(() => {
      if (user && (currency === 'BDT' || currency === 'SAR')) {
        addSimulatedOrder(method, {
          name: senderName,
          phone: senderNumber,
          email: user.email || '',
          transactionId: senderTrxId,
          isGuest: false,
          orderNotes: orderNotes
        });
      } else {
        addSimulatedOrder(method, {
          name: user?.name || 'Mizanur Rahman',
          phone: user?.phone || '01711223344',
          email: user?.email || 'mizanur@gmail.com',
          isGuest: false,
          orderNotes: orderNotes
        });
      }

      setCheckoutSuccess(false);
      setCartOpen(false);

      // Save to success states before resetting cart!
      setSuccessOrderId(generatedOrderId);
      setSuccessItems(itemsToSave);
      setSuccessTotal(totalToSave);
      setSuccessPaymentMethod(method);
      setSuccessRecipientName(recipientToSave);
      setSuccessTransactionId(senderTrxId || '');
      setIsSuccessPopupOpen(true);

      resetCart();
      setDiscountAmount(0);
      setCouponCode('');
      setCouponSuccess(null);
      setOrderNotes('');
      // Reset guest inputs
      setGuestName('');
      setGuestPhone('');
      setGuestEmail('');
      setGuestValidationError('');
      // Reset registered payment verification inputs
      setSenderName(user?.name || '');
      setSenderNumber(user?.phone || '');
      setSenderTrxId('');
    }, 1500);
  };

  const handleSubmitGuestTransaction = () => {
    if (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim()) {
      setGuestValidationError(language === 'bn' ? 'দয়া করে আপনার নাম, মোবাইল এবং ইমেইল পূরণ করুন!' : language === 'ar' ? 'يرجى ملء الاسم ورقم الهاتف والبريد الإلكتروني!' : 'Please fill out your Name, Phone, and Email address.');
      return;
    }

    if (!isPaymentConfirmed) {
      setGuestValidationError(language === 'bn' ? 'দয়া করে নিশ্চিত করুন যে আপনি পেমেন্ট করেছেন!' : 'Please confirm that you have paid by checking the confirmation box.');
      return;
    }

    // Determine gateway method
    let method = selectedGuestGateway;
    if (!method) {
      if (currency === 'SAR') method = 'STC Pay (+966 57 051 1931)';
      else if (currency === 'BDT') method = 'bKash Wallet';
      else method = 'USD Bank Transfer';
    }

    const generatedOrderId = `WBD-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsToSave = cart.map(item => ({
      name: item.product.name,
      price: item.product.discountPrice || item.product.price
    }));
    const totalToSave = total;
    const recipientToSave = guestName;

    setCheckoutSelectedMethod(method);
    setCheckoutSuccess(true);

    const guestInfo = {
      name: guestName,
      phone: guestPhone,
      email: guestEmail,
      transactionId: guestTransactionId,
      transactionReceipt: guestReceipt,
      isGuest: true,
      orderNotes: orderNotes
    };

    // Calculate currency symbol
    const symbol = currency === 'BDT' ? '৳' : currency === 'SAR' ? 'SR ' : '$';
    
    // Format orders for text template
    const orderItemsText = cart.map(item => {
      let text = `• ${item.product.name} (${symbol}${item.product.discountPrice || item.product.price})`;
      if (item.product.advancePercent !== undefined && item.product.advancePercent < 100) {
        text += `\n  [Advance ${item.product.advancePercent}%: ${symbol}${item.product.advanceAmount}, Due: ${symbol}${item.product.dueAmount}]`;
      }
      return text;
    }).join('\n');

    const hasAdvanceItemGlobal = cart.some(item => item.product.advancePercent !== undefined && item.product.advancePercent < 100);
    const payableNowValGlobal = cart.reduce((acc, item) => {
      if (item.product.advanceAmount !== undefined) return acc + item.product.advanceAmount;
      return acc + (item.product.discountPrice || item.product.price);
    }, 0) - discountAmount;
    const dueRemainingValGlobal = cart.reduce((acc, item) => acc + (item.product.dueAmount || 0), 0);

    const totalAmountText = hasAdvanceItemGlobal
      ? `${symbol}${total} (Paid Advance: ${symbol}${Math.max(0, payableNowValGlobal)}, Remaining Due: ${symbol}${dueRemainingValGlobal})`
      : `${symbol}${total}`;
    const notesLabelText = orderNotes ? `\n📝 Order Notes: ${orderNotes}` : '';

    const whatsappText = `Assalamu Alaikum Imran Hasan,
I am submitting a Guest Checkout transaction on WebzoneBD:

👤 Guest Name: ${guestName}
📞 WhatsApp / Phone: ${guestPhone}
✉️ Email Address: ${guestEmail}
💳 Payment Method Selected: ${method}
🔑 Transaction ID (TrxID): ${guestTransactionId || 'Not Provided'}${notesLabelText}

🛒 Products Ordered:
${orderItemsText}

💰 Total Amount Paid: ${totalAmountText}
📅 Transaction Date: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}

Please verify this payment and process the order. Thank you!`;

    const encodedMsg = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=966570511931&text=${encodedMsg}`;

    setTimeout(() => {
      // Create guest order
      addSimulatedOrder(method, guestInfo);

      setCheckoutSuccess(false);
      setCartOpen(false);

      // Save to success states before resetting cart!
      setSuccessOrderId(generatedOrderId);
      setSuccessItems(itemsToSave);
      setSuccessTotal(totalToSave);
      setSuccessPaymentMethod(method);
      setSuccessRecipientName(recipientToSave);
      setSuccessTransactionId(guestTransactionId || '');
      setIsSuccessPopupOpen(true);

      resetCart();
      setDiscountAmount(0);
      setCouponCode('');
      setCouponSuccess(null);

      // Clean checkout states
      setGuestName('');
      setGuestPhone('');
      setGuestEmail('');
      setGuestTransactionId('');
      setGuestReceipt('');
      setGuestReceiptName('');
      setSelectedGuestGateway('');
      setGuestValidationError('');
      setOrderNotes('');

      // Open WhatsApp Link
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.warn("Blocked window.open for WhatsApp, opening with helper anchor:", err);
        const a = document.createElement('a');
        a.href = whatsappUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
      }
    }, 1500);
  };

  const handleMobileSubitemClick = (item: any, type: 'service' | 'marketplace' | 'solution' | 'hosting') => {
    if (type === 'service') {
      localStorage.setItem('webzone_target_services_tab', 'catalog');
      if (item.title) {
        localStorage.setItem('webzone_services_filter_keyword', item.title);
      }
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('services');
    } else if (type === 'solution') {
      const isSchool = item.title === "School Management" || item.tab === "school";
      localStorage.setItem('webzone_target_solution_tab', isSchool ? 'school' : 'pos');
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('solutions');
    } else if (type === 'marketplace') {
      if (item.keyword) {
        localStorage.setItem('webzone_target_marketplace_search_keyword_cache', item.keyword);
        if (setSearchTerm) {
          setSearchTerm(item.keyword);
        }
      } else if (item.title) {
        localStorage.setItem('webzone_target_marketplace_search_keyword_cache', item.title);
        if (setSearchTerm) {
          setSearchTerm(item.title);
        }
      }
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('marketplace');
    } else if (type === 'hosting') {
      if (item.title === "Domain Registration") {
        setCurrentPage('domain');
      } else {
        localStorage.setItem('webzone_target_hosting_tab', 'all');
        window.dispatchEvent(new Event('storage'));
        setCurrentPage('hosting');
      }
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown-container')) {
        setDesktopLanguageOpen(false);
      }
      if (!target.closest('.currency-dropdown-container')) {
        setDesktopCurrencyOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Scroll and glassy header tracker
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile navigation exclusive states
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  // Keep track of active sub-tab for Services internally for active headers syncing
  const [activeServicesTab, setActiveServicesTab] = useState<'catalog' | 'growth-package'>('catalog');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTab = localStorage.getItem('webzone_services_current_tab_cache') || 'catalog';
      setActiveServicesTab(currentTab as any);
    };

    window.addEventListener('storage', handleStorageChange);
    const timer = setInterval(handleStorageChange, 150);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(timer);
    };
  }, []);

  // Auto Currency Detection Hook is routed centrally inside App.tsx
  useEffect(() => {
    // Sync active currency with default baseline on invalid states
    if (currencySettings && currencySettings.enabled) {
      if (!currencySettings.enabled[currency]) {
        const fall = currencySettings.defaultCurrency || 'USD';
        setCurrency(fall);
      }
    }
  }, [currency, currencySettings, setCurrency]);

  const toggleAccordion = (accordionName: string) => {
    setExpandedAccordion(prev => prev === accordionName ? null : accordionName);
  };

  // Currency utility formatting
  const formatPriceInCart = (usd: number) => {
    let cur = currency;
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates || rates;
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
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

  // Accordion Items Definitions
  const servicesList = [
    { title: "Web Design & WordPress", titleBn: "🖥️ ওয়েব ডিজাইন ও ওয়ার্ডপ্রেস", titleAr: "🖥️ تصميم المواقع وووردبريس", tab: "web", keyword: "WordPress", icon: "🖥️" },
    { title: "Laravel & Custom Development", titleBn: "⚙️ লারাভেল ও কাস্টম ডেভেলপমেন্ট", titleAr: "⚙️ لارافيل وتطوير البرمجيات", tab: "laravel", keyword: "Laravel", icon: "⚙️" },
    { title: "Digital Marketing & SEO", titleBn: "📈 ডিজিটাল মার্কেটিং ও এসইও", titleAr: "📈 التسويق الرقمي والسيو", tab: "seo", keyword: "SEO", icon: "📈" },
    { title: "E-Commerce Solutions", titleBn: "🛒 ই-কমার্স সলিউশন", titleAr: "🛒 حلول المتاجر الإلكترونية", tab: "ecommerce", keyword: "Ecommerce", icon: "🛒" },
    { title: "Digital Store Gig Services", titleBn: "💼 ডিজিটাল স্টোর গিগ সার্ভিসেস", titleAr: "💼 خدمات جج وفايفر", tab: "gigs", keyword: "Gig", icon: "💼" }
  ];

  const marketplaceList = [
    { title: "Ready Websites", titleBn: "প্রস্তুত ওয়েবসাইট", titleAr: "مواقع جاهزة", keyword: "Web" },
    { title: "WP Themes", titleBn: "ওয়ার্ডপ্রেস থিম", titleAr: "قوالب ووردبريس", keyword: "WordPress" },
    { title: "PHP Scripts", titleBn: "পিএইচপি স্ক্রিপ্টস", titleAr: "سكربتات PHP", keyword: "PHP" },
    { title: "Premium Plugins", titleBn: "প্রিমিয়াম প্লাগিন", titleAr: "إضافات ممتازة", keyword: "Plugin" },
    { title: "Mobile Apps", titleBn: "মোবাইল অ্যাপস", titleAr: "تطبيقات هواتف", keyword: "Mobile App" }
  ];

  const solutionsList = [
    { title: "POS Software", titleBn: "সেলস ও পস পিওএস সিস্টেম", titleAr: "أنظمة البيع والحسابات POS" },
    { title: "School Management", titleBn: "স্কুল ও কলেজ এডুকেশন পোর্টাল", titleAr: "إدارة المدارس والجامعات LMS" }
  ];

  const hostingDomainList = [
    { title: "Domain Registration", titleBn: "ডোমেন রেজিষ্ট্রেশন", titleAr: "حجز نطاقات سريعة" },
    { title: "Shared Hosting", titleBn: "শেয়ার্ড এসএসডি হোস্টিং", titleAr: "استضافات مشتركة سريعة" },
    { title: "Business Hosting", titleBn: "কর্পোরেট বিজনেস হোস্টিং", titleAr: "استضافة شركات وأعمال" },
    { title: "VPS Hosting", titleBn: "ভার্চুয়াল ডেডিকেটেড সার্ভার", titleAr: "خوادم افتراضية خاصة VPS" },
    { title: "Cloud Hosting", titleBn: "হাইব্রিড ক্লাউড হোস্টিং", titleAr: "بنية تحتية سحابية Cloud" },
    { title: "SSL Certificates", titleBn: "নিরাপদ এসএসএল সার্টিফিকেট", titleAr: "شهادات حماية ويب أمان SSL" }
  ];

  // Translations
  const translations = {
    en: {
      services: "Services",
      marketplace: "Digital Store",
      portfolio: "Portfolio",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      cart: "ShoppingCart",
      checkout: "Checkout Now",
      cartEmpty: "Your digital cart is empty",
      discountCode: "Have a support coupon?",
      apply: "Apply",
      subtotal: "Subtotal",
      total: "Total",
      checkoutTitle: "Choose Secured Payment System",
      choosePayment: "Select pay method",
      paySuccess: "Order processed successfully! Check your User Dashboard.",
      adminBtn: "Admin Dashboard",
      userBtn: "Client Dashboard",
      guestLabel: "Client Mode",
      about: "About",
      pricing: "Hosting Tools",
      growthPackage: "Powerful Package",
      hosting: "Hosting",
      hostingShared: "Shared BDIX Hosting",
      hostingSharedDesc: "Supercharged speed optimized for local Bengali visitors.",
      hostingVps: "Managed VPS Hosting",
      hostingVpsDesc: "Dedicated kernel nodes for ultimate application density.",
      hostingReseller: "Reseller Hosting",
      hostingResellerDesc: "White-label servers to kickstart your agency hosting."
    },
    bn: {
      services: "আমাদের সার্ভিসসমূহ",
      marketplace: "ডিজিটাল স্টোর",
      portfolio: "পোর্টফোলিও",
      blog: "ব্লগ ও খবর",
      faq: "প্রশ্নোত্তর",
      contact: "যোগাযোগ",
      cart: "কার্ট ফাইল",
      checkout: "অর্ডার সম্পন্ন করুন",
      cartEmpty: "আপনার ডাউনলোড কার্টটি শূন্য",
      discountCode: "কুপন কোড ব্যবহার করুন",
      apply: "প্রয়োগ",
      subtotal: "সাব-টোটাল",
      total: "সর্বমোট বিল",
      checkoutTitle: "নিরাপদ পেমেন্ট গেটওয়ে সিলেক্ট করুন",
      choosePayment: "পেমেন্ট মাধ্যম বেছে নিন",
      paySuccess: "পেমেন্ট সফল হয়েছে! কাস্টমার ড্যাশবোর্ড চেক করুন।",
      adminBtn: "অ্যাডমিন প্যানেল",
      userBtn: "কাস্টমার ড্যাশবোর্ড",
      guestLabel: "ইউজার মোড",
      about: "আমাদের সম্পর্কে",
      pricing: "হোস্টিং প্ল্যান",
      growthPackage: "পাওয়ারফুল প্যাকেজ",
      hosting: "হোস্টিং",
      hostingShared: "শেয়ার্ড বিডিআইএক্স হোস্টিং",
      hostingSharedDesc: "আমাদের স্থানীয় নেটওয়ার্কের সবচেয়ে শক্তিশালী শেয়ার্ড হোস্টিং।",
      hostingVps: "ম্যানেজড ভিপিএস হোস্টিং",
      hostingVpsDesc: "ভার্চুয়াল ডেডিকেটেড সার্ভার ও উন্নত পারফরম্যান্স সলিউশন।",
      hostingReseller: "রিসেলার হোস্টিং",
      hostingResellerDesc: "হোয়াইট-লেবেল হোস্টিং নিয়ে গড়ে তুলুন আপনার নিজের ব্যবসা।"
    },
    ar: {
      services: "خدماتنا",
      marketplace: "المتجر الرقمي",
      portfolio: "الأعمال السابقة",
      blog: "المدونات والأخبار",
      faq: "الأسئلة الشائعة",
      contact: "اتصل بنا",
      cart: "سلة المشتريات",
      checkout: "إتمام الدفع الآمن",
      cartEmpty: "السلة الرقمية فارغة حالياً",
      discountCode: "هل لديك كود كوبون خصم؟",
      apply: "تطبيق الخصم",
      subtotal: "المجموع الفرعي",
      total: "المجموع الكلي",
      checkoutTitle: "اختر بوابة الدفع الآمنة المعالجة",
      choosePayment: "اختر طريقة السداد الرخيصة",
      paySuccess: "تم معالجة طلبك بنجاح! يرجى مراجعة لوحة التحكم الخاصة بك.",
      adminBtn: "لوحة تحكم المسؤول",
      userBtn: "حساب العميل",
      guestLabel: "نمط الزائر",
      about: "معلومات عنا",
      pricing: "أدوات السيرفر",
      growthPackage: "الباقة المتكاملة",
      hosting: "الاستضافة",
      hostingShared: "استضافة BDIX المشتركة",
      hostingSharedDesc: "استضافات مدعومة بالسرعات المحلية الاستثنائية.",
      hostingVps: "خوادم VPS المدارة كاملة",
      hostingVpsDesc: "خوادم افتراضية مخصصة للأداء العالي وتطبيقات الويب.",
      hostingReseller: "موزع استضافة",
      hostingResellerDesc: "استضافة موزع موثوقة للبدء في مشروعك الخاص."
    }
  };
  const t = translations[language] || translations.en;

  return (
    <>
      {/* Top Header Bar (Height: 40px) */}
      <div className="h-10 border-b border-white/5 bg-gradient-to-r from-[#201040] via-[#110D2C] to-[#09051B] text-white/90 text-xs font-semibold select-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side Info */}
          <div className="flex items-center gap-5">
            <a 
              href="mailto:info@webzonebd.com" 
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-150"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span className="hidden sm:inline">info@webzonebd.com</span>
            </a>
            <a 
              href="https://wa.me/966570511931" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors duration-150"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">WhatsApp: +966 570511931</span>
            </a>
            <a 
              href="https://www.webzonebd.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden lg:flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-150"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>www.webzonebd.com</span>
            </a>
          </div>

          {/* Right Side Tools & Social */}
          <div className="flex items-center gap-4">
            {/* Social Network Icons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-500 dark:hover:text-cyan-400 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="Facebook Profile Link"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-600 dark:hover:text-cyan-450 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="LinkedIn Profile Link"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-rose-500 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="YouTube Channel Profile"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="hidden sm:block w-px h-3 bg-neutral-200 dark:bg-neutral-800" />

            {/* Language Switcher */}
            <div className="relative language-dropdown-container">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopLanguageOpen(!desktopLanguageOpen);
                  setDesktopCurrencyOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[11px] font-bold transition duration-155 cursor-pointer select-none ${
                  desktopLanguageOpen 
                    ? 'border-blue-500 bg-blue-50/10 text-blue-600 dark:text-cyan-400' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{language === 'bn' ? 'বাংলা 🇧🇩' : language === 'ar' ? 'العربية 🇸🇦' : 'English 🇺🇸'}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${desktopLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`absolute right-0 top-full mt-1.5 w-32 origin-top-right rounded-xl border bg-white dark:bg-neutral-950 shadow-2xl transition-all duration-150 z-50 border-neutral-200/60 dark:border-neutral-800 p-1 space-y-0.5 ${
                  desktopLanguageOpen 
                    ? 'scale-100 opacity-100 visible pointer-events-auto' 
                    : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
              >
                <button 
                  onClick={() => {
                    setLanguage('en');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'en' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  English
                </button>
                <button 
                  onClick={() => {
                    setLanguage('bn');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'bn' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => {
                    setLanguage('ar');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'ar' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Currency Switcher Dropdown */}
            <div className="relative currency-dropdown-container">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopCurrencyOpen(!desktopCurrencyOpen);
                  setDesktopLanguageOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[11px] font-bold transition duration-155 cursor-pointer select-none ${
                  desktopCurrencyOpen
                    ? 'border-blue-500 bg-blue-50/10 text-blue-600 dark:text-cyan-400'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <span>{currency === 'BDT' ? '🇧🇩 ৳ BDT' : currency === 'SAR' ? '🇸🇦 ﷼ SAR' : '🇺🇸 $ USD'}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${desktopCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`absolute right-0 top-full mt-1.5 w-32 origin-top-right rounded-xl border bg-white dark:bg-neutral-950 shadow-2xl transition-all duration-150 z-50 border-neutral-200/60 dark:border-neutral-800 p-1 space-y-0.5 ${
                  desktopCurrencyOpen 
                    ? 'scale-100 opacity-100 visible pointer-events-auto' 
                    : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
              >
                {(['USD', 'BDT', 'SAR'] as Currency[]).filter(cur => {
                  if (currencySettings && currencySettings.enabled) {
                    return currencySettings.enabled[cur];
                  }
                  return true;
                }).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setDesktopCurrencyOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                      currency === cur 
                        ? 'bg-blue-600 text-white font-black' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                    }`}
                  >
                    <span>{cur === 'BDT' ? '🇧🇩 BDT' : cur === 'SAR' ? '🇸🇦 SAR' : '🇺🇸 USD'}</span>
                    <span className="text-[10px] font-mono font-normal opacity-85">{cur === 'BDT' ? '৳' : cur === 'SAR' ? 'ر.س' : '$'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky Navigation (Height: 64px) */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-md bg-white/90 dark:bg-neutral-950/90 shadow-lg border-b border-neutral-200/80 dark:border-neutral-850/80' 
          : 'bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* LEFT: Logo area */}
            <div 
              className="flex items-center space-x-1.5 md:space-x-2 cursor-pointer select-none shrink-0"
              onClick={() => setCurrentPage('home')}
              id="header-nav-logo"
            >
              <div className="p-1.5 md:p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/20 hover:scale-[1.03] transition duration-200">
                <Globe className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="text-sm md:text-[16px] font-black tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                  WebzoneBD
                </span>
                <span className="text-[7.5px] md:text-[8.5px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-450 font-black">
                  IT Solution
                </span>
              </div>
            </div>

            {/* CENTER: Modern Mega Menu Desktop */}
            <MegaMenuDesktop
              language={language}
              currency={currency}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setIsAdmin={setIsAdmin}
              triggerToast={triggerToast}
            />

            {/* RIGHT: Theme Toggle, Wishlist, Notifications, Cart, Login, Register, User Account */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              
              {/* Hostinger-Style Animated Theme Selector Toggle */}
              <button 
                onClick={(e) => setTheme(theme === 'light' ? 'dark' : 'light', e)}
                className="relative p-2 rounded-xl border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-200 bg-white/80 dark:bg-slate-900/80 hover:bg-neutral-100 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group overflow-hidden"
                aria-label="Toggle Theme"
                title={theme === 'light' ? 'Switch to Dark Mode (Hostinger Theme Engine)' : 'Switch to Light Mode (Hostinger Theme Engine)'}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {theme === 'light' ? (
                    <Moon className="h-4.5 w-4.5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300 animate-hostinger-moon" />
                  ) : (
                    <Sun className="h-4.5 w-4.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300 animate-hostinger-sun" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </button>

              {/* Wishlist Heart Icon & premium dropdown */}
              <div className="relative" ref={wishlistDropdownRef} id="wishlist-dropdown-wrapper">
                <button 
                  onClick={() => setWishlistOpen(!wishlistOpen)}
                  className="relative p-2 rounded-xl border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-slate-900 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                  title={`${wishlist.length} item(s) in your Wishlist`}
                >
                  <Heart className={`h-4.5 w-4.5 transition-all duration-300 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-neutral-500 hover:text-[#7C3AED] dark:hover:text-[#A855F7]'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[8px] font-black leading-none text-white bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-full shadow-lg">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu - Premium Modern UI Gradient look */}
                <AnimatePresence>
                  {wishlistOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute right-[-100px] xs:right-[-60px] sm:right-0 mt-3 w-[330px] sm:w-[420px] z-[999] rounded-[24px] border border-neutral-200/60 dark:border-white/8 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[20px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(124,58,237,0.15)] origin-top-right overflow-hidden"
                    >
                      {/* Premium Rainbow Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
                      
                      {/* Header Row */}
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/8 mb-4">
                        <h2 className="text-sm font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                          <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500 shrink-0" />
                          <span className="tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                            {language === 'bn' ? 'আমার উইশলিস্ট' : language === 'ar' ? 'مفضلتي' : 'My Wishlist'}
                          </span>
                          <span className="ml-1 px-2.5 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-sm shadow-[#A855F7]/25 animate-pulse">
                            {wishlist.length}
                          </span>
                        </h2>
                        
                        <button
                          onClick={() => setWishlistOpen(false)}
                          className="p-1.5 text-neutral-400 hover:text-[#EC4899] dark:text-neutral-500 dark:hover:text-[#EC4899] rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/60 transition-all duration-150 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Scrollable list */}
                      <div className="max-h-[360px] overflow-y-auto pr-1 text-left scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-slate-800">
                        {wishlist.length === 0 ? (
                          <div className="text-center py-10 px-4 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#7C3AED]/8 via-[#A855F7]/8 to-[#EC4899]/8 border border-[#7C3AED]/10 dark:border-white/5 flex items-center justify-center mb-5 shadow-inner relative">
                              <Heart className="w-9 h-9 text-[#A855F7] stroke-[1.5] animate-pulse" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                              {language === 'bn' ? 'আপনার উইশলিস্ট খালি!' : language === 'ar' ? 'المفضلة فارغة حالياً!' : 'Your Wishlist is Empty!'}
                            </h3>
                            <p className="text-[10.5px] text-neutral-500 dark:text-neutral-450 mt-2 max-w-[260px] leading-relaxed">
                              {language === 'bn' ? 'আমাদের নতুন প্রিমিয়াম স্ক্রিপ্ট ও থিমগুলো দেখতে আজই ডিজিটাল স্টোর ভিজিট করুন।' : 'Browse our premium script catalogs and add outstanding products to your wishlist!'}
                            </p>
                            <button
                              onClick={() => {
                                setWishlistOpen(false);
                                setCurrentPage('marketplace');
                              }}
                              className="mt-6 flex items-center justify-center gap-2 h-[44px] px-6 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] active:scale-[0.98] text-[11px] font-bold text-white rounded-[14px] shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40 transition-all duration-300 cursor-pointer"
                            >
                              <span>{language === 'bn' ? 'ডিজিটাল স্টোর ব্রাউজ করুন' : 'Browse Products Store'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 pb-2">
                            {getWishlistDetails().map((item, idx) => {
                              const isProduct = item.type === 'product';
                              const isService = item.type === 'service';
                              const isPackage = item.type === 'package';
                              const isBlog = item.type === 'blog';

                              const activePrice = item.discountPrice || item.price;
                              const titleText = language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title;
                              const descText = language === 'bn' ? item.shortDetailsBn : language === 'ar' ? item.shortDetailsAr : item.shortDetails;

                              // Badge classes for premium category labels
                              let badgeClasses = '';
                              let badgeLabel = '';
                              if (isProduct) {
                                badgeClasses = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
                                badgeLabel = language === 'bn' ? 'প্রোডাক্ট 🛒' : 'Product 🛒';
                              } else if (isService) {
                                badgeClasses = 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20';
                                badgeLabel = language === 'bn' ? 'সার্ভিস 💼' : 'Service 💼';
                              } else if (isPackage) {
                                badgeClasses = 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20';
                                badgeLabel = language === 'bn' ? 'প্যাকেজ 📦' : 'Package 📦';
                              } else if (isBlog) {
                                badgeClasses = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20';
                                badgeLabel = language === 'bn' ? 'ব্লগ 📰' : 'Blog 📰';
                              }

                              return (
                                <div 
                                  key={`${item.type}-${item.id}`} 
                                  className="flex gap-3.5 items-start p-3 bg-[#F8FAFC]/70 dark:bg-[#111827]/40 border border-[#E2E8F0]/50 dark:border-white/5 hover:border-[#7C3AED]/30 dark:hover:border-[#7C3AED]/30 hover:bg-white dark:hover:bg-[#111827] rounded-[18px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/item"
                                >
                                  {/* Preview Thumbnail */}
                                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-[12px] border border-neutral-200/60 dark:border-white/10 bg-[#F8FAFC] dark:bg-slate-950 relative shadow-inner">
                                    <img
                                      src={item.image}
                                      alt={titleText}
                                      className="h-full w-full object-cover object-center group-hover/item:scale-110 duration-500 transition-all"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  {/* Item Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <span className={`inline-block px-1.5 py-0.5 text-[8.5px] font-bold rounded-md tracking-wider uppercase ${badgeClasses}`}>
                                        {badgeLabel}
                                      </span>
                                      
                                      {item.price !== undefined && (
                                        <div className="text-right shrink-0">
                                          {item.discountPrice && (
                                            <span className="text-[9.5px] text-neutral-400 line-through font-mono mr-1">
                                              {formatPriceInCart(item.price)}
                                            </span>
                                          )}
                                          <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-black text-xs">
                                            {formatPriceInCart(activePrice)}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <h3 
                                      className="line-clamp-2 text-xs font-bold text-neutral-800 dark:text-white hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition cursor-pointer leading-snug"
                                      onClick={() => {
                                        setWishlistOpen(false);
                                        if (isProduct) setCurrentPage('marketplace');
                                        else if (isService || isPackage) {
                                          localStorage.setItem('webzone_target_service_details_id', item.id);
                                          setCurrentPage('services');
                                        } else if (isBlog) {
                                          setCurrentPage('blog');
                                        }
                                      }}
                                    >
                                      {titleText}
                                    </h3>

                                    {/* Subtitle / desc */}
                                    {descText && (
                                      <p className="text-[9.5px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-1 leading-normal">
                                        {descText}
                                      </p>
                                    )}

                                    {/* Action row */}
                                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-dashed border-neutral-100 dark:border-white/5">
                                      {isProduct && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (addToCart) {
                                              addToCart(item.originalItem);
                                            } else {
                                              triggerToast('Added to Cart');
                                            }
                                          }}
                                          className="inline-flex items-center justify-center gap-1.5 h-[32px] px-3 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-bold rounded-[10px] text-[9.5px] uppercase tracking-wide hover:scale-105 active:scale-[0.98] duration-200 transition-all cursor-pointer shadow-sm shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40"
                                        >
                                          <ShoppingBag className="w-2.5 h-2.5 text-white" />
                                          <span>{language === 'bn' ? 'কিনুন 🛒' : 'Order Now 🛒'}</span>
                                        </button>
                                      )}

                                      {(isService || isPackage) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setWishlistOpen(false);
                                            localStorage.setItem('webzone_target_service_details_id', item.id);
                                            setCurrentPage('services');
                                          }}
                                          className="inline-flex items-center justify-center gap-1.5 h-[32px] px-3 bg-white dark:bg-[#111827] border border-neutral-200/80 dark:border-white/10 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 text-neutral-700 dark:text-neutral-300 hover:text-[#7C3AED] dark:hover:text-violet-400 dark:hover:border-[#7C3AED]/30 font-bold rounded-[10px] text-[9.5px] uppercase tracking-wide hover:scale-105 active:scale-[0.98] duration-200 transition-all cursor-pointer"
                                        >
                                          <Layers className="w-2.5 h-2.5 text-[#7C3AED] dark:text-[#A855F7]" />
                                          <span>{language === 'bn' ? 'সার্ভিস দেখুন' : 'Explore Service'}</span>
                                        </button>
                                      )}

                                      {isBlog && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setWishlistOpen(false);
                                            setCurrentPage('blog');
                                          }}
                                          className="inline-flex items-center justify-center gap-1.5 h-[32px] px-3 bg-white dark:bg-[#111827] border border-neutral-200/80 dark:border-white/10 hover:border-amber-500 hover:bg-amber-500/5 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 dark:hover:border-amber-500/30 font-bold rounded-[10px] text-[9.5px] uppercase tracking-wide hover:scale-105 active:scale-[0.98] duration-200 transition-all cursor-pointer"
                                        >
                                          <BookOpen className="w-2.5 h-2.5 text-amber-550" />
                                          <span>{language === 'bn' ? 'পড়ুন 📖' : 'Read Article 📖'}</span>
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (toggleWishlist) {
                                            toggleWishlist(item.id);
                                          } else {
                                            triggerToast('Removed from Wishlist');
                                          }
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-[10px] transition-all duration-200 cursor-pointer"
                                        title={language === 'bn' ? 'সরিয়ে ফেলুন' : 'Remove Item'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.2} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Footer Row */}
                      {wishlist.length > 0 && (
                        <div className="pt-4 border-t border-neutral-100 dark:border-white/8 mt-3">
                          <button
                            onClick={() => {
                              setWishlistOpen(false);
                              setCurrentPage('marketplace');
                            }}
                            className="w-full h-[46px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C3AED]/35 active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-[14px] cursor-pointer duration-200 transition-all flex items-center justify-center gap-2"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white text-white" />
                            <span>{language === 'bn' ? 'ডিজিটাল স্টোর এ আরও দেখুন' : 'Explore More Digital Scripts'}</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications bell icon & static alert panel */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl border transition cursor-pointer ${
                    notificationsOpen 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' 
                      : 'border-neutral-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="3 system notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-[8px] font-black leading-none text-white bg-blue-600 rounded-full">
                    3
                  </span>
                </button>
                
                {/* Notifications Panel Box */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 text-left space-y-3 font-sans text-xs"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">System Alerts</span>
                        <span className="text-[9px] bg-blue-105 text-blue-600 dark:text-cyan-455 font-bold px-1.5 py-0.5 rounded-lg font-mono">Realtime</span>
                      </div>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto w-full">
                        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg leading-relaxed">
                          <span className="font-extrabold text-[#06B6D4] block mb-0.5 font-mono">🔥 Hot VPS Promotion</span>
                          Dallas virtual servers currently with 50% discount. Migrate today!
                        </div>
                        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg leading-relaxed">
                          <span className="font-extrabold text-[#0284C7] block mb-0.5 font-mono">🛠️ Webzone Suite 12.5 Core</span>
                          Enterprise code modules optimized for peak database synchronization performance.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>



              {/* Cart Button */}
              <button 
                id="global-header-cart-btn"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-blue-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-slate-950 bg-cyan-400 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* AUTHENTICATED: Display profile menu toggle to open dropdown */}
              {user ? (
                <div className="relative hidden md:block pl-1.5 border-l border-neutral-200 dark:border-neutral-850" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{ minHeight: '44px' }}
                    className="flex items-center gap-2 p-0.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-108 active:scale-95 focus:outline-none relative group"
                  >
                    {/* Pulsing visual glow ring around avatar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] opacity-80 blur-[6px] group-hover:opacity-100 group-hover:blur-[10px] transition-all duration-300 pointer-events-none" />
                    
                    {/* Ring edge border animation element */}
                    <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                      <div className="relative w-8.5 h-8.5 rounded-full bg-white dark:bg-[#0F172A] p-[1px] flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt="Premium Customer avatar profile icon" 
                            className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="w-full h-full rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white font-black text-xs flex items-center justify-center uppercase">
                            {user.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Premium pulsing live connection indicator dot */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white dark:border-[#0B1120] flex items-center justify-center animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-80 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-50 overflow-hidden text-left font-sans transition-all duration-300"
                      >
                        {/* Premium Gradient Customer Header Card */}
                        <div className="p-4 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/[0.08]">
                          {/* Ambient background decoration */}
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/25 rounded-full blur-lg pointer-events-none" />

                          <div className="relative z-10 flex items-center gap-3 text-left">
                            <div className="relative shrink-0 group">
                              <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-sm group-hover:opacity-80 transition-all duration-300" />
                              <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-white/60 to-white/10">
                                <div className="relative rounded-full bg-slate-900/40 backdrop-blur-md p-[1px]">
                                  {user.avatar ? (
                                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover select-none border border-white/10" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black uppercase text-[11px] select-none border border-white/15">
                                      {user.name.slice(0, 2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#4F46E5] flex items-center justify-center shadow-sm">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-black text-white truncate tracking-tight">{user.name}</h4>
                              <p className="text-[10px] text-cyan-100/90 font-mono truncate mt-0.5">{user.email}</p>
                              <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 animate-pulse" id="header-desktop-superadmin-badge">
                                {user.role === 'super_admin' ? '👑 SYSTEM SUPER ADMIN' : 
                                 user.role === 'admin' ? '⚡ SYSTEM ADMIN' : 
                                 user.role === 'order_manager' ? '📦 ORDER OPERATIONS MANAGER' : 
                                 user.role === 'content_manager' ? '📝 CONTENT MANAGER' :
                                 user.role === 'support_staff' ? '🎫 SUPPORT STAFF' :
                                 user.role === 'editor' ? '✍️ EDITOR' :
                                 user.role === 'staff' ? '👨‍💼 STAFF' : '👑 PREMIUM CLIENT'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Scrollable Custom Navigation Items with individual aesthetic icons */}
                        <div className="p-2.5 max-h-96 overflow-y-auto space-y-1.5" id="profile-dropdown-menu-list">
                          {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'order_manager' || user.role === 'content_manager' || user.role === 'support_staff' || user.role === 'editor' || user.role === 'staff' || isAdmin) && (
                            <div className="pb-2 mb-1 border-b border-neutral-150 dark:border-slate-800">
                              <button
                                onClick={() => {
                                  if (currentPage === 'admin') {
                                    setCurrentPage('marketplace');
                                    triggerToast(language === 'bn' ? "প্রিমিয়াম ডিজিটাল স্টোরে ফেরত যাওয়া হয়েছে 💼" : "Switched back to Premium Digital Store 💼");
                                  } else {
                                    setCurrentPage('admin');
                                    triggerToast(language === 'bn' ? "সিস্টেম ডাটা এন্ট্রি ও এডমিন প্যানেলে প্রবেশ করা হয়েছে ⚙️" : "Switched to System Data Entry & Admin Panel ⚙️");
                                  }
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                                  currentPage === 'admin'
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-rose-600/30'
                                    : 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] hover:scale-[1.02] text-white border-transparent shadow-indigo-500/20 shadow-md'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 text-left">
                                  <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                                  <span>{currentPage === 'admin' ? "Switch to Store View" : "Store Admin Mode 🛠️"}</span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                              </button>
                            </div>
                          )}

                          {user.role === 'admin' || user.role === 'super_admin' || user.role === 'order_manager' || user.role === 'content_manager' || user.role === 'support_staff' || user.role === 'editor' || user.role === 'staff' || isAdmin ? (
                            // SUPER ADMIN / STAFF PROFILE MENU
                            [
                              { id: 'dashboard', label: '🏠 Super Admin Dashboard', labelBn: '🏠 সুপার এডমিন ড্যাশবোর্ড' },
                              { id: 'customers', label: '👥 Customers & Users', labelBn: '👥 গ্রাহক ও ইউজার কন্ট্রোল' },
                              { id: 'orders', label: '📦 Super Orders Hub', labelBn: '📦 অর্ডার প্রসেসিং হাব' },
                              { id: 'projects', label: '📂 Projects Kanban', labelBn: '📂 প্রজেক্ট কানবান বোর্ড' },
                              { id: 'support', label: '🎫 Support Tickets Feed', labelBn: '🎫 টিকেট হেল্পডেস্ক ফিড' },
                              { id: 'settings', label: '⚙️ Cloud System Settings', labelBn: '⚙️ ক্লাউড সিস্টেম সেটিংস' },
                              { id: 'client_workspace', label: '💼 Client Dashboard Workspace', labelBn: '💼 ক্লায়েন্ট ড্যাশবোর্ড ওয়ার্কস্পেস' }
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  if (item.id === 'client_workspace') {
                                    localStorage.setItem('webzone_dashboard_active_tab', 'dashboard');
                                    window.dispatchEvent(new Event('storage'));
                                    setCurrentPage('dashboard');
                                  } else {
                                    localStorage.setItem('webzone_admin_active_menu', item.id);
                                    setCurrentPage('admin');
                                  }
                                  setProfileDropdownOpen(false);
                                }}
                                style={{ minHeight: '38px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-neutral-100/30 dark:bg-white/[0.01] border border-neutral-200/40 dark:border-white/[0.04] hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-transparent hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span className="group-hover:scale-105 transition-transform duration-300">
                                    {language === 'bn' ? item.labelBn : item.label}
                                  </span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                              </button>
                            ))
                          ) : (
                            // STANDARD CUSTOMER ACCOUNT ZONE MENU
                            [
                              { id: 'dashboard', label: '👤 Dashboard', labelBn: '👤 ড্যাশবোর্ড' },
                              { id: 'my-orders', label: '📦 My Orders', labelBn: '📦 আমার অর্ডার' },
                              { id: 'my-wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                              { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                              { id: 'affiliate-program', label: '🤝 Affiliate Program', labelBn: '🤝 এফিলিয়েট প্রোগ্রাম' },
                              { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  localStorage.setItem('webzone_dashboard_active_tab', item.id);
                                  setCurrentPage('dashboard');
                                  setProfileDropdownOpen(false);
                                }}
                                style={{ minHeight: '38px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-neutral-100/30 dark:bg-white/[0.01] border border-neutral-200/40 dark:border-white/[0.04] hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-transparent hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span className="group-hover:scale-105 transition-transform duration-300">
                                    {language === 'bn' ? item.labelBn : item.label}
                                  </span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                              </button>
                            ))
                          )}
                        </div>

                        {/* Sign Out Section */}
                        <div className="p-2.5 border-t border-neutral-200/65 dark:border-slate-800/80 bg-neutral-50/60 dark:bg-[#0F172A]/40">
                          <button
                            onClick={() => {
                              onLogout();
                              setProfileDropdownOpen(false);
                            }}
                            style={{ minHeight: '40px' }}
                            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-black text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)] rounded-xl transition-all duration-300 cursor-pointer text-center active:scale-95 group"
                          >
                            <LogOut className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                            <span>🚪 Logout Client Portal</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2.5 font-sans relative" ref={guestDropdownRefDesktop}>
                  {/* Desktop Guest Man Icon Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setGuestDropdownOpenDesktop(!guestDropdownOpenDesktop)}
                      className="relative h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#4F46E5]/25 text-[#4F46E5] dark:text-[#06B6D4] hover:bg-gradient-to-tr hover:from-[#4F46E5] hover:to-[#06B6D4] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center pointer-events-auto shadow-sm hover:shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:scale-105"
                      aria-label="Quick Portal Gate"
                      title="Client Area"
                    >
                      <User className="h-4 w-4" />
                      {/* Status Indicator Dot */}
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950 animate-pulse" />
                    </button>

                    <AnimatePresence>
                      {guestDropdownOpenDesktop && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.95 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-3 w-72 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-50 overflow-hidden text-left font-sans transition-all duration-300"
                        >
                          {/* Short/Compact Header matching modern Sidebar layout */}
                          <div className="p-3.5 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/[0.08] text-left">
                            {/* Ambient Background decoration */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/20 rounded-full blur-md pointer-events-none" />

                            <div className="relative z-10 flex items-center gap-3">
                              {/* Guest Icon */}
                              <div className="relative shrink-0">
                                <div className="p-[2px] rounded-full bg-white/20 animate-pulse">
                                  <div className="w-8 h-8 rounded-full bg-slate-900/40 backdrop-blur-md text-white flex items-center justify-center font-bold border border-white/10">
                                    <User className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black text-white truncate tracking-tight">
                                  {language === 'bn' ? 'স্বাগতম ভিজিটর' : 'Welcome, Guest'}
                                </h4>
                                <p className="text-[9.5px] text-cyan-100/90 font-mono truncate mt-0.5">
                                  {language === 'bn' ? 'অ্যাক্সেস করতে লগইন করুন' : 'Login to view account'}
                                </p>
                                <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 animate-pulse">
                                  ✨ PORTAL ACTIVE
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Options List */}
                          <div className="p-2.5 py-2 space-y-1.5 bg-transparent">
                            {/* Option 1: Login */}
                            <button
                              onClick={() => {
                                onLoginClick('login');
                                setGuestDropdownOpenDesktop(false);
                              }}
                              style={{ minHeight: '44px' }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between group active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <span className="transition-transform group-hover:scale-115">🔐</span>
                                <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                            </button>

                            {/* Option 2: Register */}
                            <button
                              onClick={() => {
                                onLoginClick('register');
                                setGuestDropdownOpenDesktop(false);
                              }}
                              style={{ minHeight: '44px' }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between group active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <span className="transition-transform group-hover:scale-115">📝</span>
                                <span>{language === 'bn' ? 'নিবন্ধন করুন' : 'Register'}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Mobile Header Quick Actions Layout (Like Techbari.com) */}
              <div className="md:hidden flex items-center gap-1.5">


                {/* Secure Client Area trigger */}
                <div className="relative" ref={profileDropdownRefMobile}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setProfileDropdownOpenMobile(!profileDropdownOpenMobile)}
                        className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] p-[2px] transition-transform duration-300 hover:scale-108 active:scale-95 cursor-pointer flex items-center justify-center pointer-events-auto"
                      >
                        <div className="relative w-full h-full rounded-full bg-white dark:bg-[#0F172A] p-[1px] flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="Mobile User avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">
                              {user.name ? user.name.slice(0, 2) : 'CL'}
                            </span>
                          )}
                        </div>
                        {/* Status Indicator Dot */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-white dark:border-neutral-950 animate-pulse" />
                      </button>

                      <AnimatePresence>
                        {profileDropdownOpenMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={isLoggingOut ? { opacity: 0, y: 55, scale: 0.92 } : { opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: isLoggingOut ? 0.38 : 0.22, ease: "easeInOut" }}
                            className="absolute right-0 top-full mt-2 w-72 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-50 overflow-hidden text-left font-sans transition-all duration-300 animate-fade-in"
                          >
                            {/* Profile Info Header */}
                            <div className="p-3.5 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/[0.08] text-left">
                              {/* Ambient background decoration */}
                              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
                              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/25 rounded-full blur-lg pointer-events-none" />

                              <div className="relative z-10 flex items-center gap-3">
                                <div className="relative shrink-0 group">
                                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-sm group-hover:opacity-80 transition-all duration-300" />
                                  <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-white/60 to-white/10">
                                    <div className="relative rounded-full bg-slate-900/40 backdrop-blur-md p-[1px]">
                                      {user.avatar ? (
                                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover select-none border border-white/10" referrerPolicy="no-referrer" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black uppercase text-[11px] select-none border border-white/15">
                                          {user.name.slice(0, 2)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#4F46E5] flex items-center justify-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-black text-white truncate tracking-tight">{user.name}</h4>
                                  <p className="text-[10px] text-cyan-100/90 font-mono truncate mt-0.5">{user.email}</p>
                                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 animate-pulse" id="header-mobile-superadmin-badge">
                                    {(user.role === 'admin' || user.role === 'super_admin') ? '👑 SYSTEM SUPER ADMIN' : '👑 PREMIUM MEMBER'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dropdown Navigation Menu */}
                            <div className="p-2.5 py-2 max-h-80 overflow-y-auto space-y-1.5" id="profile-dropdown-menu-list-mobile">
                              {(user.role === 'admin' || isAdmin) && (
                                <div className="pb-1.5 mb-1 border-b border-neutral-100 dark:border-slate-800">
                                  <button
                                    onClick={() => {
                                      if (currentPage === 'admin') {
                                        setCurrentPage('marketplace');
                                        triggerToast(language === 'bn' ? "প্রিমিয়াম ডিজিটাল স্টোরে ফেরত যাওয়া হয়েছে 💼" : "Switched back to Premium Digital Store 💼");
                                      } else {
                                        setCurrentPage('admin');
                                        triggerToast(language === 'bn' ? "সিস্টেম ডাটা এন্ট্রি ও এডমিন প্যানেলে প্রবেশ করা হয়েছে ⚙️" : "Switched to System Data Entry & Admin Panel ⚙️");
                                      }
                                      setProfileDropdownOpenMobile(false);
                                    }}
                                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                                      currentPage === 'admin'
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-rose-600/20 shadow-sm'
                                        : 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] hover:scale-[1.02] text-white border-transparent shadow-indigo-500/20 shadow-md'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5 text-left">
                                      <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                                      <span>{currentPage === 'admin' ? "Switch to Store View" : "Store Admin Mode 🛠️"}</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                                  </button>
                                </div>
                              )}

                              {user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor' || isAdmin ? (
                                // SUPER ADMIN MOBILE OPTIONS
                                [
                                  { id: 'dashboard', label: '🏠 Super Admin Dashboard', labelBn: '🏠 সুপার এডমিন ড্যাশবোর্ড' },
                                  { id: 'customers', label: '👥 Customers & Users', labelBn: '👥 গ্রাহক ও ইউজার কন্ট্রোল' },
                                  { id: 'orders', label: '📦 Super Orders Hub', labelBn: '📦 অর্ডার প্রসেসিং হাব' },
                                  { id: 'projects', label: '📂 Projects Kanban', labelBn: '📂 প্রজেক্ট কানবান বোর্ড' },
                                  { id: 'support', label: '🎫 Support Tickets Feed', labelBn: '🎫 টিকেট হেল্পডেস্ক ফিড' },
                                  { id: 'settings', label: '⚙️ Cloud System Settings', labelBn: '⚙️ ক্লাউড সিস্টেম সেটিংস' },
                                  { id: 'client_workspace', label: '💼 Client Dashboard Workspace', labelBn: '💼 ক্লায়েন্ট ড্যাশবোর্ড ওয়ার্কস্পেস' }
                                ].map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      if (item.id === 'client_workspace') {
                                        localStorage.setItem('webzone_dashboard_active_tab', 'dashboard');
                                        window.dispatchEvent(new Event('storage'));
                                        setCurrentPage('dashboard');
                                      } else {
                                        localStorage.setItem('webzone_admin_active_menu', item.id);
                                        setCurrentPage('admin');
                                      }
                                      setProfileDropdownOpenMobile(false);
                                    }}
                                    style={{ minHeight: '38px' }}
                                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-neutral-100/30 dark:bg-white/[0.01] border border-neutral-200/40 dark:border-white/[0.04] hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-transparent hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                                  >
                                    <span>{language === 'bn' ? item.labelBn : item.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                                  </button>
                                ))
                              ) : (
                                // STANDARD CLIENT MOBILE OPTIONS
                                [
                                  { id: 'dashboard', label: '👤 Dashboard', labelBn: '👤 ড্যাশবোর্ড' },
                                  { id: 'my-orders', label: '📦 My Orders', labelBn: '📦 আমার অর্ডার' },
                                  { id: 'my-wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                                  { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                                  { id: 'affiliate-program', label: '🤝 Affiliate Program', labelBn: '🤝 এফিলিয়েট প্রোগ্রাম' },
                                  { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                                ].map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      localStorage.setItem('webzone_dashboard_active_tab', item.id);
                                      setCurrentPage('dashboard');
                                      setProfileDropdownOpenMobile(false);
                                    }}
                                    style={{ minHeight: '38px' }}
                                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-neutral-100/30 dark:bg-white/[0.01] border border-neutral-200/40 dark:border-white/[0.04] hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-transparent hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                                  >
                                    <span>{language === 'bn' ? item.labelBn : item.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                                  </button>
                                ))
                              )}
                            </div>

                            {/* Sign Out Section */}
                            <div className="p-2.5 border-t border-neutral-200/65 dark:border-slate-800/80 bg-neutral-50/60 dark:bg-[#0F172A]/40">
                              <button
                                onClick={() => {
                                  setIsLoggingOut(true);
                                  setTimeout(() => {
                                    onLogout();
                                    setProfileDropdownOpenMobile(false);
                                    setIsLoggingOut(false);
                                  }, 400);
                                }}
                                style={{ minHeight: '40px' }}
                                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-black text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)] rounded-xl transition-all duration-300 cursor-pointer text-center active:scale-95 group"
                              >
                                <LogOut className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                                <span>{language === 'bn' ? 'লগআউট করুন 🚪' : 'Logout Portal 🚪'}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setProfileDropdownOpenMobile(!profileDropdownOpenMobile)}
                        className="relative h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#4F46E5]/25 text-[#4F46E5] dark:text-[#06B6D4] hover:bg-gradient-to-tr hover:from-[#4F46E5] hover:to-[#06B6D4] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center pointer-events-auto shadow-sm hover:shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:scale-105"
                        aria-label="Quick Portal Gate"
                        title="Client Area"
                      >
                        <User className="h-4 w-4" />
                        {/* Status Indicator Dot */}
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950 animate-pulse" />
                      </button>

                      <AnimatePresence>
                        {profileDropdownOpenMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-2 w-72 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-50 overflow-hidden text-left font-sans transition-all duration-300"
                          >
                            {/* Short/Compact Header matching modern Sidebar layout */}
                            <div className="p-3.5 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/[0.08] text-left">
                              {/* Ambient Background decoration */}
                              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/20 rounded-full blur-md pointer-events-none" />

                              <div className="relative z-10 flex items-center gap-3">
                                {/* Guest Icon */}
                                <div className="relative shrink-0">
                                  <div className="p-[2px] rounded-full bg-white/20 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-slate-900/40 backdrop-blur-md text-white flex items-center justify-center font-bold border border-white/10">
                                      <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-black text-white truncate tracking-tight">
                                    {language === 'bn' ? 'স্বাগতম ভিজিটর' : 'Welcome, Guest'}
                                  </h4>
                                  <p className="text-[9.5px] text-cyan-100/90 font-mono truncate mt-0.5">
                                    {language === 'bn' ? 'অ্যাক্সেস করতে লগইন করুন' : 'Login to view account'}
                                  </p>
                                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 animate-pulse">
                                    ✨ PORTAL ACTIVE
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dropdown Options List */}
                            <div className="p-2.5 py-2 space-y-1.5 bg-transparent">
                              {/* Option 1: Login */}
                              <button
                                onClick={() => {
                                  onLoginClick('login');
                                  setProfileDropdownOpenMobile(false);
                                }}
                                style={{ minHeight: '44px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between group active:scale-95"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="transition-transform group-hover:scale-115">🔐</span>
                                  <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                              </button>

                              {/* Option 2: Register */}
                              <button
                                onClick={() => {
                                  onLoginClick('register');
                                  setProfileDropdownOpenMobile(false);
                                }}
                                style={{ minHeight: '44px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between group active:scale-95"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="transition-transform group-hover:scale-115">📝</span>
                                  <span>{language === 'bn' ? 'নিবন্ধন করুন' : 'Register'}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Mobile hamburger menu toggle */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-650 dark:text-cyan-400 rounded-xl border border-indigo-100/30 dark:border-indigo-900/15 focus:outline-none transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center group"
                  aria-label="Open Mobile Menu"
                >
                  {/* Premium Asymmetrical Interactive Mini Hamburger Indicator */}
                  <div className="flex flex-col gap-1 w-5 h-5 justify-center items-center">
                    <span className="w-5 h-0.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 group-hover:w-3.5" />
                    <span className="w-3.5 h-0.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 dark:from-cyan-300 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 mr-auto group-hover:w-5" />
                    <span className="w-4.5 h-0.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 mr-auto" />
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>

      </header>



      {/* Premium Sliding-from-Left Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-sidebar-system">
            {/* Dark background glass-overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity cursor-pointer duration-300"
            />

            {/* Sliding Drawer element (Width: 85% Screen Width) with Premium Glassmorphism & Light/Dark Theme Adaptability */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className={`relative w-[85%] max-w-[340px] h-full transition-colors duration-500 flex flex-col border-r overflow-hidden backdrop-blur-2xl ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-slate-50/98 via-purple-50/90 to-cyan-50/80 text-slate-900 border-purple-200/80 shadow-[25px_0_60px_rgba(79,70,229,0.35)]'
                  : 'bg-gradient-to-b from-[#181a27]/98 via-[#13151f]/98 to-[#0d0f17]/98 text-slate-100 border-slate-800/80 shadow-[25px_0_60px_rgba(0,0,0,0.65)]'
              }`}
            >
              {/* Soft Animated Background Effects for Mobile Drawer (Active in Light Mode) */}
              {theme === 'light' && (
                <>
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.25, 1],
                      x: [0, 25, 0],
                      y: [0, -20, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none z-0 bg-gradient-to-r from-purple-300/50 via-indigo-200/40 to-cyan-300/40 blur-[85px]" 
                  />

                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1],
                      x: [0, -30, 0],
                      y: [0, 25, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="absolute top-1/3 -right-20 w-72 h-72 rounded-full pointer-events-none z-0 bg-gradient-to-r from-pink-300/45 via-rose-200/40 to-purple-300/40 blur-[90px]" 
                  />

                  <motion.div 
                    animate={{ 
                      scale: [0.9, 1.25, 0.9],
                      x: [0, 20, 0],
                      y: [0, -25, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                    className="absolute -bottom-12 -left-16 w-72 h-72 rounded-full pointer-events-none z-0 bg-gradient-to-r from-cyan-300/45 via-teal-200/40 to-blue-300/40 blur-[85px]" 
                  />

                  {/* Ambient Radial Light Beam Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/35 via-transparent to-transparent pointer-events-none z-0" />
                </>
              )}

              {/* Soft Ambient Glow & Gradient Top for Mobile Drawer in Dark Mode */}
              {theme === 'dark' && (
                <>
                  <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-500/12 via-purple-500/6 to-transparent pointer-events-none z-0" />
                  <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-[55px] pointer-events-none z-0" />
                  <div className="absolute top-12 -right-10 w-48 h-48 rounded-full bg-purple-500/8 blur-[55px] pointer-events-none z-0" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent pointer-events-none z-0" />
                </>
              )}

              {/* Top Row: Logo & Close Toggle */}
              <div className="p-4 border-b border-purple-200/60 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between relative z-10">
                <div 
                  className="flex items-center space-x-1.5 cursor-pointer"
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="p-1 px-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:bg-gradient-to-r dark:from-indigo-500/20 dark:to-purple-500/20 dark:text-indigo-300 dark:border dark:border-indigo-500/30 rounded-lg font-black shadow-md">
                    <Globe className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black tracking-tight text-slate-900 dark:text-slate-100">
                      WebzoneBD
                    </span>
                    <span className="text-[6.5px] uppercase tracking-wider font-mono text-purple-600 dark:text-indigo-300/90 font-black">
                      IT Solution
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300/60 dark:border-slate-700/60 transition duration-300 cursor-pointer hover:scale-105"
                  aria-label="Close Sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sidebar Header Block with Client Profile Onboarding */}
              <div className="p-4 border-b border-purple-200/60 dark:border-slate-800/70 bg-purple-50/40 dark:bg-gradient-to-b dark:from-slate-900/50 dark:via-slate-900/25 dark:to-transparent flex flex-col gap-3 relative z-10">
                {/* 2. Client Profile / Onboarding Block */}
                <div>
                  {user ? (
                    <div className="p-3 bg-white/90 dark:bg-slate-800/60 border border-purple-200/80 dark:border-slate-700/50 rounded-2xl shadow-lg shadow-purple-100/50 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)] space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="Profile" 
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-400 dark:ring-indigo-400/40"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-indigo-600 dark:to-purple-700 text-white font-black flex items-center justify-center text-sm uppercase shadow-sm">
                              {user.name.slice(0, 2)}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate leading-tight">{user.name}</p>
                          <p className="text-[9px] font-mono text-purple-600 dark:text-indigo-300 uppercase tracking-widest mt-0.5 font-bold flex items-center gap-1">
                            <span>👑</span>
                            <span>{user.role === 'super_admin' ? 'SYSTEM SUPER ADMIN' :
                                   user.role === 'admin' ? 'SYSTEM ADMIN' :
                                   user.role === 'order_manager' ? 'ORDER OPERATIONS MANAGER' :
                                   user.role === 'content_manager' ? 'CONTENT MANAGER' :
                                   user.role === 'support_staff' ? 'SUPPORT STAFF' :
                                   user.role === 'editor' ? 'EDITOR' :
                                   user.role === 'staff' ? 'STAFF' : 'PREMIUM MEMBER'}</span>
                          </p>
                        </div>
                      </div>

                       <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-purple-100 dark:border-slate-700/50">
                        <button
                          onClick={() => {
                            if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'order_manager' || user.role === 'content_manager' || user.role === 'support_staff' || user.role === 'editor' || user.role === 'staff') {
                              setCurrentPage('admin');
                            } else {
                              localStorage.setItem('webzone_dashboard_active_tab', 'profile');
                              setCurrentPage('dashboard');
                            }
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-3 bg-purple-100 hover:bg-purple-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-purple-950 dark:text-slate-200 text-[10px] font-extrabold rounded-xl cursor-pointer text-center transition duration-300 border border-purple-200 dark:border-slate-700/60 hover:scale-[1.03] shadow-sm"
                        >
                          {language === 'bn' ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}
                        </button>
                        <button
                          onClick={() => {
                            if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'order_manager' || user.role === 'content_manager' || user.role === 'support_staff' || user.role === 'editor' || user.role === 'staff') {
                              setCurrentPage('admin');
                            } else {
                              localStorage.setItem('webzone_dashboard_active_tab', 'wallet-funds');
                              setCurrentPage('dashboard');
                            }
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 dark:text-white text-[10px] font-extrabold rounded-xl cursor-pointer text-center shadow-md shadow-purple-200/50 dark:shadow-indigo-950/30 border dark:border-indigo-400/30 transition duration-300 hover:scale-[1.03]"
                        >
                          {language === 'bn' ? 'প্যানেল ড্যাশবোর্ড' : 'Panel Dashboard'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/90 dark:bg-slate-800/60 border border-purple-200/80 dark:border-slate-700/50 rounded-2xl text-left space-y-2.5 shadow-lg shadow-purple-100/50 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-black text-purple-700 dark:text-indigo-300 tracking-wider">
                          {language === 'bn' ? 'কাস্টমার জোন' : 'Client Hub Portal'}
                        </span>
                        <span className="bg-purple-100 text-purple-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[8px] font-black uppercase rounded px-1.5 py-0.5 border border-purple-200 dark:border-indigo-500/20">
                          SECURE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onLoginClick('login');
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 dark:text-white dark:border dark:border-indigo-400/30 font-black text-[11px] rounded-xl shadow-md transition duration-300 hover:scale-[1.03] cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
                        </button>
                        <button
                          onClick={() => {
                            onLoginClick('register');
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-2 border border-purple-300 dark:border-slate-700/60 bg-transparent hover:bg-purple-50 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-purple-950 dark:text-slate-200 text-[11px] font-bold rounded-xl cursor-pointer text-center transition duration-300 hover:scale-[1.03]"
                        >
                          {language === 'bn' ? 'নিবন্ধন' : 'Register'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-left dynamic-sidebar-scroller bg-transparent text-slate-900 dark:text-slate-100 relative z-10">
                {/* Standard Links & Custom Dropdowns */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-400 font-mono font-bold block px-2 mb-2">Webzone Navigator</span>

                  {/* Home */}
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'home'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${currentPage === 'home' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                    <span>Home</span>
                  </button>

                  {/* Marketplace Direct Nav Link without category submenu */}
                  <button
                    onClick={() => {
                      if (setSearchTerm) {
                        setSearchTerm('');
                      }
                      localStorage.removeItem('webzone_target_marketplace_search_keyword_cache');
                      window.dispatchEvent(new Event('storage'));
                      setCurrentPage('marketplace');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'marketplace'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${currentPage === 'marketplace' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                    <span>{language === 'bn' ? 'ডিজিটাল স্টোর' : language === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}</span>
                  </button>

                  {/* Combo Offers - Early Top Menu Placement */}
                  <button
                    onClick={() => {
                      setCurrentPage('offers');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'offers'
                        ? 'bg-rose-500 text-white font-extrabold shadow-lg'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-white hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20'
                    }`}
                  >
                    <span className="text-sm animate-pulse">🔥</span>
                    <span>{language === 'bn' ? "কম্বো অফার্স" : language === 'ar' ? "عروض الكومبو" : "Combo Offers"}</span>
                  </button>

                  {/* Hosting Accordion expandable */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleAccordion('hosting')}
                      className={`flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                        currentPage === 'hosting' || expandedAccordion === 'hosting' 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-black shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30' 
                          : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Database className={`w-4 h-4 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                        <span>{language === 'bn' ? 'হোস্টিং এবং ডোমেন' : language === 'ar' ? 'الاستضافة والنطاقات' : 'Hosting & Domains'}</span>
                      </span>
                      {expandedAccordion === 'hosting' ? (
                        <ChevronUp className={`w-3.5 h-3.5 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      ) : (
                        <ChevronDown className={`w-3.5 h-3.5 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === 'hosting' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 pr-3 space-y-1 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setCurrentPage('domain');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-slate-600 hover:text-purple-700 border-l border-purple-200 hover:border-purple-600 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:border-indigo-400 pl-3 font-semibold transition duration-300 hover:scale-[1.02] cursor-pointer"
                          >
                            {language === 'bn' ? 'ডোমেন রেজিস্ট্রেশন' : 'Domain Registration'}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'bdix');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-slate-600 hover:text-purple-700 border-l border-purple-200 hover:border-purple-600 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:border-indigo-400 pl-3 font-semibold transition duration-300 hover:scale-[1.02] cursor-pointer"
                          >
                            {t.hostingShared}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'vps');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-slate-600 hover:text-purple-700 border-l border-purple-200 hover:border-purple-600 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:border-indigo-400 pl-3 font-semibold transition duration-300 hover:scale-[1.02] cursor-pointer"
                          >
                            {t.hostingVps}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'reseller');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-slate-600 hover:text-purple-700 border-l border-purple-200 hover:border-purple-600 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:border-indigo-400 pl-3 font-semibold transition duration-300 hover:scale-[1.02] cursor-pointer"
                          >
                            {t.hostingReseller}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Services - Direct Button Link with Expandable Sub-options */}
                  <div className="space-y-1 bg-purple-50/60 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-purple-200/80 dark:border-slate-700/50 shadow-inner">
                    <button
                      onClick={() => {
                        localStorage.setItem('webzone_target_services_tab', 'all');
                        localStorage.removeItem('webzone_services_filter_keyword');
                        window.dispatchEvent(new Event('storage'));
                        setCurrentPage('services');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                        currentPage === 'services'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                          : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Laptop className={`w-4 h-4 ${currentPage === 'services' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                      <span>{t.services}</span>
                    </button>
                    <div className="pl-6 pt-1.5 pb-2.5 flex flex-col gap-2.5 text-[11px] font-black text-slate-700 dark:text-slate-300">
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'digital-web-dev');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-semibold hover:text-purple-700 dark:hover:text-white transition duration-300 flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                      >
                        <span>🚀</span>
                        <span>{language === 'bn' ? 'ডিজিটাল ওয়েব ডেভেলপমেন্ট' : 'Digital Web Development'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'google-business');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-semibold hover:text-purple-700 dark:hover:text-white transition duration-300 flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                      >
                        <span>📍</span>
                        <span>{language === 'bn' ? 'গুগল মাই বিজনেস সেটআপ' : 'Google Business Setup'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'growth-package');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-semibold hover:text-purple-700 dark:hover:text-white transition duration-300 flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                      >
                        <span>📈</span>
                        <span>{language === 'bn' ? 'বিজনেস গ্রোথ প্যাকেজ' : 'Business Growth Package'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Solutions Accordion expandable */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleAccordion('solutions')}
                      className={`flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                        currentPage === 'solutions' || expandedAccordion === 'solutions'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-black shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                          : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Layers className={`w-4 h-4 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                        <span>Solutions</span>
                      </span>
                      {expandedAccordion === 'solutions' ? (
                        <ChevronUp className={`w-3.5 h-3.5 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      ) : (
                        <ChevronDown className={`w-3.5 h-3.5 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === 'solutions' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 pr-3 space-y-1 overflow-hidden"
                        >
                          {solutionsList.map((sol, index) => (
                            <button
                              key={index}
                              onClick={() => handleMobileSubitemClick(sol, 'solution')}
                              className="block w-full text-left py-2 px-2 text-[11px] text-slate-600 hover:text-purple-700 border-l border-purple-200 hover:border-purple-600 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:border-indigo-400 pl-3 font-semibold transition duration-300 hover:scale-[1.02] cursor-pointer"
                            >
                              {sol.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Portfolio */}
                  <button
                    onClick={() => {
                      setCurrentPage('portfolio');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'portfolio'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Briefcase className={`w-4 h-4 ${currentPage === 'portfolio' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                    <span>Portfolio</span>
                  </button>

                  {/* Blog */}
                  <button
                    onClick={() => {
                      setCurrentPage('blog');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'blog'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 ${currentPage === 'blog' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                    <span>Blog</span>
                  </button>

                  {/* Affiliate */}
                  <button
                    onClick={() => {
                      setCurrentPage('affiliate');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'affiliate'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Coins className={`w-4 h-4 ${currentPage === 'affiliate' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'} animate-pulse`} />
                    <span>{language === 'bn' ? "অ্যাফিলিয়েট প্রোগ্রাম" : language === 'ar' ? "التسويق بالعمولة" : "Affiliate Program"}</span>
                  </button>

                  {/* Contact */}
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                      currentPage === 'contact'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20 dark:shadow-indigo-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Mail className={`w-4 h-4 ${currentPage === 'contact' ? 'text-white' : 'text-purple-600 dark:text-indigo-400'}`} />
                    <span>Contact</span>
                  </button>
                </div>

                {/* Hosting & Domain - Separate Highlights Block */}
                <div className="pt-2">
                  <div className="p-3 bg-white/90 dark:bg-slate-800/60 border border-purple-200/80 dark:border-slate-700/50 rounded-2xl space-y-2.5 shadow-lg shadow-purple-100/50 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-purple-600 dark:text-indigo-400" />
                        <span>Hosting & domains</span>
                      </span>
                      <span className="bg-purple-100 text-purple-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[8px] font-black uppercase rounded-lg px-1.5 py-0.5 tracking-wider border border-purple-200 dark:border-indigo-500/20">Secure Hosting</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {hostingDomainList.map((hst, index) => (
                        <button
                          key={index}
                          onClick={() => handleMobileSubitemClick(hst, 'hosting')}
                          className="py-1.5 px-2 bg-purple-50/80 hover:bg-purple-100/90 text-slate-800 border-purple-200/80 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700/50 dark:hover:bg-slate-800 dark:hover:border-slate-600 rounded-lg text-[9.5px] font-bold border transition-all duration-300 text-left truncate block cursor-pointer hover:scale-[1.02]"
                        >
                          {hst.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Theme Switching section within drawer */}
                <div className="pt-2 border-t border-purple-200/60 dark:border-slate-800/70">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2 font-mono font-bold px-1 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-purple-600 dark:text-indigo-400" />
                    <span>Theme settings</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 font-sans text-[10px] font-extrabold">
                    <button 
                      onClick={(e) => setTheme('light', e)}
                      className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 hover:scale-[1.02] ${
                        theme === 'light' 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-md shadow-purple-500/20' 
                          : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <span className="text-[11px]">☀</span>
                      <span>Light Mode</span>
                    </button>
                    <button 
                      onClick={(e) => setTheme('dark', e)}
                      className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 hover:scale-[1.02] ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white font-black shadow-md shadow-purple-500/20 dark:shadow-indigo-900/30' 
                          : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <span className="text-[11px]">🌙</span>
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Company Contact & Social Footer */}
                <div className="pt-3 border-t border-purple-200/60 dark:border-slate-800/70 space-y-2.5 text-slate-500 dark:text-slate-400 text-[10px]">
                  {/* Social Icons links block */}
                  <div className="flex items-center gap-3 pt-1">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-2 bg-slate-100 hover:bg-[#1877F2] text-slate-700 hover:text-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-[#1877F2] dark:hover:text-white rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 border border-slate-200 dark:border-slate-700/60"
                      aria-label="Facebook Profile Link"
                    >
                      <Facebook className="w-4 h-4 shrink-0" />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-2 bg-slate-100 hover:bg-[#0A66C2] text-slate-700 hover:text-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-[#0A66C2] dark:hover:text-white rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 border border-slate-200 dark:border-slate-700/60"
                      aria-label="LinkedIn Profile Link"
                    >
                      <Linkedin className="w-4 h-4 shrink-0" />
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-2 bg-slate-100 hover:bg-[#FF0000] text-slate-700 hover:text-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-[#FF0000] dark:hover:text-white rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 border border-slate-200 dark:border-slate-700/60"
                      aria-label="YouTube Profile Link"
                    >
                      <Youtube className="w-4 h-4 shrink-0" />
                    </a>
                  </div>

                  <p className="text-[8px] text-slate-400 dark:text-slate-400 pt-2 text-center border-t border-purple-200/60 dark:border-slate-800/70 leading-normal">
                    © {new Date().getFullYear()} WebzoneBD IT Solution. All codes clean validated secures.
                  </p>
                </div>

              </div>

              {/* Pin-to-Bottom Secure Admin Panel Login System Bar */}
              <div className="hidden"></div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swipe Popup / Drawer for Sign In & Register */}
      <AnimatePresence>
        {authDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="auth-swipe-drawer-wrapper">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAuthDrawerOpen(false);
                setAuthDrawerError('');
                setAuthDrawerSuccess('');
              }}
              className="absolute inset-0 bg-neutral-950/65 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="relative w-full max-w-sm h-full bg-white dark:bg-neutral-950 border-l border-neutral-200/80 dark:border-neutral-850 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {user ? (
                <div className="space-y-6 text-left h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Drawer Header with Close Button */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-850">
                      <span className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">🛡️ SECURE VIP PROFILE</span>
                      <button
                        onClick={() => {
                          setAuthDrawerOpen(false);
                          setAuthDrawerError('');
                          setAuthDrawerSuccess('');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-350 cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Top Area: Circular Profile Photo, Name, Email, & Verification Badge */}
                    <div className="relative rounded-2xl overflow-hidden p-5 text-center border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-neutral-900/60 shadow-md">
                      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-r from-blue-600 to-purple-650 opacity-[0.14] z-0" />
                      
                      <div className="relative z-10 space-y-2">
                        {/* Avatar */}
                        <div className="relative inline-block mt-2">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="user profile photo representation avatar" 
                              className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500 mx-auto animate-in fade-in"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-slate-100 flex items-center justify-center font-black text-xl uppercase shadow-md mx-auto">
                              {user.name.slice(0, 2)}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111827] flex items-center justify-center" />
                        </div>

                        {/* Name & Email */}
                        <div className="pt-1">
                          <h4 className="text-sm font-black text-neutral-900 dark:text-white capitalize truncate px-1">{user.name}</h4>
                          <p className="text-[10px] text-neutral-550 dark:text-neutral-400 font-mono mt-0.5 truncate px-1">{user.email}</p>
                        </div>

                        {/* Verification status */}
                        <div className="inline-flex items-center gap-1 bg-emerald-505 bg-emerald-500/15 text-[#10B981] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verification Badge
                        </div>
                      </div>
                    </div>

                    {/* Quick Menu */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-neutral-400 font-bold block uppercase tracking-wider mb-2">QUICK CONTROLS GATE</span>
                      
                      {[
                        { id: 'dashboard', label: '🏠 Dashboard', labelBn: '🏠 ড্যাশবোর্ড' },
                        { id: 'purchases', label: '📦 My Order', labelBn: '📦 My Order (আমার অর্ডার)' },
                        { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                        { id: 'wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                        { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', item.id);
                            setCurrentPage('dashboard');
                            setAuthDrawerOpen(false);
                          }}
                          style={{ minHeight: '48px' }}
                          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-slate-900 border border-transparent hover:border-neutral-200 dark:hover:border-slate-800 transition-all duration-150 cursor-pointer text-left font-sans"
                        >
                          <span>{language === 'bn' ? item.labelBn : item.label}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Trigger at bottom */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
                    <button
                      onClick={() => {
                        onLogout();
                        setAuthDrawerOpen(false);
                      }}
                      style={{ minHeight: '48px' }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 bg-red-500/10 hover:bg-red-500/15 text-[#EF4444] rounded-xl text-xs font-black transition cursor-pointer text-left font-sans"
                    >
                      <LogOut className="w-4 h-4 shrink-0 text-[#EF4444]" />
                      <span>🚪 Logout Secure Area</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl relative">
                        <User className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                          {drawerAuthView === 'login' ? (language === 'bn' ? 'সাইন ইন করুন' : language === 'ar' ? 'تسجيل الدخول الموحد' : 'Secure Client Login') :
                           drawerAuthView === 'register' ? (language === 'bn' ? 'নতুন অ্যাকাউন্ট' : language === 'ar' ? 'إنشاء حساب عميل' : 'Client Registration') :
                           drawerAuthView === 'forgot' ? (language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : language === 'ar' ? 'استعادة كلمة السر' : 'Reset Credentials') :
                           drawerAuthView === 'otp' ? (language === 'bn' ? 'ওটিপি ভেরিফিকেশন' : language === 'ar' ? 'رمز التحقق الثنائي' : 'OTP 2FA Verification') :
                           (language === 'bn' ? 'নতুন পাসওয়ার্ড' : language === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Reset Password')}
                        </h3>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                          WEBZONEBD SECURE SSL • AES_256
                        </p>
                      </div>
                    </div>
                  <button
                    onClick={() => {
                      setAuthDrawerOpen(false);
                      setAuthDrawerError('');
                      setAuthDrawerSuccess('');
                    }}
                    className="p-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-mono font-bold text-neutral-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Panels (Errors or Success alerts) */}
                {authDrawerError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left text-xs font-semibold text-red-500 leading-snug">
                    ⚠️ {authDrawerError}
                  </div>
                )}
                {authDrawerSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-snug">
                    ✓ {authDrawerSuccess}
                  </div>
                )}

                {/* MAIN FORMS CONTENT SCROLLABLE AREA */}
                <div className="space-y-4">
                  
                  {/* VIEW 1: LOGIN FORM */}
                  {drawerAuthView === 'login' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-mono">
                          Client Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="e.g. client@webzonebd.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold font-sans text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-mono">
                            Account Password
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('forgot');
                            }}
                            className="text-[10px] text-teal-500 dark:text-cyan-400 hover:underline font-bold font-mono"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custPass}
                            onChange={(e) => setCustPass(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold font-sans text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custEmail || !custPass) {
                              setAuthDrawerError("Complete all credentials fields before submitting validation handshake.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');
                            
                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              // Validate Credentials
                              if (custEmail === 'client@webzonebd.com' && custPass === 'client123') {
                                setAuthDrawerSuccess("Credentials authorized! Decrypting user session keys.");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess({
                                    id: 'usr-client',
                                    name: 'WebzoneBD Client',
                                    username: 'client_partner',
                                    email: 'client@webzonebd.com',
                                    phone: '+8801712345678',
                                    role: 'customer',
                                    isVerified: true,
                                    createdAt: '2026-06-01',
                                    status: 'active',
                                    wishlistedProductIds: []
                                  });
                                }
                              } else if (tempRegUser && custEmail === tempRegUser.email && custPass === custPassConfirm) {
                                setAuthDrawerSuccess("Registered credentials authorized! Decrypting user session keys.");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess(tempRegUser);
                                }
                              } else {
                                setAuthDrawerError("Bad Credentials handshake. Verify inputs (Username: client@webzonebd.com • Password: client123).");
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {authDrawerLoading ? (
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <LogIn className="w-4 h-4" />
                          )}
                          <span>Sign In to Account</span>
                        </button>
                      </div>

                      <div className="text-center pt-1.5">
                        <span className="text-[10px] text-neutral-400">
                          New to WebzoneBD?{' '}
                          <button
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('register');
                            }}
                            className="text-emerald-500 font-extrabold hover:underline"
                          >
                            Create Account
                          </button>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: REGISTER FORM */}
                  {drawerAuthView === 'register' && (() => {
                    // Internal evaluation values
                    const fullNameError = (() => {
                      if (!custFullNameTouched) return '';
                      const sanitized = custFullName.replace(/<[^>]*>?/gm, '').replace(/\s{2,}/g, ' ');
                      if (!sanitized || sanitized.trim() === '') return 'Full Name is required.';
                      if (sanitized.length < 2) return 'Full Name must be at least 2 characters.';
                      if (sanitized.length > 100) return 'Full Name must be at most 100 characters.';
                      if (!/^[A-Za-z\s]+$/.test(sanitized)) return 'Full Name must contain letters and spaces only.';
                      return '';
                    })();

                    const emailError = (() => {
                      if (!custEmailTouched) return '';
                      if (!custEmail) return 'Email Address is required.';
                      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                      if (!emailRegex.test(custEmail)) return 'Please enter a valid email address.';
                      return '';
                    })();

                    const phoneError = (() => {
                      if (!custPhoneTouched) return '';
                      if (!custPhone) return 'Phone Number is required.';
                      if (!/^\+?[0-9]+$/.test(custPhone)) return 'Please enter a valid phone number.';
                      const digitsOnly = custPhone.replace(/[^\d]/g, '');
                      if (digitsOnly.length < 8 || digitsOnly.length > 15) {
                        return 'Please enter a valid phone number.';
                      }
                      return '';
                    })();

                    const passError = (() => {
                      if (!custPassTouched) return '';
                      if (!custPass) return 'Password is required.';
                      if (custPass.length < 8) return 'Password must be at least 8 characters.';
                      if (!/[A-Z]/.test(custPass)) return 'Password must contain at least one uppercase letter.';
                      if (!/[a-z]/.test(custPass)) return 'Password must contain at least one lowercase letter.';
                      if (!/[0-9]/.test(custPass)) return 'Password must contain at least one number.';
                      if (!/[^A-Za-z0-9]/.test(custPass)) return 'Password must contain at least one special character.';
                      return '';
                    })();

                    const passConfirmError = (() => {
                      if (!custPassConfirmTouched) return '';
                      if (!custPassConfirm) return 'Confirm Password is required.';
                      if (custPassConfirm !== custPass) return 'Passwords do not match.';
                      return '';
                    })();

                    const strength = getPasswordStrength(custPass);
                    const barColor = strength === 'Weak' ? 'bg-red-500' : strength === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500';
                    const barWidth = strength === 'Weak' ? 'w-1/3' : strength === 'Medium' ? 'w-2/3' : 'w-full';

                    return (
                      <div className="space-y-3.5 text-left animate-in duration-200 slide-in-from-right-3">
                        {/* FULL NAME */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Client Full Name</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              placeholder="e.g. Asif Rahman"
                              value={custFullName}
                              onChange={(e) => {
                                // Strip HTML/Script tags and collapse excessive spaces
                                const cleaned = e.target.value.replace(/<[^>]*>?/gm, '').replace(/\s{2,}/g, ' ');
                                setCustFullName(cleaned);
                                setCustFullNameTouched(true);
                              }}
                              onBlur={() => setCustFullNameTouched(true)}
                              className={`w-full bg-neutral-50 dark:bg-neutral-900 border p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:outline-none ${
                                fullNameError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                          {fullNameError && (
                            <p className="text-[10px] text-red-500 font-semibold">{fullNameError}</p>
                          )}
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Email Address</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              placeholder="asif@example.com"
                              value={custEmail}
                              onChange={(e) => {
                                setCustEmail(e.target.value);
                                setCustEmailTouched(true);
                              }}
                              onBlur={() => setCustEmailTouched(true)}
                              className={`w-full bg-neutral-50 dark:bg-neutral-900 border p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:outline-none ${
                                emailError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                          {emailError && (
                            <p className="text-[10px] text-red-500 font-semibold">{emailError}</p>
                          )}
                        </div>

                        {/* PHONE NUMBER */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">WhatsApp/Phone Number</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              placeholder="+8801864000000"
                              value={custPhone}
                              onChange={(e) => {
                                // Automatically block letters and special characters (keeping digits and optional single leading +)
                                const val = e.target.value.replace(/(?!^\+)[^\d]/g, '');
                                setCustPhone(val);
                                setCustPhoneTouched(true);
                              }}
                              onBlur={() => setCustPhoneTouched(true)}
                              className={`w-full bg-neutral-50 dark:bg-neutral-900 border p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:outline-none ${
                                phoneError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                          {phoneError && (
                            <p className="text-[10px] text-red-500 font-semibold">{phoneError}</p>
                          )}
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Password</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400">
                              <Key className="w-4 h-4" />
                            </span>
                            <input
                              type={showPass ? "text" : "password"}
                              placeholder="••••••••"
                              value={custPass}
                              onChange={(e) => {
                                setCustPass(e.target.value);
                                setCustPassTouched(true);
                              }}
                              onBlur={() => setCustPassTouched(true)}
                              className={`w-full bg-neutral-50 dark:bg-neutral-900 border p-2 pl-9 pr-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:outline-none ${
                                passError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute right-3 top-2 text-neutral-400 hover:text-neutral-200 focus:outline-none"
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {custPass && (
                            <div className="mt-1 space-y-1 bg-neutral-100 dark:bg-neutral-950/40 p-2 rounded-lg border border-neutral-200 dark:border-slate-800">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-neutral-500 dark:text-neutral-400">Password Strength:</span>
                                <span className={`text-[9px] font-black uppercase tracking-wider ${
                                  strength === 'Weak' ? 'text-red-500' : strength === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                                }`}>{strength}</span>
                              </div>
                              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                                <div className={`h-full ${barColor} ${barWidth} transition-all duration-300`} />
                              </div>
                              <p className="text-[9px] text-neutral-400 leading-tight">
                                Must be at least 8 chars with 1 uppercase, 1 lowercase, 1 digit, & 1 symbol.
                              </p>
                            </div>
                          )}
                          {passError && (
                            <p className="text-[10px] text-red-500 font-semibold">{passError}</p>
                          )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Confirm Password</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400">
                              <Key className="w-4 h-4" />
                            </span>
                            <input
                              type={showPassConfirm ? "text" : "password"}
                              placeholder="••••••••"
                              value={custPassConfirm}
                              onChange={(e) => {
                                setCustPassConfirm(e.target.value);
                                setCustPassConfirmTouched(true);
                              }}
                              onBlur={() => setCustPassConfirmTouched(true)}
                              className={`w-full bg-neutral-50 dark:bg-neutral-900 border p-2 pl-9 pr-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:outline-none ${
                                passConfirmError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassConfirm(!showPassConfirm)}
                              className="absolute right-3 top-2 text-neutral-400 hover:text-neutral-200 focus:outline-none"
                            >
                              {showPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {passConfirmError && (
                            <p className="text-[10px] text-red-500 font-semibold">{passConfirmError}</p>
                          )}
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              // Mark all fields as touched for strict display of errors
                              setCustFullNameTouched(true);
                              setCustEmailTouched(true);
                              setCustPhoneTouched(true);
                              setCustPassTouched(true);
                              setCustPassConfirmTouched(true);

                              const nameCheck = (() => {
                                const sanitized = custFullName.replace(/<[^>]*>?/gm, '').replace(/\s{2,}/g, ' ').trim();
                                if (!sanitized) return 'Full Name is required.';
                                if (sanitized.length < 2) return 'Full Name must be at least 2 characters.';
                                if (sanitized.length > 100) return 'Full Name must be at most 100 characters.';
                                if (!/^[A-Za-z\s]+$/.test(sanitized)) return 'Full Name must contain letters and spaces only.';
                                return '';
                              })();

                              const emailCheck = (() => {
                                if (!custEmail) return 'Email Address is required.';
                                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                if (!emailRegex.test(custEmail)) return 'Please enter a valid email address.';
                                return '';
                              })();

                              const phoneCheck = (() => {
                                if (!custPhone) return 'Phone Number is required.';
                                if (!/^\+?[0-9]+$/.test(custPhone)) return 'Please enter a valid phone number.';
                                const digitsOnly = custPhone.replace(/[^\d]/g, '');
                                if (digitsOnly.length < 8 || digitsOnly.length > 15) {
                                  return 'Please enter a valid phone number.';
                                }
                                return '';
                              })();

                              const passCheck = (() => {
                                if (!custPass) return 'Password is required.';
                                if (custPass.length < 8) return 'Password must be at least 8 characters.';
                                if (!/[A-Z]/.test(custPass)) return 'Password must contain at least one uppercase letter.';
                                if (!/[a-z]/.test(custPass)) return 'Password must contain at least one lowercase letter.';
                                if (!/[0-9]/.test(custPass)) return 'Password must contain at least one number.';
                                if (!/[^A-Za-z0-9]/.test(custPass)) return 'Password must contain at least one special character.';
                                return '';
                              })();

                              const confirmCheck = (() => {
                                if (!custPassConfirm) return 'Confirm Password is required.';
                                if (custPassConfirm !== custPass) return 'Passwords do not match.';
                                return '';
                              })();

                              const primaryError = nameCheck || emailCheck || phoneCheck || passCheck || confirmCheck;
                              if (primaryError) {
                                setAuthDrawerError(primaryError);
                                return;
                              }

                              setAuthDrawerLoading(true);
                              setAuthDrawerError('');

                              setTimeout(() => {
                                setAuthDrawerLoading(false);
                                // Create User template with sanitized name
                                const cleanRegName = custFullName.replace(/<[^>]*>?/gm, '').replace(/\s{2,}/g, ' ').trim();
                                const reggedUser: UserSession = {
                                  id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
                                  name: cleanRegName,
                                  username: cleanRegName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'newcustomer',
                                  email: custEmail.trim(),
                                  phone: custPhone.trim(),
                                  role: 'customer',
                                  isVerified: false,
                                  createdAt: new Date().toISOString().split('T')[0],
                                  status: 'active',
                                  wishlistedProductIds: []
                                };
                                setTempRegUser(reggedUser);
                                setAuthDrawerSuccess("Account template prepared! Dispatching verification code.");
                                setDrawerAuthView('otp');
                              }, 800);
                            }}
                            disabled={authDrawerLoading}
                            className="w-full py-2.5 bg-[#0284C7] hover:bg-sky-600 text-white font-black text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {authDrawerLoading ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserPlus className="w-4 h-4" />
                            )}
                            <span>Register New Account</span>
                          </button>
                        </div>

                      <div className="text-center pt-1">
                        <span className="text-[10px] text-neutral-400">
                          Already registered?{' '}
                          <button
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('login');
                            }}
                            className="text-emerald-500 font-extrabold hover:underline"
                          >
                            Sign In
                          </button>
                        </span>
                      </div>
                    </div>
                    );
                  })()}

                  {/* VIEW 3: FORGOT PASSWORD */}
                  {drawerAuthView === 'forgot' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                        <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                          Provide your registered client account email below to trigger a secure custom 2FA verification OTP to reset credentials.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Client Account Email</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="asif@example.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custEmail) {
                              setAuthDrawerError("Type an authorized email address.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              setAuthDrawerSuccess("OTP recovery handshake sent! Double check your Inbox.");
                              setDrawerAuthView('otp');
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Request Verification OTP</span>
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => {
                            setAuthDrawerError('');
                            setAuthDrawerSuccess('');
                            setDrawerAuthView('login');
                          }}
                          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-mono font-bold"
                        >
                          ← Cancel & Return to Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: OTP VERIFICATION */}
                  {drawerAuthView === 'otp' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold block">🚨 Simulated OTP Dispatched</span>
                        <p className="text-[10.5px] text-neutral-500 dark:text-slate-350 leading-relaxed font-medium">
                          Secure 6-Digit authorization OTP has been generated for client verification. Use verification token <strong className="text-emerald-500 dark:text-emerald-400 select-all font-mono">123456</strong>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Enter OTP Code (6-Digits)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            value={custOtpCode}
                            onChange={(e) => setCustOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-center font-mono text-sm tracking-[0.5em] font-extrabold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            if (custOtpCode !== '123456' && custOtpCode !== '998877') {
                              setAuthDrawerError("Invalid verification token code. Use '123456' to pass SSL handshakes.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              if (tempRegUser) {
                                // Registered user activation path
                                const activatedUser = { ...tempRegUser, isVerified: true };
                                setAuthDrawerSuccess("Account verified and unlocked successfully!");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess(activatedUser);
                                }
                              } else {
                                // Reset Password path
                                setAuthDrawerSuccess("OTP verified! Define your new login secret code.");
                                setDrawerAuthView('reset');
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Confirm Verification OTP</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                        <span>Didn't receive verification?</span>
                        <button
                          onClick={() => {
                            setCustOtpCode('');
                            setAuthDrawerSuccess("A new OTP code has been broadcasted.");
                          }}
                          className="text-emerald-500 font-extrabold hover:underline"
                        >
                          Resend Code
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 5: RESET PASSWORD */}
                  {drawerAuthView === 'reset' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Define New Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custNewPass}
                            onChange={(e) => setCustNewPass(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Re-type New Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custNewPass) {
                              setAuthDrawerError("Password field cannot be empty.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              setAuthDrawerSuccess("Password reset successfully saved. Initializing Workspace.");
                              setAuthDrawerOpen(false);
                              if (onLoginSuccess) {
                                onLoginSuccess({
                                  id: 'usr-client',
                                  name: 'WebzoneBD Client',
                                  username: 'client_partner',
                                  email: custEmail || 'client@webzonebd.com',
                                  phone: '+8801712345678',
                                  role: 'customer',
                                  isVerified: true,
                                  createdAt: '2026-06-01',
                                  status: 'active',
                                  wishlistedProductIds: []
                                });
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Save & Open Dashboard</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              {/* SOCIAL SIGN IN SECTION (BOTTOM) */}
              {(drawerAuthView === 'login' || drawerAuthView === 'register') && (
                <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-slate-800">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Social Access Gateway</span>
                    <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-google',
                              name: 'Google Client Account',
                              username: 'google_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801723456789',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'google',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with Google Secure ID"
                    >
                      <Globe className="w-4 h-4 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-fb',
                              name: 'Facebook Client Account',
                              username: 'facebook_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801734567890',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'facebook',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with Facebook Connect"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-github',
                              name: 'GitHub Developer Account',
                              username: 'github_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801745678901',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'github',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with GitHub SSH keys ID"
                    >
                      <Linkedin className="w-4 h-4 text-cyan-500" />
                    </button>
                  </div>

                  <p className="text-[9px] text-center text-neutral-400 mt-2 font-mono">
                    🛡️ SSL AES_256 COMPLIANT SECURITY PROTOCOLS
                  </p>
                </div>
              )}
            </div>
          )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Slider Drawer with conversion outputs */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-slideover-panel">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md animate-in slide-in-from-right duration-250">
              <div className="flex h-full flex-col relative overflow-hidden bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-l border-neutral-200/50 dark:border-white/8 rounded-l-[24px]">
                
                {/* Light Color Background Animation Effects for ShoppingCart */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.25, 1],
                    x: [0, 30, 0],
                    y: [0, -25, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none z-0 bg-gradient-to-r from-purple-300/50 via-indigo-200/40 to-cyan-300/40 dark:from-purple-600/25 dark:via-indigo-600/20 dark:to-cyan-600/20 blur-[90px]" 
                />

                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    x: [0, -35, 0],
                    y: [0, 30, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                  className="absolute top-1/3 -right-24 w-80 h-80 rounded-full pointer-events-none z-0 bg-gradient-to-r from-pink-300/45 via-rose-200/40 to-purple-300/40 dark:from-pink-600/22 dark:via-rose-600/18 dark:to-purple-600/20 blur-[95px]" 
                />

                <motion.div 
                  animate={{ 
                    scale: [0.9, 1.25, 0.9],
                    x: [0, 25, 0],
                    y: [0, -30, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                  className="absolute -bottom-16 -left-20 w-80 h-80 rounded-full pointer-events-none z-0 bg-gradient-to-r from-cyan-300/45 via-teal-200/40 to-blue-300/40 dark:from-cyan-600/22 dark:via-teal-600/18 dark:to-blue-600/20 blur-[90px]" 
                />

                {/* Light Beam Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent dark:from-purple-900/25 pointer-events-none z-0" />

                <div className="relative z-10 flex-1 flex flex-col overflow-y-auto px-4 py-6 sm:px-6 scrollbar-thin scrollbar-thumb-violet-500/20">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/65 dark:border-white/8">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-xl text-white shadow-md shadow-purple-500/10 shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-black">{t.cart} ({cart.length})</span>
                    </h2>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="p-2 text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white rounded-full bg-[#F8FAFC] dark:bg-[#111827] hover:bg-neutral-200/50 dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/5 shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-6 text-left">
                    {cart.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="py-10 px-4 text-center flex flex-col items-center justify-center"
                        id="empty-cart-container"
                      >
                        {/* Layered Floating Cart Graphic & Illustration */}
                        <div className="relative mb-6 flex items-center justify-center">
                          {/* Ambient Pulsing Glow Backdrop */}
                          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#7C3AED]/25 via-[#EC4899]/20 to-cyan-400/20 blur-2xl animate-pulse pointer-events-none" />

                          {/* Outer Concentric Gradient Ring */}
                          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-b from-neutral-100/90 to-neutral-200/50 dark:from-slate-800/80 dark:to-slate-900/60 p-0.5 border border-neutral-200/80 dark:border-white/10 shadow-[0_12px_32px_rgba(124,58,237,0.12)] flex items-center justify-center backdrop-blur-md">
                            {/* Inner Circle Container */}
                            <div className="w-full h-full rounded-[22px] bg-white/90 dark:bg-[#0F172A]/90 flex items-center justify-center relative overflow-hidden">
                              {/* Background subtle mesh lines */}
                              <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:8px_8px]" />
                              
                              {/* Central Animated Floating Shopping Icon */}
                              <motion.div
                                animate={{ 
                                  y: [0, -6, 0],
                                  rotate: [0, -2, 2, 0]
                                }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 4, 
                                  ease: "easeInOut" 
                                }}
                                className="relative z-10 p-4 rounded-2xl bg-gradient-to-tr from-[#7C3AED]/12 via-[#A855F7]/10 to-[#EC4899]/12 dark:from-[#7C3AED]/25 dark:to-[#EC4899]/20 border border-[#7C3AED]/20 text-[#7C3AED] dark:text-[#C084FC]"
                              >
                                <ShoppingBag className="w-10 h-10 stroke-[1.75]" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Floating Decorative Mini Badges */}
                          <motion.div
                            animate={{ 
                              y: [-3, 3, -3],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                            className="absolute -top-2 -right-2 p-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white shadow-lg shadow-pink-500/30 border border-white/20"
                            title="Deals & Discounts"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </motion.div>

                          <motion.div
                            animate={{ 
                              y: [3, -3, 3],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-2 -left-2 p-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white shadow-lg shadow-purple-500/30 border border-white/20"
                            title="Digital Marketplace"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </motion.div>
                        </div>

                        {/* Title & Explanatory Copy */}
                        <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tracking-tight mb-2">
                          {language === 'bn' 
                            ? 'আপনার শপিং কার্ট খালি' 
                            : language === 'ar'
                              ? 'سلة المشتريات فارغة'
                              : 'Your Cart is Empty'}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[280px] sm:max-w-xs leading-relaxed mb-6 font-medium">
                          {language === 'bn'
                            ? 'আপনার কার্টে এখনো কোনো ডিজিটাল প্রডাক্ট বা সার্ভিস যোগ করেননি। মার্কেটপ্লেসের প্রিমিয়াম স্ক্রিপ্ট ও সলিউশন এক্সপ্লোর করুন।'
                            : language === 'ar'
                              ? 'لم تقم بإضافة أي منتجات رقمية أو خدمات حتى الآن. اكتشف أفضل السكربتات والحلول البرمجية.'
                              : 'You haven\'t added any items to your cart yet. Explore our curated marketplace of ready scripts, themes, and hosting packages.'}
                        </p>

                        {/* Primary Action Button: Browse Marketplace */}
                        <div className="w-full space-y-3">
                          <button
                            id="cart-empty-browse-marketplace-btn"
                            type="button"
                            onClick={() => {
                              setCartOpen(false);
                              setCurrentPage('marketplace');
                            }}
                            className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 hover:shadow-[0_12px_28px_rgba(124,58,237,0.32)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group shadow-[0_8px_20px_rgba(124,58,237,0.22)]"
                          >
                            <Store className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            <span>
                              {language === 'bn' 
                                ? 'মার্কেটপ্লেস ব্রাউজ করুন' 
                                : language === 'ar' 
                                  ? 'تصفح المتجر الرقمي' 
                                  : 'Browse Marketplace'}
                            </span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>

                          {/* Secondary Exploration Suggestions */}
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2 font-mono">
                              {language === 'bn' ? 'অথবা এক্সপ্লোর করুন' : language === 'ar' ? 'أو تصفح الفئات' : 'Quick Categories'}
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setCartOpen(false);
                                  setCurrentPage('services');
                                }}
                                className="py-2.5 px-3 rounded-xl bg-neutral-100/90 dark:bg-slate-800/70 hover:bg-neutral-200/90 dark:hover:bg-slate-700/80 text-neutral-700 dark:text-neutral-200 text-xs font-semibold border border-neutral-200/60 dark:border-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Cpu className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A855F7]" />
                                <span>{language === 'bn' ? 'সার্ভিসেস' : language === 'ar' ? 'الخدمات' : 'Custom Services'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setCartOpen(false);
                                  setCurrentPage('hosting');
                                }}
                                className="py-2.5 px-3 rounded-xl bg-neutral-100/90 dark:bg-slate-800/70 hover:bg-neutral-200/90 dark:hover:bg-slate-700/80 text-neutral-700 dark:text-neutral-200 text-xs font-semibold border border-neutral-200/60 dark:border-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Server className="w-3.5 h-3.5 text-[#EC4899]" />
                                <span>{language === 'bn' ? 'হোস্টিং প্যাকেজ' : language === 'ar' ? 'الاستضافة' : 'BDIX Hosting'}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Trust Assurance Footer Badges */}
                        <div className="mt-8 pt-4 border-t border-neutral-200/50 dark:border-white/5 w-full flex items-center justify-around text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {language === 'bn' ? 'ইনস্ট্যান্ট ডেলিভারি' : 'Instant Access'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            {language === 'bn' ? 'ভেরিফাইড কোড' : '100% Verified'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#A855F7]" />
                            {language === 'bn' ? 'লাইভ সাপোর্ট' : '24/7 Support'}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flow-root mt-4">
                        <ul role="list" className="space-y-4">
                          <AnimatePresence initial={false}>
                            {cart.map((item, idx) => {
                              const activePrice = item.product.discountPrice || item.product.price;
                              return (
                                <motion.li
                                  key={item.product.id}
                                  layout
                                  initial={{ opacity: 0, height: 0, scale: 0.95, y: -15 }}
                                  animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0, scale: 0.9, y: -15, transition: { duration: 0.25 } }}
                                  transition={{ type: "spring", bounce: 0.1, duration: 0.35 }}
                                  className="relative flex p-4 bg-white/60 dark:bg-[#111827]/40 border border-neutral-200/80 dark:border-white/8 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                >
                                  {deletingCartIndex === idx && (
                                    <div className="absolute inset-0 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[8px] z-20 flex flex-col items-center justify-center text-center p-3 animate-in fade-in zoom-in-95 duration-200">
                                      <p className="text-xs font-semibold text-red-500 mb-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                                        <Trash2 className="w-4 h-4 text-[#EF4444] animate-pulse" />
                                        <span>{language === 'bn' ? 'আপনি কি নিশ্চিত?' : language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}</span>
                                      </p>
                                      <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mb-3 max-w-[90%] leading-relaxed text-center truncate w-full font-medium">
                                        {language === 'bn' 
                                          ? `"${item.product.nameBn || item.product.name}" কার্ট থেকে বাদ দিতে চান?` 
                                          : language === 'ar' 
                                            ? `إزالة "${item.product.nameAr || item.product.name}"؟` 
                                            : `Remove "${item.product.name}"?`}
                                      </p>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            removeFromCart(idx);
                                            setDeletingCartIndex(null);
                                          }}
                                          className="px-3.5 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-lg hover:opacity-90 shadow-md hover:shadow-red-500/10 active:scale-95 transition-all cursor-pointer"
                                        >
                                          {language === 'bn' ? 'হ্যাঁ, বাদ দিন' : language === 'ar' ? 'نعم، حذف' : 'Yes, Delete'}
                                        </button>
                                        <button
                                          type="button"
                                          className="px-3.5 py-1.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 rounded-lg active:scale-95 transition-all cursor-pointer border border-neutral-200/50 dark:border-white/5"
                                          onClick={() => setDeletingCartIndex(null)}
                                        >
                                          {language === 'bn' ? 'বাতিল' : language === 'ar' ? 'إلغاء' : 'Cancel'}
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-[14px] border border-neutral-200/60 dark:border-white/10 shadow-inner bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-center">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="h-full w-full object-cover object-center"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col justify-between">
                                    <div>
                                      <div className="flex justify-between items-start text-sm font-semibold gap-2">
                                        <h3 className="line-clamp-2 text-xs font-bold leading-tight text-neutral-900 dark:text-white">
                                          {language === 'bn' ? item.product.nameBn : language === 'ar' ? item.product.nameAr : item.product.name}
                                        </h3>
                                        <p className="ml-2 text-[#7C3AED] dark:text-[#A855F7] font-black whitespace-nowrap text-sm">{formatPriceInCart(activePrice)}</p>
                                      </div>
                                      {item.product.advancePercent !== undefined && item.product.advancePercent < 100 && (
                                        <div className="mt-1.5 space-y-0.5 text-left text-[11px] leading-tight">
                                          <div className="flex items-center gap-1.5 text-[#7C3AED] dark:text-[#A855F7] font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] animate-pulse" />
                                            <span>
                                              {language === 'bn' 
                                                ? `অগ্রিম: ${item.product.advancePercent}% (${formatPriceInCart(item.product.advanceAmount || 0)})`
                                                : `Advance: ${item.product.advancePercent}% (${formatPriceInCart(item.product.advanceAmount || 0)})`
                                              }
                                            </span>
                                          </div>
                                          <div className="text-[#EC4899] font-bold ml-3">
                                            {language === 'bn'
                                              ? `বকেয়া (Due): ${formatPriceInCart(item.product.dueAmount || 0)}`
                                              : `Due Amount: ${formatPriceInCart(item.product.dueAmount || 0)}`
                                            }
                                          </div>
                                        </div>
                                      )}
                                      <p className="mt-1 text-[9px] text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider font-semibold font-mono">
                                        {item.product.category}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-xs mt-2">
                                      <div className="flex items-center">
                                        {item.appliedCoupon ? (
                                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/10">
                                            <Percent className="w-3 h-3" />
                                            {item.appliedCoupon.code} (-{item.appliedCoupon.discountPercent}%)
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Standard License</span>
                                        )}
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => setDeletingCartIndex(idx)}
                                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                          title="Remove"
                                        >
                                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.li>
                              );
                            })}
                          </AnimatePresence>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Coupon overlay and summary options */}
                  {cart.length > 0 && (
                    <div className="border-t border-neutral-200/65 dark:border-white/8 pt-6 space-y-5">
                      {/* Apply coupon */}
                      <div className="relative mt-2" id="coupon-field-group">
                        <div className="flex gap-2.5 items-center">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              id="cart-coupon-code"
                              placeholder={language === 'bn' ? "কুপন কোড লিখুন" : "Enter Coupon Code"}
                              value={couponCode}
                              disabled={cart.some(item => item.appliedCoupon)}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="w-full h-[48px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] pl-10 pr-3 text-xs sm:text-sm font-semibold uppercase font-mono text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] dark:focus:border-[#A855F7] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-[#CBD5E1]" />
                          </div>
                          {cart.some(item => item.appliedCoupon) ? (
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="h-[48px] px-4 border border-red-200 dark:border-red-905/30 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-[14px] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0"
                            >
                              {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              className="h-[48px] px-6 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-xs text-white rounded-[14px] font-semibold uppercase tracking-wider hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0"
                            >
                              {t.apply}
                            </button>
                          )}
                        </div>
                        {couponError && (
                          <div className="mt-2.5 p-3 rounded-[14px] bg-[#FEE2E2] border border-[#EF4444] text-[#EF4444] text-[11px] sm:text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
                            <div className="w-4 h-4 bg-[#EF4444] text-white rounded-full flex items-center justify-center shrink-0 text-[10px] font-black">!</div>
                            <span>{couponError}</span>
                          </div>
                        )}
                        {couponSuccess && (
                          <div className="mt-2.5 p-3 rounded-[14px] bg-[#DCFCE7] border border-[#22C55E] text-[#22C55E] text-[11px] sm:text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
                            <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                            <span>{couponSuccess}</span>
                          </div>
                        )}
                      </div>

                      {/* Currency output rates block */}
                      <div className="space-y-2.5 text-sm bg-[#F8FAFC]/50 dark:bg-[#111827]/40 p-4 rounded-[20px] border border-neutral-200/60 dark:border-white/8 text-left shadow-sm">
                        <div className="flex justify-between text-[#475569] dark:text-[#CBD5E1] text-xs sm:text-sm font-bold">
                          <span className="font-extrabold text-[#0F172A] dark:text-white">{t.subtotal}</span>
                          <span className="font-black text-base sm:text-lg text-[#0F172A] dark:text-white">{formatPriceInCart(subtotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-[#22C55E] text-xs sm:text-sm font-bold animate-pulse">
                             <span className="font-bold">Savings Discount</span>
                             <span className="font-black text-base sm:text-lg">-{formatPriceInCart(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-black text-neutral-900 dark:text-white pt-2.5 border-t border-neutral-200/60 dark:border-white/8 text-sm sm:text-base">
                          <span className="font-black text-base sm:text-lg">{t.total}</span>
                          <span className="text-transparent bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text font-black text-lg sm:text-2xl">{formatPriceInCart(total)}</span>
                        </div>
                        {(() => {
                          const hasAdvanceItem = cart.some(item => item.product.advancePercent !== undefined && item.product.advancePercent < 100);
                          if (!hasAdvanceItem) return null;

                          // calculate sum of advances + regular items (less discount)
                          const totalPayableNow = cart.reduce((acc, item) => {
                            if (item.product.advanceAmount !== undefined) {
                              return acc + item.product.advanceAmount;
                            }
                            return acc + (item.product.discountPrice || item.product.price);
                          }, 0) - discountAmount;

                          const totalDueRemaining = cart.reduce((acc, item) => {
                            return acc + (item.product.dueAmount || 0);
                          }, 0);

                          return (
                            <>
                              <div className="flex justify-between text-indigo-600 dark:text-cyan-400 font-black pt-2.5 border-t border-dashed border-neutral-200/60 dark:border-white/5 text-xs sm:text-sm">
                                <span className="font-black">{language === 'bn' ? 'অগ্রিম পরিশোধযোগ্য (Payable Now):' : 'Payable Now (Advance):'}</span>
                                <span className="font-black text-base sm:text-lg">{formatPriceInCart(Math.max(0, totalPayableNow))}</span>
                              </div>
                              <div className="flex justify-between text-amber-500 font-extrabold text-xs sm:text-sm">
                                <span className="font-extrabold">{language === 'bn' ? 'বকেয়া বাকি (Remaining Due):' : 'Remaining Due:'}</span>
                                <span className="font-black text-base sm:text-lg">{formatPriceInCart(totalDueRemaining)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      {/* Optional Order Notes */}
                      <div className="relative mt-2" id="order-notes-group-container">
                        <textarea
                          id="checkout-order-notes"
                          rows={2}
                          placeholder=" "
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          className="peer w-full min-h-[110px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-6 pb-2 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] dark:focus:border-[#A855F7] transition-all duration-300 resize-y"
                        />
                        <label
                          htmlFor="checkout-order-notes"
                          className="absolute left-4 top-2 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px] uppercase tracking-wider flex items-center gap-1 pointer-events-none cursor-text"
                        >
                          <span>📝</span>
                          <span>{language === 'bn' ? 'অর্ডার নোট (ঐচ্ছিক)' : language === 'ar' ? 'ملاحظات الطلب (اختياري)' : 'Order Notes (Optional)'}</span>
                        </label>
                      </div>

                      {/* Checkout Gateway System */}
                      <div className="space-y-4 bg-neutral-50/60 dark:bg-[#111827]/40 p-5 rounded-[24px] border border-neutral-200/60 dark:border-white/8 shadow-xs">
                        {checkoutSuccess ? (
                          <div className="py-8 text-center text-[#22C55E] dark:text-[#22C55E] space-y-3 animate-pulse">
                            <span className="font-extrabold text-xs block text-slate-900 dark:text-white tracking-widest font-mono">🔗 CONNECTING WEBZONE SECURE HANDSHAKE...</span>
                            <p className="text-xs font-semibold text-neutral-450 dark:text-neutral-450">Verifying secure digital token...</p>
                          </div>
                        ) : !user ? (
                          <div className="w-full space-y-4">
                            {/* Account Creation Benefits Informational Callout & Interactive Tooltip */}
                            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50/95 via-purple-50/70 to-pink-50/40 dark:from-[#1E1B4B]/50 dark:via-[#2E1065]/35 dark:to-[#0F172A]/70 border border-indigo-200/90 dark:border-indigo-800/70 p-3.5 shadow-xs transition-all duration-300">
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shrink-0 shadow-xs mt-0.5">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black text-slate-900 dark:text-white">
                                        {language === 'bn' ? 'অ্যাকাউন্ট খোলার সুবিধা' : language === 'ar' ? 'مزايا إنشاء حساب' : 'Why Create an Account?'}
                                      </span>
                                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8.5px] font-extrabold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                        {language === 'bn' ? 'প্রস্তাবিত' : language === 'ar' ? 'موصى به' : 'Recommended'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                                      {language === 'bn' 
                                        ? 'অর্ডার হিস্টোরি সংরক্ষণ, যেকোনো সময় ফাইল পুনরায় ডাউনলোড ও প্রায়োরিটি সাপোর্ট পেতে অ্যাকাউন্ট খুলুন।' 
                                        : language === 'ar' 
                                        ? 'سجل حسابك لحفظ سجل طلباتك، وإعادة تحميل الملفات لاحقاً، والحصول على دعم فني أولوي فوري.' 
                                        : 'Save your complete order history, unlock lifetime re-downloads, and get 24/7 priority customer support.'}
                                    </p>
                                  </div>
                                </div>

                                {/* Interactive Tooltip Popover Trigger */}
                                <div className="relative shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setShowAccountBenefitsTooltip(prev => !prev)}
                                    onMouseEnter={() => setShowAccountBenefitsTooltip(true)}
                                    onMouseLeave={() => setShowAccountBenefitsTooltip(false)}
                                    className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-700/60 shadow-2xs transition-all cursor-pointer flex items-center gap-1 text-[10.5px] font-bold"
                                    aria-label="Account benefits details"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-[10px]">{language === 'bn' ? 'বিস্তারিত' : 'Perks'}</span>
                                  </button>

                                  {/* Floating Detailed Benefits Tooltip */}
                                  <AnimatePresence>
                                    {showAccountBenefitsTooltip && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900/98 dark:bg-[#090D16]/98 text-white backdrop-blur-2xl border border-indigo-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 text-left pointer-events-auto"
                                      >
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                                          <span className="text-[11px] font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                            {language === 'bn' ? 'অ্যাকাউন্ট মেম্বারশিপ সুবিধা' : 'Account Member Benefits'}
                                          </span>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100% FREE</span>
                                        </div>
                                        
                                        <div className="space-y-2 text-[10.5px]">
                                          <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5 shrink-0">
                                              <Download className="w-3 h-3" />
                                            </div>
                                            <div>
                                              <strong className="text-white font-bold block">{language === 'bn' ? 'সংরক্ষিত অর্ডার ও লাইসেন্স হিস্টোরি' : 'Saved Order History & License Keys'}</strong>
                                              <span className="text-slate-300 text-[9.5px]">{language === 'bn' ? 'সকল কেনা ডিজিটাল স্ক্রিপ্ট, থিম, লাইসেন্স কী ও ইনভয়েস আজীবন ড্যাশবোর্ডে থাকবে।' : 'Permanent lifetime access to purchased files, source code zips, license keys, and receipts.'}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5 shrink-0">
                                              <Zap className="w-3 h-3" />
                                            </div>
                                            <div>
                                              <strong className="text-white font-bold block">{language === 'bn' ? 'প্রায়োরিটি সাপোর্ট ডেস্ক' : 'Priority Customer Support'}</strong>
                                              <span className="text-slate-300 text-[9.5px]">{language === 'bn' ? 'টিকিট ও হোয়াটসঅ্যাপে দ্রুত অগ্রাধিকার ভিত্তিতে সহায়তা পাবেন।' : 'Expedited customer queue on WhatsApp & support tickets with automated order verification.'}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300 mt-0.5 shrink-0">
                                              <Coins className="w-3 h-3" />
                                            </div>
                                            <div>
                                              <strong className="text-white font-bold block">{language === 'bn' ? '৩০% অ্যাফিলিয়েট ও স্পেশাল ছাড়' : 'Affiliate Rewards & Member Deals'}</strong>
                                              <span className="text-slate-300 text-[9.5px]">{language === 'bn' ? 'রেফার করে কমিশন আয় এবং এক্সক্লুসিভ মেম্বার ডিসকাউন্ট উপভোগ করুন।' : 'Earn up to 30% affiliate commissions and unlock member-exclusive promo codes.'}</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Quick Action inside Tooltip */}
                                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowAccountBenefitsTooltip(false);
                                              if (setCartOpen) setCartOpen(false);
                                              onLoginClick('register');
                                            }}
                                            className="flex-1 py-1.5 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer shadow-xs"
                                          >
                                            {language === 'bn' ? 'ফ্রি অ্যাকাউন্ট খুলুন' : 'Create Free Account'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowAccountBenefitsTooltip(false);
                                              if (setCartOpen) setCartOpen(false);
                                              onLoginClick('login');
                                            }}
                                            className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                                          >
                                            {language === 'bn' ? 'লগইন' : 'Sign In'}
                                          </button>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>

                              {/* Quick CTA row below message */}
                              <div className="mt-2.5 pt-2 border-t border-indigo-100/70 dark:border-indigo-900/40 flex items-center justify-between gap-2 text-[10px]">
                                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
                                  <span className="flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    {language === 'bn' ? 'অর্ডার হিস্টোরি' : 'Saved History'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    {language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support'}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (setCartOpen) setCartOpen(false);
                                    onLoginClick('register');
                                  }}
                                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-extrabold cursor-pointer group"
                                >
                                  <span>{language === 'bn' ? 'ফ্রি সাইন আপ' : 'Register Free'}</span>
                                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              </div>
                            </div>

                            {/* Toggle switcher */}
                            <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-slate-950/80 border border-neutral-200/50 dark:border-white/5 rounded-[14px]" id="guest-checkout-switcher">
                              <button
                                type="button"
                                onClick={() => setCheckoutMode('guest')}
                                className={`py-2 text-center text-xs font-bold rounded-[10px] transition-all duration-300 cursor-pointer ${
                                  checkoutMode === 'guest'
                                    ? 'bg-white dark:bg-[#1E293B] text-[#7C3AED] dark:text-[#A855F7] shadow-[0_4px_12px_rgba(124,58,237,0.12)] border border-neutral-200/20 dark:border-white/5'
                                    : 'text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
                                }`}
                              >
                                {language === 'bn' ? 'গেস্ট চেকআউট' : language === 'ar' ? 'دفع كزائر' : 'Guest Checkout'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setCheckoutMode('login')}
                                className={`py-2 text-center text-xs font-bold rounded-[10px] transition-all duration-300 cursor-pointer ${
                                  checkoutMode === 'login'
                                    ? 'bg-white dark:bg-[#1E293B] text-[#7C3AED] dark:text-[#A855F7] shadow-[0_4px_12px_rgba(124,58,237,0.12)] border border-neutral-200/20 dark:border-white/5'
                                    : 'text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
                                }`}
                              >
                                {language === 'bn' ? 'লগইন করুন' : language === 'ar' ? 'سجل دخول' : 'Sign In'}
                              </button>
                            </div>

                            {checkoutMode === 'login' ? (
                              <div className="w-full text-center py-2 space-y-4">
                                <p className="text-xs leading-relaxed text-neutral-500 dark:text-[#CBD5E1]">
                                  🔒 Securely access your customer account or register as an affiliate partner to purchase scripts, licenses & hosting packages.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCartOpen(false);
                                    onLoginClick('login');
                                  }}
                                  className="w-full h-[54px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-bold text-xs uppercase tracking-wider rounded-[14px] shadow-[0_12px_30px_rgba(124,58,237,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-1.5"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>{language === 'bn' ? 'লগইন এবং চেকআউট' : language === 'ar' ? 'الولوج والدفع' : 'Login & Check Out'}</span>
                                </button>
                              </div>
                            ) : (
                              <div className="w-full space-y-4">
                                <div className="p-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 dark:border-indigo-500/20 rounded-[14px] flex items-start gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                                  <span className="text-amber-500 text-xs shrink-0 mt-0.5">⚡</span>
                                  <div className="min-w-0 flex-1">
                                    <span>
                                      {language === 'bn' 
                                        ? 'গেস্ট চেকআউটের তথ্য দিন। স্থায়ী অর্ডার হিস্টোরি ও প্রায়োরিটি সাপোর্ট পেতে ' 
                                        : language === 'ar' 
                                        ? 'أدخل بياناتك للدفع السريع. للحصول على سجل دائم ودعم مميز ' 
                                        : 'Instant Guest Checkout. To save this order to your account & get priority support, '}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (setCartOpen) setCartOpen(false);
                                        onLoginClick('register');
                                      }}
                                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                                    >
                                      <span>{language === 'bn' ? 'ফ্রি অ্যাকাউন্ট খুলুন' : language === 'ar' ? 'سجل الآن' : 'register free'}</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="space-y-4 text-left">
                                  {/* Full Name */}
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="guest-name-field"
                                      placeholder=" "
                                      value={guestName}
                                      onChange={(e) => setGuestName(e.target.value)}
                                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] dark:focus:border-[#A855F7] transition-all duration-300"
                                      required
                                    />
                                    <label
                                      htmlFor="guest-name-field"
                                      className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                    >
                                      Full Name *
                                    </label>
                                  </div>

                                  {/* Phone */}
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="guest-phone-field"
                                      placeholder=" "
                                      value={guestPhone}
                                      onChange={(e) => setGuestPhone(e.target.value)}
                                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] dark:focus:border-[#A855F7] transition-all duration-300"
                                      required
                                    />
                                    <label
                                      htmlFor="guest-phone-field"
                                      className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                    >
                                      WhatsApp / Phone No *
                                    </label>
                                  </div>

                                  {/* Email */}
                                  <div className="relative">
                                    <input
                                      type="email"
                                      id="guest-email-field"
                                      placeholder=" "
                                      value={guestEmail}
                                      onChange={(e) => setGuestEmail(e.target.value)}
                                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                      required
                                    />
                                    <label
                                      htmlFor="guest-email-field"
                                      className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                    >
                                      Email Address *
                                    </label>
                                  </div>

                                  {/* Transaction ID */}
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="guest-trxid-field"
                                      placeholder=" "
                                      value={guestTransactionId}
                                      onChange={(e) => setGuestTransactionId(e.target.value)}
                                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-mono font-bold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                      required
                                    />
                                    <label
                                      htmlFor="guest-trxid-field"
                                      className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                    >
                                      Transaction ID (TrxID) *
                                    </label>
                                  </div>

                                  {/* Row 5.6: Premium Multiple Payment Screenshot / Recipe photo upload system */}
                                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-[16px] transition-all duration-300">
                                    <div className="flex items-center gap-1.5">
                                      <div className="p-1 bg-violet-500/10 rounded-md">
                                        <Upload className="w-3.5 h-3.5 text-violet-500" />
                                      </div>
                                      <label className="text-[11px] sm:text-xs font-bold text-[#475569] dark:text-[#CBD5E1]">
                                        {language === 'bn' ? 'পেমেন্ট স্ক্রিনশট বা রসিদ আপলোড:' : 'Payment Screenshots or Receipts Upload:'}
                                      </label>
                                    </div>

                                    {/* Multi-file input drag-and-drop zone */}
                                    <div className="group relative border border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500/50 rounded-lg p-2.5 transition-all duration-300 bg-[#F8FAFC]/50 dark:bg-[#111827]/30 text-center cursor-pointer">
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files) {
                                            const fileArray = Array.from(files) as File[];
                                            fileArray.forEach((file: File) => {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const url = reader.result as string;
                                                setGuestReceiptsList(prev => {
                                                  // Prevent duplicates
                                                  if (prev.some(item => item.name === file.name)) return prev;
                                                  return [...prev, { name: file.name, url }];
                                                });
                                              };
                                              reader.readAsDataURL(file);
                                            });
                                            triggerToast(language === 'bn' ? 'পেমেন্ট ফাইল সংযুক্ত করা হয়েছে!' : 'Payment file(s) successfully attached!');
                                          }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      />
                                      <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="p-1.5 bg-violet-500/5 dark:bg-violet-500/10 rounded-lg group-hover:bg-violet-500/15 transition-colors duration-300">
                                          <Upload className="w-4 h-4 text-violet-500" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-none">
                                          {language === 'bn' ? 'স্ক্রিনশট বা রসিদ যুক্ত করুন (একের অধিক)' : 'Upload Receipts (Multiple Files Supported)'}
                                        </span>
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                                          {language === 'bn' ? 'ড্র্যাগ অ্যান্ড ড্রপ অথবা ক্লিক করুন' : 'Drag & drop or click to browse'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Uploaded receipt screenshots list */}
                                    {guestReceiptsList.length > 0 && (
                                      <div className="space-y-2 pt-2">
                                        <div className="text-[10px] uppercase font-bold font-mono tracking-wider text-neutral-400 dark:text-neutral-500 text-left">
                                          {language === 'bn' ? `সংযুক্ত রসিদসমূহ (${guestReceiptsList.length})` : `Attached Receipts (${guestReceiptsList.length})`}
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                          {guestReceiptsList.map((receipt, index) => (
                                            <div 
                                              key={index} 
                                              className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 p-2.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                            >
                                              <img 
                                                src={receipt.url} 
                                                alt={receipt.name} 
                                                className="w-12 h-10 object-cover rounded-lg border border-emerald-500/20 shadow-xs"
                                              />
                                              <div className="flex-1 text-left min-w-0">
                                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                                                  {receipt.name}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">
                                                  {language === 'bn' ? 'যাচাইকরণের জন্য প্রস্তুত' : 'Ready for Verification'}
                                                </span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setGuestReceiptsList(prev => prev.filter((_, i) => i !== index));
                                                  triggerToast(language === 'bn' ? 'রসিদ মুছে ফেলা হয়েছে' : 'Receipt removed');
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-all cursor-pointer active:scale-90"
                                                title="Remove receipt"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {guestValidationError && (
                                  <p className="text-[11px] text-red-500 font-bold text-left">{guestValidationError}</p>
                                )}

                                {/* Render payment gateways immediately for instant guest checkout */}
                                <div className="mt-4 pt-4 border-t border-neutral-200/60 dark:border-slate-800/80">
                                  <h4 className="text-[10px] uppercase font-bold font-mono tracking-widest text-neutral-500 mb-2.5 text-left flex items-center justify-between">
                                    <span>{t.checkoutTitle}</span>
                                    <span className="text-[9px] text-indigo-500 dark:text-cyan-405 font-sans lowercase">Select a gateway below</span>
                                  </h4>

                                  {currency === 'USD' && (
                                    <div className="grid grid-cols-1 gap-2 w-full">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('USD Bank Transfer')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer w-full text-center ${
                                          selectedGuestGateway === 'USD Bank Transfer'
                                            ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-650/40 dark:bg-emerald-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-emerald-600">USD Bank Transfer</span>
                                        <span className="text-[9px] text-neutral-450 mt-1">Direct Bank Wire / SWIFT / routing</span>
                                      </button>
                                    </div>
                                  )}

                                  {currency === 'BDT' && (
                                    <div className="grid grid-cols-2 gap-2 w-full font-sans">
                                      {/* bKash */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('bKash Wallet')}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                          selectedGuestGateway === 'bKash Wallet'
                                            ? 'border-pink-550 bg-pink-500/10 ring-2 ring-pink-500/40 dark:bg-pink-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-pink-505'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-pink-600 font-sans">bKash (বিকাশ)</span>
                                        <span className="text-[9px] text-neutral-400">Instant Verification</span>
                                      </button>

                                      {/* Nagad */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('Nagad Digital')}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center relative overflow-hidden ${
                                          selectedGuestGateway === 'Nagad Digital'
                                            ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 dark:bg-orange-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-orange-500 hover:shadow-xs'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-orange-600 font-sans">Nagad (নগদ)</span>
                                        <span className="text-[9px] text-neutral-400">Secure BD Wallet</span>
                                      </button>

                                      {/* Rocket */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('Rocket Wallet')}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                          selectedGuestGateway === 'Rocket Wallet'
                                            ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-600/40 dark:bg-purple-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-550 hover:shadow-xs'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-purple-600 font-sans">Rocket (রকেট)</span>
                                        <span className="text-[9px] text-neutral-400 font-sans">Dutch-Bangla Bank</span>
                                      </button>

                                      {/* Cellfin */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('Cellfin Payment')}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                          selectedGuestGateway === 'Cellfin Payment'
                                            ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/40 dark:bg-sky-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-sky-500 hover:shadow-xs'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-sky-600 font-sans">Cellfin Card</span>
                                        <span className="text-[9px] text-neutral-400 font-sans">Cellfin Wallet</span>
                                      </button>

                                      {/* Bank Transfer */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('Islami Bank Transfer')}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer col-span-2 text-center ${
                                          selectedGuestGateway === 'Islami Bank Transfer'
                                            ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/40 dark:bg-emerald-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500 hover:shadow-xs'
                                        }`}
                                      >
                                        <span className="text-xs font-black text-emerald-600 font-sans">Islami Bank Transfer</span>
                                        <span className="text-[9px] text-neutral-400 font-sans">Direct IBB Internet Net Banking</span>
                                      </button>

                                      {/* SSLCommerz */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedGuestGateway('SSLCommerz Gateway')}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer col-span-2 text-center ${
                                          selectedGuestGateway === 'SSLCommerz Gateway'
                                            ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/40 dark:bg-cyan-950/20'
                                            : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-550 hover:shadow-xs'
                                        }`}
                                      >
                                        <span className="text-xs font-bold text-cyan-600 font-sans">Online instant Pay</span>
                                        <span className="text-[9px] text-neutral-400 font-sans">Cards / Net Banking / Mobiles</span>
                                      </button>

                                      {/* Custom methods for BDT */}
                                      {customMethods && customMethods.filter(m => m.enabled && m.currency === 'BDT').map((m, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => setSelectedGuestGateway(m.name)}
                                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer col-span-2 text-center ${
                                            selectedGuestGateway === m.name
                                              ? 'border-indigo-600 bg-indigo-500/10 ring-2 ring-indigo-600/40 dark:bg-indigo-950/20'
                                              : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-indigo-500'
                                          }`}
                                        >
                                          <span className="text-xs font-black text-indigo-650">{m.name}</span>
                                          <span className="text-[9px] text-neutral-400">{m.instructions?.slice(0, 45) || 'Custom Added Gateway'}</span>
                                        </button>
                                      ))}

                                      {/* Expanded payment description for BDT */}
                                      {['bKash Wallet', 'Nagad Digital', 'Rocket Wallet', 'Cellfin Payment'].includes(selectedGuestGateway) && (() => {
                                        const activeMfs = getActiveMfsDetails(selectedGuestGateway);
                                        return (
                                          <div className="mt-4 p-3 rounded-xl border border-neutral-300 dark:border-slate-800 bg-neutral-50 dark:bg-[#0b0f19] text-center animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100 font-sans">
                                            <div className="flex flex-col items-center w-full">
                                              {/* Header */}
                                              <div className="flex items-center gap-2 mb-2">
                                                <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: `#${activeMfs.qrColor}` }} />
                                                <span className="text-xs font-black tracking-tight font-sans">
                                                  {activeMfs.name} Account Info ({activeMfs.type === 'agent' ? 'এজেন্ট ওয়ালেট' : 'পার্সোনাল ওয়ালেট'})
                                                </span>
                                              </div>

                                              {/* Auto QR Generator */}
                                              <AutoCheckoutQrGenerator
                                                gateway={activeMfs.name}
                                                orderTotalFormatted={formatPriceInCart(total)}
                                                orderTotalNumber={total}
                                                currency={currency}
                                                language={language}
                                                triggerToast={triggerToast}
                                                merchantNumber={activeMfs.number}
                                                instructions={activeMfs.instructions}
                                                defaultColorHex={activeMfs.qrColor}
                                              />

                                              {/* Instructions & Phone Number */}
                                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-3 leading-relaxed max-w-sm">
                                                {activeMfs.instructions}
                                              </p>

                                              <div className="w-full flex flex-col items-center bg-neutral-100 dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-205 dark:border-slate-800 max-w-xs">
                                                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-black block mb-0.5">{language === 'bn' ? 'ওয়ালেট নাম্বার' : 'WALLET NUMBER'}</span>
                                                <span className="text-base font-extrabold font-mono tracking-wider text-neutral-900 dark:text-white">{activeMfs.number}</span>
                                                
                                                {/* Copy Number Button */}
                                                <motion.button
                                                  type="button"
                                                  whileHover={{ scale: 1.02 }}
                                                  whileTap={{ scale: 0.98 }}
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(activeMfs.number.replace(/\s/g, ''));
                                                    setBdtPaymentCopied(true);
                                                    setTimeout(() => setBdtPaymentCopied(false), 2000);
                                                  }}
                                                  className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[10px] uppercase font-black tracking-wider transition-all duration-300 cursor-pointer w-full shadow-md"
                                                  style={{ backgroundColor: `#${activeMfs.qrColor}` }}
                                                >
                                                  {bdtPaymentCopied ? (
                                                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-white" /> {language === 'bn' ? 'কপি সফল হয়েছে!' : 'Number Copied!'}</span>
                                                  ) : (
                                                    <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> {language === 'bn' ? 'নাম্বার কপি করুন' : 'Copy Number'}</span>
                                                  )}
                                                </motion.button>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })()}

                                      {/* Islami Bank Transfer Expanded Panel (Guest Checkout) */}
                                      {selectedGuestGateway === 'Islami Bank Transfer' && (
                                        <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 bg-neutral-50 dark:bg-[#0b0f19] text-left animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100">
                                          <div className="flex flex-col gap-4">
                                            {/* Bank Header */}
                                            <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800">
                                              <div className="p-2 bg-emerald-600 rounded-lg text-white font-black tracking-wider text-xs">
                                                IBBL
                                              </div>
                                              <div>
                                                <h4 className="text-xs font-black tracking-tight text-neutral-900 dark:text-white">
                                                  {language === 'bn' ? 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড' : 'Islami Bank Bangladesh Ltd.'}
                                                </h4>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-mono font-bold block">
                                                  Direct IBBL Online Banking Transfer
                                                </span>
                                              </div>
                                            </div>

                                            {/* Grid layout for bank details and QR code */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                                              
                                              {/* Details */}
                                              <div className="md:col-span-7 flex flex-col gap-2">
                                                
                                                {/* Account Name */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম' : 'Account Name'}</span>
                                                    <span className="text-xs font-black text-neutral-900 dark:text-white">MD IMRAN HOSSAIN</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText('MD IMRAN HOSSAIN');
                                                      setCopiedBankAccName(true);
                                                      setTimeout(() => setCopiedBankAccName(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedBankAccName ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Account No */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম্বার' : 'Account No'}</span>
                                                    <span className="text-sm font-black font-mono tracking-wider text-neutral-900 dark:text-white">20501290204369912</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText('20501290204369912');
                                                      setCopiedBankAccNo(true);
                                                      setTimeout(() => setCopiedBankAccNo(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedBankAccNo ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Branch */}
                                                <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs flex justify-between items-center text-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'শাখা / ব্রাঞ্চ' : 'Branch'}</span>
                                                    <span className="font-extrabold text-neutral-900 dark:text-white">New Market Dhaka</span>
                                                  </div>
                                                  <span className="text-[10px] text-emerald-600 font-bold font-mono">IBBL BD</span>
                                                </div>

                                                {/* Routing No */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'রাউটিং নাম্বার' : 'Routing No'}</span>
                                                    <span className="text-xs font-extrabold font-mono text-neutral-900 dark:text-white">125263522</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText('125263522');
                                                      setCopiedBankRouting(true);
                                                      setTimeout(() => setCopiedBankRouting(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedBankRouting ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                              </div>

                                              {/* Auto QR Generator */}
                                              <div className="md:col-span-5 flex flex-col items-center justify-center">
                                                <AutoCheckoutQrGenerator
                                                  gateway="Islami Bank Transfer"
                                                  orderTotalFormatted={formatPriceInCart(total)}
                                                  orderTotalNumber={total}
                                                  currency={currency}
                                                  language={language}
                                                  triggerToast={triggerToast}
                                                  merchantNumber="20501290204369912"
                                                  accountName="MD IMRAN HOSSAIN"
                                                  defaultColorHex="059669"
                                                />
                                              </div>

                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {currency === 'SAR' && (
                                    <div className="grid grid-cols-2 gap-2 w-full font-sans animate-in fade-in duration-200">
                                      {/* STC Pay Button */}
                                      {finalSaMethods.stcPay?.enabled && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedGuestGateway('STC Pay')}
                                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                            selectedGuestGateway === 'STC Pay'
                                              ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-600/40 dark:bg-purple-950/20'
                                              : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-600'
                                          }`}
                                        >
                                          <span className="text-xs font-black text-purple-600">STC Pay</span>
                                          <span className="text-[9px] text-neutral-450 mt-0.5">Saudi Digital Wallet</span>
                                        </button>
                                      )}

                                      {/* Alraji Bank Button */}
                                      {finalSaMethods.alRajhi?.enabled && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedGuestGateway('Alraji Bank Transfer')}
                                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                            selectedGuestGateway === 'Alraji Bank Transfer'
                                              ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-600/40 dark:bg-blue-950/20'
                                              : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-600'
                                          }`}
                                        >
                                          <span className="text-xs font-black text-blue-600">Alraji Bank</span>
                                          <span className="text-[9px] text-neutral-450 mt-0.5">Bank Wire Transfer</span>
                                        </button>
                                      )}

                                      {/* STC Pay Expanded Details (Guest) */}
                                      {selectedGuestGateway === 'STC Pay' && (
                                        <div className="mt-2 p-3 rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 text-center animate-in fade-in slide-in-from-top-2 duration-205 col-span-2">
                                          <p className="text-[11px] font-black text-purple-700 dark:text-purple-400 mb-1">
                                            {finalSaMethods.stcPay?.instructions || (language === 'bn' ? 'কোড স্ক্যান করুন পেমেন্ট করার জন্য' : 'Scan QR code to pay using STC Pay app')}
                                          </p>

                                          {/* Auto QR Generator */}
                                          <AutoCheckoutQrGenerator
                                            gateway="STC Pay"
                                            orderTotalFormatted={formatPriceInCart(total)}
                                            orderTotalNumber={total}
                                            currency={currency}
                                            language={language}
                                            triggerToast={triggerToast}
                                            merchantNumber={finalSaMethods.stcPay?.walletNumber || '+966 57 051 1931'}
                                            instructions={finalSaMethods.stcPay?.instructions}
                                            defaultColorHex="7c3aed"
                                          />

                                          <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold bg-purple-100/50 dark:bg-purple-950/40 py-1.5 rounded-md px-2 inline-block w-full text-center font-sans">
                                              {language === 'bn' ? `ওয়ালেট নাম্বার: ${finalSaMethods.stcPay?.walletNumber || '+966 57 051 1931'}` : `Wallet Number: ${finalSaMethods.stcPay?.walletNumber || '+966 57 051 1931'}`}
                                            </p>
                                            <motion.button
                                              type="button"
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.96 }}
                                              onClick={() => {
                                                navigator.clipboard.writeText((finalSaMethods.stcPay?.walletNumber || '+966 57 051 1931').replace(/\s/g, ''));
                                                setStcPayCopied(true);
                                                setTimeout(() => setStcPayCopied(false), 2000);
                                              }}
                                              className={`mt-1.5 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-white text-[10px] uppercase font-bold transition-all duration-300 cursor-pointer w-full shadow-xs ${
                                                stcPayCopied 
                                                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                                                  : 'bg-purple-600 hover:bg-purple-750'
                                              }`}
                                            >
                                              <AnimatePresence mode="wait">
                                                {stcPayCopied ? (
                                                  <motion.div
                                                    key="copied"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex items-center gap-1.5"
                                                  >
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                    <span>{language === 'bn' ? 'কপি করা হয়েছে!' : 'Number Copied!'}</span>
                                                  </motion.div>
                                                ) : (
                                                  <motion.div
                                                    key="copy"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex items-center gap-1.5"
                                                  >
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>{language === 'bn' ? 'নম্বর কপি করুন' : 'Copy Number'}</span>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </motion.button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Alraji Bank Details (Guest) */}
                                      {selectedGuestGateway === 'Alraji Bank Transfer' && (
                                        <div className="mt-4 p-4 rounded-xl border border-blue-500/30 dark:border-blue-500/25 bg-neutral-50 dark:bg-[#0b0f19] text-left animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100 font-sans">
                                          <div className="flex flex-col gap-4">
                                            {/* Bank Header */}
                                            <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800">
                                              <div className="p-2 bg-blue-600 rounded-lg text-white font-black tracking-wider text-xs uppercase font-sans">
                                                Alrajhi
                                              </div>
                                              <div>
                                                <h4 className="text-xs font-black tracking-tight text-neutral-900 dark:text-white font-sans">
                                                  {finalSaMethods.alRajhi?.bankName || (language === 'bn' ? 'আল রাজি ব্যাংক সৌদি আরব' : 'Al Rajhi Bank Saudi Arabia 🇸🇦')}
                                                </h4>
                                                <span className="text-[10px] text-blue-600 dark:text-blue-450 font-mono font-bold block">
                                                  Direct Al Rajhi Bank Transfer Details
                                                </span>
                                              </div>
                                            </div>

                                            {/* Grid layout for bank details and QR code */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                                              
                                              {/* Details */}
                                              <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-2">
                                                
                                                {/* Account Name */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম (Account Name)' : 'Account Name'}</span>
                                                    <span className="text-[11px] font-black text-neutral-900 dark:text-white">{finalSaMethods.alRajhi?.accountName || 'MD IMRAN HOSSAIN'}</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText(finalSaMethods.alRajhi?.accountName || 'MD IMRAN HOSSAIN');
                                                      setCopiedAlrajiAccName(true);
                                                      setTimeout(() => setCopiedAlrajiAccName(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedAlrajiAccName ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Account No */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম্বার' : 'Account No'}</span>
                                                    <span className="text-[11px] font-black font-mono tracking-wider text-neutral-900 dark:text-white">{finalSaMethods.alRajhi?.accountNumber || '621000010006086016528'}</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText((finalSaMethods.alRajhi?.accountNumber || '621000010006086016528').replace(/\s/g, ''));
                                                      setCopiedAlrajiAccNo(true);
                                                      setTimeout(() => setCopiedAlrajiAccNo(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedAlrajiAccNo ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* IBAN */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col overflow-hidden max-w-[80%]">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">IBAN</span>
                                                    <span className="text-[10px] font-extrabold font-mono tracking-wider text-neutral-900 dark:text-white break-all">{finalSaMethods.alRajhi?.iban || 'SA56 8000 0621 6080 1601 6528'}</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText((finalSaMethods.alRajhi?.iban || 'SA56 8000 0621 6080 1601 6528').replace(/\s/g, ''));
                                                      setCopiedAlrajiIban(true);
                                                      setTimeout(() => setCopiedAlrajiIban(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedAlrajiIban ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Swift Code */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Swift Code</span>
                                                    <span className="text-[11px] font-black font-mono text-neutral-900 dark:text-white">{finalSaMethods.alRajhi?.swift || 'RJHISARI'}</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      navigator.clipboard.writeText(finalSaMethods.alRajhi?.swift || 'RJHISARI');
                                                      setCopiedAlrajiSwift(true);
                                                      setTimeout(() => setCopiedAlrajiSwift(false), 2000);
                                                    }}
                                                    className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                                  >
                                                    {copiedAlrajiSwift ? (
                                                      <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                              </div>

                                              {/* Auto QR Generator */}
                                              <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center justify-center">
                                                <AutoCheckoutQrGenerator
                                                  gateway="Alraji Bank Transfer"
                                                  orderTotalFormatted={formatPriceInCart(total)}
                                                  orderTotalNumber={total}
                                                  currency={currency}
                                                  language={language}
                                                  triggerToast={triggerToast}
                                                  merchantNumber={finalSaMethods.alRajhi?.accountNumber || '621000010006086016528'}
                                                  accountName={finalSaMethods.alRajhi?.accountName || 'MD IMRAN HOSSAIN'}
                                                  defaultColorHex="1d4ed8"
                                                />
                                              </div>

                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Final Submit Guest Transaction Button block */}
                                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-slate-800">
                                    <div className="flex flex-col gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400 mb-2 text-left font-sans">
                                      <p className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span>Selected Mode: <strong className="text-indigo-600 dark:text-indigo-400">{selectedGuestGateway || (currency === 'SAR' ? 'STC Pay (+966 57 051 1931)' : currency === 'BDT' ? 'bKash Wallet' : 'USD Bank Transfer')}</strong></span>
                                      </p>
                                    </div>

                                    {/* Premium Checkbox for payment verification */}
                                    <div 
                                      className={`mb-4 flex items-start gap-3 p-3.5 rounded-[16px] border transition-all duration-300 select-none ${
                                        isPaymentConfirmed 
                                          ? 'bg-emerald-50/25 dark:bg-emerald-950/10 border-emerald-500/30' 
                                          : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151]'
                                      }`}
                                    >
                                      <div className="relative flex items-center h-5 mt-0.5">
                                        <motion.button
                                          type="button"
                                          onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                          className={`w-[22px] h-[22px] rounded-[7px] border flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/18 cursor-pointer ${
                                            isPaymentConfirmed
                                              ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                                              : 'bg-white dark:bg-[#111827] border-neutral-300 dark:border-neutral-700'
                                          }`}
                                          whileTap={{ scale: 0.9 }}
                                          animate={{ scale: isPaymentConfirmed ? 1.08 : 1 }}
                                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        >
                                          {isPaymentConfirmed && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                            >
                                              <Check className="w-4 h-4 text-white stroke-[3.5]" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      </div>
                                      <label
                                        onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                        className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] cursor-pointer leading-relaxed text-left"
                                      >
                                        {language === 'bn' 
                                          ? `আমি পেমেন্ট করেছি (${formatPriceInCart(total)})`
                                          : `I have Paid (${formatPriceInCart(total)})`}
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={handleSubmitGuestTransaction}
                                      className={`w-full py-3 px-4 font-bold rounded-xl text-white text-xs uppercase tracking-wide bg-gradient-to-r transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                        isPaymentConfirmed 
                                          ? 'from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-[0.98]' 
                                          : 'from-neutral-400 to-neutral-500 opacity-80 cursor-not-allowed'
                                      }`}
                                    >
                                      <span>Submit Transaction</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full">
                            {currency === 'USD' && (
                              <div className="grid grid-cols-1 gap-2 w-full">
                                {/* USD Bank Transfer */}
                                <button
                                  type="button"
                                  onClick={() => handleSimulatePayment('USD Bank Transfer')}
                                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500 transition-all cursor-pointer w-full text-center"
                                >
                                  <span className="text-xs font-black text-emerald-600">USD Bank Transfer</span>
                                  <span className="text-[9px] text-neutral-450 mt-1">Direct Bank Wire / SWIFT / routing</span>
                                </button>
                              </div>
                            )}

                            {currency === 'BDT' && (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                {/* bKash */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('bKash Wallet')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'bKash Wallet'
                                      ? 'border-pink-550 bg-pink-500/10 ring-2 ring-pink-500/40 dark:bg-pink-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-pink-500'
                                  }`}
                                >
                                  <span className="text-xs font-black text-pink-600">bKash (বিকাশ)</span>
                                  <span className="text-[9px] text-neutral-400">Instant Verification</span>
                                </button>

                                {/* Nagad */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('Nagad Digital')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'Nagad Digital'
                                      ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 dark:bg-orange-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-orange-500'
                                  }`}
                                >
                                  <span className="text-xs font-black text-orange-600">Nagad (নগদ)</span>
                                  <span className="text-[9px] text-neutral-400">Secure BD Wallet</span>
                                </button>

                                {/* Rocket */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('Rocket Wallet')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'Rocket Wallet'
                                      ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-600/40 dark:bg-purple-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-550'
                                  }`}
                                >
                                  <span className="text-xs font-black text-purple-600">Rocket (রকেট)</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Dutch-Bangla Bank</span>
                                </button>

                                {/* Cellfin */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('Cellfin Payment')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'Cellfin Payment'
                                      ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/40 dark:bg-sky-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-sky-500'
                                  }`}
                                >
                                  <span className="text-xs font-black text-sky-600">Cellfin Card</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Cellfin Wallet</span>
                                </button>

                                {/* Bank Transfer */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('Islami Bank Transfer')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer col-span-2 text-center ${selectedRegisteredGateway === 'Islami Bank Transfer' ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/40 dark:bg-emerald-950/20' : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500 hover:shadow-xs'}`}
                                >
                                  <span className="text-xs font-black text-emerald-600">Islami Bank Transfer</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Direct IBB Internet Net Banking</span>
                                </button>

                                {/* SSLCommerz */}
                                <button
                                  type="button"
                                  onClick={() => handleSimulatePayment('SSLCommerz Gateway')}
                                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-500 transition-all cursor-pointer col-span-2 text-center"
                                >
                                  <span className="text-xs font-bold text-cyan-600 font-sans">Online instant Pay</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Cards / Net Banking / Mobiles</span>
                                </button>

                                {/* Expanded payment description for BDT (Registered) */}
                                {['bKash Wallet', 'Nagad Digital', 'Rocket Wallet', 'Cellfin Payment'].includes(selectedRegisteredGateway) && (
                                  <div className="mt-4 p-3 rounded-xl border border-neutral-350 dark:border-slate-800 bg-neutral-50 dark:bg-[#070b14] text-center animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100">
                                    <div className="flex flex-col items-center">
                                      {/* Header */}
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-3 h-3 rounded-full animate-pulse ${
                                          selectedRegisteredGateway === 'bKash Wallet' ? 'bg-[#d1245e]' :
                                          selectedRegisteredGateway === 'Nagad Digital' ? 'bg-[#f15a22]' :
                                          selectedRegisteredGateway === 'Rocket Wallet' ? 'bg-[#8c2aeb]' : 'bg-[#0081d6]'
                                        }`} />
                                        <span className="text-xs font-black tracking-tight font-sans">
                                          {selectedRegisteredGateway === 'bKash Wallet' ? 'bKash Account Info (পার্সোনাল ওয়ালেট)' :
                                           selectedRegisteredGateway === 'Nagad Digital' ? 'Nagad Account Info (পার্সোনাল ওয়ালেট)' :
                                           selectedRegisteredGateway === 'Rocket Wallet' ? 'Rocket Account Info (রকেট ওয়ালেট)' : 'Cellfin Wallet Info (সেলফিন)'}
                                        </span>
                                      </div>

                                      {/* Auto QR Generator */}
                                      <AutoCheckoutQrGenerator
                                        gateway={selectedRegisteredGateway}
                                        orderTotalFormatted={formatPriceInCart(total)}
                                        orderTotalNumber={total}
                                        currency={currency}
                                        language={language}
                                        triggerToast={triggerToast}
                                        merchantNumber="01864000005"
                                        defaultColorHex={
                                          selectedRegisteredGateway === 'bKash Wallet' ? 'd1245e' :
                                          selectedRegisteredGateway === 'Nagad Digital' ? 'f15a22' :
                                          selectedRegisteredGateway === 'Rocket Wallet' ? '8c2aeb' : '0081d6'
                                        }
                                      />

                                      {/* Instructions & Phone Number */}
                                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-3 leading-relaxed max-w-sm">
                                        {selectedRegisteredGateway === 'bKash Wallet' ? (language === 'bn' ? 'আমাদের বিকাশ নাম্বারে সেন্ড মানি অথবা পার্সোনাল টু পার্সোনাল ট্রান্সফার সম্পন্ন করুন।' : 'Send Money or Personal transfer directly to our bKash personal wallet.') :
                                         selectedRegisteredGateway === 'Nagad Digital' ? (language === 'bn' ? 'আমাদের নগদ নাম্বারে সরাসরি টাকা পাঠিয়ে আপনার ট্রানজেকশন ক্লিয়ার করুন।' : 'Send Money directly to our secure Nagad Personal Wallet.') :
                                         selectedRegisteredGateway === 'Rocket Wallet' ? (language === 'bn' ? 'ডাচ বাংলা ব্যাংক রকেট ওয়ালেট সার্ভিস ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন।' : 'Direct Mobile Cash-in or Send Money via Rocket wallet.') :
                                         (language === 'bn' ? 'ইসলামী ব্যাংক সেলফিন অ্যাকাউন্টে সহজে ফান্ড ট্রান্সফার বা টাকা পাঠান।' : 'Initiate prompt cellfin transfer directly to our wallet.')}
                                      </p>

                                      <div className="w-full flex flex-col items-center bg-neutral-100 dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-205 dark:border-slate-850 max-w-xs mb-3">
                                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-black block mb-0.5">{language === 'bn' ? 'ওয়ালেট নাম্বার' : 'WALLET NUMBER'}</span>
                                        <span className="text-base font-extrabold font-mono tracking-wider text-neutral-900 dark:text-white">0186400 0005</span>
                                        
                                        {/* Copy Number Button */}
                                        <motion.button
                                          type="button"
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => {
                                            navigator.clipboard.writeText('01864000005');
                                            setBdtPaymentCopied(true);
                                            setTimeout(() => setBdtPaymentCopied(false), 2000);
                                          }}
                                          className={`mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[10px] uppercase font-black tracking-wider transition-all duration-300 cursor-pointer w-full shadow-md ${
                                            bdtPaymentCopied 
                                              ? 'bg-emerald-600 shadow-emerald-600/20' 
                                              : selectedRegisteredGateway === 'bKash Wallet' ? 'bg-[#d1245e] hover:bg-[#b01e4f] shadow-rose-600/10' :
                                                selectedRegisteredGateway === 'Nagad Digital' ? 'bg-[#f15a22] hover:bg-[#d94815] shadow-orange-600/10' :
                                                selectedRegisteredGateway === 'Rocket Wallet' ? 'bg-[#8c2aeb] hover:bg-[#771ecf] shadow-purple-600/10' : 'bg-[#0081d6] hover:bg-[#006cb3] shadow-sky-600/10'
                                          }`}
                                        >
                                          {bdtPaymentCopied ? (
                                            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-white" /> {language === 'bn' ? 'কপি সফল হয়েছে!' : 'Number Copied!'}</span>
                                          ) : (
                                            <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> {language === 'bn' ? 'নাম্বার কপি করুন' : 'Copy Number'}</span>
                                          )}
                                        </motion.button>
                                      </div>

                                      {/* Payment Sender Information Fields */}
                                      <div className="w-full space-y-4 mt-3 mb-4 text-left border-t border-dashed border-neutral-200 dark:border-slate-800 pt-3">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                          <span className="text-[10px] font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                            {language === 'bn' ? 'পেমেন্ট তথ্য প্রদান করুন' : 'Verify Payment Details'}
                                          </span>
                                        </div>
                                        
                                        {/* Sender Name */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-mfs-sender-name"
                                            placeholder=" "
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-mfs-sender-name"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'প্রেরকের নাম (Sender Name) *' : 'Sender Name *'}
                                          </label>
                                        </div>

                                        {/* Sender Phone */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-mfs-sender-phone"
                                            placeholder=" "
                                            value={senderNumber}
                                            onChange={(e) => setSenderNumber(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-mfs-sender-phone"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'প্রেরকের নম্বর (Sender Mobile/Acc Number) *' : 'Sender Phone / Account No *'}
                                          </label>
                                        </div>

                                        {/* Transaction ID */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-mfs-sender-trx"
                                            placeholder=" "
                                            value={senderTrxId}
                                            onChange={(e) => setSenderTrxId(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-mono font-bold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-mfs-sender-trx"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'ট্রানজেকশন আইডি (Transaction ID) *' : 'Transaction ID (TrxID) *'}
                                          </label>
                                        </div>
                                      </div>

                                      {/* Premium Checkbox for payment verification */}
                                      <div 
                                        className={`mb-3 flex items-start gap-3 p-3.5 rounded-[16px] border transition-all duration-300 select-none ${
                                          isPaymentConfirmed 
                                            ? 'bg-emerald-50/25 dark:bg-emerald-950/10 border-emerald-500/30' 
                                            : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151]'
                                        }`}
                                      >
                                        <div className="relative flex items-center h-5 mt-0.5">
                                          <motion.button
                                            type="button"
                                            onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                            className={`w-[22px] h-[22px] rounded-[7px] border flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/18 cursor-pointer ${
                                              isPaymentConfirmed
                                                ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                                                : 'bg-white dark:bg-[#111827] border-neutral-300 dark:border-neutral-700'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{ scale: isPaymentConfirmed ? 1.08 : 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                          >
                                            {isPaymentConfirmed && (
                                              <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                              >
                                                <Check className="w-4 h-4 text-white stroke-[3.5]" />
                                              </motion.div>
                                            )}
                                          </motion.button>
                                        </div>
                                        <label
                                          onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                          className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] cursor-pointer leading-relaxed text-left"
                                        >
                                          {language === 'bn' 
                                            ? `আমি পেমেন্ট করেছি (${formatPriceInCart(total)})`
                                            : `I have Paid (${formatPriceInCart(total)})`}
                                        </label>
                                      </div>

                                      {/* Submit button for Registered */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleSimulatePayment(selectedRegisteredGateway);
                                          setSelectedRegisteredGateway('');
                                        }}
                                        className={`w-full py-3 px-4 font-bold rounded-xl text-white text-xs uppercase tracking-wide bg-gradient-to-r transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                          isPaymentConfirmed 
                                            ? 'from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-[0.98]' 
                                            : 'from-neutral-400 to-neutral-500 opacity-80 cursor-not-allowed'
                                        }`}
                                      >
                                        <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm & Place Order'}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Islami Bank Transfer Expanded Panel (Registered Checkout) */}
                                {selectedRegisteredGateway === 'Islami Bank Transfer' && (
                                  <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 bg-neutral-50 dark:bg-[#0b0f19] text-left animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100">
                                    <div className="flex flex-col gap-4">
                                      {/* Bank Header */}
                                      <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800">
                                        <div className="p-2 bg-emerald-600 rounded-lg text-white font-black tracking-wider text-xs font-sans">
                                          IBBL
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-black tracking-tight text-neutral-900 dark:text-white font-sans">
                                            {language === 'bn' ? 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড' : 'Islami Bank Bangladesh Ltd.'}
                                          </h4>
                                          <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-mono font-bold block">
                                            Direct IBBL Online Banking Transfer
                                          </span>
                                        </div>
                                      </div>

                                      {/* Grid layout for bank details and QR code */}
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch font-sans">
                                        
                                        {/* Details */}
                                        <div className="md:col-span-7 flex flex-col gap-2">
                                          
                                          {/* Account Name */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম' : 'Account Name'}</span>
                                              <span className="text-xs font-black text-neutral-900 dark:text-white">MD IMRAN HOSSAIN</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('MD IMRAN HOSSAIN');
                                                setCopiedBankAccName(true);
                                                setTimeout(() => setCopiedBankAccName(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedBankAccName ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                          {/* Account No */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম্বার' : 'Account No'}</span>
                                              <span className="text-sm font-black font-mono tracking-wider text-neutral-900 dark:text-white">20501290204369912</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('20501290204369912');
                                                setCopiedBankAccNo(true);
                                                setTimeout(() => setCopiedBankAccNo(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedBankAccNo ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                          {/* Branch */}
                                          <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs flex justify-between items-center text-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'শাখা / ব্রাঞ্চ' : 'Branch'}</span>
                                              <span className="font-extrabold text-neutral-900 dark:text-white">New Market Dhaka</span>
                                            </div>
                                            <span className="text-[10px] text-emerald-600 font-bold font-mono">IBBL BD</span>
                                          </div>

                                          {/* Routing No */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'রাউটিং নাম্বার' : 'Routing No'}</span>
                                              <span className="text-xs font-extrabold font-mono text-neutral-900 dark:text-white">125263522</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('125263522');
                                                setCopiedBankRouting(true);
                                                setTimeout(() => setCopiedBankRouting(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedBankRouting ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                        </div>

                                        {/* QR System */}
                                        <div className="md:col-span-5 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-3 rounded-lg border border-neutral-150 dark:border-slate-800 shadow-xs text-center">
                                          <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">{language === 'bn' ? 'কিউআর কোড (পেমেন্ট)' : 'Scan QR for Banking'}</span>
                                          <div className="w-[115px] h-[115px] bg-neutral-50 dark:bg-[#0c1222] p-1.5 rounded border border-neutral-200 dark:border-slate-800 flex items-center justify-center">
                                            <img 
                                              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=059669&data=MD+IMRAN+HOSSAIN+A/C+20501290204369912+IBBL+New+Market+Dhaka+Routing+125263522" 
                                              alt="IBBL QR Code" 
                                              className="max-w-full max-h-full object-contain pointer-events-none"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          <span className="text-[8px] text-neutral-400 font-bold mt-2 leading-tight">
                                            {language === 'bn' ? 'ইসলামী ব্যাংক অ্যাপ বা যেকোনো সেলফিন দিয়ে স্ক্যান করুন' : 'Scan via Cellfin or IBBL Smart app'}
                                          </span>
                                        </div>

                                      </div>

                                      {/* Payment Sender Information Fields */}
                                      <div className="w-full space-y-4 mt-3 mb-4 text-left border-t border-dashed border-neutral-200 dark:border-slate-800 pt-3 font-sans">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                          <span className="text-[10px] font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                            {language === 'bn' ? 'পেমেন্ট তথ্য প্রদান করুন' : 'Verify Payment Details'}
                                          </span>
                                        </div>
                                        
                                        {/* Sender Name */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-ibbl-sender-name"
                                            placeholder=" "
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-ibbl-sender-name"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'প্রেরকের নাম (Sender Name) *' : 'Sender Name *'}
                                          </label>
                                        </div>

                                        {/* Sender Phone */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-ibbl-sender-phone"
                                            placeholder=" "
                                            value={senderNumber}
                                            onChange={(e) => setSenderNumber(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-ibbl-sender-phone"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'প্রেরকের নম্বর (Sender Mobile/Acc Number) *' : 'Sender Phone / Account No *'}
                                          </label>
                                        </div>

                                        {/* Transaction ID */}
                                        <div className="relative">
                                          <input
                                            type="text"
                                            id="reg-ibbl-sender-trx"
                                            placeholder=" "
                                            value={senderTrxId}
                                            onChange={(e) => setSenderTrxId(e.target.value)}
                                            className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-mono font-bold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                            required
                                          />
                                          <label
                                            htmlFor="reg-ibbl-sender-trx"
                                            className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                          >
                                            {language === 'bn' ? 'ট্রানজেকশন আইডি (Transaction ID) *' : 'Transaction ID (TrxID) *'}
                                          </label>
                                        </div>
                                      </div>

                                      {/* Premium Checkbox for payment verification */}
                                      <div 
                                        className={`mb-3 flex items-start gap-3 p-3.5 rounded-[16px] border transition-all duration-300 select-none ${
                                          isPaymentConfirmed 
                                            ? 'bg-emerald-50/25 dark:bg-emerald-950/10 border-emerald-500/30' 
                                            : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151]'
                                        }`}
                                      >
                                        <div className="relative flex items-center h-5 mt-0.5">
                                          <motion.button
                                            type="button"
                                            onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                            className={`w-[22px] h-[22px] rounded-[7px] border flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/18 cursor-pointer ${
                                              isPaymentConfirmed
                                                ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                                                : 'bg-white dark:bg-[#111827] border-neutral-300 dark:border-neutral-700'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{ scale: isPaymentConfirmed ? 1.08 : 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                          >
                                            {isPaymentConfirmed && (
                                              <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                              >
                                                <Check className="w-4 h-4 text-white stroke-[3.5]" />
                                              </motion.div>
                                            )}
                                          </motion.button>
                                        </div>
                                        <label
                                          onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                          className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] cursor-pointer leading-relaxed text-left"
                                        >
                                          {language === 'bn' 
                                            ? `আমি পেমেন্ট করেছি (${formatPriceInCart(total)})`
                                            : `I have Paid (${formatPriceInCart(total)})`}
                                        </label>
                                      </div>

                                      {/* Place Order Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleSimulatePayment('Islami Bank Transfer');
                                          setSelectedRegisteredGateway('');
                                        }}
                                        className={`w-full py-3 px-4 font-bold rounded-xl text-white text-xs uppercase tracking-wide bg-gradient-to-r transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                          isPaymentConfirmed 
                                            ? 'from-emerald-600 to-emerald-700 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)] active:scale-[0.98]' 
                                            : 'from-neutral-400 to-neutral-500 opacity-80 cursor-not-allowed'
                                        }`}
                                      >
                                        <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm & Place Order'}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {currency === 'SAR' && (
                              <div className="grid grid-cols-2 gap-2 w-full font-sans">
                                {/* STC Pay */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('STC Pay (+966 57 051 1931)')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'STC Pay (+966 57 051 1931)'
                                      ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-600/40 dark:bg-purple-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-600'
                                  }`}
                                >
                                  <span className="text-xs font-black text-purple-600">STC Pay</span>
                                  <span className="text-[9px] text-neutral-450 mt-0.5">Saudi Digital Wallet</span>
                                </button>

                                {/* Alrajhi Bank Transfer */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegisteredGateway('Alraji Bank Transfer')}
                                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                                    selectedRegisteredGateway === 'Alraji Bank Transfer'
                                      ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-600/40 dark:bg-blue-950/20'
                                      : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-600'
                                  }`}
                                >
                                  <span className="text-xs font-black text-blue-600">Alraji Bank</span>
                                  <span className="text-[9px] text-neutral-450 mt-0.5">Bank Wire Transfer</span>
                                </button>

                                {/* STC Pay Expanded Block details */}
                                {selectedRegisteredGateway === 'STC Pay (+966 57 051 1931)' && (
                                  <div className="mt-2 p-3 rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 text-center animate-in fade-in slide-in-from-top-2 duration-205 col-span-2">
                                    <p className="text-[11px] font-black text-purple-700 dark:text-purple-400 mb-1">
                                      {language === 'bn' ? 'কোড স্ক্যান করুন পেমেন্ট করার জন্য' : 'Scan QR code to pay using STC Pay app'}
                                    </p>

                                    {/* Auto QR Generator */}
                                    <AutoCheckoutQrGenerator
                                      gateway="STC Pay"
                                      orderTotalFormatted={formatPriceInCart(total)}
                                      orderTotalNumber={total}
                                      currency={currency}
                                      language={language}
                                      triggerToast={triggerToast}
                                      merchantNumber="+966 57 051 1931"
                                      accountName="Imran Hasan"
                                      defaultColorHex="7c3aed"
                                    />

                                    <div className="flex flex-col items-center mb-3">
                                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold bg-purple-100/50 dark:bg-purple-950/40 py-1.5 rounded-md px-2 inline-block w-full text-center">
                                        {language === 'bn' ? 'নম্বর: +966 57 051 1931 (ইমরান হাসান)' : 'Wallet Number: +966 57 051 1931 (Imran Hasan)'}
                                      </p>
                                      <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => {
                                          navigator.clipboard.writeText('+966 57 051 1931');
                                          setStcPayCopied(true);
                                          setTimeout(() => setStcPayCopied(false), 2000);
                                        }}
                                        className={`mt-1.5 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-white text-[10px] uppercase font-bold transition-all duration-300 cursor-pointer w-full shadow-xs ${
                                          stcPayCopied 
                                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                                            : 'bg-purple-600 hover:bg-purple-750'
                                        }`}
                                      >
                                        <AnimatePresence mode="wait">
                                          {stcPayCopied ? (
                                            <motion.div
                                              key="copied"
                                              initial={{ opacity: 0, scale: 0.8 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              exit={{ opacity: 0, scale: 0.8 }}
                                              transition={{ duration: 0.15 }}
                                              className="flex items-center gap-1.5"
                                            >
                                              <Check className="w-3.5 h-3.5 text-white" />
                                              <span>{language === 'bn' ? 'কপি করা হয়েছে!' : 'Number Copied!'}</span>
                                            </motion.div>
                                          ) : (
                                            <motion.div
                                              key="copy"
                                              initial={{ opacity: 0, scale: 0.8 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              exit={{ opacity: 0, scale: 0.8 }}
                                              transition={{ duration: 0.15 }}
                                              className="flex items-center gap-1.5"
                                            >
                                              <Copy className="w-3.5 h-3.5" />
                                              <span>{language === 'bn' ? 'নম্বর কপি করুন' : 'Copy Number'}</span>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.button>
                                    </div>

                                    {/* 3 Verification Fields */}
                                    <div className="w-full space-y-2.5 mt-4 text-left border-t border-dashed border-neutral-300 dark:border-slate-800 pt-3">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-[10px] font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                          {language === 'bn' ? 'পেমেন্ট তথ্য প্রদান করুন' : 'Verify Payment Details'}
                                        </span>
                                      </div>
                                      
                                      {/* Sender Name */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-stc-sender-name"
                                          placeholder=" "
                                          value={senderName}
                                          onChange={(e) => setSenderName(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-stc-sender-name"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'প্রেরকের নাম (Sender Name) *' : 'Sender Name *'}
                                        </label>
                                      </div>

                                      {/* Sender Phone */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-stc-sender-phone"
                                          placeholder=" "
                                          value={senderNumber}
                                          onChange={(e) => setSenderNumber(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-stc-sender-phone"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'প্রেরকের নম্বর (Sender Mobile/Acc Number) *' : 'Sender Phone / Account No *'}
                                        </label>
                                      </div>

                                      {/* Transaction ID */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-stc-sender-trx"
                                          placeholder=" "
                                          value={senderTrxId}
                                          onChange={(e) => setSenderTrxId(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-mono font-bold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-stc-sender-trx"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'ট্রানজেকশন আইডি (Transaction ID) *' : 'Transaction ID *'}
                                        </label>
                                      </div>
                                    </div>

                                    {/* Premium Checkbox for payment verification */}
                                    <div 
                                      className={`mb-3 flex items-start gap-3 p-3.5 rounded-[16px] border transition-all duration-300 select-none ${
                                        isPaymentConfirmed 
                                          ? 'bg-emerald-50/25 dark:bg-emerald-950/10 border-emerald-500/30' 
                                          : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151]'
                                      }`}
                                    >
                                      <div className="relative flex items-center h-5 mt-0.5">
                                        <motion.button
                                          type="button"
                                          onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                          className={`w-[22px] h-[22px] rounded-[7px] border flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/18 cursor-pointer ${
                                            isPaymentConfirmed
                                              ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                                              : 'bg-white dark:bg-[#111827] border-neutral-300 dark:border-neutral-700'
                                          }`}
                                          whileTap={{ scale: 0.9 }}
                                          animate={{ scale: isPaymentConfirmed ? 1.08 : 1 }}
                                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        >
                                          {isPaymentConfirmed && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                            >
                                              <Check className="w-4 h-4 text-white stroke-[3.5]" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      </div>
                                      <label
                                        onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                        className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] cursor-pointer leading-relaxed text-left"
                                      >
                                        {language === 'bn' 
                                          ? `আমি পেমেন্ট করেছি (${formatPriceInCart(total)})`
                                          : `I have Paid (${formatPriceInCart(total)})`}
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleSimulatePayment('STC Pay (+966 57 051 1931)')}
                                      className={`w-full py-3 px-4 font-bold rounded-xl text-white text-xs uppercase tracking-wide bg-gradient-to-r transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                        isPaymentConfirmed 
                                          ? 'from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-[0.98]' 
                                          : 'from-neutral-400 to-neutral-500 opacity-80 cursor-not-allowed'
                                      }`}
                                    >
                                      <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm & Place Order'}</span>
                                    </button>
                                  </div>
                                )}

                                {/* Alraji Bank Expanded Block details */}
                                {selectedRegisteredGateway === 'Alraji Bank Transfer' && (
                                  <div className="mt-4 p-4 rounded-xl border border-blue-500/30 dark:border-blue-500/25 bg-neutral-50 dark:bg-[#0b0f19] text-left animate-in fade-in slide-in-from-top-2 duration-205 col-span-2 text-neutral-800 dark:text-neutral-100 font-sans">
                                    <div className="flex flex-col gap-4">
                                      {/* Bank Header */}
                                      <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800">
                                        <div className="p-2 bg-blue-600 rounded-lg text-white font-black tracking-wider text-xs uppercase font-sans">
                                          Alrajhi
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-black tracking-tight text-neutral-900 dark:text-white font-sans">
                                            {language === 'bn' ? 'আল রাজি ব্যাংক সৌদি আরব' : 'Al Rajhi Bank Saudi Arabia 🇸🇦'}
                                          </h4>
                                          <span className="text-[10px] text-blue-600 dark:text-blue-450 font-mono font-bold block">
                                            Direct Al Rajhi Bank Transfer Details
                                          </span>
                                        </div>
                                      </div>

                                      {/* Grid layout for bank details and QR code */}
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                                        
                                        {/* Details */}
                                        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-2">
                                          
                                          {/* Account Name */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম (Account Name)' : 'Account Name'}</span>
                                              <span className="text-[11px] font-black text-neutral-900 dark:text-white">MD IMRAN HOSSAIN</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('MD IMRAN HOSSAIN');
                                                setCopiedAlrajiAccName(true);
                                                setTimeout(() => setCopiedAlrajiAccName(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedAlrajiAccName ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                          {/* Account No */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'অ্যাকাউন্ট নাম্বার' : 'Account No'}</span>
                                              <span className="text-[11px] font-black font-mono tracking-wider text-neutral-900 dark:text-white">621000010006086016528</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('621000010006086016528');
                                                setCopiedAlrajiAccNo(true);
                                                setTimeout(() => setCopiedAlrajiAccNo(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedAlrajiAccNo ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                          {/* IBAN */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col overflow-hidden max-w-[80%]">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">IBAN</span>
                                              <span className="text-[10px] font-extrabold font-mono tracking-wider text-neutral-900 dark:text-white break-all">SA56 8000 0621 6080 1601 6528</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('SA5680000621608016016528');
                                                setCopiedAlrajiIban(true);
                                                setTimeout(() => setCopiedAlrajiIban(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedAlrajiIban ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                          {/* Swift Code */}
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-slate-800 shadow-xs">
                                            <div className="flex flex-col">
                                              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Swift Code</span>
                                              <span className="text-[11px] font-black font-mono text-neutral-900 dark:text-white">RJHISARI</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard.writeText('RJHISARI');
                                                setCopiedAlrajiSwift(true);
                                                setTimeout(() => setCopiedAlrajiSwift(false), 2000);
                                              }}
                                              className="p-1 px-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold shrink-0 text-neutral-600 dark:text-neutral-300"
                                            >
                                              {copiedAlrajiSwift ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-500" />
                                                  <span className="text-[9px] text-emerald-600 font-bold">{language === 'bn' ? 'কপিড' : 'Copied'}</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3 text-neutral-400" />
                                                  <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                                                </>
                                              )}
                                            </button>
                                          </div>

                                        </div>

                                        {/* QR System */}
                                        <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-3 rounded-lg border border-neutral-150 dark:border-slate-800 shadow-xs text-center">
                                          <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">{language === 'bn' ? 'কিউআর কোড (পেমেন্ট)' : 'Scan QR for Banking'}</span>
                                          <div className="w-[115px] h-[115px] bg-neutral-50 dark:bg-[#0c1222] p-1.5 rounded border border-neutral-200 dark:border-slate-800 flex items-center justify-center">
                                            <img 
                                              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=1d4ed8&data=Al+Rajhi+Bank+Account+Name:+MD+IMRAN+HOSSAIN+Account+No:+621000010006086016528+IBAN:+SA5680000621608016016528+Swift+Code:+RJHISARI" 
                                              alt="Al Rajhi Bank QR Code" 
                                              className="max-w-full max-h-full object-contain pointer-events-none"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          <span className="text-[8px] text-neutral-400 font-bold mt-2 leading-tight">
                                            {language === 'bn' ? 'আল রাজি ব্যাংক অ্যাপ দিয়ে স্ক্যান করুন' : 'Scan via Al Rajhi Bank app'}
                                          </span>
                                        </div>

                                      </div>
                                    </div>

                                    {/* 3 Verification Fields */}
                                    <div className="w-full space-y-2.5 mt-4 text-left border-t border-dashed border-neutral-350 dark:border-slate-800 pt-3 text-neutral-800 dark:text-neutral-100">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-[10px] font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                          {language === 'bn' ? 'পেমেন্ট তথ্য প্রদান করুন' : 'Verify Payment Details'}
                                        </span>
                                      </div>
                                      
                                      {/* Sender Name */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-alraji-sender-name"
                                          placeholder=" "
                                          value={senderName}
                                          onChange={(e) => setSenderName(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-alraji-sender-name"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'প্রেরকের নাম (Sender Name) *' : 'Sender Name *'}
                                        </label>
                                      </div>

                                      {/* Sender Phone */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-alraji-sender-phone"
                                          placeholder=" "
                                          value={senderNumber}
                                          onChange={(e) => setSenderNumber(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-alraji-sender-phone"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'প্রেরকের নম্বর (Sender Mobile/Acc Number) *' : 'Sender Phone / Account No *'}
                                        </label>
                                      </div>

                                      {/* Transaction ID */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          id="reg-alraji-sender-trx"
                                          placeholder=" "
                                          value={senderTrxId}
                                          onChange={(e) => setSenderTrxId(e.target.value)}
                                          className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-mono font-bold text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                                          required
                                        />
                                        <label
                                          htmlFor="reg-alraji-sender-trx"
                                          className="absolute left-4 top-1.5 text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] uppercase tracking-wider cursor-text pointer-events-none"
                                        >
                                          {language === 'bn' ? 'ট্রানজেকশন আইডি (Transaction ID) *' : 'Transaction ID *'}
                                        </label>
                                      </div>
                                    </div>

                                    {/* Premium Checkbox for payment verification */}
                                    <div 
                                      className={`mb-3 flex items-start gap-3 p-3.5 rounded-[16px] border transition-all duration-300 select-none ${
                                        isPaymentConfirmed 
                                          ? 'bg-emerald-50/25 dark:bg-emerald-950/10 border-emerald-500/30' 
                                          : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151]'
                                      }`}
                                    >
                                      <div className="relative flex items-center h-5 mt-0.5">
                                        <motion.button
                                          type="button"
                                          onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                          className={`w-[22px] h-[22px] rounded-[7px] border flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/18 cursor-pointer ${
                                            isPaymentConfirmed
                                              ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                                              : 'bg-white dark:bg-[#111827] border-neutral-300 dark:border-neutral-700'
                                          }`}
                                          whileTap={{ scale: 0.9 }}
                                          animate={{ scale: isPaymentConfirmed ? 1.08 : 1 }}
                                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        >
                                          {isPaymentConfirmed && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                            >
                                              <Check className="w-4 h-4 text-white stroke-[3.5]" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      </div>
                                      <label
                                        onClick={() => setIsPaymentConfirmed(!isPaymentConfirmed)}
                                        className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] cursor-pointer leading-relaxed text-left"
                                      >
                                        {language === 'bn' 
                                          ? `আমি পেমেন্ট করেছি (${formatPriceInCart(total)})`
                                          : `I have Paid (${formatPriceInCart(total)})`}
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleSimulatePayment('Alraji Bank Transfer')}
                                      className={`w-full py-3 px-4 font-bold rounded-xl text-white text-xs uppercase tracking-wide bg-gradient-to-r transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                        isPaymentConfirmed 
                                          ? 'from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(37,99,235,0.35)] active:scale-[0.98]' 
                                          : 'from-neutral-400 to-neutral-500 opacity-80 cursor-not-allowed'
                                      }`}
                                    >
                                      <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm & Place Order'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-[9px] text-center text-neutral-400 leading-normal">
                          🛡️ SSL Secure Handshake active. Authorized via WebzoneBD IT Solution.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 PREMIUM SAAS-GRADE CONGRATULATIONS SUCCESS POPUP */}
      <AnimatePresence>
        {isSuccessPopupOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0F172A] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/10 dark:border-white/5 text-left p-6 sm:p-8 space-y-6"
              id="congratulations-success-popup"
            >
              {/* Top Premium Color Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

              {/* Glowing Success Icon & Confetti Stars */}
              <div className="flex flex-col items-center justify-center text-center space-y-4 pt-2 relative overflow-visible">
                <div className="relative">
                  {/* Expanding Ripple Rings */}
                  <motion.div 
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.6, 2], opacity: [0.5, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 bg-emerald-500/20 rounded-full"
                  />
                  <motion.div 
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 bg-emerald-500/10 rounded-full"
                  />
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                  
                  {/* Micro Star Particles (Success Confetti Shoot Out) */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 360) / 8;
                    const radius = 60;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full z-10"
                        style={{
                          backgroundColor: i % 3 === 0 ? '#7C3AED' : i % 3 === 1 ? '#EC4899' : '#10B981',
                          left: 'calc(50% - 4px)',
                          top: 'calc(50% - 4px)',
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0.2 }}
                        animate={{ 
                          x: x, 
                          y: y, 
                          opacity: [1, 1, 0], 
                          scale: [0.2, 1.2, 0] 
                        }}
                        transition={{ 
                          duration: 1.4, 
                          delay: 0.1,
                          ease: "easeOut"
                        }}
                      />
                    );
                  })}

                  <motion.div 
                    initial={{ scale: 0, rotate: -60 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="relative w-16 h-16 rounded-full bg-[#DCFCE7] border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shadow-[0_8px_20px_rgba(34,197,94,0.15)]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.25, 1] }}
                      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    >
                      <Check className="w-8 h-8 stroke-[3.5]" />
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডার সফল হয়েছে' : 'Congratulations! Order Logged'}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'আপনার পেমেন্ট অর্ডারটি যাচাইকরণের জন্য সফলভাবে সিস্টেমে যুক্ত করা হয়েছে।' : 'Your digital purchase payment order has been securely locked & logged.'}
                  </p>
                </div>
              </div>

              {/* Premium Details Brief Card */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-[18px] p-5 space-y-3.5 shadow-sm">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                  <span>ORDER ID:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-extrabold">{successOrderId}</span>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start text-xs sm:text-sm">
                    <span className="font-semibold text-[#475569] dark:text-[#CBD5E1]">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-right max-w-[200px] truncate">{successRecipientName}</span>
                  </div>

                  <div className="flex justify-between items-start text-xs sm:text-sm">
                    <span className="font-semibold text-[#475569] dark:text-[#CBD5E1]">{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</span>
                    <span className="font-extrabold text-violet-600 dark:text-violet-400">{successPaymentMethod}</span>
                  </div>

                  {successTransactionId && (
                    <div className="flex justify-between items-start text-xs sm:text-sm bg-violet-500/10 dark:bg-violet-950/40 p-2 rounded-xl border border-violet-500/20">
                      <span className="font-semibold text-violet-700 dark:text-violet-300">{language === 'bn' ? 'ট্রানজেকশন আইডি:' : 'Transaction ID:'}</span>
                      <span className="font-mono font-bold text-violet-800 dark:text-violet-200 text-right select-all">{successTransactionId}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200/40 dark:border-slate-800/40 my-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {language === 'bn' ? 'ক্রয়কৃত প্রোডাক্টসমূহ:' : 'Purchased Products:'}
                    </span>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {successItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#475569] dark:text-[#CBD5E1] truncate max-w-[220px]">{item.name}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {currency === 'BDT' ? `৳${Math.round(item.price * 115).toLocaleString()}` : currency === 'SAR' ? `${Math.round(item.price * 3.75).toLocaleString()} SAR` : `$${item.price.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-start text-xs sm:text-sm border-t border-slate-200/40 dark:border-slate-800/40 pt-2 font-bold">
                    <span className="font-bold text-slate-900 dark:text-white">{language === 'bn' ? 'মোট পেমেন্ট সম্পন্ন:' : 'Total Amount Paid:'}</span>
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-sm sm:text-base">
                      {currency === 'BDT' ? `৳${Math.round(successTotal * 115).toLocaleString()}` : currency === 'SAR' ? `${Math.round(successTotal * 3.75).toLocaleString()} SAR` : `$${successTotal.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Close / Direct WhatsApp verify CTA */}
              <div className="flex flex-col gap-2.5 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const formattedTotal = currency === 'BDT' 
                      ? `৳${Math.round(successTotal * 115).toLocaleString()}` 
                      : currency === 'SAR' 
                        ? `${Math.round(successTotal * 3.75).toLocaleString()} SAR` 
                        : `$${successTotal.toLocaleString()}`;

                    sendOrderToWhatsApp({
                      orderId: successOrderId,
                      customerName: successRecipientName || 'Customer',
                      amount: formattedTotal,
                      currency: currency,
                      paymentMethod: successPaymentMethod || 'Digital Payment',
                      transactionId: successTransactionId || undefined,
                      items: successItems.map(item => ({
                        name: item.name,
                        price: currency === 'BDT' 
                          ? `৳${Math.round(item.price * 115).toLocaleString()}` 
                          : currency === 'SAR' 
                            ? `${Math.round(item.price * 3.75).toLocaleString()} SAR` 
                            : `$${item.price.toLocaleString()}`
                      })),
                      targetPhone: '8801864000005',
                      language: language as any,
                    });

                    if (triggerToast) {
                      triggerToast(language === 'bn' ? "হোয়াটসঅ্যাপে অর্ডারের বিবরণ পাঠানো হচ্ছে..." : "Sending order details to WhatsApp... 📲");
                    }
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-[14px] shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer select-none"
                >
                  <MessageSquare className="w-4 h-4 text-white animate-bounce" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডারের বিবরণ পাঠান (Confirm Order)' : 'Send Order Details to WhatsApp (Confirm Order)'}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const formattedTotal = currency === 'BDT' 
                      ? `৳${Math.round(successTotal * 115).toLocaleString()}` 
                      : currency === 'SAR' 
                        ? `${Math.round(successTotal * 3.75).toLocaleString()} SAR` 
                        : `$${successTotal.toLocaleString()}`;

                    const summaryText = constructWhatsAppOrderSummaryMessage({
                      orderId: successOrderId,
                      customerName: successRecipientName || 'Customer',
                      amount: formattedTotal,
                      currency: currency,
                      paymentMethod: successPaymentMethod || 'Digital Payment',
                      transactionId: successTransactionId || undefined,
                      items: successItems.map(item => ({
                        name: item.name,
                        price: currency === 'BDT' 
                          ? `৳${Math.round(item.price * 115).toLocaleString()}` 
                          : currency === 'SAR' 
                            ? `${Math.round(item.price * 3.75).toLocaleString()} SAR` 
                            : `$${item.price.toLocaleString()}`
                      })),
                      targetPhone: '8801864000005',
                      language: language as any,
                    });

                    navigator.clipboard.writeText(summaryText);
                    setCopiedOrderMsg(true);
                    setTimeout(() => setCopiedOrderMsg(false), 2500);
                    if (triggerToast) {
                      triggerToast(language === 'bn' ? "অর্ডারের টেক্সট বিবরণ কপি করা হয়েছে!" : "Order summary text copied to clipboard! 📋");
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold uppercase tracking-wider rounded-[14px] border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {copiedOrderMsg ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-400">{language === 'bn' ? 'কপি সম্পন্ন হয়েছে!' : 'Message Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'bn' ? 'অর্ডার মেসেজ কপি করুন (Copy Message)' : 'Copy Order Summary Message'}</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setIsSuccessPopupOpen(false)}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs uppercase font-bold tracking-wider rounded-[14px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none border border-slate-200/80 dark:border-slate-700/60"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'bn' ? 'ঠিক আছে, খেলা চালিয়ে যান' : 'Perfect, Continue'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
