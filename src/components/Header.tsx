import { useNotificationsCountQuery } from '@src/generated/graphql'
import { useAuth } from '@src/hooks/useAuth'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

export const Header: React.FC<{}> = () => {
  const { user } = useAuth()

  const [
    notificationsCountQuery,
    refetchNotificationsCount,
  ] = useNotificationsCountQuery({
    pause: !user,
    requestPolicy: 'cache-and-network',
  })
  const hasNotifications =
    typeof notificationsCountQuery.data?.notificationsCount === 'number' &&
    notificationsCountQuery.data.notificationsCount > 0

  React.useEffect(() => {
    const internal = setInterval(() => {
      refetchNotificationsCount()
    }, 30 * 1000)

    return () => clearInterval(internal)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-15 border-b border-border bg-body-bg z-99">
        <div className="h-full max-w-4xl mx-auto flex items-center justify-between px-3 md:px-6">
          <div className="flex items-center h-full">
            <h1 className="text-2xl font-medium font-serif text-orange-500">
              <Link href="/">
                <a>HAKKA!</a>
              </Link>
            </h1>
          </div>
          <div className="flex items-center space-x-3 md:space-x-8 h-full">
            {user && (
              <Link href="/notifications">
                <a className="h-full inline-flex justify-center items-center hover:text-theme focus:outline-none">
                  <span className="relative">
                    消息
                    {hasNotifications && (
                      <span className="flex h-2 w-2 absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </span>
                </a>
              </Link>
            )}
            {user && (
              <Link href="/new-topic">
                <a className="h-full inline-flex justify-center items-center hover:text-theme focus:outline-none">
                  创建主题
                </a>
              </Link>
            )}
            {user && (
              <Link href={`/u/${user.username}`}>
                <a className="hover:text-theme">{user.username}</a>
              </Link>
            )}
            {!user && (
              <Link href="/login">
                <a className="h-full hover:text-theme inline-flex justify-center items-center focus:outline-none">
                  登录
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
