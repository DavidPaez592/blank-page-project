import { useComputed } from '@preact/signals-react'
import { USER_FORM_FIELDS, USER_STATUS_OPTIONS } from '@/constants'
import { ParamsState, UsersState } from '@/state'
import { DatePicker, Form, FormInstance, Input, Select } from 'antd'

import { confirmFieldToField } from '@/helpers'

import './index.scss'

export default function UserForm({ form }: { form: FormInstance }) {
  const isUpdating = useComputed(() =>
    Boolean(UsersState.currentUser.value.uid)
  )

  return (
    <Form className='role-form' layout='vertical' form={form}>
      <Form.Item
        required
        hasFeedback
        name={USER_FORM_FIELDS.identificationType.value}
        label={USER_FORM_FIELDS.identificationType.label}
        rules={[
          {
            message: 'Por favor seleccione su tipo de identificación',
            required: true,
          },
        ]}
      >
        <Select
          className='identification-type-input'
          placeholder={USER_FORM_FIELDS.identificationType.label}
          size='large'
          options={ParamsState.docTypes.value}
        />
      </Form.Item>

      <Form.Item
        required
        hasFeedback
        name={USER_FORM_FIELDS.identificationNumber.value}
        label={USER_FORM_FIELDS.identificationNumber.label}
        rules={[
          {
            message: 'Por favor ingrese su identificación',
            required: true,
          },
        ]}
      >
        <Input
          className='identification-number-input'
          placeholder={USER_FORM_FIELDS.identificationNumber.label}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.firstName.value}
        label={USER_FORM_FIELDS.firstName.label}
        required
        rules={[
          {
            message: 'Por favor ingrese su primer nombre',
            required: true,
          },
        ]}
      >
        <Input
          className='first-name-input'
          placeholder={USER_FORM_FIELDS.firstName.label}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.secondName.value}
        label={USER_FORM_FIELDS.secondName.label}
      >
        <Input
          className='second-name-input'
          placeholder={USER_FORM_FIELDS.secondName.label}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.firstSurname.value}
        label={USER_FORM_FIELDS.firstSurname.label}
        required
        rules={[
          {
            message: 'Por favor ingrese su primer apellido',
            required: true,
          },
        ]}
      >
        <Input
          className='first-surname-input'
          placeholder={USER_FORM_FIELDS.firstSurname.label}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.secondSurname.value}
        label={USER_FORM_FIELDS.secondSurname.label}
      >
        <Input
          className='second-surname-input'
          placeholder={USER_FORM_FIELDS.secondSurname.label}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.birthdate.value}
        label={USER_FORM_FIELDS.birthdate.label}
      >
        <DatePicker
          className='birthdate-input'
          placeholder={USER_FORM_FIELDS.birthdate.label}
          size='large'
          format='YYYY-MM-DD'
        />
      </Form.Item>

      <Form.Item
        hasFeedback
        name={USER_FORM_FIELDS.email.value}
        label={USER_FORM_FIELDS.email.label}
        required
        rules={[
          {
            message: 'Por favor ingrese su email',
            required: true,
          },
          {
            type: 'email',
            message: 'No es un email válido',
          },
        ]}
      >
        <Input
          className='email-input'
          placeholder={USER_FORM_FIELDS.email.label.toUpperCase()}
          size='large'
        />
      </Form.Item>

      <Form.Item
        hidden={isUpdating.value}
        hasFeedback
        name={USER_FORM_FIELDS.confirmEmail.value}
        label={USER_FORM_FIELDS.confirmEmail.label}
        required={!isUpdating.value}
        dependencies={isUpdating.value ? [] : [USER_FORM_FIELDS.email.value]}
        rules={[
          {
            message: 'Por favor confirme el email',
            required: !isUpdating.value,
          },
          {
            type: 'email',
            message: 'No es un email válido',
          },
          !isUpdating.value
            ? ({ getFieldValue }) =>
                confirmFieldToField(
                  getFieldValue,
                  USER_FORM_FIELDS.confirmEmail.value,
                  USER_FORM_FIELDS.email.value,
                  'Los correos no coinciden'
                )
            : {},
        ]}
      >
        <Input
          className='confirm-email-input'
          placeholder={USER_FORM_FIELDS.confirmEmail.label.toUpperCase()}
          size='large'
        />
      </Form.Item>

      <Form.Item
        required
        hasFeedback
        name={USER_FORM_FIELDS.roles.value}
        label={USER_FORM_FIELDS.roles.label}
        rules={[
          {
            message: 'Por favor seleccione los roles',
            required: true,
          },
        ]}
      >
        <Select
          allowClear
          showSearch
          mode='multiple'
          className='roles-input'
          placeholder={USER_FORM_FIELDS.roles.label}
          size='large'
          options={ParamsState.roles.value}
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </Form.Item>

      <Form.Item
        hidden={!isUpdating.value}
        required
        hasFeedback
        name={USER_FORM_FIELDS.status.value}
        label={USER_FORM_FIELDS.status.label}
        rules={[
          {
            message: 'Por favor el estado',
            required: isUpdating.value,
          },
        ]}
      >
        <Select
          allowClear
          showSearch
          className='status-input'
          placeholder={USER_FORM_FIELDS.status.label}
          size='large'
          options={USER_STATUS_OPTIONS}
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </Form.Item>
    </Form>
  )
}
