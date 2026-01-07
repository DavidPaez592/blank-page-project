import { useState } from 'react'
import { Drawer, Form, Select, Table, FloatButton, message } from 'antd'
import { MdListAlt } from 'react-icons/md'
import tenantsRequests from '@/state/tenants/requests'
import { IUser } from '@/interfaces'

interface IUserOfficesDrawerProps {
  visible: boolean
  onClose: () => void
  tenantUId: string
  users: IUser[]
}

const UserOfficesDrawer = ({
  visible,
  onClose,
  tenantUId,
  users,
}: IUserOfficesDrawerProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [offices, setOffices] = useState<
    { uid: string; name: string; assignedAt?: string }[]
  >([])
  const [total, setTotal] = useState(0)

  const userOptions = users.map((u) => ({
    label:
      `${u.firstName || ''} ${u.firstSurname || ''}`.trim() || u.email || u.uid,
    value: u.uid!,
  }))

  const fetchOffices = async () => {
    try {
      const userUId = form.getFieldValue('userUId')
      if (!userUId) return
      setLoading(true)
      const { data } = await tenantsRequests.listUserOffices({
        tenantUId,
        userUId,
      })
      // data puede ser:
      // 1) array plano -> [ { uid, name, assignedAt } ]
      // 2) objeto { data: [ ... ] }
      // 3) objeto { data: { offices: [...], total } }
      // 4) objeto { offices: [...], total }
      let officesParsed: any[] = []
      let totalParsed = 0
      if (Array.isArray(data)) {
        officesParsed = data
        totalParsed = data.length
      } else if (Array.isArray(data?.data)) {
        officesParsed = data.data
        totalParsed = officesParsed.length
      } else if (Array.isArray(data?.data?.offices)) {
        officesParsed = data.data.offices
        totalParsed = data.data.total ?? officesParsed.length
      } else if (Array.isArray((data as any)?.offices)) {
        officesParsed = (data as any).offices
        totalParsed = (data as any).total ?? officesParsed.length
      }
      setOffices(officesParsed)
      setTotal(totalParsed)
      // eslint-disable-next-line no-console
      console.log('[User offices list]', {
        offices: officesParsed,
        total: totalParsed,
        raw: data,
      })
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Error obteniendo oficinas del usuario', e)
      message.error(
        e?.response?.data?.message || 'No se pudieron cargar las oficinas'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    form
      .validateFields()
      .then(fetchOffices)
      .catch(() => {})
  }

  const handleClose = () => {
    form.resetFields()
    setOffices([])
    setTotal(0)
    onClose()
  }

  return visible ? (
    <Drawer
      title='Oficinas asignadas a Usuario'
      width={520}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      maskClosable={false}
      
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='userUId'
          label='Usuario'
          rules={[{ required: true, message: 'Selecciona un usuario' }]}
        >
          <Select
            placeholder='Selecciona un usuario'
            options={userOptions}
            showSearch
            optionFilterProp='label'
            onChange={() => {
              // auto-fetch al cambiar usuario
              fetchOffices()
            }}
          />
        </Form.Item>
      </Form>
      <Table
        dataSource={offices}
        size='small'
        rowKey='uid'
        loading={loading}
        pagination={false}
        locale={{
          emptyText: loading ? 'Cargando...' : 'Sin oficinas asignadas',
        }}
        columns={[
          { title: 'Nombre', dataIndex: 'name', key: 'name' },
          { title: 'UID', dataIndex: 'uid', key: 'uid', ellipsis: true },
          {
            title: 'Asignada',
            dataIndex: 'assignedAt',
            key: 'assignedAt',
            render: (v: string) => (v ? new Date(v).toLocaleString() : '-'),
          },
        ]}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        Total: {total}
      </div>
    </Drawer>
  ) : null
}

export default UserOfficesDrawer
