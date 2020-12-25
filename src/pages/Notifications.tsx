import React from 'react'
import { Header } from '@src/components/Header'
import { MainLayout } from '@src/components/MainLayout'
import {
  useNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from '@src/generated/graphql'
import { Box } from '@src/components/Box'
import { Link } from 'react-router-dom'

export const NotificationsPage = () => {
  const [notificationsQuery] = useNotificationsQuery({
    requestPolicy: 'cache-and-network',
  })
  const items = notificationsQuery.data?.notifications
  const [
    ,
    markNotificationsAsReadMutation,
  ] = useMarkAllNotificationsAsReadMutation()

  React.useEffect(() => {
    markNotificationsAsReadMutation()
  }, [])

  return (
    <div>
      <Header />
      <MainLayout>
        <Box>
          <div className="divide-y">
            {items &&
              items.map((item) => {
                const topicComment =
                  item.resolvedData.__typename === 'TopicCommentData' &&
                  item.resolvedData.comment
                const commentReply =
                  item.resolvedData.__typename === 'CommentReplyData' &&
                  item.resolvedData.replyComment
                return (
                  <div key={item.id}>
                    {topicComment && (
                      <div className="p-5">
                        <div>
                          <Link
                            to={`/u/${topicComment.author.username}`}
                            className="text-blue-500"
                          >
                            {topicComment.author.username}
                          </Link>{' '}
                          回复了主题 "{topicComment.topic.title}"
                        </div>
                        <div
                          className="prose bg-gray-100 rounded-md p-3 mt-3"
                          dangerouslySetInnerHTML={{
                            __html: topicComment.html,
                          }}
                        ></div>
                        <div className="mt-5">
                          <Link
                            className="button is-secondary is-small"
                            to={`/t/${topicComment.topic.id}#comment-${topicComment.id}`}
                          >
                            查看回复
                          </Link>
                        </div>
                      </div>
                    )}
                    {commentReply && (
                      <div className="p-5">
                        <div>
                          <Link
                            to={`/u/${commentReply.author.username}`}
                            className="text-blue-500"
                          >
                            {commentReply.author.username}
                          </Link>{' '}
                          在 "{commentReply.topic.title}" 回复了你:
                        </div>
                        <div
                          className="prose bg-gray-100 rounded-md p-3 mt-3"
                          dangerouslySetInnerHTML={{
                            __html: commentReply.html,
                          }}
                        ></div>
                        <div className="mt-5">
                          <Link
                            className="button is-secondary is-small"
                            to={`/t/${commentReply.topic.id}#comment-${commentReply.id}`}
                          >
                            查看回复
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </Box>
      </MainLayout>
    </div>
  )
}
