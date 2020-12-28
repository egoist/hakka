import { getAvatarUrl } from '@src/lib/avatar'
import React from 'react'

export const Avatar: React.FC<{ username: string; avatar?: string | null }> = ({
  username,
  avatar,
}) => {
  return (
    <img
      className="w-12 h-12 rounded-full flex-shrink-0"
      src={getAvatarUrl(username, avatar)}
      alt={`${username} 的头像`}
    />
  )
}
