import { useComputed } from '@preact/signals-react'
import { Form, FormInstance, Input, Select, Switch } from 'antd'

import { TENANT_FORM_FIELDS, TENANT_STATUS_OPTIONS } from '@/constants'

import './index.scss'
import { TenantsState } from '@/state'

export const TenantForm: React.FC<{ form: FormInstance }> = ({
  form,
}: {
  form: FormInstance
}): JSX.Element => {
  const isUpdating = useComputed(() =>
    Boolean(TenantsState.currentTenant.value.uid)
  )
  return (
    <Form className='tenant-form' layout='vertical' form={form}>
      <Form.Item
        name={TENANT_FORM_FIELDS.name.value}
        label={TENANT_FORM_FIELDS.name.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={TENANT_FORM_FIELDS.name.label} />
      </Form.Item>
      {isUpdating.value && (
        <Form.Item
          hidden={!isUpdating.value}
          name={TENANT_FORM_FIELDS.status.value}
          label={TENANT_FORM_FIELDS.status.label}
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
            placeholder={TENANT_FORM_FIELDS.status.label}
            options={TENANT_STATUS_OPTIONS}
          />
        </Form.Item>
      )}
    </Form>
  )
}

export default TenantForm
