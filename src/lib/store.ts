import create from 'zustand'

type State = {
  hideLeftPanel: boolean

  setHideLeftPanel: (hide: boolean) => void
}

export const useStore = create<State>((set) => ({
  hideLeftPanel: false,

  setHideLeftPanel(hide: boolean) {
    set({
      hideLeftPanel: hide,
    })
  },
}))
