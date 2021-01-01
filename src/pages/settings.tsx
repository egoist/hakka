import { AuthUser, getServerSession } from '@server/lib/auth'
import { LeftPanel } from '@src/components/LeftPanel'
import { MainPanel } from '@src/components/MainPanel'
import { AuthProvider } from '@src/hooks/useAuth'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

const SettingsPage: React.FC<PageProps> = ({ user }) => {
  return (
    <AuthProvider value={user}>
      <Head>
        <title>设置 - HAKKA!</title>
      </Head>
      <LeftPanel />
      <MainPanel title="设置">
        <div className="p-8">暂时不能更改个人资料</div>
      </MainPanel>
    </AuthProvider>
  )
}

export default SettingsPage
