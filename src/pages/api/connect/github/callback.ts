import { NextApiResponse, NextApiRequest } from 'next'
import connect from 'next-connect'
import { passport, handleSuccessfulLogin } from '@server/lib/passport'

const handler = connect<NextApiRequest, NextApiResponse>()

handler.use(
  passport.initialize(),
  passport.authenticate('github', { failureRedirect: '/login' }),
  handleSuccessfulLogin,
)

export default handler
