import React, { useContext } from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { ThemeContext, themes } from '../utils/theme-context';
import EntryList from './EntryList';

const StyledNavContainer = styled.div` 
  position: fixed;
  z-index: 1;
  height: 100%;
  width: 320px;
  ${({ navOpen }) => (!navOpen && 'transform: translateX(-320px)')};
  overflow-x: hidden; /* prevent width 0 from containing overflow */
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  background: ${({ theme }) => theme.bgAccent};
`;

export const StyledButton = styled.button` 
    background-color: transparent;
    border: none; 
    color: ${({ theme }) => theme.text};
    padding: 12px 16px;
    font-size: 16px; 
    cursor: pointer; 
`;

const Nav = ({
  navOpen, setNavOpen, toggleTheme, selectedDate, onChangeDate,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <StyledNavContainer theme={theme} navOpen={navOpen}>
      <nav>
        <StyledButton theme={theme} onClick={() => setNavOpen(false)}>
          <HiOutlineChevronLeft />
        </StyledButton>
        <StyledButton
          theme={theme}
          type="button"
          onClick={toggleTheme}
        >
          {theme === themes.dark ? <FiSun /> : <FiMoon /> }
        </StyledButton>
      </nav>
      <EntryList selectedDate={selectedDate} onChangeDate={onChangeDate} />
    </StyledNavContainer>
  );
};

export default Nav;
