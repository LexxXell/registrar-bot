import { formularType, propDateAwating, propDateEnv, regLoopAwaiting } from './helpers/constants.helper';
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
import { delay } from './helpers/delay.helper';

const logger = new Logger('RegLoop');

async function waitForProposeDate(dateQuotas: Array<DateQuotas>): Promise<DateQuotas> {
  process.env[propDateAwating] = '1';
  const initialValue = parseInt(process.env[propDateEnv] || '0');
  let currentValue = parseInt(process.env[propDateEnv] || '0');
  const waitTime = parseInt(process.env.PROP_DATE_ENV_WAIT_TIME || '60');
  for (let elapsedSeconds = 0; elapsedSeconds < waitTime; elapsedSeconds++) {
    await delay(1000);
    currentValue = parseInt(process.env[propDateEnv] || '0');
    if (currentValue !== initialValue) {
      break;
    }
  }
  process.env[propDateAwating] = '0';
  return dateQuotas[currentValue >= 0 && currentValue < dateQuotas.length ? currentValue : 0];
}

export async function regLoop() {
  if (!/true/.test(process.env[regLoopAwaiting])) {
    return;
  }
  process.env[regLoopAwaiting] = 'false';
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
    await informOnQuotas(dateQuotas);
    const propDateQoutas = await waitForProposeDate(dateQuotas);
    const index = dateQuotas.findIndex((item) => item.date === propDateQoutas.date);
    if (index !== -1 && index !== 0) {
      const [item] = dateQuotas.splice(index, 1);
      dateQuotas.unshift(item);
    }
    logger.log('Start registration process');
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
        person.error = true;

        try {
          const regResult = await register({
            ...person.toJSON(),
            tip_formular: FormularTypes[formularType],
            date,
          });

          if (regResult.date && regResult.ticket_number) {
            person.registration_date = regResult.date;
            person.registration_number = regResult.ticket_number;
            person.error = false;
          }
        } catch (e) {
          logger.error(e);
        }

        await person.save();
      }
    }
    if ((await PersonModel.find({ $or: [{ registration_number: { $ne: null } }, { error: true }] })).length) {
      logger.log('Send registration info');
      await sendRegistrationDetails();
      try {
        logger.log('Cleaning registered and error persons');
        await PersonModel.deleteMany({ $or: [{ registration_number: { $ne: null } }, { error: true }] });
      } catch (e) {
        sendErrorToAdmin(`DELETION PERSONS ERROR\n${(e as Error).message}`);
        logger.error(e);
      }
    }

    logger.log('Finish registration process');
    process.env[regLoopAwaiting] = 'true';
  }
}
