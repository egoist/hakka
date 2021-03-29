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
  const [topicsQuery] = useTopicsQuery({
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
        render={() => (
          <div className="shadow-sm">
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
                      <span className={clsx(`px-6 py-4 flex justify-between`)}>
                        <div>
                          <h2 className="text-lg leading-snug">
                            {topic.externalLink ? (
                              <a
                                href={topic.externalLink.url}
                                target="_blank"
                                rel="noopener nofollow"
                              >
                                {topic.title}
                              </a>
                            ) : (
                              <Link href={`/t/${topic.id}`}>
                                <a>{topic.title}</a>
                              </Link>
                            )}
                            {topic.externalLink && (
                              <span className="text-sm text-fg-light ml-2">
                                ({topic.externalLink.domain})
                              </span>
                            )}
                          </h2>

                          <div
                            className={clsx(
                              `flex items-center flex-wrap text-xs mt-2 text-fg-light`,
                            )}
                          >
                            <span>{topic.likesCount} points</span>
                            <span className="ml-1">
                              by{' '}
                              <Link href={`/u/${topic.author.username}`}>
                                <a
                                  className={clsx(`underline hover:text-theme`)}
                                >
                                  {topic.author.username}
                                </a>
                              </Link>
                            </span>
                            <span className="ml-2">
                              {timeago(topic.createdAt)}
                            </span>
                            <span className="mx-2">|</span>
                            <span>
                              <Link href={`/t/${topic.id}`}>
                                <a className="underline">
                                  {topic.commentsCount} 条回复
                                </a>
                              </Link>
                            </span>
                          </div>
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
