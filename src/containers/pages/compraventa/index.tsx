import { useState } from 'react'
import { Typography, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { OperationCard, OperationTab } from './components'
import { CompraModule } from './compra'
import { VentaModule } from './venta'
import './index.scss'

const { Title, Text } = Typography

type ActiveTab = 'compra' | 'venta' | null

export const CompraVentaPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)

  const handleCardClick = (type: 'compra' | 'venta') => {
    setActiveTab(type)
  }

  const handleTabClick = (type: 'compra' | 'venta') => {
    setActiveTab(type)
  }

  const handleBack = () => {
    setActiveTab(null)
  }

  // Vista inicial con cards
  if (!activeTab) {
    return (
      <div className="compraventa">
        <Title level={2} className="compraventa__title">Compra y Venta de Divisas</Title>
        <Text className="compraventa__subtitle">Selecciona una operación para comenzar</Text>
        <div className="compraventa__cards">
          <OperationCard type="compra" onClick={() => handleCardClick('compra')} />
          <OperationCard type="venta" onClick={() => handleCardClick('venta')} />
        </div>
      </div>
    )
  }

  return (
    <div className="compraventa compraventa--expanded">
      {/* Tabs */}
      <div className="compraventa__browser-tabs">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          className="compraventa__back-btn"
          onClick={handleBack}
        >
          Volver
        </Button>
        <OperationTab
          type="compra"
          isActive={activeTab === 'compra'}
          onClick={() => handleTabClick('compra')}
        />
        <OperationTab
          type="venta"
          isActive={activeTab === 'venta'}
          onClick={() => handleTabClick('venta')}
        />
      </div>

      <div className="compraventa__content">
        {activeTab === 'compra' && <CompraModule />}
        {activeTab === 'venta' && <VentaModule />}
      </div>
    </div>
  )
}

export default CompraVentaPage
