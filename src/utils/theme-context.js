import React from 'react';

const common = {
  accent: '#00b1f3',
};

export const themes = {
  dark: {
    text: '#ccc',
    mutedText: '#696868',
    bg: '#181818',
    common,
  },
  light: {
    text: '#222',
    mutedText: '#ccc',
    bg: '#fafafa',
    common,
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);

export default ThemeContext;
