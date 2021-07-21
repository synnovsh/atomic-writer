import React, { useContext } from 'react';
import { Node } from 'slate';
import styled from 'styled-components';
import { ThemeContext } from '../utils/theme-context';

const { ipcRenderer } = window.require('electron');

const StyledEntryItem = styled.li`
  border-left: ${({ selected, theme }) => (selected ? `2px solid ${theme.common.accent}` : '')};
  margin-left: ${({ selected }) => (!selected && '2px')};
  .blurb {
    color: ${({ theme }) => theme.mutedText};
  }

  .date {
    color: ${({ theme }) => theme.text};
  }
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const StyledList = styled.ol`
`;

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');
const maxLength = 50;

const EntryItem = ({ entry, selected, onChangeDate }) => {
  const { date, content } = entry;
  const theme = useContext(ThemeContext);
  let listBlurb = serialize(JSON.parse(content));
  if (listBlurb.length > maxLength) {
    listBlurb = `${listBlurb.substring(0, maxLength)}...`;
  } else if (listBlurb.length === 0) {
    listBlurb = 'Empty Document';
  }
  return (
    <StyledEntryItem theme={theme} selected={selected} onClick={() => onChangeDate(date)}>
      <div className="date">{date}</div>
      <div className="blurb">{listBlurb}</div>
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