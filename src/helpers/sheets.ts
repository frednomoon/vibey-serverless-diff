import * as fs from 'fs'
import { google, sheets_v4 } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import { IState } from '../interfaces';

export class Sheets {
  auth: OAuth2Client
  sheets: sheets_v4.Sheets

  async init() {
    this.auth = await authorize()
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async read(spreadsheetId, range) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })
    return response.data
  }

  async readToState(spreadsheetId: string, range: string): Promise<IState> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId, range
    })

    const v = response.data.values || []

    const state = {
      cat: {

      },
      labels: {

      },
      artists: {

      }
    }

    v[0].forEach(row => {
      const [cat, info] = JSON.parse(row)
      state.cat[cat] = info
    })

    v[2].forEach(row => {
      const [lab, info] = JSON.parse(row)
      state.labels[lab] = info
    })

    v[1].forEach(row => {
      const [art, info] = JSON.parse(row)
      state.artists[art] = info
    })

    return {
      ...state,
      meta: {
        labels: Object.keys(state.labels).length,
        artists: Object.keys(state.artists).length,
        releases: Object.keys(state.cat).length
      }
    }
  }
}

// const TOKEN_PATH = './src/helpers/token.json'

// async function readJSON(dir): Promise<any> {
//   return new Promise((resolve, reject) => {
//     // Load client secrets from a local file.
//     fs.readFile(dir, { encoding: 'utf8' }, (err, content) => {
//       if (err) {
//         console.log('Error loading client secret file:')
//         return reject(err)
//       }
//       // Authorize a client with credentials, then call the Google Sheets API.
//       resolve(JSON.parse(content));
//     });
//   })
// }

// const credentials = {
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
// }

async function authorize(): Promise<OAuth2Client> {
  const { client_secret, client_id } = process.env;
  const redirect_uris = ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials({
    // scope: "https://www.googleapis.com/auth/spreadsheets",
    token_type: "Bearer",
    expiry_date: 1565778011002,
    access_token: process.env.access_token,
    refresh_token: process.env.refresh_token
  })

  return oAuth2Client
}
