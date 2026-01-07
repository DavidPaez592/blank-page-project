import { NamePath, StoreValue } from 'antd/es/form/interface'

export function confirmFieldToField(
  getFieldValue: (name: NamePath) => StoreValue,
  currentField: string,
  confirmField: string,
  errorMessage: string
) {
  return {
    validator: () => {
      const currentFieldValue = getFieldValue(currentField)
      const confirmFieldValue = getFieldValue(confirmField)

      if (!currentFieldValue || currentFieldValue !== confirmFieldValue)
        return Promise.reject(new Error(errorMessage))

      return Promise.resolve()
    },
  }
}

export const VALIDATOR_REGEX = {
  ONLY_LETTERS_WITHOUT_SPACE: /^[a-zA-ZñÑ]+$/,
  ONLY_LETTERS_AND_NUMBERS_WITHOUT_SPACE: /^[a-zA-ZñÑ0-9]+$/,
  ONLY_NUMBERS_WITHOUT_SPACE: /^[0-9]+$/,
  ONLY_LETTERS_WITH_SPACE: /^[a-zA-ZñÑ\s]*$/,
  ALPHANUMERIC_WITH_SPACE: /^[A-z0-9 _]*[A-z0-9ñÑ\sáéíóúÁÉÍÓÚ][A-z0-9 _]*$/,
  ONLY_DIGIT: /[0-9]/,
  PHONE_EQUALS_NUMBERS: /^(\d)(?!\1+$)\d{6}$/,
  PERMISSION_CODE_FORMAT: /^[A-Za-z:]*[A-Za-z]+$/,
  ROUTE_PATH:
    /^\/(?!.*--)(?!.*\/-)(?!.*-\/)(?!.*\/\/)([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(\/[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)*)?$/,
}

export const validateFormat = (
  value: string,
  regex: { [Symbol.match](string: string): RegExpMatchArray | null }
) => {
  return value.match(regex) ?? false
}
