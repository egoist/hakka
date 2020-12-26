import { AuthUser, getServerSession } from '@server/lib/auth'
import { Header } from '@src/components/Header'
import { MainLayout } from '@src/components/MainLayout'
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
      <Header />
      <MainLayout>此页面暂时不可用</MainLayout>
    </AuthProvider>
  )
}

export default UserPage
