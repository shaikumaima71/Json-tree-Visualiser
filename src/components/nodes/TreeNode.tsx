import type { NodeProps } from 'reactflow'

type TreeNodeData = {
  path: string
  key?: string | null
  value: unknown
  kind: 'object' | 'array' | 'primitive'
  color: { bg: string; text: string; border: string }
}

export default function TreeNode({ data }: NodeProps<TreeNodeData>) {
  const { path, value, kind, color } = data
  const valuePreview = typeof value === 'object' && value !== null ? (kind === 'array' ? 'Array' : 'Object') : String(value)
  return (
    <div
      className="rounded-lg border p-2 text-xs shadow-sm"
      style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border, width: 240 }}
      title={`${path}: ${valuePreview}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium">{valuePreview}</span>
        <span className="rounded bg-black/20 px-2 py-[2px] text-[10px] uppercase tracking-wide">
          {kind}
        </span>
      </div>
      <div className="truncate text-[10px] opacity-80">{path}</div>
    </div>
  )
}


