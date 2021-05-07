import { Context, GqlContext } from '@server/decorators/gql-context'
import { isAdmin, requireAdmin, requireAuth } from '@server/guards/require-auth'
import { renderMarkdown } from '@server/lib/markdown'
import { ApolloError } from 'apollo-server-micro'
import {
  Args,
  ArgsType,
  Field,
  Int,
  Query,
  Resolver,
  ObjectType,
  Mutation,
  FieldResolver,
  Root,
  Arg,
} from 'type-graphql'
import { Comment } from './comment.resolver'
import { prisma } from '@server/lib/prisma'

@ArgsType()
class TopicsArgs {
  @Field((type) => Int, {
    defaultValue: 100,
  })
  take: number

  @Field((type) => Int, {
    defaultValue: 1,
  })
  page: number
}

@ObjectType()
class TopicAuthor {
  @Field((type) => Int)
  id: number

  @Field()
  username: string

  @Field({ nullable: true })
  avatar?: string
}

@ObjectType()
export class Topic {
  @Field((type) => Int)
  id: number

  @Field()
  title: string

  @Field()
  content: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field((type) => Int)
  authorId: number

  @Field((type) => Int)
  nodeId: number

  @Field((type) => Int, { nullable: true })
  lastCommentId?: number

  @Field({
    nullable: true,
    description: `A url string if the content is a valid URL`,
  })
  url?: string

  @Field({
    nullable: true,
    description: `If this topic content is a url, this field will be filled with the domain name`,
  })
  domain?: string

  @Field({ nullable: true })
  hidden?: boolean
}

@ObjectType()
class TopicsConnection {
  @Field((type) => [Topic])
  items: Topic[]

  @Field()
  hasNext: boolean

  @Field()
  hasPrev: boolean
}

@ArgsType()
class CreateTopicArgs {
  @Field()
  title: string

  @Field()
  content: string

  @Field({ nullable: true })
  url?: string
}

@ArgsType()
class TopicByIdArgs {
  @Field((type) => Int)
  id: number
}

@ArgsType()
class UpdateTopicArgs {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string

  @Field((type) => Int, { nullable: true })
  nodeId?: number
}

@ArgsType()
class LikeTopicArgs {
  @Field((type) => Int)
  topicId: number
}

@ObjectType()
class TopicExternalLink {
  @Field()
  url: string

  @Field()
  domain: string
}

@Resolver((of) => Topic)
export class TopicResolver {
  @Query((returns) => TopicsConnection)
  async topics(@GqlContext() ctx: Context, @Args() args: TopicsArgs) {
    const skip = (args.page - 1) * args.take

    const topics = await prisma.$queryRaw`
    select "topic".* from "topics" "topic"
      left join "comments" "lastComment"
        on "lastComment"."id" = "topic"."lastCommentId"
        where "topic"."hidden" is not true
    order by
      case when "lastComment" is null then "topic"."createdAt" else "lastComment"."createdAt" end DESC
    limit ${args.take}
    offset ${skip};
    `
    return {
      items: topics.slice(0, args.take).map((topic: any) => ({
        ...topic,
        createdAt: new Date(topic.createdAt),
        updatedAt: new Date(topic.updatedAt),
      })),
      hasNext: topics.length > args.take,
      hasPrev: args.page !== 1,
    }
  }

  @Query((returns) => Topic)
  async topicById(@Args() args: TopicByIdArgs) {
    const topic = await prisma.topic.findUnique({
      where: {
        id: args.id,
      },
    })
    return topic
  }

  @FieldResolver((returns) => TopicAuthor)
  async author(@Root() topic: Topic) {
    const author = await prisma.user.findUnique({
      where: {
        id: topic.authorId,
      },
    })
    return author
  }

  @FieldResolver((returns) => String)
  html(@Root() topic: Topic) {
    const html = renderMarkdown(topic.content)
    return html
  }

  @FieldResolver((returns) => Int)
  async commentsCount(@Root() topic: Topic) {
    const count = await prisma.comment.count({
      where: {
        topicId: topic.id,
      },
    })
    return count
  }

  @FieldResolver((returns) => Int)
  async likesCount(@Root() topic: Topic) {
    const count = await prisma.userTopicLike.count({
      where: {
        topicId: topic.id,
      },
    })
    return count
  }

  @FieldResolver((returns) => Boolean)
  async isLiked(@GqlContext() ctx: Context, @Root() topic: Topic) {
    if (!ctx.user) {
      return false
    }

    const record = await prisma.userTopicLike.findFirst({
      where: {
        userId: ctx.user.id,
        topicId: topic.id,
      },
    })
    return Boolean(record)
  }

  @FieldResolver((returns) => Comment, { nullable: true })
  async lastComment(@Root() topic: Topic) {
    return (
      topic.lastCommentId &&
      prisma.comment.findUnique({ where: { id: topic.lastCommentId } })
    )
  }

  @FieldResolver((returns) => TopicExternalLink, { nullable: true })
  externalLink(@Root() topic: Topic) {
    if (!topic.url) return null

    const url = new URL(topic.url)
    return {
      url: url.href,
      domain: url.hostname.replace(/^www\./, ''),
    }
  }

  @Mutation((returns) => Topic)
  async createTopic(@GqlContext() ctx: Context, @Args() args: CreateTopicArgs) {
    const user = requireAuth(ctx)

    const topic = await prisma.topic.create({
      data: {
        authorId: user.id,
        title: args.title,
        content: args.content,
        url: args.url,
      },
    })

    return topic
  }

  @Mutation((returns) => Topic)
  async updateTopic(@GqlContext() ctx: Context, @Args() args: UpdateTopicArgs) {
    const user = requireAuth(ctx)
    const topic = await prisma.topic.findUnique({
      where: {
        id: args.id,
      },
    })
    if (!topic) {
      throw new ApolloError(`主题不存在`)
    }

    // Allow the author and admins to update the topic
    if (topic.authorId !== user.id && !isAdmin(user)) {
      throw new ApolloError(`没有访问权限`)
    }

    const result = await prisma.topic.update({
      where: {
        id: topic.id,
      },
      data: {
        title: args.title,
        content: args.content,
      },
    })

    return result
  }

  @Mutation((returns) => Boolean)
  async likeTopic(@GqlContext() ctx: Context, @Args() args: LikeTopicArgs) {
    const user = requireAuth(ctx)
    const topic = await prisma.topic.findUnique({
      where: {
        id: args.topicId,
      },
    })
    if (!topic) throw new ApolloError(`topic was not found`)
    let userTopicLike = await prisma.userTopicLike.findFirst({
      where: {
        topicId: topic.id,
        userId: user.id,
      },
    })
    let liked = false
    if (userTopicLike) {
      await prisma.userTopicLike.delete({
        where: {
          id: userTopicLike.id,
        },
      })
    } else {
      userTopicLike = await prisma.userTopicLike.create({
        data: {
          topicId: topic.id,
          userId: user.id,
        },
      })
      liked = true
    }
    return liked
  }

  @Mutation((returns) => Boolean)
  async hideTopic(
    @GqlContext() ctx: Context,
    @Arg('id', () => Int) id: number,
    @Arg('hide') hide: boolean,
  ) {
    const user = requireAuth(ctx)
    requireAdmin(user)

    await prisma.topic.update({
      where: { id },
      data: { hidden: hide },
    })
    return true
  }
}
