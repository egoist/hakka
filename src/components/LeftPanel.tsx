import Link from 'next/link'
import { timeago } from '@src/lib/date'
import { Avatar } from '@src/components/Avatar'
import {
  useNotificationsCountQuery,
  useTopicsQuery,
} from '@src/generated/graphql'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useAuth } from '@src/hooks/useAuth'
import React from 'react'
import { useStore } from '@src/lib/store'
import { Spinner } from './Spinner'

const DropdownMenu = () => {
  const { user } = useAuth()
  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white"
      style={{ top: 'var(--panel-header-height)' }}
    >
      {!user && (
        <a
          href="/login"
          className="p-3 flex items-center space-x-2 hover:bg-gray-100"
        >
          <svg focusable="false" width="1em" height="1em" viewBox="0 0 24 24">
            <path
              d="M9.586 11L7.05 8.464L8.464 7.05l4.95 4.95l-4.95 4.95l-1.414-1.414L9.586 13H3v-2h6.586zM11 3h8c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-8v-2h8V5h-8V3z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          <span>登录</span>
        </a>
      )}
      {user && (
        <a
          href="/api/logout"
          className="p-3 flex items-center space-x-2 hover:bg-gray-100"
        >
          <svg focusable="false" width="1em" height="1em" viewBox="0 0 24 24">
            <path
              d="M6 2h9a2 2 0 0 1 2 2v2h-2V4H6v16h9v-2h2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
              fill="currentColor"
            ></path>
            <path
              d="M16.09 15.59L17.5 17l5-5l-5-5l-1.41 1.41L18.67 11H9v2h9.67z"
              fill="currentColor"
            ></path>
          </svg>
          <span>登出账号</span>
        </a>
      )}
      <a
        href="https://github.com/egoist/hakka"
        target="_blank"
        rel="nofollow noopener"
        className="p-3 flex items-center space-x-2 hover:bg-gray-100"
      >
        <svg focusable="false" width="1em" height="1em" viewBox="0 0 24 24">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          ></path>
        </svg>
        <span>获取开源代码</span>
      </a>
    </div>
  )
}

export const LeftPanel = () => {
  const { user } = useAuth()
  const [topicsQuery, refetchTopicsQuery] = useTopicsQuery({
    variables: {
      page: 1,
    },
    requestPolicy: 'cache-and-network',
  })
  const [notificationsCountQuery] = useNotificationsCountQuery({
    pause: !user,
    requestPolicy: 'cache-and-network',
    pollInterval: 30 * 1000,
  })
  const hasNotifications =
    typeof notificationsCountQuery.data?.notificationsCount === 'number' &&
    notificationsCountQuery.data.notificationsCount > 0
  const router = useRouter()
  const topicId =
    typeof router.query.topicId === 'string'
      ? Number(router.query.topicId)
      : undefined

  const topics = topicsQuery.data?.topics.items
  const [showDropdown, setShowDropdown] = React.useState(false)
  const hideLeftPanel = useStore((state) => state.hideLeftPanel)

  return (
    <div
      className={clsx(
        `left-panel relative bg-white h-full border-r border-border flex-shrink-0`,
        hideLeftPanel && 'is-hidden',
      )}
    >
      <header className="panel-header flex items-center border-b border-border text-center justify-between text-gray-500 hover:text-gray-900">
        <div className="flex items-center h-full">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-full w-12 inline-flex justify-center items-center hover:text-blue-500  focus:outline-none"
          >
            {showDropdown && (
              <svg focusable="false" className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
            {!showDropdown && (
              <svg focusable="false" className="w-5 h-5" viewBox="0 0 24 24">
                <g fill="none">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            )}
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            <Link href="/">
              <a>HAKKA!</a>
            </Link>
          </h1>
        </div>
        <div className="flex items-center h-full">
          <button
            onClick={() => {
              refetchTopicsQuery()
            }}
            className="h-full w-12 inline-flex justify-center items-center hover:bg-gray-100 focus:outline-none"
          >
            <svg
              focusable="false"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className={clsx(topicsQuery.stale && `animate-spin`)}
            >
              <g fill="none">
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
          {user && (
            <Link href="/notifications">
              <a className="h-full w-12 inline-flex justify-center items-center hover:bg-gray-100 focus:outline-none">
                <span className="relative">
                  <svg
                    focusable="false"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 17H7v-6.5C7 8 9 6 11.5 6S16 8 16 10.5m2 5.5v-5.5c0-3.07-2.14-5.64-5-6.32V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1m-8.5 4a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"
                      fill="currentColor"
                    ></path>
                  </svg>
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
              <a className="h-full w-12 inline-flex justify-center items-center hover:bg-gray-100 focus:outline-none">
                <svg focusable="false" className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
            </Link>
          )}
          {!user && (
            <Link href="/login">
              <a className="h-full w-12 inline-flex justify-center items-center hover:bg-gray-100 focus:outline-none">
                <svg focusable="false" className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M9.586 11L7.05 8.464L8.464 7.05l4.95 4.95l-4.95 4.95l-1.414-1.414L9.586 13H3v-2h6.586zM11 3h8c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-8v-2h8V5h-8V3z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
            </Link>
          )}
        </div>
      </header>

      {showDropdown && <DropdownMenu />}

      <div className="panel-content">
        {!topics && (
          <div className="py-8 flex justify-center">
            <Spinner />
          </div>
        )}
        {topics && (
          <div className="">
            {topics.map((topic) => {
              const isActive = topic.id === topicId
              return (
                <Link key={topic.id} href={`/t/${topic.id}`}>
                  <span
                    className={clsx(
                      `p-3 flex justify-between border-b border-border cursor-pointer`,
                      !isActive && `hover:bg-gray-50`,
                      isActive && `bg-blue-600 text-white`,
                    )}
                  >
                    <div>
                      <h2 className="text-lg leading-snug">{topic.title}</h2>
                      <div>
                        <Link href={`/go/${topic.node.slug}`}>
                          <a
                            className={clsx(
                              `text-xs`,
                              !isActive && `text-gray-400`,
                              isActive && `text-white`,
                            )}
                          >
                            #{topic.node.name}
                          </a>
                        </Link>
                      </div>
                      <div
                        className={clsx(
                          `text-sm mt-1`,
                          !isActive && `text-gray-400`,
                          isActive && `text-white`,
                        )}
                      >
                        <span className="space-x-2">
                          <Avatar
                            size="w-5 h-5"
                            username={topic.author.username}
                            avatar={topic.author.avatar}
                          />
                          <Link href={`/u/${topic.author.username}`}>
                            <a>{topic.author.username}</a>
                          </Link>
                        </span>
                        <span className="mx-2">•</span>
                        <span>{timeago(topic.createdAt)}</span>
                      </div>
                    </div>
                    <div className="w-12 flex-shrink-0 flex justify-end items-center">
                      <span
                        className={clsx(
                          `inline-flex rounded-full h-5 items-center px-3 text-xs font-bold`,
                          !isActive && `bg-gray-200 text-gray-400`,
                          isActive && `bg-blue-700 text-white`,
                        )}
                      >
                        {topic.commentsCount}
                      </span>
                    </div>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
