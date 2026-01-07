import { useComputed } from '@preact/signals-react'
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
import { useUserTenants } from '@/hooks/useUsers'
import { TenantsState, UsersState } from '@/state'
import { usersStateActions, tenantsStateActions } from '@/state/actions'
import { ITenant, ETenantUserStatus } from '@/interfaces'

import './tenants.scss'

const { Title } = Typography
const { Option } = Select

export const UserTenantsDrawer: React.FC = (): JSX.Element => {
  const [selectedTenantUid, setSelectedTenantUid] = useState<string | null>(
    null
  )
  const [isStatusEnabled, setIsStatusEnabled] = useState<boolean>(true)
  const { loading: userTenantsLoading } = useUserTenants()
  const { loading: tenantsLoading } = useGetTenantsList()

  const currentUser = useComputed(() => UsersState.currentUser.value)
  const allTenants = useComputed(() => TenantsState.pagination.value.data)

  // Get user's current tenants from the user data
  const userTenants = useMemo(() => {
    return currentUser.value.tenants || []
  }, [currentUser.value.tenants])

  // Available tenants (not assigned to user)
  const availableTenants = useMemo(() => {
    const assignedTenantUids = userTenants.map((t) => t.uid).filter(Boolean)
    return allTenants.value.filter(
      (tenant) => tenant.uid && !assignedTenantUids.includes(tenant.uid)
    )
  }, [allTenants.value, userTenants])

  // Load tenants when drawer opens
  useEffect(() => {
    if (UsersState.openTenantsDrawer.value && allTenants.value.length === 0) {
      tenantsStateActions.getTenantsList()
    }
  }, [UsersState.openTenantsDrawer.value])

  const handleAddTenant = async () => {
    if (!selectedTenantUid || !currentUser.value.uid) return

    const status = isStatusEnabled
      ? ETenantUserStatus.ENABLED
      : ETenantUserStatus.DISABLED

    try {
      await usersStateActions.assignTenant(
        currentUser.value.uid,
        selectedTenantUid,
        status
      )
      // Refresh user data to show the new tenant
      await usersStateActions.getUserTenants(currentUser.value.uid)
      setSelectedTenantUid(null)
      setIsStatusEnabled(true) // Reset to default
      message.success('Empresa asignada correctamente')
    } catch (error) {
      message.error('Error al asignar empresa')
    }
  }

  const handleRemoveTenant = async (tenantUid: string) => {
    if (!currentUser.value.uid) return

    try {
      await usersStateActions.removeTenant(currentUser.value.uid, tenantUid)
      await usersStateActions.getUserTenants(currentUser.value.uid)
      message.success('Empresa removida correctamente')
    } catch (error) {
      message.error('Error al remover empresa')
    }
  }

  // Table columns configuration
  const columns: ColumnType<{ name: string; uid: string; status?: string }>[] =
    [
      {
        title: 'Nombre de la Empresa',
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
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        render: (status: string) => {
          const isEnabled = status === ETenantUserStatus.ENABLED
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
          <Tooltip title='Remover empresa'>
            <Popconfirm
              title='¿Remover esta empresa del usuario?'
              onConfirm={() => handleRemoveTenant(record.uid)}
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
      open={UsersState.openTenantsDrawer.value}
      title={`Gestionar Empresas - ${currentUser.value.firstName} ${currentUser.value.firstSurname}`}
      onClose={usersStateActions.toggleOpenTenantsDrawer}
      width={720}
    >
      <div style={{ padding: '20px' }}>
        {/* Add Tenant Section */}
        <div className='tenant-add-section'>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Asignar Nueva Empresa
          </Title>

          {tenantsLoading.value ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size='large' />
              <p>Cargando empresas...</p>
            </div>
          ) : availableTenants.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              No hay empresas disponibles para asignar
            </p>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
                <Select
                  style={{ width: '70%' }}
                  placeholder='Selecciona una empresa para asignar'
                  value={selectedTenantUid}
                  onChange={setSelectedTenantUid}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {availableTenants.map((tenant) => (
                    <Option key={tenant.uid} value={tenant.uid}>
                      {tenant.name}
                    </Option>
                  ))}
                </Select>
                <Button
                  type='primary'
                  icon={<MdAdd />}
                  onClick={handleAddTenant}
                  disabled={!selectedTenantUid}
                  loading={userTenantsLoading.value.update}
                  style={{ width: '30%' }}
                >
                  Agregar
                </Button>
              </Space.Compact>

              {/* Status selector */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Estado de la Empresa:
                </label>
                <Space align='center'>
                  <Switch
                    checked={isStatusEnabled}
                    onChange={setIsStatusEnabled}
                    checkedChildren='Habilitado'
                    unCheckedChildren='Deshabilitado'
                    style={{ minWidth: '100px' }}
                  />
                </Space>
              </div>
            </div>
          )}
        </div>

        {/* Assigned Tenants Section */}
        <div className='tenant-list-section'>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Empresas Asignadas{' '}
            <span className='tenant-counter'>({userTenants.length})</span>
          </Title>

          <Table
            columns={columns}
            dataSource={userTenants.map((tenant) => ({
              ...tenant,
              key: tenant.uid,
            }))}
            pagination={false}
            size='small'
            locale={{ emptyText: 'Este usuario no tiene empresas asignadas' }}
            scroll={{ y: 300 }}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default UserTenantsDrawer
