import bot from '..';
import { RegisteredPerson } from '../../@types/registered-person.type';
import { i18nMessage } from './i18n-message.helper';
import { sendMessage } from './send-message.helper';

export async function sendRegistrationDetails(registeredPersons: RegisteredPerson[]) {
  const recipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];
  if (!registeredPersons.length) {
    await sendMessage(i18nMessage('no_registered_persons'), recipients);
  }
  for (let person of registeredPersons) {
    await sendMessage(i18nMessage('registration_person_info', { person }), recipients);
  }
}
