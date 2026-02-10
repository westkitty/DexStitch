import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './ThemeToggle.css';
export function ThemeToggle() {
    const [theme, setTheme] = React.useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'dark';
    });
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };
    return (_jsx("button", { className: "theme-toggle", onClick: toggleTheme, "aria-label": "Toggle theme", title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`, children: theme === 'dark' ? '☀️' : '🌙' }));
}
