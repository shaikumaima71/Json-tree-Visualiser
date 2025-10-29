import type { Edge, Node, XYPosition } from 'reactflow'

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export type GraphResult = {
  nodes: Node[]
  edges: Edge[]
  idByPath: Map<string, string>
}

type BuildContext = {
  nodes: Node[]
  edges: Edge[]
  idByPath: Map<string, string>
  nextId: number
}

const LEVEL_X_GAP = 280
const SIBLING_Y_GAP = 96

function createId(ctx: BuildContext): string {
  const id = `n_${ctx.nextId++}`
  return id
}

function nodeStyleFor(value: JsonValue): { bg: string; color: string; border: string } {
  if (Array.isArray(value)) return { bg: '#064e3b', color: '#d1fae5', border: '#065f46' } // green
  if (value !== null && typeof value === 'object') return { bg: '#1e1b4b', color: '#ddd6fe', border: '#3730a3' } // purple/blue
  return { bg: '#7c2d12', color: '#ffedd5', border: '#9a3412' } // orange
}

function buildSubtree(
  ctx: BuildContext,
  key: string | null,
  value: JsonValue,
  path: string,
  depth: number,
): { id: string; size: number } {
  const id = createId(ctx)
  ctx.idByPath.set(path, id)

  const style = nodeStyleFor(value)
  const kind: 'object' | 'array' | 'primitive' = Array.isArray(value)
    ? 'array'
    : value !== null && typeof value === 'object'
    ? 'object'
    : 'primitive'

  const position: XYPosition = { x: depth * LEVEL_X_GAP, y: 0 }
  ctx.nodes.push({
    id,
    position,
    data: { path, key, value, kind, color: { bg: style.bg, text: style.color, border: style.border } },
    style: { border: `1px solid ${style.border}` },
    draggable: false,
    selectable: true,
    type: 'tree',
  })

  // Leaf node
  if (!(Array.isArray(value) || (value !== null && typeof value === 'object'))) {
    return { id, size: 1 }
  }

  // Children
  const children: Array<{ key: string; value: JsonValue; path: string }> = []
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      children.push({ key: String(i), value: v, path: `${path}[${i}]` })
    })
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => {
      const childPath = path ? `${path}.${k}` : `$.${k}`
      children.push({ key: k, value: v as JsonValue, path: childPath })
    })
  }

  // Build children subtrees and compute layout y offsets
  const childInfos: Array<{ id: string; size: number }> = []
  for (const child of children) {
    const info = buildSubtree(ctx, child.key, child.value, child.path, depth + 1)
    childInfos.push(info)
    ctx.edges.push({ id: `${id}-${info.id}`, source: id, target: info.id })
  }

  // Layout: vertically stack by subtree size
  const totalSize = childInfos.reduce((acc, c) => acc + c.size, 0)

  // Position children
  let yCursor = -((totalSize - 1) * SIBLING_Y_GAP) / 2
  for (const info of childInfos) {
    const childNode = ctx.nodes.find((n) => n.id === info.id)!
    childNode.position.y = yCursor
    yCursor += info.size * SIBLING_Y_GAP
  }

  // Set parent y to midpoint of first and last child
  if (childInfos.length > 0) {
    const firstChild = ctx.nodes.find((n) => n.id === childInfos[0].id)!
    const lastChild = ctx.nodes.find((n) => n.id === childInfos[childInfos.length - 1].id)!
    const mid = (firstChild.position.y + lastChild.position.y) / 2
    const parentNode = ctx.nodes.find((n) => n.id === id)!
    parentNode.position.y = mid
  }

  return { id, size: Math.max(1, totalSize) }
}

export function jsonToFlow(json: JsonValue): GraphResult {
  const ctx: BuildContext = { nodes: [], edges: [], idByPath: new Map(), nextId: 1 }
  const rootPath = '$'
  buildSubtree(ctx, null, json, rootPath, 0)
  return ctx
}


