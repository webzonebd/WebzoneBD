import React, { useRef } from 'react';
import { User, CheckCircle2, Smartphone, Check, Trash2, Camera } from 'lucide-react';

interface BasicInfoTabProps {
  fullName: string;
  setFullName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  mobileNumber: string;
  setMobileNumber: (val: string) => void;
  whatsAppNumber: string;
  setWhatsAppNumber: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  selectedLang: string;
  setSelectedLang: (val: string) => void;
  profileAvatar: string;
  setProfileAvatar: (val: string) => void;
  triggerToast: (msg: string) => void;
  language: 'en' | 'bn' | 'ar';
}

export default function BasicInfoTab({
  fullName,
  setFullName,
  username,
  setUsername,
  email,
  setEmail,
  mobileNumber,
  setMobileNumber,
  whatsAppNumber,
  setWhatsAppNumber,
  country,
  setCountry,
  city,
  setCity,
  timezone,
  setTimezone,
  selectedLang,
  setSelectedLang,
  profileAvatar,
  setProfileAvatar,
  triggerToast,
  language
}: BasicInfoTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadedAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("⚠️ Upload error: File too large! Maximum limit is 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setProfileAvatar(base64Data);
        triggerToast("✨ Profile avatar uploaded! Save changes to persist.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-505" />
          <span>👤 Basic Information Settings</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Configure display identifiers, official email setups, and display profile photos.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-5 py-5 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-20 blur-md group-hover:opacity-40 transition-all pointer-events-none" />
          <div className="relative rounded-full p-0.5 bg-slate-250 dark:bg-slate-800">
            {profileAvatar ? (
              <img 
                src={profileAvatar} 
                alt="Profile Avatar" 
                className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl uppercase">
                {fullName.slice(0, 2) || 'US'}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="text-xs font-black text-slate-800 dark:text-white">Profile Photo Upload</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
            Upload custom avatar files. Accepts PNG, JPG, or JPEG formats. Maximum file envelope size has 2MB threshold.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black transition cursor-pointer uppercase tracking-wider"
            >
              <Camera className="w-3.5 h-3.5" />
              Upload Image
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              className="hidden" 
              onChange={handleUploadedAvatar} 
            />
            {profileAvatar && (
              <button
                type="button"
                onClick={() => {
                  setProfileAvatar('');
                  triggerToast("Trash avatar: Avatar image reverted to default.");
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] font-black transition cursor-pointer uppercase"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Verification State Badge display */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/2 px-4 rounded-xl border border-emerald-505/20 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Email Status</span>
          </div>
          <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase">Verified </span>
        </div>

        <div className="p-3 bg-sky-500/5 dark:bg-sky-505/2 px-4 rounded-xl border border-sky-500/20 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-450 font-mono">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-500" />
            <span>Phone OTP Status</span>
          </div>
          <span className="bg-sky-500/15 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded text-[10px] uppercase">Verified</span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Full Name</label>
          <input 
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Username Identifier</label>
          <input 
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Email Address</label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Mobile Number</label>
          <input 
            type="text"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">WhatsApp Number</label>
          <input 
            type="text"
            required
            value={whatsAppNumber}
            onChange={(e) => setWhatsAppNumber(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Timezone Preference</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
            <option value="Asia/Riyadh (GMT+3)">Asia/Riyadh (GMT+3)</option>
            <option value="America/New_York (GMT-4)">America/New_York (GMT-4)</option>
            <option value="Europe/London (GMT+1)">Europe/London (GMT+1)</option>
            <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Country Location</label>
          <input 
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">City / District</label>
          <input 
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Portal Display Language</label>
          <select
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              triggerToast(`🌐 Display language modified to ${e.target.value}`);
            }}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="English">English</option>
            <option value="Bangla">বাংলা (Bangla)</option>
            <option value="Arabic">العربية (Arabic)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
