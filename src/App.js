import React from 'react';
import styled from 'styled-components';
import EntryList from './EntryList';
import MyEditor from './MyEditor';

const StyledApp = styled.div`
  display: flex;
`;

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    text: '#ccc',
    mutedText: '#696868',
    bg: '#181818',
  },
};

export default function App() {
  /* The ThemeContext defaultValue argument is only used when a component does not have
  a matching Provider above it in the tree. */
  const ThemeContext = React.createContext(themes.dark);

  return (
    <ThemeContext.Provider theme={themes.dark}>
      <StyledApp>
        <EntryList />
        <MyEditor />
      </StyledApp>
    </ThemeContext.Provider>
  );
}
