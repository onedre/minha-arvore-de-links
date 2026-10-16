import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (pin: string) => boolean;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onAuthenticate }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(pin.trim());
    if (success) {
      setPin('');
      setError(false);
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col items-center">
        <button
          onClick={() => {
            setError(false);
            setPin('');
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-base mb-1">Acesso do Nutri André</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
          Digite seu PIN de segurança para gerenciar os links deste dispositivo
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Digite o PIN (Padrão: 2113)"
              className="w-full text-center text-lg tracking-widest px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 justify-center">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>PIN incorreto. Tente novamente.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Desbloquear Painel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
