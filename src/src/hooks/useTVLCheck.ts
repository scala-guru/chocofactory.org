import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getWethContract, getContractBalance, getBalanceNumber, getBNBPrice, getBUSDUSDTPair, getWbusdContract, getLPAddressByPid, getMasterChefContract, getFerreroAddress, getFerreroPrice, getFerreroContract, getMasterChefAddress, getKITKATFERREROPair, getSushiContract, getKitKatPrice} from '../sushi/utils' //getBNBBUSDPair
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
  const Contract = getWethContract(sushi)
  const wbusdContract = getWbusdContract(sushi)
  const BUSDUSDTPair = getBUSDUSDTPair(sushi)
  const MasterContract = getMasterChefContract(sushi)
  const ferreroAddress = getFerreroAddress(sushi)
  const ferreroContract = getFerreroContract(sushi)
  const KitKatMasterAddress = getMasterChefAddress(sushi)
  const KITKATFERREROPair = getKITKATFERREROPair(sushi)
  const KitKatContract = getSushiContract(sushi)
  //const BNBBUSDpool = getBNBBUSDPair(sushi)

  const fetchBalance = useCallback(async () => {
	  //return ;//DBG
	const bnbprice = await getBNBPrice(sushi); //Contract, wbusdContract, BNBBUSDpool
	const ferreroPrice = await getFerreroPrice(sushi)
	const KitKatPrice = await getKitKatPrice(sushi)
	let allValue = 0;
	
	for (let i = 0; i < 15; i++) {
		const lpaddress = await getLPAddressByPid(MasterContract, i)
		if(lpaddress !== BUSDUSDTPair){
			if(lpaddress === ferreroAddress){
				const lpamout = await getContractBalance(ferreroContract, KitKatMasterAddress)
				const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * ferreroPrice
				allValue = allValue + totalStaked
			}
			else if(lpaddress === KITKATFERREROPair){
				const ferreroamout = await getContractBalance(ferreroContract, lpaddress)	//ferrero
				const KitKatamout = await getContractBalance(KitKatContract, lpaddress)	//KitKat
				const totalStaked = (getBalanceNumber(new BigNumber(ferreroamout))*ferreroPrice) + (getBalanceNumber(new BigNumber(KitKatamout))*KitKatPrice)
				allValue = allValue + totalStaked
			}
			else{
				const lpamout = await getContractBalance(Contract, lpaddress)	
				const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * bnbprice * 2
				allValue = allValue + totalStaked
			}
			
		}
		else{
			const lpamout = await getContractBalance(wbusdContract, lpaddress)	
			const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * 2			
			allValue = allValue + totalStaked
		}
	}
	
	setTotalStaked(allValue)	
	
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
