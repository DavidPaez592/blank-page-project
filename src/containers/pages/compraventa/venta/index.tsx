import React, { useState, useEffect } from 'react'
import { Typography, Input, Select, Checkbox, Button, Row, Col, Table, DatePicker } from 'antd'
import {
  DollarOutlined,
  CreditCardOutlined,
  UserOutlined,
  BankOutlined,
  GlobalOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  UndoOutlined,
  CopyOutlined,
  CloseOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  UnorderedListOutlined,
  TagsOutlined,
  CloudUploadOutlined,
  QrcodeOutlined,
  CreditCardOutlined as NotaCreditoIcon,
} from '@ant-design/icons'
import { TbArrowBigUpLines } from 'react-icons/tb'

import { useGetAllCurrencies } from '@/hooks/useCurrencies'
import { useGetAllPaymentMethods } from '@/hooks/usePaymentMethods'
import { ParamsState } from '@/state'
import { paramsStateActions } from '@/state/params/actions'

import './index.scss'

const { Title, Text } = Typography
const { Option } = Select

const VentaModule: React.FC = () => {
  const [innerTab, setInnerTab] = useState<'datos' | 'adicionales' | 'lista'>('datos')
  const [personaJuridica, setPersonaJuridica] = useState(false)
  const [tipoNegocio, setTipoNegocio] = useState<string | undefined>(undefined)

  // Hooks para obtener datos de las APIs
  const { currencyOptions, loading: loadingCurrencies } = useGetAllCurrencies()
  const { paymentMethodOptions, loading: loadingPaymentMethods } = useGetAllPaymentMethods()
  
  // Cargar tipos de documento
  useEffect(() => {
    paramsStateActions.getIdTypes()
  }, [])
  
  const idTypeOptions = ParamsState.docTypes.value

  // Columnas de la tabla Lista
  const listaColumns = [
    { title: 'Consecutivo', dataIndex: 'consecutivo', key: 'consecutivo' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Moneda', dataIndex: 'moneda', key: 'moneda' },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Tasa', dataIndex: 'tasa', key: 'tasa' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor' },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
  ]

  const listaData: Array<{
    key: string
    consecutivo: string
    fecha: string
    moneda: string
    cantidad: number
    tasa: number
    valor: number
    cliente: string
  }> = []

  return (
    <div className="venta-module">
      {/* Inner tabs - Siempre visibles */}
      <div className="venta-module__inner-tabs">
        <button
          className={`venta-module__inner-tab ${innerTab === 'datos' ? 'active' : ''}`}
          onClick={() => setInnerTab('datos')}
        >
          <DatabaseOutlined />
          Datos Venta
        </button>
        <button
          className={`venta-module__inner-tab ${innerTab === 'adicionales' ? 'active' : ''}`}
          onClick={() => setInnerTab('adicionales')}
        >
          <FileTextOutlined />
          Adicionales
        </button>
        <button
          className={`venta-module__inner-tab ${innerTab === 'lista' ? 'active' : ''}`}
          onClick={() => setInnerTab('lista')}
        >
          <UnorderedListOutlined />
          Lista
        </button>
      </div>

      <div className="venta-module__wrapper">
        <div className="venta-module__main">
        {/* DATOS */}
        {innerTab === 'datos' && (
          <>
            {/* Header */}
            <div className="venta-module__header">
              <div className="venta-module__header-title">
                <TbArrowBigUpLines className="venta-module__header-icon" />
                <Title level={5} className="venta-module__title">VENTA DE DIVISAS</Title>
              </div>
              <div className="venta-module__header-fields">
                <div className="venta-module__field-group venta-module__field-group--header">
                  <label>FECHA</label>
                  <DatePicker size="small" className="venta-module__header-input" />
                </div>
                <div className="venta-module__field-group venta-module__field-group--header">
                  <label>CONSECUTIVO</label>
                  <Input size="small" className="venta-module__header-input" />
                </div>
                <div className="venta-module__field-group venta-module__field-group--header">
                  <label>NUMERO DE FACTURA</label>
                  <Input size="small" className="venta-module__header-input" />
                </div>
              </div>
              <div className="venta-module__header-dian">
                <div className="venta-module__dian-row">
                  <Checkbox>ANULADO</Checkbox>
                </div>
                <div className="venta-module__dian-row">
                  <Checkbox>ADJUNTADO DIAN</Checkbox>
                  <Input size="small" placeholder="Código DIAN" className="venta-module__dian-input" />
                </div>
              </div>
            </div>

            {/* Grid de secciones */}
            <div className="venta-module__grid">
              {/* A Vender */}
              <div className="venta-module__section venta-module__section--highlight">
                <div className="venta-module__section-header">
                  <DollarOutlined style={{ marginRight: 8 }} />
                  <span className="venta-module__section-title">A vender</span>
                </div>
                <div className="venta-module__section-body">
                  <Row gutter={[12, 8]}>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="venta-module__field-group">
                        <label>MONEDA</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          loading={loadingCurrencies.value}
                          options={currencyOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="venta-module__field-group">
                        <label>PRESENTACIÓN</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="venta-module__field-group">
                        <label>CANTIDAD</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={5}>
                      <div className="venta-module__field-group">
                        <label>TASA DE CAMBIO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={4}>
                      <div className="venta-module__field-group">
                        <label>VALOR IVA</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Forma de Pago - 3 columnas */}
              <div className="venta-module__section venta-module__section--full">
                <div className="venta-module__section-header">
                  <CreditCardOutlined style={{ marginRight: 8 }} />
                  <span className="venta-module__section-title">Forma de pago</span>
                </div>
                <div className="venta-module__section-body">
                  <Row gutter={[16, 12]}>
                    {/* Fila 1: NEGOCIO, VALOR EFECTIVO, VALOR CHEQUE */}
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>NEGOCIO</label>
                        <Select 
                          size="small" 
                          value={tipoNegocio} 
                          onChange={(value) => setTipoNegocio(value)}
                          className="venta-module__select"
                          placeholder="Seleccionar"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>VALOR EFECTIVO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>VALOR CHEQUE</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    {/* Fila 2: MONEDA, PRESENTACIÓN EF, PRESENTACIÓN CH */}
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>MONEDA</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          loading={loadingCurrencies.value}
                          options={currencyOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>PRESENTACIÓN EF:</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="venta-module__field-group">
                        <label>PRESENTACIÓN CH:</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    {/* Fila 3: BANCO, CUENTA, NO CHEQUE (solo si no es Efectivo) */}
                    {tipoNegocio && paymentMethodOptions.value?.find(pm => pm.value === tipoNegocio)?.label?.toLowerCase() !== 'efectivo' && (
                      <>
                        <Col xs={24} sm={12} md={8}>
                          <div className="venta-module__field-group">
                            <label>BANCO</label>
                            <Input size="small" />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div className="venta-module__field-group">
                            <label>CUENTA</label>
                            <Input size="small" />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div className="venta-module__field-group">
                            <label>CHEQUE</label>
                            <Input size="small" />
                          </div>
                        </Col>
                      </>
                    )}
                    {/* Fila 4: EQUIVALENCIA */}
                    <Col span={24}>
                      <div className="venta-module__field-group">
                        <label>EQUIVALENCIA EN MONEDA DE CAMBIO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Cliente */}
              <div className="venta-module__section venta-module__section--full">
                <div className="venta-module__section-header">
                  <UserOutlined style={{ marginRight: 8 }} />
                  <span className="venta-module__section-title">Cliente</span>
                </div>
                <div className="venta-module__section-body">
                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12}>
                      <div className="venta-module__field-group">
                        <label>TIPO DOC.</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="venta-module__select"
                          options={idTypeOptions}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="venta-module__field-group">
                        <label>IDENTIFICACIÓN</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="venta-module__client-actions">
                        <Button type="primary" icon={<EditOutlined />} className="venta-module__client-btn">
                          Capturar firma
                        </Button>
                        <Button type="primary" icon={<FileTextOutlined />} className="venta-module__client-btn">
                          Digitalizar documento
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Persona Jurídica */}
              <div className="venta-module__section venta-module__section--full">
                <div className="venta-module__section-header venta-module__section-header--check">
                  <Checkbox checked={personaJuridica} onChange={(e) => setPersonaJuridica(e.target.checked)} />
                  <BankOutlined style={{ marginLeft: 8, marginRight: 8 }} />
                  <span className="venta-module__section-title">Persona jurídica</span>
                </div>
                <div className="venta-module__section-body">
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={8} md={6}>
                        <div className="venta-module__field-group">
                          <label>TIPO DOC.</label>
                          <Select 
                            size="small" 
                            placeholder="Seleccionar" 
                            className="venta-module__select" 
                            disabled={!personaJuridica}
                            options={idTypeOptions}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={16} md={18}>
                        <div className="venta-module__field-group">
                          <label>&nbsp;</label>
                          <Input size="small" disabled={!personaJuridica} />
                        </div>
                      </Col>
                      <Col xs={24} sm={8} md={6}>
                        <div className="venta-module__field-group">
                          <label>DECLARANTE</label>
                          <Select 
                            size="small" 
                            placeholder="Seleccionar" 
                            className="venta-module__select" 
                            disabled={!personaJuridica}
                            options={idTypeOptions}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={16} md={18}>
                        <div className="venta-module__field-group">
                          <label>&nbsp;</label>
                          <Input size="small" disabled={!personaJuridica} />
                        </div>
                      </Col>
                    </Row>
                  </div>
              </div>

              {/* Proposito */}
              <div className="venta-module__section venta-module__section--full">
                <div className="venta-module__section-body">
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <div className="venta-module__field-group">
                        <label>PROPOSITO DIVISAS</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="venta-module__field-group">
                        <label>OBSERVACIONES</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="venta-module__actions">
              <Button icon={<SearchOutlined />}>Buscar</Button>
              <Button type="primary" icon={<PlusOutlined />}>Nuevo</Button>
              <Button danger icon={<DeleteOutlined />}>Eliminar</Button>
              <Button icon={<EditOutlined />}>Editar</Button>
              <Button icon={<SaveOutlined />}>Grabar</Button>
              <Button icon={<UndoOutlined />}>Deshacer</Button>
              <Button icon={<CopyOutlined />}>Copiar</Button>
              <Button danger icon={<CloseOutlined />}>Salir</Button>
              <Button icon={<PrinterOutlined />}>Imprimir</Button>
              <Button icon={<FilePdfOutlined />}>DDC</Button>
            </div>
          </>
        )}

        {/* ADICIONALES */}
        {innerTab === 'adicionales' && (
          <div className="venta-module__adicionales">
            <div className="venta-module__adicionales-section">
              <div className="venta-module__adicionales-header">
                <span className="venta-module__adicionales-title">Documento de venta</span>
              </div>
              <div className="venta-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={8}><div className="venta-module__field-group"><label>FORMATOS DISPONIBLES</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="venta-module__field-group"><label>NÚMERO DOCUMENTO</label><Input size="small" /></div></Col>
                  <Col span={4}><div className="venta-module__field-group"><label>ARCHIVO FORMATO</label><Input size="small" /></div></Col>
                  <Col span={4}><div className="venta-module__field-group"><label>&nbsp;</label><Button icon={<FilePdfOutlined />} className="venta-module__pdf-btn" /></div></Col>
                </Row>
              </div>
            </div>
            <div className="venta-module__adicionales-section">
              <div className="venta-module__adicionales-header">
                <span className="venta-module__adicionales-title">Cheque</span>
              </div>
              <div className="venta-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={14}><div className="venta-module__field-group"><label>FORMATOS DISPONIBLES</label><Input size="small" /></div></Col>
                  <Col span={2}><div className="venta-module__field-group"><label>&nbsp;</label><Button type="primary" icon={<FilePdfOutlined />} size="small" className="venta-module__client-btn" /></div></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={8}><div className="venta-module__field-group"><label>NÚMERO CHEQUE</label><Input size="small" /></div></Col>
                  <Col span={8}><Checkbox style={{ marginTop: 24 }}>Formato cheque externo</Checkbox></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={16}><div className="venta-module__field-group"><label>ARCHIVO FORMATO</label><Input size="small" /></div></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={16}><div className="venta-module__field-group"><label>FORMATOS CON TÍTULOS</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="venta-module__field-group"><label>&nbsp;</label><Button type="primary" icon={<TagsOutlined />} className="venta-module__client-btn">Títulos</Button></div></Col>
                </Row>
              </div>
            </div>
            <div className="venta-module__adicionales-section">
              <div className="venta-module__adicionales-header">
                <span className="venta-module__adicionales-title">Origen de fondos</span>
              </div>
              <div className="venta-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={16}><div className="venta-module__field-group"><label>PLANTILLA CARTA</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="venta-module__field-group"><label>&nbsp;</label><Button>Generar</Button></div></Col>
                </Row>
              </div>
            </div>
            <div className="venta-module__adicionales-section">
              <div className="venta-module__adicionales-header">
                <span className="venta-module__adicionales-title">Comprobante de Ingreso</span>
              </div>
              <div className="venta-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={8}><div className="venta-module__field-group"><label>DOCUMENTO INGRESO</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="venta-module__field-group"><label>FORMATO</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="venta-module__field-group"><label>&nbsp;</label><Button icon={<FilePdfOutlined />} className="venta-module__pdf-btn" /></div></Col>
                </Row>
              </div>
            </div>
            <div className="venta-module__adicionales-section">
              <div className="venta-module__adicionales-header">
                <span className="venta-module__adicionales-title">Otros impuestos</span>
              </div>
              <div className="venta-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={6}><div className="venta-module__field-group"><label>ReteIVA</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="venta-module__field-group"><label>ReteICA</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="venta-module__field-group"><label>4 X MIL</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="venta-module__field-group"><label>&nbsp;</label><Button type="primary" className="venta-module__client-btn">Calcular</Button></div></Col>
                </Row>
              </div>
            </div>
          </div>
        )}

        {/* LISTA */}
        {innerTab === 'lista' && (
          <div className="venta-module__lista">
            <div className="venta-module__lista-table">
              <Table columns={listaColumns} dataSource={listaData} pagination={false} size="small" locale={{ emptyText: 'Sin datos' }} />
            </div>
            <div className="venta-module__lista-total">
              <Text className="venta-module__lista-total-label">Total registros:</Text>
              <Text className="venta-module__lista-total-value">{listaData.length}</Text>
            </div>
          </div>
        )}
        </div>

        {/* Sidebar - Siempre visible */}
        <div className="venta-module__sidebar">
          <div className="venta-module__stats">
            <div className="venta-module__stat">
              <span className="venta-module__stat-label">Ventas Dia</span>
              <span className="venta-module__stat-value">$0</span>
            </div>
            <div className="venta-module__stat">
              <span className="venta-module__stat-label">Ventas Mes</span>
              <span className="venta-module__stat-value">$0</span>
            </div>
            <div className="venta-module__stat">
              <span className="venta-module__stat-label">Ventas Año</span>
              <span className="venta-module__stat-value">$0</span>
            </div>
          </div>
          <div className="venta-module__sidebar-buttons">
            {/* <Button icon={<CloudUploadOutlined />}>Adjuntar DIAN</Button>
            <Button icon={<FileTextOutlined />}>Ver Documento DIAN</Button>
            <Button icon={<NotaCreditoIcon />}>Ver Nota Crédito DIAN</Button>
            <Button icon={<QrcodeOutlined />}>Imprimir QR</Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export { VentaModule }
export default VentaModule
