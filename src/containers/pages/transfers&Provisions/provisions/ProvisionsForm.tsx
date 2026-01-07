import { Form, Input, Select, DatePicker, Row, Col, Checkbox, Card } from 'antd'
import { SearchOutlined, SaveOutlined, ClearOutlined } from '@ant-design/icons'
import { BsCoin } from 'react-icons/bs'
import { SiGoogleforms } from 'react-icons/si'
import { TbDoorEnter, TbDoorExit } from 'react-icons/tb'
import { ActionBar } from '@/containers/components/sharedModule'
import { useCurrencies } from '@/hooks/useCurrencies'
import { Spin } from 'antd'
import { TransfersAndProvisionsContext } from '@/hooks/useTransfers&Provisions'

const ProvisionsForm = ({
  createProvision,
  cashboxes,
  loadingCashboxes,
  creatingProvision,
}: TransfersAndProvisionsContext) => {
  const [form] = Form.useForm()
  const { currencies, loading: loadingCurrencies } = useCurrencies()

  const sourceCashboxUid = Form.useWatch('sourceCashboxUid', form)
  const sourceCashbox = cashboxes.find((c) => c.uid === sourceCashboxUid)
  const targetCashboxes = sourceCashbox
    ? cashboxes.filter(
        (c) =>
          c.office.uid === sourceCashbox.office.uid &&
          c.uid !== sourceCashbox.uid
      )
    : []

  const onFinish = async (values: any) => {
    const success = await createProvision({
      sourceCashboxUid: values.sourceCashboxUid,
      targetCashboxUid: values.targetCashboxUid,
      currencyUid: values.currencyUid,
      amount: Number(values.amount),
      notes: values.notes,
    })

    if (success) {
      form.resetFields()
      form.setFieldsValue({
        presentacion: 'EFECTIVO',
        tipoOperacion: 'EFECTIVO',
      })
    }
  }

  if (loadingCurrencies.value.list || loadingCashboxes || creatingProvision)
    return <Spin fullscreen />

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <ActionBar
        actions={[
          {
            key: 'search',
            label: 'Buscar',
            icon: <SearchOutlined />,
            onClick: () => {},
          },
          {
            key: 'clear',
            label: 'Limpiar',
            icon: <ClearOutlined />,
            onClick: () => form.resetFields(),
          },
          {
            key: 'save',
            label: 'Grabar',
            icon: <SaveOutlined />,
            type: 'primary',
            color: 'orange',
            onClick: () => form.submit(),
          },
          // {
          //   key: 'delete',
          //   label: 'Eliminar',
          //   icon: <DeleteOutlined />,
          //   danger: true,
          //   onClick: () => {},
          // },
          // {
          //   key: 'print',
          //   label: 'Imprimir',
          //   icon: <PrinterOutlined />,
          //   onClick: () => {},
          // },
        ]}
      />

      {/* INFORMACIÓN GENERAL */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SiGoogleforms />
            Información General
          </span>
        }
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name='tipo' label='Tipo'>
              <Select
                options={[
                  { value: 'ingreso', label: 'Provisión de ingreso' },
                  { value: 'egreso', label: 'Provisión de egreso' },
                ]}
                disabled
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name='transaccion' label='Transacción'>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name='fecha' label='Fecha'>
              <DatePicker style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name='consecutivo' label='Consecutivo'>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item name='comprobante' label='Comprobante'>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              name='anulado'
              valuePropName='checked'
              style={{ marginTop: 30 }}
            >
              <Checkbox>Anulado</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* ORIGEN / DESTINO */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TbDoorExit />
                Origen (Salida)
              </span>
            }
          >
            <Form.Item
              name='sourceCashboxUid'
              label='Caja'
              rules={[
                { required: true, message: 'Seleccione una caja de origen' },
              ]}
            >
              <Select
                showSearch
                optionFilterProp='label'
                options={cashboxes.map((c) => ({
                  value: c.uid,
                  label: `${c.name} — ${c.office.name}`,
                }))}
              />
            </Form.Item>

            <Form.Item name='origenCajero' label='Cajero'>
              <Input disabled />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TbDoorEnter />
                Destino (Entrada)
              </span>
            }
          >
            <Form.Item
              name='targetCashboxUid'
              label='Caja'
              rules={[
                { required: true, message: 'Seleccione una caja destino' },
              ]}
            >
              <Select
                disabled={!sourceCashboxUid}
                placeholder={
                  sourceCashboxUid
                    ? 'Seleccione caja destino'
                    : 'Seleccione primero la caja de origen'
                }
                options={targetCashboxes.map((c) => ({
                  value: c.uid,
                  label: `${c.name} — ${c.office.name}`,
                }))}
              />
            </Form.Item>

            <Form.Item name='destinoCajero' label='Cajero'>
              <Input disabled />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      {/* MONEDA */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BsCoin />
            Moneda
          </span>
        }
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name='currencyUid'
              label='Moneda'
              rules={[{ required: true, message: 'Elija una moneda' }]}
            >
              <Select
                showSearch
                optionFilterProp='label'
                options={currencies.value.map((currency) => ({
                  value: currency.uid,
                  label: `${currency.code} - ${currency.name}`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name='presentacion'
              label='Presentación'
              initialValue='EFECTIVO'
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name='amount'
              label='Cantidad'
              rules={[
                { required: true, message: 'Ingrese la cantidad' },
                {
                  pattern: /^[0-9]+$/,
                  message: 'Solo se permiten números enteros',
                },
              ]}
            >
              <Input
                inputMode='numeric'
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name='tipoOperacion'
              label='Tipo'
              initialValue='EFECTIVO'
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name='tasaCambio' label='Tasa de cambio'>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name='valorEfectivo' label='Vlr. Efectivo'>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* OBSERVACIONES */}
      <Card title='Observaciones'>
        <Form.Item
          name='notes'
          rules={[{ required: true, message: 'Ingrese las observaciones' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Card>
    </Form>
  )
}

export default ProvisionsForm
