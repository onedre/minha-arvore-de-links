import React, { useState } from 'react';
import { X, Plus, ArrowUp, ArrowDown, Trash2, Edit2, Check, Download, Upload, RotateCcw, Eye, EyeOff, Code, KeyRound, LogOut, Copy } from 'lucide-react';
import { LinkItem, ProfileData, LayoutType, HighlightType } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  profile: ProfileData;
  adminPin: string;
  onAddLink: (data: Omit<LinkItem, 'id' | 'order' | 'clicks' | 'createdAt'>) => void;
  onUpdateLink: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onToggleActive: (id: string) => void;
  onMoveLink: (index: number, direction: 'up' | 'down') => void;
  onResetToDefaults: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => boolean;
  onUpdateProfile: (profile: ProfileData) => void;
  onGenerateCodeExport: () => string;
  onChangePin: (newPin: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  links,
  profile,
  adminPin,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onToggleActive,
  onMoveLink,
  onResetToDefaults,
  onExportBackup,
  onImportBackup,
  onUpdateProfile,
  onGenerateCodeExport,
  onChangePin,
  onLogoutAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'code' | 'security'>('links');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for Add/Edit Link
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formLayout, setFormLayout] = useState<LayoutType>('standard');
  const [formHighlight, setFormHighlight] = useState<HighlightType>('none');
  const [formBadge, setFormBadge] = useState('');

  // Profile edit states
  const [profName, setProfName] = useState(profile.name);
  const [profTagline, setProfTagline] = useState(profile.tagline);
  const [profCrn, setProfCrn] = useState(profile.crn);
  const [profBio, setProfBio] = useState(profile.bio);
  const [profAvatar, setProfAvatar] = useState(profile.avatarUrl);

  // Security / PIN states
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Code copy state
  const [codeCopied, setCodeCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

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
      onAddLink({
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
      onUpdateLink({
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
    onUpdateProfile({
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
    const code = onGenerateCodeExport();
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length >= 4) {
      onChangePin(newPinInput.trim());
      setNewPinInput('');
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = onImportBackup(content);
      if (success) {
        setImportStatus('Backup importado com sucesso!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Erro: arquivo JSON inválido.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Painel do Nutri André</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Autenticado
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize links, perfil e dados com total privacidade
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-5 text-sm font-medium overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('links');
              setIsAdding(false);
              setEditingLink(null);
            }}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'links'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
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
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => {
              setActiveTab('code');
              setIsAdding(false);
              setEditingLink(null);
            }}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'code'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Publicar no Código
          </button>
          <button
            onClick={() => {
              setActiveTab('security');
              setIsAdding(false);
              setEditingLink(null);
            }}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Segurança & Backup
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: LINKS */}
          {activeTab === 'links' && (
            <div>
              {(isAdding || editingLink) ? (
                <form onSubmit={handleSaveForm} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-sm">
                      {isAdding ? 'Novo Link' : 'Editar Link'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingLink(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Título do Link *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="Ex: Garanta o E-book..."
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Subtítulo / Descrição
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={e => setFormSubtitle(e.target.value)}
                      placeholder="Ex: Guia prático para terceira idade..."
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      URL de Destino *
                    </label>
                    <input
                      type="url"
                      required
                      value={formUrl}
                      onChange={e => setFormUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      URL da Imagem / Miniatura
                    </label>
                    <input
                      type="url"
                      value={formThumbnail}
                      onChange={e => setFormThumbnail(e.target.value)}
                      placeholder="https://... ou vazio para ícone"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Layout
                      </label>
                      <select
                        value={formLayout}
                        onChange={e => setFormLayout(e.target.value as LayoutType)}
                        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="standard">Padrão (Horizontal)</option>
                        <option value="featured">Destaque (16:9 Banner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Animação
                      </label>
                      <select
                        value={formHighlight}
                        onChange={e => setFormHighlight(e.target.value as HighlightType)}
                        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="none">Nenhuma</option>
                        <option value="pulse">Pulso Suave (Buzz)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Tag / Badge (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={e => setFormBadge(e.target.value)}
                      placeholder="Ex: Mais Procurado, Novo, App..."
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Link</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleStartAdd}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Novo Link</span>
                  </button>

                  <div className="space-y-2.5">
                    {links.map((link, index) => (
                      <div
                        key={link.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          link.isActive
                            ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">{link.title}</span>
                            {link.layout === 'featured' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                                16:9
                              </span>
                            )}
                            {link.highlightAnimation === 'pulse' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                                Pulse
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{link.url}</p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {link.clicks || 0} cliques
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onMoveLink(index, 'up')}
                            disabled={index === 0}
                            title="Mover para cima"
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onMoveLink(index, 'down')}
                            disabled={index === links.length - 1}
                            title="Mover para baixo"
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onToggleActive(link.id)}
                            title={link.isActive ? 'Desativar link' : 'Ativar link'}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                          >
                            {link.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                          </button>
                          <button
                            onClick={() => handleStartEdit(link)}
                            title="Editar link"
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja remover "${link.title}"?`)) {
                                onDeleteLink(link.id);
                              }
                            }}
                            title="Excluir link"
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nome Profissional
                </label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={e => setProfName(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Especialidade / Subtítulo
                </label>
                <input
                  type="text"
                  value={profTagline}
                  onChange={e => setProfTagline(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Registro Profissional (CRN)
                </label>
                <input
                  type="text"
                  value={profCrn}
                  onChange={e => setProfCrn(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Biografia
                </label>
                <textarea
                  rows={3}
                  value={profBio}
                  onChange={e => setProfBio(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  URL da Foto de Perfil (Avatar)
                </label>
                <input
                  type="url"
                  value={profAvatar}
                  onChange={e => setProfAvatar(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Atualizar Perfil</span>
              </button>
            </form>
          )}

          {/* TAB 3: PUBLISH TO CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <Code className="w-4 h-4" />
                  <span>Publicação Oficial Permanente</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Quando você adiciona ou edita links neste painel, eles ficam salvos no seu navegador. Se quiser tornar suas mudanças <strong>definitivas para todos os visitantes</strong> sem custo de banco de dados, clique abaixo para copiar o código gerado e atualizar seu arquivo <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px]">src/data/defaultData.ts</code>.
                </p>

                <button
                  onClick={handleCopyCode}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Código Copiado para a Área de Transferência!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Código do defaultData.ts</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">Prévia do Código Gerado:</span>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-800">
                  {onGenerateCodeExport()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & BACKUP */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change PIN */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-semibold text-sm">Alterar Senha / PIN Master</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PIN atual configurado: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{adminPin}</strong>
                </p>
                <form onSubmit={handleChangePinSubmit} className="flex gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    required
                    placeholder="Novo PIN (mín. 4 dígitos)"
                    value={newPinInput}
                    onChange={e => setNewPinInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0"
                  >
                    Salvar PIN
                  </button>
                </form>
                {pinChangeSuccess && (
                  <p className="text-xs text-emerald-500 font-medium">Novo PIN salvo com sucesso!</p>
                )}
              </div>

              {/* End Session */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <h3 className="font-semibold text-sm">Encerrar Sessão</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bloqueie o painel neste dispositivo. O botão de gerenciar desaparecerá e será exigido o PIN novamente.
                </p>
                <button
                  onClick={() => {
                    onLogoutAdmin();
                    onClose();
                  }}
                  className="w-full py-2 px-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sair do Modo Administrador</span>
                </button>
              </div>

              {/* Backup JSON */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <h3 className="font-semibold text-sm">Arquivo de Backup (JSON)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExportBackup}
                    className="py-2 px-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Backup</span>
                  </button>

                  <label className="py-2 px-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restaurar</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
                {importStatus && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                    {importStatus}
                  </p>
                )}
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 space-y-2">
                <h3 className="font-semibold text-sm text-red-600 dark:text-red-400">Restaurar Padrões Originais</h3>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">
                  Restaura os links e fotos originais extraídos do seu Linktree.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza? Isso restaurará a lista de links original.')) {
                      onResetToDefaults();
                      alert('Configurações originais restauradas!');
                    }
                  }}
                  className="w-full py-2 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrões de Fábrica</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
