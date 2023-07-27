import { messageRecipients } from '../../helpers/constants.helper';
import { delay } from '../../helpers/delay.helper';
import { sendErrorToAdmin } from '../../helpers/sendErrorToAdmin.helper';
import { PersonModel } from '../../models/person.model';
import { i18nMessage } from './i18n-message.helper';
import { sendMessage } from './send-message.helper';

export async function sendRegistrationDetails() {
  const persons = await PersonModel.find();
  if (!persons.length) {
    return;
  }
  for (let person of persons) {
    try {
      await sendMessage(
        i18nMessage(person.error ? 'person_error' : person.registaretion_number ? 'person_success' : 'person', {
          person,
        }),
        messageRecipients,
      );
    } catch {
      sendErrorToAdmin(`SEND REGISTRATION ERROR\n${person}`);
    }
    await delay(100);
  }
}
