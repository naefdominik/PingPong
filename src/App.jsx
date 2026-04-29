import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PLAYERS, getOverall, getBarData, getCumulativeData, results } from './stats.js'
import './App.css'

const { domi, gaetan } = PLAYERS

const chart = {
  axis:    { tick: { fill: '#94a3b8', fontSize: 12 } },
  grid:    { strokeDasharray: '3 3', stroke: '#0f172a' },
  tooltip: { contentStyle: { background: '#1e293b', border: 'none', borderRadius: 8 }, labelStyle: { color: '#f1f5f9' } },
  legend:  { wrapperStyle: { color: '#94a3b8' } },
}

export default function App() {
  const { domiWins, gaetanWins, domiSets, gaetanSets } = getOverall()
  const totalMatches = domiWins + gaetanWins
  const leader = domiWins > gaetanWins ? domi.label : gaetanWins > domiWins ? gaetan.label : null

  return (
    <div className="app">
      <header className="header">
        <div className="emoji">🏓</div>
        <h1>{gaetan.label} <span>vs</span> {domi.label}</h1>
        {leader && <p>{leader} is leading after {totalMatches} match{totalMatches !== 1 ? 'es' : ''}</p>}
      </header>

      <section className="scoreboard">
        <ScoreCard name={domi.label}   wins={domiWins}   sets={domiSets}   color={domi.color}   align="right" />
        <div className="divider">—</div>
        <ScoreCard name={gaetan.label} wins={gaetanWins} sets={gaetanSets} color={gaetan.color} align="left" />
      </section>

      <Card title="Sets per Match">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={getBarData()} barCategoryGap="30%">
            <CartesianGrid {...chart.grid} />
            <XAxis dataKey="date" {...chart.axis} />
            <YAxis allowDecimals={false} {...chart.axis} />
            <Tooltip {...chart.tooltip} />
            <Legend {...chart.legend} />
            <Bar dataKey={domi.label}   fill={domi.color}   radius={[4, 4, 0, 0]} />
            <Bar dataKey={gaetan.label} fill={gaetan.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Cumulative Match Wins">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={getCumulativeData()}>
            <CartesianGrid {...chart.grid} />
            <XAxis dataKey="date" {...chart.axis} />
            <YAxis allowDecimals={false} {...chart.axis} />
            <Tooltip {...chart.tooltip} />
            <Legend {...chart.legend} />
            <Line type="monotone" dataKey={domi.label}   stroke={domi.color}   strokeWidth={2} dot={{ r: 1 }} />
            <Line type="monotone" dataKey={gaetan.label} stroke={gaetan.color} strokeWidth={2} dot={{ r: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Match History">
        <table className="match-table">
          <thead>
            <tr>
              <th>Date</th>
              <th style={{ color: domi.color }}>{domi.label}</th>
              <th>vs</th>
              <th style={{ color: gaetan.color }}>{gaetan.label}</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ date, domi: d, gaetan: g }) => {
              const winner = d > g ? domi.label : g > d ? gaetan.label : 'Draw'
              const winnerColor = winner === domi.label ? domi.color : winner === gaetan.label ? gaetan.color : '#94a3b8'
              return (
                <tr key={date}>
                  <td className="col-date">{date}</td>
                  <td className="col-score" style={{ color: domi.color }}>{d}</td>
                  <td className="col-vs">:</td>
                  <td className="col-score" style={{ color: gaetan.color }}>{g}</td>
                  <td className="col-winner" style={{ color: winnerColor }}>{winner}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function ScoreCard({ name, wins, sets, color, align }) {
  return (
    <div className={`score-card ${align}`} style={{ borderTop: `3px solid ${color}` }}>
      <div className="label">{name}</div>
      <div className="wins" style={{ color }}>{wins}</div>
      <div className="meta">{wins} win{wins !== 1 ? 's' : ''} · {sets} sets</div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
