import React from 'react'
import { Link } from 'react-router-dom'
import { useTopicsQuery } from '@src/generated/graphql'
import { timeago } from '../../lib/date'
import { Header } from '../../components/Header'
import { useAuth } from '@src/hooks/useAuth'
import { Avatar } from '@src/components/Avatar'
import { NodeLabel } from '@src/components/NodeLabel'
import { Sidebar } from '@src/components/Sidebar'
import { useRouteQuery } from '@src/hooks/useRouteQuery'
import { MainLayout } from '@src/components/MainLayout'

export const Home = () => {
  const { user } = useAuth()
  const query = useRouteQuery()
  const [topicsQuery] = useTopicsQuery({
    variables: {
      page: 1,
    },
    requestPolicy: 'cache-and-network',
  })

  return (
    <div>
      <Header />
      <MainLayout>
        <div className="bg-white shadow rounded-lg divide-y divide-gray-100">
          {topicsQuery.data?.topics.items.map((item) => {
            return (
              <div key={item.id} className="">
                <div className="p-5">
                  <div className="flex space-x-3">
                    <Avatar
                      username={item.author.username}
                      avatar={item.author.avatar}
                    />
                    <div>
                      <h2 className="text-lg">
                        <Link
                          to={`/t/${item.id}`}
                          className="hover:text-red-700"
                        >
                          {item.title}
                        </Link>
                      </h2>
                      <div className="text-sm text-gray-400 mt-1">
                        <span>
                          <NodeLabel
                            name={item.node.name}
                            slug={item.node.slug}
                          />
                        </span>
                        <span className="ml-3">
                          <Link to={`/u/${item.author.username}`}>
                            {item.author.username}
                          </Link>
                        </span>
                        <span className="ml-3">{timeago(item.createdAt)}</span>
                        {item.commentsCount > 0 && (
                          <span className="mx-2 text-gray-300">•</span>
                        )}
                        {item.commentsCount > 0 && (
                          <span>{item.commentsCount} 条回复</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </MainLayout>
    </div>
  )
}
