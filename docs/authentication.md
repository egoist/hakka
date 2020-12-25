# Authentication

Authentication is based on Social Auth and Cookie.

### Enable Google Auth

Get your credentials in [Google API console](https://console.developers.google.com/), and update env variables:

```bash
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Enable GitHub Auth

[Create an OAuth app](https://github.com/settings/applications/new), and update env variables:

```bash
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

## Check if current user is authed in a resolver

```ts
import { GqlContext, Context } from 'src/decorators/gql-context'
import { requireAuth } from 'src/lib/require-auth'

@Query(returns => SomeThing)
async someQuery(@GqlContext() ctx: Context) {
  const user = await requireAuth(ctx.request)
}
```

## Email verification

[TODO]

## Social login

[TODO]
