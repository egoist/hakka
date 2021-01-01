import { getAvatarUrl } from '@src/lib/avatar'
import clsx from 'clsx'
import React from 'react'

export const Avatar: React.FC<{
  username: string
  avatar?: string | null
  size?: string
}> = ({ username, avatar, size }) => {
  return (
    <img
      className={clsx(
        size || `w-12 h-12`,
        `inline-block rounded-full flex-shrink-0`,
      )}
      src={getAvatarUrl(username, avatar)}
      alt={`${username} 的头像`}
    />
  )
}
