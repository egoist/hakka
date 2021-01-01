import { useStore } from '@src/lib/store'
import { useRouter } from 'next/router'
import React from 'react'

export const MainPanel: React.FC<{ title?: string }> = ({
  children,
  title,
}) => {
  const router = useRouter()
  const handleClickBackButton = () => {
    router.back()
  }
  const setHideLeftPanel = useStore((state) => state.setHideLeftPanel)
  React.useEffect(() => {
    setHideLeftPanel(true)
    return () => setHideLeftPanel(false)
  }, [])
  return (
    <div className="main-panel w-full bg-white">
      <header className="panel-header border-b border-border flex items-center justify-between bg-white text-gray-500 ">
        <div className="flex items-center h-full">
          <button
            onClick={handleClickBackButton}
            className="h-full w-12 inline-flex items-center justify-center hover:bg-gray-100 focus:outline-none"
          >
            <svg focusable="false" className="w-5 h-5" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M244 400L100 256l144-144"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M120 256h292"
              ></path>
            </svg>
          </button>
          {title && <span className="ml-2">{title}</span>}
        </div>
      </header>

      <div className="panel-content">{children}</div>
    </div>
  )
}
