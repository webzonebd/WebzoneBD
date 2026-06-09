import React, { useState } from 'react';
import { Laptop, Shield, ShieldCheck, AlertCircle, Bell } from 'lucide-react';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  country: string;
  loginDate: string;
  loginTime: string;
  isCurrent: boolean;
}

interface LoginSessionsTabProps {
  sessions: SessionItem[];
  setSessions: React.Dispatch<React.SetStateAction<SessionItem[]>>;
  triggerToast: (msg: string) => void;
  onAddActivityLog: (log: string) => void;
  handleLogoutOtherDevices: () => void;
  handleLogoutAllDevices: () => void;
}

export default function LoginSessionsTab({
  sessions,
  setSessions,
  triggerToast,
  onAddActivityLog,
  handleLogoutOtherDevices,
  handleLogoutAllDevices
}: LoginSessionsTabProps) {
  // Security Toggles
  const [newDeviceAlert, setNewDeviceAlert] = useState(true);
  const [suspiciousActAlert, setSuspiciousActAlert] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Laptop className="w-5 h-5 text-indigo-505" />
          <span>🖥️ Active Login Sessions & Devices</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Monitor all remote terminals holding active secure cookies mapping your Cloud Run catalog profile.
        </p>
      </div>

      {/* Sessions list */}
      <div className="space-y-3.5">
        {sessions.map((ses) => (
          <div 
            key={ses.id}
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-300 ${ses.isCurrent ? 'bg-indigo-500/5 border-indigo-550/20' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${ses.isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-405'}`}>
                <Laptop className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-slate-800 dark:text-white">{ses.device}</span>
                  {ses.isCurrent && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-405 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-extrabold">
                      ACTIVE SESSION
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                  {ses.os} • {ses.browser}
                </p>
                <div className="text-[10px] text-slate-400 font-mono flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span>IP Address: {ses.ip} ({ses.country})</span>
                  <span>•</span>
                  <span>Login: {ses.loginDate} at {ses.loginTime}</span>
                </div>
              </div>
            </div>

            {!ses.isCurrent && (
              <button
                type="button"
                onClick={() => {
                  setSessions(prev => prev.filter(s => s.id !== ses.id));
                  onAddActivityLog(`Terminated remote session ${ses.id} (${ses.device})`);
                  triggerToast(`❌ Terminated session token on device: ${ses.device}`);
                }}
                className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black cursor-pointer transition uppercase"
              >
                Revoke Credentials
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Global Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleLogoutOtherDevices}
          className="px-4.5 py-2.5 bg-indigo-500/10 hover:bg-indigo-550/20 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-xl cursor-pointer transition uppercase"
        >
          Logout Other Devices 💻
        </button>
        <button
          type="button"
          onClick={handleLogoutAllDevices}
          className="px-4.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-xl cursor-pointer transition uppercase"
        >
          Logout All Devices 🔒
        </button>
      </div>

      {/* Security alert controls */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-205/65 dark:border-slate-800/80 space-y-4">
        <p className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-indigo-500" />
          <span>🚨 Session Security Alerts Settings</span>
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-relaxed">
          Platform-level alerts pushed instantly over secure pipelines when background actions trigger access challenges.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold font-sans">
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-900 dark:text-white">New Device Login alert</p>
              <p className="text-[9px] text-slate-400 font-medium">Bells when unauthorized browser knocks.</p>
            </div>
            <button
              type="button"
              onClick={() => setNewDeviceAlert(!newDeviceAlert)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${newDeviceAlert ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-900 dark:text-white">Suspicious Activity alert</p>
              <p className="text-[9px] text-slate-400 font-medium">Flags extreme IP hops or rapid orders.</p>
            </div>
            <button
              type="button"
              onClick={() => setSuspiciousActAlert(!suspiciousActAlert)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${suspiciousActAlert ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
