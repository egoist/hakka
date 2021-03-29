import { Context, GqlContext } from '@server/decorators/gql-context'
import { isAdmin, requireAuth } from '@server/guards/require-auth'
import { renderMarkdown } from '@server/lib/markdown'
import { getRepos } from '@server/orm'
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
} from 'type-graphql'
import { Comment } from './comment.resolver'
import { getConnection } from '@server/orm'
import { parseURL } from '@server/lib/utils'

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
    const connection = await getConnection()
    const topics = await connection.query(
      `
    select "topic".* from "topic" "topic"
    left join "comment" "lastComment"
      on "lastComment"."id" = "topic"."lastCommentId"
    order by
      case when "lastComment" is null then "topic"."createdAt" else "lastComment"."createdAt" end DESC
    limit $1
    offset $2
    `,
      [args.take + 1, skip],
    )
    return {
      items: topics.slice(0, args.take),
      hasNext: topics.length > args.take,
      hasPrev: args.page !== 1,
    }
  }

  @Query((returns) => Topic)
  async topicById(@Args() args: TopicByIdArgs) {
    const repos = await getRepos()
    const topic = await repos.topic.findOne({
      where: {
        id: args.id,
      },
    })
    return topic
  }

  @FieldResolver((returns) => TopicAuthor)
  async author(@Root() topic: Topic) {
    const repos = await getRepos()
    const author = await repos.user.findOne({
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
    const repos = await getRepos()
    const count = await repos.comment.count({
      where: {
        topicId: topic.id,
      },
    })
    return count
  }

  @FieldResolver((returns) => Int)
  async likesCount(@Root() topic: Topic) {
    const repos = await getRepos()
    const count = await repos.userTopicLike.count({
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

    const repos = await getRepos()
    const record = await repos.userTopicLike.findOne({
      where: {
        userId: ctx.user.id,
        topicId: topic.id,
      },
      select: ['id'],
    })
    return Boolean(record)
  }

  @FieldResolver((returns) => Comment, { nullable: true })
  async lastComment(@Root() topic: Topic) {
    const repos = await getRepos()
    return repos.comment.findOne({ id: topic.lastCommentId })
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
    const repos = await getRepos()

    const topic = repos.topic.create({
      authorId: user.id,
      title: args.title,
      content: args.content,
      url: args.url,
    })

    await repos.topic.save(topic)

    return topic
  }

  @Mutation((returns) => Topic)
  async updateTopic(@GqlContext() ctx: Context, @Args() args: UpdateTopicArgs) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    const topic = await repos.topic.findOne({
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

    Object.assign(topic, {
      title: args.title,
      content: args.content,
      nodeId: args.nodeId,
    })

    const result = await repos.topic.save(topic)

    return result
  }

  @Mutation((returns) => Boolean)
  async likeTopic(@GqlContext() ctx: Context, @Args() args: LikeTopicArgs) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    const topic = await repos.topic.findOneOrFail({
      where: {
        id: args.topicId,
      },
    })
    let userTopicLike = await repos.userTopicLike.findOne({
      topicId: topic.id,
      userId: user.id,
    })
    let liked = false
    if (userTopicLike) {
      await repos.userTopicLike.remove(userTopicLike)
    } else {
      userTopicLike = repos.userTopicLike.create({
        topicId: topic.id,
        userId: user.id,
      })
      await repos.userTopicLike.save(userTopicLike)
      liked = true
    }
    return liked
  }
}
