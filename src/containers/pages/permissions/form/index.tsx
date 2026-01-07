import { useComputed } from '@preact/signals-react'
import { Form, FormInstance, Input, Select, Switch } from 'antd'

import { PERMISSION_FORM_FIELDS } from '@/constants'
import { validateFormat, VALIDATOR_REGEX } from '@/helpers'
import { ParamsState, PermissionsState } from '@/state'

import './index.scss'

export default function PermissionForm({ form }: { form: FormInstance }) {
  const isDisabled = useComputed(() =>
    Boolean(
      !PermissionsState.currentPermission.value.modifiable &&
        PermissionsState.currentPermission.value.id
    )
  )
  return (
    <Form
      disabled={isDisabled.value}
      className='permission-form'
      layout='vertical'
      form={form}
    >
      <Form.Item
        name={PERMISSION_FORM_FIELDS.name.value}
        label={PERMISSION_FORM_FIELDS.name.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={PERMISSION_FORM_FIELDS.name.label} />
      </Form.Item>
      <Form.Item
        name={PERMISSION_FORM_FIELDS.code.value}
        label={PERMISSION_FORM_FIELDS.code.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
          {
            validator: (rule, value, callback) => {
              if (
                validateFormat(value, VALIDATOR_REGEX.PERMISSION_CODE_FORMAT)
              ) {
                return callback()
              }

              return callback(
                'Solo letras, sin espacios y separación usando (:)'
              )
            },
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={PERMISSION_FORM_FIELDS.code.label} />
      </Form.Item>
      <Form.Item
        name={PERMISSION_FORM_FIELDS.description.value}
        label={PERMISSION_FORM_FIELDS.description.label}
        hasFeedback
      >
        <Input.TextArea
          placeholder={PERMISSION_FORM_FIELDS.description.label}
        />
      </Form.Item>
      <Form.Item
        name={PERMISSION_FORM_FIELDS.type.value}
        label={PERMISSION_FORM_FIELDS.type.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Select
          placeholder={PERMISSION_FORM_FIELDS.type.label}
          options={ParamsState.permissionTypes.value}
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={PERMISSION_FORM_FIELDS.preRequired.value}
        label={PERMISSION_FORM_FIELDS.preRequired.label}
      >
        <Select
          allowClear
          showSearch
          mode='multiple'
          className='permissions-required-input'
          placeholder={PERMISSION_FORM_FIELDS.preRequired.label}
          size='large'
          options={ParamsState.permissions.value}
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </Form.Item>

      <Form.Item
        name={PERMISSION_FORM_FIELDS.onlyDev.value}
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
          unCheckedChildren='Uso general'
          checkedChildren='Uso exclusivo de desarrollador'
        />
      </Form.Item>

      <Form.Item
        name={PERMISSION_FORM_FIELDS.modifiable.value}
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
        name={PERMISSION_FORM_FIELDS.deletable.value}
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
          unCheckedChildren='No se puede borrar'
          checkedChildren='Se puede borrar'
        />
      </Form.Item>
    </Form>
  )
}
