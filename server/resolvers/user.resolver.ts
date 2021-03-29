import { getRepos } from '@server/orm'
import {
  Resolver,
  Query,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Args,
} from 'type-graphql'
import { Context, GqlContext } from '../decorators/gql-context'
import { requireAuth } from '../guards/require-auth'

@ArgsType()
class ProfileArgs {
  @Field()
  username: string
}

@ObjectType()
class Profile {
  @Field((type) => Int)
  id: number

  @Field()
  username: string

  @Field({ nullable: true })
  avatar?: string

  @Field()
  createdAt: Date
}

@Resolver()
export class UserResolver {
  @Query((returns) => Profile)
  async profile(@Args() args: ProfileArgs) {
    const repos = await getRepos()
    const user = repos.user.findOne({ where: { username: args.username } })
    return user
  }
}
