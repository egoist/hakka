import { useNotificationsCountQuery } from '@src/generated/graphql'
import { useAuth } from '@src/hooks/useAuth'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { DropdownMenu } from './DropdownMenu'

export const Header: React.FC<{
  refreshButtonCallback?: () => void
  isRefreshing?: boolean
}> = ({ refreshButtonCallback, isRefreshing }) => {
  const { user } = useAuth()
  const [showDropdown, setShowDropdown] = React.useState(false)

  const [notificationsCountQuery] = useNotificationsCountQuery({
    pause: !user,
    requestPolicy: 'cache-and-network',
    pollInterval: 30 * 1000,
  })
  const hasNotifications =
    typeof notificationsCountQuery.data?.notificationsCount === 'number' &&
    notificationsCountQuery.data.notificationsCount > 0

  return (
    <>
      <header className="h-12 flex items-center justify-between border-b border-border px-6">
        <div
          className="flex items-center h-full"
          style={{ marginLeft: '-3px' }}
        >
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-full inline-flex justify-center items-center mr-2 hover:text-theme  focus:outline-none"
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
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <h1 className="text-lg font-medium">
            <Link href="/">
              <a>HAKKA!</a>
            </Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4 h-full text-gray-400">
          {refreshButtonCallback && (
            <button
              onClick={() => {
                refreshButtonCallback()
              }}
              className="h-full inline-flex justify-center items-center hover:text-theme focus:outline-none"
            >
              <svg
                className={clsx(`w-5 h-5`, isRefreshing && `animate-spin`)}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          {user && (
            <Link href="/notifications">
              <a className="h-full inline-flex justify-center items-center hover:text-theme focus:outline-none">
                <span className="relative">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
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
              <a className="h-full inline-flex justify-center items-center hover:text-theme focus:outline-none">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Link>
          )}
          {!user && (
            <Link href="/login">
              <a className="h-full hover:text-theme inline-flex justify-center items-center focus:outline-none">
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
    </>
  )
}
