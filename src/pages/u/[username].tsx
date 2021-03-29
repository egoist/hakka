import { AuthUser, getServerSession } from '@server/lib/auth'
import { Main } from '@src/components/Main'
import { useProfileQuery } from '@src/generated/graphql'
import { AuthProvider } from '@src/hooks/useAuth'
import { timeago } from '@src/lib/date'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  return {
    props: {
      user,
    },
  }
}

const UserPage: React.FC<PageProps> = ({ user }) => {
  const router = useRouter()
  const username = router.query.username as string
  const [profileQuery] = useProfileQuery({
    variables: {
      username,
    },
  })

  const profile = profileQuery.data?.profile

  return (
    <AuthProvider value={user}>
      <Main
        render={() => (
          <div className="">
            <div>
              <h2 className="text-4xl">{username}</h2>
              {profile && (
                <div className="mt-2">
                  ...加入于 {timeago(profile?.createdAt)}
                </div>
              )}
            </div>
            <div className="mt-5">
              {user && (
                <a className="underline" href="/api/logout">
                  退出账号
                </a>
              )}
            </div>
          </div>
        )}
      />
    </AuthProvider>
  )
}

export default UserPage
