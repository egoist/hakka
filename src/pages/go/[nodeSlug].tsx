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

const NodePage: React.FC<PageProps> = ({ user }) => {
  return (
    <AuthProvider value={user}>
      <LeftPanel />
      <MainPanel title="节点详情">
        <div className="p-8">此页面还在开发中..</div>
      </MainPanel>
    </AuthProvider>
  )
}

export default NodePage
