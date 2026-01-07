import { FaStar } from 'react-icons/fa'
import * as faReactIcons from 'react-icons/fa6'
import * as mdReactIcons from 'react-icons/md'
import * as aiReactIcons from 'react-icons/ai'

interface IconProps {
  iconName?: string | null
  size?: number
}

const IconComponent: React.FC<IconProps> = ({ iconName, size }) => {
  let IconComponent:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | undefined

  IconComponent = faReactIcons[iconName as keyof typeof faReactIcons]

  if (!IconComponent) {
    IconComponent = mdReactIcons[iconName as keyof typeof mdReactIcons]
  }

  if (!IconComponent) {
    IconComponent = aiReactIcons[iconName as keyof typeof aiReactIcons]
  }

  return IconComponent ? (
    <IconComponent fontSize={size} />
  ) : (
    <FaStar fontSize={size} />
  )
}

export default IconComponent
