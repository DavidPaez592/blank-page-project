import { computed, ReadonlySignal } from '@preact/signals-react'
import { Tag } from 'antd'
import { ColumnType } from 'antd/es/table'

import { USER_STATUS_OPTIONS } from '@/constants'
import { getView } from '@/helpers'
import { EUserStatus, IRole, IUser } from '@/interfaces'
import { ParamsState } from '@/state'
import UserTableActions from './actions'

export const UsersTableColumns: ReadonlySignal<ColumnType<IUser>[]> = computed(
  () => {
    return [
      {
        title: 'Nombre Completo',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        render: (userData: IUser) =>
          `${userData.firstName} ${userData.secondName ?? ''} ${userData.firstSurname} ${userData.secondSurname ?? ''}`.toUpperCase(),
      },
      {
        title: 'Identificación',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        render: (userData: IUser) => {
          const identificationText = ParamsState.docTypes.value
            .find((item) => item.value === userData.identificationTypeUId)
            ?.label?.toUpperCase()

          return `${identificationText}\n${userData.identificationNumber}`
        },
      },
      {
        title: 'Correo',
        dataIndex: 'email',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        ellipsis: true,
      },
      {
        title: 'Roles',
        dataIndex: 'roles',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        render: (roles?: IRole[]) =>
          roles?.map((item) => item.name?.toUpperCase()).join('\n'),
      },
      {
        title: 'Estado',
        dataIndex: 'status',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        render: (status: EUserStatus) => {
          const statusText = USER_STATUS_OPTIONS.find(
            (item) => item.value === status
          )?.label.toUpperCase()
          const isEnabled = status === EUserStatus.ENABLED

          return (
            <Tag title={statusText} color={isEnabled ? 'green' : 'red'}>
              {statusText}
            </Tag>
          )
        },
      },
      {
        title: 'Acciones',
        align: 'center',
        responsive: ['xs', 'sm', 'md', 'lg'],
        key: 'actions',
        fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
        render: (data: IUser) => <UserTableActions userData={data} />,
      },
    ]
  }
)
