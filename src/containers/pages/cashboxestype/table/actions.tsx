import React from 'react'
import { Button, Popconfirm, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axiosInstance from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json', } : {}
}

const CashBoxTypeTableActions = ({
  cashboxtype,
  onEdit,
  onDeleted,
}: {
  cashboxtype: any
  onEdit: (cashboxtype: any) => void
  onDeleted: () => void
}) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/v1/cashbox-types', {
        headers: getTenantHeaders(),
        data: { uid: cashboxtype.uid },
      }).then((res: any) => {
        if (res?.success === false) {
          throw new Error('Error al eliminar el tipo de caja');
        }
      }).catch((error: any) => {});
      message.success('Tipo de caja eliminado correctamente')
      onDeleted()
    } catch (err) {
      message.error(`${err}`)
    }
  }

  return (
    <Space>
      <Button
        icon={<EditOutlined />}
        size='small'
        onClick={() => onEdit(cashboxtype)}
      />
      <Popconfirm
        title='¿Seguro que deseas eliminar este tipo de caja?'
        onConfirm={handleDelete}
        okText='Sí'
        cancelText='No'
      >
        <Button icon={<DeleteOutlined />} size='small' danger />
      </Popconfirm>
    </Space>
  )
}

export default CashBoxTypeTableActions
