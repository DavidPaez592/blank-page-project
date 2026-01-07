import React, { useState } from 'react'
import { Button, Drawer, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CashBoxTypeTable from './table'
import CashBoxTypeForm from './drawer/form'

const CashBoxesTypePage = () => {
  const [open, setOpen] = useState(false)
  const [selectedBoxesType, setSelectedBoxesType] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const handleRefresh = () => setRefresh((r) => r + 1)

  return (
    <div className='boxes-container'>
      <Typography.Title level={2}>Tipo de Cajas</Typography.Title>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Nueva Tipo Caja
      </Button>
      <CashBoxTypeTable
        onEdit={(boxes: any) => {
          setSelectedBoxesType(boxes)
          setOpen(true)
        }}
        refresh={refresh}
      />
      <Drawer
        title={selectedBoxesType ? 'Editar Tipo Caja' : 'Crear Tipo Caja'}
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedBoxesType(null)
        }}
        destroyOnClose
        width={400}
      >
        <CashBoxTypeForm
          data={selectedBoxesType}
          onCreated={() => {
            setOpen(false)
            setSelectedBoxesType(null)
            handleRefresh()
          }}
        />
      </Drawer>
    </div>
  )
}

export default CashBoxesTypePage
