import { NextApiHandler } from 'next'
import { Feed } from 'feed'
import { prisma } from '@server/lib/prisma'

const handler: NextApiHandler = async (req, res) => {
  const feed = new Feed({
    id: 'https://hakka.dev',
    title: 'HAKKA!',
    copyright: 'HAKKA! all rights reserved',
    link: 'https://hakka.dev',
  })
  const topics = await prisma.topic.findMany({
    where: {
      hidden: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 30,
    include: {
      author: true,
    },
  })
  for (const topic of topics) {
    feed.addItem({
      title: topic.title,
      id: `topic:${topic.id}`,
      date: topic.updatedAt,
      published: topic.createdAt,
      link: `https://hakka.dev/t/${topic.id}`,
      author: [
        {
          name: topic.author.username,
        },
      ],
      extensions: [
        {
          name: 'external_link',
          objects: topic.url,
        },
      ],
    })
  }
  res.setHeader('Content-Type', 'application/json')
  res.end(feed.json1())
}

export default handler
