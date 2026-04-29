import { results } from './results.js'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const DOMI_COLOR = '#38bdf8'
const GAETAN_COLOR = '#fb923c'

function computeOverall(results) {
  let domiWins = 0
  let gaetanWins = 0
  let domiSets = 0
  let gaetanSets = 0

  results.forEach(({ domi, gaetan }) => {
    domiSets += domi
    gaetanSets += gaetan
    if (domi > gaetan) domiWins++
    else if (gaetan > domi) gaetanWins++
  })

  return { domiWins, gaetanWins, domiSets, gaetanSets }
}

function buildCumulativeData(results) {
  let domiTotal = 0
  let gaetanTotal = 0
  return results.map(({ date, domi, gaetan }) => {
    domiTotal += domi > gaetan ? 1 : 0
    gaetanTotal += gaetan > domi ? 1 : 0
    return { date, Dominik: domiTotal, Gaëtan: gaetanTotal }
  })
}

export default function App() {
  const { domiWins, gaetanWins, domiSets, gaetanSets } = computeOverall(results)
  const cumulativeData = buildCumulativeData(results)

  const barData = results.map(({ date, domi, gaetan }) => ({
    date,
    Dominik: domi,
    Gaëtan: gaetan,
  }))

  const totalMatches = domiWins + gaetanWins
  const leader =
    domiWins > gaetanWins
      ? 'Dominik'
      : gaetanWins > domiWins
      ? 'Gaëtan'
      : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🏓</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Gaëtan <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs</span> Dominik
        </h1>
        {leader && (
          <p style={{ color: '#94a3b8', marginTop: '0.4rem' }}>
            {leader} is leading after {totalMatches} match{totalMatches !== 1 ? 'es' : ''}
          </p>
        )}
      </header>

      {/* Overall score cards */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
        <ScoreCard name="Dominik" wins={domiWins} sets={domiSets} color={DOMI_COLOR} align="right" />
        <div style={{ textAlign: 'center', color: '#475569', fontWeight: 700, fontSize: '1.5rem' }}>—</div>
        <ScoreCard name="Gaëtan" wins={gaetanWins} sets={gaetanSets} color={GAETAN_COLOR} align="left" />
      </section>

      {/* Per-match sets bar chart */}
      <Card title="Sets per Match">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="Dominik" fill={DOMI_COLOR} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gaëtan" fill={GAETAN_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cumulative wins line chart */}
      <Card title="Cumulative Match Wins">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Line type="monotone" dataKey="Dominik" stroke={DOMI_COLOR} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Gaëtan" stroke={GAETAN_COLOR} strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Match history table */}
      <Card title="Match History">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
              <th style={th}>Date</th>
              <th style={{ ...th, color: DOMI_COLOR }}>Dominik</th>
              <th style={th}>vs</th>
              <th style={{ ...th, color: GAETAN_COLOR }}>Gaëtan</th>
              <th style={th}>Winner</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ date, domi, gaetan }) => {
              const winner = domi > gaetan ? 'Dominik' : gaetan > domi ? 'Gaëtan' : 'Draw'
              const winnerColor = winner === 'Dominik' ? DOMI_COLOR : winner === 'Gaëtan' ? GAETAN_COLOR : '#94a3b8'
              return (
                <tr key={date} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={td}>{date}</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: DOMI_COLOR }}>{domi}</td>
                  <td style={{ ...td, textAlign: 'center', color: '#475569' }}>:</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: GAETAN_COLOR }}>{gaetan}</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 600, color: winnerColor }}>{winner}</td>
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
    <div
      style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        textAlign: align,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
        {name}
      </div>
      <div style={{ fontSize: '3rem', fontWeight: 800, color, lineHeight: 1.1 }}>{wins}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
        {wins} win{wins !== 1 ? 's' : ''} · {sets} sets
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '1.5rem' }}>
      <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '1rem' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

const th = { padding: '0.5rem 0.75rem', textAlign: 'center', fontWeight: 600 }
const td = { padding: '0.6rem 0.75rem', textAlign: 'center' }
