import { type IRole } from '@/interfaces'

export const setDefaultRole = ({
  roleId,
  roles,
}: {
  roleId: number
  roles: IRole[]
}): IRole[] => {
  return [...roles].map((item) => {
    item.default = item.id === roleId
    return item
  })
}
