import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Key, Check, Copy, RefreshCw, QrCode, Laptop, AlertCircle, Trash2 
} from 'lucide-react';

interface AccountSecurityTabProps {
  curPass: string;
  setCurPass: (val: string) => void;
  newPass: string;
  setNewPass: (val: string) => void;
  confPass: string;
  setConfPass: (val: string) => void;
  showCurPass: boolean;
  setShowCurPass: (val: boolean) => void;
  showNewPass: boolean;
  setShowNewPass: (val: boolean) => void;
  showConfPass: boolean;
  setShowConfPass: (val: boolean) => void;
  tfaEnabled: boolean;
  setTfaEnabled: (val: boolean) => void;
  emailOtpEnabled: boolean;
  setEmailOtpEnabled: (val: boolean) => void;
  googleAuthEnabled: boolean;
  setGoogleAuthEnabled: (val: boolean) => void;
  whatsappOtpEnabled: boolean;
  setWhatsappOtpEnabled: (val: boolean) => void;
  triggerToast: (msg: string) => void;
  onAddActivityLog: (log: string) => void;
}

export default function AccountSecurityTab({
  curPass,
  setCurPass,
  newPass,
  setNewPass,
  confPass,
  setConfPass,
  showCurPass,
  setShowCurPass,
  showNewPass,
  setShowNewPass,
  showConfPass,
  setShowConfPass,
  tfaEnabled,
  setTfaEnabled,
  emailOtpEnabled,
  setEmailOtpEnabled,
  googleAuthEnabled,
  setGoogleAuthEnabled,
  whatsappOtpEnabled,
  setWhatsappOtpEnabled,
  triggerToast,
  onAddActivityLog
}: AccountSecurityTabProps) {
  // Local Backup Codes
  const [backupCodes, setBackupCodes] = useState([
    'WZB-7738-9201', 'WZB-1882-9382', 'WZB-9921-1200', 'WZB-4482-1920',
    'WZB-5501-1829', 'WZB-2289-5412', 'WZB-3382-7729', 'WZB-8812-3841'
  ]);

  // Local Trusted Devices list
  const [trustedDevices, setTrustedDevices] = useState([
    { id: 't1', device: 'MacBook Pro 14" (Office Safari)', status: 'Active', location: 'Dhaka, BD', date: 'June 1, 2026' },
    { id: 't2', device: 'Samsung Galaxy S24 Ultra (App Client)', status: 'Active', location: 'Chittagong, BD', date: 'May 28, 2026' }
  ]);

  // Pass strength analyser
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Password empty', width: 'w-0', color: 'bg-neutral-300' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Weak 🔴', width: 'w-1/4', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair 🟡', width: 'w-2/4', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Strong ✨', width: 'w-3/4', color: 'bg-indigo-500' };
    return { score, label: 'Very Secure 🟢', width: 'w-full', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPass);

  const handleCopyCodes = () => {
    const textToCopy = backupCodes.join('\n');
    navigator.clipboard.writeText(textToCopy);
    triggerToast("📋 Backup verification codes copied to clipboard!");
  };

  const handleResetCodes = () => {
    const randomized = Array.from({ length: 8 }, () => {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      return `WZB-${part1}-${part2}`;
    });
    setBackupCodes(randomized);
    onAddActivityLog("Regenerated new MFA recovery security keys.");
    triggerToast("🔄 Regenerated fresh backup keys!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-505" />
          <span>🔒 Account Security & Identity Keys</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Protect workspace records by locking security parameters and enabling two-factor validation.
        </p>
      </div>

      {/* Password Rotation panel */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-205/65 dark:border-slate-800/80 space-y-4">
        <p className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
          <Key className="w-4 h-4 text-indigo-505" />
          <span>Rotate Current Account Password</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold font-mono">
          <div className="space-y-1.5">
            <label className="font-sans text-slate-500 dark:text-slate-400">Current Password</label>
            <div className="relative">
              <input 
                type={showCurPass ? "text" : "password"}
                value={curPass}
                placeholder="••••••"
                onChange={(e) => setCurPass(e.target.value)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowCurPass(!showCurPass)}
                className="absolute right-3 top-3.5 text-[10px] font-sans text-indigo-600 font-extrabold cursor-pointer uppercase tracking-tight"
              >
                {showCurPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-slate-500 dark:text-slate-400">New Password</label>
            <div className="relative">
              <input 
                type={showNewPass ? "text" : "password"}
                value={newPass}
                placeholder="At least 6 chars"
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3.5 text-[10px] font-sans text-indigo-600 font-extrabold cursor-pointer uppercase tracking-tight"
              >
                {showNewPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-slate-500 dark:text-slate-400">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfPass ? "text" : "password"}
                value={confPass}
                placeholder="Repeat new pass"
                onChange={(e) => setConfPass(e.target.value)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfPass(!showConfPass)}
                className="absolute right-3 top-3.5 text-[10px] font-sans text-indigo-600 font-extrabold cursor-pointer uppercase tracking-tight"
              >
                {showConfPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* Strength Meter */}
        {newPass && (
          <div className="space-y-2 pt-2 animate-in fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500">Security Check:</span>
              <span className="font-extrabold text-indigo-500">{strength.label}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${strength.color} ${strength.width}`} />
            </div>
            <ul className="text-[9px] text-slate-450 space-y-0.5 list-disc list-inside">
              <li className={newPass.length >= 6 ? 'text-emerald-500' : 'text-slate-400'}>Contains at least 6 characters</li>
              <li className={/[A-Z]/.test(newPass) ? 'text-emerald-500' : 'text-slate-400'}>Has uppercase symbol</li>
              <li className={/[0-9]/.test(newPass) ? 'text-emerald-500' : 'text-slate-400'}>Has numbers 0-9</li>
              <li className={/[^A-Za-z0-9]/.test(newPass) ? 'text-emerald-500' : 'text-slate-400'}>Has special character key</li>
            </ul>
          </div>
        )}
      </div>

      {/* Security Options (MFA Toggles) */}
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-700 dark:text-slate-300">🛡️ Multi-Factor Authentication (MFA) Channels</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
          
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-slate-900 dark:text-white">Active 2FA Security</p>
              <p className="text-[10px] text-slate-400 font-normal">Require dual logins globally.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !tfaEnabled;
                setTfaEnabled(next);
                triggerToast(next ? "🛡️ 2FA master system enabled!" : "🔒 master 2FA system customized to standby.");
              }}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${tfaEnabled ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-slate-900 dark:text-white">Email OTP Verification</p>
              <p className="text-[10px] text-slate-400 font-normal">Push email pins on login try.</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailOtpEnabled(!emailOtpEnabled)}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${emailOtpEnabled ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-slate-900 dark:text-white">WhatsApp OTP Verification</p>
              <p className="text-[10px] text-slate-400 font-normal">Deliver login pins to WhatsApp.</p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappOtpEnabled(!whatsappOtpEnabled)}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${whatsappOtpEnabled ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-slate-900 dark:text-white">Google Authenticator (TOTP)</p>
              <p className="text-[10px] text-slate-400 font-normal">Support hardware authenticator codes.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGoogleAuthEnabled(!googleAuthEnabled);
                triggerToast(googleAuthEnabled ? "🗑️ Google Authenticator detached" : "📱 Google Authenticator code generated successfully.");
              }}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${googleAuthEnabled ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
            </button>
          </div>
        </div>
      </div>

      {googleAuthEnabled && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900 flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-top duration-300">
          <div className="bg-white p-2 rounded-lg border">
            <QrCode className="w-20 h-20 text-slate-900" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <p className="text-xs font-black text-indigo-950 dark:text-indigo-200">Google Authenticator Handshake Mode</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-relaxed font-sans">
              Scan the visual QR Code key with your Google Auth, Duo, or Authy mobile application. If scanning is offline, key manual code: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-bold font-mono">WZB LEVEL2 MFA ACTIVE SECURE</code>.
            </p>
          </div>
        </div>
      )}

      {/* Recovery Option - Codes */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-205/65 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-slate-800 dark:text-white">🔑 Backup Recovery Codes</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyCodes}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:brightness-110 text-indigo-600 dark:text-indigo-400 border border-indigo-205/10 rounded-lg text-[9px] font-bold"
            >
              <Copy className="w-3 h-3" />
              Copy Codes
            </button>
            <button
              type="button"
              onClick={handleResetCodes}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:brightness-110 text-slate-700 dark:text-slate-300 rounded-lg text-[9px] font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Codes
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-relaxed">
          Keep these 8 safety backup credentials stored index-offline in password lockers. Each backup coupon can bypass MFA procedures once.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] text-center font-bold">
          {backupCodes.map((code, idx) => (
            <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {code}
            </div>
          ))}
        </div>
      </div>

      {/* Trusted Devices Management */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-205/65 dark:border-slate-800/80 space-y-4">
        <p className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
          <Laptop className="w-4 h-4 text-indigo-505" />
          <span>🖥️ Trusted Access Devices</span>
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-300">
          The following web-clients bypass 2FA challenges on secure system gateways because they are flagged as safe hardware logs.
        </p>

        <div className="space-y-2">
          {trustedDevices.map((dev) => (
            <div key={dev.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-80s flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4.5 h-4.5 text-indigo-500" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">{dev.device}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Verified from {dev.location} on {dev.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTrustedDevices(prev => prev.filter(p => p.id !== dev.id));
                  triggerToast(`🗑️ Untrusted machine authorization deleted: ${dev.device}`);
                }}
                className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition"
                title="Revoke device trust"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
