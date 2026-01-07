/** App routes */
export * from './routes'
/** Sidebar options */
export * from './sidebar'
/** Enums list */
export * from './enums'
/** Forms constants */
export * from './forms'
/** Permissions constants */
export * from './permissions'
/** The development environment string. */
export const DEVELOPMENT = 'development'
/** The production environment string. */
export const PRODUCTION = 'production'
/** The current node environment, defaults to development if not set. */
export const NODE_ENV = import.meta.env.VITE_NODE_ENV ?? DEVELOPMENT
/** The API URL, defaults to 'localhost:3000' if not set. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
/** The API URL, defaults to 'localhost:3000' if not set. */
export const API_VERSION = import.meta.env.VITE_API_VERSION ?? 'v1'
/** The secret key for JSON Web Encryption (JWE). */
export const JWE_SECRET_KEY = import.meta.env.VITE_JWE_SECRET_KEY
/** The session timeout duration. */
export const SESSION_TIMEOUT = import.meta.env.VITE_SESSION_TIMEOUT
/** The prompt timeout duration. */
export const PROMPT_TIMEOUT = import.meta.env.VITE_PROMPT_TIMEOUT
