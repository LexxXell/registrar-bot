import { formularType } from './helpers/constants.helper';
import { DateQuotas } from './quotasChecker/@types/date-quotas.type';
import { getDateQuotas } from './quotasChecker';
import { register } from './registrar';
import { informOnQuotas } from './helpers/inform-on-qoutas.helper';
import { getAvailableQuotas } from './quotasChecker/helpers';
import { Logger } from './helpers/logger.helper';
import { sendRegistrationDetails } from './bot/helpers/send-registration-details.helper';
import { sendErrorToAdmin } from './helpers/sendErrorToAdmin.helper';
import { PersonModel } from './models/person.model';
import { FormularTypes } from './registrar/@types';

const logger = new Logger('RegLoop');

export async function regLoop() {
  logger.log('New Reg loop');
  const persons = await PersonModel.find({ registration_number: { $eq: null }, error: { $eq: false } });
  if (!persons.length) {
    logger.log('Registration list is empty');
    return;
  }
  logger.log(`Persons on the registration list: ${persons.length}`);
  logger.log('Check quotas');
  const dateQuotas: Array<DateQuotas> = await getDateQuotas(formularType);
  if (dateQuotas.length) {
    logger.log('Quotas available');
    logger.log('Start registration process');
    informOnQuotas(dateQuotas);
    dateQuotaLoop: for (let dateQuota of dateQuotas) {
      const date = dateQuota.date;
      let quota = dateQuota.quotas;
      for (quota; quota > 0; quota--) {
        if (!persons.length) {
          break dateQuotaLoop;
        }
        if (quota < 20) {
          quota = await getAvailableQuotas(formularType, date);
          if (!quota) {
            break dateQuotaLoop;
          }
        }
        const person = persons.shift();
        const regResult = await register({
          ...person.toJSON(),
          tip_formular: FormularTypes[formularType],
          date,
        });
        if (regResult) {
          person.registration_date = regResult.date;
          person.registration_number = regResult.ticket_number;
        } else {
          person.error = true;
          continue;
        }
        await person.save();
      }
    }
    if ((await PersonModel.find({ $or: [{ registration_number: { $ne: null } }, { error: true }] })).length) {
      logger.log('Send registration info');
      await sendRegistrationDetails();
      logger.log('Cleaning registered and error persons');
      try {
        await PersonModel.deleteMany({ $or: [{ registration_number: { $ne: null } }, { error: true }] });
      } catch (e) {
        sendErrorToAdmin(`DELETION PERSONS ERROR\n${(e as Error).message}`);
        logger.error(e);
      }
    }

    logger.log('Finish registration process');
  }
}
