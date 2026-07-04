export interface ContrastAuditPair {
  name: string
  foreground: string
  background: string
  minimum: number
}

export interface ContrastAuditResult extends ContrastAuditPair {
  ratio: number
  passed: boolean
}

function parseHexColor(color: string) {
  const normalizedColor = color.replace('#', '').trim()

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedColor)) {
    throw new Error(`Expected a 6-digit hex color, received "${color}"`)
  }

  return {
    red: Number.parseInt(normalizedColor.slice(0, 2), 16),
    green: Number.parseInt(normalizedColor.slice(2, 4), 16),
    blue: Number.parseInt(normalizedColor.slice(4, 6), 16)
  }
}

function toLinearChannel(value: number) {
  const channel = value / 255

  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

export function getRelativeLuminance(color: string) {
  const { red, green, blue } = parseHexColor(color)

  return 0.2126 * toLinearChannel(red) + 0.7152 * toLinearChannel(green) + 0.0722 * toLinearChannel(blue)
}

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(foreground)
  const backgroundLuminance = getRelativeLuminance(background)
  const lightest = Math.max(foregroundLuminance, backgroundLuminance)
  const darkest = Math.min(foregroundLuminance, backgroundLuminance)

  return (lightest + 0.05) / (darkest + 0.05)
}

export function auditContrastPairs(pairs: ContrastAuditPair[]): ContrastAuditResult[] {
  return pairs.map((pair) => {
    const ratio = Number(getContrastRatio(pair.foreground, pair.background).toFixed(2))

    return {
      ...pair,
      ratio,
      passed: ratio >= pair.minimum
    }
  })
}
