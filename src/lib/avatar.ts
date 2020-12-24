export const getAvatarUrl = (username: string, avatar?: string | null) => {
  return avatar || `https://ui-avatars.com/api/?name=${username}`
}
