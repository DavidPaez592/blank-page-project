import React from 'react'
import { Button, Popconfirm, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined, BankOutlined } from '@ant-design/icons'
import axiosInstance from '@/axios'


const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const OfficeTableActions = ({
  office,
  onEdit,
  onDeleted
}: {
  office: any
  onEdit: (office: any) => void
  onDeleted: () => void
}) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/offices', {
        headers: getTenantHeaders(),
        data: { officeUId: office.uid },
      })
      message.success('Oficina eliminada correctamente')
      onDeleted()
    } catch (err) {
      message.error('Error al eliminar la oficina')
    }
  }

  return (
    <Space>
      <Button
        icon={<EditOutlined />}
        size='small'
        onClick={() => onEdit(office)}
      />
      <Popconfirm
        title='¿Seguro que deseas eliminar esta oficina?'
        onConfirm={handleDelete}
        okText='Sí'
        cancelText='No'
      >
        <Button icon={<DeleteOutlined />} size='small' danger />
      </Popconfirm>
    </Space>
  )
}

export default OfficeTableActions
