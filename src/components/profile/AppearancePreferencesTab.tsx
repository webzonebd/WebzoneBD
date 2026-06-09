import React, { useState } from 'react';
import { Palette, Sun, Moon, Laptop, Languages, Compass, LayoutGrid, Maximize2, Minimize2 } from 'lucide-react';

interface AppearancePreferencesTabProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  language: 'en' | 'bn' | 'ar';
  setLanguage: (l: 'en' | 'bn' | 'ar') => void;
  triggerToast: (msg: string) => void;
}

export default function AppearancePreferencesTab({
  theme,
  setTheme,
  language,
  setLanguage,
  triggerToast
}: AppearancePreferencesTabProps) {
  // Local Dashboard states
  const [landingPage, setLandingPage] = useState('dashboard');
  const [sidebarStyle, setSidebarStyle] = useState('classic');
  const [compactViewEn, setCompactViewEn] = useState(false);
  const [expandedViewEn, setExpandedViewEn] = useState(true);

  // System Theme Simulation Handler
  const handleSystemTheme = () => {
    // Select system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(systemPrefersDark ? 'dark' : 'light');
    triggerToast(`🎨 Theme synchronized with system default: ${systemPrefersDark ? 'Dark Mode' : 'Light Mode'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-505 animate-pulse" />
          <span>🎨 Appearance & Layout Preferences</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Customize active workspace interfaces, select primary localization languages, and configure sidebar styles.
        </p>
      </div>

      {/* Theme Selection Cards */}
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-700 dark:text-slate-305 flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-indigo-505" />
          <span>Theme Settings</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              triggerToast("☀️ Light Canvas Theme active!");
            }}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${theme === 'light' ? 'bg-indigo-50/10 dark:bg-indigo-950/20 border-indigo-650 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-md shadow-indigo-500/5' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <Sun className="w-5 h-5 mt-0.5 text-amber-500 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-black">Light Mode</p>
              <p className="text-[10px] text-slate-400 font-normal leading-normal">Clean, bright workspace optimized for high-lit hours.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              triggerToast("🌙 Slate Dark Canvas Theme active!");
            }}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${theme === 'dark' ? 'bg-indigo-50/10 dark:bg-indigo-950/20 border-indigo-650 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-md shadow-indigo-505/5' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <Moon className="w-5 h-5 mt-0.5 text-indigo-500 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-black">Dark Mode</p>
              <p className="text-[10px] text-slate-400 font-normal leading-normal">Deep charcoal and slate canvas optimized for eye safety.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleSystemTheme}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-slate-705 dark:text-slate-300"
          >
            <Laptop className="w-5 h-5 mt-0.5 text-sky-505 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-black">System Default</p>
              <p className="text-[10px] text-slate-400 font-normal leading-normal">Sync panels colors dynamically with system scheduler.</p>
            </div>
          </button>

        </div>
      </div>

      {/* Language Settings */}
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-750 dark:text-slate-300 flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-indigo-500" />
          <span>Language Settings</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => {
              setLanguage('en');
              triggerToast("🌐 Language updated to English!");
            }}
            className={`p-3 rounded-xl border text-center transition cursor-pointer font-sans leading-relaxed text-xs font-black ${language === 'en' ? 'bg-indigo-650/5 dark:bg-indigo-950/20 border-indigo-650 text-indigo-650 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            English (US)
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage('bn');
              triggerToast("🌐 ভাষা পরিবর্তন: বাংলা সিলেক্ট করা হয়েছে!");
            }}
            className={`p-3 rounded-xl border text-center transition cursor-pointer font-sans leading-relaxed text-xs font-black ${language === 'bn' ? 'bg-indigo-650/5 dark:bg-indigo-950/20 border-indigo-650 text-indigo-650 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            বাংলা (Bengali)
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage('ar');
              triggerToast("🌐 تم تغيير اللغة إلى العربية!");
            }}
            className={`p-3 rounded-xl border text-center transition cursor-pointer font-sans leading-relaxed text-xs font-black ${language === 'ar' ? 'bg-indigo-650/5 dark:bg-indigo-950/20 border-indigo-655 text-indigo-650 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            العربية (Arabic)
          </button>

        </div>
      </div>

      {/* Dashboard Preferences (landing page and sidebar) */}
      <div className="space-y-4">
        <p className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-indigo-505" />
          <span>Smarter Dashboard Layout Options</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold font-sans">
          
          <div className="space-y-1.5">
            <label className="text-slate-500 dark:text-slate-400">Default Landing Page</label>
            <select
              value={landingPage}
              onChange={(e) => {
                setLandingPage(e.target.value);
                triggerToast(`🏠 Master navigation landing changed: ${e.target.value.toUpperCase()}`);
              }}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="dashboard">Dashboard Overview (Main stats panels)</option>
              <option value="orders">Orders Panel (Download logs list)</option>
              <option value="support">Support Tickets (Open SLA list)</option>
              <option value="profile">Account settings (GDPR center)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-500 dark:text-slate-400">Sidebar Rail Navigation Style</label>
            <select
              value={sidebarStyle}
              onChange={(e) => {
                setSidebarStyle(e.target.value);
                triggerToast(`🖥 Sidebar layout adjusted: ${e.target.value}`);
              }}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="classic">Classic Sidebar (Full width list)</option>
              <option value="compact">Compact sidebar (Narrow icons list)</option>
              <option value="drawer">Collapsible drawer side rail (Slide out panel)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Layout Density Controls */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-200 dark:border-slate-805 space-y-4">
        <div>
          <p className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-indigo-505" />
            <span>Workspace Visual Density Configuration</span>
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5 leading-relaxed font-sans font-medium">
            Toggles core responsive wrappers between tight paddings or deep margins matching catalog dense displays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 shrink-0">
              <Minimize2 className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-900 dark:text-white">Tight Compact View</p>
                <p className="text-[9px] text-slate-400 font-normal leading-tight">Reduce sizes and paddings by 20%.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !compactViewEn;
                setCompactViewEn(next);
                if (next) setExpandedViewEn(false);
                triggerToast(next ? "✓ Tight compact view layout active!" : "Standby view density reset.");
              }}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${compactViewEn ? 'bg-indigo-650 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 shrink-0">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-900 dark:text-white">Expanded Grid view</p>
                <p className="text-[9px] text-slate-400 font-normal leading-tight">Enlarge bento spaces and layout rails.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !expandedViewEn;
                setExpandedViewEn(next);
                if (next) setCompactViewEn(false);
                triggerToast(next ? "✓ Expanded margins active!" : "Standby view density reset.");
              }}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${expandedViewEn ? 'bg-indigo-655 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
