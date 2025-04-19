// components/ThemeSelector.tsx
import React, { useEffect, useState } from 'react';

interface ThemeSelectorProps {
  customThemes?: { [key: string]: string };
}

function ThemeSelector({ customThemes = {} }: ThemeSelectorProps) {
  const defaultThemes = {
    'default': 'Maleghast',
    'carcass': 'CARCASS',
    'goregrinders': 'Goregrinders',
    'gargamox': 'Gargamox',
    'deadsouls': 'Deadsouls',
    'abhorrers': 'Abhorrers',
    'igorri': 'Igorri',
  };

  // Combine default and custom themes
  const themes = { ...defaultThemes, ...customThemes };
  
  // Get saved theme from localStorage or use default
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });

  // Update the document's data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Handle theme change
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(event.target.value);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={handleThemeChange}
      >
        {Object.entries(themes).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSelector;