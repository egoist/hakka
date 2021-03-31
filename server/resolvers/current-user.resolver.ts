import {
  Resolver,
  Query,
  ObjectType,
  Field,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql'
import { Context, GqlContext } from '../decorators/gql-context'
import { isAdmin, requireAuth } from '../guards/require-auth'
@ObjectType()
class CurrentUser {
  @Field((type) => Int)
  id: number

  @Field()
  email: string

  @Field()
  username: string

  @Field({ nullable: true })
  avatar?: string
}

@Resolver((of) => CurrentUser)
export class CurrentUserResolver {
  @Query((returns) => CurrentUser)
  async currentUser(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    return user
  }

  @FieldResolver((returns) => Boolean)
  isAdmin(@Root() user: CurrentUser) {
    return isAdmin(user)
  }
}
