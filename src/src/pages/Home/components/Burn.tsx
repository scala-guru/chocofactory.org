import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSushi from '../../../hooks/useSushi'
import { getKitKatBurn, getFerreroBurn, getKitKatPrice, getFerreroPrice} from '../../../sushi/utils'
import { getBalanceNumber, currencyFormat } from '../../../utils/formatBalance'

const Balances: React.FC = () => {	

  const [totalKitKatBurn, setTotalKitKatBurn] = useState<BigNumber>()
  const [totalFerreroBurn, setTotalFerreroBurn] = useState<BigNumber>()
  const [KitKatBurnInUSD, setKitKatBurnInUSD] = useState<number>()
  const [ferreroBurnInUSD, setFerreroBurnInUSD] = useState<number>()
  const sushi = useSushi()

  useEffect(() => {
    async function fetchTotalSupply() {
		//return;//DBG
      const KitKatBurn = await getKitKatBurn(sushi)
	  const ferreroBurn = await getFerreroBurn(sushi)
	  
	  const KitKatPrice = await getKitKatPrice(sushi)
	  const FerreroPrice = await getFerreroPrice(sushi)
	  
	  const KitKatBurnInUSD = await getBalanceNumber(KitKatBurn)*KitKatPrice
	  const ferreroBurnInUSD = await getBalanceNumber(ferreroBurn)*FerreroPrice
	  
      setTotalKitKatBurn(KitKatBurn)
	  setTotalFerreroBurn(ferreroBurn);
	  setKitKatBurnInUSD(KitKatBurnInUSD)
	  setFerreroBurnInUSD(ferreroBurnInUSD)
    }
    if (sushi) {
      fetchTotalSupply()
    }
  }, [sushi, setTotalKitKatBurn, setTotalFerreroBurn, KitKatBurnInUSD, setFerreroBurnInUSD])

  return (
		<StyledWrapper>
			<StyledCard>
				<StyledName>
					🔥 Total KITKAT burned since launch
				</StyledName>
				<StyledTotalBurn>
					<BurnAmount>{totalKitKatBurn ? currencyFormat(getBalanceNumber(totalKitKatBurn), 3) : 'Locked'}</BurnAmount>
					{KitKatBurnInUSD ? `$${currencyFormat(KitKatBurnInUSD, 0)}` : ''}
				</StyledTotalBurn>
			</StyledCard>
			<StyledCard>
				<StyledName>
					🔥 Total FERRERO burned since launch
				</StyledName>
				<StyledTotalBurn>
					<BurnAmount>{totalFerreroBurn ? currencyFormat(getBalanceNumber(totalFerreroBurn), 3) : 'Locked'}</BurnAmount>
					{ferreroBurnInUSD ? `$${currencyFormat(ferreroBurnInUSD, 0)}` : ''}
				</StyledTotalBurn>
			</StyledCard>
		</StyledWrapper>
  )
}

const StyledCard = styled.div`
  background: ${props => props.theme.bg2};
  padding: 10px 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
	  background: ${props => props.theme.bg1};
  }
  @media (max-width: 821px) {
	  flex-direction: column;
  }
`

const StyledName = styled.div`
  font-size: 19px;
  font-weight: 500;
  margin-left: 8px;
  align-items: center;
  text-align: left;
  width: 50%;
  margin: auto;
  @media (max-width: 821px) {
	  width: 100%;
	  text-align: center;
  }
`

const StyledTotalBurn = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.red1};
  text-align: right;
  width: 50%;
  @media (max-width: 821px) {
	  width: 100%;
	  text-align: center;
	  padding-top: 15px;
  }
`

const BurnAmount = styled.div`
  color: ${props => props.theme.text1};
  font-size: 25px;
  font-weight: 600;
`

const StyledWrapper = styled.div`
  background: ${props => props.theme.bg1};
  padding: 20px 30px;
  align-items: center;
  display: column;
  width: 100%;
  @media (max-width: 768px) {
	padding: 0px;
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
  @media (max-width: 1170px) {
    flex-flow: column nowrap;
  }
`

export default Balances
