import { useStore } from '@src/lib/store'
import clsx from 'clsx'
import { Header } from './Header'

export const Main: React.FC<{
  render: () => React.ReactElement
}> = ({ render }) => {
  const hideLeftPanel = useStore((state) => state.hideLeftPanel)

  return (
    <>
      <Header />
      <div
        className={clsx(
          `relative max-w-4xl mx-auto mt-24 mb-8 px-3 md:px-6`,
          hideLeftPanel && 'is-hidden',
        )}
      >
        {render()}
      </div>
    </>
  )
}
