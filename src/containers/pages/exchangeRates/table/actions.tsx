import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { IExchangeRate } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

interface ExchangeRatesTableActionsProps {
  exchangeRateData: IExchangeRate
}

export default function ExchangeRatesTableActions({
  exchangeRateData,
}: ExchangeRatesTableActionsProps) {
  const { loading, handleEditExchangeRate, handleDeleteExchangeRate } =
    useExchangeRates()

  const handleEdit = () => {
    handleEditExchangeRate(exchangeRateData)
  }

  const handleDelete = () => {
    handleDeleteExchangeRate(exchangeRateData.uid)
  }

  return (
    <Space size='middle' align='center'>
      {/* Edit Exchange Rate */}
      <CheckAccess permission={PERMISSIONS_LIST.ExchangeRatesUpdate}>
        <Tooltip title='Editar'>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleEdit}
            loading={loading.value.update}
            disabled={loading.value.update}
            size='middle'
            icon={
              <MdEditSquare
                title='Editar'
                size={20}
                color='grey'
                cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>

      {/* Delete Exchange Rate */}
      <CheckAccess permission={PERMISSIONS_LIST.ExchangeRatesDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar esta tasa de cambio?'
            description='Esta acción no se puede deshacer.'
            okText='Sí, eliminar'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDelete}
            okButtonProps={{
              disabled: loading.value.delete,
              loading: loading.value.delete,
              danger: true,
            }}
          >
            <Button
              style={{ borderRadius: '50%', padding: '5px' }}
              icon={
                <MdDeleteForever
                  title='Eliminar'
                  size={20}
                  color='red'
                  cursor='pointer'
                />
              }
            />
          </Popconfirm>
        </Tooltip>
      </CheckAccess>
    </Space>
  )
}
