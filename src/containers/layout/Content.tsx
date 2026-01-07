import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import { ErrorBoundary } from '@/containers/views/errorBoundary'

import './index.scss'

const { Content } = Layout

/**
 * ContentComponent
 *
 * This component serves as the main content area of the application layout. It uses Ant Design's Layout component
 * and includes an ErrorBoundary to catch and display errors. The Outlet component is used to render the matched child route.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ContentComponent: React.FC = (): JSX.Element => {
  return (
    <Layout>
      <Content className='content'>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Content>
    </Layout>
  )
}
