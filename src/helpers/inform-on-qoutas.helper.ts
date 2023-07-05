import { i18nMessage } from '../bot/helpers/i18n-message.helper';
import { sendMessage } from '../bot/helpers/send-message.helper';
import { DateQuotas } from '../quotasChecker/@types/date-quotas.type';
import { formularType } from './constants.helper';

export function informOnQuotas(dateQuotas: Array<DateQuotas>) {
  const strDateQuotas = dateQuotas.map((el) => `${el.date} - ${el.quotas}`).join('\n');
  const recipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];
  sendMessage(i18nMessage('registration_is_open', { formularType, strDateQuotas }), recipients);
}
