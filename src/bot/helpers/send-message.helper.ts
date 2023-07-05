import bot from '..';
import { delay } from '../../helpers/delay.helper';

export async function sendMessage(message: string, recipients: Array<string | number>) {
  await delay(1000);
  for (let recipient of recipients) {
    await bot.telegram.sendMessage(recipient, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }
}
