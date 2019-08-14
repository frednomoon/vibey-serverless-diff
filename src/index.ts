import { readFile } from 'fs'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'
import { IState } from './interfaces'
import { Sheets } from './helpers/sheets';

// const current = 1565689635569

main(1565645282551, {
  labels: ['Mechatronica', 'Church', 'Craigie Knowes', 'Lunar Orbiter Program', 'Cultivated Electronics', 'Exit Records', 'Gosu'],
  artists: ['No Moon', 'Barker', 'Illektrolab', '214', 'Aphex Twin', 'Dawl', 'Burial', 'Dj Bogdan', 'Donato Dozzy', 'Earth Trax']
})

async function main(previous: IState | any, preferences: any) {
  const sheets = new Sheets()
  await sheets.init()

  // Get current
  const { values = [['', '']] } = await sheets.read(process.env.spreadsheetId, 'Meta!A1:D5')
  const current = values[0][1]

  // console.log(ting)

  const [one, two] = await readFiles(previous, current)

  const { artists, labels, meta, cat } = addMeta(addedDiff(one, two))

  const result = { artists: {}, labels: {}, cat: {} }
  preferences.labels.forEach(label => {
    result.labels[label] = labels[label] || null
    labels[label] && Object.keys(labels[label]).forEach(CAT => result.cat[CAT] = cat[CAT])
  })
  preferences.artists.forEach(artist => {
    result.artists[artist] = artists[artist] || null
    artists[artist] && Object.keys(artists[artist]).forEach(CAT => result.cat[CAT] = cat[CAT])
  })


  console.log(JSON.stringify(result))
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

async function readFiles(fileOne: number, fileTwo: number): Promise<[any, any]> {
  const filename = date => `/Volumes/1TB DRIVE/Documents/Repos/vibey/_data/${date}`
  return await Promise.all([
    new Promise((resolve, reject) => {
      readFile(filename(fileOne) + '.json', { encoding: 'utf8' }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res))
      })
    }),
    new Promise((resolve, reject) => {
      readFile(filename(fileTwo), { encoding: 'utf8' }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res))
      })
    })
  ])
}
