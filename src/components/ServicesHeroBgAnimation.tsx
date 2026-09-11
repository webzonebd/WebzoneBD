import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  ShoppingCart, 
  MapPin, 
  Smartphone, 
  Cloud, 
  TrendingUp, 
  Zap, 
  Database, 
  Terminal, 
  Layers, 
  Cpu, 
  Server,
  Sparkles,
  Bot,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Binary,
  Radio,
  Workflow
} from 'lucide-react';

interface ServicesHeroBgAnimationProps {
  language: 'en' | 'bn' | 'ar';
}

export const ServicesHeroBgAnimation: React.FC<ServicesHeroBgAnimationProps> = ({ language }) => {
  const [activeTelemetry, setActiveTelemetry] = useState(0);

  // Live real-time rotating server telemetry
  const telemetryData = [
    { label: 'BDIX PEERING SPEED', val: '10 Gbps Ultra Low-Latency', status: 'Optimal', ping: '2ms', color: 'text-emerald-500 dark:text-emerald-400' },
    { label: 'SERVER CLUSTER', val: 'Dhaka & Singapore Tier-IV DC', status: 'Online', ping: '12ms', color: 'text-cyan-500 dark:text-cyan-400' },
    { label: 'SECURITY SHIELD', val: 'TLS 1.3 • Anti-DDoS 500Gbps', status: 'Guarded', ping: '0ms', color: 'text-purple-500 dark:text-purple-400' },
    { label: 'NEXT-GEN TECH STACK', val: 'React 19, Laravel 11, Flutter & AI', status: 'Modern', ping: 'Active', color: 'text-blue-500 dark:text-blue-400' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTelemetry((prev) => (prev + 1) % telemetryData.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Tech Stack & Service Badges with glowing futuristic styling
  const techBadges = [
    {
      icon: Code2,
      tech: 'Full-Stack Web',
      sub: 'Next.js 15 • Laravel • React',
      bnSub: 'নেক্সটজেএস • লারাভেল • রিয়্যাক্ট',
      arSub: 'تطوير وتطبيقات الويب الحديثة',
      color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      glow: 'bg-cyan-400',
      pos: 'top-6 left-3 lg:left-6',
      anim: { y: [0, -12, 0], x: [0, 6, 0], rotate: [-1.5, 1.5, -1.5] },
      duration: 6,
      delay: 0.1
    },
    {
      icon: ShoppingCart,
      tech: 'E-Commerce Engine',
      sub: 'bKash/Nagad/SSL • POS Sync',
      bnSub: 'বিকাশ / নগদ / এসএসএল পেমেন্ট',
      arSub: 'بوابات الدفع والتجارة الإلكترونية',
      color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      glow: 'bg-emerald-400',
      pos: 'top-6 right-3 lg:right-6',
      anim: { y: [0, -14, 0], x: [0, -6, 0], rotate: [1.5, -1.5, 1.5] },
      duration: 6.8,
      delay: 0.4
    },
    {
      icon: MapPin,
      tech: 'Google Map & Local SEO',
      sub: 'Top #1 Ranking & Verification',
      bnSub: 'গুগল ম্যাপ ভেরিফিকেশন ও লোকাল এসইও',
      arSub: 'توثيق وتصدر خرائط جوجل',
      color: 'border-amber-500/40 text-amber-600 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      glow: 'bg-amber-400',
      pos: 'bottom-20 left-4 lg:left-8',
      anim: { y: [0, 14, 0], x: [0, 8, 0], rotate: [2, -2, 2] },
      duration: 7.2,
      delay: 0.7
    },
    {
      icon: Smartphone,
      tech: 'Mobile App Engine',
      sub: 'Flutter • iOS & Android SDK',
      bnSub: 'ফ্লাটার • আইওএস ও অ্যান্ড্রয়েড অ্যাপ',
      arSub: 'تطبيقات الهواتফ الذكية فلاتر',
      color: 'border-violet-500/40 text-violet-600 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-950/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      glow: 'bg-violet-400',
      pos: 'bottom-16 right-4 lg:right-8',
      anim: { y: [0, 12, 0], x: [0, -6, 0], rotate: [-2, 2, -2] },
      duration: 6.4,
      delay: 1.0
    },
    {
      icon: Cloud,
      tech: 'Cloud & BDIX Hosting',
      sub: 'cPanel • WHM • NVMe VPS',
      bnSub: 'সিপ্যানেল • ভিকেএম • এনভিএমই হোস্টিং',
      arSub: 'استضافة سحابية فائقة السرعة',
      color: 'border-sky-500/40 text-sky-600 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-950/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]',
      glow: 'bg-sky-400',
      pos: 'top-1/2 -left-4 lg:left-2 -translate-y-1/2',
      anim: { y: [0, -10, 0], x: [0, 8, 0], rotate: [1, -1, 1] },
      duration: 7.5,
      delay: 1.3
    },
    {
      icon: TrendingUp,
      tech: 'AI Growth & Meta Ads',
      sub: 'Pixel • Conversions API • Ads',
      bnSub: 'মেটা অ্যাডস • পিক্সেল • গ্রোথ ফানেল',
      arSub: 'إعلانات وحملات نمو المبيعات',
      color: 'border-pink-500/40 text-pink-600 dark:text-pink-300 bg-pink-500/10 dark:bg-pink-950/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]',
      glow: 'bg-pink-400',
      pos: 'top-1/2 -right-4 lg:right-2 -translate-y-1/2',
      anim: { y: [0, -12, 0], x: [0, -8, 0], rotate: [-1, 2, -1] },
      duration: 6.9,
      delay: 0.8
    }
  ];

  // Tech stack pills floating in ambient background
  const techStackPills = [
    { label: 'React 19', color: 'text-cyan-400 border-cyan-500/30', top: '18%', left: '16%' },
    { label: 'Laravel 11', color: 'text-red-400 border-red-500/30', top: '24%', right: '16%' },
    { label: 'Next.js', color: 'text-slate-300 border-slate-500/30', top: '78%', left: '20%' },
    { label: 'PostgreSQL', color: 'text-blue-400 border-blue-500/30', top: '82%', right: '20%' },
    { label: 'Flutter', color: 'text-sky-400 border-sky-500/30', top: '48%', left: '14%' },
    { label: 'Python AI', color: 'text-amber-400 border-amber-500/30', top: '52%', right: '14%' }
  ];

  // Digital terminal command snippets
  const commandSnippets = [
    { text: 'root@webzone:~# docker compose up --scale backend=4', pos: 'top-28 left-[18%] hidden xl:block', color: 'text-cyan-500/40 dark:text-cyan-300/40' },
    { text: 'SELECT * FROM enterprise_services WHERE status = "LIVE";', pos: 'bottom-28 right-[18%] hidden xl:block', color: 'text-emerald-500/40 dark:text-emerald-300/40' },
    { text: 'HTTP/3 200 OK • SSL Pinning Verified (TLS_AES_256_GCM)', pos: 'top-32 right-[20%] hidden xl:block', color: 'text-purple-500/40 dark:text-purple-300/40' },
    { text: 'git commit -m "feat(arch): zero-latency bdix CDN routed"', pos: 'bottom-32 left-[18%] hidden xl:block', color: 'text-blue-500/40 dark:text-blue-300/40' }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. FUTURISTIC 3D PERSPECTIVE CYBER GRID */}
      <div 
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.09]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          transform: 'perspective(600px) rotateX(12deg) scale(1.15)',
          transformOrigin: 'top center'
        }}
      />

      {/* Cyber Isometric Dot Matrix overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Radial fade mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-950/40 to-white dark:to-slate-950" />

      {/* 2. DYNAMIC AURORA NEON ORBS WITH GLOW REFLECTION */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.18, 0.38, 0.18],
          x: [0, 25, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-28 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/30 via-blue-600/25 to-indigo-600/20 rounded-full blur-[100px]"
      />

      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, -30, 0],
          y: [0, 25, 0]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute -bottom-28 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/25 via-purple-600/25 to-pink-500/20 rounded-full blur-[110px]"
      />

      <motion.div 
        animate={{
          scale: [0.85, 1.15, 0.85],
          opacity: [0.1, 0.25, 0.1],
          y: [0, -25, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-emerald-400/20 via-cyan-400/20 to-blue-500/15 rounded-full blur-[90px]"
      />

      {/* 3. HIGH-TECH VERTICAL & HORIZONTAL SCANNER BEAMS */}
      <motion.div
        animate={{ top: ['-10%', '115%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 dark:via-cyan-400/80 to-transparent blur-[1.5px] opacity-80"
      />
      <motion.div
        animate={{ left: ['-10%', '115%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 3 }}
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500/40 dark:via-indigo-400/50 to-transparent blur-[1px] opacity-60"
      />

      {/* 4. REAL-TIME SERVER TELEMETRY TICKER (Top Cyber HUD) */}
      <div className="absolute top-3 inset-x-0 flex justify-center z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-cyan-500/30 text-[10px] sm:text-[11px] font-mono shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-neutral-500 dark:text-slate-400 text-[9px] sm:text-[10px]">
              {telemetryData[activeTelemetry].label}:
            </span>
          </div>
          <span className={`font-bold ${telemetryData[activeTelemetry].color} flex items-center gap-1`}>
            {telemetryData[activeTelemetry].val}
          </span>
          <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 font-black border border-neutral-200 dark:border-slate-700">
            PING {telemetryData[activeTelemetry].ping}
          </span>
        </motion.div>
      </div>

      {/* 5. INTERACTIVE CIRCUIT PATHS WITH MOVING PULSE PACKETS (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-25 dark:opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neonCircuit1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="neonCircuit2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Top-Left to Center Pathway */}
        <motion.path 
          d="M 10 40 L 120 40 L 200 110 L 420 110" 
          fill="none" 
          stroke="url(#neonCircuit1)" 
          strokeWidth="1.75"
          strokeDasharray="6 6"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="10" cy="40" r="3.5" className="fill-cyan-400 shadow-md" />
        <circle cx="200" cy="110" r="3" className="fill-blue-500 animate-ping" style={{ animationDuration: '2.5s' }} />

        {/* Top-Right to Center Pathway */}
        <motion.path 
          d="M 1250 50 L 1120 50 L 1020 120 L 840 120" 
          fill="none" 
          stroke="url(#neonCircuit1)" 
          strokeWidth="1.75"
          strokeDasharray="6 6"
          animate={{ strokeDashoffset: [0, 48] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="1250" cy="50" r="3.5" className="fill-purple-400" />
        <circle cx="1020" cy="120" r="3" className="fill-cyan-400 animate-ping" style={{ animationDuration: '3s' }} />

        {/* Bottom Pathway */}
        <motion.path 
          d="M 60 520 L 240 520 L 340 440 L 560 440" 
          fill="none" 
          stroke="url(#neonCircuit2)" 
          strokeWidth="1.75"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [0, -64] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="60" cy="520" r="3.5" className="fill-emerald-400" />
      </svg>

      {/* 6. GLOWING TECH STACK FLOATING PILLS (React, Next.js, Laravel, Flutter, AI) */}
      {techStackPills.map((pill, idx) => (
        <motion.div
          key={idx}
          style={{ top: pill.top, left: pill.left, right: pill.right }}
          animate={{
            y: [0, -12, 0],
            scale: [0.95, 1.05, 0.95],
            opacity: [0.35, 0.75, 0.35]
          }}
          transition={{
            duration: 5 + idx,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.4
          }}
          className={`absolute hidden md:flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border text-[10px] font-mono font-bold ${pill.color} shadow-xs`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          <span>{pill.label}</span>
        </motion.div>
      ))}

      {/* 7. FLOATING SERVICE HOLOGRAM BADGES WITH ACTIVE GLOW PULSE */}
      {techBadges.map((badge, idx) => {
        const IconComponent = badge.icon;
        const subText = language === 'bn' ? badge.bnSub : language === 'ar' ? badge.arSub : badge.sub;

        return (
          <motion.div
            key={idx}
            animate={badge.anim}
            transition={{
              duration: badge.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: badge.delay
            }}
            className={`absolute ${badge.pos} hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border ${badge.color} transition-all duration-300 hover:scale-105 cursor-default select-none`}
          >
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${badge.glow} animate-ping absolute opacity-75`} />
              <IconComponent className="w-4 h-4 relative z-10" />
            </div>
            <div className="text-left">
              <div className="text-[11px] lg:text-[12px] font-black font-sans tracking-tight text-neutral-900 dark:text-white flex items-center gap-1">
                <span>{badge.tech}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.glow}`} />
              </div>
              <div className="text-[9px] lg:text-[10px] font-mono opacity-80 dark:opacity-90 font-medium whitespace-nowrap">
                {subText}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* 8. LIVE TELEMETRY / CODE TERMINAL LINES */}
      {commandSnippets.map((cmd, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -10, 0],
            opacity: [0.25, 0.6, 0.25]
          }}
          transition={{
            duration: 8 + idx,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.8
          }}
          className={`absolute ${cmd.pos} font-mono text-[10px] lg:text-[11px] font-semibold tracking-wide ${cmd.color}`}
        >
          {cmd.text}
        </motion.div>
      ))}

      {/* 9. FLOATING TECH GLYPHS & LOGIC SYMBOLS */}
      {[
        { char: '</>', top: '15%', left: '10%', size: 'text-base', delay: 0 },
        { char: '{ }', top: '70%', left: '8%', size: 'text-lg', delay: 1 },
        { char: '0101', top: '14%', right: '12%', size: 'text-xs', delay: 2 },
        { char: '⚡ 10G', top: '75%', right: '8%', size: 'text-xs', delay: 1.5 },
        { char: 'API.v3', top: '38%', right: '4%', size: 'text-[10px]', delay: 0.5 },
        { char: 'TLS 1.3', top: '58%', left: '3%', size: 'text-[10px]', delay: 2.5 }
      ].map((glyph, idx) => (
        <motion.div
          key={idx}
          style={{ top: glyph.top, left: glyph.left, right: glyph.right }}
          animate={{
            y: [0, -20, 0],
            rotate: [-8, 8, -8],
            opacity: [0.15, 0.45, 0.15]
          }}
          transition={{
            duration: 6 + idx,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: glyph.delay
          }}
          className={`absolute font-mono font-black ${glyph.size} text-neutral-400/50 dark:text-cyan-400/30`}
        >
          {glyph.char}
        </motion.div>
      ))}

    </div>
  );
};

export default ServicesHeroBgAnimation;
