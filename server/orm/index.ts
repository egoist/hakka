import { createConnection, getConnectionManager, Connection } from 'typeorm'
import { Comment } from './comment.entity'
import { Topic } from './topic.entity'
import { User } from './user.entity'
import { Node } from './node.entity'
import { Token } from './token.entity'
import { UserTopicLike } from './user-topic-like.entity'
import { Notification } from './notification.entity'

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
  const node = connection.getRepository(Node)
  const token = connection.getRepository(Token)
  const notification = connection.getRepository(Notification)
  const userTopicLike = connection.getRepository(UserTopicLike)

  const repos = {
    user,
    topic,
    comment,
    node,
    token,
    notification,
    userTopicLike,
  }

  return repos
}
