import { create } from 'zustand'
import { COLOR_VARIABLE, PALETTE } from '@/shared/models'

interface IState {
  tabURL: string
  colorVariables: COLOR_VARIABLE[]
  excludedVariables: string[]
  savedPalettes: PALETTE[]
  setTabURL: (url: string) => void
  setColorVariables: (colors: COLOR_VARIABLE[]) => void
  setExcludedVariables: (excluded: string[]) => void
  getFilteredColorVariables: () => COLOR_VARIABLE[]
  setSavedPalettes: (palettes: PALETTE[]) => void
}

const useStore = create<IState>((set, get) => ({
  tabURL: '',
  colorVariables: [],
  excludedVariables: [],
  savedPalettes: [],
  setTabURL: (url: string) => set({ tabURL: url }),
  setColorVariables: (colors: COLOR_VARIABLE[]) => set({ colorVariables: colors }),
  setExcludedVariables: (excluded: string[]) => set({ excludedVariables: excluded }),
  getFilteredColorVariables: () => {
    const { colorVariables, excludedVariables } = get()
    return colorVariables.filter((colorVar) => !excludedVariables.includes(colorVar.name))
  },
  setSavedPalettes: (palettes: PALETTE[]) => set({ savedPalettes: palettes }),
}))

// Initialize excluded variables
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

// Initialize favorite palettes
const loadFavoritePalettes = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.url) {
      const key = tab.url + '--favorites'
      const result = localStorage.getItem(key)
      if (result) useStore.getState().setSavedPalettes(JSON.parse(result))
    }
  } catch (error) {
    console.error('Error getting current tab URL:', error)
  }
}

// Load excluded variables on initialization
loadExcludedVariables()

// Load fovorite palettes from local storage
loadFavoritePalettes()

export default useStore
