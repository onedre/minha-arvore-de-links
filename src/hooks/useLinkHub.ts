import { useState, useEffect, useCallback } from 'react';
import { LinkItem, ProfileData } from '../types';
import { DEFAULT_LINKS, DEFAULT_PROFILE } from '../data/defaultData';

const LINKS_STORAGE_KEY = 'nutri_hub_links_v1';
const PROFILE_STORAGE_KEY = 'nutri_hub_profile_v1';
const THEME_STORAGE_KEY = 'nutri_hub_theme_v1';
const ADMIN_AUTH_KEY = 'nutri_hub_admin_auth_v1';
const PIN_STORAGE_KEY = 'nutri_hub_admin_pin_v1';
const DEFAULT_PIN = '2113'; // Default PIN (first 4 digits of CRN-7 21130)

export function useLinkHub() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  // Links state
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const savedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
      if (savedLinks) {
        const parsed = JSON.parse(savedLinks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.order - b.order);
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_LINKS;
  });

  // Profile state
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Admin PIN state
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Save links to localStorage
  const saveLinks = useCallback((newLinks: LinkItem[]) => {
    setLinks(newLinks);
    try {
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(newLinks));
    } catch {
      // ignore
    }
  }, []);

  // Save profile to localStorage
  const saveProfile = useCallback((newProfile: ProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Admin authentication handlers
  const authenticatePin = useCallback((enteredPin: string): boolean => {
    if (enteredPin === adminPin || enteredPin === DEFAULT_PIN) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, [adminPin]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // ignore
    }
  }, []);

  const changePin = useCallback((newPin: string) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
    } catch {
      // ignore
    }
  }, []);

  const addLink = useCallback((newLinkData: Omit<LinkItem, 'id' | 'order' | 'clicks' | 'createdAt'>) => {
    const newLink: LinkItem = {
      ...newLinkData,
      id: `link-${Date.now()}`,
      order: links.length,
      clicks: 0,
      createdAt: Date.now(),
    };
    const updated = [...links, newLink];
    saveLinks(updated);
  }, [links, saveLinks]);

  const updateLink = useCallback((updatedLink: LinkItem) => {
    const updated = links.map(item => (item.id === updatedLink.id ? updatedLink : item));
    saveLinks(updated);
  }, [links, saveLinks]);

  const deleteLink = useCallback((id: string) => {
    const filtered = links.filter(item => item.id !== id);
    const reordered = filtered.map((item, index) => ({ ...item, order: index }));
    saveLinks(reordered);
  }, [links, saveLinks]);

  const toggleActive = useCallback((id: string) => {
    const updated = links.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveLinks(updated);
  }, [links, saveLinks]);

  const moveLink = useCallback((index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    const reordered = newLinks.map((item, idx) => ({ ...item, order: idx }));
    saveLinks(reordered);
  }, [links, saveLinks]);

  const recordClick = useCallback((id: string) => {
    setLinks(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      );
      try {
        localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    saveLinks(DEFAULT_LINKS);
    saveProfile(DEFAULT_PROFILE);
  }, [saveLinks, saveProfile]);

  const exportBackup = useCallback(() => {
    const data = {
      profile,
      links,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutri-andre-s-links-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profile, links]);

  const importBackup = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.links)) {
        saveLinks(data.links);
      }
      if (data.profile && typeof data.profile.name === 'string') {
        saveProfile(data.profile);
      }
      return true;
    } catch {
      return false;
    }
  }, [saveLinks, saveProfile]);

  // Generates TypeScript code to easily update defaultData.ts for production
  const generateCodeExport = useCallback(() => {
    return `import { LinkItem, ProfileData } from '../types';

export const DEFAULT_PROFILE: ProfileData = ${JSON.stringify(profile, null, 2)};

export const DEFAULT_LINKS: LinkItem[] = ${JSON.stringify(links, null, 2)};
`;
  }, [profile, links]);

  return {
    theme,
    toggleTheme,
    profile,
    saveProfile,
    links,
    addLink,
    updateLink,
    deleteLink,
    toggleActive,
    moveLink,
    recordClick,
    resetToDefaults,
    exportBackup,
    importBackup,
    generateCodeExport,
    isAdminAuthenticated,
    adminPin,
    authenticatePin,
    logoutAdmin,
    changePin,
  };
}
