import React from 'react';

import '@fontsource/roboto-mono';
import '@fontsource/open-sans';

const common = {
  accent: '#00b1f3',
  defaultFont: "12px 'open sans', sans-serif",
  editorFont: "1.4em/2em 'roboto mono', monospace",
};

export const themes = {
  dark: {
    text: '#ccc',
    mutedText: '#707070',
    bg: '#1B1B1B',
    bgAccent: '#151515',
    border: '#1F1F1F',
    common,
  },
  light: {
    text: '#222',
    mutedText: '#B5B5B5',
    bg: '#F7F7F7',
    bgAccent: '#FCFCFC',
    border: '#F0F0F0',
    common,
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);

export default ThemeContext;
