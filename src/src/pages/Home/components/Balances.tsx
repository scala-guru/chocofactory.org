import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'

import logo from '../../../assets/images/logo.png'
import ferrerologo from '../../../assets/images/ferrerologo.png'

import { useActiveWeb3React } from '../../../hooks'
//import Label from '../../../components/Label'
//import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useFerreroEarnings from '../../../hooks/useFerreroEarnings'
import useKitKatPrice from '../../../hooks/useKitKatPrice'
import useFerreroPrice from '../../../hooks/useFerreroPrice'
import useSushi from '../../../hooks/useSushi'
import { getSushiAddress, getSushiSupply, getFerreroSupply, getFerreroAddress, getKitKatPrice, getFerreroPrice } from '../../../sushi/utils'
import { getBalanceNumber, currencyFormat } from '../../../utils/formatBalance'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()

  let sumEarning = 0
  for (const earning of allEarnings) {
    sumEarning += new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }
  
  let KitKatPrice = useKitKatPrice()
  let KitKatPendingInUSD = sumEarning*KitKatPrice

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block'
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 4}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
	 {KitKatPendingInUSD ? ` ($${currencyFormat(KitKatPendingInUSD, 2)})` : ''}
    </span>
  )
}

const PendingFerrero: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)
  
  let sumEarning = useFerreroEarnings(0).div(new BigNumber(10).pow(18)).toNumber()
  
  let ferreroPrice = useFerreroPrice()
  let ferreroPendingInUSD = sumEarning*ferreroPrice
  
  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block'
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 4}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
	{ferreroPendingInUSD ? ` ($${currencyFormat(ferreroPendingInUSD, 2)})` : ''}
    </span>
  )
  
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [ferreroTotalSupply, setFerreroTotalSupply] = useState<BigNumber>()
  const [KitKatSupplyInUSD, setKitKatSupplyInUSD] = useState<number>()
  const [ferreroSupplyInUSD, setFerreroSupplyInUSD] = useState<number>()
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))
  const ferreroBalance = useTokenBalance(getFerreroAddress(sushi))
  const { account } = useActiveWeb3React()
  
  let KitKatPrice = useKitKatPrice()
  let KitKatBalanceInUSD = getBalanceNumber(sushiBalance)*KitKatPrice
  
  
  let ferreroPrice = useFerreroPrice()
  let ferreroBalanceInUSD = getBalanceNumber(ferreroBalance)*ferreroPrice
  
  const startTime = 1602939600 //17-10 20.00
  const ferreroOpen = startTime * 1000 - Date.now() <= 0
  

  useEffect(() => {
    async function fetchTotalSupply() {
		
      const supply = await getSushiSupply(sushi)
	  const ferreroSupply = await getFerreroSupply(sushi)
	  
	  
	  const KitKatPrice = await getKitKatPrice(sushi)
	  const FerreroPrice = await getFerreroPrice(sushi)
	  
	  const KitKatSupplyInUSD = await getBalanceNumber(supply)*KitKatPrice
	  const ferreroSupplyInUSD = await getBalanceNumber(ferreroSupply)*FerreroPrice
	  
      setTotalSupply(supply)
	  setFerreroTotalSupply(ferreroSupply);
	  setKitKatSupplyInUSD(KitKatSupplyInUSD)
	  setFerreroSupplyInUSD(ferreroSupplyInUSD)
    }
    if (sushi) {
      fetchTotalSupply()
    }
  }, [sushi, setTotalSupply, setFerreroTotalSupply, setKitKatSupplyInUSD, setFerreroSupplyInUSD])

  return (
    <StyledWrapper>
	    <StyledGroovernaceInfo>
			<StyledHeaderInfo>
			    <HeaderFont>Token</HeaderFont>
				<HeaderLabel>Stake your ChocolateLP tokens to earn KITKAT</HeaderLabel>
				<PriceBox>
					<HeaderPrice>KITKAT Price: {KitKatPrice ? `$${currencyFormat(KitKatPrice, 3)}` : 'Loading'}</HeaderPrice>
					{ferreroOpen ? <HeaderPrice>FERRERO Price: {ferreroPrice ? `$${currencyFormat(ferreroPrice, 3)}` : 'Loading'}</HeaderPrice>: ''}
				</PriceBox>
			</StyledHeaderInfo>
	    </StyledGroovernaceInfo>
		
	    <StyledGroovernaceToken>		  
		  <StyledCard>
			<StyledCardContent>
			  <StyledColumn>
			    <StyledHeader>
				  Your KITKAT Balance
				</StyledHeader>
				<StyledInsideCard>
				  <img src={logo} alt="KITKAT" />
				  <StyledBalances>
					<Value value={!!account ? getBalanceNumber(sushiBalance) : 'Locked'} />
					{!!account ? `$${currencyFormat(KitKatBalanceInUSD, 2)}` : ''}
				  </StyledBalances>
				</StyledInsideCard>
			  </StyledColumn>
			</StyledCardContent>
			<Footnote>
			  Unclaimed KITKAT
			  <FootnoteValue>
				<PendingRewards />
			  </FootnoteValue>
			</Footnote>
		  </StyledCard>
		  
		  <StyledCard>
			<StyledCardContent>
			   <StyledHeader>
			     Total KITKAT Supply
			   </StyledHeader>
			   <StyledInsideCard>
			     <StyledTotals>	
			       <Value value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'} />
				  {KitKatSupplyInUSD ? `$${currencyFormat(KitKatSupplyInUSD, 0)}` : ''}
				 </StyledTotals>
			   </StyledInsideCard>			   
			</StyledCardContent>
			<Footnote>
			  New rewards per block:
			  <FootnoteValue>0.14 KITKAT</FootnoteValue>
			</Footnote>
		  </StyledCard>
		  
		  <StyledCard>
			<StyledCardContent>
			  <StyledColumn>
			    <StyledHeader>
				  Your FERRERO Balance
				</StyledHeader>
				<StyledInsideCard>
				  <img src={ferrerologo} alt="FERRERO" />
				  <StyledBalances>
					<Value value={!!account ? getBalanceNumber(ferreroBalance) : 'Locked'} />
					{!!account ? `$${currencyFormat(ferreroBalanceInUSD, 2)}` : ''}
				  </StyledBalances>
				</StyledInsideCard>
			  </StyledColumn>
			</StyledCardContent>
			<Footnote>
			  Unclaimed FERRERO
			  <FootnoteValue>
				<PendingFerrero />
			  </FootnoteValue>
			</Footnote>
		  </StyledCard>
		  
		  <StyledCard>
			<StyledCardContent>
			   <StyledHeader>
			     Total FERRERO Supply
			   </StyledHeader>
			   <StyledInsideCard>
			     <StyledTotals>	
			       <Value value={ferreroTotalSupply ? getBalanceNumber(ferreroTotalSupply) : 'Locked'} />
				   {ferreroSupplyInUSD ? `$${currencyFormat(ferreroSupplyInUSD, 0)}` : ''}
				 </StyledTotals>
			   </StyledInsideCard>			   
			</StyledCardContent>
			<Footnote>
			  New rewards per block:
			  <FootnoteValue>0.0026 FERRERO</FootnoteValue>
			</Footnote>
		  </StyledCard>
		</StyledGroovernaceToken>	
    </StyledWrapper>
  )
}

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${props => props.theme.spacing[3]}px;
`

const StyledCard = styled.div`
  background: ${props => props.theme.bg1};
  box-shadow: rgba(0, 0, 1, 0.15) 0px 2px 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 2px solid;
  border-color: ${props => props.theme.primary3};
  margin-top: 12px;
  margin-right: 15px;
  @media (max-width: 768px) {
	  margin-right: 0px;
  }
`

const StyledInsideCard = styled.div`
  background: ${props => props.theme.bg2};
  padding: ${props => props.theme.spacing[3]}px;
  display: flex;
  img {
    width: 4rem;
    height: 4rem;
	margin-right: 15px;
  }
  @media (max-width: 821px) {
	  padding: ${props => props.theme.spacing[1]}px;
	  background: ${props => props.theme.bg1};
  }
`

const StyledHeader = styled.div`
  color: ${props => props.theme.text1};
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
`

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${props => props.theme.text1};
  border-top: solid 1px ${props => props.theme.primary4};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;

  @media (min-width: 768px) {
    min-width: 20rem;
  }
`
const FootnoteValue = styled.div``

const StyledWrapper = styled.div`
  padding: 0px 30px;
  align-items: center;
  display: flex;
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

const StyledHeaderInfo = styled.div`
  margin-top: 30px;
  width: 70%;  
  @media (max-width: 1170px) {
	  margin-top: 0px;
	  width: 100%;
  }
`

const HeaderFont = styled.div`
  font-size: 35px;
  font-weight: 500;
`

const HeaderLabel = styled.div`
  font-size: 19px;
  margin-top: 15px;
`

const PriceBox = styled.div`
  margin-top: 20px;
`

const HeaderPrice = styled.div`
  font-size: 19px;
  margin-top: 10px;
  font-weight: 500;
`

const StyledGroovernaceInfo = styled.div`
  align-items: center;
  width: 25%;
  @media (max-width: 1170px) {
	  margin-bottom: 20px;
	  text-align: center;
	  width: 100%;
  }
  @media (min-width: 1171px) {
	  height: 410px;
  }
`

const StyledGroovernaceToken = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: wrap;  
  @media (max-width: 821px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
  @media (min-width: 1060px) {
    width: 80%;
  }
`

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledBalances = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledTotals = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  width: 100%;
`

/*const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;

  img {
    width: 4rem;
    height: 4rem;
  }
`*/

export default Balances
