import React from 'react'
import { Button, Popconfirm, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axiosInstance from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json', } : {}
}

const CashBoxesTableActions = ({
  cashbox,
  onEdit,
  onDeleted,
}: {
  cashbox: any
  onEdit: (cashbox: any) => void
  onDeleted: () => void
}) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/v1/cashboxes', {
        headers: getTenantHeaders(),
        data: { uid: cashbox.uid },
      }).then((res: any) => {
        if (res?.success === false) {
          throw new Error('Error al eliminar la caja');
        }
      }).catch((error: any) => {});
      message.success('Caja eliminado correctamente')
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
        onClick={() => onEdit(cashbox)}
      />
      <Popconfirm
        title='¿Seguro que deseas eliminar esta caja?'
        onConfirm={handleDelete}
        okText='Sí'
        cancelText='No'
      >
        <Button icon={<DeleteOutlined />} size='small' danger />
      </Popconfirm>
    </Space>
  )
}

export default CashBoxesTableActions
