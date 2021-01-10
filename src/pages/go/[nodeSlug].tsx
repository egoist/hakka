import { AuthUser, getServerSession } from '@server/lib/auth'
import { Main } from '@src/components/Main'
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
      <Main render={() => <div className="p-6">此页面还在开发中..</div>} />
    </AuthProvider>
  )
}

export default NodePage
