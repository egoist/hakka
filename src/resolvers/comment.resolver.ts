import { Context, GqlContext } from '@/decorators/gql-context'
import { requireAuth } from '@/guards/require-auth'
import { getRepos } from '@/orm'
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
import { renderMarkdown } from '@/lib/markdown'
import { Topic } from './topic.resolver'

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

    /// In the future, notifications should be done asynchronously via Bull.js

    // Topic comment notification, insert if the comment author is not the topic author
    const topic = await repos.topic.findOne({
      where: {
        id: args.topicId,
      },
    })
    if (topic && topic.authorId !== comment.authorId) {
      const topicCommentNotification = repos.notification.create({
        userId: topic.authorId,
        data: {
          type: 'topic-comment',
          topicId: topic.id,
          commentId: comment.id,
        },
      })
      await repos.notification.save(topicCommentNotification)
    }

    // Comment reply notification, insert if the comment author is not the parent comment author
    const parentComment =
      args.parentId &&
      (await repos.comment.findOne({
        where: {
          id: args.parentId,
        },
      }))
    if (topic && parentComment && parentComment.authorId !== comment.authorId) {
      if (parentComment) {
        const commentReplyNotification = repos.notification.create({
          userId: parentComment.authorId,
          data: {
            type: 'comment-reply',
            topicId: topic.id,
            commentId: parentComment.id,
            replyCommentId: comment.id,
          },
        })
        await repos.notification.save(commentReplyNotification)
      }
    }

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
}
