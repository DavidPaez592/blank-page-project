import { useState } from 'react'
import { Typography, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { OperationCard, OperationTab } from '../../components/sharedModule'
import { TbTransferOut } from 'react-icons/tb'
import { RiExchangeFundsLine } from 'react-icons/ri'
import TransfersPage from './transfers'
import ProvisionsPage from './provisions'
import './index.scss'

const { Title, Text } = Typography

type ActiveTab = 'traslado' | 'provision' | null

export const ProvisionsAndTransfersPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)

  const handleCardClick = (type: 'traslado' | 'provision') => {
    setActiveTab(type)
  }

  const handleTabClick = (type: 'traslado' | 'provision') => {
    setActiveTab(type)
  }

  const handleBack = () => {
    setActiveTab(null)
  }

  // Vista inicial con cards
  if (!activeTab) {
    return (
      <div className='transfers-and-provisions'>
        <Title level={2} className='transfers-and-provisions__title'>
          Traslado y Provisión
        </Title>
        <Text className='transfers-and-provisions__subtitle'>
          Selecciona una operación para comenzar
        </Text>
        <div className='transfers-and-provisions__cards'>
          <OperationCard
            submoduleType='traslado'
            showSubText={false}
            tittle='Traslado'
            onClick={() => handleCardClick('traslado')}
            icon={<TbTransferOut />}
          />
          <OperationCard
            submoduleType='provision'
            showSubText={false}
            tittle='Provisión'
            onClick={() => handleCardClick('provision')}
            icon={<RiExchangeFundsLine />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='transfers-and-provisions--expanded'>
      {/* Tabs */}
      <div className='transfers-and-provisions__browser-tabs'>
        <Button
          type='text'
          icon={<ArrowLeftOutlined />}
          className='transfers-and-provisions__back-btn'
          onClick={handleBack}
        >
          Volver
        </Button>
        <OperationTab
          subModuleType='traslado'
          tittle='Traslado'
          icon={<TbTransferOut />}
          isActive={activeTab === 'traslado'}
          onClick={() => handleTabClick('traslado')}
        />
        <OperationTab
          subModuleType='provision'
          tittle='Provisión'
          icon={<RiExchangeFundsLine />}
          isActive={activeTab === 'provision'}
          onClick={() => handleTabClick('provision')}
        />
      </div>

      <div className='transfers-and-provisions__content'>
        {activeTab === 'traslado' && <TransfersPage />}
        {activeTab === 'provision' && <ProvisionsPage />}
      </div>
    </div>
  )
}

export default ProvisionsAndTransfersPage
