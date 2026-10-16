import React, { useState, useEffect } from 'react';
import { useLinkHub } from './hooks/useLinkHub';
import { Header } from './components/Header';
import { LinkCard } from './components/LinkCard';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { AdminPage } from './pages/AdminPage';
import { LinkCategory } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LinkCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isPathAdmin = window.location.pathname.startsWith('/admin');
      const isQueryAdmin = window.location.search.includes('admin');
      if (isPathAdmin || isQueryAdmin) {
        setIsAdminRoute(true);
      }
    }
  }, []);

  const {
    theme,
    toggleTheme,
    profile,
    links,
    recordClick,
  } = useLinkHub();

  const [isShareOpen, setIsShareOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2500);
  };

  // If URL is /admin or ?admin, show the dedicated Admin Portal
  if (isAdminRoute) {
    return <AdminPage />;
  }

  // PURE PUBLIC LANDING PAGE (100% Read-Only, High-Performance Mobile First)
  const activeLinks = links
    .filter(link => link.isActive)
    .filter(link => {
      if (selectedCategory === 'all') return true;
      return link.category === selectedCategory;
    });

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-white bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      {/* Fluid Mesh Gradient Aura (Inspired by linkinbio-nextjs / Modern Dark UI) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft Emerald Mesh Orb */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[450px] bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-[90px] dark:from-emerald-500/25 dark:via-teal-500/15 rounded-full animate-mesh-1" />

        {/* Deep Violet/Purple Mesh Orb for High-End Depth */}
        <div className="absolute top-20 right-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/15 via-purple-600/10 to-transparent blur-[110px] dark:from-purple-900/20 dark:via-indigo-900/15 rounded-full animate-mesh-2" />

        {/* Subtle Ambient Emerald Counter-glow */}
        <div className="absolute top-1/2 left-[-15%] w-[400px] h-[400px] bg-emerald-600/10 dark:bg-emerald-600/15 blur-[100px] rounded-full" />

        {/* Editorial Baseline Grid behind the masthead */}
        <div className="absolute inset-x-0 top-0 h-[620px] editorial-grid" />
      </div>

      {/* Print-like Film Grain over the whole canvas */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-40 editorial-grain" />

      {/* Main Content Container */}
      <main className="w-full max-w-xl mx-auto px-3 sm:px-6 flex-1 flex flex-col">
        {/* Public Header with Neon Glow, Magnetic Icons & Glassmorphism */}
        <Header
          profile={profile}
          theme={theme}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onToggleTheme={toggleTheme}
          onOpenShare={() => setIsShareOpen(true)}
        />

        {/* Links Feed */}
        <section aria-label="Links oficiais" className="w-full space-y-3.5 my-3 flex-1">
          {/* Editorial Index Rule */}
          <div className="flex items-center gap-3 px-1 pt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <span>Índice</span>
            <span aria-hidden="true" className="h-px flex-1 bg-slate-300/70 dark:bg-white/10" />
            <span>{String(activeLinks.length).padStart(2, '0')} {activeLinks.length === 1 ? 'link' : 'links'}</span>
          </div>

          {activeLinks.map((link, index) => (
            <div
              key={link.id}
              className="animate-card-enter"
              style={{ animationDelay: `${460 + index * 60}ms` }}
            >
              <LinkCard
                link={link}
                index={index + 1}
                onLinkClick={recordClick}
                onCopyFeedback={showToast}
              />
            </div>
          ))}

          {activeLinks.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500">
              <p className="text-sm">Nenhum link nesta categoria.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 cursor-pointer"
              >
                Ver todos os links
              </button>
            </div>
          )}
        </section>

        {/* Editorial Pull-Quote / Manifesto */}
        <figure className="relative mt-10 mb-2 px-6 text-center animate-reveal" style={{ animationDelay: '800ms' }}>
          <span
            aria-hidden="true"
            className="block font-serif text-6xl leading-none h-8 text-emerald-500/70 dark:text-emerald-400/60 select-none"
          >
            “
          </span>
          <blockquote className="font-serif italic text-[1.45rem] sm:text-2xl leading-snug text-slate-800 dark:text-slate-100 text-balance">
            A ciência da nutrição, amplificada pela tecnologia.
          </blockquote>
          <figcaption className="mt-3 flex items-center justify-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <span aria-hidden="true" className="h-px w-6 bg-emerald-500/60" />
            <span>André Santos</span>
          </figcaption>
        </figure>

        {/* Floating WhatsApp CTA with Linear Light Shimmer Sweep */}
        <div className="sticky bottom-6 w-full flex justify-center pointer-events-none z-30 pt-4">
          <a
            href="https://api.whatsapp.com/send?phone=5592981850316&text=Ol%C3%A1%20Nutri%20Andr%C3%A9%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20e%20consultoria."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="group relative overflow-hidden pointer-events-auto tactile-press h-12 px-6 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(16,185,129,0.35)] flex items-center gap-2.5 transition-all duration-300 border border-emerald-300/30"
          >
            {/* Linear Shimmer Sweep (Passing light reflection) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-cta-shimmer" />
            </div>

            <MessageCircle className="w-4 h-4 fill-current relative z-10" />
            <span className="relative z-10 tracking-wide">Agendar Consulta</span>
          </a>
        </div>

        {/* Public Footer */}
        <Footer crn={profile.crn} />
      </main>

      {/* Share / QR Code Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profileName={profile.name}
      />

      {/* Interactive Mobile Touch Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
