import { handleSuccessfulLogin, passport } from '@/lib/passport'
import { Express } from 'express'

export default (app: Express) => {
  const providers = [
    {
      name: 'google',
    },
    {
      name: 'github',
    },
  ]
  for (const provider of providers) {
    app.get(
      `/connect/${provider.name}`,
      passport.authenticate(provider.name, {
        session: false,
      }),
    )
    app.get(
      `/connect/${provider.name}/callback`,
      passport.authenticate(provider.name, {
        failureRedirect: `${process.env.APP_URL}/login`,
        session: false,
      }),
      handleSuccessfulLogin,
    )
  }
}
