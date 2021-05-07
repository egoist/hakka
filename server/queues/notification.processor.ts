import { prisma } from '@server/lib/prisma'
import { Job } from 'bull'
import type { NotificationJobData } from './notification.queue'

export default async (job: Job<NotificationJobData>) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: job.data.commentId,
    },
    include: {
      topic: true,
      parent: true,
    },
  })

  if (!comment) return

  const { topic, parent: parentComment } = comment

  // Create topic comment notification, except that:
  // - the comment author is the topic author, don't notify because they're replying to themselve
  // - the parent comment author is the topic author, because we will create a notification for comment reply later
  if (
    topic.authorId !== comment.authorId &&
    (!parentComment || parentComment.authorId !== topic.authorId)
  ) {
    await prisma.notification.create({
      data: {
        userId: topic.authorId,
        data: {
          type: 'topic-comment',
          topicId: topic.id,
          commentId: comment.id,
        },
      },
    })
  }

  // Comment reply notification, insert if the comment author is not the parent comment author
  if (parentComment && parentComment.authorId !== comment.authorId) {
    await prisma.notification.create({
      data: {
        userId: parentComment.authorId,
        data: {
          type: 'comment-reply',
          topicId: topic.id,
          commentId: parentComment.id,
          replyCommentId: comment.id,
        },
      },
    })
  }
}
