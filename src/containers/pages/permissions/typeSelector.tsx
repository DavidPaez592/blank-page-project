import { Radio, type RadioChangeEvent } from 'antd'

import { EPermissionType } from '@/interfaces'
import { PermissionsState } from '@/state'
import { permissionsStateActions } from '@/state/permissions/actions'

export const PermissionsTypeSelector: React.FC = (): JSX.Element => {
  const handleChangeCurrentType = (event: RadioChangeEvent) => {
    permissionsStateActions.changeSelectorType(event.target.value)
  }

  return (
    <Radio.Group
      value={PermissionsState.activeType.value}
      onChange={handleChangeCurrentType}
      className='permissions-type-selector'
      buttonStyle='solid'
      size='middle'
    >
      <Radio.Button value={EPermissionType.ROUTE}>Acceso a rutas</Radio.Button>

      <Radio.Button value={EPermissionType.DATA}>
        Validación de datos
      </Radio.Button>

      <Radio.Button value={EPermissionType.VIEW}>
        Validación visual
      </Radio.Button>
    </Radio.Group>
  )
}

export default PermissionsTypeSelector
