import * as fs from 'fs'
import { google, sheets_v4 } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'

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
}

const TOKEN_PATH = './src/helpers/token.json'

async function readJSON(dir): Promise<any> {
  return new Promise((resolve, reject) => {
    // Load client secrets from a local file.
    fs.readFile(dir, { encoding: 'utf8' }, (err, content) => {
      if (err) {
        console.log('Error loading client secret file:')
        return reject(err)
      }
      // Authorize a client with credentials, then call the Google Sheets API.
      resolve(JSON.parse(content));
    });
  })
}

async function authorize(): Promise<OAuth2Client> {
  // const credentials = await readJSON('./src/helpers/credentials.json')
  const { client_secret, client_id, redirect_uris = ', ' } = process.env;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris.split(', ')[0]);

  try {
    const token = await readJSON(TOKEN_PATH)
    oAuth2Client.setCredentials(token)
  } catch {
    // getNewToken(oAuth2Client, callback);
  }

  return oAuth2Client
}
