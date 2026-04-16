import { useState, useEffect } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import TodoFilter from './components/TodoFilter'
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

  function addTodo(text) {
    setTodos(prev => [
      { id: Date.now(), text, completed: false },
      ...prev,
    ])
  }

  function toggleTodo(id) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
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

  const activeCount = todos.filter(t => !t.completed).length

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

        {todos.length > 0 ? (
          <>
            <TodoFilter
              filter={filter}
              onFilter={setFilter}
              activeCount={activeCount}
              hasCompleted={todos.some(t => t.completed)}
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
