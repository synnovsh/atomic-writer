import React from 'react';

export const themes = {
  light: {
    text: '#ccc',
    mutedText: '#696868',
    bg: '#181818',
  },
  dark: {
    text: '#ccc',
    mutedText: '#696868',
    bg: '#181818',
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);

export default ThemeContext;
