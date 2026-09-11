import React, { useState, useEffect } from 'react';
import {
  Palette,
  Eye,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Sun,
  Moon,
  Laptop,
  Copy,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Send,
  Search,
  CheckSquare,
  Square,
  Radio,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { SystemConfig } from '../types';

interface LiveThemePreviewerProps {
  language: 'en' | 'bn' | 'ar';
  theme: 'light' | 'dark';
  systemConfig: SystemConfig;
  updateSystemConfig: (cfg: SystemConfig) => void;
  triggerToast: (msg: string) => void;
  logAdminAction?: (action: string) => void;
}

export interface PresetTheme {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary: string;
  endAccent: string;
  gradient: string;
  borderRadius: string;
  description: string;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'stripe-purple',
    name: 'Stripe SaaS Purple',
    category: 'Enterprise SaaS',
    primary: '#7C3AED',
    secondary: '#A855F7',
    endAccent: '#EC4899',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
    borderRadius: '20px',
    description: 'High-contrast luxury gradient inspired by Stripe & Linear billing portals.'
  },
  {
    id: 'linear-indigo',
    name: 'Linear Indigo Slate',
    category: 'Developer Platform',
    primary: '#4F46E5',
    secondary: '#6366F1',
    endAccent: '#818CF8',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
    borderRadius: '16px',
    description: 'Sleek dark-mode developer aesthetic with cool indigo highlights.'
  },
  {
    id: 'vercel-emerald',
    name: 'Vercel Emerald Growth',
    category: 'Cloud Infrastructure',
    primary: '#10B981',
    secondary: '#059669',
    endAccent: '#06B6D4',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #06B6D4 100%)',
    borderRadius: '20px',
    description: 'Crisp green growth palette designed for high-conversion web agencies.'
  },
  {
    id: 'sapphire-blue',
    name: 'Sapphire Tech Blue',
    category: 'Corporate Enterprise',
    primary: '#2563EB',
    secondary: '#0284C7',
    endAccent: '#06B6D4',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #0284C7 50%, #06B6D4 100%)',
    borderRadius: '20px',
    description: 'Trustworthy corporate ocean gradient for fintech and IT solutions.'
  },
  {
    id: 'framer-rose',
    name: 'Framer Rose Velvet',
    category: 'Creative Agency',
    primary: '#EC4899',
    secondary: '#F43F5E',
    endAccent: '#D946EF',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #D946EF 100%)',
    borderRadius: '24px',
    description: 'Vibrant neon pink & magenta palette for modern portfolio platforms.'
  },
  {
    id: 'hostinger-amber',
    name: 'Hostinger Gold Amber',
    category: 'E-Commerce & Cloud',
    primary: '#F59E0B',
    secondary: '#D97706',
    endAccent: '#EF4444',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #EF4444 100%)',
    borderRadius: '20px',
    description: 'Warm gold & flame gradient ideal for promotional sales & hosting portals.'
  },
  {
    id: 'cyber-crimson',
    name: 'Cyber Crimson Red',
    category: 'Security & Gaming',
    primary: '#E11D48',
    secondary: '#BE123C',
    endAccent: '#9333EA',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9333EA 100%)',
    borderRadius: '16px',
    description: 'High-energy crimson purple palette for security services and live events.'
  }
];

export const LiveThemePreviewer: React.FC<LiveThemePreviewerProps> = ({
  language,
  theme,
  systemConfig,
  updateSystemConfig,
  triggerToast,
  logAdminAction
}) => {
  // Saved Theme Values
  const savedPrimary = systemConfig?.themePrimaryColor || '#7C3AED';
  const savedSecondary = systemConfig?.themeSecondaryColor || '#A855F7';
  const savedGradient = systemConfig?.themeGradient || 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)';
  const savedRadius = systemConfig?.themeBorderRadius || '20px';

  // Live Previewer Interactive States
  const [previewPrimary, setPreviewPrimary] = useState<string>(savedPrimary);
  const [previewSecondary, setPreviewSecondary] = useState<string>(savedSecondary);
  const [previewEndAccent, setPreviewEndAccent] = useState<string>('#EC4899');
  const [previewRadius, setPreviewRadius] = useState<string>(savedRadius);
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark' | 'split'>('light');
  
  // Whole-App Global Real-Time Injector Toggle
  const [isGlobalPreviewActive, setIsGlobalPreviewActive] = useState<boolean>(false);
  
  // Interactive Form Component State Mockups inside Preview Canvas
  const [formInputText, setFormInputText] = useState<string>('WebzoneBD Enterprise IT');
  const [formDropdownVal, setFormDropdownVal] = useState<string>('SaaS Development Suite');
  const [formTextareaVal, setFormTextareaVal] = useState<string>('Custom website development with real-time analytics & automated bKash gateway integration.');
  const [formCheckboxVal, setFormCheckboxVal] = useState<boolean>(true);
  const [formRadioVal, setFormRadioVal] = useState<string>('annual');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'components' | 'export'>('presets');

  // Compute Active Gradient String
  const activeGradient = `linear-gradient(${gradientAngle}deg, ${previewPrimary} 0%, ${previewSecondary} 50%, ${previewEndAccent} 100%)`;

  // Inject CSS custom properties and dynamic rules when Global Preview is active
  useEffect(() => {
    if (isGlobalPreviewActive) {
      document.documentElement.style.setProperty('--primary-color', previewPrimary);
      document.documentElement.style.setProperty('--primary-secondary', previewSecondary);
      document.documentElement.style.setProperty('--primary-gradient', activeGradient);

      // Create dynamic global style tag to override primary Tailwind classes across UI
      let styleEl = document.getElementById('live-theme-preview-style');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'live-theme-preview-style';
        document.head.appendChild(styleEl);
      }
      
      styleEl.innerHTML = `
        :root {
          --live-primary: ${previewPrimary};
          --live-gradient: ${activeGradient};
        }
        .bg-purple-600, .bg-purple-650, .bg-indigo-600, .bg-purple-500 {
          background-color: ${previewPrimary} !important;
        }
        .text-purple-600, .text-purple-500, .text-purple-400 {
          color: ${previewPrimary} !important;
        }
        .border-purple-500, .border-purple-600 {
          border-color: ${previewPrimary} !important;
        }
        .from-purple-600, .from-purple-500 {
          --tw-gradient-from: ${previewPrimary} !important;
        }
        .to-indigo-650, .to-pink-500, .to-indigo-600 {
          --tw-gradient-to: ${previewSecondary} !important;
        }
      `;
    } else {
      // Revert CSS properties
      let styleEl = document.getElementById('live-theme-preview-style');
      if (styleEl) styleEl.remove();
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--primary-secondary');
      document.documentElement.style.removeProperty('--primary-gradient');
    }

    return () => {
      let styleEl = document.getElementById('live-theme-preview-style');
      if (styleEl) styleEl.remove();
    };
  }, [isGlobalPreviewActive, previewPrimary, previewSecondary, previewEndAccent, activeGradient]);

  // Handle Preset Selection
  const applyPreset = (preset: PresetTheme) => {
    setPreviewPrimary(preset.primary);
    setPreviewSecondary(preset.secondary);
    setPreviewEndAccent(preset.endAccent);
    setPreviewRadius(preset.borderRadius);
    triggerToast(`🎨 Loaded theme preset: ${preset.name}`);
  };

  // Save Permanently
  const handleSaveThemePermanently = () => {
    const updated: SystemConfig = {
      ...systemConfig,
      themePrimaryColor: previewPrimary,
      themeSecondaryColor: previewSecondary,
      themeGradient: activeGradient,
      themeBorderRadius: previewRadius
    };
    updateSystemConfig(updated);
    triggerToast(`✅ Primary theme color saved permanently (${previewPrimary})!`);
    if (logAdminAction) {
      logAdminAction(`Updated global UI primary theme color to ${previewPrimary} with gradient: ${activeGradient}`);
    }
  };

  // Reset Preview
  const handleResetToSaved = () => {
    setPreviewPrimary(savedPrimary);
    setPreviewSecondary(savedSecondary);
    setPreviewEndAccent('#EC4899');
    setPreviewRadius(savedRadius);
    triggerToast(`🔄 Theme preview reset back to saved defaults.`);
  };

  // Copy CSS Code Snippet
  const handleCopyCss = () => {
    const cssCode = `:root {\n  --primary-color: ${previewPrimary};\n  --secondary-color: ${previewSecondary};\n  --gradient-primary: ${activeGradient};\n  --border-radius-card: ${previewRadius};\n  --border-radius-input: 14px;\n  --shadow-primary: 0 12px 30px ${previewPrimary}55;\n}`;
    navigator.clipboard.writeText(cssCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
    triggerToast(`📋 CSS variable code snippet copied to clipboard!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER BANNER & LIVE STATUS BAR */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-950 to-slate-900 border border-neutral-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30" style={{ background: activeGradient }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider bg-white/10 border border-white/15 text-white backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Admin Panel Live Theme Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <span>{language === 'bn' ? 'লাইভ থিম ও প্রাইমারি কালার প্রভিউয়ার' : language === 'ar' ? 'معاينة القوالب والألوان المباشرة' : 'Live UI Theme & Color Previewer'}</span>
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {language === 'bn'
                ? 'এডমিন ও স্টাফরা সম্পূর্ণ ওয়েবসাইটের প্রাইমারি কালার, গ্র্যাডিয়েন্ট, ইনপুট ফিল্ড ও বাটন পরিবর্তন স্থায়ীভাবে সেভ করার আগে রিয়েল-টাইমে পর্যবেক্ষণ করতে পারেন।'
                : language === 'ar'
                ? 'أداة معاينة التصميم والألوان المباشرة للمسؤولين لمعاينة التغييرات على واجهة المستخدم بالكامل قبل تطبيقها نهائياً.'
                : 'Staff previewing engine: test primary accent colors, multi-stop gradients, focus rings, buttons, and form containers live across light and dark modes before publishing permanently.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsGlobalPreviewActive(!isGlobalPreviewActive)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg ${
                isGlobalPreviewActive
                  ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-amber-500/20 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{isGlobalPreviewActive ? '🌐 Live Whole-App Preview ACTIVE' : 'Enable Whole-App Preview'}</span>
            </button>

            <button
              onClick={handleSaveThemePermanently}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2 border border-white/20"
              style={{ background: activeGradient }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Theme Permanently 💾</span>
            </button>
          </div>
        </div>

        {/* Global Active Banner Notification */}
        {isGlobalPreviewActive && (
          <div className="mt-5 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-between gap-3 font-mono animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>LIVE WHOLE-APP PREVIEW ENABLED: System buttons, header badges, and accent highlights across Admin Panel are temporarily displaying active preview color ({previewPrimary}).</span>
            </div>
            <button
              onClick={() => setIsGlobalPreviewActive(false)}
              className="px-2.5 py-1 bg-amber-500 text-neutral-950 hover:bg-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition shrink-0"
            >
              Exit Whole-App Preview
            </button>
          </div>
        )}
      </div>

      {/* 2. NAVIGATION TABS & QUICK CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-0.5">
          {[
            { id: 'presets', label: 'Curated SaaS Palettes', icon: Palette, count: PRESET_THEMES.length },
            { id: 'custom', label: 'Custom Color & Angle Picker', icon: SlidersHorizontal },
            { id: 'components', label: 'Interactive UI Mockup Canvas', icon: LayoutGrid },
            { id: 'export', label: 'CSS Code & Swatch Export', icon: Copy }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black ${
                    isActive ? 'bg-white/20 text-white dark:bg-neutral-950 dark:text-white' : 'bg-slate-200 dark:bg-slate-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleResetToSaved}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="Reset to currently saved configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3. CONTROLS TAB PANELS */}
      {/* TAB A: CURATED PALETTES */}
      {activeTab === 'presets' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Select Enterprise SaaS Theme Swatch</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click any preset to instantly update preview viewport</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_THEMES.map((preset) => {
              const isSelected = previewPrimary === preset.primary && previewSecondary === preset.secondary;
              return (
                <div
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer bg-white dark:bg-[#1E293B] ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-xl scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Gradient Swatch Bar */}
                  <div
                    className="h-12 rounded-xl mb-3 border border-white/20 shadow-inner transition-transform group-hover:scale-[1.02] duration-300 flex items-end p-2"
                    style={{ background: preset.gradient }}
                  >
                    <span className="text-[10px] font-mono font-bold text-white bg-black/30 backdrop-blur-md px-2 py-0.5 rounded">
                      {preset.primary} → {preset.secondary}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB B: CUSTOM COLOR & ANGLE PICKER */}
      {activeTab === 'custom' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                <span>Custom Hex Color & Gradient Stop Builder</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fine-tune primary accents, secondary complementary gradients, stop angles, and corner radius.
              </p>
            </div>
            <div className="w-20 h-10 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner" style={{ background: activeGradient }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Primary Accent Color</span>
                <span className="text-[10px] text-purple-500 font-mono">{previewPrimary}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={previewPrimary}
                  onChange={(e) => setPreviewPrimary(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={previewPrimary}
                  onChange={(e) => setPreviewPrimary(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Secondary Complement</span>
                <span className="text-[10px] text-indigo-500 font-mono">{previewSecondary}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={previewSecondary}
                  onChange={(e) => setPreviewSecondary(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={previewSecondary}
                  onChange={(e) => setPreviewSecondary(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* End Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Highlight / End Accent</span>
                <span className="text-[10px] text-pink-500 font-mono">{previewEndAccent}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={previewEndAccent}
                  onChange={(e) => setPreviewEndAccent(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={previewEndAccent}
                  onChange={(e) => setPreviewEndAccent(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Gradient Direction Angle Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300">
                <span>Gradient Direction Angle</span>
                <span className="text-purple-500">{gradientAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0° Top</span>
                <span>90° Right</span>
                <span>135° Diag</span>
                <span>180° Bottom</span>
                <span>270° Left</span>
              </div>
            </div>

            {/* Form & Card Border Radius */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300">
                <span>Card & Container Radius</span>
                <span className="text-purple-500 font-mono">{previewRadius}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['14px', '16px', '20px', '24px'].map((rad) => (
                  <button
                    key={rad}
                    onClick={() => setPreviewRadius(rad)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition cursor-pointer ${
                      previewRadius === rad
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                    }`}
                  >
                    {rad}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C & CANVAS VIEWPORT: INTERACTIVE UI MOCKUP CANVAS */}
      <div className="space-y-4">
        {/* Viewport Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Live Component Preview Viewport
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full font-bold">
              Real-time Render
            </span>
          </div>

          {/* Mode Switchers */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setPreviewMode('light')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => setPreviewMode('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'dark'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
            <button
              onClick={() => setPreviewMode('split')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'split'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Split Mode</span>
            </button>
          </div>
        </div>

        {/* 4. CANVAS MOCKUP RENDER CONTAINER */}
        <div className={`grid gap-6 ${previewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* LIGHT MODE CANVAS MOCKUP */}
          {(previewMode === 'light' || previewMode === 'split') && (
            <div className="bg-[#FFFFFF] text-[#0F172A] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-8 font-sans relative overflow-hidden transition-all duration-300" style={{ borderRadius: previewRadius }}>
              {/* Top Accent Stripe */}
              <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: activeGradient }} />

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-lg" style={{ background: activeGradient }}>
                    W
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0F172A]">Form Container & Input Controls</h4>
                    <span className="text-[10px] text-[#475569] font-mono font-semibold">Light Mode Aesthetic Canvas</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full text-[10px] font-bold font-mono text-white shadow-xs" style={{ background: activeGradient }}>
                  Previewing Primary Accent
                </div>
              </div>

              {/* Form Container Block */}
              <div
                className="p-6 space-y-5 border border-slate-200/80 shadow-xl relative"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
                }}
              >
                {/* Floating Label Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569]">
                    Project System Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formInputText}
                      onChange={(e) => setFormInputText(e.target.value)}
                      className="w-full h-[56px] px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium text-sm rounded-[14px] outline-none transition-all duration-300 focus:border-transparent"
                      style={{
                        boxShadow: `0 0 0 3px ${previewPrimary}25`
                      }}
                    />
                    <div className="absolute inset-0 rounded-[14px] pointer-events-none border-2" style={{ borderColor: previewPrimary }} />
                  </div>
                  <span className="text-[10px] text-[#475569]">Focus ring glow effect rendered with primary accent color</span>
                </div>

                {/* Searchable Select Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569]">
                    Select Service Category
                  </label>
                  <div className="relative">
                    <select
                      value={formDropdownVal}
                      onChange={(e) => setFormDropdownVal(e.target.value)}
                      className="w-full h-[56px] px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium text-sm rounded-[14px] outline-none transition cursor-pointer appearance-none pr-10"
                    >
                      <option value="SaaS Development Suite">SaaS Development Suite</option>
                      <option value="E-Commerce Custom Script">E-Commerce Custom Script</option>
                      <option value="SEO & Growth Boost">SEO & Growth Boost</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-[#475569] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569]">
                    Project Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formTextareaVal}
                    onChange={(e) => setFormTextareaVal(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium text-xs rounded-[14px] outline-none transition"
                  />
                </div>

                {/* Checkbox and Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => setFormCheckboxVal(!formCheckboxVal)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition shadow-xs text-white cursor-pointer"
                      style={{
                        background: formCheckboxVal ? activeGradient : '#E2E8F0'
                      }}
                    >
                      {formCheckboxVal && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                    <span className="text-xs font-bold text-[#0F172A]">
                      Automated SSL Verification
                    </span>
                  </label>

                  {/* Radio */}
                  <div className="flex items-center gap-4">
                    {['annual', 'monthly'].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => setFormRadioVal(mode)}
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer"
                          style={{
                            borderColor: formRadioVal === mode ? previewPrimary : '#CBD5E1'
                          }}
                        >
                          {formRadioVal === mode && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: activeGradient }} />
                          )}
                        </button>
                        <span className="text-xs font-semibold capitalize text-[#0F172A]">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {/* Primary Button */}
                  <button
                    type="button"
                    className="h-[54px] rounded-[14px] text-white font-semibold text-xs transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: activeGradient,
                      boxShadow: `0 12px 30px ${previewPrimary}40`
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Primary Action Button</span>
                  </button>

                  {/* Secondary Button */}
                  <button
                    type="button"
                    className="h-[54px] rounded-[14px] text-[#0F172A] font-semibold text-xs transition-all duration-300 border hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      borderColor: previewPrimary
                    }}
                  >
                    <span>Secondary Glass Button</span>
                  </button>
                </div>
              </div>

              {/* Success & Error Message Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#DCFCE7] border border-[#22C55E] text-[#15803D] rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Success: System parameters applied correctly!</span>
                </div>
                <div className="p-3.5 bg-[#FEE2E2] border border-[#EF4444] text-[#B91C1C] rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                  <span>Error: Invalid input value supplied.</span>
                </div>
              </div>
            </div>
          )}

          {/* DARK MODE CANVAS MOCKUP */}
          {(previewMode === 'dark' || previewMode === 'split') && (
            <div className="bg-[#0F172A] text-[#FFFFFF] p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8 font-sans relative overflow-hidden transition-all duration-300" style={{ borderRadius: previewRadius }}>
              {/* Top Accent Stripe */}
              <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: activeGradient }} />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-lg" style={{ background: activeGradient }}>
                    W
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Form Container & Input Controls</h4>
                    <span className="text-[10px] text-[#CBD5E1] font-mono font-semibold">Dark Mode Atmosphere Canvas</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full text-[10px] font-bold font-mono text-white shadow-xs" style={{ background: activeGradient }}>
                  Previewing Primary Accent
                </div>
              </div>

              {/* Form Container Block */}
              <div
                className="p-6 space-y-5 border border-white/10 shadow-2xl relative backdrop-blur-xl"
                style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '20px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
              >
                {/* Floating Label Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#CBD5E1]">
                    Project System Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formInputText}
                      onChange={(e) => setFormInputText(e.target.value)}
                      className="w-full h-[56px] px-4 bg-[#111827] border border-[#374151] text-[#FFFFFF] font-medium text-sm rounded-[14px] outline-none transition-all duration-300 focus:border-transparent"
                      style={{
                        boxShadow: `0 0 0 3px ${previewPrimary}35`
                      }}
                    />
                    <div className="absolute inset-0 rounded-[14px] pointer-events-none border-2" style={{ borderColor: previewPrimary }} />
                  </div>
                  <span className="text-[10px] text-[#CBD5E1]">Focus ring glow effect rendered with primary accent color</span>
                </div>

                {/* Searchable Select Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#CBD5E1]">
                    Select Service Category
                  </label>
                  <div className="relative">
                    <select
                      value={formDropdownVal}
                      onChange={(e) => setFormDropdownVal(e.target.value)}
                      className="w-full h-[56px] px-4 bg-[#111827] border border-[#374151] text-[#FFFFFF] font-medium text-sm rounded-[14px] outline-none transition cursor-pointer appearance-none pr-10"
                    >
                      <option value="SaaS Development Suite">SaaS Development Suite</option>
                      <option value="E-Commerce Custom Script">E-Commerce Custom Script</option>
                      <option value="SEO & Growth Boost">SEO & Growth Boost</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-[#CBD5E1] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#CBD5E1]">
                    Project Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formTextareaVal}
                    onChange={(e) => setFormTextareaVal(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-[#111827] border border-[#374151] text-[#FFFFFF] font-medium text-xs rounded-[14px] outline-none transition"
                  />
                </div>

                {/* Checkbox and Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => setFormCheckboxVal(!formCheckboxVal)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition shadow-xs text-white cursor-pointer"
                      style={{
                        background: formCheckboxVal ? activeGradient : '#374151'
                      }}
                    >
                      {formCheckboxVal && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                    <span className="text-xs font-bold text-white">
                      Automated SSL Verification
                    </span>
                  </label>

                  {/* Radio */}
                  <div className="flex items-center gap-4">
                    {['annual', 'monthly'].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => setFormRadioVal(mode)}
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer"
                          style={{
                            borderColor: formRadioVal === mode ? previewPrimary : '#4B5563'
                          }}
                        >
                          {formRadioVal === mode && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: activeGradient }} />
                          )}
                        </button>
                        <span className="text-xs font-semibold capitalize text-white">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {/* Primary Button */}
                  <button
                    type="button"
                    className="h-[54px] rounded-[14px] text-white font-semibold text-xs transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: activeGradient,
                      boxShadow: `0 12px 30px ${previewPrimary}50`
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Primary Action Button</span>
                  </button>

                  {/* Secondary Button */}
                  <button
                    type="button"
                    className="h-[54px] rounded-[14px] text-white font-semibold text-xs transition-all duration-300 border hover:bg-white/5 cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      borderColor: previewPrimary
                    }}
                  >
                    <span>Secondary Glass Button</span>
                  </button>
                </div>
              </div>

              {/* Success & Error Message Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#DCFCE7]/10 border border-[#22C55E] text-[#86EFAC] rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Success: System parameters applied correctly!</span>
                </div>
                <div className="p-3.5 bg-[#FEE2E2]/10 border border-[#EF4444] text-[#FCA5A5] rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                  <span>Error: Invalid input value supplied.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TAB D: CSS CODE & SWATCH EXPORT */}
      {activeTab === 'export' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-500" />
                <span>Generated CSS & Tailwind Color Variables</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Copy or export the custom CSS root rules to use in custom web themes or external deployments.
              </p>
            </div>
            <button
              onClick={handleCopyCss}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied!' : 'Copy CSS Variables'}</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 text-neutral-200 font-mono text-xs rounded-2xl overflow-x-auto border border-neutral-800 leading-relaxed">
{`:root {
  --primary-color: ${previewPrimary};
  --secondary-color: ${previewSecondary};
  --end-accent-color: ${previewEndAccent};
  --gradient-primary: ${activeGradient};
  --border-radius-card: ${previewRadius};
  --border-radius-input: 14px;
  --shadow-primary: 0 12px 30px ${previewPrimary}40;
}`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LiveThemePreviewer;
