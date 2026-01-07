import { type FC } from 'react'
import { Link } from 'react-router-dom'

import logo from '@/assets/images/logo.png'

import './index.scss'

export const Logo: FC<{
  collapsed?: boolean
  styles?: React.CSSProperties
}> = ({ collapsed = false, styles }) => {
  return (
    <div className='logo-wrapper'>
      <Link to='/'>
        <img
          alt='logo'
          src={logo}
          style={{
            maxHeight: '55px',
            // visibility: collapsed ? 'hidden' : 'visible',
            ...styles,
          }}
        />
      </Link>
    </div>
  )
}
