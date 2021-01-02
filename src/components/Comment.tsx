import { CommentsQuery } from '@src/generated/graphql'
import { timeago } from '@src/lib/date'
import Link from 'next/link'
import React from 'react'
import { Avatar } from './Avatar'
import { CommentLikeButton } from './CommentLikeButton'
import { TopicReplyButton } from './TopicReplyButton'

export const Comment: React.FC<{
  comment: ArrayElement<CommentsQuery['comments']['items']>
  handleClickReplyButton: (commentId: number) => void
}> = ({ comment, handleClickReplyButton }) => {
  return (
    <div className="flex space-x-3 bg-white p-8">
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
          <span className="ml-3 text-xs">{timeago(comment.createdAt)}</span>
        </div>
        <div>
          {comment.parent && (
            <div className="border-l-4 border-border pl-3 my-2">
              <div className="text-xs text-gray-400">
                <Link href={`/u/${comment.parent.author.username}`}>
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
            onClick={() => handleClickReplyButton(comment.id)}
          />
        </div>
      </div>
    </div>
  )
}
