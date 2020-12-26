import {
  getAccessToken,
  getExpiresAt,
  removeRefreshTokenCookie,
  setRefreshTokenCookie,
} from '@/lib/auth'
import { getRepos } from '@/orm'
import { Express } from 'express'
import cookie from 'cookie'
import cors from 'cors'
import connect from './connect'

export default (app: Express) => {
  connect(app)

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://hakka.dev',
    }),
  )

  app.use('/refresh_token', async (req, res, next) => {
    if (!['GET', 'DELETE'].includes(req.method)) {
      return next()
    }

    const { refresh_token } = cookie.parse(req.headers.cookie || '')
    if (!refresh_token) {
      return res.send({ error: `no refresh token cookie` })
    }
    const repos = await getRepos()
    const token = await repos.token.findOne({
      where: {
        value: refresh_token,
      },
      relations: ['user'],
    })
    if (!token) {
      removeRefreshTokenCookie(res)
      return res.send({
        error: `refresh token has expired (not found)`,
      })
    }
    const expiresAt = getExpiresAt(token.createdAt, token.maxAge)
    if (expiresAt < new Date()) {
      removeRefreshTokenCookie(res)
      return res.send({
        error: `refresh token has expired`,
      })
    }
    const { user } = token
    await repos.token.remove(token)

    if (req.method === 'GET') {
      await setRefreshTokenCookie(res, user.id)
      res.send({
        accessToken: getAccessToken(user),
      })
    } else if (req.method === 'DELETE') {
      removeRefreshTokenCookie(res)
      res.send({
        message: 'logout',
      })
    }
  })
}
