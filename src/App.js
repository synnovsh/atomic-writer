import React, { useState } from 'react';
import styled from 'styled-components';
import EntryList from './EntryList';
import MyEditor from './MyEditor';
import { ThemeContext, themes } from './theme-context';

const StyledApp = styled.div`
  display: flex;
`;

export default function App() {
  /* The ThemeContext defaultValue argument is only used when a component does not have
  a matching Provider above it in the tree. */

  const [theme, setTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <button type="button" onClick={toggleTheme}>Toggle theme</button>
      <StyledApp>
        <EntryList />
        <MyEditor />
      </StyledApp>
    </ThemeContext.Provider>
  );
}
