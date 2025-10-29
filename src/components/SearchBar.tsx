import { useState } from 'react'

type SearchBarProps = {
  onSearch: (path: string) => void
  resultMessage?: string | null
}

export default function SearchBar({ onSearch, resultMessage }: SearchBarProps) {
  const [query, setQuery] = useState('$.user.name')
  return (
    <div className="card flex items-end gap-2">
      <div className="flex-1">
        <label className="label">Search by JSON Path</label>
        <input
          className="input"
          placeholder="e.g. $.user.name or items[0].id"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSearch(query) }}
        />
      </div>
      <button className="btn btn-primary" onClick={() => onSearch(query)}>Find</button>
      {resultMessage && <div className="text-sm text-gray-600 dark:text-gray-300">{resultMessage}</div>}
    </div>
  )
}


