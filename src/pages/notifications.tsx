import React from 'react'
import {
  useNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from '@src/generated/graphql'
import Link from 'next/link'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { GetServerSideProps } from 'next'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { LeftPanel } from '@src/components/LeftPanel'
import { MainPanel } from '@src/components/MainPanel'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

const NotificationsPage: React.FC<PageProps> = ({ user }) => {
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
    <AuthProvider value={user}>
      <Head>
        <title>消息 - HAKKA!</title>
      </Head>
      <div className="main">
        <LeftPanel />
        <MainPanel title="消息">
          <div className="divide-y">
            {items && items.length === 0 && (
              <div className="text-center p-5">没有新消息</div>
            )}
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
                          <Link href={`/u/${topicComment.author.username}`}>
                            <a className="text-blue-500">
                              {topicComment.author.username}
                            </a>
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
                            href={`/t/${topicComment.topic.id}#comment-${topicComment.id}`}
                          >
                            <a className="button is-secondary is-small">
                              查看回复
                            </a>
                          </Link>
                        </div>
                      </div>
                    )}
                    {commentReply && (
                      <div className="p-5">
                        <div>
                          <Link href={`/u/${commentReply.author.username}`}>
                            <a className="text-blue-500">
                              {commentReply.author.username}
                            </a>
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
                            href={`/t/${commentReply.topic.id}#comment-${commentReply.id}`}
                          >
                            <a className="button is-secondary is-small">
                              查看回复
                            </a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </MainPanel>
      </div>
    </AuthProvider>
  )
}

export default NotificationsPage
