import React, { useEffect, useState } from 'react'
import { useComputed } from '@preact/signals-react'
import {
  Drawer,
  Form,
  Button,
  Select,
  Typography,
  message,
  Space,
  Spin,
  Table,
  Tabs,
  Card,
  Row,
  Col,
  Input,
  Popconfirm,
  
} from 'antd'
import { MdHomeWork } from 'react-icons/md'
import { DeleteOutlined, PlusOutlined, } from '@ant-design/icons'
import { BsFloppyFill  } from "react-icons/bs";
import { UsersState } from '@/state'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import tenantsRequests from '@/state/tenants/requests'
import { EditOutlined, PlusSquareOutlined, } from '@ant-design/icons'
import axiosInstance from '@/axios';
const { Item: FormItem } = Form

const { Title, Text } = Typography

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json' } : {}
}

export interface ITenantUserOfficesUser {
  uid?: string
  firstName?: string
  firstSurname?: string
  email?: string
}

interface ITenantOffice {
  uid: string
  name: string
  code?: string
}

interface ITenantUserAssignedOffice {
  uid: string
  name: string
  code?: string
  assignedAt?: string
}

interface ManageTenantUserOfficesDrawerProps {
  visible: boolean
  onClose: () => void
  user?: ITenantUserOfficesUser
  tenantUid: string
}

interface ICashBoxes {
  uid: string;
  name: string;
}

const ManageTenantUserOfficesDrawer: React.FC<
  ManageTenantUserOfficesDrawerProps
> = ({ visible, onClose, user, tenantUid }) => {
  const [userUID, setUserUID] = useState<string | null>(user?.uid ?? null)
  const [loadingOffices, setLoadingOffices] = useState(false)
  const [loadingAssigned, setLoadingAssigned] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [offices, setOffices] = useState<ITenantOffice[]>([])
  const [assignedOffices, setAssignedOffices] = useState<
    ITenantUserAssignedOffice[]
  >([])
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>()
  const [selectedCashBox, setSelectCashBoxes] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState('assigned')
  
  const [loading, setLoading] = useState(false)
  const [cashboxes, setCashBoxes] = useState<ICashBoxes[]>([])
  const [cashboxesuser, setCashBoxesUser] = useState<ICashBoxes[]>([])

  const [form] = Form.useForm()
  const { Option } = Select

  const loadAllTenantOffices = async () => {
    //if (!tenantUid) return
    setLoadingOffices(true)
    setOffices([])
    try {
      const { data } = await tenantsRequests.listAllOffices({
        tenantUId: tenantUid
      })
      let list: any[] = []
      if (Array.isArray(data)) {
        list = data
      } else if (Array.isArray((data as any)?.data)) {
        list = (data as any).data
      } else if (Array.isArray((data as any)?.offices)) {
        list = (data as any).offices
      }

      setOffices(
        list.map((o) => ({
          uid: o.uid,
          name: o.name,
        }))
      )
    } catch (e: any) {
      message.error(
        e?.response?.data?.message ||
          'No se pudieron cargar oficinas del tenant'
      )
    } finally {
      setLoadingOffices(false)
      setCashBoxes([])
    }
  }

  const loadAssignedTenantOffices = async () => {
    if (!user?.uid) return
    setLoadingAssigned(true)
    try {
      const { data } = await tenantsRequests.listUserOffices({
        tenantUId: tenantUid,
        userUId: user?.uid
      })
      let arr: any[] = []
      if (Array.isArray((data as any)?.data)) {
        arr = (data as any).data
      } else if (Array.isArray(data)) {
        arr = data
      } else if (Array.isArray((data as any)?.offices)) {
        arr = (data as any).offices
      }
      setAssignedOffices(
        arr.map((o) => ({
          uid: o.uid,
          name: o.name,
          code: o.code,
          assignedAt: o.assignedAt,
        }))
      )
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || 'No se pudieron cargar oficinas asignadas'
      )
    } finally {
      setLoadingAssigned(false)
    }
  }

  useEffect(() => {
    
    setActiveTab('assign')
    //setUserUID(user?.uid ?? null)
    loadAllTenantOffices()
    handleCashBoxesUser(user?.uid ?? '')

    if (visible && tenantUid) {          
      loadAssignedTenantOffices()
      setSelectedOffice(undefined)
    }
    
  }, [user?.uid, visible, tenantUid])

  const handleAssign = async () => {
    if (!selectedOffice || user?.uid == null) return
    setAssigning(true)
    try {
      await tenantsRequests.assignTenantOfficeToUser({
        tenantUId: tenantUid,
        userUId: user?.uid,
        officeUId: selectedOffice,
      })
      message.success('Oficina asignada exitosamente')
      setSelectedOffice(undefined)
      // Recargar oficinas asignadas
      await loadAssignedTenantOffices()
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'No se pudo asignar')
    } finally {
      setAssigning(false)
    }
  }

  const handleRemove = async (cashBoxUId: string) => {
    if (!user?.uid) return
    setRemoving(cashBoxUId)
    try {
      await tenantsRequests.removeCashBoxUser({
        uid: user?.uid,
        cashboxUId: cashBoxUId,
      }).then(() => {
        handleCashBoxesUser(user?.uid ?? '')
      }).catch((error) => {
        throw new Error(`Error eliminando la caja al usuario actual: ${error.message}`);
      })
      message.success('Oficina removida exitosamente')
      // Recargar las cajas asignadas
      await loadAssignedTenantOffices()
    } catch (e: any) {
      message.error(e?.response?.data?.message || ' No se pudo remover')
    } finally {
      setRemoving(null)
    }
  }

  const handleAddCashBoxes = async (officeUId: string) => {
    // Cambiar a la pestaña de asignación
    //console.log(`UserUID: ${userUID} - OfficeUID: ${officeUId}`);
    
    setCashBoxes([]); //Limpia el estado de cashboxes antes de cargar nuevos

    await axiosInstance.get(
      `/v1/cashboxes/all?officeUId=${officeUId}`,
      { headers: getTenantHeaders() },
    ).then((res: any) => {
      const cashboxesData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || []
      
      //console.log(`📌 Cajas cargadas para la oficina ${officeUId}: ${cashboxesData.length}`);
      setCashBoxes(cashboxesData);
    }).catch((error: any) => {
      message.error('Error cargando cajas para la oficina seleccionada');
    });
    
    //setActiveTab('assign')
    //Seleccionar la oficina
    //setSelectedOffice(officeUId)
  }

  const handleCashBoxesUser = async (userUId: string) => {
    // Cambiar a la pestaña de asignación
    setCashBoxesUser([]); //Limpia el estado de cashboxes antes de cargar nuevos

    if (userUId === '') return

    await axiosInstance.post(
      `/v1/users/cashboxes/list`,
      { uid:userUId },
      { headers: getTenantHeaders() },
    ).then((res: any) => {
      const cashboxesData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || []
      
      //console.log(`📌 Cajas cargadas para el usuario ${userUId}: ${cashboxesData.length}`);
      setCashBoxesUser(cashboxesData);
    }).catch((error: any) => {
      message.error('Error cargando cajas para la empresa seleccionada');
    });
    
    //setActiveTab('assign')
    //Seleccionar la oficina
    //setSelectedOffice(officeUId)
  }

  const handleFinish = async (values: any) => {
    if (!user?.uid) return
    setLoading(true)
    try {      
      // POST para crear
      //console.log('Creando caja con datos: ', { cashboxUId: selectedCashBox, uid: userUID });
      const response = await axiosInstance.post(
        '/v1/users/cashboxes/add',
        { uid: user?.uid, cashboxUId: selectedCashBox},
        { headers: getTenantHeaders() }
     
      ).then((res: any) => {
        console.log(`response: ${JSON.stringify(res)}`)
        if (res?.success === false) {
          throw new Error('Error al asignar la caja al usuario actual');
        } else {
          handleCashBoxesUser(user?.uid ?? '')
        }
      }).catch((error: any) => {
        throw new Error(`Error al asignar la caja al usuario actual: ${error.message}`);
      });
      setActiveTab('assigned')
      message.success('Caja asignada correctamente')
    } catch (err) {
      message.error(`${err}`)
    } finally {
      setLoading(false)
      setCashBoxes([])
      setSelectCashBoxes(undefined)
    }
  }

  const userLabel =
    `${user?.firstName || ''} ${user?.firstSurname || ''}`.trim() ||
    user?.email ||
    user?.uid ||
    '-'

  // Filtrar oficinas que ya están asignadas
  const availableOffices = offices.filter(
    (office) => !assignedOffices.some((assigned) => assigned.uid === office.uid)
  )

  const tabItems = [
    {
      key: 'assigned',
      label: `Cajas Asignadas (${cashboxesuser.length})`,
      children: (
        <Form layout='vertical'>
          <Form.Item label='Cajas Asignadas'>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Typography.Text type='secondary'>Usuario: </Typography.Text>
                <Typography.Text strong>{userLabel}</Typography.Text>
              </div>
              {loadingAssigned ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Spin size='large' />
                </div>
              ) : (
                <Table
                  size='small'
                  rowKey='uid'
                  dataSource={cashboxesuser}
                  pagination={false}
                  locale={{ emptyText: 'Sin cajas asignadas' }}
                  columns={[
                    {
                      title: 'Caja',
                      dataIndex: 'name',
                      key: 'name',
                      render: (name: string) => (
                        <Space>
                          <MdHomeWork size={16} color='#1890ff' />
                          {name}
                        </Space>
                      ),
                    },
                    {
                      title: 'Oficina',
                      dataIndex: 'nameoffice',
                      key: 'nameoffice',
                      render: (nameoffice: string) => (
                        <Space>
                          <MdHomeWork size={16} color='#1890ff' />
                          {nameoffice}
                        </Space>
                      ),
                    },
                    {
                      title: 'Acciones',
                      key: 'actions',
                      width: 80,
                      render: (_, record: any) => (
                          <Space> {/*<CheckAccess permission={[PERMISSIONS_LIST.UserOfficeUsersRemove]}>*/}
                            <Popconfirm
                              title='¿Remover esta caja?'
                              description='Esta acción no se puede deshacer'
                              onConfirm={() => handleRemove(record.uid)}
                              okText='Sí, remover'
                              cancelText='Cancelar'
                            >
                              <Button
                                danger
                                size='small'
                                icon={<DeleteOutlined />}
                                loading={removing === record.uid}
                                disabled={!!removing}
                              />
                            </Popconfirm>
                          </Space>                                                  
                      ),
                    },
                  ]}
                  scroll={{ y: 300 }}
                />
              )}
            </Card>
          </Form.Item>
        </Form>
      ),
    },
  ]

  const assignTabItem = {
    key: 'assign',
    label: 'Asignar Nueva',
    children: (
      <Card>
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          <div>
            <Typography.Text type='secondary'>Usuario: </Typography.Text>
            <Typography.Text strong>{userLabel}</Typography.Text>
          </div>
          <Form layout='vertical'>
            <Form.Item label='Seleccionar una Oficina'>
              {loadingOffices ? (
                <Spin size='small' />
              ) : (
                <Select
                  showSearch
                  placeholder='Selecciona una oficina'
                  optionFilterProp='label'
                  value={selectedOffice}
                  onChange={(val) => {
                    setCashBoxes([])
                    setSelectCashBoxes(undefined)
                    setSelectedOffice(val)                    
                    handleAddCashBoxes(val)
                  }}
                  options={assignedOffices.map((o) => ({
                    label: `${o.name}${o.code ? ` (${o.code})` : ''}`,
                    value: o.uid,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  notFoundContent={
                    offices.length === 0
                      ? 'Todas las oficinas están asignadas'
                      : 'No se encontraron oficinas'
                  }
                />
              )}
            </Form.Item>
            <Form.Item label='Seleccionar una caja para Asignar'>
              {loadingOffices ? (
                <Spin size='small' />
              ) : (
                <Select
                  showSearch
                  placeholder='Selecciona una caja'
                  optionFilterProp='label'
                  value={selectedCashBox}
                  onChange={(val) => {
                    setSelectCashBoxes(val)
                  }}
                  options={cashboxes.map((o) => ({
                    label: `${o.name}`,
                    value: o.uid,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  notFoundContent={
                    cashboxes.length === 0
                      ? 'Todas las cajas están asignadas'
                      : 'No se encontraron cajas'
                  }
                />
              )}
            </Form.Item>
            <Form.Item>
              {/*<CheckAccess permission={[PERMISSIONS_LIST.UserOfficeUsersAdd]}>*/}
                <Button
                  type='primary'
                  icon={<BsFloppyFill />}
                  disabled={!user?.uid || !selectedOffice || !selectedCashBox}
                  loading={assigning}
                  onClick={handleFinish}
                  block
                  size='large'
                >
                  Asignar Cajas
                </Button>
              {/*</CheckAccess>*/}
            </Form.Item>
          </Form>          
        </Space>
      </Card>
    ),
  }

  const getTabItems = () => {
    return [tabItems[0], assignTabItem]
  }

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      title={
        <Space>
          <MdHomeWork size={20} />
          Gestionar Cajas del Usuario
        </Space>
      }
      width={600}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={getTabItems()}
        size='large'
      />
    </Drawer>
  )
}

export default ManageTenantUserOfficesDrawer
