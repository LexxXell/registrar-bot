import bot from '../bot';
import { sendMessage } from '../bot/helpers/send-message.helper';
import { DateQuotas } from '../quotasChecker/@types/date-quotas.type';
import { formularType } from './constants.helper';

export function informOnQuotas(dateQuotas: Array<DateQuotas>) {
  const strDateQuotas = dateQuotas.map((el) => `${el.date} - ${el.quotas}`).join('\n');
  const message = bot.i18n.t(process.env.BOT_LANGUAGE ?? 'en', 'registration_is_open', { formularType, strDateQuotas });
  const recipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];
  sendMessage(message, recipients);
}
