import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms before revealing
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => {
              setIsRevealed(true);
            }, delay);
          } else {
            setIsRevealed(true);
          }
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.05, // Lower threshold so it starts animating sooner as user scrolls
        rootMargin: '0px 0px -40px 0px', // Offset from viewport bottom for natural reveal
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isRevealed 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-[0.99] pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}
