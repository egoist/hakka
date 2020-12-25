import { Request, Response } from 'express'
import passport, { Profile } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github'
import { nanoid } from 'nanoid'
import { getRepos } from '@/orm'
import { AuthUser, getAccessToken, setRefreshTokenCookie } from './auth'

// Not really used, since we're using JWT
passport.serializeUser<any, number>((user, done) => {
  done(null, user.id)
})

const enableGoogle =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
const enableGithub =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET

if (enableGoogle) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `/connect/google/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await getUserByProviderProfile(profile, 'google')
        cb(undefined, user)
      },
    ),
  )
}

if (enableGithub) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${
          process.env.NODE_ENV === 'production'
            ? `https://api.hakka.dev`
            : `http://localhost:${process.env.PORT}`
        }/connect/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const user = await getUserByProviderProfile(profile, 'github')
          cb(null, user)
        } catch (error) {
          cb(error)
        }
      },
    ),
  )
}

async function getUserByProviderProfile(
  profile: Profile,
  provider: 'github' | 'google',
) {
  let email = profile.emails && profile.emails[0].value
  const avatar = profile.photos && profile.photos[0].value

  if (!email) {
    email = `${provider}_${profile.id}@placeholder.tld`
  }

  const providerKey = `${provider}UserId`

  const repos = await getRepos()

  // Find one by provider user id
  let existing = await repos.user.findOne({
    where: {
      [providerKey]: profile.id,
    },
  })
  // Otherwise find one with the same email and link them
  if (!existing) {
    existing = await repos.user.findOne({
      where: {
        email,
      },
    })
    if (existing) {
      await repos.user.update(
        {
          id: existing.id,
        },
        {
          [providerKey]: profile.id,
        },
      )
    }
  }

  if (!existing) {
    existing = repos.user.create({
      email,
      username: profile.username || `user_${nanoid(5)}`,
      [providerKey]: profile.id,
      avatar,
    })
    await repos.user.save(existing)
  }

  if (avatar && existing.avatar !== avatar) {
    await repos.user.update(
      {
        id: existing.id,
      },
      {
        avatar,
      },
    )
  }

  return existing
}

export { passport }

export async function handleSuccessfulLogin(req: Request, res: Response) {
  const user = (req as $TsFixMe).user as AuthUser
  const accessToken = getAccessToken(user)
  const redirectUrl = `${process.env.APP_URL}${process.env.LOGIN_REDIRECT_PATH}#${accessToken}`
  await setRefreshTokenCookie(res, user.id)
  console.log(`Redirecting back to`, redirectUrl)
  res.redirect(redirectUrl)
}
