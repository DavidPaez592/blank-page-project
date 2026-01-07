import React from 'react'
import { Tabs, Alert, Divider } from 'antd'
import ResultItemsList from './ResultItemsList'

interface ResultDetailsProps {
  uploadResult: any
  successPage: number
  failedPage: number
  pageSize: number
  onSuccessPageChange: (page: number) => void
  onFailedPageChange: (page: number) => void
}

const ResultDetails: React.FC<ResultDetailsProps> = ({
  uploadResult,
  successPage,
  failedPage,
  pageSize,
  onSuccessPageChange,
  onFailedPageChange,
}) => {
  const hasResults =
    (uploadResult.successItems && uploadResult.successItems.length > 0) ||
    (uploadResult.failedItems && uploadResult.failedItems.length > 0)

  if (!hasResults) return null

  return (
    <>
      <Divider />
      <Tabs
        defaultActiveKey='success'
        items={[
          {
            key: 'success',
            label: `Exitosos (${uploadResult.success})`,
            children:
              uploadResult.successItems &&
              uploadResult.successItems.length > 0 ? (
                <ResultItemsList
                  items={uploadResult.successItems}
                  currentPage={successPage}
                  pageSize={pageSize}
                  onPageChange={onSuccessPageChange}
                  type='success'
                />
              ) : (
                <Alert
                  message='No hay registros exitosos'
                  type='info'
                  showIcon
                />
              ),
          },
          {
            key: 'errors',
            label: `Errores (${uploadResult.failed})`,
            children:
              uploadResult.failedItems &&
              uploadResult.failedItems.length > 0 ? (
                <ResultItemsList
                  items={uploadResult.failedItems}
                  currentPage={failedPage}
                  pageSize={pageSize}
                  onPageChange={onFailedPageChange}
                  type='error'
                />
              ) : (
                <Alert message='No hay errores' type='success' showIcon />
              ),
          },
        ]}
      />
    </>
  )
}

export default ResultDetails
