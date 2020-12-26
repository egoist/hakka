import React from 'react'
import Head from 'next/head'
import {
  TopicDocument,
  TopicQuery,
  TopicQueryVariables,
  useCommentsQuery,
} from '@src/generated/graphql'
import { Header } from '@src/components/Header'
import { timeago } from '@src/lib/date'
import { Avatar } from '@src/components/Avatar'
import { AuthProvider } from '@src/hooks/useAuth'
import { NodeLabel } from '@src/components/NodeLabel'
import { TopicLikeButton } from '@src/components/TopicLikeButton'
import { TopicReplyButton } from '@src/components/TopicReplyButton'
import { ReplyBox } from '@src/components/ReplyBox'
import { Box } from '@src/components/Box'
import { MainLayout } from '@src/components/MainLayout'
import { GetServerSideProps } from 'next'
import { AuthUser, getServerSession } from '@server/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { queryGraphql } from '@server/lib/graphql'
import { topicService } from '@server/services/topic.service'

type PageProps = {
  user: AuthUser | null
  topicQuery: TopicQuery
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  const topicId = ctx.query.topicId as string
  const topicQuery = await queryGraphql<TopicQuery, TopicQueryVariables>(
    TopicDocument,
    {
      id: Number(topicId),
    },
    {
      req: ctx.req,
      res: ctx.res,
      user,
    },
  )
  if (!topicQuery) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      user,
      topicQuery,
    },
  }
}

const TopicPage: React.FC<PageProps> = ({ user, topicQuery }) => {
  const router = useRouter()
  const topicId = router.query.topicId as string

  const [replyBoxState, setReplyBoxState] = React.useState<{
    show: boolean
    replyToComment: { id: number; username: string } | null
  }>({
    show: false,
    replyToComment: null,
  })
  const hideReplyBox = () =>
    setReplyBoxState({
      ...replyBoxState,
      show: false,
    })
  const [marginBottom, setMarginBottom] = React.useState(0)
  const editorRef = React.useRef<HTMLTextAreaElement | null>(null)

  const topic = topicQuery.topicById

  const commentsPage = 1
  const [commentsQuery, runCommentsQuery] = useCommentsQuery({
    variables: {
      topicId: Number(topicId),
      page: commentsPage,
    },
    requestPolicy: 'cache-and-network',
  })
  const comments = commentsQuery.data?.comments.items
  const commentsCount = commentsQuery.data?.comments.total

  const deleteTopic = (id: number) => {
    alert(`TODO: Deleting #${id}, not yet implemented`)
  }

  const allowEdit = topic?.author.id === user?.id
  const allowDelete = allowEdit

  const focusReplyEditor = () => {
    if (replyBoxState.show && editorRef.current) {
      editorRef.current.focus()
      const $replyBox = document.getElementById('reply-box')
      if ($replyBox) {
        setMarginBottom($replyBox.clientHeight)
      }
    }
  }

  React.useEffect(() => {
    focusReplyEditor()
  }, [replyBoxState.show])

  React.useEffect(() => {
    focusReplyEditor()
  }, [replyBoxState.replyToComment?.id])

  React.useEffect(() => {
    if (!commentsQuery.fetching && location.hash.startsWith('#comment-')) {
      const $el = document.querySelector<HTMLDivElement>(location.hash)
      if ($el) {
        $el.scrollIntoView()
        $el.focus()
      }
    }
  }, [process.browser ? location.hash : '', commentsQuery.fetching])

  const title = `${topic.title} - HAKKA!`
  return (
    <AuthProvider value={user}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={`登录 HAKKA! 以回复此主题`} />
        <meta name="description" content={`登录 HAKKA! 以回复此主题`} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <div>
        <Header />
        <MainLayout>
          {topic && (
            <div className="mb-3">
              <Box>
                <div className="">
                  <header className="topic-header p-5 flex justify-between">
                    <div>
                      <h2 className="text-xl">{topic.title}</h2>
                      <div className="mt-2 text-gray-400 text-sm">
                        <span>
                          <NodeLabel
                            slug={topic.node.slug}
                            name={topic.node.name}
                          />
                        </span>
                        <span className="ml-2">
                          {topic.author.username}
                          <span className="ml-2">
                            {timeago(topic.createdAt)}
                          </span>
                        </span>
                        <span className="ml-2">·</span>
                        <span className="ml-2">{commentsCount} 条回复</span>
                        {allowEdit && (
                          <span className="ml-4">
                            <Link href={`/edit-topic/${topic.id}`}>
                              <a>编辑</a>
                            </Link>
                          </span>
                        )}
                        {allowDelete && (
                          <span className="ml-2">
                            <button
                              className="text-red-400"
                              onClick={() => deleteTopic(topic.id)}
                            >
                              删除
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Avatar
                        username={topic.author.username}
                        avatar={topic.author.avatar}
                      />
                    </div>
                  </header>
                  <div className="border-t border-gray-200 p-5">
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: topic.html }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 text-gray-400 hover:text-gray-600 text-xs">
                    <div className="flex space-x-3">
                      <span>
                        <TopicLikeButton
                          topicId={topic.id}
                          count={topic.likesCount}
                          isLiked={topic.isLiked}
                        />
                      </span>
                      <span>
                        <TopicReplyButton
                          onClick={() => {
                            setReplyBoxState({
                              show: true,
                              replyToComment: null,
                            })
                          }}
                        />
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
              </Box>
            </div>
          )}

          {/* comments */}
          {comments && comments.length > 0 && (
            <Box>
              <section className="comments-section">
                <div className="divide-y divide-gray-200">
                  {comments.map((comment) => {
                    return (
                      <div
                        key={comment.id}
                        className="group px-5 py-5 flex space-x-3 focus:bg-yellow-50 focus:outline-none"
                        id={`comment-${comment.id}`}
                        tabIndex={0}
                      >
                        <div className="flex-shrink-0">
                          <Avatar
                            username={comment.author.username}
                            avatar={comment.author.avatar}
                          />
                        </div>
                        <div className="w-full">
                          <div className="text-sm space-x-3 text-gray-400">
                            <span className="">{comment.author.username}</span>
                            <span className="">
                              {timeago(comment.createdAt)}
                            </span>
                          </div>
                          {comment.parent && (
                            <div className="my-3 text-xs border-l-4 bg-gray-100 p-3 text-gray-400">
                              <div className="mb-2">
                                <span>{comment.parent.author.username}:</span>
                              </div>
                              <div
                                className="prose text-gray-500"
                                dangerouslySetInnerHTML={{
                                  __html: comment.parent.html,
                                }}
                              ></div>
                            </div>
                          )}
                          <div
                            className="prose mt-1"
                            dangerouslySetInnerHTML={{
                              __html: comment.html,
                            }}
                          ></div>
                          <div className="mt-2 -ml-2 text-xs text-gray-400 hover:text-gray-600 flex justify-start w-full">
                            <div className="">
                              <span
                                onClick={() => {
                                  setReplyBoxState({
                                    show: true,
                                    replyToComment: {
                                      username: comment.author.username,
                                      id: comment.id,
                                    },
                                  })
                                }}
                                className="cursor-pointer inline-flex items-center space-x-1 rounded-md px-2 h-7 transition hover:bg-gray-200"
                              >
                                <svg
                                  width="1em"
                                  height="1em"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                <span>回复</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </Box>
          )}
        </MainLayout>
      </div>

      <div style={{ marginBottom: `${marginBottom}px` }}></div>

      {replyBoxState.show && topic && (
        <ReplyBox
          editorRef={editorRef}
          replyToTopic={topic}
          replyToComment={replyBoxState.replyToComment}
          hideReplyBox={hideReplyBox}
          updateComments={() => {
            runCommentsQuery({
              requestPolicy: 'network-only',
            })
          }}
        />
      )}
    </AuthProvider>
  )
}

export default TopicPage
