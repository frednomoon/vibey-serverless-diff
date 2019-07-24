import { readFile } from 'fs'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'
import { IState } from './interfaces'

const current = 1563892045400

main(1563877395367, {
  labels: ['Mechatronica', 'Church', 'Craigie Knowes', 'Lunar Orbiter Program'],
  artists: ['No Moon', 'Barker', 'Illektrolab']
})

async function main(previous: IState | any, preferences: any) {
  const [one, two] = await readFiles(previous, current)

  const added = addMeta(addedDiff(one, two))
  const removed = addMeta(deletedDiff(one, two))
  const updated = addMeta(updatedDiff(one ,two))



  console.log(added)
}

function addMeta(fullDiff): any {
  return {
    ...fullDiff,
    meta: {
      releases: Object.keys(fullDiff.cat).length,
      labels: Object.keys(fullDiff.labels).length,
      artists: Object.keys(fullDiff.artists).length
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
