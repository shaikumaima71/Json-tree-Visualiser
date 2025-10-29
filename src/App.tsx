import { useMemo, useState } from 'react'
import './App.css'
import JsonInput from './components/JsonInput'
import FlowView from './components/FlowView'
import SearchBar from './components/SearchBar'
import { jsonToFlow, type JsonValue } from './utils/jsonToFlow'
import { parseJsonPath } from './utils/jsonPath'
import { ReactFlowProvider } from 'reactflow'

function App() {
  const [json, setJson] = useState<JsonValue | null>(null)
  const graph = useMemo(() => (json ? jsonToFlow(json) : { nodes: [], edges: [], idByPath: new Map() }), [json])
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [searchMsg, setSearchMsg] = useState<string | null>(null)

  function handleSearch(input: string) {
    if (!json) {
      setSearchMsg('No data to search')
      setHighlightId(null)
      return
    }
    const tokens = parseJsonPath(input)
    if (!tokens) {
      setSearchMsg('Invalid path')
      setHighlightId(null)
      return
    }
    const nodeId = graph.idByPath.get(input)
    if (nodeId) {
      setHighlightId(nodeId)
      setSearchMsg('Match found')
    } else {
      setHighlightId(null)
      setSearchMsg('No match found')
    }
  }

  return (
    <div className="page-container">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">JSON Tree Visualizer</h1>
        
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <JsonInput onValidJson={(v) => { setJson(v as JsonValue); setHighlightId(null); setSearchMsg(null) }} onReset={() => { setJson(null); setHighlightId(null); setSearchMsg(null) }} />
        <div className="flex flex-col gap-3">
          <SearchBar onSearch={handleSearch} resultMessage={searchMsg} />
          <div className="card text-sm">
            <div className="font-medium mb-2">Legend</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border p-2" style={{ backgroundColor: '#1e1b4b', color: '#ddd6fe', borderColor: '#3730a3' }}>Object</div>
              <div className="rounded border p-2" style={{ backgroundColor: '#064e3b', color: '#d1fae5', borderColor: '#065f46' }}>Array</div>
              <div className="rounded border p-2" style={{ backgroundColor: '#7c2d12', color: '#ffedd5', borderColor: '#9a3412' }}>Primitive</div>
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">Each node shows its JSON path for searching.</div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <ReactFlowProvider>
          <FlowView nodes={graph.nodes} edges={graph.edges} highlightedNodeId={highlightId} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

export default App
