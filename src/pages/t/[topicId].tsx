import React from 'react'
import Head from 'next/head'
import {
  TopicDocument,
  TopicQuery,
  TopicQueryVariables,
  useCommentsQuery,
  useCreateCommentMutation,
  useHideTopicMutation,
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
import { Avatar } from '@src/components/Avatar'

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
  const [, hideTopicMutation] = useHideTopicMutation()
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
        router.push(`/t/${topic.id}#comment-${data.createComment.id}`)
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
                <div className="">
                  <div className="flex mb-3 text-sm space-x-2 items-center">
                    <div className="flex-shrink-0">
                      <Avatar
                        size="w-9 h-9"
                        avatar={topic.author.avatar}
                        username={topic.author.username}
                      />
                    </div>
                    <div className="w-full">
                      <div>
                        <Link href={`/u/${topic.author.username}`}>
                          <a className="font-medium">{topic.author.username}</a>
                        </Link>
                        <span className="ml-2 text-xs">
                          {timeago(topic.createdAt)}
                        </span>
                      </div>
                      <div
                        className="w-full text-xs text-fg-light flex items-center space-x-2"
                        style={{ marginTop: '1px' }}
                      >
                        {canEdit && (
                          <Link href={`/edit-topic/${topic.id}`}>
                            <a className="">编辑</a>
                          </Link>
                        )}
                        {user?.isAdmin && (
                          <button
                            onClick={async () => {
                              await hideTopicMutation({
                                id: topic.id,
                                hide: !topic.hidden,
                              })
                              // Refresh props
                              router.replace(router.asPath)
                            }}
                          >
                            {topic.hidden ? '显示' : '隐藏'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <h1 className="text-xl font-medium text-gray-200">
                    {topic.externalLink ? (
                      <span>
                        <a
                          href={topic.externalLink.url}
                          target="_blank"
                          rel="noopener nofollow"
                        >
                          {topic.title}
                        </a>
                        <span className="ml-1 text-fg-light text-sm">
                          ({topic.externalLink.domain})
                        </span>
                      </span>
                    ) : (
                      topic.title
                    )}
                  </h1>
                  <div className="mt-3">
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{ __html: topic.html }}
                    ></div>
                  </div>
                  <div className="mt-5 text-xs -ml-1">
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
              <div className="flex justify-center items-center p-6 mt-8 border-t border-border">
                <Spinner />
              </div>
            )}

            {!commentsQuery.fetching &&
              commentsQuery.data &&
              commentsQuery.data.comments.items.length > 0 && (
                <div className="divide-y divide-border border-t border-border mt-8">
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

            {user && !commentsQuery.fetching && (
              <div className="flex space-x-3 border-t border-border mt-5 pt-5">
                <div className="w-full">
                  {parentComment && (
                    <div className="mb-3 text-sm">
                      回复 {parentComment.author.username} 的评论 "
                      {stripHTML(parentComment.html).slice(0, 40)}..." (
                      <button
                        className=""
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
                      className="resize-none w-full bg-transparent focus:outline-none"
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
