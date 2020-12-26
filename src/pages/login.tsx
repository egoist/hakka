import React from 'react'
import { Header } from '@src/components/Header'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { GetServerSideProps } from 'next'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (user) {
    return {
      redirect: {
        destination: '/',
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

const LoginPage: React.FC<PageProps> = ({ user }) => {
  return (
    <AuthProvider value={user}>
      <Head>
        <title>登录 - HAKKA!</title>
      </Head>
      <Header />
      <div className="main">
        <div className="flex justify-center">
          <div className="inline-block text-center my-8">
            <h2 className="mb-5 text-xl font-medium">欢迎回来</h2>
            <div className="p-5 bg-white rounded-md">
              <a className="button" href={`/api/connect/github`}>
                <svg
                  id="i-github"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="w-5 h-5"
                >
                  <path
                    strokeWidth="0"
                    fill="currentColor"
                    d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"
                  />
                </svg>
                <span className="ml-2">使用 GitHub 账号登录</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

export default LoginPage
