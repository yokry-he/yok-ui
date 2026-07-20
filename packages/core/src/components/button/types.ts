import type { Component } from 'vue'

export type YButtonSize = 'sm' | 'md' | 'lg'
export type YButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type YButtonVariant = 'primary' | 'secondary' | 'ghost'
export type YButtonNativeType = 'button' | 'submit' | 'reset'
export type YButtonGroupDirection = 'horizontal' | 'vertical'
export type YButtonIcon = string | Component

export const Y_BUTTON_TYPES: readonly YButtonType[] = [
  'default',
  'primary',
  'success',
  'info',
  'warning',
  'danger'
]

export const Y_BUTTON_NATIVE_TYPES: readonly YButtonNativeType[] = ['button', 'submit', 'reset']
