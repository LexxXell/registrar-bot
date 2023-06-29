import bot from '../bot';
import { sendDocument } from '../bot/helpers/send-document.helper';
import { reglistPath } from './constants.helper';

export async function informOnRegistrationResult(reglistFile: string = reglistPath) {
  const message = bot.i18n.t(process.env.BOT_LANGUAGE ?? 'en', 'registration_result');
  const recipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];
  await sendDocument(reglistFile, message, recipients);
}
