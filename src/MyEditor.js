import React, { useState, useCallback, useContext } from 'react';

// Import the Slate editor factory.
// and the Slate components and React plugin.
import { createEditor, Range, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import styled from 'styled-components';
import { ThemeContext } from './theme-context';

import { getSentenceForCaret } from './utils';

const { ipcRenderer } = window.require('electron');

const StyledSlate = styled.div`
  background: ${({ theme }) => theme.bg};
  font-size: 20px;
  font-family: 'Courier New';
  caret-color: #00b1f3;
  width: 100%;
`;

const StyledLeaf = styled.span`
  color: ${({ currentSentence, theme }) => (currentSentence ? theme.text : theme.mutedText)};
`;

const Leaf = ({ attributes, children, leaf }) => {
  const theme = useContext(ThemeContext);
  const { 'data-slate-leaf': dataSlateLeaf } = attributes;
  const { currentSentence } = leaf;
  return (
    <StyledLeaf
      data-slate-leaf={dataSlateLeaf}
      currentSentence={currentSentence}
      theme={theme}
    >
      {children}
    </StyledLeaf>
  );
};

const MyEditor = () => {
  const d = new Date();
  const defaultDate = d.toISOString().substring(0, 10);
  const entry = ipcRenderer.sendSync('get-entry', defaultDate);
  let defaultContent;
  if (entry) {
    defaultContent = JSON.parse(entry.content);
  }
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState(defaultContent
    || [{ type: 'paragraph', children: [{ text: '' }] }]);

  // Define a leaf rendering function that is memoized with `useCallback`.
  // eslint-disable-next-line react/jsx-props-no-spreading
  const renderLeaf = useCallback((props) => <Leaf {...props} />,
    []);

  const theme = useContext(ThemeContext);

  const onChange = (newValue) => {
    setValue(newValue);
    const content = JSON.stringify(newValue);
    const date = new Date();
    const dFormatted = date.toISOString().substring(0, 10);
    if (ipcRenderer.sendSync('get-entry', dFormatted) !== undefined) {
      ipcRenderer.sendSync('update-entry', dFormatted, content);
    } else {
      ipcRenderer.sendSync('add-entry', dFormatted, content);
    }
  };

  const decorate = useCallback(
    ([node, path]) => {
      if (Text.isText(node)) {
        const range = editor.selection;
        if (range !== null && Range.isCollapsed(range)) {
          const { path: selectPath, offset } = Range.start(range);
          if (path[0] !== selectPath[0]) {
            return [];
          }
          const { start, end } = getSentenceForCaret(node.text, offset);
          if (start !== 0 || end !== 0) {
            const currentSentence = {
              currentSentence: true,
              anchor: { path, offset: start },
              focus: { path, offset: end },
            };
            return [currentSentence];
          }
        }
      }
      return [];
    },
    [editor.selection],
  );

  return (
    <StyledSlate theme={theme}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => onChange(newValue)}
      >
        <Editable decorate={decorate} renderLeaf={renderLeaf} />
      </Slate>
    </StyledSlate>
  );
};

export default MyEditor;
