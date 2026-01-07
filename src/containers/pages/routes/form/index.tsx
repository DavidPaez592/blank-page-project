import { useComputed } from '@preact/signals-react'
import { Form, FormInstance, Input, Select, Switch, TreeSelect } from 'antd'

import { ROUTE_FORM_FIELDS, ROUTES_METHODS_OPTIONS } from '@/constants'
import { validateFormat, VALIDATOR_REGEX } from '@/helpers'
import { ParamsState, RoutesState } from '@/state'
import { paramsStateActions } from '@/state/actions'

import './index.scss'

export default function RouteForm({ form }: { form: FormInstance }) {
  const isUpdating = useComputed(() => {
    return Boolean(RoutesState.currentRoute.value.id)
  })

  const privateRoute = Form.useWatch(ROUTE_FORM_FIELDS.private.value, form)
  const defaultRoute = Form.useWatch(ROUTE_FORM_FIELDS.default.value, form)

  return (
    <Form className='route-form' layout='vertical' form={form}>
      <Form.Item
        name={ROUTE_FORM_FIELDS.name.value}
        label={ROUTE_FORM_FIELDS.name.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={ROUTE_FORM_FIELDS.name.label} />
      </Form.Item>
      <Form.Item
        name={ROUTE_FORM_FIELDS.description.value}
        label={ROUTE_FORM_FIELDS.description.label}
        hasFeedback
      >
        <Input.TextArea placeholder={ROUTE_FORM_FIELDS.description.label} />
      </Form.Item>
      <Form.Item
        name={ROUTE_FORM_FIELDS.path.value}
        label={ROUTE_FORM_FIELDS.path.label}
        hasFeedback
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
          {
            validator: (rule, value, callback) => {
              if (validateFormat(value, VALIDATOR_REGEX.ROUTE_PATH)) {
                return callback()
              }

              return callback('Solo letras sin espacios')
            },
          },
        ]}
      >
        <Input placeholder={ROUTE_FORM_FIELDS.path.label} />
      </Form.Item>
      <Form.Item
        name={ROUTE_FORM_FIELDS.method.value}
        label={ROUTE_FORM_FIELDS.method.label}
        hasFeedback
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
      >
        <Select
          showSearch
          allowClear
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder={ROUTE_FORM_FIELDS.method.label}
          options={ROUTES_METHODS_OPTIONS}
        />
      </Form.Item>
      <Form.Item
        name={ROUTE_FORM_FIELDS.private.value}
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
          unCheckedChildren='Ruta pública'
          checkedChildren='Ruta privada'
        />
      </Form.Item>

      <Form.Item
        hidden={!privateRoute}
        name={ROUTE_FORM_FIELDS.menuItem.value}
        label={ROUTE_FORM_FIELDS.menuItem.label}
        hasFeedback
      >
        <TreeSelect
          showSearch
          allowClear
          placeholder={ROUTE_FORM_FIELDS.menuItem.label}
          treeData={ParamsState.menuItems.value}
        />
      </Form.Item>

      <Form.Item
        hidden={!privateRoute}
        name={ROUTE_FORM_FIELDS.default.value}
        hasFeedback
        valuePropName='checked'
      >
        <Switch
          unCheckedChildren='Ruta normal'
          checkedChildren='Ruta por defecto'
        />
      </Form.Item>

      <Form.Item
        hidden={!privateRoute || defaultRoute}
        name={ROUTE_FORM_FIELDS.permission.value}
        label={ROUTE_FORM_FIELDS.permission.label}
        hasFeedback
      >
        <Select
          showSearch
          allowClear
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder={ROUTE_FORM_FIELDS.permission.label}
          options={ParamsState.permissions.value}
          onSearch={paramsStateActions.setPermissionSearchText}
        />
      </Form.Item>
    </Form>
  )
}
