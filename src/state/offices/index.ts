import { signal, computed } from '@preact/signals-react'
import { type IOffice } from '@/interfaces'

export const OfficesState = {
  // Data
  offices: signal<IOffice[]>([]),
}

export const officesSelectors = {
  officeOptions: computed(() =>
    OfficesState.offices.value?.map((office) => ({
      label: office.name,
      value: office.uid,
    }))
  ),
}
