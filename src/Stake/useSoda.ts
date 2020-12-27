import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

import {
  getFerrero,
  getPendingFerrero,
  getFerreroContract,
  getSushiContract,
  getFerreroAddress
} from '../sushi/utils'

// hooks
import useSushi from './useSushi'
import useBlock from './useBlock'
import { useActiveWeb3React } from '.'

const useFerrero = () => {
  const [earnings, setEarnings] = useState(new BigNumber(0))
  const [ferreroBalance, setFerreroBalance] = useState(new BigNumber(0))
  const [allowance, setAllowance] = useState(new BigNumber(0))

  const { account } = useActiveWeb3React()
  const KitKat = useSushi()
  const ferreroContract = getFerreroContract(KitKat)
  const ferreroAddress = getFerreroAddress(KitKat)
  const block = useBlock()

  const fetchKitKatBalance = useCallback(async () => {
    const earnings = await getPendingFerrero(ferreroContract, account)
    setEarnings(new BigNumber(earnings))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, ferreroContract, KitKat])

  const fetchFerreroBalance = useCallback(async () => {
    const ferreroBalance = await getFerrero(ferreroContract, account)
    setFerreroBalance(new BigNumber(ferreroBalance))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, ferreroContract, KitKat])

  const handleApproveFerrero = useCallback(async () => {
    const KitKatContract = getSushiContract(KitKat)
    const tx = await KitKatContract.methods
      .approve(ferreroAddress, ethers.constants.MaxUint256.toString())
      .send({ from: account })

    return tx
  }, [account, KitKat, ferreroAddress])

  const getFerreroAllowance = useCallback(async () => {
    const KitKatContract = getSushiContract(KitKat)

    const allowance = await KitKatContract.methods.allowance(account, ferreroAddress).call()

    setAllowance(new BigNumber(allowance))
  }, [account, ferreroAddress, KitKat])
  
  useEffect(() => {
    if (account && ferreroContract && KitKat) {
      fetchKitKatBalance()
      fetchFerreroBalance()
      getFerreroAllowance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, block, KitKat])

  return {
    earnings,
    ferreroBalance,
    handleApproveFerrero,
    allowance,
  }
}

export default useFerrero
