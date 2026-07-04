import type { YokThemeTokens } from './tokens'

export function createThemeVars(theme: YokThemeTokens): Record<string, string> {
  return Object.entries(theme).reduce<Record<string, string>>((vars, [groupName, groupValue]) => {
    Object.entries(groupValue as Record<string, string>).forEach(([tokenName, tokenValue]) => {
      vars[`--yok-${groupName}-${tokenName}`] = tokenValue
    })

    return vars
  }, {})
}
