import React from 'react'
import styled, { css } from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode
  isFerrero?: boolean
}

const CardIcon: React.FC<CardIconProps> = ({ children, isFerrero }) => (
  //@ts-ignore
  <StyledCardIcon isFerrero={isFerrero}>{children}</StyledCardIcon>
)

const StyledCardIcon = styled.div`
  background-color: ${props => props.theme.bg6};
  font-size: 36px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: ${props => props.theme.secondary4} 0px 1px 5px;

  margin: 0 auto ${props => props.theme.spacing[3]}px;

  ${props =>
    //@ts-ignore
    (props.isFerrero as any) &&
    css`
      img {
        width: 32px;
        height: 32px;
      }
    `}
`

export default CardIcon
