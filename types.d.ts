declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    PORT: string
    ENCRYPT_SECRET: string
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
  }

  interface Global {
    _singletons: Record<string, any>
  }
}

type TODO = any

type $TsFixMe = any

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]
