import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import tenantsRequests from '@/state/tenants/requests'
import { useSignal } from '@preact/signals-react'
import {
  Button,
  Card,
  Tabs,
  Table,
  Tag,
  Spin,
  message,
  Avatar,
  Space,
  Popconfirm,
  Tooltip,
  Select,
  Pagination,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { IoAddCircle } from 'react-icons/io5'
import { MdEditSquare, MdDeleteForever, MdHomeWork } from 'react-icons/md'
import { FaCheckCircle, FaTimesCircle, FaUserShield } from 'react-icons/fa'
import { BsStarFill } from 'react-icons/bs'
import OfficeDrawer from './components/OfficeDrawer'
import OfficeAssignUserDrawer from './components/OfficeAssignUserDrawer'
import UserOfficesDrawer from './components/UserOfficesDrawer'
import ManageTenantUserOfficesDrawer from './components/ManageTenantUserOfficesDrawer'
import { MdBusiness, MdRemoveCircleOutline } from 'react-icons/md'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import {
  IUser,
  IRole,
  EUserStatus,
  ETenantStatus,
  ETenantUserStatus,
} from '@/interfaces'
import { TenantsState } from '@/state'
import { tenantsStateActions } from '@/state/actions'
import { useTenantDetail } from '@/hooks/useTenantDetail'
import { useTenant } from '@/hooks/useTenants'
import TenantsFormDrawer from '../drawer/form'
import { UserDrawer } from './components/UserDrawer'
import RoleDrawer from './components/RoleDrawer'
import { TenantRolePermissionsDrawer } from './components/TenantRolePermissionsDrawer'
import './index.scss'

export const TenantDetailPage: React.FC = (): JSX.Element => {
  const { tenantUid } = useParams<{ tenantUid: string }>()
  const navigate = useNavigate()

  const {
    loading,
    users,
    roles,
    paginatedRoles,
    rolesTotal,
    rolesCurrentPage,
    rolesPageSize,
    activeUsersCount,
    addingUser,
    addingRole,
    deletingRole,
    updatingRole,
    addUserToTenant,
    updateUserInTenant,
    addRoleToTenant,
    updateRoleInTenant,
    removeRoleFromTenant,
    loadTenantRolesPaginated,
    refreshTenantDetail,
    assignRolePermissions,
  } = useTenantDetail(tenantUid!)

  const { handleEditTenant } = useTenant()

  const currentTenant = TenantsState.currentTenant.value
  const userDrawerVisible = useSignal(false)
  const editUserDrawerVisible = useSignal(false)
  const selectedUserForEdit = useSignal<IUser | null>(null)
  const roleDrawerVisible = useSignal(false)
  const editRoleDrawerVisible = useSignal(false)
  const selectedRoleForEdit = useSignal<IRole | null>(null)
  const rolePermissionsDrawerVisible = useSignal(false)
  const selectedRoleForPermissions = useSignal<IRole | null>(null)
  const activeTab = useSignal('usuarios')
  const rolesPaginatedLoaded = useSignal(false)
  const officeDrawerVisible = useSignal(false)
  const editingOffice = useSignal(false)
  const selectedOfficeForEdit = useSignal<IOffice | null>(null)
  const assignUserDrawerVisible = useSignal(false)
  const selectedOfficeForAssign = useSignal<IOffice | null>(null)
  const assignMode = useSignal<'assign' | 'remove'>('assign')
  const userOfficesDrawerVisible = useSignal(false)
  const manageTenantUserOfficesDrawerVisible = useSignal(false)
  const selectedUserForOfficeAssign = useSignal<IUser | null>(null)
  // Offices state
  type IOffice = {
    uid: string
    name: string
    createdAt?: string
    updatedAt?: string
  }
  const offices = useSignal<IOffice[]>([])
  const officesLoading = useSignal(false)
  const officesLoaded = useSignal(false)
  const officesPage = useSignal(1)
  const officesPageSize = useSignal(10)
  const officesTotal = useSignal(0)
  const officesAllMode = useSignal(false)

  const loadTenantOffices = async (
    page = officesPage.value,
    limit = officesPageSize.value,
    force = false
  ) => {
    if (!tenantUid) return
    if (officesAllMode.value) return // si estamos en modo todas, no recargamos aquí
    if (
      officesLoaded.value &&
      !force &&
      page === officesPage.value &&
      limit === officesPageSize.value
    )
      return
    officesLoading.value = true
    try {
      const { data } = await tenantsRequests.listOffices({
        tenantUId: tenantUid,
        page,
        limit,
      })
      const payload: any = data as any
      const meta = payload?.data || payload
      offices.value = meta?.offices || []
      officesTotal.value = meta?.total || 0
      officesPage.value = meta?.page || page
      officesPageSize.value = meta?.limit || limit
      officesLoaded.value = true
      // eslint-disable-next-line no-console
      console.log('[Oficinas listadas]', {
        page: officesPage.value,
        pageSize: officesPageSize.value,
        total: officesTotal.value,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('No se pudieron cargar oficinas', err)
    } finally {
      officesLoading.value = false
    }
  }

  const loadAllOffices = async (showAll = false) => {
    if (!tenantUid) return
    officesLoading.value = true
    try {
      const { data } = await tenantsRequests.listAllOffices({
        tenantUId: tenantUid,
      })
      // data puede ser: array plano | objeto { data: array } | objeto { offices: array }
      // eslint-disable-next-line no-console
      console.log('[RAW /offices/all]', data)
      let all: any = []
      if (Array.isArray(data)) {
        all = data
      } else if (Array.isArray((data as any)?.data)) {
        all = (data as any).data
      } else if (Array.isArray((data as any)?.offices)) {
        all = (data as any).offices
      }
      const total = all.length
      officesTotal.value = total
      officesPage.value = 1
      officesLoaded.value = true
      if (showAll) {
        offices.value = all
        officesAllMode.value = true
        // eslint-disable-next-line no-console
        console.log('[Oficinas modo ALL] total', total)
      } else {
        // bootstrap inicial: mostramos solo primeras N según pageSize actual (default 10)
        const sliceSize = officesPageSize.value || 10
        offices.value = all.slice(0, sliceSize)
        officesAllMode.value = false
        // eslint-disable-next-line no-console
        console.log(
          '[Oficinas bootstrap] mostrando',
          offices.value.length,
          'de',
          total
        )
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('No se pudieron cargar todas las oficinas', err)
    } finally {
      officesLoading.value = false
    }
  }

  const switchPageSize = async (value: string | number) => {
    if (value === 'ALL') {
      await loadAllOffices(true)
    } else {
      officesAllMode.value = false
      officesPageSize.value = Number(value)
      officesPage.value = 1
      // Si ya hicimos bootstrap (tenemos total) usamos list para traer página 1 real
      await loadTenantOffices(1, officesPageSize.value, true)
    }
  }
  // (bloque duplicado eliminado)

  const openOfficeDrawer = () => {
    editingOffice.value = false
    selectedOfficeForEdit.value = null
    officeDrawerVisible.value = true
  }
  const closeOfficeDrawer = () => {
    officeDrawerVisible.value = false
  }
  const openEditOfficeDrawer = (office: IOffice) => {
    selectedOfficeForEdit.value = office
    editingOffice.value = true
    officeDrawerVisible.value = true
  }
  const openAssignUserDrawer = (office: IOffice) => {
    selectedOfficeForAssign.value = office
    assignMode.value = 'assign'
    assignUserDrawerVisible.value = true
  }
  const openRemoveUserDrawer = (office: IOffice) => {
    selectedOfficeForAssign.value = office
    assignMode.value = 'remove'
    assignUserDrawerVisible.value = true
  }
  const closeAssignUserDrawer = () => {
    assignUserDrawerVisible.value = false
    selectedOfficeForAssign.value = null
  }

  // Cargar datos del tenant si no están disponibles
  useEffect(() => {
    if (tenantUid && (!currentTenant?.uid || currentTenant.uid !== tenantUid)) {
      tenantsStateActions.getDetail(tenantUid)
    }
  }, [tenantUid, currentTenant?.uid])

  const handleGoBack = () => {
    navigate('/tenants')
  }

  const handleRefresh = () => {
    if (currentTenant?.uid) {
      handleEditTenant(currentTenant.uid)
    }
  }

  const handleAddUser = () => {
    userDrawerVisible.value = true
  }

  const handleCloseUserDrawer = () => {
    userDrawerVisible.value = false
  }

  const handleSubmitAddUser = async (userData: any) => {
    return await addUserToTenant(userData)
  }

  const handleEditUser = (user: IUser) => {
    selectedUserForEdit.value = user
    editUserDrawerVisible.value = true
  }

  const handleCloseEditUserDrawer = () => {
    editUserDrawerVisible.value = false
    selectedUserForEdit.value = null
  }

  const handleSubmitEditUser = async (
    userUid: string,
    status: ETenantUserStatus,
    roleUid?: string,
    userData?: {
      firstName?: string
      firstSurname?: string
      secondName?: string
      secondSurname?: string
      email?: string
    },
    roleUids?: string[]
  ) => {
    return await updateUserInTenant(userUid, status, userData, roleUids)
  }

  const handleAddRole = () => {
    roleDrawerVisible.value = true
  }

  const handleCloseRoleDrawer = () => {
    roleDrawerVisible.value = false
  }

  const handleSubmitAddRole = async (roleData: {
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }) => {
    return await addRoleToTenant(roleData)
  }

  const handleEditRole = (role: IRole) => {
    selectedRoleForEdit.value = role
    editRoleDrawerVisible.value = true
  }

  const handleCloseEditRoleDrawer = () => {
    editRoleDrawerVisible.value = false
    selectedRoleForEdit.value = null
  }

  const handleSubmitEditRole = async (
    roleUid: string,
    roleData: {
      name: string
      description: string
      modifiable?: boolean
      deletable?: boolean
    }
  ) => {
    return await updateRoleInTenant(roleUid, roleData)
  }

  const handleDeleteRole = async (roleUid: string) => {
    return await removeRoleFromTenant(roleUid)
  }

  const handleOpenRolePermissions = (role: IRole) => {
    selectedRoleForPermissions.value = role
    rolePermissionsDrawerVisible.value = true
  }

  const handleCloseRolePermissions = () => {
    rolePermissionsDrawerVisible.value = false
    selectedRoleForPermissions.value = null
  }

  const handleAssignPermissions = async (
    roleUid: string,
    permissions: string[]
  ): Promise<boolean> => {
    try {
      const success = await assignRolePermissions(roleUid, permissions)

      if (success) {
        handleCloseRolePermissions()
      }

      return success
    } catch (error) {
      console.error('Error assigning permissions:', error)
      return false
    }
  }

  const handleRolePageChange = (page: number, pageSize?: number) => {
    loadTenantRolesPaginated(page, pageSize)
  }

  const handleTabChange = (key: string) => {
    activeTab.value = key

    // Si cambia al tab de roles y aún no se han cargado los roles paginados
    if (key === 'role' && !rolesPaginatedLoaded.value) {
      loadTenantRolesPaginated()
      rolesPaginatedLoaded.value = true
    } else if (key === 'offices') {
      // Bootstrap inicial: cargar todas pero mostrar primeras 10 para activar paginación coherente.
      if (!officesLoaded.value) {
        loadAllOffices(false)
      }
    }
  }

  const getTenantStatusConfig = (status?: ETenantStatus) => {
    switch (status) {
      case ETenantStatus.Active:
        return {
          color: 'green',
          text: 'Activo',
        }
      case ETenantStatus.Suspended:
        return {
          color: 'red',
          text: 'Suspendido',
        }
      case ETenantStatus.PendingSetup:
      default:
        return {
          color: 'orange',
          text: 'Pendiente por configurar',
        }
    }
  }

  const userColumns: ColumnsType<IUser> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (_: any, record: IUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} size='small' />
          {`${record.firstName || ''} ${record.firstSurname || ''}`.trim()}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      width: 200,
      responsive: ['md'],
      render: (_: any, record: IUser) => {
        const roleNames: string[] = []
        if (record.roles && Array.isArray(record.roles)) {
          record.roles.forEach((userRole) => {
            let roleName = ''

            if (typeof userRole === 'string') {
              const foundRole = roles.value.find((r) => r.uid === userRole)
              roleName = foundRole?.name || userRole
            } else if (userRole?.name) {
              roleName = userRole.name
            }

            if (roleName && !roleNames.includes(roleName)) {
              roleNames.push(roleName)
            }
          })
        }

        return roleNames.length > 0 ? roleNames.join(', ') : 'Sin roles'
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      render: (_: any, record: IUser) => {
        const tenantRelation = record.tenants?.find((t) => t.uid === tenantUid)
        const status = tenantRelation?.status || ETenantUserStatus.ENABLED
        return (
          <Tag color={status === ETenantUserStatus.ENABLED ? 'green' : 'red'}>
            {status === ETenantUserStatus.ENABLED ? 'Activo' : 'Inactivo'}
          </Tag>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: any, record: IUser) => (
        <Space size='small'>
          <CheckAccess permission={PERMISSIONS_LIST.UsersUpdate}>
            <Button
              style={{ borderRadius: '50%', padding: '5px' }}
              size='small'
              onClick={() => record.uid && handleEditUser(record)}
              disabled={!record.uid}
              icon={
                <MdEditSquare
                  title='Editar'
                  size={16}
                  color='grey'
                  cursor='pointer'
                />
              }
            />
          </CheckAccess>
          <Tooltip title='Gestionar Cajas'>
            <Button
              style={{ borderRadius: '50%', padding: '5px' }}
              size='small'
              disabled={!record.uid}
              onClick={() => {
                if (record.uid) {
                  selectedUserForOfficeAssign.value = record
                  manageTenantUserOfficesDrawerVisible.value = true
                }
              }}
              icon={
                <MdHomeWork
                  title='Gestionar Cajas'
                  size={16}
                  cursor='pointer'
                />
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  if (loading.value) {
    return (
      <div className='tenant-detail-loading'>
        <Spin size='large' />
      </div>
    )
  }

  const tabItems = [
    {
      key: 'usuarios',
      label: 'Usuarios',
      children: (
        <Card className='tenant-detail__tab-card'>
          <div className='tenant-detail__users-header'>
            <CheckAccess permission={PERMISSIONS_LIST.UsersCreate}>
              <Button
                type='primary'
                icon={<IoAddCircle />}
                onClick={handleAddUser}
                loading={addingUser.value}
                className='tenant-detail__add-user-btn'
              >
                Agregar Usuario
              </Button>
            </CheckAccess>
          </div>
          <div className='tenant-detail__users-section'>
            <Table
              dataSource={users.value}
              columns={userColumns}
              rowKey='uid'
              pagination={false}
              size='middle'
              scroll={{ x: 700 }}
              loading={loading.value}
            />
          </div>
        </Card>
      ),
    },
    {
      key: 'role',
      label: 'Roles',
      children: (
        <Card className='tenant-detail__tab-card'>
          <div className='tenant-detail__users-header'>
            <CheckAccess permission={PERMISSIONS_LIST.RolesCreate}>
              <Button
                type='primary'
                icon={<IoAddCircle />}
                onClick={handleAddRole}
                loading={addingRole.value}
                className='tenant-detail__add-user-btn'
              >
                Agregar Rol
              </Button>
            </CheckAccess>
          </div>
          <div className='tenant-detail__roles-section'>
            <Table
              dataSource={paginatedRoles.value}
              rowKey='uid'
              pagination={{
                current: rolesCurrentPage.value,
                pageSize: rolesPageSize.value,
                total: rolesTotal.value,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} roles`,
                onChange: handleRolePageChange,
                onShowSizeChange: handleRolePageChange,
              }}
              size='middle'
              scroll={{ x: 700 }}
              loading={loading.value}
              columns={[
                {
                  title: 'Nombre',
                  dataIndex: 'name',
                  key: 'name',
                  width: 150,
                  fixed: 'left',
                  ellipsis: true,
                },
                {
                  title: 'Descripción',
                  dataIndex: 'description',
                  key: 'description',
                  width: 200,
                  ellipsis: true,
                  render: (description: string) =>
                    description || 'Sin descripción',
                },
                {
                  title: 'Código',
                  dataIndex: 'code',
                  key: 'code',
                  width: 120,
                  ellipsis: true,
                  render: (code: string) => code || 'N/A',
                },
                {
                  title: 'Por Defecto',
                  dataIndex: 'default',
                  key: 'default',
                  width: 100,
                  align: 'center',
                  render: (isDefault: boolean) => (
                    <Tooltip
                      title={
                        isDefault ? 'Rol por defecto' : 'No es por defecto'
                      }
                    >
                      {isDefault ? (
                        <BsStarFill size={16} color='orange' />
                      ) : (
                        <span style={{ color: '#d9d9d9' }}>-</span>
                      )}
                    </Tooltip>
                  ),
                },
                {
                  title: 'Modificable',
                  dataIndex: 'modifiable',
                  key: 'modifiable',
                  width: 100,
                  align: 'center',
                  render: (modifiable: boolean) => (
                    <Tooltip
                      title={modifiable ? 'Modificable' : 'No modificable'}
                    >
                      {modifiable ? (
                        <FaCheckCircle size={16} color='green' />
                      ) : (
                        <FaTimesCircle size={16} color='red' />
                      )}
                    </Tooltip>
                  ),
                },
                {
                  title: 'Eliminable',
                  dataIndex: 'deletable',
                  key: 'deletable',
                  width: 100,
                  align: 'center',
                  render: (deletable: boolean) => (
                    <Tooltip title={deletable ? 'Eliminable' : 'No eliminable'}>
                      {deletable ? (
                        <FaCheckCircle size={16} color='green' />
                      ) : (
                        <FaTimesCircle size={16} color='red' />
                      )}
                    </Tooltip>
                  ),
                },
                {
                  title: 'Acciones',
                  key: 'actions',
                  width: 120,
                  fixed: 'right',
                  align: 'center',
                  render: (_: any, record: IRole) => (
                    <Space size='small'>
                      {record.modifiable && (
                        <CheckAccess permission={PERMISSIONS_LIST.RolesUpdate}>
                          <Tooltip title='Editar'>
                            <Button
                              style={{ borderRadius: '50%', padding: '5px' }}
                              size='small'
                              disabled={!record.uid}
                              onClick={() =>
                                record.uid && handleEditRole(record)
                              }
                              icon={
                                <MdEditSquare
                                  size={16}
                                  color='grey'
                                  cursor='pointer'
                                />
                              }
                            />
                          </Tooltip>
                        </CheckAccess>
                      )}

                      {record.modifiable && (
                        <CheckAccess
                          permission={PERMISSIONS_LIST.RolesAssignPermissions}
                        >
                          <Tooltip title='Asignar permisos'>
                            <Button
                              style={{ borderRadius: '50%', padding: '5px' }}
                              size='small'
                              disabled={!record.uid}
                              onClick={() => handleOpenRolePermissions(record)}
                              icon={
                                <FaUserShield
                                  size={16}
                                  color='blue'
                                  cursor='pointer'
                                />
                              }
                            />
                          </Tooltip>
                        </CheckAccess>
                      )}

                      {record.deletable && (
                        <CheckAccess permission={PERMISSIONS_LIST.RolesDelete}>
                          <Tooltip title='Eliminar'>
                            <Popconfirm
                              title='¿Estás seguro de eliminar este rol?'
                              description='Esta acción no se puede deshacer.'
                              onConfirm={() =>
                                record.uid && handleDeleteRole(record.uid)
                              }
                              okText='Sí'
                              cancelText='No'
                              disabled={deletingRole.value || !record.uid}
                            >
                              <Button
                                style={{ borderRadius: '50%', padding: '5px' }}
                                size='small'
                                danger
                                loading={deletingRole.value}
                                disabled={!record.uid}
                                icon={<MdDeleteForever size={16} />}
                              />
                            </Popconfirm>
                          </Tooltip>
                        </CheckAccess>
                      )}
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        </Card>
      ),
    },
    {
      key: 'offices',
      label: 'Oficinas',
      children: (
        <Card className='tenant-detail__tab-card'>
          <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
            <Button
              type='primary'
              icon={<IoAddCircle />}
              onClick={openOfficeDrawer}
            >
              Agregar Oficina
            </Button>
            <Button
              type='primary'
              icon={<SearchOutlined />}
              onClick={() => {
                userOfficesDrawerVisible.value = true
              }}
            >
              Usuarios por Oficina
            </Button>
            <Button
              onClick={() => {
                if (officesAllMode.value) {
                  loadAllOffices()
                } else {
                  loadTenantOffices(
                    officesPage.value,
                    officesPageSize.value,
                    true
                  )
                }
              }}
              loading={officesLoading.value}
            >
              Refrescar
            </Button>
          </div>
          <Table
            dataSource={offices.value}
            rowKey='uid'
            loading={officesLoading.value}
            pagination={false}
            size='middle'
            locale={{
              emptyText: officesLoading.value ? 'Cargando...' : 'Sin oficinas',
            }}
            columns={[
              {
                title: 'Nombre',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Creación',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (val: string) =>
                  val ? new Date(val).toLocaleString() : '-',
              },
              {
                title: 'Actualización',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                render: (val: string) =>
                  val ? new Date(val).toLocaleString() : '-',
              },
              {
                title: 'UID',
                dataIndex: 'uid',
                key: 'uid',
                ellipsis: true,
              },
              {
                title: 'Acciones',
                key: 'actions',
                width: 110,
                align: 'center',
                render: (_: any, record: IOffice) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Space size='small'>
                      <Tooltip title='Editar'>
                        <Button
                          size='small'
                          type='default'
                          style={{ borderRadius: '50%', padding: 5 }}
                          onClick={() => openEditOfficeDrawer(record)}
                          icon={<EditOutlined />}
                        />
                      </Tooltip>
                      <Tooltip title='Asignar Usuario'>
                        <Button
                          size='small'
                          type='default'
                          style={{ borderRadius: '50%', padding: 5 }}
                          onClick={() => openAssignUserDrawer(record)}
                          icon={<MdBusiness size={16} />}
                        />
                      </Tooltip>
                      <Tooltip title='Remover Usuario'>
                        <Button
                          size='small'
                          type='default'
                          style={{ borderRadius: '50%', padding: 5 }}
                          onClick={() => openRemoveUserDrawer(record)}
                          icon={<MdRemoveCircleOutline size={16} />}
                        />
                      </Tooltip>
                      <Tooltip title='Eliminar'>
                        <Popconfirm
                          title='¿Eliminar oficina?'
                          description='Esta acción no se puede deshacer.'
                          okText='Sí'
                          cancelText='No'
                          onConfirm={async () => {
                            try {
                              await tenantsRequests.deleteOffice({
                                tenantUId: tenantUid!,
                                officeUId: record.uid,
                              })
                              message.success('Oficina eliminada')
                              if (officesAllMode.value) {
                                // recargar todas (modo ALL) o bootstrap si no estamos realmente en all
                                loadAllOffices(officesAllMode.value)
                              } else {
                                // si estamos en paginado recargamos página actual, y si queda vacía retrocedemos
                                const currentPage = officesPage.value
                                await loadTenantOffices(
                                  currentPage,
                                  officesPageSize.value,
                                  true
                                )
                                if (
                                  offices.value.length === 0 &&
                                  currentPage > 1
                                ) {
                                  await loadTenantOffices(
                                    currentPage - 1,
                                    officesPageSize.value,
                                    true
                                  )
                                }
                              }
                            } catch (e: any) {
                              message.error(
                                e?.response?.data?.message ||
                                  'No se pudo eliminar'
                              )
                            }
                          }}
                        >
                          <Button
                            size='small'
                            danger
                            type='default'
                            style={{ borderRadius: '50%', padding: 5 }}
                            icon={<MdDeleteForever size={16} />}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </Space>
                  </div>
                ),
              },
            ]}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <div style={{ fontSize: 12, color: '#666' }}>
              {officesAllMode.value
                ? `Mostrando todas (${offices.value.length})`
                : officesTotal.value > 0
                  ? `${(officesPage.value - 1) * officesPageSize.value + 1}-${Math.min(officesPage.value * officesPageSize.value, officesTotal.value)} de ${officesTotal.value} oficinas`
                  : 'Sin oficinas'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!officesAllMode.value && (
                <Pagination
                  size='small'
                  current={officesPage.value}
                  pageSize={officesPageSize.value}
                  total={officesTotal.value}
                  showSizeChanger={false}
                  onChange={(page) => {
                    loadTenantOffices(page, officesPageSize.value)
                  }}
                />
              )}
              <Select
                size='small'
                value={
                  officesAllMode.value ? 'ALL' : String(officesPageSize.value)
                }
                style={{ width: 110 }}
                onChange={switchPageSize}
                options={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: 'Todas', value: 'ALL' },
                ]}
              />
            </div>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <div className='tenant-detail'>
      <div className='tenant-detail__header'>
        <div className='tenant-detail__nav'>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            type='text'
            className='tenant-detail__back-btn'
          >
            Empresas
          </Button>
        </div>
      </div>

      <div className='tenant-detail__content'>
        <div className='tenant-detail__left'>
          <div className='tenant-detail__avatar'>
            <Avatar size={120} icon={<UserOutlined />} shape='square' />
          </div>
        </div>

        <div className='tenant-detail__right'>
          <div className='tenant-detail__info'>
            <div className='tenant-detail__title-section'>
              <div className='tenant-detail__name-section'>
                <h1 className='tenant-detail__name'>
                  {currentTenant.name || 'Panacambios'}
                </h1>
                <Tag
                  color={getTenantStatusConfig(currentTenant?.status).color}
                  className='tenant-detail__status-tag'
                >
                  {getTenantStatusConfig(currentTenant?.status).text}
                </Tag>
              </div>
              <div className='tenant-detail__status'>
                <CheckAccess permission={PERMISSIONS_LIST.TenantsUpdate}>
                  <Button
                    type='primary'
                    size='small'
                    icon={<EditOutlined />}
                    onClick={handleRefresh}
                  >
                    Actualizar
                  </Button>
                </CheckAccess>
              </div>
            </div>

            <div className='tenant-detail__stats'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span className='tenant-detail__user-count'>
                  {activeUsersCount.value}
                </span>
                <span className='tenant-detail__user-label'>
                  Usuarios activos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='tenant-detail__tabs-section'>
        <Tabs
          items={tabItems}
          defaultActiveKey='usuarios'
          className='tenant-detail__tabs'
          onChange={handleTabChange}
        />
      </div>

      {/* Tenant Form Drawer */}
      <TenantsFormDrawer />

      {/* Add User Drawer */}
      <UserDrawer
        visible={userDrawerVisible.value}
        onClose={handleCloseUserDrawer}
        onSubmit={handleSubmitAddUser}
        loading={addingUser.value}
        tenantRoles={roles.value}
      />

      {/* Edit User Drawer */}
      <UserDrawer
        visible={editUserDrawerVisible.value}
        onClose={handleCloseEditUserDrawer}
        onSubmit={handleSubmitAddUser}
        loading={loading.value}
        editMode={true}
        user={selectedUserForEdit.value}
        tenantUid={tenantUid}
        tenantRoles={roles.value}
        onEdit={handleSubmitEditUser}
      />

      {/* Add Role Drawer */}
      <RoleDrawer
        visible={roleDrawerVisible.value}
        onClose={handleCloseRoleDrawer}
        onSubmit={handleSubmitAddRole}
        loading={addingRole.value}
      />

      {/* Edit Role Drawer */}
      <RoleDrawer
        visible={editRoleDrawerVisible.value}
        onClose={handleCloseEditRoleDrawer}
        onSubmit={handleSubmitAddRole}
        onUpdate={handleSubmitEditRole}
        loading={updatingRole.value}
        role={selectedRoleForEdit.value}
        editMode={true}
      />

      {/* Role Permissions Drawer */}
      <TenantRolePermissionsDrawer
        visible={rolePermissionsDrawerVisible.value}
        onClose={handleCloseRolePermissions}
        tenantUid={tenantUid}
        role={selectedRoleForPermissions.value}
        onAssignPermissions={handleAssignPermissions}
      />

      {/* Office Drawer */}
      {tenantUid && (
        <OfficeDrawer
          visible={officeDrawerVisible.value}
          onClose={closeOfficeDrawer}
          tenantUId={tenantUid}
          editMode={editingOffice.value}
          office={selectedOfficeForEdit.value || undefined}
          onCreated={(office) => {
            // eslint-disable-next-line no-console
            console.log('Oficina creada:', office)
            if (officesAllMode.value) {
              loadAllOffices(true)
            } else {
              loadAllOffices(false).then(() => {
                loadTenantOffices(1, officesPageSize.value, true)
              })
            }
          }}
          onUpdated={(office) => {
            // eslint-disable-next-line no-console
            console.log('Oficina actualizada callback', office)
            if (officesAllMode.value) {
              loadAllOffices(true)
            } else {
              loadTenantOffices(officesPage.value, officesPageSize.value, true)
            }
          }}
        />
      )}
      {/* Assign User to Office Drawer */}
      {tenantUid && (
        <OfficeAssignUserDrawer
          visible={assignUserDrawerVisible.value}
          onClose={closeAssignUserDrawer}
          tenantUId={tenantUid}
          tenantName={currentTenant?.name}
          office={selectedOfficeForAssign.value}
          users={users.value}
          mode={assignMode.value}
          onAssigned={({ userUId, officeUId }) => {
            // eslint-disable-next-line no-console
            console.log('[Asignación usuario->oficina]', { userUId, officeUId })
          }}
          onRemoved={({ userUId, officeUId }) => {
            // eslint-disable-next-line no-console
            console.log('[Remoción usuario->oficina]', { userUId, officeUId })
          }}
        />
      )}
      {tenantUid && (
        <UserOfficesDrawer
          visible={userOfficesDrawerVisible.value}
          onClose={() => {
            userOfficesDrawerVisible.value = false
          }}
          tenantUId={tenantUid}
          users={users.value}
        />
      )}

      {/* Manage Tenant User Offices Drawer */}
      <ManageTenantUserOfficesDrawer
        visible={manageTenantUserOfficesDrawerVisible.value}
        onClose={() => {
          manageTenantUserOfficesDrawerVisible.value = false
          selectedUserForOfficeAssign.value = null
        }}
        user={
          selectedUserForOfficeAssign.value &&
          selectedUserForOfficeAssign.value.uid
            ? {
                uid: selectedUserForOfficeAssign.value.uid,
                firstName: selectedUserForOfficeAssign.value.firstName,
                firstSurname: selectedUserForOfficeAssign.value.firstSurname,
                email: selectedUserForOfficeAssign.value.email,
              }
            : undefined
        }
        tenantUid={tenantUid!}
      />
    </div>
  )
}

export default TenantDetailPage
