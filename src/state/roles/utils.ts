import { type IRole } from '@/interfaces'

export const setDefaultRole = ({
  roleUid,
  roles,
}: {
  roleUid: string
  roles: IRole[]
}): IRole[] => {
  return [...roles].map((item) => {
    item.default = item.uid === roleUid
    return item
  })
}
