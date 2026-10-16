import React, { useState } from 'react';
import { ExternalLink, Share2, Check, Sparkles, ArrowRight } from 'lucide-react';
import { LinkItem } from '../types';

interface LinkCardProps {
  link: LinkItem;
  onLinkClick: (id: string) => void;
  onCopyFeedback?: (text: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onLinkClick, onCopyFeedback }) => {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    if (onCopyFeedback) {
      onCopyFeedback(`Link copiado para a área de transferência!`);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const isFeatured = link.layout === 'featured';
  const isPulse = link.highlightAnimation === 'pulse';

  if (!link.isActive) {
    return null;
  }

  // FEATURED LAYOUT (Widescreen 16:9 banner with glassmorphism & ambient beam)
  if (isFeatured) {
    return (
      <div
        className={`group relative w-full rounded-2xl overflow-hidden border tactile-press transition-all duration-300 ${
          isPulse
            ? 'border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
            : 'border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/40 shadow-sm hover:shadow-md'
        } bg-white/80 dark:bg-slate-900/55 backdrop-blur-md`}
      >
        {/* Ambient Shimmer Sweep (Mobile-visible without hover) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 dark:via-emerald-400/10 to-transparent animate-ambient-shimmer" />
        </div>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onLinkClick(link.id)}
          className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {/* 16:9 Image Container */}
          <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            {!imgError && link.thumbnailUrl ? (
              <img
                src={link.thumbnailUrl}
                alt={link.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-6 text-center">
                <Sparkles className="w-8 h-8 mb-2 text-emerald-300" />
                <span className="font-semibold text-lg">{link.title}</span>
              </div>
            )}

            {/* Gradient Scrim for perfect mobile legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Living Beacon Badge */}
            {link.badge && (
              <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{link.badge}</span>
              </div>
            )}
          </div>

          {/* Card Body with Glassmorphism */}
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                {link.title}
              </h2>

              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copiar link"
                  title={copied ? 'Link copiado!' : 'Copiar link'}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors active:scale-90"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <div className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>

            {link.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {link.subtitle}
              </p>
            )}

            {/* Mobile Visual Action Strip */}
            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-white/5">
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Acessar portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono text-slate-400">Oficial</span>
            </div>
          </div>
        </a>
      </div>
    );
  }

  // STANDARD LAYOUT (Clean tactile horizontal row with glassmorphic depth)
  return (
    <div
      className={`group relative w-full rounded-2xl border tactile-press transition-all duration-300 overflow-hidden ${
        isPulse
          ? 'border-emerald-500/70 shadow-md shadow-emerald-500/10 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]'
          : 'border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/40 shadow-sm'
      } bg-white/80 dark:bg-slate-900/50 backdrop-blur-md`}
    >
      {/* Subtle Ambient Shimmer for pulse items */}
      {isPulse && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent animate-ambient-shimmer" />
        </div>
      )}

      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick(link.id)}
        className="flex items-center justify-between p-3.5 sm:p-4 gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        {/* Left Thumbnail or Gradient Fallback */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-inner">
          {!imgError && link.thumbnailUrl ? (
            <img
              src={link.thumbnailUrl}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-sm">
              {link.title.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Middle Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {link.title}
            </h2>
            {link.badge && (
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full shrink-0">
                {isPulse && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
                <span>{link.badge}</span>
              </span>
            )}
          </div>

          {link.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {link.subtitle}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copiar link"
            title={copied ? 'Copiado!' : 'Copiar URL'}
            className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors active:scale-90"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <div className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </a>
    </div>
  );
};
