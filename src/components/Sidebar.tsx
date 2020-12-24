import React from 'react'
import { Link } from 'react-router-dom'

export const AboutCard = () => {
  return (
    <div className="bg-white rounded-lg p-5 shadow">
      <p className="mb-3 text-sm">
        一个不知道怎么描述的社区，在不同的节点讨论各种你感兴趣的主题。
      </p>
      <Link
        to="/new-topic"
        className="bg-blue-500 rounded-lg px-3 h-10 inline-flex items-center justify-center w-full text-white"
      >
        发表主题
      </Link>
    </div>
  )
}

export const Sidebar = () => {
  return (
    <div className="">
      <AboutCard />
    </div>
  )
}
