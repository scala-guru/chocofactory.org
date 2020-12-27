import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink target="_blank" href="https://bscscan.com/address/0x93dCEb9262d80821d6b124D57F5353cB44eAb459">
        KitKatMaster Contract
      </StyledLink>
      <StyledLink target="_blank" href="https://medium.com/chocofactoryswap">
        Blog
      </StyledLink>
      <StyledLink target="_blank" href="https://t.me/chocofactoryswap">
        Telegram
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/chocofactoryswap">
        Github
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/SoftdrinkSwap">
        Twitter
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.text2};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: ${(props) => props.theme.text1}; 
  }
`

export default Nav
