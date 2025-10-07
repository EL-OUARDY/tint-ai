export interface COLOR_VARIABLE {
  name: string
  value: string
  initial: string
}

export interface GENERATED_PALETTE {
  name: string
  colors: Omit<COLOR_VARIABLE, 'initial'>[]
}
