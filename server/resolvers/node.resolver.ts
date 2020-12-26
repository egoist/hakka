import { Context, GqlContext } from '@server/decorators/gql-context'
import { requireAdmin, requireAuth } from '@server/guards/require-auth'
import { getRepos } from '@server/orm'
import {
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

@ArgsType()
class CreateNodeArgs {
  @Field()
  name: string

  @Field()
  description: string

  @Field()
  slug: string

  @Field({ nullable: true })
  image?: string
}

@ObjectType()
export class Node {
  @Field((type) => Int)
  id: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  description: string

  @Field({ nullable: true })
  image?: string
}

@ArgsType()
class NodeArgs {
  @Field()
  slug: string
}

@Resolver((of) => Node)
export class NodeResolver {
  @Mutation((returns) => Node)
  async createNode(@GqlContext() ctx: Context, @Args() args: CreateNodeArgs) {
    const user = requireAuth(ctx)
    requireAdmin(user)

    const repos = await getRepos()
    const node = repos.node.create({
      name: args.name,
      description: args.description,
      image: args.image,
      slug: args.slug,
    })
    await repos.node.save(node)

    return node
  }

  @Query((returns) => Node)
  async node(@Args() args: NodeArgs) {
    const repos = await getRepos()
    const node = await repos.node.findOne({
      where: {
        slug: args.slug,
      },
    })
    return node
  }

  @Query((returns) => [Node])
  async nodes() {
    const repos = await getRepos()
    const nodes = await repos.node.find({
      order: {
        createdAt: 'DESC',
      },
    })
    return nodes
  }

  @FieldResolver((returns) => Int)
  async topicsCount(@Root() node: Node) {
    const repos = await getRepos()
    const count = await repos.topic.count({
      where: {
        nodeId: node.id,
      },
    })
    return count
  }
}
