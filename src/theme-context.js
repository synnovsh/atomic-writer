import React from 'react';

export const themes = {
  dark: {
    text: '#ccc',
    mutedText: '#696868',
    bg: '#181818',
  },
  light: {
    text: '#222',
    mutedText: '#ccc',
    bg: '#fafafa',
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);

export default ThemeContext;
