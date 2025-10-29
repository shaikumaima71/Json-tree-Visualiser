import { useEffect, useMemo, useRef } from 'react'
import ReactFlow, { Background, Controls, useReactFlow } from 'reactflow'
import 'reactflow/dist/style.css'
import type { Edge, Node } from 'reactflow'
import TreeNode from './nodes/TreeNode'

type FlowViewProps = {
  nodes: Node[]
  edges: Edge[]
  highlightedNodeId?: string | null
}

export default function FlowView({ nodes, edges, highlightedNodeId }: FlowViewProps) {
  const rf = useReactFlow()
  const firstRender = useRef(true)

  const highlighted = useMemo(() => new Set([highlightedNodeId].filter(Boolean) as string[]), [highlightedNodeId])

  useEffect(() => {
    if (firstRender.current && nodes.length) {
      firstRender.current = false
      setTimeout(() => rf.fitView({ padding: 0.2 }), 0)
    }
  }, [nodes, rf])

  useEffect(() => {
    if (!highlightedNodeId) return
    const n = nodes.find((n) => n.id === highlightedNodeId)
    if (n) rf.setCenter(n.position.x + 100, n.position.y, { zoom: 1.2, duration: 400 })
  }, [highlightedNodeId, nodes, rf])

  const nodeTypes = useMemo(() => ({ tree: TreeNode }), [])

  const styledNodes = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      style: {
        ...(n.style || {}),
        boxShadow: highlighted.has(n.id) ? '0 0 0 3px rgba(251,191,36,0.9)' : (n.style as any)?.boxShadow,
      },
    }))
  }, [nodes, highlighted])

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={styledNodes} edges={edges} nodeTypes={nodeTypes} fitView panOnScroll panOnDrag zoomOnScroll>
        <Background gap={24} size={1} color="#374151" />
        <Controls showInteractive />
      </ReactFlow>
    </div>
  )
}


