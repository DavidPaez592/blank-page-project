import * as FaIcons from 'react-icons/fa6'
import * as AiIcons from 'react-icons/ai'
import * as MdIcons from 'react-icons/md'

type FaIconKeys = keyof typeof FaIcons
export const FA_ICONS_KEYS = Object.keys(FaIcons) as FaIconKeys[]

type AiIconKeys = keyof typeof AiIcons
export const AI_ICONS_KEYS = Object.keys(AiIcons) as AiIconKeys[]

type MdIconKeys = keyof typeof MdIcons
export const MD_ICONS_KEYS = Object.keys(MdIcons) as MdIconKeys[]

export const ICONS_LIST_OPTIONS = [
  ...FA_ICONS_KEYS,
  ...AI_ICONS_KEYS,
  ...MD_ICONS_KEYS,
].map((item) => ({
  value: item,
  label: item,
}))
