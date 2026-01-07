import { MENU_ITEM_FORM_FIELDS } from '@/constants'
import { ICONS_LIST_OPTIONS, validateFormat, VALIDATOR_REGEX } from '@/helpers'
import { MenuItemsState, ParamsState } from '@/state'
import { Form, FormInstance, Input, InputNumber, Select } from 'antd'

import './index.scss'
import { useComputed } from '@preact/signals-react'

export default function MenuItemForm({ form }: { form: FormInstance }) {
  const isUpdating = useComputed(() => {
    return Boolean(MenuItemsState.currentMenuItem.value.id)
  })
  return (
    <Form className='menu-item-form' layout='vertical' form={form}>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.label.value}
        label={MENU_ITEM_FORM_FIELDS.label.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={MENU_ITEM_FORM_FIELDS.label.label} />
      </Form.Item>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.key.value}
        label={MENU_ITEM_FORM_FIELDS.key.label}
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
          {
            validator: (rule, value, callback) => {
              if (
                validateFormat(
                  value,
                  VALIDATOR_REGEX.ONLY_LETTERS_WITHOUT_SPACE
                )
              ) {
                return callback()
              }

              return callback('Solo letras sin espacios')
            },
          },
        ]}
        required
        hasFeedback
      >
        <Input placeholder={MENU_ITEM_FORM_FIELDS.key.label} />
      </Form.Item>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.url.value}
        label={MENU_ITEM_FORM_FIELDS.url.label}
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
        <Input placeholder={MENU_ITEM_FORM_FIELDS.url.label} />
      </Form.Item>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.parent.value}
        label={MENU_ITEM_FORM_FIELDS.parent.label}
        hasFeedback
      >
        <Select
          showSearch
          allowClear
          filterOption={(input, option: any) =>
            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder={MENU_ITEM_FORM_FIELDS.parent.label}
          options={ParamsState.menuItems.value}
        />
      </Form.Item>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.order.value}
        label={MENU_ITEM_FORM_FIELDS.order.label}
        hasFeedback
        rules={[
          {
            message: 'Este campo es obligatorio',
            required: true,
          },
        ]}
      >
        <InputNumber
          placeholder={MENU_ITEM_FORM_FIELDS.order.label}
          step={1}
          min={1}
          max={
            isUpdating.value
              ? MenuItemsState.pagination.value.total
              : MenuItemsState.pagination.value.total + 1
          }
        />
      </Form.Item>
      <Form.Item
        name={MENU_ITEM_FORM_FIELDS.icon.value}
        label={MENU_ITEM_FORM_FIELDS.icon.label}
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
          placeholder={MENU_ITEM_FORM_FIELDS.icon.label}
          options={ICONS_LIST_OPTIONS}
        />
      </Form.Item>
    </Form>
  )
}
