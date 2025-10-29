import type { JsonValue } from './jsonToFlow'

export type PathToken = { type: 'root' } | { type: 'prop'; name: string } | { type: 'index'; index: number }

export function parseJsonPath(input: string): PathToken[] | null {
  if (!input || input[0] !== '$') return null
  const tokens: PathToken[] = [{ type: 'root' }]
  let i = 1

  while (i < input.length) {
    const ch = input[i]
    if (ch === '.') {
      i++
      let start = i
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i])) i++
      if (start === i) return null
      tokens.push({ type: 'prop', name: input.slice(start, i) })
      continue
    }
    if (ch === '[') {
      i++
      // index number
      let start = i
      while (i < input.length && /[0-9]/.test(input[i])) i++
      if (start === i) return null
      const num = Number(input.slice(start, i))
      if (Number.isNaN(num)) return null
      if (input[i] !== ']') return null
      i++
      tokens.push({ type: 'index', index: num })
      continue
    }
    return null
  }
  return tokens
}

export function getByPath(root: JsonValue, tokens: PathToken[]): { found: boolean; value?: JsonValue } {
  let current: JsonValue = root
  for (let t = 1; t < tokens.length; t++) {
    const tok = tokens[t]
    if (tok.type === 'prop') {
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        current = (current as Record<string, JsonValue>)[tok.name]
      } else {
        return { found: false }
      }
    } else if (tok.type === 'index') {
      if (Array.isArray(current)) {
        current = current[tok.index]
      } else {
        return { found: false }
      }
    }
    if (current === undefined) return { found: false }
  }
  return { found: true, value: current }
}


