import React, { useEffect, useState } from 'react'
import axiosInstance from '@/axios'
import { BsCheckLg } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { BsFloppyFill  } from "react-icons/bs";
import { UsersState, CashBoxesState } from '@/state'
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  notification,
  Modal,
  Button,
  Steps,
  Alert,
  Table,
  message
} from 'antd'

import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form
const { Option } = Select
const { TextArea } = Input

interface cashBoxInterface {
  uid: string;
  name: string;
}

interface officesInterface {
  uid: string;
  name: string;
}

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json' } : {}
}

const CashBoxesForTenantForm = ({
  userUid,
  onCreated,
}: {
  userUid?: any
  onCreated: () => void
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userUID, setUserUID] = useState<string>("");
  const [offices, setOffices] = useState<officesInterface[]>([]);
  const [cashBoxes, setCashBoxes] = useState<cashBoxInterface[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>()

  useEffect(() => {
    const tenantUid = sessionStorage.getItem('tenant_uid')
    setUserUID(userUid)
    setCashBoxes([])
    setSelectedOffice(undefined)

    // Validar que tenant_uid exista
    if (!tenantUid) {
      console.log('⚠️ tenant_uid no está disponible en sessionStorage')
      setCashBoxes([])
      return
    }

    const fetchOffices = async () => {
      try {
        const res = await axiosInstance.post(
          '/v1/tenants/offices/all',
          { 
            tenantUId: tenantUid
          },
          { headers: getTenantHeaders() }
        )

        //console.log('✅ Respuesta de officesData:', JSON.stringify(res))
        const officesData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || []
        
        //console.log(`📌 Cajas cargadas: ${officesData.length}`)
        setOffices(officesData)
      } catch (error: any) {
        //console.error('❌ Error consultando las oficinas:', error.response?.data || error.message)
        message.error('Error cargando oficinas')
      }
    }

    // Ejecutar ambas requests en paralelo
    Promise.all([fetchOffices()])
      .finally(() => {
        if (userUid) form.setFieldsValue(userUid)
        else form.resetFields()
      })
  }, [userUid, form])

  const handleAddCashBoxes = async (officeUId: string) => {
    // Cambiar a la pestaña de asignación
    //console.log(`UserUID: ${userUID} - OfficeUID: ${officeUId}`);
    
    setCashBoxes([]); //Limpia el estado de cashboxes antes de cargar nuevos

    await axiosInstance.get(
      `/v1/cashboxes/all?officeUId=${officeUId}`,
      { headers: getTenantHeaders() },
    ).then((res: any) => {
      const cashboxesData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || []
      
      console.log(`📌 Cajas cargadas para la oficina ${officeUId}: ${cashboxesData.length}`);
      setCashBoxes(cashboxesData);
    }).catch((error: any) => {
      message.error('Error cargando cajas para la oficina seleccionada');
    });
  }

  const getCashBoxesUser = async (userUId: string) => {
    try {
      setCashBoxes([])
      const res = await axiosInstance
        .post(
          '/v1/users/cashboxes/list',
          { uid: userUId },
          { headers: getTenantHeaders() }
        )
        .then((res: any) => {
          const cashBoxesData = Array.isArray(res?.data)
            ? res.data
            : res?.data?.data || []

          UsersState.userCashBoxes.value = cashBoxesData
        })

      //console.log(`✅ Respuesta de cajas del usuario: ${cashBoxes}`)
    } catch (error) {
      console.error('Error fetching boxes for user:', error)
      return []
    }
  }

  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      
      if (userUID) {
        // POST para crear
        await axiosInstance.post(
          '/v1/users/cashboxes/add',
          { uid: userUID, cashboxUId: values.cashBoxesUId},
          { headers: getTenantHeaders() }
        ).then((res: any) => {
          //console.log(`Respuesta: ${JSON.stringify(res)}`);
          getCashBoxesUser(userUID)
        }).catch((error: any) => {
          throw new Error(`Error al asignar la caja al usuario actual: ${error.response?.data || error.message}`);
        });

        message.success('Caja asignada correctamente')
      }
      onCreated()
    } catch (err) {
      message.error(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      layout='vertical'
      form={form}
      requiredMark={true}
      size='middle'
      className='client-form'
      onFinish={handleFinish}
      preserve={true}
    >
      <div className='form-section' style={{ display: 'block'}}>
        <Title level={5} className='section-title'>
          Asignación de cajas
        </Title>
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <FormItem
              label='Seleccionar una Oficina'
              name='officesUId'
              rules={[{ required: true, message: 'Debe seleccionar una obligatorio' }]}
            >
              <Select
                placeholder='Seleccione...'
                showSearch
                optionFilterProp='children'
                onChange={(val) => {
                    setSelectedOffice(val)
                    handleAddCashBoxes(val)
                  }}
              >
                {offices.map((type: any) => (
                  <Option key={type.uid} value={type.uid}>
                    {type.label || type.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>

          <Col xs={24}>
            <FormItem
              label='Seleccionar una caja para Asignar'
              name='cashBoxesUId'
              rules={[{ required: true, message: 'Debe seleccionar una obligatorio' }]}
            >
              <Select
                placeholder='Seleccione...'
                showSearch
                optionFilterProp='children'
              >
                {cashBoxes.map((type: any) => (
                  <Option key={type.uid} value={type.uid}>
                    {type.label || type.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          {/* Puedes agregar más campos aquí según el schema */}
          <Col xs={24}>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} block>
                <BsFloppyFill  size={16} color='white' />Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  )
}

export default CashBoxesForTenantForm
