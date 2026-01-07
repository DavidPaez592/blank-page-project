import React, { useState } from 'react'
import { Button, Drawer, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CashBoxTypeTable from './table'
import CashBoxTypeForm from './drawer/form'

const CashBoxesPage = () => {
  const [open, setOpen] = useState(false)
  const [selectedBoxes, setSelectedBoxes] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const handleRefresh = () => setRefresh((r) => r + 1)

  return (
    <div className='boxes-container'>
      <Typography.Title level={2}>Cajas</Typography.Title>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Nueva Caja
      </Button>
      <CashBoxTypeTable
        onEdit={(boxes: any) => {
          setSelectedBoxes(boxes)
          setOpen(true)
        }}
        refresh={refresh}
      />
      <Drawer
        title={selectedBoxes ? 'Editar Caja...' : 'Crear Caja'}
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedBoxes(null)
        }}
        destroyOnClose
        width={400}
      >
        <CashBoxTypeForm
          data={selectedBoxes}
          onCreated={() => {
            setOpen(false)
            setSelectedBoxes(null)
            handleRefresh()
          }}
        />
      </Drawer>
    </div>
  )
}

export default CashBoxesPage
