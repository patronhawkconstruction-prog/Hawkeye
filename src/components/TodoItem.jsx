import { useState, useRef, useEffect } from 'react'

const PRIORITY_META = {
  high:   { label: 'High',   color: '#f87171' },
  medium: { label: 'Med',    color: '#fbbf24' },
  low:    { label: 'Low',    color: '#60a5fa' },
}

function formatDue(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((due - today) / 86400000)

  if (diff < 0) return { text: `Overdue by ${Math.abs(diff)}d`, overdue: true }
  if (diff === 0) return { text: 'Due today', today: true }
  if (diff === 1) return { text: 'Due tomorrow', soon: true }
  if (diff <= 3) return { text: `Due in ${diff}d`, soon: true }
  return { text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [removing, setRemoving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed)
    } else {
      setDraft(todo.text)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraft(todo.text)
      setEditing(false)
    }
  }

  function handleDelete() {
    setRemoving(true)
    setTimeout(() => onDelete(todo.id), 220)
  }

  const due = formatDue(todo.dueDate)
  const meta = PRIORITY_META[todo.priority] || PRIORITY_META.medium

  return (
    <li className={[
      'todo-item',
      todo.completed ? 'completed' : '',
      removing ? 'removing' : '',
    ].filter(Boolean).join(' ')}>

      <input
        className="todo-check"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      />

      <div className="todo-body">
        {editing ? (
          <input
            ref={inputRef}
            className="todo-edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title={todo.completed ? '' : 'Double-click to edit'}
          >
            {todo.text}
          </span>
        )}

        <div className="todo-meta">
          <span
            className="priority-badge"
            style={{ '--p-color': meta.color }}
          >
            {meta.label}
          </span>

          {due && !todo.completed && (
            <span className={[
              'due-badge',
              due.overdue ? 'overdue' : '',
              due.today ? 'today' : '',
              due.soon ? 'soon' : '',
            ].filter(Boolean).join(' ')}>
              {due.text}
            </span>
          )}
        </div>
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        &times;
      </button>
    </li>
  )
}
