import React from 'react';
import styled from 'styled-components';
import EntryList from './EntryList';
import MyEditor from './MyEditor';

const StyledApp = styled.div`
  display: flex;
`;

export default function App() {
  return (
    <StyledApp>
      <EntryList />
      <MyEditor />
    </StyledApp>
  );
}
