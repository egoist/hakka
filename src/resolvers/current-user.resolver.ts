import { Resolver, Query, ObjectType, Field, Int } from 'type-graphql'
import { Context, GqlContext } from '../decorators/gql-context'
import { requireAuth } from '../guards/require-auth'
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

@Resolver()
export class CurrentUserResolver {
  @Query((returns) => CurrentUser)
  async currentUser(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    return user
  }
}
