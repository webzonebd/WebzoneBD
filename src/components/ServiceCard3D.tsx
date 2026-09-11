import React, { useState, useRef } from 'react';

interface ServiceCard3DProps {
  children: React.ReactNode;
  key?: React.Key;
  className?: string;
  innerClassName?: string;
  isHighDemand?: boolean;
  glowGradient?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ServiceCard3D({ 
  children, 
  className = '', 
  innerClassName = '',
  isHighDemand = false,
  glowGradient,
  isSelected = false,
  onClick
}: ServiceCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (-8deg to +8deg for smooth, natural 3D tilt)
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const gradientClass = glowGradient || (
    isHighDemand 
      ? 'from-pink-500 via-rose-500 to-amber-400' 
      : 'from-blue-600 via-indigo-500 to-cyan-400'
  );

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between h-full rounded-[24px] p-[1.5px] cursor-pointer ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered 
          ? 'transform 0.1s ease-out, box-shadow 0.3s ease-out' 
          : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
        willChange: 'transform'
      }}
    >
      {/* 1. Glassmorphism Ambient Outer Border Glow */}
      <span 
        className={`absolute inset-0 rounded-[24px] bg-gradient-to-r ${gradientClass} transition-opacity duration-300 pointer-events-none`}
        style={{
          opacity: isHovered ? 0.6 : isSelected ? 0.48 : 0.2
        }}
      />

      {/* 2. Softened Background Blur Halo Glow on Hover */}
      <span 
        className={`absolute -inset-1.5 rounded-[28px] bg-gradient-to-r ${gradientClass} transition-all duration-500 pointer-events-none blur-2xl`}
        style={{
          opacity: isHovered ? 0.45 : isSelected ? 0.18 : 0
        }}
      />

      {/* 3. Glassmorphism Card Container */}
      <div className={`relative z-10 flex flex-col justify-between h-full w-full rounded-[23px] overflow-hidden bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border transition-shadow duration-300 ${
        isSelected
          ? 'border-blue-500/50 dark:border-cyan-400/50'
          : 'border-white/50 dark:border-white/10'
      } ${
        isHovered 
          ? 'shadow-[0_20px_50px_rgba(37,99,235,0.17)] dark:shadow-[0_25px_60px_rgba(14,165,233,0.15)]' 
          : 'shadow-[0_10px_30px_rgba(0,0,0,0.04)]'
      } ${innerClassName}`}>
        
        {/* 4. Glass Reflection Light Beam / Cursor Spotlight */}
        <div 
          className="absolute inset-0 rounded-[23px] pointer-events-none z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.13), transparent 60%)`
          }}
        />

        {children}
      </div>
    </div>
  );
}
