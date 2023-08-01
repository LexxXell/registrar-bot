import bot from '..';
import { delay } from '../../helpers/delay.helper';

export async function sendImage(filePath: string, caption: string, recipients: Array<string | number>) {
  await delay(10000);
  for (let recipient of recipients) {
    await bot.telegram.sendPhoto(
      recipient,
      { source: filePath },
      {
        caption,
        parse_mode: 'HTML',
      },
    );
    await delay(5000);
  }
}
