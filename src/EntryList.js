import React from 'react';
import { Node } from 'slate';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

const StyledEntryItem = styled.li`
display: flex;
`;

const StyledList = styled.ol`
color: #ccc;
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
  return (
    <StyledList>
      {items}
    </StyledList>
  );
};

export default EntryList;
