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
import { useRouter } from 'next/router'
import { UniLink } from '@src/components/UniLink'

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
  const router = useRouter()
  const page = Number(router.query.page || 1)
  const take = 26
  const [topicsQuery] = useTopicsQuery({
    variables: {
      page,
      take,
    },
    requestPolicy: 'cache-and-network',
  })

  const topics = topicsQuery.data?.topics.items

  return (
    <AuthProvider value={user}>
      <Head>
        <title>HAKKA!</title>
        <link rel="alternate" type="application/json" href="/feed.json" />
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
              <div className="space-y-6">
                {topics.map((topic) => {
                  return (
                    <div key={topic.id}>
                      <span className={clsx(`flex justify-between`)}>
                        <div>
                          <h2 className="text-lg font-medium leading-snug">
                            <UniLink
                              to={
                                topic.externalLink
                                  ? topic.externalLink.url
                                  : `/t/${topic.id}`
                              }
                              className="text-gray-200 hover:text-orange-500 hover:underline"
                            >
                              {topic.title}
                            </UniLink>
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
            <div className="pt-8 space-x-3">
              {page > 1 && (
                <Link href={{ query: { page: page - 1 } }}>
                  <a className="inline-block border-1 border-border py-1 px-2 text-sm hover:bg-border">
                    上一页
                  </a>
                </Link>
              )}
              {topics && topics.length === take && (
                <Link href={{ query: { page: page + 1 } }}>
                  <a className="inline-block border-1 border-border py-1 px-2 text-sm hover:bg-border">
                    下一页
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}
      />
    </AuthProvider>
  )
}

export default HomePage
