export interface IState {
  meta: {
    labels: number,
    artists: number,
    releases: number
  }
  cat: {
    [CATALOGUE_NUMBER: string]: {
      juno: IInfo,
      redeye: IInfo
    }
  },
  labels: {
    [LABEL_ID: string]: string[]
  },
  artists: {
    [ARTIST_ID: string]: string[]
  }
}

// export interface IConsolidatedRelease {
//   expected: string
//   outOfStock: {
//     juno: boolean
//     redeye: boolean
//     decks: boolean
//   }
//   artist: string
//   label: string
//   cat: string
//   link: string
//   title: string
//   type: string
// }

export interface IInfo {
  expected: string
  outOfStock: boolean
  artist: string
  label: string
  cat: string
  link: string
}

export interface IRelease {
  cat: string
  info: IInfo
}