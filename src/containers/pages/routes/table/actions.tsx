import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useRoute } from '@/hooks/useRoutes'
import { IRoute } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function RouteTableActions({
  routeData,
}: {
  routeData: IRoute
}) {
  const { handleEditRoute, handleDeleteRoute, loading } = useRoute()

  const handleEdit = () => {
    handleEditRoute(routeData.uid as string)
  }

  const handleDelete = () => {
    handleDeleteRoute(routeData.uid as string)
  }

  return (
    <Space size='middle' align='center'>
      <CheckAccess permission={PERMISSIONS_LIST.RouteUpdate}>
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

      <CheckAccess permission={PERMISSIONS_LIST.RouteDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar esta ruta?'
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
