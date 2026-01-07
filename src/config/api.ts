/**
 * API Configuration
 * Centralized configuration for API endpoints and prefixes
 */

export const API_PREFIXES = {
  INVENTARIO: 'inventario',
} as const

export type ApiPrefix = (typeof API_PREFIXES)[keyof typeof API_PREFIXES]
