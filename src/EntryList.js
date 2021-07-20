import React, { useContext } from 'react';
import { Node } from 'slate';
import styled from 'styled-components';
import { ThemeContext } from './theme-context';

const { ipcRenderer } = window.require('electron');

const StyledEntryItem = styled.li`
  display: flex;
`;

const StyledList = styled.ol`
  color: ${({ theme }) => theme.text};
`;

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');

const EntryItem = ({ entry }) => {
  const { date, content } = entry;
  const serializedContent = serialize(JSON.parse(content));
  return (
    <StyledEntryItem>
      <div>{serializedContent}</div>
      <div>{date}</div>
    </StyledEntryItem>
  );
};

const EntryList = () => {
  const allEntries = ipcRenderer.sendSync('get-all');
  const items = allEntries.map((entry) => <EntryItem key={entry.date} entry={entry} />);
  const theme = useContext(ThemeContext);
  return (
    <StyledList theme={theme}>
      {items}
    </StyledList>
  );
};

export default EntryList;
