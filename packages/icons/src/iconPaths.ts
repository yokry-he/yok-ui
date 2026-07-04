export interface YokIconPathData {
  viewBox: string
  paths: string[]
}

export const yokIconPaths = {
  check: {
    viewBox: '0 0 24 24',
    paths: ['M20 6 9 17l-5-5']
  },
  close: {
    viewBox: '0 0 24 24',
    paths: ['M18 6 6 18', 'M6 6l12 12']
  },
  search: {
    viewBox: '0 0 24 24',
    paths: ['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z', 'M21 21l-4.35-4.35']
  },
  chevronDown: {
    viewBox: '0 0 24 24',
    paths: ['M6 9l6 6 6-6']
  },
  copy: {
    viewBox: '0 0 24 24',
    paths: ['M8 8h11v11H8z', 'M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1']
  },
  playground: {
    viewBox: '0 0 24 24',
    paths: ['M9 3h6', 'M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3', 'M8 15h8']
  }
} satisfies Record<string, YokIconPathData>

export type YokIconName = keyof typeof yokIconPaths
