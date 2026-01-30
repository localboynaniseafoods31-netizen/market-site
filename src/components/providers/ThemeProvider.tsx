'use client';

import { useEffect, useState, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Load saved theme preference
        const savedTheme = localStorage.getItem('oceanfresh_theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const updateTheme = () => {
            let resolved: 'light' | 'dark';

            if (theme === 'system') {
                resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                resolved = theme;
            }

            setResolvedTheme(resolved);
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(resolved);
        };

        updateTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, mounted]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('oceanfresh_theme', newTheme);
    };

    // Prevent flash of incorrect theme, but ALWAYS provide context
    // We use a small hack to hide content until mounted if needed, or just accept the flash
    // For now, removing the early return to fix the "useTheme must be used within a ThemeProvider" error
    // if (!mounted) {
    //     return <>{children}</>;
    // }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
