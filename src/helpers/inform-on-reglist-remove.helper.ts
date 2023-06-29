import bot from '../bot';
import { sendMessage } from '../bot/helpers/send-message.helper';
import { DateQuotas } from '../quotasChecker/@types/date-quotas.type';

export async function informOnReglistRemoved() {
  const message = bot.i18n.t(process.env.BOT_LANGUAGE ?? 'en', 'registration_reglist_removed');
  const recipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];
  await sendMessage(message, recipients);
}
