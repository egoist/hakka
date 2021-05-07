import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AuthResolver } from '@server/resolvers/auth.resolver'
import { CommentResolver } from '@server/resolvers/comment.resolver'
import { CurrentUserResolver } from '@server/resolvers/current-user.resolver'
import { NotificationResolver } from '@server/resolvers/notification.resolver'
import { TopicResolver } from '@server/resolvers/topic.resolver'
import { DocumentNode, execute, GraphQLSchema } from 'graphql'
import { Context } from '@server/decorators/gql-context'
import { UserResolver } from '@server/resolvers/user.resolver'

let schema: GraphQLSchema | undefined

export const getSchema = async () => {
  const _schema =
    schema ||
    (await buildSchema({
      resolvers: [
        CurrentUserResolver,
        AuthResolver,
        TopicResolver,
        CommentResolver,
        NotificationResolver,
        UserResolver,
      ],
    }))

  if (process.env.NODE_ENV === 'production') {
    schema = _schema
  }

  return _schema
}

export const queryGraphql = async <TData = any, TVariables = any>(
  query: DocumentNode,
  variableValues: TVariables,
  context: Context,
) => {
  const schema = await getSchema()
  const { data } = (await execute({
    schema,
    document: query,
    variableValues,
    contextValue: context,
  })) as { data: TData }
  return data
}
