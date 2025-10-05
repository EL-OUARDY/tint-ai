import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Color, { ColorTypes } from 'colorjs.io'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidCssColor(value: ColorTypes) {
  try {
    new Color(value)
    return true
  } catch (e) {
    return false
  }
}
