import { Context, GqlContext } from '@server/decorators/gql-context'
import { requireAuth } from '@server/guards/require-auth'
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
import { SORT_ORDER, UserPublicInfo } from './resolver.types'
import { renderMarkdown } from '@server/lib/markdown'
import { Topic } from './topic.resolver'
import { notificationQueue } from '@server/queues/notification.queue'

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

  @Field((type) => SORT_ORDER, { nullable: true })
  order?: 'DESC' | 'ASC'
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
    const repos = await getRepos()
    const skip = (args.page - 1) * args.take

    const [comments, count] = await repos.comment.findAndCount({
      where: {
        topicId: args.topicId,
      },
      take: args.take + 1,
      skip,
      order: {
        createdAt: args.order,
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
    const repos = await getRepos()
    const comment = repos.comment.create({
      topicId: args.topicId,
      content: args.content,
      authorId: user.id,
      parentId: args.parentId,
    })
    await repos.comment.save(comment)

    await repos.topic.update(
      {
        id: args.topicId,
      },
      {
        lastCommentId: comment.id,
      },
    )

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
    const repos = await getRepos()
    const author = await repos.user.findOne({
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
    const repos = await getRepos()
    const parentComment =
      comment.parentId &&
      (await repos.comment.findOne({
        where: {
          id: comment.parentId,
        },
      }))
    return parentComment
  }

  @FieldResolver((returns) => Topic)
  async topic(@Root() comment: Comment) {
    const repos = await getRepos()
    const topic = await repos.topic.findOne({
      where: {
        id: comment.topicId,
      },
    })
    return topic
  }

  @FieldResolver((returns) => Int)
  async likesCount(@Root() comment: Comment) {
    const repos = await getRepos()
    const count = await repos.userCommentLike.count({
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

    const repos = await getRepos()
    const record = await repos.userCommentLike.findOne({
      where: {
        userId: ctx.user.id,
        commentId: comment.id,
      },
      select: ['id'],
    })
    return Boolean(record)
  }

  @Mutation((returns) => Boolean)
  async likeComment(@GqlContext() ctx: Context, @Args() args: LikeCommentArgs) {
    const user = requireAuth(ctx)
    const repos = await getRepos()
    const comment = await repos.comment.findOneOrFail({
      where: {
        id: args.commentId,
      },
    })
    let userCommentLike = await repos.userCommentLike.findOne({
      commentId: comment.id,
      userId: user.id,
    })
    let liked = false
    if (userCommentLike) {
      await repos.userCommentLike.remove(userCommentLike)
    } else {
      userCommentLike = repos.userCommentLike.create({
        commentId: comment.id,
        userId: user.id,
      })
      await repos.userCommentLike.save(userCommentLike)
      liked = true
    }
    return liked
  }
}
