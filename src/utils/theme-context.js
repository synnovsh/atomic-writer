import React from 'react';

const common = {
  accent: '#00b1f3',
};

export const themes = {
  dark: {
    text: '#ccc',
    mutedText: '#707070',
    bg: '#1B1B1B',
    bgAccent: '#151515',
    common,
  },
  light: {
    text: '#222',
    mutedText: '#ccc',
    bg: '#F7F7F7',
    bgAccent: 'FCFCFC',
    common,
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);

export default ThemeContext;
