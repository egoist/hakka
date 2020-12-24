import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCommentsQuery, useTopicQuery } from '@src/generated/graphql'
import { Header } from '@src/components/Header'
import { timeago } from '@src/lib/date'
import { Avatar } from '@src/components/Avatar'
import { useAuth } from '@src/hooks/useAuth'
import { NodeLabel } from '@src/components/NodeLabel'
import { TopicLikeButton } from '@src/components/TopicLikeButton'
import { TopicReplyButton } from '@src/components/TopicReplyButton'
import { ReplyBox } from '@src/components/ReplyBox'
import { Box } from '@src/components/Box'
import { AboutCard, Sidebar } from '@src/components/Sidebar'
import { MainLayout } from '@src/components/MainLayout'

export const Topic = () => {
  const { user } = useAuth()
  const { topicId } = useParams<{ topicId: string }>()

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

  const [topicQuery] = useTopicQuery({
    variables: {
      id: Number(topicId),
    },
    requestPolicy: 'cache-and-network',
  })
  const topic = topicQuery.data?.topicById

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

  return (
    <>
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
                            <Link to={`/edit-topic/${topic.id}`}>编辑</Link>
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
                        className="group px-5 py-5 flex space-x-3"
                        id={`comment-${comment.id}`}
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
    </>
  )
}
