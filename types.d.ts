declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    PORT: string
    ENCRYPT_SECRET: string
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
  }
}

type TODO = any

type $TsFixMe = any

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
