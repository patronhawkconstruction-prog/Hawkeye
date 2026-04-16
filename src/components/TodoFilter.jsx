const FILTERS = ['all', 'active', 'completed']

export default function TodoFilter({ filter, onFilter, activeCount, hasCompleted, onClearCompleted }) {
  return (
    <div className="todo-filter">
      <span className="active-count">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <div className="filter-btns">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => onFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button className="clear-btn" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </div>
  )
}
