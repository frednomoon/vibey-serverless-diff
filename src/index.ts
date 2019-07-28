import { readFile } from 'fs'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'
import { IState } from './interfaces'

const current = 1564329201526

main(1564326487893, {
  labels: ['Mechatronica', 'Church', 'Craigie Knowes', 'Lunar Orbiter Program', 'Cultivated Electronics', 'Exit Records', 'Gosu'],
  artists: ['No Moon', 'Barker', 'Illektrolab', '214', 'Aphex Twin', 'Dawl', 'Burial', 'Dj Bogdan', 'Donato Dozzy', 'Earth Trax']
})

async function main(previous: IState | any, preferences: any) {
  const [one, two] = await readFiles(previous, current)

  const { artists, labels, meta, cat } = addMeta(addedDiff({}, two))

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
  const filename = date => `/home/fred/Repos/1Projects/vibey/_data/${date}.json`
  return await Promise.all([
    new Promise((resolve, reject) => {
      readFile(filename(fileOne), { encoding: 'utf8' }, (err, res) => {
        // if (err) reject(err)
        resolve(JSON.parse(res))
      })
    }),
    new Promise((resolve, reject) => {
      readFile(filename(fileTwo), { encoding: 'utf8' }, (err, res) => {
        // if (err) reject(err)
        resolve(JSON.parse(res))
      })
    })
  ])
}
