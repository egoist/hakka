import { createParamDecorator } from 'type-graphql'
import { Request } from 'express'
import { User } from '@/orm/user.entity'

export type Context = {
  request: Request
  user?: User
}

export function GqlContext() {
  return createParamDecorator<Context>(({ context }) => context)
}
