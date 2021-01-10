import { useStore } from '@src/lib/store'
import clsx from 'clsx'
import { Header } from './Header'

export const Main: React.FC<{
  render: () => React.ReactElement
  refreshButtonCallback?: () => void
  isRefreshing?: boolean
}> = ({ render, refreshButtonCallback, isRefreshing }) => {
  const hideLeftPanel = useStore((state) => state.hideLeftPanel)

  return (
    <div
      className={clsx(
        `relative max-w-3xl mx-auto bg-white`,
        hideLeftPanel && 'is-hidden',
      )}
    >
      <Header
        refreshButtonCallback={refreshButtonCallback}
        isRefreshing={isRefreshing}
      />
      {render()}
    </div>
  )
}
