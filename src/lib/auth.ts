export async function getAccessToken() {
  const { accessToken } = await fetch(
    `${import.meta.env.SNOWPACK_PUBLIC_API_URL}/refresh_token`,
    {
      credentials: 'include',
    },
  ).then((res) => res.json())

  return accessToken
}

export async function removeRefreshToken() {
  await fetch(`${import.meta.env.SNOWPACK_PUBLIC_API_URL}/refresh_token`, {
    method: 'DELETE',
    credentials: 'include',
  })
  stopSilentRefreshing()
}

let silentRefreshingTimer: NodeJS.Timeout | undefined

export function startSilentRefreshing(loginCallback: (token: string) => void) {
  console.log(`> Starting silent refreshing`)
  // Update access token every 10 minutes (expires in 15 minutes)
  silentRefreshingTimer = setInterval(() => {
    console.log(`Silently refreshing access token`)
    getAccessToken().then((accessToken) => {
      loginCallback(accessToken)
    })
  }, 60 * 10 * 1000)
}

export function stopSilentRefreshing() {
  console.log(`> Stopped silent refreshing`)
  if (silentRefreshingTimer) {
    clearTimeout(silentRefreshingTimer)
    silentRefreshingTimer = undefined
  }
}
