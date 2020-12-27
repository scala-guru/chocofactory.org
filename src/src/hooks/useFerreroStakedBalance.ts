import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getStaked, getFerreroMasterContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useStakedFerreroBalance = (lpTokenAddress: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useActiveWeb3React()
  const sushi = useSushi()
  const masterChefContract = getFerreroMasterContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, lpTokenAddress, account)
    setBalance(new BigNumber(balance))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, lpTokenAddress, sushi])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, lpTokenAddress, setBalance, block, sushi])

  return balance
}

export default useStakedFerreroBalance
