import { useComputed } from '@preact/signals-react'
import { Form, FormInstance, Input, Switch } from 'antd'

import { ROLE_FORM_FIELDS } from '@/constants'
import { RolesState } from '@/state'

import './index.scss'

/**
 * RoleForm component
 *
 * This component renders a form for creating or editing a role. It includes fields for the role name,
 * description, and a switch to indicate if the role is modifiable. The form is disabled if the current
 * role is not modifiable and has an ID.
 *
 * @param {object} props - The props passed to the component.
 * @param {FormInstance} props.form - The Ant Design form instance.
 * @returns {JSX.Element} The rendered component
 */
export const RoleForm: React.FC<{ form: FormInstance }> = ({
  form,
}: {
  form: FormInstance
}): JSX.Element => {
  const isDisabled = useComputed(() =>
    Boolean(
      !RolesState.currentRole.value.modifiable &&
        RolesState.currentRole.value.id
    )
  )

  return (
    <Form
      disabled={isDisabled.value}
      className='role-form'
      layout='vertical'
      form={form}
    >
      <Form.Item
        name={ROLE_FORM_FIELDS.name.value}
        label={ROLE_FORM_FIELDS.name.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={ROLE_FORM_FIELDS.name.label} />
      </Form.Item>
      <Form.Item
        name={ROLE_FORM_FIELDS.description.value}
        label={ROLE_FORM_FIELDS.description.label}
        hasFeedback
      >
        <Input.TextArea placeholder={ROLE_FORM_FIELDS.description.label} />
      </Form.Item>

      <Form.Item
        name={ROLE_FORM_FIELDS.modifiable.value}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
        valuePropName='checked'
      >
        <Switch
          unCheckedChildren='No se puede modificar'
          checkedChildren='Se puede modificar'
        />
      </Form.Item>

      <Form.Item
        name={ROLE_FORM_FIELDS.deletable.value}
        hasFeedback
        valuePropName='checked'
      >
        <Switch
          unCheckedChildren='No se puede borrar'
          checkedChildren='Se puede borrar'
        />
      </Form.Item>
    </Form>
  )
}

export default RoleForm
