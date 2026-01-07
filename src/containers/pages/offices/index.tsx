import React, { useState } from 'react'
import { Button, Drawer, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import OfficesTable from './table'
import OfficeForm from './drawer/form'

const OfficesPage = () => {
  const [open, setOpen] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const handleRefresh = () => setRefresh((r) => r + 1)

  return (
    <div className='offices-container'>
      <Typography.Title level={2}>Oficinas</Typography.Title>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Nueva oficina
      </Button>
      <OfficesTable
        onEdit={(office: any) => {
          setSelectedOffice(office)
          setOpen(true)
        }}
        refresh={refresh}
      />
      <Drawer
        title={selectedOffice ? 'Editar Oficina' : 'Crear Oficina'}
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedOffice(null)
        }}
        destroyOnClose
        width={400}
      >
        <OfficeForm
          office={selectedOffice}
          onCreated={() => {
            setOpen(false)
            setSelectedOffice(null)
            handleRefresh()
          }}
        />
      </Drawer>
    </div>
  )
}

export default OfficesPage
