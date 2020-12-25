import { getRepos } from '@/orm'
import { Response } from 'express'
import { nanoid } from 'nanoid'
import dayjs, { OpUnitType } from 'dayjs'
import jwt from 'jsonwebtoken'

export type AuthUser = {
  id: number
  username: string
  avatar?: string
}

export function getExpiresAt(createdAt: Date, maxAge: string) {
  const [, maxAgeNumber, maxAgeUnit] = /^(\d+)([a-z]+)$/.exec(maxAge)!
  return dayjs(createdAt)
    .add(Number(maxAgeNumber), maxAgeUnit as OpUnitType)
    .toDate()
}

export async function setRefreshTokenCookie(res: Response, userId: number) {
  const repos = await getRepos()
  const token = repos.token.create({
    type: 'login',
    value: nanoid(32),
    maxAge: '14d',
    lastActiveAt: new Date(),
    userId,
  })
  await repos.token.save(token)
  res.cookie('refresh_token', token.value, {
    expires: getExpiresAt(token.createdAt, token.maxAge),
    httpOnly: true,
    sameSite: 'lax',
    path: '/refresh_token',
  })
}

export function removeRefreshTokenCookie(res: Response) {
  res.cookie('refresh_token', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    path: '/refresh_token',
  })
}

export function getAccessToken(user: AuthUser) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    },
    process.env.ENCRYPT_SECRET,
    {
      expiresIn: '15min',
    },
  )
}
