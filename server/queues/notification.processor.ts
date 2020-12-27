import { Job } from 'bull'
import { getRepos } from '@server/orm'
import type { NotificationJobData } from './notification.queue'

export default async (job: Job<NotificationJobData>) => {
  const repos = await getRepos()

  const comment = await repos.comment.findOne({
    where: {
      id: job.data.commentId,
    },
    relations: ['topic', 'parent'],
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
  if (parentComment && parentComment.authorId !== comment.authorId) {
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
