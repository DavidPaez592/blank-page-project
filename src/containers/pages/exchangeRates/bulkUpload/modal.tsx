import React, { useState, useEffect } from 'react'
import { Modal, Form, Divider, message, Button, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import dayjs from 'dayjs'

import { useGetAllOffices } from '@/hooks/useOffices'
import { exchangeRatesStateActions } from '@/state/exchangeRates/actions'

import UploadForm from './components/UploadForm'
import ResultSummary from './components/ResultSummary'
import ResultDetails from './components/ResultDetails'

interface BulkUploadModalProps {
  open: boolean
  onCancel: () => void
  selectedOfficeUId?: string
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  open,
  onCancel,
  selectedOfficeUId,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [successPage, setSuccessPage] = useState(1)
  const [failedPage, setFailedPage] = useState(1)
  const pageSize = 10

  const { officeOptions, loading: officesLoading } = useGetAllOffices()

  useEffect(() => {
    if (open && selectedOfficeUId) {
      form.setFieldsValue({ officeUId: selectedOfficeUId })
    }
  }, [open, selectedOfficeUId, form])

  const handleUpload = async () => {
    try {
      const values = await form.validateFields()
      if (fileList.length === 0) return

      setLoading(true)
      setUploadResult(null)

      const file = fileList[0].originFileObj
      if (!file) return

      const result = await exchangeRatesStateActions.bulkUploadExchangeRates({
        date: values.date.format('YYYY-MM-DD'),
        officeUId: values.officeUId,
        file,
      })

      if (result.data) {
        setUploadResult(result.data)
      } else {
        setUploadResult({
          success: 0,
          failed: 1,
          total: 1,
          successItems: [],
          failedItems: [
            {
              data: {},
              row: 0,
              success: false,
              message: result.message || 'Error desconocido en la carga',
            },
          ],
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      message.error('Error en la carga del archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setUploadResult(null)
    setSuccessPage(1)
    setFailedPage(1)
    onCancel()
  }

  const handleNewUpload = () => {
    setUploadResult(null)
    setSuccessPage(1)
    setFailedPage(1)
  }

  return (
    <Modal
      title='Carga Masiva de Tasas de Cambio'
      open={open}
      onCancel={loading ? undefined : handleCancel}
      footer={null}
      width={800}
      destroyOnClose
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
    >
      {!uploadResult && (
        <UploadForm
          form={form}
          loading={loading}
          fileList={fileList}
          onFileChange={setFileList}
          onUpload={handleUpload}
          onCancel={handleCancel}
          officeOptions={officeOptions.value || []}
          officesLoading={officesLoading.value}
        />
      )}

      {uploadResult && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleNewUpload}
                type='default'
              >
                Nueva Carga
              </Button>
            </Space>
          </div>
          <ResultSummary uploadResult={uploadResult} />
          <Divider />
          <ResultDetails
            uploadResult={uploadResult}
            successPage={successPage}
            failedPage={failedPage}
            pageSize={pageSize}
            onSuccessPageChange={setSuccessPage}
            onFailedPageChange={setFailedPage}
          />
        </>
      )}
    </Modal>
  )
}

export default BulkUploadModal
