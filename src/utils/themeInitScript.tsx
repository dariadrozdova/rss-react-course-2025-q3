import React from 'react';

const ThemeInitScript: React.FC = () => {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        const validTheme = (theme === 'dark' || theme === 'light') ? theme : 'light';
        document.documentElement.className = validTheme;
        document.documentElement.dataset.theme = validTheme;
      } catch (e) {
        document.documentElement.className = 'light';
        document.documentElement.dataset.theme = 'light';
      }
    })()
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />
  );
};

export default ThemeInitScript;
