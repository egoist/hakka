import { useStore } from '../lib/store'

export const useAuth = () => {
  const user = useStore((state) => state.user)
  return {
    user,
  }
}
