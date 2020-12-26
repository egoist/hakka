import create from 'zustand'

type State = {}

export const useStore = create<State>((set) => ({}))
