export interface COLOR_VARIABLE {
  name: string
  value: string
  initial: string
}

export interface PALETTE {
  name: string
  colors: COLOR_VARIABLE[]
}

export interface GENERATED_PALETTE {
  name: string
  colors: Omit<COLOR_VARIABLE, 'initial'>[]
}
