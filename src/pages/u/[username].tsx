import { AuthUser, getServerSession } from '@server/lib/auth'
import { LeftPanel } from '@src/components/LeftPanel'
import { MainPanel } from '@src/components/MainPanel'
import { AuthProvider } from '@src/hooks/useAuth'
import { GetServerSideProps } from 'next'
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
  return (
    <AuthProvider value={user}>
      <div className="main">
        <LeftPanel />
        <MainPanel title="用户详情">
          <div className="p-8">此页面暂时不可用</div>
        </MainPanel>
      </div>
    </AuthProvider>
  )
}

export default UserPage
