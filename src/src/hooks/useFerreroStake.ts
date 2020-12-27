import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { stake, getFerreroMasterContract } from '../sushi/utils'

// hooks
import useKitKat from './useSushi'
import { useActiveWeb3React } from '.'

const useStake = (lpTokenAddress: number) => {
  const { account } = useActiveWeb3React()
  const KitKat = useKitKat()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const ref = query.get('ref') || '0x0000000000000000000000000000000000000000'

  const handleStake = useCallback(
    async (amount: string) => {
      await stake(getFerreroMasterContract(KitKat), lpTokenAddress, amount, account, ref)
    },
    [account, lpTokenAddress, KitKat, ref]
  )

  return { onStake: handleStake }
}

export default useStake
