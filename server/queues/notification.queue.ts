import path from 'path'
import Queue from 'bull'

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

notificationQueue.process(path.join(__dirname, 'notification.processor.js'))
