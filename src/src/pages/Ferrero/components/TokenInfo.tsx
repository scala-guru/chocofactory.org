import React from 'react'
import styled from 'styled-components'
import Container from '../../../components/Container'
//import useLiquidityCheck from '../../../hooks/useStakeLiquidityCheck'
import useFerreroApy from '../../../hooks/useFerreroApy'
import useKitKatStakeInFerrero from '../../../hooks/useKitKatStakeInFerrero'
import { currencyFormat } from '../../../utils/formatBalance'
//import Value from '../../../components/Value'

//import Spacer from '../../../components/Spacer'

const Balances: React.FC = () => {
	
	//let totalLiquidity = useLiquidityCheck()
	let apy = useFerreroApy()
	let totalKitKat = useKitKatStakeInFerrero()
	
  return (
	<Container size="md">
		<StyledWrapper>
			<StyledInfo>
				<BoxInfo>
					<StyledSubtitle>Est. APY</StyledSubtitle>
					<TitleString>
						{apy ? `${currencyFormat(apy, 2)}%` : 'Loading'}
					</TitleString>
				</BoxInfo>
				<BoxInfo>
					<StyledSubtitle>Total KITKAT Staked</StyledSubtitle>
					<TitleString>{totalKitKat ? `${currencyFormat(totalKitKat, 2)} KITKAT` : 'Loading'}</TitleString>
				</BoxInfo>
				<BoxInfo>
					<StyledSubtitle>Daily FERRERO Pool Rewards</StyledSubtitle>
					<TitleString>74.88 FERRERO</TitleString>
				</BoxInfo>
			</StyledInfo>
		</StyledWrapper>
	</Container>
  )
}

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }  
`

const StyledSubtitle = styled.h3`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 10px;
`

const TitleString = styled.strong`
  color: ${({ theme }) => theme.text1};
  text-align: center;
  font-size: 25px; 
`

const BoxInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 33.333%;
  @media (max-width: 768px) {
	  width: 100%;
	  margin-bottom: 20px;
  }
`

export default Balances
