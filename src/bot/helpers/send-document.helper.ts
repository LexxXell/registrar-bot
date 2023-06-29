import bot from '..';
import { delay } from '../../helpers/delay.helper';

export async function sendDocument(filePath: string, caption: string, recipients: Array<string | number>) {
  await delay(10000);
  for (let recipient of recipients) {
    await bot.telegram.sendDocument(
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
