export type CodeTokenKind = 'plain' | 'tag' | 'component' | 'keyword' | 'string'

export interface CodeHighlightToken {
  kind: CodeTokenKind
  text: string
}

export interface CodeHighlightLine {
  key: string
  number: number
  tokens: CodeHighlightToken[]
}

const tokenPattern = /(<\/?[A-Z][\w-]*|<\/?[a-z][\w-]*|<\/?>|['"`][^'"`]*['"`]|\b(?:import|from|const|let|ref|computed|type|interface|return|function|Array|true|false)\b)/g

function pushPlainToken(tokens: CodeHighlightToken[], value: string) {
  if (!value) {
    return
  }

  tokens.push({
    kind: 'plain',
    text: value
  })
}

export function highlightCodeLine(line: string): CodeHighlightToken[] {
  const tokens: CodeHighlightToken[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  tokenPattern.lastIndex = 0

  while ((match = tokenPattern.exec(line)) !== null) {
    const value = match[0]

    pushPlainToken(tokens, line.slice(lastIndex, match.index))

    if (/^<\/?(?:[A-Z]|y[a-z])/.test(value)) {
      tokens.push({
        kind: 'component',
        text: value
      })
    } else if (/^<\/?/.test(value)) {
      tokens.push({
        kind: 'tag',
        text: value
      })
    } else if (/^['"`]/.test(value)) {
      tokens.push({
        kind: 'string',
        text: value
      })
    } else {
      tokens.push({
        kind: 'keyword',
        text: value
      })
    }

    lastIndex = match.index + value.length
  }

  pushPlainToken(tokens, line.slice(lastIndex))

  return tokens.length ? tokens : [{ kind: 'plain', text: '' }]
}

export function createCodeHighlightLines(code: string, keyPrefix: string): CodeHighlightLine[] {
  return code.split('\n').map((line, index) => ({
    key: `${keyPrefix}-${index}`,
    number: index + 1,
    tokens: highlightCodeLine(line)
  }))
}
