import React, { useCallback, useContext } from 'react';

// Import the Slate editor factory.
// and the Slate components and React plugin.
import { Range, Text } from 'slate';
import { Slate, Editable } from 'slate-react';

import styled from 'styled-components';
import { ThemeContext } from '../utils/theme-context';

import { getSentenceForCaret } from '../utils/utils';

const StyledSlate = styled.div`
  display: grid;
  grid-template-columns:
  minmax(1.2rem, 1fr)
  minmax(auto, 57ch)
  minmax(1.2rem, 1fr);

  font-size: 20px;
  font: ${({ theme }) => theme.common.editorFont};
  caret-color: ${({ theme }) => theme.common.accent};
  width: 100%;

  #gridWrapper {
    grid-column: 2;
  }
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

const MyEditor = ({ content, onContentChange, editor }) => {
  // Define a leaf rendering function that is memoized with `useCallback`.
  // eslint-disable-next-line react/jsx-props-no-spreading
  const renderLeaf = useCallback((props) => <Leaf {...props} />,
    []);

  const theme = useContext(ThemeContext);

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
    [],
  );

  return (
    <StyledSlate theme={theme}>
      <div id="gridWrapper">
        <Slate
          editor={editor}
          value={content}
          onChange={(newContent) => onContentChange(newContent)}
        >
          <Editable decorate={decorate} renderLeaf={renderLeaf} />
        </Slate>
      </div>
    </StyledSlate>
  );
};

export default MyEditor;
