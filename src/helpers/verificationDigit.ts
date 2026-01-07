/**
 * Calcula el dígito de verificación según el algoritmo de la DIAN Colombia para NITs
 *
 * @param document - Número de identificación (NIT) sin dígito de verificación
 * @returns Dígito de verificación (0-9)
 */
export const calculateVerificationDigit = (document: string): number => {
  const cleanDocument = document.replace(/\D/g, '')

  if (!cleanDocument || cleanDocument.length === 0) {
    return 0
  }

  const weights = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3]
  const paddedNit = cleanDocument.padStart(15, '0')

  let sum = 0
  for (let i = 0; i < paddedNit.length; i++) {
    sum += parseInt(paddedNit[i]) * weights[i]
  }

  const remainder = sum % 11
  const verificationDigit = remainder > 1 ? 11 - remainder : remainder

  return verificationDigit
}

/**
 * Formatea el documento con el dígito de verificación
 */
export const formatDocumentWithDigit = (
  document: string,
  verificationDigit: number
): string => {
  const cleanDocument = document.replace(/\D/g, '')
  return `${cleanDocument}-${verificationDigit}`
}

/**
 * Verifica si un documento con dígito de verificación es válido
 */
export const verifyDocument = (documentWithDigit: string): boolean => {
  const parts = documentWithDigit.split('-')
  if (parts.length !== 2) return false

  const document = parts[0]
  const providedDigit = parseInt(parts[1], 10)

  if (isNaN(providedDigit)) return false

  const calculatedDigit = calculateVerificationDigit(document)

  return calculatedDigit === providedDigit
}
