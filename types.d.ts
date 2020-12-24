declare namespace NodeJS {
  export interface ProcessEnv {}
}

interface ImportMeta {
  env: {
    /** API URL of our server */
    SNOWPACK_PUBLIC_API_URL: string
    /** Exposed by Snowpack */
    MODE: 'production' | 'development'
  }
}
