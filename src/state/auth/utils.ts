/* eslint-disable jsdoc/require-jsdoc */
import { type IMenuItem } from '@/interfaces'

export const getRoutePathsFromMenu = (menuItems: IMenuItem[]): string[] => {
  const pathsList: string[] = []

  menuItems.forEach((element: IMenuItem) => {
    if (Array.isArray(element.children) && element.children?.length > 0) {
      pathsList.push(...getRoutePathsFromMenu(element.children))
    }

    if (element.url !== undefined) {
      pathsList.push(element.url)
    }
  })

  return pathsList
}
