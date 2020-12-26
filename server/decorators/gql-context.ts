import { IncomingMessage, ServerResponse } from 'http'
import { createParamDecorator } from 'type-graphql'
import { AuthUser } from '@server/lib/auth'

export type Context = {
  req: IncomingMessage
  res: ServerResponse
  user?: AuthUser | null
}

export function GqlContext() {
  return createParamDecorator<Context>(({ context }) => context)
}
