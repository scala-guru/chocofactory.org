import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getFerreroSupply, getFerreroContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useStakedFerreroBalance = () => {
  const [supply, setSupply] = useState(new BigNumber(0))
  const { account } = useActiveWeb3React()
  const sushi = useSushi()
  const ferreroContract = getFerreroContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const supply = await getFerreroSupply(ferreroContract)
    setSupply(new BigNumber(supply))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, sushi])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setSupply, block, sushi])

  return supply
}

export default useStakedFerreroBalance
