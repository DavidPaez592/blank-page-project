import React, { useEffect, useState } from 'react'
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  Select,
  DatePicker,
  Typography,
  Space,
  Row,
  Col,
  notification,
} from 'antd'
import { MdWarning, MdAdd } from 'react-icons/md'
import { SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { ClientRiskAlertsState } from '@/state/client-risk-alerts'
import { clientRiskAlertsStateActions } from '@/state/client-risk-alerts/actions'
import { ClientsState } from '@/state/clients'
import { CLIENT_RISK_ALERT_FORM_FIELDS } from '@/constants/forms'
import {
  EClientRiskAlertStatus,
  EClientRiskAlertReason,
  type IClientRiskAlert,
} from '@/interfaces/client-risk-alerts'

import './form.scss'

const { Title } = Typography
const { Item: FormItem } = Form
const { Option } = Select
const { TextArea } = Input

// Options for Status
const STATUS_OPTIONS = [
  { label: 'Activa', value: EClientRiskAlertStatus.Active },
  { label: 'En Revisión', value: EClientRiskAlertStatus.UnderReview },
  { label: 'Resuelta - Falso Positivo', value: EClientRiskAlertStatus.ResolvedFalsePositive },
  { label: 'Resuelta - Confirmada', value: EClientRiskAlertStatus.ResolvedConfirmed },
]

// Options for Reason
const REASON_OPTIONS = [
  { label: 'Patrón de Transacción Inusual', value: EClientRiskAlertReason.UnusualTransactionPattern },
  { label: 'Inconsistencia en Documentos', value: EClientRiskAlertReason.DocumentInconsistency },
  { label: 'Coincidencia en Lista de Sanciones Interna', value: EClientRiskAlertReason.SanctionListMatchInternal },
  { label: 'Intento de Fraude Reportado', value: EClientRiskAlertReason.ReportedFraudAttempt },
  { label: 'Otro', value: EClientRiskAlertReason.Other },
]

export const ClientRiskAlertsFormDrawer: React.FC = (): JSX.Element => {
  const [alertForm] = Form.useForm()
  const [isResolved, setIsResolved] = useState<boolean>(false)

  useEffect(() => {
    if (ClientRiskAlertsState.openDrawer.value) {
      alertForm.resetFields()
      setIsResolved(false)

      const loadValues = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))

        const currentAlert = ClientRiskAlertsState.currentAlert.value

        if (currentAlert && Object.keys(currentAlert).length > 0 && currentAlert.uid) {
          const formValues: any = {}

          if (currentAlert.clientUId) {
            formValues.clientUId = currentAlert.clientUId
          }
          if (currentAlert.reason) {
            formValues.reason = currentAlert.reason
          }
          if (currentAlert.notes) {
            formValues.notes = currentAlert.notes
          }
          if (currentAlert.status) {
            formValues.status = currentAlert.status
            setIsResolved(
              currentAlert.status === EClientRiskAlertStatus.ResolvedFalsePositive ||
              currentAlert.status === EClientRiskAlertStatus.ResolvedConfirmed
            )
          }
          if (currentAlert.resolvedAt && dayjs(currentAlert.resolvedAt).isValid()) {
            formValues.resolvedAt = dayjs(currentAlert.resolvedAt)
          }

          alertForm.setFieldsValue(formValues)
        } else {
          // Default values for new alert
          const defaultValues: any = {
            status: EClientRiskAlertStatus.Active,
          }

          // If clientUId is passed, set it
          if (currentAlert?.clientUId) {
            defaultValues.clientUId = currentAlert.clientUId
          }

          alertForm.setFieldsValue(defaultValues)
        }
      }

      loadValues()
    }
  }, [ClientRiskAlertsState.openDrawer.value])

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.status) {
      const newStatus = changedValues.status
      const isResolvedStatus = 
        newStatus === EClientRiskAlertStatus.ResolvedFalsePositive ||
        newStatus === EClientRiskAlertStatus.ResolvedConfirmed
      
      setIsResolved(isResolvedStatus)
      
      // If changing to resolved status, set resolvedAt to now
      if (isResolvedStatus && !alertForm.getFieldValue('resolvedAt')) {
        alertForm.setFieldsValue({ resolvedAt: dayjs() })
      }
      // If changing from resolved to non-resolved, clear resolvedAt
      else if (!isResolvedStatus) {
        alertForm.setFieldsValue({ resolvedAt: undefined })
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await alertForm.validateFields()

      const currentAlert = ClientRiskAlertsState.currentAlert.value
      const isEditing = currentAlert && Object.keys(currentAlert).length > 0 && currentAlert.uid

      let alertData: any = {
        clientUId: values.clientUId,
        reason: values.reason,
        notes: values.notes || null,
        status: values.status,
      }

      // Only include resolvedAt for updates, not for creates
      if (isEditing) {
        // Only send resolvedAt if the status is actually resolved
        const isResolvedStatus = 
          values.status === EClientRiskAlertStatus.ResolvedFalsePositive ||
          values.status === EClientRiskAlertStatus.ResolvedConfirmed
        
        if (isResolvedStatus) {
          if (values.resolvedAt && dayjs(values.resolvedAt).isValid()) {
            alertData.resolvedAt = dayjs(values.resolvedAt).format('YYYY-MM-DD')
          } else {
            // If status is resolved but no date provided, use current date
            alertData.resolvedAt = dayjs().format('YYYY-MM-DD')
          }
        }
        // Don't include resolvedAt field at all if status is not resolved
      }

      let success = false
      if (isEditing && currentAlert.uid) {
        success = await clientRiskAlertsStateActions.update(currentAlert.uid, alertData)
      } else {
        success = await clientRiskAlertsStateActions.create(alertData)
      }

      if (success) {
        alertForm.resetFields()
        setIsResolved(false)
      }
    } catch (error) {
      console.error('Error submitting alert:', error)
    }
  }

  const isEditing =
    ClientRiskAlertsState.currentAlert.value &&
    Object.keys(ClientRiskAlertsState.currentAlert.value).length > 0 &&
    ClientRiskAlertsState.currentAlert.value.uid

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdWarning size={24} />
          <span>
            {isEditing ? 'Actualizar Alerta de Riesgo' : 'Crear Nueva Alerta de Riesgo'}
          </span>
        </div>
      }
      placement='right'
      width='60%'
      onClose={clientRiskAlertsStateActions.closeDrawer}
      open={ClientRiskAlertsState.openDrawer.value}
      className='client-risk-alerts-form-drawer'
      destroyOnClose
      maskClosable={false}
      styles={{
        body: { paddingBottom: 80 },
      }}
    >
      <div className='drawer-content'>
        <Form
          form={alertForm}
          layout='vertical'
          requiredMark={true}
          size='middle'
          className='client-risk-alert-form'
          onValuesChange={handleValuesChange}
        >
          <div className='form-section'>
            <Title level={5} className='section-title'>
              ⚠️ Información de la Alerta
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24}>
                <FormItem
                  name={CLIENT_RISK_ALERT_FORM_FIELDS.clientUId.value}
                  label='Cliente'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona el cliente',
                    },
                  ]}
                >
                  {ClientsState.searchedClient.value ? (
                    <Input 
                      value={`${ClientsState.searchedClient.value.fullName} - ${ClientsState.searchedClient.value.identificationNumber}`}
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  ) : (
                    <Input 
                      placeholder='Cliente no encontrado'
                      disabled={!!isEditing} // No permitir cambiar cliente en edición
                    />
                  )}
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_RISK_ALERT_FORM_FIELDS.reason.value}
                  label='Motivo de la Alerta'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona el motivo de la alerta',
                    },
                  ]}
                >
                  <Select
                    placeholder='Selecciona el motivo'
                    showSearch
                    optionFilterProp='children'
                  >
                    {REASON_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_RISK_ALERT_FORM_FIELDS.status.value}
                  label='Estado de la Alerta'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona el estado de la alerta',
                    },
                  ]}
                >
                  <Select
                    placeholder='Selecciona el estado'
                    showSearch
                    optionFilterProp='children'
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              {isResolved && (
                <Col xs={24} sm={12}>
                  <FormItem
                    name={CLIENT_RISK_ALERT_FORM_FIELDS.resolvedAt.value}
                    label='Fecha de Resolución'
                  >
                    <DatePicker
                      showTime
                      placeholder='Selecciona fecha y hora'
                      format='DD/MM/YYYY HH:mm'
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
              )}

              <Col xs={24}>
                <FormItem
                  name={CLIENT_RISK_ALERT_FORM_FIELDS.notes.value}
                  label='Notas Adicionales'
                  rules={[
                    { max: 500, message: 'Máximo 500 caracteres' },
                  ]}
                >
                  <TextArea
                    placeholder='Describe los detalles de la alerta de riesgo...'
                    rows={4}
                    autoSize={{ minRows: 4, maxRows: 8 }}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>

        <div className='drawer-actions'>
          <FloatButton
            icon={<SaveOutlined />}
            type='primary'
            tooltip={isEditing ? 'Actualizar Alerta' : 'Guardar Alerta'}
            onClick={handleSubmit}
            className='submit-button'
            style={{
              right: 24,
              bottom: 24,
              width: 60,
              height: 60,
            }}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default ClientRiskAlertsFormDrawer