import { type FC } from 'react'

import './loader.module.scss'

export const Loader: FC = () => (
  <div className='loaderContent'>
    <svg className='loaderContentCircle' viewBox='0 0 50 50'>
      <circle
        className='isoContentLoaderCircle'
        cx='25'
        cy='25'
        fill='none'
        r='20'
        strokeWidth='3.6'
      />
    </svg>
  </div>
)
