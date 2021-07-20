import React, { useContext } from 'react';
import { Node } from 'slate';
import styled from 'styled-components';
import { ThemeContext } from './theme-context';

const { ipcRenderer } = window.require('electron');

const StyledEntryItem = styled.li`
`;

const StyledList = styled.ol`
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg};
`;

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');
const maxLength = 50;

const EntryItem = ({ entry }) => {
  const { date, content } = entry;
  let serializedContent = serialize(JSON.parse(content));
  if (serializedContent.length > maxLength) {
    serializedContent = `${serializedContent.substring(0, maxLength)}...`;
  }
  return (
    <StyledEntryItem>
      <div>{date}</div>
      <div>{serializedContent}</div>
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
