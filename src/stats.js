import { results } from './results.js'

export const PLAYERS = {
  domi:   { label: 'Dominik', color: '#38bdf8' },
  gaetan: { label: 'Gaëtan',  color: '#fb923c' },
}

export function getOverall() {
  return results.reduce(
    (acc, { domi, gaetan }) => {
      acc.domiSets += domi
      acc.gaetanSets += gaetan
      if (domi > gaetan) acc.domiWins++
      else if (gaetan > domi) acc.gaetanWins++
      return acc
    },
    { domiWins: 0, gaetanWins: 0, domiSets: 0, gaetanSets: 0 }
  )
}

export function getBarData() {
  return results.map(({ date, domi, gaetan }) => ({
    date,
    [PLAYERS.domi.label]:   domi,
    [PLAYERS.gaetan.label]: gaetan,
  }))
}

export function getCumulativeData() {
  let domiTotal = 0
  let gaetanTotal = 0
  return results.map(({ date, domi, gaetan }) => {
    if (domi > gaetan) domiTotal++
    else if (gaetan > domi) gaetanTotal++
    return {
      date,
      [PLAYERS.domi.label]:   domiTotal,
      [PLAYERS.gaetan.label]: gaetanTotal,
    }
  })
}

export { results }
