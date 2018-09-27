import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

export class SlackService {

  // private readonly WEBHOOK_URL: string = functions.config().slack.webhook;

  post(name: string) {
    const body = this.createJsonBody(name);

    return fetch(functions.config().slack.webhook, {
    // return fetch(this.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .catch(err => console.error('Failed to send message to Slack.', err));
  }

  private createJsonBody(name: string) {
    const title = `あ！やせいの${name}がとびだしてきた！`;

    return {
      attachments: [
        {
          fallback: title,
          color: '#00FF00',
          fields: [
            {
              title: title,
              value: ``,
            }
          ]
        }
      ]
    };
  }
}
