import type {
  YFormRule,
  YFormRules,
  YFormValidateError,
  YFormValidateResult,
  YFormValidateTrigger,
  YFormValue
} from './types'

function isEmpty(value: YFormValue) {
  return value === undefined
    || value === null
    || value === ''
    || (Array.isArray(value) && value.length === 0)
}

function getLength(value: YFormValue) {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length
  }

  if (typeof value === 'number') {
    return value
  }

  return 0
}

function normalizeRules(rules?: YFormRule | YFormRule[]) {
  if (!rules) {
    return []
  }

  return Array.isArray(rules) ? rules : [rules]
}

function matchesTrigger(rule: YFormRule, trigger?: YFormValidateTrigger) {
  if (!trigger || !rule.trigger) {
    return true
  }

  const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
  return triggers.includes(trigger)
}

function defaultMessage(prop: string) {
  return `${prop} is invalid.`
}

async function validateRule(
  prop: string,
  value: YFormValue,
  model: Record<string, unknown>,
  rule: YFormRule
) {
  if (rule.required && isEmpty(value)) {
    return rule.message || `${prop} is required.`
  }

  if (!isEmpty(value)) {
    const length = getLength(value)

    if (typeof rule.len === 'number' && length !== rule.len) {
      return rule.message || `${prop} must be ${rule.len} characters.`
    }

    if (typeof rule.min === 'number' && length < rule.min) {
      return rule.message || `${prop} must be at least ${rule.min}.`
    }

    if (typeof rule.max === 'number' && length > rule.max) {
      return rule.message || `${prop} must be at most ${rule.max}.`
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || defaultMessage(prop)
    }
  }

  if (rule.validator) {
    const result = await rule.validator(value, model)

    if (typeof result === 'string') {
      return result
    }

    if (!result) {
      return rule.message || defaultMessage(prop)
    }
  }

  return ''
}

export function cloneFormModel(model: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(model)) as Record<string, unknown>
}

export function getFormValue(model: Record<string, unknown>, prop: string) {
  return prop.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }

    return undefined
  }, model) as YFormValue
}

export function setFormValue(model: Record<string, unknown>, prop: string, value: unknown) {
  const keys = prop.split('.')
  const target = keys.slice(0, -1).reduce<Record<string, unknown> | undefined>((current, key) => {
    const next = current?.[key]
    return next && typeof next === 'object' ? next as Record<string, unknown> : undefined
  }, model)

  if (target) {
    target[keys[keys.length - 1]] = value
  }
}

export async function validateFormField(
  model: Record<string, unknown>,
  rules: YFormRules,
  prop: string,
  trigger?: YFormValidateTrigger
) {
  const value = getFormValue(model, prop)
  const messages: string[] = []

  for (const rule of normalizeRules(rules[prop]).filter((item) => matchesTrigger(item, trigger))) {
    const message = await validateRule(prop, value, model, rule)

    if (message) {
      messages.push(message)
    }
  }

  return messages
}

export async function validateForm(
  model: Record<string, unknown>,
  rules: YFormRules,
  props?: string[],
  trigger?: YFormValidateTrigger
): Promise<YFormValidateResult> {
  const targets = props ?? Object.keys(rules)
  const errors: YFormValidateError[] = []

  for (const prop of targets) {
    const messages = await validateFormField(model, rules, prop, trigger)

    if (messages.length) {
      errors.push({
        prop,
        messages
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
