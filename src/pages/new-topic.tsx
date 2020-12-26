import { Header } from '@src/components/Header'
import React from 'react'
import { Button } from '@src/components/Button'
import { useFormik } from 'formik'
import {
  useCreateTopicMutation,
  useNodesForNewTopicQuery,
  useTopicForEditQuery,
  useUpdateTopicMutation,
} from '@src/generated/graphql'
import Select from 'react-select'
import { Box } from '@src/components/Box'
import { MainLayout } from '@src/components/MainLayout'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'

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
  const [nodesForNewTopicQuery] = useNodesForNewTopicQuery({
    requestPolicy: 'cache-and-network',
  })
  const nodes = nodesForNewTopicQuery.data?.nodes
  const selectNodeOptions = nodes?.map((node) => {
    return {
      label: node.name,
      value: node.id,
    }
  })

  const [topicQuery] = useTopicForEditQuery({
    variables: {
      id: topicId as number,
    },
    pause: !topicId,
    requestPolicy: 'cache-and-network',
  })
  const topic = topicQuery.data?.topicById
  const form = useFormik<{ title: string; content: string; nodeId: number }>({
    initialValues: {
      title: '',
      content: '',
      nodeId: 0,
    },
    async onSubmit(values) {
      if (topicId) {
        const { data } = await updateTopicMutation({
          id: topicId,
          title: values.title,
          content: values.content,
          nodeId: values.nodeId,
        })
        if (data) {
          router.push(`/t/${data.updateTopic.id}`)
        }
      } else {
        const { data } = await createTopicMutation({
          title: values.title,
          content: values.content,
          nodeId: values.nodeId,
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
      form.setFieldValue('nodeId', topic.nodeId)
    }
  }, [topicQuery.fetching])

  return (
    <AuthProvider value={user}>
      <Head>
        <title>创建主题</title>
      </Head>
      <Header />
      <MainLayout>
        <form className="" onSubmit={form.handleSubmit}>
          <div className=" mb-4">
            <Select
              name="nodeId"
              id="topic-node"
              classNamePrefix="select-node"
              placeholder="选择一个节点"
              value={selectNodeOptions?.find(
                (option) => option.value === form.values.nodeId,
              )}
              // Use this for debugging:
              // menuIsOpen={true}
              onChange={(option) => {
                if (option) {
                  form.setFieldValue('nodeId', option.value)
                }
              }}
              options={selectNodeOptions}
              noOptionsMessage={() => `找不到匹配的节点`}
            />
          </div>
          <Box>
            <div className="p-5">
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
              <div className="mt-5">
                <Button type="submit">
                  {topicId ? `更新主题` : `发表主题`}
                </Button>
              </div>
            </div>
          </Box>
        </form>
      </MainLayout>
    </AuthProvider>
  )
}

export default NewTopicPage
