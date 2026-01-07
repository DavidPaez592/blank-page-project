import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useMenuItem } from '@/hooks/useMenuItem'
import { IMenuItem } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function MenuItemTableActions({
  menuItemData,
}: {
  menuItemData: IMenuItem
}) {
  const { handleEditMenuItem, handleDeleteMenuItem, loading } = useMenuItem()

  const handleEdit = () => {
    handleEditMenuItem(menuItemData.uid as string)
  }

  const handleDelete = () => {
    handleDeleteMenuItem(menuItemData.uid as string)
  }

  return (
    <Space size='middle' align='center'>
      <CheckAccess permission={PERMISSIONS_LIST.MenuItemUpdate}>
        <Tooltip title='Editar'>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleEdit}
            loading={loading.value.edit}
            disabled={loading.value.edit}
            size='middle'
            icon={
              <MdEditSquare
                title='Editar'
                size={20}
                color='grey'
                cursor='pointer'
              />
            }
          ></Button>
        </Tooltip>
      </CheckAccess>

      <CheckAccess permission={PERMISSIONS_LIST.MenuItemDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar este permiso?'
            okText='Sí, eliminar'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDelete}
            okButtonProps={{
              disabled: loading.value.delete,
              loading: loading.value.delete,
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
            ></Button>
          </Popconfirm>
        </Tooltip>
      </CheckAccess>
    </Space>
  )
}
