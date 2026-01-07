import { Transfer } from 'antd'

import { IAssignPermissionsOption } from '@/interfaces'
import { ParamsState, RolesState } from '@/state'
import { rolesStateActions } from '@/state/actions'
import { Signal, useSignal } from '@preact/signals-react'

export default function RoleAssignPermissions() {
  const selectedKeys: Signal<string[]> = useSignal([])

  const filterOption = (inputValue: string, option: IAssignPermissionsOption) =>
    option.title.indexOf(inputValue) > -1 ||
    option.description.indexOf(inputValue) > -1

  const handleChange = (newTargetChange: any[]) => {
    rolesStateActions.setNewPermissions(newTargetChange)
  }

  const handleOnSelectChange = (source: any[], target: any[]) => {
    selectedKeys.value = [...source, ...target]
  }

  return (
    <Transfer
      showSearch
      showSelectAll
      dataSource={ParamsState.assignPermissions.value}
      targetKeys={RolesState.permissions.value as string[]}
      selectedKeys={selectedKeys.value}
      onChange={handleChange}
      render={(item) => item.title}
      titles={['Permisos disponibles', 'Permisos asignados']}
      filterOption={filterOption}
      onSelectChange={handleOnSelectChange}
    />
  )
}
