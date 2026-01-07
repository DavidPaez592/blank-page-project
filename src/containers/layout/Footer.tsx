import { Layout } from 'antd'

const { Footer } = Layout

import './index.scss'

export const FooterComponent: React.FC = () => {
  return (
    <Footer className='footer'>
      WeAre Dev S.A.S. ©{new Date().getFullYear()} Linea base
    </Footer>
  )
}
