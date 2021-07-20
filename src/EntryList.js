import React, { useContext } from 'react';
import { Node } from 'slate';
import styled from 'styled-components';
import { ThemeContext } from './theme-context';

const { ipcRenderer } = window.require('electron');

const StyledEntryItem = styled.li`
border-left: ${({ selected, theme }) => (selected ? `2px solid ${theme.common.accent}` : '')};
`;

const StyledList = styled.ol`
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg};
`;

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');
const maxLength = 50;

const EntryItem = ({ entry, selected, onChangeDate }) => {
  const { date, content } = entry;
  const theme = useContext(ThemeContext);
  let serializedContent = serialize(JSON.parse(content));
  if (serializedContent.length > maxLength) {
    serializedContent = `${serializedContent.substring(0, maxLength)}...`;
  }
  return (
    <StyledEntryItem theme={theme} selected={selected} onClick={() => onChangeDate(date)}>
      <div>{date}</div>
      <div>{serializedContent}</div>
    </StyledEntryItem>
  );
};

const EntryList = ({ selectedDate, onChangeDate }) => {
  const allEntries = ipcRenderer.sendSync('get-all');
  const items = allEntries.map((entry) => (
    <EntryItem
      key={entry.date}
      entry={entry}
      selected={entry.date === selectedDate}
      onChangeDate={onChangeDate}
    />
  ));
  const theme = useContext(ThemeContext);
  return (
    <StyledList selectedDate={selectedDate} theme={theme}>
      {items}
    </StyledList>
  );
};

export default EntryList;
