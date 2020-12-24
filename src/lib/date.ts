import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'

dayjs.locale(zh)

dayjs.extend(relativeTime)

export const timeago = (date: string | Date) => {
  return dayjs(date).fromNow()
}
