import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const EnrtyPhrases = [
  'あ！やせいの $name がとびだしてきた！',
  '鳥だ！飛行機だ！あっ、なんだ、ただの $name か。',
  'ねえ、聞いて！ $name が加わったよ！',
  'やあ、 $name 君。ちょっと話を聞いてくれないかのう。',
  'ヤッホー！ $name に任せて！',
  '$name があなたのパーティーに加わりました。',
  'あ！ $name が加わったぞ！トラップカード発動！',
];

export class SlackService {

  private readonly WEBHOOK_URL: string = functions.config().slack.webhook;

  post(name: string) {
    const body = this.createJsonBody(name);

    // return fetch(functions.config().slack.webhook, {
    return fetch(this.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .catch(err => console.error('Failed to send message to Slack.', err));
  }

  private createJsonBody(name: string) {
    const randomIdx = Math.floor(Math.random() * EnrtyPhrases.length);
    const title = EnrtyPhrases[randomIdx].replace('$name', name);

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
