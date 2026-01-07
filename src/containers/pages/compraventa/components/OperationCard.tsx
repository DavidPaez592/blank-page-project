import { Typography } from 'antd'
import { TbArrowBigDownLines, TbArrowBigUpLines } from 'react-icons/tb'
import './OperationCard.scss'

const { Title, Text } = Typography

export type OperationType = 'compra' | 'venta'

interface OperationCardProps {
  type: OperationType
  onClick: () => void
}

export const OperationCard = ({ type, onClick }: OperationCardProps) => {
  const isCompra = type === 'compra'
  
  return (
    <div 
      className={`operation-card operation-card--${type}`} 
      onClick={onClick}
    >
      <div className="operation-card__icon">
        {isCompra ? <TbArrowBigDownLines /> : <TbArrowBigUpLines />}
      </div>
      <div className="operation-card__info">
        <Title level={3} className="operation-card__title">
          {isCompra ? 'Compra' : 'Venta'}
        </Title>
        <Text className="operation-card__desc">
          {isCompra ? 'Comprar divisas extranjeras' : 'Vender divisas extranjeras'}
        </Text>
      </div>
    </div>
  )
}

export default OperationCard
