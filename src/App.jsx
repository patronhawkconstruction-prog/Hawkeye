import { useState, useEffect } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import TodoFilter from './components/TodoFilter'
import ProgressBar from './components/ProgressBar'
import './App.css'

const STORAGE_KEY = 'hawkeye-todos'

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(text, priority, dueDate) {
    setTodos(prev => [
      { id: Date.now(), text, priority, dueDate: dueDate || null, completed: false },
      ...prev,
    ])
  }

  function toggleTodo(id) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function toggleAll() {
    const allDone = todos.every(t => t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: !allDone })))
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id, text) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text } : t))
    )
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const completedCount = todos.filter(t => t.completed).length
  const activeCount = todos.length - completedCount
  const allDone = todos.length > 0 && todos.every(t => t.completed)

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">&#x1F441;</span>
          <span className="logo-text">Hawkeye</span>
        </div>
        <h1 className="title">Todo</h1>
      </header>

      <main className="main">
        <TodoInput onAdd={addTodo} />

        {todos.length > 0 && (
          <ProgressBar total={todos.length} completed={completedCount} />
        )}

        {todos.length > 0 ? (
          <>
            <div className="toggle-all-row">
              <label className="toggle-all-label">
                <input
                  type="checkbox"
                  className="toggle-all-check"
                  checked={allDone}
                  onChange={toggleAll}
                  aria-label="Toggle all tasks"
                />
                <span>{allDone ? 'Unmark all' : 'Mark all complete'}</span>
              </label>
            </div>

            <TodoFilter
              filter={filter}
              onFilter={setFilter}
              activeCount={activeCount}
              hasCompleted={completedCount > 0}
              onClearCompleted={clearCompleted}
            />
            <TodoList
              todos={filtered}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </>
        ) : (
          <p className="empty">No tasks yet. Add one above!</p>
        )}
      </main>
    </div>
  )
}
