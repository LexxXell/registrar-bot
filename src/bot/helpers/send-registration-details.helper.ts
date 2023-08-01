import { existsSync, unlinkSync } from 'fs';
import { messageRecipients } from '../../helpers/constants.helper';
import { delay } from '../../helpers/delay.helper';
import { sendErrorToAdmin } from '../../helpers/sendErrorToAdmin.helper';
import { PersonModel } from '../../models/person.model';
import { i18nMessage } from './i18n-message.helper';
import { sendMessage } from './send-message.helper';
import { sendImage } from './send-image.helper';

export async function sendRegistrationDetails() {
  const persons = await PersonModel.find();
  if (!persons.length) {
    return;
  }
  for (let person of persons) {
    try {
      const message = i18nMessage(
        person.error ? 'person_error' : person.registration_number ? 'person_success' : 'person',
        { person },
      );
      if (existsSync(`reg_media/${person.email}.png`)) {
        await sendImage(`reg_media/${person.email}.png`, message, messageRecipients);
        unlinkSync(`reg_media/${person.email}.png`);
      } else {
        await sendMessage(message, messageRecipients);
      }
    } catch {
      sendErrorToAdmin(`SEND REGISTRATION ERROR\n${person}`);
    }
    await delay(100);
  }
}
