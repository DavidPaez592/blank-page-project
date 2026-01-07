import { TbArrowBigDownLines, TbArrowBigUpLines } from 'react-icons/tb'
import './OperationTab.scss'

export type OperationType = 'compra' | 'venta'

interface OperationTabProps {
  type: OperationType
  isActive: boolean
  onClick: () => void
}

export const OperationTab = ({ type, isActive, onClick }: OperationTabProps) => {
  const isCompra = type === 'compra'

  return (
    <button 
      className={`operation-tab operation-tab--${type} ${isActive ? 'active' : ''}`} 
      onClick={onClick}
    >
      {isCompra ? (
        <TbArrowBigDownLines className="operation-tab__icon" />
      ) : (
        <TbArrowBigUpLines className="operation-tab__icon" />
      )}
      <span>{isCompra ? 'Compra' : 'Venta'}</span>
    </button>
  )
}

export default OperationTab
