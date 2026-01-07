import { FloatButton, Table } from 'antd'
import { RoutesTableColumns } from './config'
import { RoutesState } from '@/state'
import { IoAddCircle } from 'react-icons/io5'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useGetRoutesList } from '@/hooks/useRoutes'
import { routesStateActions } from '@/state/actions'

export default function RouteTable() {
  const { loading } = useGetRoutesList()
  const { total, pageSize, page, pageSizeOptions, data } =
    RoutesState.pagination.value

  return (
    <>
      <h2 className='page-title'>Rutas</h2>

      <CheckAccess permission={PERMISSIONS_LIST.RouteCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear ruta'
          icon={<IoAddCircle />}
          type='primary'
          onClick={routesStateActions.addRoute}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess
        permission={PERMISSIONS_LIST.RouteList}
        message='No tienes acceso a la lista de rutas'
      >
        <Table
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: routesStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} rutas`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={RoutesTableColumns}
          scroll={{ y: 'calc(100dvh - 176px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}
