import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

@Injectable()
export class GoogleDriveService {
  private readonly auth: GoogleAuth<JSONClient>;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: 'google_auth_key.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  async upload(name: string, stream: ReadableStream) {
    const drive = google.drive({ version: 'v3', auth: this.auth });

    const response = await drive.files.create({
      requestBody: {
        name,
        parents: ['1QGzHrwlD2lwPLMVHVAy10pdba1WsxDq3'],
      },
      media: {
        body: stream,
      },
    });

    if (!response.data.id) {
      throw new Error('Failed to get upload file id');
    }

    const { data } = await drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink',
    });

    return data.webViewLink;
  }
}
