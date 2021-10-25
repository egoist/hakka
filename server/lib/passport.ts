import { NextApiRequest, NextApiResponse } from 'next'
import passport, { Profile } from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import { nanoid } from 'nanoid'
import { serialize } from 'cookie'
import { createSecureToken } from './auth'
import { AUTH_COOKIE_NAME } from './constants'
import { prisma } from './prisma'

// Not really used
passport.serializeUser<any, number>((user, done) => {
  done(null, user.id)
})

const enableGithub =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET

if (enableGithub) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${
          process.env.NODE_ENV === 'production'
            ? `https://hakka.dev`
            : `http://localhost:${process.env.PORT}`
        }/api/connect/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const user = await getUserByProviderProfile(profile, 'github')
          cb(null, user)
        } catch (error) {
          cb(error as any)
        }
      },
    ),
  )
}

async function getUserByProviderProfile(profile: Profile, provider: 'github') {
  let email = profile.emails && profile.emails[0].value
  const avatar = profile.photos && profile.photos[0].value

  if (!email) {
    email = `${provider}_${profile.id}@placeholder.tld`
  }

  const providerKey = `${provider}UserId`

  // Find one by provider user id
  let existing = await prisma.user.findUnique({
    where: {
      [providerKey]: profile.id,
    },
  })
  // Otherwise find one with the same email and link them
  if (!existing) {
    existing = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (existing) {
      await prisma.user.update({
        where: {
          id: existing.id,
        },
        data: {
          [providerKey]: profile.id,
        },
      })
    }
  }

  if (!existing) {
    existing = await prisma.user.create({
      data: {
        email,
        username: profile.username || `user_${nanoid(5)}`,
        [providerKey]: profile.id,
        avatar,
      },
    })
  }

  if (avatar && existing.avatar !== avatar) {
    await prisma.user.update({
      where: {
        id: existing.id,
      },
      data: {
        avatar,
      },
    })
  }

  return existing
}

export { passport }

export async function handleSuccessfulLogin(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = (req as $TsFixMe).user as { id: number }
  const authToken = await createSecureToken({
    userId: user.id,
  })
  const maxAge = 60 * 60 * 24 * 90 // 3 month
  const authCookie = serialize(AUTH_COOKIE_NAME, authToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge,
    domain: process.env.NODE_ENV === 'production' ? '.hakka.dev' : undefined,
  })
  res.setHeader('Set-Cookie', [authCookie])
  res.redirect('/')
}
