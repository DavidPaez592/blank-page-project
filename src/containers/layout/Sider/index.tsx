import { Layout, Menu } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import IconComponent from '@/components/iconComponent'
import { Logo } from '@/components/logo'
import { SidebarUserInfo } from '@/containers/layout/Sider/UserInfo'
import { useApp } from '@/hooks/useApp'
import { useSidebar } from '@/hooks/useSidebar'
import { AuthState } from '@/state'

const { Sider } = Layout

export const SiderComponent: React.FC = () => {
  const {
    current,
    isCollapsed,
    mode,
    onOpenChange,
    openKeys,
    uncollapseSidebar,
    collapseSidebar,
    setCurrent,
  } = useSidebar()
  const { view } = useApp()

  /**
   * Handle collapse state
   */
  const sidebarRef = useRef<HTMLDivElement>(null)

  /**
   * Handle click outside
   */
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (view.value === 'Desktop' && !isCollapsed) return

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        collapseSidebar()
      } else {
        uncollapseSidebar()
      }
    },
    [isCollapsed]
  )

  /**
   * Generate items for the menu
   */
  const items = AuthState.menu.value.map((menuItem) => {
    /**
     * Remove the createdAt, updatedAt and maskedUId properties from the menu item
     */
    delete menuItem.createdAt
    delete menuItem.updatedAt
    delete menuItem.maskedUId

    /**
     * If the menu item has children, we need to map them as well
     */
    if (menuItem.children && menuItem.children?.length > 0) {
      /**
       * Return the menu item with the icon and the children
       */
      return {
        ...menuItem,
        icon: <IconComponent iconName={menuItem.icon} />,
        children: menuItem.children.map((child) => {
          /**
           * Remove the createdAt, updatedAt and maskedUId properties from the child
           */
          delete child.createdAt
          delete child.updatedAt
          delete child.maskedUId

          /**
           * Return the child with the icon and the label
           */
          return {
            ...child,
            icon: <IconComponent iconName={menuItem.icon} />,
            label: <Link to={child.url}>{child.label}</Link>,
          }
        }),
      }
    }

    /**
     * Remove the children property from the menu item
     */
    delete menuItem.children

    /**
     * Return the menu item with the icon and the label
     */
    return {
      ...menuItem,
      icon: <IconComponent iconName={menuItem.icon} />,
      label: <Link to={menuItem.url}>{menuItem.label}</Link>,
    }
  })

  const handleMenuClick = (e: { key: string }) => {
    setCurrent([e.key])
  }

  /**
   * Suscribe to the click outside event
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <Sider
      className={['sider', isCollapsed ? 'collapsed' : 'extended'].join(' ')}
      collapsible
      collapsed={isCollapsed}
      itemScope
      theme='dark'
      trigger={null}
      ref={sidebarRef}
    >
      <div className='sider-container'>
        <Logo
          collapsed={isCollapsed}
          styles={{
            padding: isCollapsed ? '10px' : '4px',
            margin: isCollapsed ? '0px' : '20px',
          }}
        />

        <Menu
          className={[
            'sider-menu',
            isCollapsed ? 'collapsed' : 'extended',
          ].join(' ')}
          items={items}
          openKeys={isCollapsed ? [] : openKeys.value}
          selectedKeys={current.value}
          theme='dark'
          onOpenChange={onOpenChange}
          mode='inline'
          onClick={handleMenuClick}
        />

        <SidebarUserInfo />
      </div>
    </Sider>
  )
}
