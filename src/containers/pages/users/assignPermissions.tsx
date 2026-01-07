import { Signal, useSignal } from '@preact/signals-react'
import { Transfer } from 'antd'

import { IAssignPermissionsOption } from '@/interfaces'
import { ParamsState, UsersState } from '@/state'
import { usersStateActions } from '@/state/actions'

/**
 * UserAssignPermissions component allows assigning permissions to users.
 * It uses a Transfer component from Ant Design to display available and assigned permissions.
 *
 * @returns {JSX.Element} The rendered UserAssignPermissions component.
 */
export const UserAssignPermissions: React.FC = (): JSX.Element => {
  const selectedKeys: Signal<string[]> = useSignal([])

  /**
   * Filters the options in the Transfer component based on the input value.
   *
   * @param {string} inputValue - The value to filter the options by.
   * @param {IAssignPermissionsOption} option - The option to be filtered.
   * @returns {boolean} True if the option matches the input value, otherwise false.
   */
  const filterOption = (
    inputValue: string,
    option: IAssignPermissionsOption
  ): boolean =>
    option.title.indexOf(inputValue) > -1 ||
    option.description.indexOf(inputValue) > -1

  /**
   * Handles the change event when the target keys in the Transfer component are changed.
   *
   * @param {any[]} newTargetChange - The new target keys.
   */
  const handleChange = (newTargetChange: any[]) => {
    usersStateActions.setNewPermissions(newTargetChange)
  }

  /**
   * Handles the select change event in the Transfer component.
   *
   * @param {any[]} source - The source keys.
   * @param {any[]} target - The target keys.
   */
  const handleOnSelectChange = (source: any[], target: any[]) => {
    selectedKeys.value = [...source, ...target]
  }

  return (
    <Transfer
      showSearch
      showSelectAll
      dataSource={ParamsState.assignPermissions.value}
      targetKeys={UsersState.permissions.value as string[]}
      selectedKeys={selectedKeys.value}
      onChange={handleChange}
      render={(item) => item.title}
      titles={['Permisos disponibles', 'Permisos asignados']}
      filterOption={filterOption}
      onSelectChange={handleOnSelectChange}
    />
  )
}

export default UserAssignPermissions
