import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useNotificationsCountQuery } from '@src/generated/graphql'
import clsx from 'clsx'
import Link from 'next/link'
import { useAuth } from '@src/hooks/useAuth'

export const Header: React.FC = () => {
  const { user } = useAuth()
  const [notificationsCountQuery] = useNotificationsCountQuery({
    pause: !user,
    requestPolicy: 'cache-and-network',
    pollInterval: 30 * 1000,
  })
  const hasNotifications =
    typeof notificationsCountQuery.data?.notificationsCount === 'number' &&
    notificationsCountQuery.data.notificationsCount > 0
  return (
    <header className="header bg-white z-10 border-b border-border fixed top-0 left-0 right-0 h-14">
      <div className="container h-full">
        <div className="h-full flex items-center justify-between">
          <div className="h-full flex items-center">
            <h1>
              <Link href="/">
                <a className="uppercase text-2xl font-bold">Hakka!</a>
              </Link>
            </h1>
            <span className="hidden md:w-96 ml-8 h-10 bg-gray-100 transition rounded-lg items-center px-3 text-gray-400 focus-within:bg-gray-200 focus-within:text-gray-900">
              <svg focusable="false" className="w-5 h-5" viewBox="0 0 512 512">
                <path
                  d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="ml-1 h-full w-full">
                <input
                  placeholder="搜索"
                  className="bg-transparent h-full w-full focus:outline-none"
                />
              </span>
            </span>
          </div>
          {user && (
            <div className="flex space-x-3 md:space-x-8 items-center text-gray-600 h-full">
              <div className="h-full">
                <Link href="/notifications">
                  <a
                    className={clsx(
                      `relative inline-flex h-full items-center`,
                      `hover:text-blue-500`,
                    )}
                  >
                    <svg
                      focusable="false"
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"
                        fill="currentColor"
                      ></path>
                    </svg>
                    {hasNotifications && (
                      <span className="flex h-2 w-2 absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </a>
                </Link>
              </div>
              <div className="relative">
                <Menu>
                  {({ open }) => (
                    <>
                      <span className="hover:text-blue-500">
                        <Menu.Button className="inline-flex justify-center items-center transition duration-150 ease-in-out">
                          <span>{user.username}</span>
                          <svg
                            className="w-5 h-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Menu.Button>
                      </span>

                      <Transition
                        show={open}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link href="/settings">
                                  <a
                                    className={`${
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700'
                                    } flex justify-betw een w-full px-4 py-2 text-sm leading-5 text-left`}
                                  >
                                    账户设置
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                          </div>

                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/api/logout"
                                  className={`${
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700'
                                  } cursor-pointer flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                >
                                  登出
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          )}
          {!user && (
            <div>
              <Link href="/login">
                <a className="button is-small">登录</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
