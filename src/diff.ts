import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'
import { IState } from './interfaces'
import { Sheets } from './helpers/sheets';
import * as memoize from 'memoize-one'


exports.handler = function (event, context, callback) {
  if (process.env.context !== 'production') {
    process.env = (require('../.env.js')).default
  }
  main(1565787820807, {
    labels: ['Music From Memory', 'Mechatronica', 'Church', 'Craigie Knowes', 'Lunar Orbiter Program', 'Cultivated Electronics', 'Exit Records', 'Gosu'],
    artists: ['No Moon', 'Barker', 'Illektrolab', '214', 'Aphex Twin', 'Dawl', 'Burial', 'Dj Bogdan', 'Donato Dozzy', 'Earth Trax']
  }).then(result => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result)
    })
  }).catch(e => {
    console.log('yolo88')
    callback(null, e)
  })
}

export async function main(previous: number, preferences: any) {
  // Get diff of two states
  const [added, updated] = await compare(previous)
  return {
    added: filterByPreferences(added, preferences),
    // updated: filterByPreferences(updated, preferences),
    raw: { added, updated }
  }
}

async function compare(previous: number) {
  const spreadsheetId = process.env.spreadsheetId || ''

  const sheets = new Sheets()
  await sheets.init()

  const { values = [['', '']] } = await sheets.read(spreadsheetId, 'Meta!A1:D5')
  const current = values[0][1]

  // TODO: MEMOIZE
  const memoizedCompare = async (a: number, b: number) => {
    const x = await sheets.readToState(spreadsheetId, `${a}`)
    const y = await sheets.readToState(spreadsheetId, `${b}`)

    const added = addMeta(addedDiff(x, y))

    const updated = updatedDiff(x, y)

    return [added, updated]
  }

  return await memoizedCompare(previous, current)
}

function filterByPreferences(input, preferences) {
  const result = { artists: {}, labels: {}, cat: {} }

  const { artists, labels, meta, cat } = input
  preferences.labels.forEach(label => {
    label = label.toUpperCase()
    result.labels[label] = labels[label] || null
    labels[label] && Object.keys(labels[label]).forEach(CAT => result.cat[CAT] = cat[CAT])
  })
  preferences.artists.forEach(artist => {
    artist = artist.toUpperCase()
    result.artists[artist] = artists[artist] || null
    artists[artist] && Object.keys(artists[artist]).forEach(CAT => result.cat[CAT] = cat[CAT])
  })

  return result
}

function addMeta(fullDiff): any {
  const { cat = {}, labels = {}, artists = {} } = fullDiff
  return {
    ...fullDiff,
    meta: {
      releases: Object.keys(cat).length,
      labels: Object.keys(labels).length,
      artists: Object.keys(artists).length
    }
  }
}
