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
          `relative max-w-3xl mx-auto mt-18 mb-8`,
          hideLeftPanel && 'is-hidden',
        )}
      >
        {render()}
      </div>
    </>
  )
}
