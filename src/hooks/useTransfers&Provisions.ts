import axiosInstance, { buildApiUrl } from '@/axios'
import { getTenantHeaders } from '@/utils/tenantHeader'
import { useEffect, useState } from 'react'
import { createNotification } from '@/components/notification'

export interface ICashbox {
  uid: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  office: ICashboxOffice
  cashboxType: ICashboxType
}

export interface ICashboxOffice {
  uid: string
  name: string
}

export interface ICashboxType {
  uid: string
  name: string
}

export interface IProvisionRequest {
  sourceCashboxUid: string
  targetCashboxUid: string
  currencyUid: string
  amount: number
  notes: string
}

export interface ITransferRequest {
  sourceCashboxUid: string
  targetCashboxUid: string
  currencyUid: string
  amount: number
  notes: string
}

export interface TransfersAndProvisionsContext {
  cashboxes: ICashbox[]
  loadingCashboxes: boolean
  errorCashboxes: string | null
  reloadCashboxes: () => Promise<void>

  pendingProvisions: any[]
  loadingPendingProvisions: boolean
  errorPendingProvisions: string | null
  reloadPendingProvisions: () => Promise<void>

  pendingTransfers: any[]
  loadingPendingTransfers: boolean
  errorPendingTransfers: string | null
  reloadPendingTransfers: () => Promise<void>

  createProvision: (data: IProvisionRequest) => Promise<boolean>
  approbeProvision: (uid: string) => Promise<void>

  createTransfer: (data: ITransferRequest) => Promise<boolean>
  approveTransfer: (uid: string) => Promise<void>
  creatingProvision: boolean
  approvingProvision: boolean
  creatingTransfer: boolean
  approvingTransfer: boolean
}

const CASHBOXES_BASE_URL = 'cashboxes/all'

const PROVISIONS_BASE_URL = 'operations/provision/request'
const PROVISION_PENDING_BASE_URL = 'operations/provision/pending'
const PROVISIONS_EXCECUTE_URL = 'operations/provision/execute'

const TRANSFERS_BASE_URL = 'operations/transfer/request'
const TRANSFERS_EXCECUTE_URL = 'operations/transfer/execute'
const TRANSFERS_PENDING_URL = 'operations/transfer/pending'

export const useTransfersAndProvisions = (): TransfersAndProvisionsContext => {
  // Cajas
  const [cashboxes, setCashboxes] = useState<ICashbox[]>([])
  const [loadingCashboxes, setLoadingCashboxes] = useState(false)
  const [errorCashboxes, setErrorCashboxes] = useState<string | null>(null)

  //Lista de provisiones pendientes
  const [pendingProvisions, setPendingProvisions] = useState<any[]>([])
  const [loadingPendingProvisions, setLoadingPendingProvisions] =
    useState(false)
  const [errorPendingProvisions, setErrorPendingProvisions] = useState<
    string | null
  >(null)

  //Lista de traslados pendientes
  const [pendingTransfers, setPendingTransfers] = useState<any[]>([])
  const [loadingPendingTransfers, setLoadingPendingTransfers] = useState(false)
  const [errorPendingTransfers, setErrorPendingTransfers] = useState<
    string | null
  >(null)

  // Provisions actions
  const [creatingProvision, setCreatingProvision] = useState(false)
  const [approvingProvision, setApprovingProvision] = useState(false)

  // Transfers actions
  const [creatingTransfer, setCreatingTransfer] = useState(false)
  const [approvingTransfer, setApprovingTransfer] = useState(false)

  // Traer listado de cajas
  const fetchCashboxes = async () => {
    try {
      setLoadingCashboxes(true)
      setErrorCashboxes(null)

      const { data } = await axiosInstance.get<ICashbox[]>(
        buildApiUrl(CASHBOXES_BASE_URL),
        {
          headers: getTenantHeaders(),
        }
      )
      setCashboxes(data)
    } catch (err: any) {
      console.error('Error loading cashboxes', err)
      setErrorCashboxes('Error al cargar las cajas')
    } finally {
      setLoadingCashboxes(false)
    }
  }

  // Traer listado de provisiones pendientes
  const fetchPendingProvisions = async () => {
    try {
      setLoadingPendingProvisions(true)
      setErrorPendingProvisions(null)
      const { data } = await axiosInstance.get<any>(
        buildApiUrl(PROVISION_PENDING_BASE_URL, {
          prefix: 'inventario',
        }),
        {
          headers: getTenantHeaders(),
        }
      )
      setPendingProvisions(data)
    } catch (err: any) {
      console.error('Error loading pending provisions', err)
      setErrorPendingProvisions('Error al cargar las provisiones pendientes')
    } finally {
      setLoadingPendingProvisions(false)
    }
  }

  // Crear una nueva provisión
  const createProvision = async (provision: IProvisionRequest) => {
    try {
      setCreatingProvision(true)

      await axiosInstance.post(
        buildApiUrl(PROVISIONS_BASE_URL, { prefix: 'inventario' }),
        provision,
        { headers: getTenantHeaders() }
      )

      await fetchPendingProvisions()

      createNotification(
        'success',
        'Éxito',
        'La provisión ha sido creada correctamente.'
      )
      return true
    } catch (error: any) {
      let finalMessage = error.message
      if (error.message === 'Currency stock not found in source cashbox') {
        finalMessage = 'No se encontró stock de la moneda en la caja de origen'
      }
      createNotification('error', 'Error', finalMessage)
      return false
    } finally {
      setCreatingProvision(false)
    }
  }

  // Aprobar una provisión pendiente
  const approbeProvision = async (provisionUid: string) => {
    try {
      setApprovingProvision(true)

      await axiosInstance.post(
        buildApiUrl(PROVISIONS_EXCECUTE_URL, { prefix: 'inventario' }),
        { operationUid: provisionUid },
        { headers: getTenantHeaders() }
      )

      createNotification(
        'success',
        'Éxito',
        'La provisión ha sido aprobada correctamente.'
      )
      await fetchPendingProvisions()
    } catch (error: any) {
      createNotification('error', 'Error', error.message)
    } finally {
      setApprovingProvision(false)
    }
  }

  // Traer listado de traslados pendientes
  const fetchPendingTransfers = async () => {
    try {
      setLoadingPendingTransfers(true)
      setErrorPendingTransfers(null)
      const { data } = await axiosInstance.get<any>(
        buildApiUrl(TRANSFERS_PENDING_URL, {
          prefix: 'inventario',
        }),
        {
          headers: getTenantHeaders(),
        }
      )
      setPendingTransfers(data)
    } catch (err: any) {
      console.error('Error loading pending transfers', err)
      setErrorPendingTransfers('Error al cargar los traslados pendientes')
    } finally {
      setLoadingPendingTransfers(false)
    }
  }

  // Crear un nuevo traslado
  const createTransfer = async (transfer: ITransferRequest) => {
    try {
      setCreatingTransfer(true)

      await axiosInstance.post(
        buildApiUrl(TRANSFERS_BASE_URL, { prefix: 'inventario' }),
        transfer,
        { headers: getTenantHeaders() }
      )

      await fetchPendingTransfers()

      createNotification(
        'success',
        'Éxito',
        'El traslado ha sido creado correctamente.'
      )
      return true
    } catch (error: any) {
      let finalMessage = error.message

      if (error.message === 'Currency stock not found in source cashbox') {
        finalMessage = 'No se encontró stock de la moneda en la caja de origen'
      }

      if (
        error.message ===
        'Transfers are for inter-office movements. Use Provision for same-office.'
      ) {
        finalMessage =
          'Los traslados son para movimientos entre oficinas. Use Provisión para la misma oficina.'
      }

      createNotification('error', 'Error', finalMessage)
      return false
    } finally {
      setCreatingTransfer(false)
    }
  }

  // Aprobar un traslado pendiente
  const approveTransfer = async (transferUid: string) => {
    try {
      setApprovingTransfer(true)

      await axiosInstance.post(
        buildApiUrl(TRANSFERS_EXCECUTE_URL, { prefix: 'inventario' }),
        { operationUid: transferUid },
        { headers: getTenantHeaders() }
      )

      createNotification(
        'success',
        'Éxito',
        'El traslado ha sido aprobado correctamente.'
      )
      await fetchPendingTransfers()
    } catch (error: any) {
      createNotification('error', 'Error', error.message)
    } finally {
      setApprovingTransfer(false)
    }
  }

  useEffect(() => {
    if (cashboxes.length === 0) {
      fetchCashboxes()
    }

    fetchPendingProvisions()
  }, [])

  return {
    cashboxes,
    loadingCashboxes,
    errorCashboxes,
    reloadCashboxes: fetchCashboxes,

    pendingProvisions,
    loadingPendingProvisions,
    errorPendingProvisions,
    reloadPendingProvisions: fetchPendingProvisions,

    pendingTransfers,
    loadingPendingTransfers,
    errorPendingTransfers,
    reloadPendingTransfers: fetchPendingTransfers,

    createProvision,
    approbeProvision,
    createTransfer,
    approveTransfer,

    creatingProvision,
    approvingProvision,
    creatingTransfer,
    approvingTransfer,
  }
}
