import React from 'react'
import {
  Form,
  Row,
  Col,
  DatePicker,
  Select,
  Upload,
  Button,
  Alert,
  Typography,
} from 'antd'
import {
  UploadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'
import dayjs from 'dayjs'

const { Dragger } = Upload
const { Text } = Typography

interface UploadFormProps {
  form: any
  loading: boolean
  fileList: UploadFile[]
  onFileChange: (fileList: UploadFile[]) => void
  onUpload: () => void
  onCancel: () => void
  officeOptions: Array<{ label: string; value: string }>
  officesLoading: boolean
}

const UploadForm: React.FC<UploadFormProps> = ({
  form,
  loading,
  fileList,
  onFileChange,
  onUpload,
  onCancel,
  officeOptions,
  officesLoading,
}) => {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: () => false,
    onChange: (info) => onFileChange(info.fileList.slice(-1)),
    accept: '.xlsx,.xls,.csv',
  }

  return (
    <Form form={form} layout='vertical'>
      {/* Información de ayuda */}
      <Alert
        message='Formato de archivo requerido'
        description={
          <div>
            <Text strong>Columnas requeridas (en este orden):</Text>
            <br />
            1. <Text code>Código de Moneda</Text> (ej: USD, EUR, COP)
            <br />
            2. <Text code>Método de Pago</Text> (ej: Efectivo, Transferencia)
            <br />
            3. <Text code>Precio de Compra</Text> (número decimal)
            <br />
            4. <Text code>Precio de Venta</Text> (número decimal)
            <br />
            5. <Text code>TRM</Text> (número decimal)
            <br />
            <Text
              type='secondary'
              style={{ fontSize: '12px', marginTop: 8, display: 'block' }}
            >
              • La primera fila debe contener los encabezados
              <br />
              • Formatos soportados: .xlsx, .xls, .csv
              <br />• Asegúrate de que todos los campos estén completos
            </Text>
          </div>
        }
        type='info'
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 16 }}
        showIcon
      />

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='date'
            label='Fecha'
            rules={[
              { required: true, message: 'Por favor selecciona una fecha' },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker
              style={{ width: '100%' }}
              format='YYYY-MM-DD'
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='officeUId'
            label='Oficina'
            rules={[
              { required: true, message: 'Por favor selecciona una oficina' },
            ]}
          >
            <Select
              placeholder='Selecciona una oficina'
              disabled={loading}
              loading={officesLoading}
              showSearch
              optionFilterProp='children'
            >
              {officeOptions?.map((office) => (
                <Select.Option key={office.value} value={office.value}>
                  {office.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name='file'
        label='Archivo'
        rules={[{ required: true, message: 'Por favor selecciona un archivo' }]}
      >
        <Dragger {...uploadProps} disabled={loading}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            Haz clic o arrastra un archivo a esta área para subir
          </p>
          <p className='ant-upload-hint'>
            Soporta archivos Excel (.xlsx, .xls) y CSV (.csv)
          </p>
        </Dragger>
      </Form.Item>

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button
          onClick={onCancel}
          style={{ marginRight: 8 }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type='primary'
          onClick={onUpload}
          loading={loading}
          disabled={fileList.length === 0}
          icon={<UploadOutlined />}
        >
          {loading ? 'Procesando...' : 'Cargar Archivo'}
        </Button>
      </div>
    </Form>
  )
}

export default UploadForm
