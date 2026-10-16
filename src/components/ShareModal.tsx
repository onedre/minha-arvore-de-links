import React, { useState } from 'react';
import { X, Check, Copy, MessageCircle, Send, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, profileName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nutri-andre-s.vercel.app';
  // SVG-based dynamic QR Code generator via standard safe URL encoding
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=0f172a&margin=1`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Confira a página oficial com todos os links e e-books do Nutri André Santos: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Confira a página oficial de links do Nutri André Santos:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-lg">Compartilhar Perfil</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 text-center">
          Escaneie o código com a câmera do celular ou compartilhe nas redes
        </p>

        {/* QR Code Container */}
        <div className="w-44 h-44 rounded-xl p-2.5 bg-white shadow-inner border border-slate-200 flex items-center justify-center mb-5">
          <img
            src={qrCodeUrl}
            alt={`QR Code para ${profileName}`}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* Copy Link Input Bar */}
        <div className="w-full flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 mb-4">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-600 dark:text-slate-300 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="w-full grid grid-cols-2 gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTwitterShare}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>X / Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
