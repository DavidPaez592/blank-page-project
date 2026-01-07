import { Layout } from 'antd'

import { SiderComponent } from './Sider'
import { ContentComponent } from './Content'

import './index.scss'

export const Dashboard: React.FC = () => {
  return (
    <Layout className='layout'>
      <SiderComponent />
      <ContentComponent />
    </Layout>
  )
}
