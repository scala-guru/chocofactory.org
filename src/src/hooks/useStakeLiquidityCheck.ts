import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getContractBalance, getBalanceNumber, getSushiContract, getKitKatPrice, getFerreroMasterAddress } from '../sushi/utils' //
//import { getFerreroSupply, getFerreroContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useChecking = () => {
  const [totalStaked, setTotalStaked] = useState(0)
  const { account } = useActiveWeb3React()
  const sushi = useSushi()  
  const block = useBlock()
  const KitKatContract = getSushiContract(sushi)
  const ferreroMasterAddress = getFerreroMasterAddress(sushi)

  const fetchBalance = useCallback(async () => {
	
    const lpamout = await getContractBalance(KitKatContract, ferreroMasterAddress)
	const KitKatPrice = await getKitKatPrice(sushi)
	
	const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * KitKatPrice
	
    setTotalStaked(totalStaked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, sushi])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setTotalStaked, block, sushi])

  return totalStaked
}

export default useChecking
