import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Layers } from 'lucide-react';

interface SocialAccountsTabProps {
  socialGoogle: boolean;
  setSocialGoogle: (val: boolean) => void;
  socialFacebook: boolean;
  setSocialFacebook: (val: boolean) => void;
  socialGithub: boolean;
  setSocialGithub: (val: boolean) => void;
  socialLinkedin: boolean;
  setSocialLinkedin: (val: boolean) => void;
  triggerToast: (msg: string) => void;
  onAddActivityLog: (log: string) => void;
}

export default function SocialAccountsTab({
  socialGoogle,
  setSocialGoogle,
  socialFacebook,
  setSocialFacebook,
  socialGithub,
  setSocialGithub,
  socialLinkedin,
  setSocialLinkedin,
  triggerToast,
  onAddActivityLog
}: SocialAccountsTabProps) {
  // Mock Connected dates and login metadata
  const [googleMeta, setGoogleMeta] = useState({ date: 'Oct 14, 2024', method: 'Google OAuth Single-Sign-On Node' });
  const [githubMeta, setGithubMeta] = useState({ date: 'Nov 02, 2024', method: 'GitHub Developer SSO token' });
  const [facebookMeta, setFacebookMeta] = useState({ date: 'N/A', method: 'None' });
  const [linkedinMeta, setLinkedinMeta] = useState({ date: 'N/A', method: 'None' });

  const handleReconnect = (provider: string) => {
    triggerToast(`🔄 Re-shaking authorization handshake with ${provider} gateways...`);
    setTimeout(() => {
      onAddActivityLog(`Re-established Oauth credentials sync for ${provider}.`);
      triggerToast(`✨ Successfully synchronized and refreshed ${provider} token connection!`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-indigo-505" />
          <span>🔗 Connected Social Accounts</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Handshake secure third-party login platforms to bypass manual login forms safely.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold font-mono">
        
        {/* Google */}
        <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-sans font-black text-lg">
                G
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-sans text-xs">Google Account Auth</p>
                <p className={`text-[9px] font-sans ${socialGoogle ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {socialGoogle ? '✓ Connected Securely' : 'Not Linked'}
                </p>
              </div>
            </div>
            {socialGoogle && (
              <button
                type="button"
                onClick={() => handleReconnect('Google')}
                className="p-1 px-2 border dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition cursor-pointer flex items-center gap-1 text-[9px] font-sans"
                title="Reconnect Google"
              >
                <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
                Reconnect
              </button>
            )}
          </div>

          {socialGoogle && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 text-[9px] font-sans text-slate-400">
              <p>📅 <span className="font-semibold text-slate-500 dark:text-slate-400">Connected On:</span> {googleMeta.date}</p>
              <p>🛡️ <span className="font-semibold text-slate-500 dark:text-slate-400">Last Login Option:</span> {googleMeta.method}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (socialGoogle && !socialGithub) {
                triggerToast("⚠️ Locked: At least one third-party authentication gateway must stay linked.");
                return;
              }
              const next = !socialGoogle;
              setSocialGoogle(next);
              if (next) {
                setGoogleMeta({ date: new Date().toLocaleDateString(), method: 'Google OAuth Single-Sign-On Node' });
                onAddActivityLog("Linked Google Authorization Single Sign On.");
                triggerToast("✓ Connected Google profile handshake successfully!");
              } else {
                onAddActivityLog("Severed Google SSO links.");
                triggerToast("🗑️ Terminated Google login credentials.");
              }
            }}
            className={`w-full py-2 rounded-xl text-[10px] font-bold cursor-pointer transition uppercase text-center border font-sans ${socialGoogle ? 'bg-red-50 dark:bg-red-950/10 hover:bg-red-100 text-red-600 border-red-200/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-205'}`}
          >
            {socialGoogle ? 'Disconnect Google' : 'Connect Google'}
          </button>
        </div>

        {/* GitHub */}
        <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center font-bold text-white font-sans">
                Git
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-sans text-xs">GitHub Developer SSO</p>
                <p className={`text-[9px] font-sans ${socialGithub ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {socialGithub ? '✓ Connected Securely' : 'Not Linked'}
                </p>
              </div>
            </div>
            {socialGithub && (
              <button
                type="button"
                onClick={() => handleReconnect('GitHub')}
                className="p-1 px-2 border dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition cursor-pointer flex items-center gap-1 text-[9px] font-sans"
                title="Reconnect GitHub"
              >
                <RefreshCw className="w-3 h-3" />
                Reconnect
              </button>
            )}
          </div>

          {socialGithub && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 text-[9px] font-sans text-slate-400">
              <p>📅 <span className="font-semibold text-slate-500 dark:text-slate-400">Connected On:</span> {githubMeta.date}</p>
              <p>🛡️ <span className="font-semibold text-slate-500 dark:text-slate-400">Last Login Option:</span> {githubMeta.method}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (socialGithub && !socialGoogle) {
                triggerToast("⚠️ Locked: At least one third-party authentication gateway must stay linked.");
                return;
              }
              const next = !socialGithub;
              setSocialGithub(next);
              if (next) {
                setGithubMeta({ date: new Date().toLocaleDateString(), method: 'GitHub Developer SSO token' });
                onAddActivityLog("Linked GitHub Oauth single sign on credentials.");
                triggerToast("✓ Connected GitHub profile handshake successfully!");
              } else {
                onAddActivityLog("Severed GitHub gateway links.");
                triggerToast("🗑️ Terminated GitHub SSO records.");
              }
            }}
            className={`w-full py-2 rounded-xl text-[10px] font-bold cursor-pointer transition uppercase text-center border font-sans ${socialGithub ? 'bg-red-5:0 dark:bg-red-950/10 hover:bg-red-100 text-red-650 border-red-200/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-205'}`}
          >
            {socialGithub ? 'Disconnect GitHub' : 'Connect GitHub'}
          </button>
        </div>

        {/* Facebook */}
        <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between space-y-4 font-mono">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-extrabold text-[15px] font-sans">
                F
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-sans text-xs">Facebook Social Gateway</p>
                <p className={`text-[9px] font-sans ${socialFacebook ? 'text-emerald-500' : 'text-slate-40s font-medium'}`}>
                  {socialFacebook ? '✓ Connected Securely' : 'No credentials linked'}
                </p>
              </div>
            </div>
            {socialFacebook && (
              <button
                type="button"
                onClick={() => handleReconnect('Facebook')}
                className="p-1 px-2 border dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-505 transition cursor-pointer flex items-center gap-1 text-[9px] font-sans"
              >
                <RefreshCw className="w-3 h-3" />
                Reconnect
              </button>
            )}
          </div>

          {socialFacebook && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 text-[9px] font-sans text-slate-400">
              <p>📅 <span className="font-semibold text-slate-550 dark:text-slate-400">Connected On:</span> {facebookMeta.date}</p>
              <p>🛡️ <span className="font-semibold text-slate-550 dark:text-slate-400">Last Login Option:</span> {facebookMeta.method}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !socialFacebook;
              setSocialFacebook(next);
              if (next) {
                setFacebookMeta({ date: new Date().toLocaleDateString(), method: 'Facebook OAuth Session handshake' });
                onAddActivityLog("Linked Facebook credential maps.");
                triggerToast("✓ Connected Facebook login credentials.");
              } else {
                onAddActivityLog("De-authorized Facebook login gateway.");
                triggerToast("🗑️ Severed Facebook social login records.");
              }
            }}
            className={`w-full py-2 rounded-xl text-[10px] font-bold cursor-pointer transition uppercase text-center border font-sans ${socialFacebook ? 'bg-red-50 dark:bg-red-950/10 hover:bg-red-100 text-red-650 border-red-200/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-205'}`}
          >
            {socialFacebook ? 'Disconnect Facebook' : 'Connect Facebook'}
          </button>
        </div>

        {/* LinkedIn */}
        <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-xl bg-sky-600/10 flex items-center justify-center text-sky-600 font-extrabold text-[15px] font-sans">
                In
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-sans text-xs">LinkedIn Corporate</p>
                <p className={`text-[9px] font-sans ${socialLinkedin ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {socialLinkedin ? '✓ Connected Securely' : 'No credentials linked'}
                </p>
              </div>
            </div>
            {socialLinkedin && (
              <button
                type="button"
                onClick={() => handleReconnect('LinkedIn')}
                className="p-1 px-2 border dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-505 transition cursor-pointer flex items-center gap-1 text-[9px] font-sans"
              >
                <RefreshCw className="w-3 h-3" />
                Reconnect
              </button>
            )}
          </div>

          {socialLinkedin && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 text-[9px] font-sans text-slate-400">
              <p>📅 <span className="font-semibold text-slate-550 dark:text-slate-400">Connected On:</span> {linkedinMeta.date}</p>
              <p>🛡️ <span className="font-semibold text-slate-550 dark:text-slate-400">Last Login Option:</span> {linkedinMeta.method}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !socialLinkedin;
              setSocialLinkedin(next);
              if (next) {
                setLinkedinMeta({ date: new Date().toLocaleDateString(), method: 'LinkedIn Professional OAuth API' });
                onAddActivityLog("Linked LinkedIn profile identifiers.");
                triggerToast("✓ Linked LinkedIn secure career credentials.");
              } else {
                onAddActivityLog("De-authorized LinkedIn account integrations.");
                triggerToast("🗑️ Severed LinkedIn corporate maps.");
              }
            }}
            className={`w-full py-2 rounded-xl text-[10px] font-bold cursor-pointer transition uppercase text-center border font-sans ${socialLinkedin ? 'bg-red-50 dark:bg-red-950/10 hover:bg-red-100 text-red-650 border-red-200/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-205'}`}
          >
            {socialLinkedin ? 'Disconnect LinkedIn' : 'Connect LinkedIn'}
          </button>
        </div>

      </div>

    </div>
  );
}
