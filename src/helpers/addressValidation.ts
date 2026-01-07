const getColombiaAddressRegex = (): RegExp => {
  const regexString = import.meta.env.VITE_COLOMBIA_ADDRESS_REGEX
  if (!regexString) {
    console.warn(
      'VITE_COLOMBIA_ADDRESS_REGEX not found in environment variables, using default'
    )
    return /^(Avenida|Calle|Carrera|Circular|Diagonal|Transversal|Autopista|AV|CL|CR|KR|DG|TV)\s+(\d{1,3}(?:\s?[A-Z]{1,3})?(?:\s?Bis)?(?:\s?(Norte|Sur|Este|Oeste|N|S|E|O))?)\s?#\s?(\d{1,3}(?:\s?[A-Z]{1,3})?)\s?-\s?(\d{1,4})(.*)?$/i
  }
  return new RegExp(regexString, 'i')
}

export const COLOMBIA_ADDRESS_REGEX = getColombiaAddressRegex()

export interface AddressValidationResult {
  isValid: boolean
  message?: string
}

export const validateColombianAddress = (
  address: string
): AddressValidationResult => {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      message: 'La dirección es requerida',
    }
  }

  const trimmedAddress = address.trim()

  if (!COLOMBIA_ADDRESS_REGEX.test(trimmedAddress)) {
    return {
      isValid: false,
      message:
        'Formato de dirección inválido. Ejemplo: Calle 123 #45-67 o Carrera 7 #32-16',
    }
  }

  return {
    isValid: true,
  }
}

export const addressValidator = () => ({
  validator(_: any, value: string) {
    if (!value) {
      return Promise.resolve()
    }

    const result = validateColombianAddress(value)

    if (result.isValid) {
      return Promise.resolve()
    }

    return Promise.reject(new Error(result.message))
  },
})

export const formatAddressSuggestion = (address: string): string => {
  const match = address.match(COLOMBIA_ADDRESS_REGEX)

  if (!match) return address

  const [, viaType, mainNumber, , secondaryNumber, plaque, additional] = match

  const formattedViaType =
    viaType.charAt(0).toUpperCase() + viaType.slice(1).toLowerCase()

  let formatted = `${formattedViaType} ${mainNumber} #${secondaryNumber}-${plaque}`

  if (additional && additional.trim()) {
    formatted += additional
  }

  return formatted
}
