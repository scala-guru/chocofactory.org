import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getContractBalance, getBalanceNumber, getSushiContract, getKitKatPrice, getFerreroMasterAddress, getFerreroPrice } from '../sushi/utils' //
//import { getFerreroSupply, getFerreroContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useChecking = () => {
  const [totalApy, setApy] = useState(0)
  const { account } = useActiveWeb3React()
  const sushi = useSushi()  
  const block = useBlock()
  const KitKatContract = getSushiContract(sushi)
  const ferreroMasterAddress = getFerreroMasterAddress(sushi)

  const fetchBalance = useCallback(async () => {
	
    const lpamout = await getContractBalance(KitKatContract, ferreroMasterAddress)
	const KitKatPrice = await getKitKatPrice(sushi)
	const ferreroPrice = await getFerreroPrice(sushi)
	const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * KitKatPrice //All KitKat in FerreroMaSter to usd
	const blockPerYear = 10512000
	const ferreroPerBlock = 0.0026 //0.0026
	
	const totalApy = ((ferreroPrice * blockPerYear * ferreroPerBlock) / totalStaked)*100
	
    setApy(totalApy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, sushi])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setApy, block, sushi])

  return totalApy
}

export default useChecking
