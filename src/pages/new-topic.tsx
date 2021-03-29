import React from 'react'
import { Button } from '@src/components/Button'
import { useFormik } from 'formik'
import {
  useCreateTopicMutation,
  useTopicForEditQuery,
  useUpdateTopicMutation,
} from '@src/generated/graphql'
import Select from 'react-select'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { Main } from '@src/components/Main'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

const NewTopicPage: React.FC<PageProps> = ({ user }) => {
  const router = useRouter()
  const topicId = router.query.topicId && Number(router.query.topicId)
  const [, createTopicMutation] = useCreateTopicMutation()
  const [, updateTopicMutation] = useUpdateTopicMutation()

  const [topicQuery] = useTopicForEditQuery({
    variables: {
      id: topicId as number,
    },
    pause: !topicId,
    requestPolicy: 'network-only',
  })
  const topic = topicQuery.data?.topicById
  const form = useFormik<{ title: string; content: string; url: string }>({
    initialValues: {
      title: '',
      content: '',
      url: '',
    },
    async onSubmit(values) {
      if (topicId) {
        const { data } = await updateTopicMutation({
          id: topicId,
          title: values.title,
          content: values.content,
        })
        if (data) {
          router.push(`/t/${data.updateTopic.id}`)
        }
      } else {
        const { data } = await createTopicMutation({
          title: values.title,
          content: values.content,
          url: values.url,
        })
        if (data) {
          router.push(`/t/${data.createTopic.id}`)
        }
      }
    },
  })

  React.useEffect(() => {
    if (topic) {
      form.setFieldValue('title', topic.title)
      form.setFieldValue('content', topic.content)
      form.setFieldValue('url', topic.url)
    }
  }, [topicQuery.fetching])

  const title = topicId ? `编辑主题` : `创建主题`
  return (
    <AuthProvider value={user}>
      <Head>
        <title>{title}</title>
      </Head>
      <Main
        render={() => (
          <div className="p-6">
            <form className="" onSubmit={form.handleSubmit}>
              <div className="">
                <input
                  type="text"
                  name="title"
                  id="topic-title"
                  required
                  placeholder="标题"
                  className="input w-full"
                  value={form.values.title}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                {topicId ? (
                  form.values.url && (
                    <div className="mt-3 text-fg-light text-xs">
                      已提交的网址不可更改: {form.values.url}
                    </div>
                  )
                ) : (
                  <div className="mt-3">
                    <input
                      type="url"
                      name="url"
                      id="topic-url"
                      placeholder="网址"
                      className="input w-full"
                      value={form.values.url}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                    />
                  </div>
                )}
                <div className="mt-3">
                  <textarea
                    id="topic-content"
                    name="content"
                    className="textarea w-full"
                    rows={10}
                    placeholder="内容"
                    value={form.values.content}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  ></textarea>
                </div>

                {!topicId && (
                  <div className="mt-3 text-xs text-fg-light">
                    网址是可选的，如果要提交一个问题供讨论，请将网址留空。
                  </div>
                )}

                <div className="mt-5">
                  <Button type="submit" isLoading={form.isSubmitting}>
                    {topicId ? `更新主题` : `发表主题`}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      />
    </AuthProvider>
  )
}

export default NewTopicPage
