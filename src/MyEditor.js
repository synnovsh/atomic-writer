import React, { useState, useCallback } from 'react';

// Import the Slate editor factory.
// and the Slate components and React plugin.
import { createEditor, Range, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import styled from 'styled-components';

import { getSentenceForCaret } from './utils';

const StyledSlate = styled.div`
  background: #181818;
  height: 100vh;
  width: 100vw;
  font-size: 20px;
  font-family: 'Courier New';
  caret-color: #00b1f3;
`;

const Leaf = ({ attributes, children, leaf }) => {
  const { 'data-slate-leaf': dataSlateLeaf } = attributes;
  const { currentSentence } = leaf;
  return (
    <span
      data-slate-leaf={dataSlateLeaf}
      style={{ color: currentSentence ? '#ccc' : '#696868' }}
    >
      {children}
    </span>
  );
};

const MyEditor = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('content')) || [
      { type: 'paragraph', children: [{ text: '' }] },
    ],
  );

  // Define a leaf rendering function that is memoized with `useCallback`.
  // eslint-disable-next-line react/jsx-props-no-spreading
  const renderLeaf = useCallback((props) => <Leaf {...props} />,
    []);

  const onChange = (newValue) => {
    setValue(newValue);
    const content = JSON.stringify(newValue);
    localStorage.setItem('content', content);
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
    <StyledSlate>
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
