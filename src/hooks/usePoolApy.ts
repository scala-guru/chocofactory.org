import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getContractBalance, getBalanceNumber, getKitKatPrice, getBNBPrice, getWethContract, getPoolTotalAllocPoint, getPoolAllocPoint, getMasterChefContract, getBUSDUSDTPair, getWbusdContract, getFerreroAddress, getFerreroPrice, getFerreroContract, getMasterChefAddress, getKITKATFERREROPair, getSushiContract } from '../sushi/utils' //
//import { getFerreroSupply, getFerreroContract } from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useChecking = (lpTokenAddress: string, pid: number) => {
  const [totalApy, setApy] = useState(0)
  const { account } = useActiveWeb3React()
  const sushi = useSushi()  
  const block = useBlock()
  const Contract = getWethContract(sushi)
  const MasterChefContract = getMasterChefContract(sushi)
  const wbusdContract = getWbusdContract(sushi)
  const BUSDUSDTPair = getBUSDUSDTPair(sushi)
  const ferreroAddress = getFerreroAddress(sushi)
  const ferreroContract = getFerreroContract(sushi)
  const KitKatMasterAddress = getMasterChefAddress(sushi)
  const KITKATFERREROPair = getKITKATFERREROPair(sushi)
  const KitKatContract = getSushiContract(sushi)

  const fetchBalance = useCallback(async () => {	

	const allowPoint = await getPoolAllocPoint(MasterChefContract, pid)
	const totalPoint = await getPoolTotalAllocPoint(MasterChefContract)
	const NumberPoolWeight = allowPoint / totalPoint
	
	const KitKatPrice = await getKitKatPrice(sushi)
	const bnbprice = await getBNBPrice(sushi)
	const ferreroPrice = await getFerreroPrice(sushi)
	
	const blockPerYear = 10512000
	const KitKatPerBlock = 0.14 //KitKat per year (earlt maker 1532160) //0.14
	
	if(lpTokenAddress !== BUSDUSDTPair){
		if(lpTokenAddress === ferreroAddress){ //ferrero
			const lpamout = await getContractBalance(ferreroContract, KitKatMasterAddress)
			const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * ferreroPrice
			const totalApy = ((KitKatPrice * blockPerYear * KitKatPerBlock * NumberPoolWeight) / totalStaked)*100
			setApy(totalApy)
		}
		else if(lpTokenAddress === KITKATFERREROPair){
			const ferreroamout = await getContractBalance(ferreroContract, lpTokenAddress)	//ferrero
			const KitKatamout = await getContractBalance(KitKatContract, lpTokenAddress)	//KitKat
			const totalFerreroStaked = getBalanceNumber(new BigNumber(ferreroamout)) * ferreroPrice
			const totalKitKatStaked = getBalanceNumber(new BigNumber(KitKatamout)) * KitKatPrice
			
			const totalStaked = totalFerreroStaked + totalKitKatStaked
			
			const totalApy = ((KitKatPrice * blockPerYear * KitKatPerBlock * NumberPoolWeight) / totalStaked)*100
			setApy(totalApy)
		}
		else{ //normal		
			const lpamout = await getContractBalance(Contract, lpTokenAddress)	
			const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * bnbprice * 2 //bnb in pool		
			const totalApy = ((KitKatPrice * blockPerYear * KitKatPerBlock * NumberPoolWeight) / totalStaked)*100
			setApy(totalApy)
		}		
	}
	else{
		const lpamout = await getContractBalance(wbusdContract, lpTokenAddress)
		const totalStaked = getBalanceNumber(new BigNumber(lpamout)) * 2 //busd in pool		
		const totalApy = ((KitKatPrice * blockPerYear * KitKatPerBlock * NumberPoolWeight) / totalStaked)*100
		setApy(totalApy)
	}
	
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
