interface ImportMeta {
  env: {
    VITE_API_URL: string
    VITE_API_VERSION: string
    VITE_JWE_SECRET_KEY: string
    VITE_NODE_ENV: string
    VITE_PROMPT_TIMEOUT: number
    VITE_ROUTER_BASE: string
    VITE_SESSION_TIMEOUT: number
    VITE_COLOMBIA_ADDRESS_REGEX: string
  }
}

declare module '*.module.scss'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
