import React, { useEffect, useState } from 'react'
import {
  Drawer,
  Form,
  Button,
  Select,
  Typography,
  Space,
  Spin,
  Table,
  Tabs,
  Card,
  Tag,
  Popconfirm,
} from 'antd'
import { MdHomeWork } from 'react-icons/md'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useUserOffices } from '@/hooks/useUserOffices'
import type { IUser } from '@/interfaces'

interface ManageUserOfficesDrawerProps {
  visible: boolean
  onClose: () => void
  user?: IUser
}

const ManageUserOfficesDrawer: React.FC<ManageUserOfficesDrawerProps> = ({
  visible,
  onClose,
  user,
}) => {
  const {
    currentUser,
    assignedOffices,
    availableOffices,
    loading,
    openManageOfficesDrawer,
    closeManageOfficesDrawer,
    assignOfficeToUser,
    removeOfficeFromUser,
  } = useUserOffices()

  const [selectedOffice, setSelectedOffice] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState('assigned')
  const [operationLoading, setOperationLoading] = useState(false)

  useEffect(() => {
    if (visible && user) {
      openManageOfficesDrawer(user)
      setSelectedOffice(undefined)
      setActiveTab('assigned')
    } else if (!visible) {
      closeManageOfficesDrawer()
    }
  }, [visible, user])

  const handleAssign = async () => {
    if (!selectedOffice) return
    setOperationLoading(true)
    try {
      await assignOfficeToUser(selectedOffice)
      setSelectedOffice(undefined)
    } catch (error) {
      console.error('Error assigning office:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleRemove = async (officeUid: string) => {
    setOperationLoading(true)
    try {
      await removeOfficeFromUser(officeUid)
    } catch (error) {
      console.error('Error removing office:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const userLabel =
    `${currentUser?.firstName || ''} ${currentUser?.firstSurname || ''}`.trim() ||
    currentUser?.email ||
    currentUser?.uid ||
    '-'

  // Filtrar oficinas que ya están asignadas
  const filteredAvailableOffices = availableOffices.filter(
    (office: any) =>
      !assignedOffices.some((assigned: any) => assigned.uid === office.uid)
  )

  const tabItems = [
    {
      key: 'assigned',
      label: `Oficinas Asignadas (${assignedOffices.length})`,
      children: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text type='secondary'>Usuario: </Typography.Text>
            <Typography.Text strong>{userLabel}</Typography.Text>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin size='large' />
            </div>
          ) : (
            <Table
              size='small'
              rowKey='uid'
              dataSource={assignedOffices}
              pagination={false}
              locale={{ emptyText: 'Sin oficinas asignadas' }}
              columns={[
                {
                  title: 'Oficina',
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
                  title: 'Fecha de Asignación',
                  dataIndex: 'assignedAt',
                  key: 'assignedAt',
                  width: 180,
                  render: (date: string) =>
                    date ? (
                      <Tag color='blue'>
                        {new Date(date).toLocaleDateString()}
                      </Tag>
                    ) : (
                      '-'
                    ),
                },
                {
                  title: 'Acciones',
                  key: 'actions',
                  width: 80,
                  render: (_, record: any) => (
                    <CheckAccess
                      permission={[PERMISSIONS_LIST.UserOfficeUsersRemove]}
                    >
                      <Popconfirm
                        title='¿Remover esta oficina?'
                        description='Esta acción no se puede deshacer'
                        onConfirm={() => handleRemove(record.uid)}
                        okText='Sí, remover'
                        cancelText='Cancelar'
                      >
                        <Button
                          danger
                          size='small'
                          icon={<DeleteOutlined />}
                          loading={operationLoading}
                          disabled={loading || operationLoading}
                        />
                      </Popconfirm>
                    </CheckAccess>
                  ),
                },
              ]}
              scroll={{ y: 300 }}
            />
          )}
        </Card>
      ),
    },
    {
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
              <Form.Item label='Seleccionar Oficina para Asignar'>
                {loading ? (
                  <Spin size='small' />
                ) : (
                  <Select
                    showSearch
                    placeholder='Selecciona una oficina'
                    optionFilterProp='label'
                    value={selectedOffice}
                    onChange={(val) => setSelectedOffice(val)}
                    options={filteredAvailableOffices.map((o: any) => ({
                      label: o.name,
                      value: o.uid,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    notFoundContent={
                      filteredAvailableOffices.length === 0
                        ? 'Todas las oficinas están asignadas'
                        : 'No se encontraron oficinas'
                    }
                  />
                )}
              </Form.Item>
              <Form.Item>
                <CheckAccess permission={[PERMISSIONS_LIST.UserOfficeUsersAdd]}>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    disabled={!currentUser?.uid || !selectedOffice}
                    loading={operationLoading}
                    onClick={handleAssign}
                    block
                    size='large'
                  >
                    Asignar Oficina
                  </Button>
                </CheckAccess>
              </Form.Item>
            </Form>
            {filteredAvailableOffices.length === 0 &&
              availableOffices.length > 0 && (
                <Typography.Text
                  type='secondary'
                  style={{ textAlign: 'center', display: 'block' }}
                >
                  El usuario ya tiene todas las oficinas disponibles asignadas
                </Typography.Text>
              )}
          </Space>
        </Card>
      ),
    },
  ]

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      title={
        <Space>
          <MdHomeWork size={20} />
          Gestionar Oficinas del Usuario ....
        </Space>
      }
      width={600}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size='large'
      />
    </Drawer>
  )
}

export default ManageUserOfficesDrawer
