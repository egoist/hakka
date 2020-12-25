import { useFormik } from 'formik'
import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { useCreateCommentMutation } from '../generated/graphql'
import { Button } from './Button'

export const ReplyBox: React.FC<{
  replyToTopic: { id: number; title: string }
  replyToComment?: { id: number; username: string } | null
  hideReplyBox: () => void
  updateComments: () => void
  editorRef: React.RefObject<HTMLTextAreaElement>
}> = ({
  replyToTopic,
  replyToComment,
  hideReplyBox,
  updateComments,
  editorRef,
}) => {
  const route = useRouteMatch()
  const history = useHistory()
  const [, createCommentMutation] = useCreateCommentMutation()
  const form = useFormik({
    initialValues: {
      content: '',
    },
    async onSubmit(values) {
      const { data } = await createCommentMutation({
        content: values.content,
        topicId: replyToTopic.id,
        parentId: replyToComment?.id,
      })
      if (data) {
        updateComments()
        hideReplyBox()
        form.resetForm()
        history.push(`/t/${replyToTopic.id}#comment-${data.createComment.id}`)
      }
    },
  })

  return (
    <div className="fixed bottom-0 w-full left-0 right-0" id="reply-box">
      <div className="container">
        <div className="bg-white rounded-t-lg shadow-2xl border border-border">
          <div className="p-5 text-sm pb-0 flex items-center justify-between">
            <div>
              {replyToComment ? (
                <div>
                  回复用户{' '}
                  <Link
                    to={{
                      pathname: route.url,
                      hash: `#comment-${replyToComment.id}`,
                    }}
                    className="text-blue-500"
                  >
                    {replyToComment.username}#{replyToComment.id}
                  </Link>
                </div>
              ) : (
                <div>
                  回复主题 "
                  <Link to={`/t/${replyToTopic.id}`} className="text-blue-500">
                    {replyToTopic.title}
                  </Link>
                  "
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                className="w-6 h-6 inline-flex items-center justify-center hover:bg-gray-200 rounded-md"
                onClick={hideReplyBox}
              >
                <svg
                  focusable="false"
                  width="1em"
                  height="1em"
                  viewBox="0 0 20 20"
                >
                  <g fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10L4.293 5.707a1 1 0 0 1 0-1.414z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-5 pt-3">
            <div className="">
              <form onSubmit={form.handleSubmit}>
                <textarea
                  name="content"
                  className="textarea w-full"
                  rows={4}
                  value={form.values.content}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  ref={editorRef}
                  required
                ></textarea>
                <div className="mt-2">
                  <div className="space-x-3">
                    <Button type="submit" size="small">
                      回复
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
