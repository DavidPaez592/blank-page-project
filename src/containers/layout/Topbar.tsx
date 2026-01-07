import { Layout } from 'antd'

import { TopbarMenuIcon } from '@/config/icon'
import { useApp } from '@/hooks/useApp'
import { AppState } from '@/state'
import { TopbarUser } from './TopbarUser'

const { Header } = Layout

const { collapsed, openDrawer } = AppState

export const HeaderComponent: React.FC = () => {
  const { handleToggleCollapsed } = useApp()

  const isCollapsed = collapsed.value && !openDrawer.value

  const styling: React.CSSProperties = {
    height: 70,
    position: 'fixed',
    width: '100%',
  }

  return (
    <Header
      className={isCollapsed ? 'isoTopbar collapsed' : 'isoTopbar'}
      style={styling}
    >
      <div className='isoLeft'>
        <button
          className={
            isCollapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
          }
          onClick={handleToggleCollapsed}
        >
          <TopbarMenuIcon size={24} />
        </button>
      </div>

      <ul className='isoRight'>
        <li className='isoUser'>
          <TopbarUser />
        </li>
      </ul>
    </Header>
  )
}
