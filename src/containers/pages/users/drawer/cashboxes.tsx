import { useComputed } from '@preact/signals-react'
import axiosInstance, { buildApiUrl } from '@/axios'
import {
  Drawer,
  Select,
  Button,
  Table,
  Typography,
  Spin,
  Space,
  Popconfirm,
  Tooltip,
  message,
  Tag,
  Switch,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { MdAdd, MdDeleteForever } from 'react-icons/md'
import { ColumnType } from 'antd/es/table'

import { useGetTenantsList } from '@/hooks/useTenants'
import { UsersState, CashBoxesState } from '@/state'
import { usersStateActions, tenantsStateActions } from '@/state/actions'
import { ITenant, ETenantUserStatus } from '@/interfaces'

import './tenants.scss'
import CashBoxesForTenantForm from '../../cashboxes/drawer/boxesfortenants'
import { useCashBoxes } from '@/hooks/useCashBoxes'

interface cashBoxInterface {
  name: string
  createdAt?: string
  updatedAt?: string
  uid: string
  isActive?: boolean
}

const { Title } = Typography
const { Option } = Select

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid
    ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json' }
    : {}
}

export const UserCashBoxesDrawer: React.FC = (): JSX.Element => {
  const [selectedTenantUid, setSelectedTenantUid] = useState<string | null>(
    null
  )

  const [cashBoxes, setCashBoxes] = useState<cashBoxInterface[]>([])
  const { loadingCashbox: userTenantsLoading } = useCashBoxes()
  const { loading: tenantsLoading } = useGetTenantsList()

  const currentUser = useComputed(() => UsersState.currentUser.value)

  const getCashBoxesUser = async (userUId: string) => {
    try {
      setCashBoxes([])
      const res = await axiosInstance
        .post(
          '/v1/users/cashboxes/list',
          { uid: userUId },
          { headers: getTenantHeaders() }
        )
        .then((res: any) => {
          const cashBoxesData = Array.isArray(res?.data)
            ? res.data
            : res?.data?.data || []

          UsersState.userCashBoxes.value = cashBoxesData
        })

      //console.log(`✅ Respuesta de cajas del usuario: ${cashBoxes}`)
    } catch (error) {
      console.error('Error fetching boxes for user:', error)
      return []
    }
  }

  // Load tenants when drawer opens
  //useEffect(() => {
  //  console.log('userCashBoxes', JSON.stringify(UsersState.userCashBoxes.value));
  //}, [])

  const handleRemoveBashBoxesUser = async (Uid: string) => {
    if (!currentUser.value.uid) return

    try {
      await axiosInstance
        .delete('/v1/users/cashboxes/remove', {
          data: {
            uid: currentUser.value.uid,
            cashboxUId: Uid,
          },
          headers: getTenantHeaders(),
        })
        .then(async (res: any) => {
          getCashBoxesUser(currentUser.value.uid!)
        })

      message.success('Caja removida correctamente')
    } catch (error) {
      message.error('Error al remover la caja asignada al usuario')
    }
  }

  const columns: ColumnType<{
    name: string
    uid: string
    isActive?: boolean
  }>[] = [
    {
      title: 'Nombre de la Caja',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive: boolean) => {
        const isEnabled = isActive === true
        return (
          <Tag color={isEnabled ? 'green' : 'red'}>
            {isEnabled ? 'Habilitado' : 'Deshabilitado'}
          </Tag>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title='Remover caja'>
          <Popconfirm
            title='¿Remover esta caja del usuario?'
            onConfirm={() => handleRemoveBashBoxesUser(record.uid)}
            okText='Sí, remover'
            cancelText='Cancelar'
          >
            <Button
              type='primary'
              danger
              icon={<MdDeleteForever size={16} />}
              size='small'
              loading={userTenantsLoading.value.update}
            />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ]

  return (
    <Drawer
      className='user-tenants-drawer'
      destroyOnClose
      maskClosable={false}
      open={UsersState.openCashBoxesDrawer.value}
      title={`Gestionar Cajas - ${currentUser.value.firstName} ${currentUser.value.firstSurname}`}
      onClose={usersStateActions.toggleOpenCashBoxesDrawer}
      width={720}
    >
      <div style={{ padding: '20px' }}>
        <div className='tenant-add-section'>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Asignar Cajas
          </Title>
          <CashBoxesForTenantForm
            userUid={currentUser.value.uid}
            onCreated={() => {}}
          />
          <Table
            columns={columns}
            dataSource={UsersState.userCashBoxes.value.map((cashbox) => ({
              ...cashbox,
              key: cashbox.uid,
            }))}
            pagination={false}
            size='small'
            locale={{ emptyText: 'Este usuario no tiene empresas asignadas' }}
            scroll={{ y: 300 }}
          />
        </div>
        {/* Assigned Tenants Section */}
      </div>
    </Drawer>
  )
}

export default UserCashBoxesDrawer
