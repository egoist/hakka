import { AuthUser, getServerSession } from '@server/lib/auth'
import { Main } from '@src/components/Main'
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
      <Main render={() => <div className="p-6">暂时不能更改个人资料</div>} />
    </AuthProvider>
  )
}

export default SettingsPage
