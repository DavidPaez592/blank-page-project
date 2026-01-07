export interface IOffice {
  uid: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface IOfficesGetAllResponse extends Array<IOffice> {}
