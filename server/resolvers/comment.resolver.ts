import { Context, GqlContext } from '@server/decorators/gql-context'
import { requireAuth } from '@server/guards/require-auth'
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
import { SORT_ORDER, UserPublicInfo } from './resolver.types'
import { renderMarkdown } from '@server/lib/markdown'
import { Topic } from './topic.resolver'
import { notificationQueue } from '@server/queues/notification.queue'
import { prisma } from '@server/lib/prisma'
import { ApolloError } from 'apollo-server-errors'

@ArgsType()
class CreateCommentArgs {
  @Field((type) => Int)
  topicId: number

  @Field()
  content: string

  @Field((type) => Int, {
    nullable: true,
  })
  parentId?: number
}

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  content: string

  @Field((type) => Int)
  authorId: number

  @Field((type) => Int, { nullable: true })
  parentId: number

  @Field((type) => Int)
  topicId: number
}

@ObjectType()
class CommentsConnection {
  @Field((type) => [Comment])
  items: Comment[]

  @Field()
  hasNext: boolean

  @Field()
  hasPrev: boolean

  @Field((type) => Int)
  total: number
}

@ArgsType()
class CommentsArgs {
  @Field((type) => Int)
  topicId: number

  @Field((type) => Int, {
    defaultValue: 100,
  })
  take: number

  @Field((type) => Int, {
    defaultValue: 1,
  })
  page: number

  @Field((type) => SORT_ORDER, { defaultValue: 'asc' })
  order: 'desc' | 'asc'
}

@ArgsType()
class LikeCommentArgs {
  @Field((type) => Int)
  commentId: number
}

@Resolver((of) => Comment)
export class CommentResolver {
  @Query((returns) => CommentsConnection)
  async comments(@Args() args: CommentsArgs) {
    const skip = (args.page - 1) * args.take

    const comments = await prisma.comment.findMany({
      where: {
        topicId: args.topicId,
      },
      take: args.take + 1,
      skip,
      orderBy: {
        createdAt: args.order,
      },
    })
    const count = await prisma.comment.count({
      where: {
        topicId: args.topicId,
      },
    })

    return {
      items: comments.slice(0, args.take),
      hasNext: comments.length > args.take,
      hasPrev: args.page > 1,
      total: count,
    }
  }

  @Mutation((returns) => Comment)
  async createComment(
    @GqlContext() ctx: Context,
    @Args() args: CreateCommentArgs,
  ) {
    const user = requireAuth(ctx)
    const comment = await prisma.comment.create({
      data: {
        topic: {
          connect: {
            id: args.topicId,
          },
        },
        content: args.content,
        author: {
          connect: {
            id: user.id,
          },
        },
        parent: args.parentId
          ? {
              connect: {
                id: args.parentId,
              },
            }
          : undefined,
      },
    })

    await prisma.topic.update({
      where: {
        id: args.topicId,
      },
      data: {
        lastComment: {
          connect: {
            id: comment.id,
          },
        },
      },
    })

    // Add notification
    notificationQueue.add({ commentId: comment.id })

    return comment
  }

  @FieldResolver((returns) => String)
  html(@Root() comment: Comment) {
    const html = renderMarkdown(comment.content)
    return html
  }

  @FieldResolver((returns) => UserPublicInfo)
  async author(@Root() comment: Comment) {
    const author = await prisma.user.findUnique({
      where: {
        id: comment.authorId,
      },
    })
    return author
  }

  @FieldResolver((returns) => Comment, {
    nullable: true,
  })
  async parent(@Root() comment: Comment) {
    const parentComment =
      comment.parentId &&
      (await prisma.comment.findUnique({
        where: {
          id: comment.parentId,
        },
      }))
    return parentComment
  }

  @FieldResolver((returns) => Topic)
  async topic(@Root() comment: Comment) {
    const topic = await prisma.topic.findUnique({
      where: {
        id: comment.topicId,
      },
    })
    return topic
  }

  @FieldResolver((returns) => Int)
  async likesCount(@Root() comment: Comment) {
    const count = await prisma.userCommentLike.count({
      where: {
        commentId: comment.id,
      },
    })
    return count
  }

  @FieldResolver((returns) => Boolean)
  async isLiked(@GqlContext() ctx: Context, @Root() comment: Comment) {
    if (!ctx.user) {
      return false
    }

    const record = await prisma.userCommentLike.findFirst({
      where: {
        userId: ctx.user.id,
        commentId: comment.id,
      },
    })
    return Boolean(record)
  }

  @Mutation((returns) => Boolean)
  async likeComment(@GqlContext() ctx: Context, @Args() args: LikeCommentArgs) {
    const user = requireAuth(ctx)
    const comment = await prisma.comment.findUnique({
      where: {
        id: args.commentId,
      },
    })
    if (!comment) throw new ApolloError(`comment was not found`)
    let userCommentLike = await prisma.userCommentLike.findFirst({
      where: {
        commentId: comment.id,
        userId: user.id,
      },
    })
    let liked = false
    if (userCommentLike) {
      await prisma.userCommentLike.delete({
        where: {
          id: userCommentLike.id,
        },
      })
    } else {
      userCommentLike = await prisma.userCommentLike.create({
        data: {
          commentId: comment.id,
          userId: user.id,
        },
      })
      liked = true
    }
    return liked
  }
}
