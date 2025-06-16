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
  const [username, setUsername] = React.useState(null);
  const [nameInput, setNameInput] = React.useState('');
  const [scores, setScores] = React.useState([]);

  const submitName = async (e) => {
    e.preventDefault();
    if (!nameInput) return;
    setUsername(nameInput);
    try {
      const resp = await fetch(`/api/scores/${encodeURIComponent(nameInput)}`);
      if (resp.ok) {
        const data = await resp.json();
        setScores(data);
      }
    } catch (err) {
      console.error('Failed to load scores', err);
    }
  };

  if (!username) {
    return (
      <div className="container">
        <form onSubmit={submitName}>
          <h1>Enter a unique username</h1>
          <input
            className="text-input"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Username"
            required
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    );
  }
  const addScore = async (entry) => {
    setScores([...scores, entry]);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, ...entry })
      });
    } catch (e) {
      console.error('Failed to save', e);
    }
  };
  return (
    <div className="container">
      <h2>Hello {username}</h2>
      <ScoreForm onAdd={addScore} />
      <ScoreList scores={scores} />
      <Metrics scores={scores} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
