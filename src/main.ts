import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import addRoutes from './routes'
import { CurrentUserResolver } from './resolvers/current-user.resolver'
import { AuthResolver } from './resolvers/auth.resolver'
import { TopicResolver } from './resolvers/topic.resolver'
import { CommentResolver } from './resolvers/comment.resolver'
import { NodeResolver } from './resolvers/node.resolver'
import { getRepos } from './orm'
import { AuthUser } from './lib/auth'
import { NotificationResolver } from './resolvers/notification.resolver'

async function main() {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  addRoutes(app)

  const schema = await buildSchema({
    resolvers: [
      CurrentUserResolver,
      AuthResolver,
      TopicResolver,
      CommentResolver,
      NodeResolver,
      NotificationResolver,
    ],
  })

  const apolloServer = new ApolloServer({
    schema,
    tracing: process.env.NODE_ENV === 'development',
    introspection: true,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    async context({ req }) {
      const token = req.headers.authorization?.replace(/bearer /i, '')
      let user

      if (token) {
        try {
          const repos = await getRepos()
          const authUser = jwt.verify(
            token,
            process.env.ENCRYPT_SECRET,
          ) as AuthUser
          user = await repos.user.findOne({
            where: { id: authUser.id },
          })
          if (!user) {
            throw new AuthenticationError(`User not found`)
          }
        } catch (error) {
          throw new AuthenticationError(error.message)
        }
      }

      return {
        request: req,
        user,
      }
    },
  })
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  const { PORT } = process.env
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
