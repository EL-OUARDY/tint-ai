import { create } from 'zustand'
import { COLOR_VARIABLE } from '@/shared/models'

interface IState {
  tabURL: string
  colorVariables: COLOR_VARIABLE[]
  excludedVariables: string[]
  setTabURL: (url: string) => void
  setColorVariables: (colors: COLOR_VARIABLE[]) => void
  setExcludedVariables: (excluded: string[]) => void
  getFilteredColorVariables: () => COLOR_VARIABLE[]
}

const useStore = create<IState>((set, get) => ({
  tabURL: '',
  colorVariables: [],
  excludedVariables: [],
  setTabURL: (url: string) => set({ tabURL: url }),
  setColorVariables: (colors: COLOR_VARIABLE[]) => set({ colorVariables: colors }),
  setExcludedVariables: (excluded: string[]) => set({ excludedVariables: excluded }),
  getFilteredColorVariables: () => {
    const { colorVariables, excludedVariables } = get()
    return colorVariables.filter((colorVar) => !excludedVariables.includes(colorVar.name))
  },
}))

// Initialize excluded variables asynchronously
const loadExcludedVariables = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.url) {
      const key = tab.url
      const stored = localStorage.getItem(key)
      if (stored) {
        const excluded = JSON.parse(stored)
        useStore.getState().setExcludedVariables(excluded)
      }
    }
  } catch (error) {
    console.error('Error getting current tab URL:', error)
  }
}

// Load excluded variables on initialization
loadExcludedVariables()

export default useStore
