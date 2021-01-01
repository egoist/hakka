import React from 'react'
import Head from 'next/head'
import {
  TopicDocument,
  TopicQuery,
  TopicQueryVariables,
  useCommentsQuery,
  useCreateCommentMutation,
  useTopicQuery,
} from '@src/generated/graphql'
import { timeago } from '@src/lib/date'
import { Avatar } from '@src/components/Avatar'
import { AuthProvider } from '@src/hooks/useAuth'
import { TopicLikeButton } from '@src/components/TopicLikeButton'
import { TopicReplyButton } from '@src/components/TopicReplyButton'
import { GetServerSideProps } from 'next'
import { AuthUser, getServerSession } from '@server/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CommentLikeButton } from '@src/components/CommentLikeButton'
import { LeftPanel } from '@src/components/LeftPanel'
import { MainPanel } from '@src/components/MainPanel'
import { useFormik } from 'formik'
import { stripHTML } from '@src/lib/utils'
import { Button } from '@src/components/Button'
import { queryGraphql } from '@server/lib/graphql'
import { Spinner } from '@src/components/Spinner'

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
  const topicId = Number(router.query.topicId)
  const [commentsQuery, refetchComments] = useCommentsQuery({
    variables: {
      topicId: topicId!,
    },
    requestPolicy: 'network-only',
  })
  const topic = topicQuery.topicById
  const comments = commentsQuery.data?.comments
  const [, createCommentMutation] = useCreateCommentMutation()
  const commentEditorRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [parentCommentId, setParentCommentId] = React.useState<number | null>(
    null,
  )
  const parentComment = comments?.items.find(
    (item) => item.id === parentCommentId,
  )

  const commentForm = useFormik({
    initialValues: {
      content: '',
    },
    async onSubmit(values) {
      if (!topicId) return
      const { data } = await createCommentMutation({
        topicId,
        content: values.content,
        parentId: parentCommentId,
      })
      if (data) {
        refetchComments()
        setParentCommentId(null)
        commentForm.resetForm()
      }
    },
  })

  const canEdit = user && user.id === topic.author.id

  const title = `${topic.title} - HAKKA!`
  const description = `登录 HAKKA! 以回复此主题`
  return (
    <AuthProvider value={user}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <div className="main">
        <LeftPanel />
        <MainPanel title="主题详情">
          {topic && (
            <div className="">
              <div className="px-8 py-8 bg-white border-b border-border">
                <div className="items-center flex mb-3 text-gray-500 text-sm">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      size="w-10 h-10"
                      username={topic.author.username}
                      avatar={topic.author.avatar}
                    />
                    <Link href={`/u/${topic.author.username}`}>
                      <a className="font-medium text-gray-900">
                        {topic.author.username}
                      </a>
                    </Link>
                  </div>
                  <span className="ml-3 text-xs text-gray-400">
                    {timeago(topic.createdAt)}
                  </span>
                  {canEdit && (
                    <span className="ml-3 text-xs">
                      <Link href={`/edit-topic/${topic.id}`}>
                        <a className="text-blue-300">编辑</a>
                      </Link>
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-medium">{topic.title}</h1>
                <div className="mt-3">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: topic.html }}
                  ></div>
                </div>
                <div className="mt-5 text-gray-400 text-xs -ml-2">
                  <TopicLikeButton
                    count={topic.likesCount}
                    topicId={topic.id}
                    isLiked={topic.isLiked}
                  />
                  <TopicReplyButton
                    onClick={() => {
                      setParentCommentId(null)
                      setTimeout(() => {
                        commentEditorRef.current?.focus()
                      }, 0)
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!comments && (
            <div className="flex justify-center items-center p-8">
              <Spinner />
            </div>
          )}

          {comments && comments.items.length > 0 && (
            <div className="divide-y divide-border">
              {comments.items.map((comment) => {
                return (
                  <div key={comment.id} className="flex space-x-5 bg-white p-8">
                    <div className="flex-shrink-0">
                      <Avatar
                        username={comment.author.username}
                        avatar={comment.author.avatar}
                        size="w-10 h-10"
                      />
                    </div>
                    <div className="w-full">
                      <div className="mb-1 text-gray-400 text-sm">
                        <Link href={`/u/${comment.author.username}`}>
                          <a className="font-medium text-gray-600">
                            {comment.author.username}
                          </a>
                        </Link>
                        <span className="ml-3 text-xs">
                          {timeago(comment.createdAt)}
                        </span>
                      </div>
                      <div>
                        {comment.parent && (
                          <div className="border-l-4 border-border pl-3 my-2">
                            <div className="text-xs text-gray-400">
                              <Link
                                href={`/u/${comment.parent.author.username}`}
                              >
                                <a className="font-medium">
                                  {comment.parent.author.username}
                                </a>
                              </Link>
                              :
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
                          className="prose"
                          dangerouslySetInnerHTML={{ __html: comment.html }}
                        ></div>
                      </div>
                      <div className="text-xs mt-3 -ml-2 text-gray-400">
                        <CommentLikeButton
                          commentId={comment.id}
                          count={comment.likesCount}
                          isLiked={comment.isLiked}
                        />
                        <TopicReplyButton
                          onClick={() => {
                            setParentCommentId(comment.id)
                            setTimeout(() => {
                              commentEditorRef.current?.focus()
                            }, 0)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {user && (
            <div className="p-8 flex space-x-5 border-t border-border">
              <div className="flex-shrink-0">
                <Avatar
                  size="w-10 h-10"
                  username={user.username}
                  avatar={user.avatar}
                />
              </div>
              <div className="w-full overflow-hidden">
                {parentComment && (
                  <div className="mb-3 text-sm text-gray-500">
                    回复 {parentComment.author.username} 的评论 "
                    {stripHTML(parentComment.html).slice(0, 40)}..." (
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setParentCommentId(null)
                      }}
                    >
                      取消
                    </button>
                    )
                  </div>
                )}
                <form onSubmit={commentForm.handleSubmit}>
                  <textarea
                    name="content"
                    ref={commentEditorRef}
                    className="resize-none w-full rounded-md focus:outline-none"
                    value={commentForm.values.content}
                    onChange={commentForm.handleChange}
                    onBlur={commentForm.handleBlur}
                    placeholder="添加回复.."
                    required
                    rows={5}
                  ></textarea>
                  <div className="mt-3">
                    <Button
                      type="submit"
                      size="small"
                      isLoading={commentForm.isSubmitting}
                    >
                      回复
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </MainPanel>
      </div>
    </AuthProvider>
  )
}

export default TopicPage
