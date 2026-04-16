import { useState } from 'react'

const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: '#60a5fa' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'high',   label: 'High',   color: '#f87171' },
]

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [expanded, setExpanded] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority, dueDate || null)
    setText('')
    setDueDate('')
    setPriority('medium')
    setExpanded(false)
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          autoFocus
        />
        <button className="add-btn" type="submit" disabled={!text.trim()}>
          Add
        </button>
      </div>

      {expanded && (
        <div className="input-options">
          <div className="option-group">
            <label className="option-label">Priority</label>
            <div className="priority-btns">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`priority-btn${priority === p.value ? ' selected' : ''}`}
                  style={{ '--p-color': p.color }}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="option-group">
            <label className="option-label" htmlFor="due-date">Due date</label>
            <input
              id="due-date"
              className="due-input"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}
    </form>
  )
}
