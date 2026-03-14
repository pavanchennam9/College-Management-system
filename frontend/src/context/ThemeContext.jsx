import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();

// available theme names (used by switcher UI)
export const THEMES = [
  'light',
  'dark',
  'glass',
  'neon',
  'gold',
  'synth',
  'forest',
  'ocean',
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('edu-theme');
    if (stored) return stored;
    // default to system preference if available
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edu-theme', theme);
  }, [theme]);

  // respond to changes in OS color scheme when user hasn't explicitly chosen a theme
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (!localStorage.getItem('edu-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
