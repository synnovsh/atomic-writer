import React, { useState } from 'react';
import styled from 'styled-components';
import EntryList from './EntryList';
import MyEditor from './MyEditor';
import { ThemeContext, themes } from './theme-context';

const { ipcRenderer } = window.require('electron');

const StyledApp = styled.div`
  display: flex;
`;

export default function App() {
  const d = new Date();
  const defaultDate = d.toISOString().substring(0, 10);
  const entry = ipcRenderer.sendSync('get-entry', defaultDate);
  let defaultContent;
  if (entry) {
    defaultContent = JSON.parse(entry.content);
  }

  const [content, setContent] = useState(defaultContent
    || [{ type: 'paragraph', children: [{ text: '' }] }]);

  const onContentChange = (changedContent) => {
    setContent(changedContent);
    const contentString = JSON.stringify(changedContent);
    const date = new Date();
    const dFormatted = date.toISOString().substring(0, 10);
    if (ipcRenderer.sendSync('get-entry', dFormatted) !== undefined) {
      ipcRenderer.sendSync('update-entry', dFormatted, contentString);
    } else {
      ipcRenderer.sendSync('add-entry', dFormatted, contentString);
    }
  };

  // Create a
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
        <MyEditor content={content} onContentChange={onContentChange} />
      </StyledApp>
    </ThemeContext.Provider>
  );
}
