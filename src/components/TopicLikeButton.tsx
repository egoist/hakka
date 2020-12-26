import { useLikeTopicMutation } from '@src/generated/graphql'
import { useAuth } from '@src/hooks/useAuth'
import clsx from 'clsx'
import React from 'react'

export const TopicLikeButton: React.FC<{
  count: number
  topicId: number
  isLiked: boolean
}> = ({ count, topicId, isLiked }) => {
  const { user } = useAuth()
  const [, likeTopicMutation] = useLikeTopicMutation()
  const [actualCount, setActualCount] = React.useState(count)
  const [actualIsLiked, setActualIsLiked] = React.useState(isLiked)
  const handleClick = async () => {
    if (!user) return
    const { data } = await likeTopicMutation({
      topicId,
    })
    if (data) {
      if (data.likeTopic) {
        setActualCount(actualCount + 1)
        setActualIsLiked(true)
      } else {
        setActualCount(actualCount - 1)
        setActualIsLiked(false)
      }
    }
  }
  return (
    <button
      className={clsx(
        `inline-flex items-center  px-2 h-7 transition rounded-md hover:bg-gray-200`,
        !actualIsLiked && `border-gray-500`,
        actualIsLiked && `text-red-500`,
        !user && 'cursor-default',
      )}
      onClick={handleClick}
    >
      <svg
        width="1em"
        height="1em"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
      <span className="ml-1">{actualCount}</span>
    </button>
  )
}
