import { useState } from 'react'

type JsonInputProps = {
  onValidJson: (value: unknown) => void
  onReset?: () => void
}

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "roles": ["admin", "editor"],
    "address": { "city": "NYC", "zip": 10001 }
  },
  "items": [
    { "id": 101, "qty": 2 },
    { "id": 102, "qty": 5 }
  ]
}`

export default function JsonInput({ onValidJson, onReset }: JsonInputProps) {
  const [text, setText] = useState(SAMPLE)
  const [error, setError] = useState<string | null>(null)

  function onVisualize() {
    try {
      const parsed = JSON.parse(text)
      setError(null)
      onValidJson(parsed)
    } catch (e: any) {
      setError(e?.message || 'Invalid JSON')
    }
  }

  return (
    <div className="card flex h-full flex-col gap-2">
      <label className="label">JSON Input</label>
      <textarea
        className="input h-48 resize-y font-mono text-xs"
        placeholder="Paste JSON here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={onVisualize}>Visualize</button>
        <button className="btn" onClick={() => { setText(''); setError(null); onReset?.() }}>Reset</button>
      </div>
    </div>
  )
}


