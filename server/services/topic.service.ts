import { getRepos } from '@server/orm'

export const topicService = {
  async getTopics(options: { page: number; take: number }) {
    const skip = (options.page - 1) * options.take
    const repos = await getRepos()
    const topics = await repos.topic.find({
      order: {
        createdAt: 'DESC',
      },
      take: options.take + 1,
      skip,
    })
    return {
      items: topics.slice(0, options.take).map((topic) => {
        return {
          ...topic,
          commentsCount: topic.comments.length,
        }
      }),
      hasNext: topics.length > options.take,
      hasPrev: options.page !== 1,
    }
  },
}
