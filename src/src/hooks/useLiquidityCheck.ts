import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getWethContract, getContractBalance, getBalanceNumber, getBNBPrice, getBUSDUSDTPair, getWbusdContract, getFerreroAddress, getFerreroPrice, getFerreroContract, getMasterChefAddress, getKITKATFERREROPair, getKitKatPrice, getSushiContract} from '../sushi/utils' //getBNBBUSDPair
//import { getFerreroSupply, getFerreroContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useChecking = (lpPool: string) => {
  const [totalStaked, setTotalStaked] = useState(0)
  const { account } = useActiveWeb3React()
  const sushi = useSushi()  
  const block = useBlock()
  const Contract = getWethContract(sushi)
  const wbusdContract = getWbusdContract(sushi)
  const BUSDUSDTPair = getBUSDUSDTPair(sushi)
  const ferreroAddress = getFerreroAddress(sushi)
  const ferreroContract = getFerreroContract(sushi)
  const KitKatMasterAddress = getMasterChefAddress(sushi)
  const KITKATFERREROPair = getKITKATFERREROPair(sushi)
  const KitKatContract = getSushiContract(sushi)
  //const BNBBUSDpool = getBNBBUSDPair(sushi)

  const fetchBalance = useCallback(async () => {
	
	/*const bnbAmount = await getContractBalance(Contract, BNBBUSDpool)
	const busdAmount = await getContractBalance(wbusdContract, BNBBUSDpool)
	const bnbprice = getBalanceNumber(new BigNumber(busdAmount))/getBalanceNumber(new BigNumber(bnbAmount))*/
	
	const bnbprice = await getBNBPrice(sushi) //Contract, wbusdContract, BNBBUSDpool
	const ferreroPrice = await getFerreroPrice(sushi)
	const KitKatPrice = await getKitKatPrice(sushi)
	
	if(lpPool !== BUSDUSDTPair){
		if(lpPool === ferreroAddress){
			const lpamout = await getContractBalance(ferreroContract, KitKatMasterAddress)	//is ferrero only
			const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * ferreroPrice
			setTotalStaked(totalStaked)			
		}
		else if(lpPool === KITKATFERREROPair){
			const ferreroamout = await getContractBalance(ferreroContract, lpPool)	//ferrero
			const KitKatamout = await getContractBalance(KitKatContract, lpPool)	//KitKat
			const totalStaked = (getBalanceNumber(new BigNumber(ferreroamout))*ferreroPrice) + (getBalanceNumber(new BigNumber(KitKatamout))*KitKatPrice)
			setTotalStaked(totalStaked)
		}
		else{ // normal
			const lpamout = await getContractBalance(Contract, lpPool)	//all
			const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * bnbprice * 2
			setTotalStaked(totalStaked)
		}
	}
    else{ //stable coin
		const lpamout = await getContractBalance(wbusdContract, lpPool)	
		const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * 2
		setTotalStaked(totalStaked)
	}
	
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
