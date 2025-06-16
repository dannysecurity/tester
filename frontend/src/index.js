function ScoreForm({ onAdd }) {
  const [date, setDate] = React.useState('');
  const [score, setScore] = React.useState('');
  return (
    <form
      className="score-form"
      onSubmit={e => {
        e.preventDefault();
        onAdd({ date, score: parseInt(score, 10) });
        setDate('');
        setScore('');
      }}
    >
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={score}
        onChange={e => setScore(e.target.value)}
        required
        placeholder="Score"
      />
      <button type="submit">Add</button>
    </form>
  );
}

function ScoreList({ scores }) {
  return (
    <table className="score-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Score</th>
        </tr>
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
    <div className="metrics">
      <div>Average: {avg.toFixed(2)}</div>
      <div>Std Dev: {stddev.toFixed(2)}</div>
      <div>Best Score: {best}</div>
    </div>
  );
}

function App() {
  const [name, setName] = React.useState('');
  const [scores, setScores] = React.useState([]);
  if (!name) {
    return (
      <div className="container">
        <h1>Enter your name</h1>
        <input
          className="text-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
        />
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
    <div className="container">
      <h2>Hello {name}</h2>
      <ScoreForm onAdd={addScore} />
      <ScoreList scores={scores} />
      <Metrics scores={scores} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
