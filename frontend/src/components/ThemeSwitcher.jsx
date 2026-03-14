import React from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

// simple dots-based theme picker; accepts optional className for layout
export default function ThemeSwitcher({ className }) {
    const { theme, setTheme, themes } = useTheme();

    const handleClick = (t) => {
        setTheme(t);
        toast.dismiss(); // avoid stacking
        toast.success(`Theme switched to ${t}`, { duration: 1500 });
    };

    return (
        <div className={className} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {themes.map(t => (
                <div
                    key={t}
                    className={`theme-dot t-${t} ${theme === t ? 'active' : ''}`}
                    onClick={() => handleClick(t)}
                />
            ))}
        </div>
    );
}
