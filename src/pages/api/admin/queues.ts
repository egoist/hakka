import { setQueues, BullAdapter, router } from 'bull-board'
import connect from 'next-connect'
import { notificationQueue } from '@server/queues/notification.queue'
import { getServerSession } from '@server/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { isAdmin } from '@server/guards/require-auth'

setQueues([new BullAdapter(notificationQueue)])

router.use('/admin/queues', router._router)

export default connect<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    const { user } = await getServerSession(req)
    if (!user || !isAdmin(user)) {
      return res.redirect('/')
    }
    next()
  })
  .use((req, res, next) => {
    router._router.handle(req, res, next)
  })
