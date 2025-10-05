import { create } from 'zustand'
import { COLOR_VARIABLE } from '@/shared/models'

interface IState {
  colorVariables: COLOR_VARIABLE[]
  setColorVariables: (colors: COLOR_VARIABLE[]) => void
}

const useStore = create<IState>((set) => ({
  colorVariables: [],
  setColorVariables: (colors: COLOR_VARIABLE[]) => set({ colorVariables: colors }),
}))

export default useStore
