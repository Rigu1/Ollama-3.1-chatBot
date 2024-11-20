import React from 'react';
import Chat from './components/chat';
import styled from 'styled-components';

const AppStyle = styled.div`
  display: flex;
  justify-content: center;
`;

const App: React.FC = () => {
  return (
    <AppStyle>
      <Chat />
    </AppStyle>
  );
};

export default App;
