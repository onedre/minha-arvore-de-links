import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  crn: string;
}

export const Footer: React.FC<FooterProps> = ({ crn }) => {
  return (
    <footer className="w-full pt-8 pb-12 flex flex-col items-center text-center px-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>Nutricionista Clínico · {crn}</span>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} André Santos · Todos os direitos reservados.
      </p>
    </footer>
  );
};
