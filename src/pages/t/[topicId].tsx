import React from 'react'
import Head from 'next/head'
import {
  TopicDocument,
  TopicQuery,
  TopicQueryVariables,
  useCommentsQuery,
  useCreateCommentMutation,
} from '@src/generated/graphql'
import { timeago } from '@src/lib/date'
import { AuthProvider } from '@src/hooks/useAuth'
import { TopicLikeButton } from '@src/components/TopicLikeButton'
import { TopicReplyButton } from '@src/components/TopicReplyButton'
import { GetServerSideProps } from 'next'
import { AuthUser, getServerSession } from '@server/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { stripHTML } from '@src/lib/utils'
import { Button } from '@src/components/Button'
import { queryGraphql } from '@server/lib/graphql'
import { Spinner } from '@src/components/Spinner'
import { Comment } from '@src/components/Comment'
import { Main } from '@src/components/Main'

type PageProps = {
  user: AuthUser | null
  topicQuery: TopicQuery
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  const topicId = ctx.query.topicId as string
  const graphqlContext = {
    req: ctx.req,
    res: ctx.res,
    user,
  }
  const topicQuery = await queryGraphql<TopicQuery, TopicQueryVariables>(
    TopicDocument,
    {
      id: Number(topicId),
    },
    graphqlContext,
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
  const topic = topicQuery.topicById
  const [, createCommentMutation] = useCreateCommentMutation()
  const [commentsQuery, refetchCommentsQuery] = useCommentsQuery({
    variables: {
      topicId,
      page: 1,
    },
    requestPolicy: 'network-only',
  })
  const commentEditorRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [parentCommentId, setParentCommentId] = React.useState<number | null>(
    null,
  )

  const parentComment = commentsQuery.data?.comments.items.find(
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
        setParentCommentId(null)
        refetchCommentsQuery({
          requestPolicy: 'cache-and-network',
        })
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
      <Main
        render={() => (
          <>
            {topic && (
              <div className="">
                <div className="p-6 bg-white">
                  <div className="flex mb-3 text-gray-500 text-sm">
                    <div className="flex">
                      <div>
                        <div>
                          <Link href={`/u/${topic.author.username}`}>
                            <a className="font-medium text-gray-900">
                              {topic.author.username}
                            </a>
                          </Link>
                          <span className="ml-2 text-xs text-gray-400">
                            {timeago(topic.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs" style={{ marginTop: '1px' }}>
                          <Link href={`/go/${topic.node.slug}`}>
                            <a className="text-gray-400 hover:text-gray-700">
                              #{topic.node.name}
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-xl font-medium">{topic.title}</h1>
                  <div className="mt-3">
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: topic.html }}
                    ></div>
                  </div>
                  <div className="mt-5 text-gray-400 text-xs -ml-1">
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

            {commentsQuery.fetching && (
              <div className="flex justify-center items-center p-6 border-t border-border">
                <Spinner />
              </div>
            )}

            {!commentsQuery.fetching &&
              commentsQuery.data &&
              commentsQuery.data.comments.items.length > 0 && (
                <div className="divide-y divide-border border-t border-border">
                  {commentsQuery.data.comments.items.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        handleClickReplyButton={() => {
                          setParentCommentId(comment.id)
                          setTimeout(() => {
                            commentEditorRef.current?.focus()
                          }, 0)
                        }}
                      />
                    )
                  })}
                </div>
              )}

            {user && (
              <div className="p-6 flex space-x-3 border-t border-border">
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
          </>
        )}
      />
    </AuthProvider>
  )
}

export default TopicPage
