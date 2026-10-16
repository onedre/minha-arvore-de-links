import React, { useState } from 'react';
import { useLinkHub } from '../hooks/useLinkHub';
import { LinkItem, LayoutType, HighlightType, ProfileData } from '../types';
import {
  Lock, KeyRound, Plus, ArrowUp, ArrowDown, Trash2, Edit2, Eye, EyeOff,
  Check, Copy, Download, Upload, RotateCcw, ExternalLink, LogOut, Code,
  Smartphone, Shield, LayoutGrid, AlertCircle
} from 'lucide-react';
import { LinkCard } from '../components/LinkCard';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '../components/BrandIcons';


export const AdminPage: React.FC = () => {
  const {
    links,
    profile,
    addLink,
    updateLink,
    deleteLink,
    toggleActive,
    moveLink,
    resetToDefaults,
    exportBackup,
    importBackup,
    saveProfile,
    generateCodeExport,
    isAdminAuthenticated,
    adminPin,
    authenticatePin,
    logoutAdmin,
    changePin,
  } = useLinkHub();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'publish' | 'security'>('links');

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formLayout, setFormLayout] = useState<LayoutType>('standard');
  const [formHighlight, setFormHighlight] = useState<HighlightType>('none');
  const [formBadge, setFormBadge] = useState('');

  // Profile states
  const [profName, setProfName] = useState(profile.name);
  const [profTagline, setProfTagline] = useState(profile.tagline);
  const [profCrn, setProfCrn] = useState(profile.crn);
  const [profBio, setProfBio] = useState(profile.bio);
  const [profAvatar, setProfAvatar] = useState(profile.avatarUrl);

  // Change PIN states
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Copy code feedback
  const [codeCopied, setCodeCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // LOGIN SCREEN
  if (!isAdminAuthenticated) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = authenticatePin(pinInput.trim());
      if (success) {
        setPinError(false);
        setPinInput('');
      } else {
        setPinError(true);
        setPinInput('');
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-bold text-white mb-1 text-center">
            Painel do Nutri André
          </h1>
          <p className="text-xs text-slate-400 text-center mb-6">
            Área restrita de gestão. Digite seu PIN de acesso para gerenciar os links.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                autoFocus
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(false);
                }}
                placeholder="PIN (Padrão: 2113)"
                className="w-full text-center text-xl tracking-widest px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {pinError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorreto. Tente novamente.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>Acessar Painel</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 w-full text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>← Voltar para a Landing Page Pública</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  const handleStartAdd = () => {
    setEditingLink(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormUrl('https://');
    setFormThumbnail('');
    setFormLayout('standard');
    setFormHighlight('none');
    setFormBadge('');
    setIsAdding(true);
  };

  const handleStartEdit = (link: LinkItem) => {
    setIsAdding(false);
    setEditingLink(link);
    setFormTitle(link.title);
    setFormSubtitle(link.subtitle || '');
    setFormUrl(link.url);
    setFormThumbnail(link.thumbnailUrl || '');
    setFormLayout(link.layout);
    setFormHighlight(link.highlightAnimation || 'none');
    setFormBadge(link.badge || '');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    if (isAdding) {
      addLink({
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        url: formUrl.trim(),
        thumbnailUrl: formThumbnail.trim(),
        layout: formLayout,
        highlightAnimation: formHighlight,
        badge: formBadge.trim() || undefined,
        isActive: true,
      });
      setIsAdding(false);
    } else if (editingLink) {
      updateLink({
        ...editingLink,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        url: formUrl.trim(),
        thumbnailUrl: formThumbnail.trim(),
        layout: formLayout,
        highlightAnimation: formHighlight,
        badge: formBadge.trim() || undefined,
      });
      setEditingLink(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      ...profile,
      name: profName.trim(),
      tagline: profTagline.trim(),
      crn: profCrn.trim(),
      bio: profBio.trim(),
      avatarUrl: profAvatar.trim(),
    });
    alert('Perfil atualizado com sucesso!');
  };

  const handleCopyCode = () => {
    const code = generateCodeExport();
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      changePin(newPin.trim());
      setNewPin('');
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 3000);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportStatus('Backup restaurado com sucesso!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Erro: arquivo inválido.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(l => l.isActive);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            AS
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Painel de Gestão</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                Privado & Seguro
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Nutri André Santos · CRN-7 21130/P</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Ver Landing Page Pública</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={logoutAdmin}
            title="Sair do painel"
            className="px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Encerrar Sessão</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Management Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="text-xs text-slate-400 block mb-1">Total de Links</span>
              <span className="text-xl font-bold text-white font-mono">{links.length}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="text-xs text-slate-400 block mb-1">Links Ativos</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{activeLinks.length}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="text-xs text-slate-400 block mb-1">Cliques Gravados</span>
              <span className="text-xl font-bold text-teal-400 font-mono">{totalClicks}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
            <button
              onClick={() => {
                setActiveTab('links');
                setIsAdding(false);
                setEditingLink(null);
              }}
              className={`py-2.5 border-b-2 transition-colors ${
                activeTab === 'links'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Links ({links.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsAdding(false);
                setEditingLink(null);
              }}
              className={`py-2.5 border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Perfil
            </button>
            <button
              onClick={() => {
                setActiveTab('publish');
                setIsAdding(false);
                setEditingLink(null);
              }}
              className={`py-2.5 border-b-2 transition-colors ${
                activeTab === 'publish'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Publicar Definitivo
            </button>
            <button
              onClick={() => {
                setActiveTab('security');
                setIsAdding(false);
                setEditingLink(null);
              }}
              className={`py-2.5 border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Segurança & Backup
            </button>
          </div>

          {/* TAB 1: LINKS MANAGEMENT */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {(isAdding || editingLink) ? (
                <form onSubmit={handleSaveForm} className="space-y-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">
                      {isAdding ? 'Cadastrar Novo Link' : 'Editar Link'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingLink(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Título do Link *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="Ex: Garanta o E-book..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Subtítulo / Descrição
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={e => setFormSubtitle(e.target.value)}
                      placeholder="Ex: Guia prático de fitoterapia..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      URL de Destino *
                    </label>
                    <input
                      type="url"
                      required
                      value={formUrl}
                      onChange={e => setFormUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      URL da Imagem / Miniatura
                    </label>
                    <input
                      type="url"
                      value={formThumbnail}
                      onChange={e => setFormThumbnail(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Formato / Layout
                      </label>
                      <select
                        value={formLayout}
                        onChange={e => setFormLayout(e.target.value as LayoutType)}
                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="standard">Padrão (Horizontal)</option>
                        <option value="featured">Destaque (Banner 16:9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Efeito Especial
                      </label>
                      <select
                        value={formHighlight}
                        onChange={e => setFormHighlight(e.target.value as HighlightType)}
                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="none">Nenhum</option>
                        <option value="pulse">Pulso Suave (Buzz)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Badge / Tag (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={e => setFormBadge(e.target.value)}
                      placeholder="Ex: E-book Oficial, Mais Procurado..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleStartAdd}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Novo Link</span>
                  </button>

                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <div
                        key={link.id}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          link.isActive
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-slate-900/40 border-slate-800/60 opacity-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-white truncate">
                              {link.title}
                            </h4>
                            {link.layout === 'featured' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium">
                                16:9
                              </span>
                            )}
                            {link.highlightAnimation === 'pulse' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                                Pulse
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate mb-1">{link.url}</p>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {link.clicks || 0} cliques registrados
                          </span>
                        </div>

                        {/* Order & Management Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveLink(index, 'up')}
                            disabled={index === 0}
                            title="Mover para cima"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveLink(index, 'down')}
                            disabled={index === links.length - 1}
                            title="Mover para baixo"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(link.id)}
                            title={link.isActive ? 'Desativar link' : 'Ativar link'}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                          </button>
                          <button
                            onClick={() => handleStartEdit(link)}
                            title="Editar link"
                            className="p-2 rounded-lg hover:bg-slate-800 text-emerald-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remover o link "${link.title}"?`)) {
                                deleteLink(link.id);
                              }
                            }}
                            title="Excluir link"
                            className="p-2 rounded-lg hover:bg-red-950/50 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-2">Dados do Perfil Clínico</h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Profissional</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={e => setProfName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Especialidade / Tagline</label>
                <input
                  type="text"
                  value={profTagline}
                  onChange={e => setProfTagline(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Registro Profissional (CRN)</label>
                <input
                  type="text"
                  value={profCrn}
                  onChange={e => setProfCrn(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Biografia</label>
                <textarea
                  rows={3}
                  value={profBio}
                  onChange={e => setProfBio(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">URL da Foto de Perfil</label>
                <input
                  type="url"
                  value={profAvatar}
                  onChange={e => setProfAvatar(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Perfil</span>
              </button>
            </form>
          )}

          {/* TAB 3: PUBLISH PERMANENT */}
          {activeTab === 'publish' && (
            <div className="space-y-5 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Code className="w-5 h-5" />
                <span>Publicação Oficial Permanente</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As edições feitas neste painel ficam salvas com segurança no seu navegador. Quando quiser que elas sejam a <strong>versão oficial padrão de fábrica para 100% dos novos visitantes</strong>, copie o código abaixo e atualize o arquivo <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-emerald-300">src/data/defaultData.ts</code>.
              </p>

              <button
                onClick={handleCopyCode}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Código TypeScript Copiado para a Área de Transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código para o defaultData.ts</span>
                  </>
                )}
              </button>

              <div className="space-y-1 pt-2">
                <span className="text-xs font-semibold text-slate-400">Prévia do Código Gerado:</span>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800/80">
                  {generateCodeExport()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & BACKUP */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change PIN */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Alterar PIN Master</span>
                </div>
                <p className="text-xs text-slate-400">
                  PIN atual configurado: <strong className="font-mono text-emerald-400">{adminPin}</strong>
                </p>
                <form onSubmit={handleChangePin} className="flex gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    required
                    placeholder="Novo PIN (mín. 4 dígitos)"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shrink-0"
                  >
                    Salvar PIN
                  </button>
                </form>
                {pinSuccess && (
                  <p className="text-xs text-emerald-400 font-medium">Novo PIN salvo com sucesso!</p>
                )}
              </div>

              {/* Backup JSON */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                <h3 className="font-bold text-sm text-white">Arquivo de Backup (JSON)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={exportBackup}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Backup</span>
                  </button>

                  <label className="py-2.5 px-3 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restaurar Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
                {importStatus && (
                  <p className="text-xs font-medium text-emerald-400 text-center">{importStatus}</p>
                )}
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-5 rounded-2xl border border-red-900/50 bg-red-950/20 space-y-3">
                <h3 className="font-bold text-sm text-red-400">Restaurar Padrões de Fábrica</h3>
                <p className="text-xs text-red-300/80">
                  Restaura os links e fotos originais extraídos do seu Linktree oficial.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza? Isso restaurará a lista de links original.')) {
                      resetToDefaults();
                      alert('Configurações originais restauradas!');
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrões Originais</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mobile Device Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-sm flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Simulador em Tempo Real (Mobile Preview)</span>
            </div>

            {/* Simulated Phone Shell */}
            <div className="w-full rounded-[38px] p-3 bg-slate-900 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
              {/* Dynamic Island / Speaker notch */}
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2" />

              {/* Simulated Screen Content */}
              <div className="w-full h-[620px] rounded-[28px] overflow-y-auto bg-slate-950 p-4 border border-slate-800/80 space-y-4">
                {/* Mini Profile Header */}
                <div className="flex flex-col items-center text-center pt-2">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 mb-2">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1">
                    <span>{profile.name}</span>
                    <Shield className="w-3 h-3 text-emerald-400 fill-current" />
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <span>{profile.tagline}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span className="font-mono text-slate-300">{profile.crn}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                  {/* Mini Social Icons Row */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                      <TikTokIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Simulated Links */}
                <div className="space-y-2.5 pt-2">
                  {activeLinks.map(link => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onLinkClick={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
