import { createConnection, getConnectionManager, Connection } from 'typeorm'
import { Comment } from './comment.entity'
import { Topic } from './topic.entity'
import { User } from './user.entity'
import { Token } from './token.entity'
import { UserTopicLike } from './user-topic-like.entity'
import { Notification } from './notification.entity'
import { UserCommentLike } from './user-comment-like.entity'

const CONNECTION_NAME = 'default'

export async function getConnection(): Promise<Connection> {
  const connectionManager = getConnectionManager()

  if (connectionManager.has(CONNECTION_NAME)) {
    console.log(`Reuse connection`)
    let connection = connectionManager.get(CONNECTION_NAME)
    if (!connection.isConnected) {
      connection = await connection.connect()
    }
    return connection
  }

  const connection = await createConnection()

  return connection
}

export async function getRepos() {
  const connection = await getConnection()
  const user = connection.getRepository(User)
  const topic = connection.getRepository(Topic)
  const comment = connection.getRepository(Comment)
  const token = connection.getRepository(Token)
  const notification = connection.getRepository(Notification)
  const userTopicLike = connection.getRepository(UserTopicLike)
  const userCommentLike = connection.getRepository(UserCommentLike)

  const repos = {
    user,
    topic,
    comment,
    token,
    notification,
    userTopicLike,
    userCommentLike,
  }

  return repos
}
