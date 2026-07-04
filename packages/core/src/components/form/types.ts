export type YFormValue = string | number | boolean | null | undefined | unknown[] | Record<string, unknown>

export type YFormValidateTrigger = 'change' | 'blur' | 'submit'
export type YFormScrollIntoViewOptions = boolean | ScrollIntoViewOptions

export interface YFormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  trigger?: YFormValidateTrigger | YFormValidateTrigger[]
  validator?: (value: YFormValue, model: Record<string, unknown>) => boolean | string | Promise<boolean | string>
}

export type YFormRules = Record<string, YFormRule | YFormRule[]>

export interface YFormValidateError {
  prop: string
  messages: string[]
}

export interface YFormValidateResult {
  valid: boolean
  errors: YFormValidateError[]
}

export interface YFormFieldContext {
  prop: string
  element?: HTMLElement | null
  clearValidate: () => void
  resetField: () => void
  validate: (trigger?: YFormValidateTrigger) => Promise<boolean>
}

export interface YFormContext {
  model: Record<string, unknown>
  labelWidth: string
  getFieldError: (prop: string) => string
  registerField: (field: YFormFieldContext) => void
  unregisterField: (prop: string) => void
  validateField: (prop: string, trigger?: YFormValidateTrigger) => Promise<boolean>
  clearValidate: (props?: string | string[]) => void
  scrollToField: (prop: string, options?: YFormScrollIntoViewOptions) => boolean
}
