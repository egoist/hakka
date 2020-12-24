import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import { authExchange } from '@urql/exchange-auth'
import { makeOperation } from '@urql/core'
import { useStore } from './store'
import { getAccessToken, startSilentRefreshing } from './auth'

export const createUrqlClient = () => {
  return createClient({
    url: `${import.meta.env.SNOWPACK_PUBLIC_API_URL}/graphql`,
    fetchOptions: {
      credentials: 'same-origin',
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange<{ accessToken: string }>({
        async getAuth({ authState }) {
          console.log('getAuth')
          const { user, login } = useStore.getState()
          if (user) {
            const accessToken = await getAccessToken()
            login(accessToken)
            startSilentRefreshing(login)
          }
          return null
        },
        addAuthToOperation({ operation }) {
          console.log('addAuthToOperation')
          const { accessToken } = useStore.getState()
          if (!accessToken) {
            return operation
          }
          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {}
          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            },
          })
        },
      }),
      fetchExchange,
    ],
  })
}
