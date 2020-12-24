import create from 'zustand'
import jwtDecode from 'jwt-decode'
import { USER_LOCAL_STORAGE_KEY } from './constants'
import { removeRefreshToken } from './auth'

type User = {
  id: number
  username: string
  avatar?: string
}

type State = {
  accessToken: null | string
  user: null | User
  login: (token: string) => void
  logout: () => void
}

const initialUserStore = localStorage.getItem(USER_LOCAL_STORAGE_KEY) || null
const initialUser = initialUserStore && JSON.parse(initialUserStore)

export const useStore = create<State>((set) => ({
  accessToken: null,

  user: initialUser,

  isReplyBoxVisible: false,

  replyToTopicId: null,

  replyToCommentId: null,

  appMarginBottom: 0,

  login(token) {
    const user = jwtDecode<User>(token)
    set({
      accessToken: token,
      user,
    })
    console.log(JSON.stringify(user))
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
  },

  logout() {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
    set({
      accessToken: null,
      user: null,
    })
    removeRefreshToken()
  },
}))
