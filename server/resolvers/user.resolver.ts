import { prisma } from '@server/lib/prisma'
import {
  Resolver,
  Query,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Args,
} from 'type-graphql'

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
    const user = await prisma.user.findUnique({
      where: { username: args.username },
    })
    return user
  }
}
