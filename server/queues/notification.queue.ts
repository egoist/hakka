import Queue from 'bull'
import notificationProcessor from './notification.processor'

export type NotificationJobData = {
  commentId: number
}

export const notificationQueue = new Queue<NotificationJobData>(
  `notification`,
  {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
)

notificationQueue.process(notificationProcessor)
