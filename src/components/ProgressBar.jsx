export default function ProgressBar({ total, completed }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{completed}/{total} done</span>
    </div>
  )
}
