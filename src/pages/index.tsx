import React from 'react'
import { GetServerSideProps } from 'next'
import { getServerSession } from '@server/lib/auth'
import { AuthUser } from '@server/lib/auth'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { LeftPanel } from '@src/components/LeftPanel'

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
  return (
    <AuthProvider value={user}>
      <Head>
        <title>HAKKA!</title>
      </Head>
      <div className="main">
        <LeftPanel />
        <div className="main-panel hidden md:flex items-center justify-center w-full">
          <svg
            className="w-12 text-gray-300"
            viewBox="0 0 117 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_i)">
              <path
                d="M72.4531 121.352H40.8125V70.5508H31.6719V121.352H0.03125V0.414062H31.6719V43.6562H40.8125V0.414062H72.4531V121.352ZM116.223 0.238281L111.301 91.293H88.0977L83.1758 0.238281H116.223ZM113.938 121.176H85.4609V96.918H113.938V121.176Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <filter
                id="filter0_i"
                x="0.03125"
                y="0.238281"
                width="116.191"
                height="125.113"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </AuthProvider>
  )
}

export default HomePage
