function ScoreForm({ onAdd }) {
  const [date, setDate] = React.useState('');
  const [score, setScore] = React.useState('');
  return (
    <form className="mb-3" onSubmit={e => { e.preventDefault(); onAdd({ date, score: parseInt(score, 10) }); setDate(''); setScore(''); }}>
      <div className="row g-2 align-items-end">
        <div className="col">
          <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="col">
          <input type="number" className="form-control" value={score} onChange={e => setScore(e.target.value)} required placeholder="Score" />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit">Add</button>
        </div>
      </div>
    </form>
  );
}

function ScoreList({ scores }) {
  if (scores.length === 0) return <p>No scores yet.</p>;
  return (
    <table className="table table-striped">
      <thead>
        <tr><th>Date</th><th>Score</th></tr>
      </thead>
      <tbody>
        {scores.map((s, idx) => (
          <tr key={idx}>
            <td>{s.date}</td>
            <td>{s.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Metrics({ scores }) {
  if (scores.length === 0) return null;
  const avg = scores.reduce((a, b) => a + b.score, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b.score - avg, 2), 0) / scores.length;
  const stddev = Math.sqrt(variance);
  const best = Math.max(...scores.map(s => s.score));
  return (
    <div className="card p-3 mt-3">
      <h4 className="mb-3">Metrics</h4>
      <p>Average: {avg.toFixed(2)}</p>
      <p>Std Dev: {stddev.toFixed(2)}</p>
      <p>Best Score: {best}</p>
    </div>
  );
}

function App() {
  const [name, setName] = React.useState('');
  const [tempName, setTempName] = React.useState('');
  const [scores, setScores] = React.useState([]);
  if (!name) {
    return (
      <div className="container mt-5">
        <div className="card p-4">
          <h1 className="mb-3">Enter your name</h1>
          <form onSubmit={e => { e.preventDefault(); setName(tempName); }}>
            <input className="form-control mb-2" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Your full name" />
            <button className="btn btn-primary" type="submit">Start</button>
          </form>
        </div>
      </div>
    );
  }
  const addScore = async (entry) => {
    setScores([...scores, entry]);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: name, ...entry })
      });
    } catch (e) {
      console.error('Failed to save', e);
    }
  };
  return (
    <div className="container mt-5">
      <h2 className="mb-3">Hello {name}</h2>
      <ScoreForm onAdd={addScore} />
      <ScoreList scores={scores} />
      <Metrics scores={scores} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
