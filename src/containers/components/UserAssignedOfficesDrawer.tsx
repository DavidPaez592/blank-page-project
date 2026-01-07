import React, { useEffect, useState } from 'react'
import { Drawer, Form, Input, Table, Typography, message, Space, Spin } from 'antd'
import tenantsRequests from '@/state/tenants/requests'

interface IUserBasic {
  uid?: string
  firstName?: string
  firstSurname?: string
  email?: string
}

interface IUserAssignedOffice {
  uid: string
  name: string
  assignedAt?: string
}

interface UserAssignedOfficesDrawerProps {
  visible: boolean
  onClose: () => void
  user?: IUserBasic
}

const UserAssignedOfficesDrawer: React.FC<UserAssignedOfficesDrawerProps> = ({
  visible,
  onClose,
  user,
}) => {
  const [loading, setLoading] = useState(false)
  const [offices, setOffices] = useState<IUserAssignedOffice[]>([])

  const load = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const { data } = await tenantsRequests.listUserOfficesGlobal({ uid: user.uid })
      // Respuesta real: { statusCode, success, message, data: [ { uid, name, assignedAt } ] }
      let arr: any[] = []
      if (Array.isArray((data as any)?.data)) arr = (data as any).data
      else if (Array.isArray(data)) arr = data
      setOffices(
        arr.map((o) => ({
          uid: o.uid,
          name: o.name,
          assignedAt: o.assignedAt,
        }))
      )
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'No se pudieron cargar oficinas asignadas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      load()
    } else {
      setOffices([])
    }
  }, [visible, user?.uid])

  const userLabel = `${user?.firstName || ''} ${user?.firstSurname || ''}`.trim() || user?.email || user?.uid || '-'

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      title='Oficinas asignadas al Usuario'
      width={520}
      destroyOnClose
    >
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <Form layout='vertical'>
          <Form.Item label='Usuario'>
            <Input value={userLabel} disabled />
          </Form.Item>
        </Form>
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin />
            </div>
          ) : (
              <Table
                size='small'
                rowKey='uid'
                dataSource={offices}
                pagination={false}
                locale={{ emptyText: 'Sin oficinas asignadas' }}
                columns={[
                  { title: 'Nombre', dataIndex: 'name', key: 'name' },
                  { title: 'Asignada', dataIndex: 'assignedAt', key: 'assignedAt', width: 180, render: (v: string) => v ? new Date(v).toLocaleString() : '-' },
                ]}
                scroll={{ y: 280 }}
              />
          )}
          <Typography.Paragraph style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            Total: {offices.length}
          </Typography.Paragraph>
        </div>
      </Space>
    </Drawer>
  )
}

export default UserAssignedOfficesDrawer
