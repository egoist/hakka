import Queue from 'bull'
import notificationProcessor from './notification.processor'

export type NotificationJobData = {
  commentId: number
}

export const notificationQueue = new Queue<NotificationJobData>(
  `notification`,
  {
    redis: process.env.REDIS_URL,
  },
)

notificationQueue.process(notificationProcessor)
