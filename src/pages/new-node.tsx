import React from 'react'
import { Button } from '@src/components/Button'
import { useFormik } from 'formik'
import { useCreateNodeMutation } from '@src/generated/graphql'
import { useRouter } from 'next/router'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { GetServerSideProps } from 'next'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { LeftPanel } from '@src/components/LeftPanel'
import { MainPanel } from '@src/components/MainPanel'

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

const NewNodePage: React.FC<PageProps> = ({ user }) => {
  const router = useRouter()
  const [, createNodeMutation] = useCreateNodeMutation()

  const form = useFormik<{
    name: string
    description: string
    slug: string
    image?: string
  }>({
    initialValues: {
      name: '',
      description: '',
      slug: '',
      image: undefined,
    },
    async onSubmit(values) {
      const { data } = await createNodeMutation({
        name: values.name,
        description: values.description,
        image: values.image,
        slug: values.slug,
      })
      if (data) {
        router.push(`/go/${data.createNode.slug}`)
      }
    },
  })
  return (
    <AuthProvider value={user}>
      <Head>
        <title>创建节点</title>
      </Head>
      <div className="main">
        <LeftPanel />
        <MainPanel title="创建节点">
          <div className="p-8">
            <form onSubmit={form.handleSubmit}>
              <div>
                <label
                  htmlFor="node-name"
                  className="block mb-1 text-sm font-medium text-gray-500"
                >
                  名称
                </label>
                <input
                  type="text"
                  name="name"
                  id="node-name"
                  required
                  className="input w-full"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="node-description"
                  className="block mb-1 text-sm font-medium text-gray-500"
                >
                  描述
                </label>
                <textarea
                  id="node-description"
                  name="description"
                  className="textarea w-full"
                  rows={10}
                  value={form.values.description}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                ></textarea>
              </div>
              <div className="mt-3">
                <label
                  htmlFor="node-slug"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  缩略名
                </label>
                <input
                  type="text"
                  name="slug"
                  id="node-slug"
                  required
                  className="input w-full"
                  value={form.values.slug}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="node-image"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  图片
                </label>
                <input
                  type="text"
                  name="image"
                  id="node-image"
                  className="input w-full"
                  value={form.values.image}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
              <div className="mt-5">
                <Button type="submit" isLoading={form.isSubmitting}>
                  创建节点
                </Button>
              </div>
            </form>
          </div>{' '}
        </MainPanel>
      </div>
    </AuthProvider>
  )
}

export default NewNodePage
