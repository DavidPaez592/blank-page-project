import { useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { message } from 'antd'

import { officesSelectors } from '@/state'
import { officesStateActions } from '@/state/offices/actions'

export const useGetAllOffices = () => {
  const loading = useSignal(false)

  useEffect(() => {
    const loadAllOffices = async () => {
      loading.value = true
      try {
        await officesStateActions.getAllOffices()
      } catch (error) {
        console.error('Error loading offices:', error)
        message.error('Error al cargar las oficinas')
      } finally {
        loading.value = false
      }
    }

    loadAllOffices()
  }, [])

  return {
    officeOptions: officesSelectors.officeOptions,
    loading,
  }
}
