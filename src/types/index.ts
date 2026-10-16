export type LayoutType = 'standard' | 'featured';
export type HighlightType = 'none' | 'pulse' | 'glow';
export type LinkCategory = 'all' | 'clinic' | 'tech' | 'social';

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  thumbnailUrl: string;
  layout: LayoutType;
  highlightAnimation?: HighlightType;
  category?: LinkCategory;
  badge?: string;
  isActive: boolean;
  order: number;
  clicks: number;
  createdAt: number;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'tiktok' | 'whatsapp' | 'email' | 'web';
  label: string;
  url: string;
  iconName: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  tagline: string;
  bio: string;
  crn: string;
  avatarUrl: string;
  verified: boolean;
  socials: SocialLink[];
}
