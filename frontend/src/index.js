function ScoreForm({ onAdd }) {
  const [date, setDate] = React.useState('');
  const [score, setScore] = React.useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onAdd({ date, score: parseInt(score, 10) }); setDate(''); setScore(''); }}>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="number" value={score} onChange={e => setScore(e.target.value)} required placeholder="Score" />
      <button type="submit">Add</button>
    </form>
  );
}

function ScoreList({ scores }) {
  return (
    <ul>
      {scores.map((s, idx) => <li key={idx}>{s.date}: {s.score}</li>)}
    </ul>
  );
}

function Metrics({ scores }) {
  if (scores.length === 0) return null;
  const avg = scores.reduce((a, b) => a + b.score, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b.score - avg, 2), 0) / scores.length;
  const stddev = Math.sqrt(variance);
  const best = Math.max(...scores.map(s => s.score));
  return (
    <div>
      <p>Average: {avg.toFixed(2)}</p>
      <p>Std Dev: {stddev.toFixed(2)}</p>
      <p>Best Score: {best}</p>
    </div>
  );
}

function App() {
  const [name, setName] = React.useState('');
  const [scores, setScores] = React.useState([]);
  if (!name) {
    return (
      <div>
        <h1>Enter your name</h1>
        <input value={name} onChange={e => setName(e.target.value)} />
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
    <div>
      <h2>Hello {name}</h2>
      <ScoreForm onAdd={addScore} />
      <ScoreList scores={scores} />
      <Metrics scores={scores} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
