import { create } from 'zustand'

type UIState = {
  selectedCountry?: string
  timeWindowHours: number
  setCountry: (c?: string) => void
  setTimeWindow: (h: number) => void
}

export const useUI = create<UIState>((set) => ({
  selectedCountry: undefined,
  timeWindowHours: 24,
  setCountry: (selectedCountry) => set({ selectedCountry }),
  setTimeWindow: (timeWindowHours) => set({ timeWindowHours })
}))
