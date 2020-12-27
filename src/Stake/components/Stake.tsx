import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import ferrero from '../../../assets/svg/BFX.svg'

import Button from '../../../components/FarmButton'
import Card from './Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useFerrero from '../../../hooks/useFerrero'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getSushiAddress } from '../../../sushi/utils'
import DepositModal from './DepositModal'

const Stake: React.FC = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const KitKat = useSushi()
  const KitKatAddress = getSushiAddress(KitKat)

  const { ferreroBalance, handleEnterFerrero, handleApproveFerrero, allowance } = useFerrero()
  const KitKatBalance = useTokenBalance(KitKatAddress)

  const [onPresentDeposit] = useModal(
    <DepositModal max={KitKatBalance} onConfirm={handleEnterFerrero} tokenName="KITKAT" />
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await handleApproveFerrero()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {}
  }, [handleApproveFerrero, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <StyledIcon src={ferrero} alt="farm icon" />
            </CardIcon>
            <Value value={getBalanceNumber(ferreroBalance)} />
            <Label text="FERRERO Balance" />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={'Approve KITKAT'}
              />
            ) : (
              <>
                <Button
                  disabled={KitKatBalance.eq(new BigNumber(0))}
                  text={'Convert to FERRERO'}
                  onClick={onPresentDeposit}
                />
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const StyledIcon = styled.img`
  height: 3rem;
  width: 2rem;
`

export default Stake
