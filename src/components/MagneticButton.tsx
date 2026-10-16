import React, { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  ariaLabel: string;
  title: string;
  brand: 'instagram' | 'tiktok' | 'whatsapp';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  ariaLabel,
  title,
  brand,
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Calculate distance and damp magnetic pull
    const distanceX = (clientX - centerX) * 0.35;
    const distanceY = (clientY - centerY) * 0.35;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getBrandAura = () => {
    switch (brand) {
      case 'instagram':
        return 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(225,48,108,0.5)]';
      case 'whatsapp':
        return 'hover:bg-[#25D366] hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]';
      case 'tiktok':
        return 'hover:bg-black hover:text-white hover:border-slate-700 hover:shadow-[0_0_20px_rgba(37,244,238,0.4)]';
      default:
        return '';
    }
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.1s ease-out',
      }}
      className={`group min-w-[46px] min-h-[46px] p-2.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-300 flex items-center justify-center active:scale-95 cursor-pointer tactile-press ${getBrandAura()}`}
    >
      {children}
    </a>
  );
};
