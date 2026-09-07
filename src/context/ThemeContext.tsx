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

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ekhanei-classic',
    name: 'Ekhanei Classic (Original Logo)',
    nameBn: 'এখানেই ক্লাসিক (অরিজিনাল লোগো)',
    description: 'এখানেই শ্যামনগর এর সিগনেচার অরেঞ্জ ও এমারেল্ড গ্রিন শেড',
    primary: '#F56E09',
    secondary: '#00A651',
    gradient: 'linear-gradient(135deg, #F56E09 0%, #00A651 100%)',
    previewColors: ['#F56E09', '#00A651'],
  },
  {
    id: 'royal-ocean',
    name: 'Royal Ocean',
    nameBn: 'রয়েল ওশান',
    description: 'আভিজাত্যপূর্ণ রয়্যাল ব্লু ও ওয়ার্ম গোল্ডেন কম্বিনেশন',
    primary: '#2563EB',
    secondary: '#F59E0B',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    previewColors: ['#2563EB', '#F59E0B'],
  },
  {
    id: 'cyber-violet',
    name: 'Cyber Violet',
    nameBn: 'সাইবার ভায়োলেট',
    description: 'মডার্ন পার্পল ও নিয়ন পিংক এর প্রিমিয়াম থিম',
    primary: '#7C3AED',
    secondary: '#EC4899',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    previewColors: ['#7C3AED', '#EC4899'],
  },
  {
    id: 'eco-nature',
    name: 'Eco Nature',
    nameBn: 'ইকো নেচার',
    description: 'প্রাকৃতিক রিফ্রেশিং ফরেস্ট গ্রিন ও ব্রাইট লাইম শেড',
    primary: '#059669',
    secondary: '#84CC16',
    gradient: 'linear-gradient(135deg, #059669 0%, #84CC16 100%)',
    previewColors: ['#059669', '#84CC16'],
  },
  {
    id: 'speed-express',
    name: 'Speed Express',
    nameBn: 'স্পিড এক্সপ্রেস',
    description: 'হাইপার-ফার্স্ট ক্রিমসন রেড ও স্লিক ডার্ক স্টেট ভাইব',
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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ekhanei_user_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeId) {
        const foundTheme = THEME_PRESETS.find((t) => t.id === savedThemeId);
        if (foundTheme) {
          setCurrentTheme(foundTheme);
          document.documentElement.setAttribute('data-theme', foundTheme.id);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read saved theme from localStorage:', e);
    }
    // Default attribute
    document.documentElement.setAttribute('data-theme', THEME_PRESETS[0].id);
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
