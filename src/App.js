import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { createEditor, Transforms, Editor } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';

import Nav, { StyledButton } from './components/Nav';
import MyEditor from './components/MyEditor';
import { ThemeContext, themes } from './utils/theme-context';

const { ipcRenderer } = window.require('electron');

const StyledApp = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font: ${({ theme }) => theme.common.defaultFont};
  transition: background-color ${({ theme }) => theme.common.transition};
`;

const EditorWrapper = styled.div`
  margin-left: ${({ navOpen }) => (navOpen ? '320px' : '0px')};
  transition: margin-left ${({ theme }) => theme.common.transition};
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

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  // Slate editor object that won't change across renders.
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
  }, []);

  const onChangeDate = (changedDate) => {
    setSelectedDate(changedDate);
    const res = ipcRenderer.sendSync('get-entry', changedDate);
    setContent(JSON.parse(res.content));

    // https://github.com/ianstormtaylor/slate/issues/3813#issuecomment-668464683
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, Editor.end(editor, []));
    }, 0);

    editor.history = {
      redos: [],
      undos: [],
    };
  };

  const onContentChange = (changedContent) => {
    setContent(changedContent);
    ReactEditor.focus(editor);

    const contentString = JSON.stringify(changedContent);
    if (ipcRenderer.sendSync('get-entry', selectedDate) !== undefined) {
      ipcRenderer.sendSync('update-entry', selectedDate, contentString);
    } else {
      ipcRenderer.sendSync('add-entry', selectedDate, contentString);
    }
  };

  /* The ThemeContext defaultValue argument is only used when a component does not have
  a matching Provider above it in the tree. */
  const [theme, setTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  };

  const [navOpen, setNavOpen] = useState(false);

  return (
    <ThemeContext.Provider value={theme}>
      <StyledApp theme={theme}>
        <StyledButton theme={theme} type="button" onClick={() => setNavOpen(true)}><HiOutlineMenuAlt2 /></StyledButton>
        <Nav
          navOpen={navOpen}
          setNavOpen={setNavOpen}
          toggleTheme={toggleTheme}
          selectedDate={selectedDate}
          onChangeDate={onChangeDate}
        />
        <EditorWrapper theme={theme} navOpen={navOpen}>
          <MyEditor
            content={content}
            onContentChange={onContentChange}
            editor={editor}
          />
        </EditorWrapper>
      </StyledApp>
    </ThemeContext.Provider>
  );
}
