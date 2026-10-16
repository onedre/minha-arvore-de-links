import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  crn: string;
}

export const Footer: React.FC<FooterProps> = ({ crn }) => {
  return (
    <footer className="w-full pt-8 pb-12 flex flex-col items-center text-center px-4">
      {/* Colophon Ornament: hairline · diamond fleuron · hairline */}
      <div aria-hidden="true" className="flex items-center gap-3 mb-5 text-emerald-500/70 dark:text-emerald-400/60">
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-current" />
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor">
          <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" />
        </svg>
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-current" />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>Nutricionista Clínico · {crn}</span>
      </div>

      <p className="max-w-xs text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 mb-2 text-balance">
        Conteúdo de caráter informativo. Não substitui a avaliação nutricional individualizada.
      </p>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} André Santos · Todos os direitos reservados.
      </p>
    </footer>
  );
};
