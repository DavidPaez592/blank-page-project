import { Typography } from 'antd'
import { ReactNode } from 'react'
import './OperationCard.scss'

const { Title, Text } = Typography

interface OperationCardProps {
  submoduleType: string // 'traslado' | 'provision' propiedad que aplica el respectivo estilo quemado en el css
  onClick: () => void
  tittle: string
  icon: ReactNode
  showSubText?: boolean
  subText?: string
}

export const OperationCard = ({
  submoduleType,
  onClick,
  tittle,
  showSubText,
  subText,
  icon,
}: OperationCardProps) => {
  return (
    <div
      className={`operation-card operation-card--${submoduleType}`}
      onClick={onClick}
    >
      <div className='operation-card__icon'>{icon}</div>
      <div className='operation-card__info'>
        <Title level={3} className='operation-card__title'>
          {tittle}
        </Title>
        {showSubText && <Text className='operation-card__desc'>{subText}</Text>}
      </div>
    </div>
  )
}

export default OperationCard
