import { IncomingMessage } from 'http'
import cookie from 'cookie'
import { NextApiRequest } from 'next'
import { verify, sign } from 'jsonwebtoken'
import { AUTH_COOKIE_NAME } from './constants'
import { isAdmin } from '@server/guards/require-auth'
import { prisma } from './prisma'

export type CookieUserPayload = {
  userId: number
}

export function createSecureToken(payload: CookieUserPayload) {
  const token = sign(payload, process.env.ENCRYPT_SECRET)
  return token
}

export async function parseSecureToken(
  token?: string,
): Promise<CookieUserPayload | null> {
  if (!token) return null
  try {
    return verify(token, process.env.ENCRYPT_SECRET) as any
  } catch (error) {
    console.error('auth error', error)
    return null
  }
}

export type AuthUser = {
  id: number
  username: string
  avatar?: string | null
  isAdmin: boolean
  createdAt: number
}

export const getServerSession = async (
  req: NextApiRequest | IncomingMessage,
): Promise<{ user: AuthUser | null }> => {
  const token = cookie.parse(req.headers.cookie || '')[AUTH_COOKIE_NAME]

  const cookieUserPayload = await parseSecureToken(token)

  if (!cookieUserPayload) {
    return { user: null }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: cookieUserPayload.userId,
    },
  })

  return {
    user: user
      ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          isAdmin: isAdmin({ id: user.id }),
          createdAt: user.createdAt.getTime(),
        }
      : null,
  }
}
