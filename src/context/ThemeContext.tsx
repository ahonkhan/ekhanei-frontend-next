'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemePreset {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  primary: string;
  secondary: string;
  gradient: string;
  previewColors: [string, string];
}

export type ThemeMode = 'light' | 'dark';
export type ThemeStyle = 'gradient' | 'solid';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'shadcn-violet',
    name: 'Shadcn Violet',
    nameBn: 'স্যাদসিএন ভায়োলেট',
    description: 'Shadcn violet based theme.',
    primary: '#7C3AED',
    secondary: '#EC4899',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    previewColors: ['#7C3AED', '#C084FC'],
  },
  {
    id: 'shadcn-rose',
    name: 'Shadcn Rose',
    nameBn: 'স্যাদসিএন রোজ',
    description: 'Shadcn rose based theme.',
    primary: '#E11D48',
    secondary: '#FB7185',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)',
    previewColors: ['#E11D48', '#FDA4AF'],
  },
  {
    id: 'shadcn-slate',
    name: 'Shadcn Slate',
    nameBn: 'স্যাদসিএন স্লেট',
    description: 'Shadcn slate based theme.',
    primary: '#475569',
    secondary: '#0F172A',
    gradient: 'linear-gradient(135deg, #475569 0%, #0F172A 100%)',
    previewColors: ['#475569', '#1E293B'],
  },
  {
    id: 'shadcn-stone',
    name: 'Shadcn Stone',
    nameBn: 'স্যাদসিএন স্টোন',
    description: 'Shadcn stone based theme.',
    primary: '#57534E',
    secondary: '#292524',
    gradient: 'linear-gradient(135deg, #57534E 0%, #292524 100%)',
    previewColors: ['#57534E', '#1C1917'],
  },
  {
    id: 'shadcn-yellow',
    name: 'Shadcn Yellow',
    nameBn: 'স্যাদসিএন ইয়োলো',
    description: 'Shadcn yellow based theme.',
    primary: '#EAB308',
    secondary: '#CA8A04',
    gradient: 'linear-gradient(135deg, #EAB308 0%, #FEF08A 100%)',
    previewColors: ['#EAB308', '#FEF08A'],
  },
  {
    id: 'indigo-nights',
    name: 'Indigo Nights',
    nameBn: 'ইন্ডিগো নাইটস',
    description: 'Indigo nights based theme.',
    primary: '#3730A3',
    secondary: '#6366F1',
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
    previewColors: ['#1E1B4B', '#3730A3'],
  },
  {
    id: 'ekhanei-classic',
    name: 'Ekhanei Classic',
    nameBn: 'এখানেই ক্লাসিক',
    description: 'শ্যামনগর সিগনেচার অরেঞ্জ ও গ্রিন শেড।',
    primary: '#F56E09',
    secondary: '#00A651',
    gradient: 'linear-gradient(135deg, #F56E09 0%, #00A651 100%)',
    previewColors: ['#F56E09', '#00A651'],
  },
  {
    id: 'royal-ocean',
    name: 'Royal Ocean',
    nameBn: 'রয়েল ওশান',
    description: 'আভিজাত্যপূর্ণ রয়্যাল ব্লু ও ওয়াটার ব্লক।',
    primary: '#2563EB',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    previewColors: ['#2563EB', '#06B6D4'],
  },
  {
    id: 'eco-nature',
    name: 'Eco Nature',
    nameBn: 'ইকো নেচার',
    description: 'প্রাকৃতিক রিফ্রেশিং ফরেস্ট গ্রিন শেড।',
    primary: '#059669',
    secondary: '#84CC16',
    gradient: 'linear-gradient(135deg, #059669 0%, #84CC16 100%)',
    previewColors: ['#059669', '#84CC16'],
  },
  {
    id: 'speed-express',
    name: 'Speed Express',
    nameBn: 'স্পিড এক্সপ্রেস',
    description: 'হাইপার-ফার্স্ট ক্রিমসন রেড ভাইব।',
    primary: '#E11D48',
    secondary: '#334155',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)',
    previewColors: ['#E11D48', '#334155'],
  },
];

interface ThemeContextType {
  currentTheme: ThemePreset;
  setThemeById: (themeId: string) => void;
  themes: ThemePreset[];
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  toggleThemeModal: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;
  toggleThemeStyle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ekhanei_user_theme';
const THEME_MODE_KEY = 'ekhanei_theme_mode';
const THEME_STYLE_KEY = 'ekhanei_theme_style';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>('gradient');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      // 1. Theme Preset
      const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeId) {
        const foundTheme = THEME_PRESETS.find((t) => t.id === savedThemeId);
        if (foundTheme) {
          setCurrentTheme(foundTheme);
          document.documentElement.setAttribute('data-theme', foundTheme.id);
        } else {
          document.documentElement.setAttribute('data-theme', THEME_PRESETS[0].id);
        }
      } else {
        document.documentElement.setAttribute('data-theme', THEME_PRESETS[0].id);
      }

      // 2. Theme Mode (Light / Dark)
      const savedMode = localStorage.getItem(THEME_MODE_KEY) as ThemeMode;
      if (savedMode === 'dark' || savedMode === 'light') {
        setThemeModeState(savedMode);
        document.documentElement.setAttribute('data-mode', savedMode);
        if (savedMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        setThemeModeState('light');
        document.documentElement.setAttribute('data-mode', 'light');
        document.documentElement.classList.remove('dark');
      }

      // 3. Theme Style (Gradient / Solid)
      const savedStyle = localStorage.getItem(THEME_STYLE_KEY) as ThemeStyle;
      if (savedStyle === 'solid' || savedStyle === 'gradient') {
        setThemeStyleState(savedStyle);
        document.documentElement.setAttribute('data-style', savedStyle);
      } else {
        document.documentElement.setAttribute('data-style', 'gradient');
      }
    } catch (e) {
      console.warn('Could not read theme preferences:', e);
    }
  }, []);

  const setThemeById = (themeId: string) => {
    const targetTheme = THEME_PRESETS.find((t) => t.id === themeId);
    if (!targetTheme) return;

    setCurrentTheme(targetTheme);
    document.documentElement.setAttribute('data-theme', targetTheme.id);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme.id);
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    document.documentElement.setAttribute('data-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_MODE_KEY, mode);
    } catch (e) {
      console.warn('Could not save theme mode:', e);
    }
  };

  const toggleThemeMode = () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
    document.documentElement.setAttribute('data-style', style);
    try {
      localStorage.setItem(THEME_STYLE_KEY, style);
    } catch (e) {
      console.warn('Could not save theme style:', e);
    }
  };

  const toggleThemeStyle = () => {
    const newStyle: ThemeStyle = themeStyle === 'gradient' ? 'solid' : 'gradient';
    setThemeStyle(newStyle);
  };

  const toggleThemeModal = () => {
    setIsThemeModalOpen((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: mounted ? currentTheme : THEME_PRESETS[0],
        setThemeById,
        themes: THEME_PRESETS,
        isThemeModalOpen,
        setIsThemeModalOpen,
        toggleThemeModal,
        themeMode: mounted ? themeMode : 'light',
        setThemeMode,
        toggleThemeMode,
        themeStyle: mounted ? themeStyle : 'gradient',
        setThemeStyle,
        toggleThemeStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

