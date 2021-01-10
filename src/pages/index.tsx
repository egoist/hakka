import React from 'react'
import { GetServerSideProps } from 'next'
import { getServerSession } from '@server/lib/auth'
import { AuthUser } from '@server/lib/auth'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { Spinner } from '@src/components/Spinner'
import { timeago } from '@src/lib/date'
import clsx from 'clsx'
import Link from 'next/link'
import { useTopicsQuery } from '@src/generated/graphql'
import { Main } from '@src/components/Main'

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

const HomePage: React.FC<PageProps> = ({ user }) => {
  const [topicsQuery, refetchTopicsQuery] = useTopicsQuery({
    variables: {
      page: 1,
    },
    requestPolicy: 'cache-and-network',
  })

  const topics = topicsQuery.data?.topics.items

  return (
    <AuthProvider value={user}>
      <Head>
        <title>HAKKA!</title>
      </Head>
      <Main
        refreshButtonCallback={refetchTopicsQuery}
        render={() => (
          <div className="panel-content">
            {!topics && (
              <div className="py-8 flex justify-center">
                <Spinner />
              </div>
            )}
            {topics && (
              <div className="">
                {topics.map((topic) => {
                  return (
                    <div key={topic.id}>
                      <span
                        className={clsx(
                          `px-6 py-4 flex justify-between border-b border-border`,
                        )}
                      >
                        <div>
                          <h2 className="text-lg leading-snug">
                            <Link href={`/t/${topic.id}`}>
                              <a>{topic.title}</a>
                            </Link>
                          </h2>
                          <div className="text-xs">
                            {topic.externalLink && (
                              <a
                                href={topic.externalLink.url}
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                                target="_blank"
                                rel="nofollow noopenner"
                                className={clsx(
                                  `inline-flex items-center`,
                                  `text-theme`,
                                )}
                              >
                                <svg
                                  focusable="false"
                                  width="1em"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                >
                                  <g fill="none">
                                    <path
                                      d="M14 5a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6.414l-9.293 9.293a1 1 0 0 1-1.414-1.414L17.586 5H14zM3 7a2 2 0 0 1 2-2h5a1 1 0 1 1 0 2H5v12h12v-5a1 1 0 1 1 2 0v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                                      fill="currentColor"
                                    ></path>
                                  </g>
                                </svg>
                                <span style={{ marginLeft: '1px' }}>
                                  {topic.externalLink.domain}
                                </span>
                              </a>
                            )}
                          </div>
                          <div
                            className={clsx(
                              `flex items-center flex-wrap text-xs mt-1`,
                              `text-gray-400`,
                            )}
                          >
                            <Link href={`/go/${topic.node.slug}`}>
                              <a className={clsx(`hover:text-theme`)}>
                                #{topic.node.name}
                              </a>
                            </Link>
                            <span className="mx-2">•</span>
                            <span className="">
                              by{' '}
                              <Link href={`/u/${topic.author.username}`}>
                                <a className={clsx(`hover:text-theme`)}>
                                  {topic.author.username}
                                </a>
                              </Link>
                            </span>
                            <span className="mx-2">•</span>
                            <span>{timeago(topic.createdAt)}</span>
                            {topic.lastComment && (
                              <span className="mx-2">•</span>
                            )}
                            {topic.lastComment && (
                              <span>
                                最新回复来自{' '}
                                <Link
                                  href={`/u/${topic.lastComment.author.username}`}
                                >
                                  <a className={clsx(`hover:text-theme`)}>
                                    {topic.lastComment.author.username}
                                  </a>
                                </Link>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-12 flex-shrink-0 flex justify-end items-center">
                          {topic.commentsCount > 0 && (
                            <span
                              className={clsx(
                                `inline-flex rounded-full h-5 items-center px-3 text-xs font-bold`,
                                `bg-gray-200 text-gray-400`,
                              )}
                            >
                              {topic.commentsCount}
                            </span>
                          )}
                        </div>
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      />
    </AuthProvider>
  )
}

export default HomePage
