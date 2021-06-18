import { TopicQuery } from '@src/generated/graphql'
import { timeago } from '@src/lib/date'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { Avatar } from './Avatar'
import { CommentLikeButton } from './CommentLikeButton'
import { TopicReplyButton } from './TopicReplyButton'

export const Comment: React.FC<{
  comment: ArrayElement<TopicQuery['comments']['items']>
  handleClickReplyButton: (commentId: number) => void
}> = ({ comment, handleClickReplyButton }) => {
  const [isActive, setIsActive] = React.useState(false)
  const el = React.useRef<HTMLDivElement>(null)

  if (process.browser) {
    React.useEffect(() => {
      if (location.hash === `#comment-${comment.id}`) {
        setIsActive(true)
        el.current?.scrollIntoView()
      } else {
        setIsActive(false)
      }
    }, [location.hash])
  }

  return (
    <div
      ref={el}
      className={clsx(`flex space-x-3 py-5`, isActive && `bg-border`)}
      id={`comment-${comment.id}`}
    >
      <div className="w-full flex space-x-4">
        <div className="flex-shrink-0">
          <Avatar
            size="w-9 h-9"
            avatar={comment.author.avatar}
            username={comment.author.username}
          />
        </div>
        <div className="w-full">
          <div className="mb-3 text-sm text-fg-light">
            <Link href={`/u/${comment.author.username}`}>
              <a className="font-medium">{comment.author.username}</a>
            </Link>
            <span className="ml-3 text-xs">{timeago(comment.createdAt)}</span>
          </div>
          <div>
            {comment.parent && (
              <div className="border-l-4 border-border pl-3 my-2">
                <div className="text-xs">
                  <Link href={`/u/${comment.parent.author.username}`}>
                    <a className="font-medium">
                      {comment.parent.author.username}
                    </a>
                  </Link>
                  :
                </div>
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: comment.parent.html,
                  }}
                ></div>
              </div>
            )}
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: comment.html }}
            ></div>
          </div>
          <div className="text-xs mt-3 -ml-2 text-fg-light">
            <CommentLikeButton
              commentId={comment.id}
              count={comment.likesCount}
              isLiked={comment.isLiked}
            />
            <TopicReplyButton
              onClick={() => handleClickReplyButton(comment.id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
