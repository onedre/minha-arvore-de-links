import React from 'react';
import { BookOpen, Calculator, Globe } from 'lucide-react';
import { LinkItem } from '../types';
import { InstagramIcon, PixIcon, TikTokIcon, WhatsAppIcon } from './BrandIcons';

interface LinkKind {
  label: string;
  Icon: React.FC<{ className?: string }>;
  // Brand-colored chip classes
  chip: string;
}

// Infer what a link points to from its URL/title so each card carries a recognizable icon
export const getLinkKind = (link: LinkItem): LinkKind => {
  const url = link.url.toLowerCase();
  const text = `${link.title} ${link.badge ?? ''}`.toLowerCase();

  if (url.includes('instagram.com')) {
    return { label: 'Instagram', Icon: InstagramIcon, chip: 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white' };
  }
  if (url.includes('tiktok.com')) {
    return { label: 'TikTok', Icon: TikTokIcon, chip: 'bg-slate-950 text-white ring-1 ring-white/15' };
  }
  if (url.includes('whatsapp') || url.includes('wa.me')) {
    return { label: 'WhatsApp', Icon: WhatsAppIcon, chip: 'bg-[#25D366] text-white' };
  }
  if (url.includes('livepix') || text.includes('pix')) {
    return { label: 'Pix', Icon: PixIcon, chip: 'bg-[#32BCAD] text-white' };
  }
  if (url.includes('hotmart') || text.includes('e-book') || text.includes('ebook')) {
    return { label: 'E-book', Icon: BookOpen, chip: 'bg-[#F04E23] text-white' };
  }
  if (url.includes('calc') || text.includes('calc') || text.includes('app')) {
    return { label: 'App', Icon: Calculator, chip: 'bg-indigo-600 text-white' };
  }
  return { label: 'Site', Icon: Globe, chip: 'bg-emerald-600 text-white' };
};

interface LinkTypeIconProps {
  link: LinkItem;
  className?: string;
  iconClassName?: string;
}

export const LinkTypeIcon: React.FC<LinkTypeIconProps> = ({ link, className = 'w-6 h-6', iconClassName = 'w-3.5 h-3.5' }) => {
  const { Icon, chip, label } = getLinkKind(link);
  return (
    <span
      title={label}
      className={`inline-flex items-center justify-center rounded-full shadow-md ${chip} ${className}`}
    >
      <Icon className={iconClassName} />
    </span>
  );
};
