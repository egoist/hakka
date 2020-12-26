import { Context, GqlContext } from '@server/decorators/gql-context'
import { requireAuth } from '@server/guards/require-auth'
import { getRepos } from '@server/orm'
import {
  createUnionType,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { IsNull } from 'typeorm'
import { Comment } from './comment.resolver'

@ObjectType()
class Notification {
  @Field((type) => Int)
  id: number

  @Field()
  createdAt: Date

  @Field({ nullable: true })
  isRead?: boolean

  @Field((type) => GraphQLJSONObject)
  data: any
}

@ObjectType()
class TopicCommentData {
  @Field()
  type: string

  @Field((type) => Comment)
  comment: Comment
}

@ObjectType()
class CommentReplyData {
  @Field()
  type: string

  @Field((type) => Comment)
  replyComment: Comment
}

const ResolvedDataUnion = createUnionType({
  name: 'ResolvedDataUnion',
  types: () => [TopicCommentData, CommentReplyData] as const,
  resolveType(value) {
    if (value.type === 'topic-comment') {
      return TopicCommentData
    }
    if (value.type === 'comment-reply') {
      return CommentReplyData
    }
  },
})

@Resolver((of) => Notification)
export class NotificationResolver {
  @Query((returns) => [Notification])
  async notifications(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    const notifications = await repos.notification.find({
      where: {
        userId: user.id,
        // isRead: IsNull(),
      },
      take: 100,
      order: {
        createdAt: 'DESC',
      },
    })
    return notifications
  }

  @Query((returns) => Int)
  async notificationsCount(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    const count = await repos.notification.count({
      where: {
        userId: user.id,
        isRead: IsNull(),
      },
    })
    return count
  }

  @FieldResolver((returns) => ResolvedDataUnion)
  async resolvedData(@Root() notification: Notification) {
    const repos = await getRepos()
    const { data } = notification
    if (data.type === 'topic-comment') {
      const comment = await repos.comment.findOne({
        where: {
          id: data.commentId,
        },
      })
      return { type: data.type, comment }
    }
    if (data.type === 'comment-reply') {
      const replyComment = await repos.comment.findOne({
        where: {
          id: data.replyCommentId,
        },
      })
      return { type: data.type, replyComment }
    }
  }

  @Mutation((returns) => Boolean)
  async markAllNotificationsAsRead(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    await repos.notification.update(
      {
        userId: user.id,
      },
      {
        isRead: true,
      },
    )
    return true
  }
}
