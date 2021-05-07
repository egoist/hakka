import { Context, GqlContext } from '@server/decorators/gql-context'
import { requireAuth } from '@server/guards/require-auth'
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
import { Comment } from './comment.resolver'
import { prisma } from '@server/lib/prisma'

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
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notifications
  }

  @Query((returns) => Int)
  async notificationsCount(@GqlContext() ctx: Context) {
    const user = requireAuth(ctx)
    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: null,
      },
    })
    return count
  }

  @FieldResolver((returns) => ResolvedDataUnion)
  async resolvedData(@Root() notification: Notification) {
    const { data } = notification
    if (data.type === 'topic-comment') {
      const comment = await prisma.comment.findUnique({
        where: {
          id: data.commentId,
        },
      })
      return { type: data.type, comment }
    }
    if (data.type === 'comment-reply') {
      const replyComment = await prisma.comment.findUnique({
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
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    })
    return true
  }
}
