import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme } from '../types';

interface HostingHeroProps {
  language: Language;
  theme: Theme;
  onGetStarted?: () => void;
  onViewPlans?: () => void;
  onSearchDomain?: (query: string) => void;
}

const rotatingServices = [
  "Shared Hosting",
  "NVMe SSD Hosting",
  "Reseller Hosting",
  "VPS Hosting",
  "Cloud Hosting"
];

const statisticsData = [
  { value: "99.9%", label: "Uptime SLA", sub: "Guaranteed" },
  { value: "640+", label: "Hosted Websites", sub: "Active" },
  { value: "250+", label: "Happy Clients", sub: "Global" },
  { value: "24/7", label: "Expert Support", sub: "Tickets & WhatsApp" }
];

export default function HostingHero({
  language,
  theme,
  onGetStarted,
  onViewPlans,
  onSearchDomain
}: HostingHeroProps) {
  // Rotating text index
  const [textIndex, setTextIndex] = useState(0);

  // Canvas particle reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live dashboard simulated metrics
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(38);
  const [networkSpeed, setNetworkSpeed] = useState(982);
  const [pingLatency, setPingLatency] = useState(3);
  const [activeTabWidget, setActiveTabWidget] = useState<'metrics' | 'nodes' | 'network'>('metrics');

  // Floating domain search query
  const [quickDomain, setQuickDomain] = useState('');

  // Auto-rotate text
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingServices.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Live server metric fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(18 + Math.random() * 14));
      setRamUsage(Math.floor(34 + Math.random() * 8));
      setNetworkSpeed(Math.floor(950 + Math.random() * 45));
      setPingLatency(Math.floor(2 + Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Canvas background particle & network lines animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating particles
    const particlesCount = 50;
    const isLight = theme === 'light';
    
    const lightColors = [
      'rgba(147, 51, 234, ', // Violet
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(99, 102, 241, ',  // Indigo
      'rgba(236, 72, 153, '   // Pink
    ];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      colorBase: string;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.5 + 1,
        alpha: isLight ? Math.random() * 0.6 + 0.3 : Math.random() * 0.5 + 0.2,
        colorBase: isLight ? lightColors[i % lightColors.length] : 'rgba(168, 85, 247, '
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle network grid lines
      ctx.strokeStyle = isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(109, 40, 217, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 38;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.colorBase}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.strokeStyle = isLight 
              ? `rgba(99, 102, 241, ${0.22 * (1 - dist / 115)})` 
              : `rgba(139, 92, 246, ${0.18 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDomain.trim() && onSearchDomain) {
      onSearchDomain(quickDomain.trim());
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-500 py-12 md:py-20 lg:py-24 border-b ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-purple-50/80 to-cyan-50/70 text-slate-900 border-purple-200/80' 
        : 'bg-[#0F172A] text-slate-100 border-violet-900/40'
    }`}>
      
      {/* Canvas background particle & mesh layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Light Color Animation Effects Background (Glowing Orbs & Radial Beam) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 25, 0],
          y: [0, -20, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className={`absolute top-1/4 left-[-10%] w-[520px] h-[520px] rounded-full pointer-events-none ${
          isLight 
            ? 'bg-gradient-to-r from-purple-300/60 via-indigo-200/50 to-cyan-300/50 blur-[120px]' 
            : 'bg-gradient-to-r from-[#6D28D9]/30 to-[#8B5CF6]/20 blur-[130px]'
        }`} 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 25, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className={`absolute bottom-[-10%] right-[-5%] w-[620px] h-[620px] rounded-full pointer-events-none ${
          isLight 
            ? 'bg-gradient-to-r from-pink-300/50 via-rose-200/40 to-purple-300/50 blur-[130px]' 
            : 'bg-gradient-to-r from-[#A855F7]/25 to-[#6D28D9]/25 blur-[140px]'
        }`} 
      />
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className={`absolute top-[-5%] right-[25%] w-[450px] h-[450px] rounded-full pointer-events-none ${
          isLight 
            ? 'bg-gradient-to-r from-cyan-300/50 via-teal-200/40 to-blue-300/40 blur-[110px]' 
            : 'bg-gradient-to-r from-[#06B6D4]/20 to-[#3B82F6]/20 blur-[120px]'
        }`} 
      />

      {/* Ambient Radial Light Beam Overlay */}
      <div className={`absolute inset-0 pointer-events-none ${
        isLight 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent' 
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Main Copy, Animated Text, CTA, Features & Stats */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-extrabold shadow-lg backdrop-blur-md transition-colors ${
                isLight 
                  ? 'bg-gradient-to-r from-purple-100 via-indigo-100 to-cyan-100 border-purple-300 text-purple-950 shadow-purple-200/60' 
                  : 'bg-gradient-to-r from-[#6D28D9]/40 via-[#8B5CF6]/30 to-[#A855F7]/40 border-[#8B5CF6]/40 text-purple-200 shadow-purple-950/40'
              }`}
            >
              <span className="animate-bounce">🚀</span>
              <span className="tracking-wide">Premium Web Hosting Solutions</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
            </motion.div>

            {/* Main Heading & Animated Rotating Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Fast, Secure & Reliable Hosting for Every Website
              </h1>

              {/* Animated Text Rotation */}
              <div className="flex items-center gap-2.5 pt-1 text-xl sm:text-3xl font-black">
                <span className={`font-bold text-base sm:text-2xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Powering:</span>
                <div className="h-10 sm:h-12 overflow-hidden relative inline-block min-w-[220px] sm:min-w-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={textIndex}
                      initial={{ opacity: 0, y: 25, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -25, rotateX: 90 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className={`absolute left-0 top-0 text-transparent bg-gradient-to-r bg-clip-text font-black text-xl sm:text-3xl whitespace-nowrap drop-shadow-sm ${
                        isLight 
                          ? 'from-purple-700 via-indigo-600 to-cyan-600' 
                          : 'from-[#8B5CF6] via-[#A855F7] to-[#38BDF8]'
                      }`}
                    >
                      ⚡ {rotatingServices[textIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-base sm:text-lg max-w-2xl leading-relaxed font-medium ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Launch your website with high-performance hosting, free SSL certificates, daily backups, business email, LiteSpeed technology, and 24/7 expert support.
            </motion.p>

            {/* CTA Buttons - Side-by-side on mobile and desktop */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 pt-1"
            >
              {/* Primary Button */}
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-3.5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] hover:from-[#5B21B6] hover:to-[#9333EA] text-white font-black text-xs sm:text-base shadow-xl shadow-purple-900/40 hover:shadow-purple-700/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2.5 ring-2 ring-purple-400/30 group"
              >
                <span className="text-base sm:text-xl group-hover:rotate-12 transition-transform duration-300">🟣</span>
                <span className="whitespace-nowrap">Get Started</span>
                <span className="text-xs sm:text-lg group-hover:translate-x-1 transition-transform duration-300">➔</span>
              </button>

              {/* Secondary Button */}
              <button
                onClick={onViewPlans}
                className={`w-full sm:w-auto px-3.5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-base border shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-purple-400 shadow-slate-200/80' 
                    : 'bg-slate-800/80 hover:bg-slate-700/90 text-white border-slate-700 hover:border-purple-500/50'
                }`}
              >
                <span className="text-base sm:text-xl">🌐</span>
                <span className="whitespace-nowrap">Compare Plans</span>
              </button>
            </motion.div>

            {/* Statistics Counter (4 Items) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t ${isLight ? 'border-slate-200/80' : 'border-slate-800/80'}`}
            >
              {statisticsData.map((stat, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-center shadow-md relative overflow-hidden group transition-all ${
                    isLight 
                      ? 'bg-white/90 border-purple-200/80 hover:border-purple-400 shadow-purple-100/60' 
                      : 'bg-gradient-to-b from-slate-800/60 to-slate-900/80 border-purple-900/30 hover:border-purple-500/40'
                  }`}
                >
                  <div className={`text-xl sm:text-2xl font-black text-transparent bg-gradient-to-r bg-clip-text ${
                    isLight 
                      ? 'from-purple-700 via-indigo-600 to-pink-600' 
                      : 'from-purple-300 via-purple-100 to-pink-300'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-extrabold mt-0.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    {stat.label}
                  </div>
                  <div className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isLight ? 'text-purple-600' : 'text-purple-400'
                  }`}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>


          {/* RIGHT COLUMN: Animated Hosting Dashboard Illustration */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            
            {/* Floating Domain Search Box (Interactive Preview) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`absolute -top-8 left-4 right-4 sm:left-8 sm:right-8 z-30 border p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl ${
                isLight 
                  ? 'bg-white/95 border-purple-300 shadow-purple-200/60' 
                  : 'bg-slate-900/90 border-purple-500/40 shadow-2xl'
              }`}
            >
              <form onSubmit={handleDomainSubmit} className="flex items-center gap-2">
                <span className="text-xl pl-1">🔎</span>
                <input
                  type="text"
                  placeholder="Find your dream domain (e.g. mybrand.com)..."
                  value={quickDomain}
                  onChange={(e) => setQuickDomain(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500' 
                      : 'bg-slate-800/80 border-slate-700/60 text-white placeholder-slate-400 focus:border-purple-400'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white text-xs font-black rounded-xl cursor-pointer shadow-md shrink-0 transition-transform hover:scale-105 active:scale-95"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* Main Glassmorphic Dashboard Frame with Gradient Border */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] p-[1.5px] rounded-3xl shadow-2xl shadow-purple-950/40 relative pt-8"
            >
              <div className={`rounded-[22px] p-5 sm:p-6 space-y-5 backdrop-blur-2xl relative overflow-hidden ${
                isLight ? 'bg-white/95 text-slate-900' : 'bg-[#0F172A]/95 text-slate-100'
              }`}>
                
                {/* Header Widget */}
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <div className={`text-xs font-black flex items-center gap-1.5 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        <span>node-dhaka-01.webzonebd.cloud</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                          LIVE
                        </span>
                      </div>
                      <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        IP: 103.145.230.12 • Ping: <span className="text-emerald-500 dark:text-emerald-400 font-bold">{pingLatency}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget Selector Buttons */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700/50'
                  }`}>
                    <button
                      onClick={() => setActiveTabWidget('metrics')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        activeTabWidget === 'metrics'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📊 Metrics
                    </button>
                    <button
                      onClick={() => setActiveTabWidget('nodes')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        activeTabWidget === 'nodes'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🖥️ Racks
                    </button>
                  </div>
                </div>

                {/* Animated Widget Tab Content */}
                {activeTabWidget === 'metrics' ? (
                  <div className="space-y-4">
                    {/* CPU Load Meter */}
                    <div className="space-y-1.5">
                      <div className={`flex justify-between text-xs font-bold ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        <span>⚡ CPU Load (AMD EPYC 7763)</span>
                        <span className="text-purple-600 dark:text-purple-300 font-mono font-black">{cpuUsage}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2.5 overflow-hidden border ${
                        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700/60'
                      }`}>
                        <motion.div
                          animate={{ width: `${cpuUsage}%` }}
                          transition={{ duration: 0.8 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                        />
                      </div>
                    </div>

                    {/* RAM Utilization Meter */}
                    <div className="space-y-1.5">
                      <div className={`flex justify-between text-xs font-bold ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        <span>💾 RAM Utilization (DDR4 ECC)</span>
                        <span className="text-cyan-600 dark:text-cyan-300 font-mono font-black">{ramUsage}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2.5 overflow-hidden border ${
                        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700/60'
                      }`}>
                        <motion.div
                          animate={{ width: `${ramUsage}%` }}
                          transition={{ duration: 0.8 }}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                        />
                      </div>
                    </div>

                    {/* Live Network Bandwidth Meter */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700/50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌐</span>
                        <div>
                          <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>BDIX Uplink Speed</div>
                          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Low-latency fiber route</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{networkSpeed} Mbps</div>
                        <div className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80 font-bold">10 Gbps Port</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Server Rack Visualizer */
                  <div className="space-y-2.5">
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <div>
                          <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>LiteSpeed Enterprise</div>
                          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Cache Engine</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-800">
                        ONLINE
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛡️</span>
                        <div>
                          <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Imunify360 Firewall</div>
                          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Malware Shield</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-black border border-purple-800">
                        PROTECTED
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💾</span>
                        <div>
                          <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>NVMe Storage Array</div>
                          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>RAID-10 Hardware</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-black border border-cyan-800">
                        OPTIMIZED
                      </span>
                    </div>
                  </div>
                )}

                {/* Live Uptime Indicator Badge */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  isLight 
                    ? 'bg-gradient-to-r from-emerald-50 via-slate-50 to-purple-50 border-emerald-200' 
                    : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-purple-950/60 border-emerald-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">🟢 Live Uptime SLA:</span>
                    <span className={`${isLight ? 'text-slate-900' : 'text-white'} font-mono font-black`}>99.99%</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Auto Failover OK</span>
                </div>

              </div>
            </motion.div>

            {/* Floating Badges around Dashboard */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={`absolute -bottom-5 -left-4 z-20 px-3.5 py-2 rounded-xl border text-xs font-extrabold shadow-xl backdrop-blur-md flex items-center gap-2 ${
                isLight 
                  ? 'bg-white/95 border-purple-300 text-purple-900 shadow-purple-100/80' 
                  : 'bg-slate-900/90 border-purple-500/40 text-purple-200'
              }`}
            >
              <span>☁️</span>
              <span>Daily Backup OK</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className={`absolute -bottom-5 -right-2 z-20 px-3.5 py-2 rounded-xl border text-xs font-extrabold shadow-xl backdrop-blur-md flex items-center gap-2 ${
                isLight 
                  ? 'bg-white/95 border-emerald-300 text-emerald-900 shadow-emerald-100/80' 
                  : 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span>🔒</span>
              <span>SSL Auto-Renewed</span>
            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
}
