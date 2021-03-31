import { useRouter } from 'next/router'

export const useRefreshProps = () => {
  const router = useRouter()
  return () => {
    router.replace(router.asPath)
  }
}
