import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useCurrencies } from '@/hooks/useCurrencies'
import { ICurrency } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

interface CurrenciesTableActionsProps {
  currencyData: ICurrency
}

export default function CurrenciesTableActions({
  currencyData,
}: CurrenciesTableActionsProps) {
  const { loading, handleEditCurrency, handleDeleteCurrency } = useCurrencies()

  const handleEdit = () => {
    handleEditCurrency(currencyData)
  }

  const handleDelete = () => {
    handleDeleteCurrency(currencyData.uid)
  }

  return (
    <Space size='middle' align='center'>
      {/* Edit Currency */}
      <CheckAccess permission={PERMISSIONS_LIST.CurrenciesUpdate}>
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

      {/* Delete Currency */}
      <CheckAccess permission={PERMISSIONS_LIST.CurrenciesDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar esta moneda?'
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
