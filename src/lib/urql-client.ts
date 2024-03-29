import React from 'react'
import {
  Client,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'

export const createUrqlClient = () => {
  const ssr = ssrExchange({
    isClient: process.browser,
  })
  return createClient({
    url:  `/api/graphql`,
    fetchOptions: {
      credentials: 'include',
    },
    exchanges: [dedupExchange, cacheExchange(), ssr, fetchExchange],
  })
}

let urqlClient: Client | undefined

const initializeUrqlClient = () => {
  const client = urqlClient ?? createUrqlClient()
  if (!process.browser) {
    return client
  }
  if (!urqlClient) {
    urqlClient = client
  }
  return client
}

export const useUrqlClient = () => {
  return React.useMemo(() => initializeUrqlClient(), [])
}
