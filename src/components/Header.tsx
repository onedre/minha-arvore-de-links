import React, { useState } from 'react';
import { Sun, Moon, Share2, ShieldCheck } from 'lucide-react';
import { ProfileData, LinkCategory } from '../types';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './BrandIcons';
import { MagneticButton } from './MagneticButton';

interface HeaderProps {
  profile: ProfileData;
  theme: 'dark' | 'light';
  selectedCategory: LinkCategory;
  onSelectCategory: (category: LinkCategory) => void;
  onToggleTheme: () => void;
  onOpenShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  theme,
  selectedCategory,
  onSelectCategory,
  onToggleTheme,
  onOpenShare,
}) => {
  const [avatarError, setAvatarError] = useState(false);

  // Concise single-word labels that fit 100% of mobile screens without cut-off
  const categories: Array<{ id: LinkCategory; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'clinic', label: 'Clínica' },
    { id: 'tech', label: 'Apps' },
    { id: 'social', label: 'Redes' },
  ];

  return (
    <header className="w-full pt-3 pb-3 flex flex-col items-center">
      {/* Top Floating Controls Bar */}
      <div className="w-full flex items-center justify-between px-1 mb-5 max-w-xl animate-reveal">
        <div className="flex items-center gap-2">
          {/* Subtle Verified Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="tracking-wide">Canal Oficial</span>
          </div>
        </div>

        {/* Public Share & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Quick Share Link */}
          <button
            onClick={onOpenShare}
            aria-label="Compartilhar perfil"
            className="h-9 px-3.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm active:scale-95 cursor-pointer tactile-press"
            title="Compartilhar ou ver QR Code"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="w-9 h-9 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center shadow-sm active:scale-95 cursor-pointer tactile-press"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Living Avatar with Glowing Neon Border (Inner & Outer Glow) */}
      <div className="relative group mb-4 animate-avatar-zoom">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 avatar-neon">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-950 flex items-center justify-center ring-2 ring-emerald-500/30">
            {!avatarError ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-2xl">
                AS
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name & Metallic Verified Badge */}
      <div
        className="flex items-center gap-2 mb-1.5 px-2 text-center animate-reveal"
        style={{ animationDelay: '100ms' }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {profile.name}
        </h1>
        {profile.verified && (
          <div className="animate-badge-shine inline-flex items-center" title="Nutricionista Verificado">
            <ShieldCheck
              className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0"
              aria-label="Perfil verificado"
            />
          </div>
        )}
      </div>

      {/* Unified Professional Tagline & CRN with High-Refinement Letter Spacing */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2.5 text-center px-2 animate-reveal"
        style={{ animationDelay: '180ms' }}
      >
        <span className="tracking-wide">{profile.tagline}</span>
        <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
        <span className="font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap tracking-wider text-[11px] sm:text-xs bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/50 dark:border-white/5">
          {profile.crn}
        </span>
      </div>

      {/* Bio text - Natural width and breathing room */}
      <p
        className="w-full max-w-lg text-[13px] sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-center px-1 mb-4 text-balance tracking-[0.01em] animate-reveal"
        style={{ animationDelay: '260ms' }}
      >
        {profile.bio}
      </p>

      {/* Authentic Social Links Row with Magnetic Attraction & Official Glowing Auras */}
      <div
        className="flex items-center justify-center gap-3.5 mb-5 animate-reveal"
        style={{ animationDelay: '340ms' }}
      >
        {profile.socials.map(soc => (
          <MagneticButton
            key={soc.id}
            href={soc.url}
            brand={soc.platform as 'instagram' | 'tiktok' | 'whatsapp'}
            ariaLabel={`Visitar ${soc.label}`}
            title={soc.label}
          >
            {soc.platform === 'instagram' && <InstagramIcon className="w-5 h-5 transition-transform group-hover:scale-110" />}
            {soc.platform === 'tiktok' && <TikTokIcon className="w-5 h-5 transition-transform group-hover:scale-110" />}
            {soc.platform === 'whatsapp' && <WhatsAppIcon className="w-5 h-5 transition-transform group-hover:scale-110" />}
          </MagneticButton>
        ))}
      </div>

      {/* Thumb-Friendly Category Segmented Control with Glassmorphism Surface */}
      <div
        className="w-full max-w-md px-1 animate-reveal"
        style={{ animationDelay: '400ms' }}
      >
        <nav
          aria-label="Filtrar por categoria"
          className="grid grid-cols-4 gap-1 p-1 rounded-xl glass-panel w-full shadow-sm"
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`py-1.5 px-1 rounded-lg text-xs font-semibold text-center truncate transition-all duration-200 tactile-press ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
