import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { formularType, reglistPath } from './helpers/constants.helper';
import { DateQuotas } from './quotasChecker/@types/date-quotas.type';
import { getDateQuotas } from './quotasChecker';
import { RegisteredPerson } from './@types/registered-person.type';
import { FormularTypes, RegData, register } from './registrar';
import { informOnQuotas } from './helpers/inform-on-qoutas.helper';
import { reglistToObjects } from './helpers/reglist-to-objects.helper';
import { getAvailableQuotas } from './quotasChecker/helpers';
import { registrationResultToReglist } from './helpers/registration-result-to-reglist.helper';
import { informOnRegistrationResult } from './helpers/inform-on-registration.helper';
import { informOnReglistRemoved } from './helpers/inform-on-reglist-remove.helper';
import { Logger } from './helpers/logger.helper';
import { sendRegistrationDetails } from './bot/helpers/send-registration-details.helper';

const logger = new Logger('RegLoop');

export async function regLoop() {
  logger.log('New Reg loop');
  if (!existsSync(resolve(reglistPath))) {
    logger.log('Regfile not specified');
    return;
  }

  logger.log('Regfile specified');
  logger.log('Check quotas');
  const dateQuotas: Array<DateQuotas> = await getDateQuotas(formularType);

  const registeredPersons: RegisteredPerson[] = [];
  const nonregisteredPersons: RegData[] = [];

  if (dateQuotas.length) {
    logger.log('Quotas available');
    logger.log('Start registration process');
    informOnQuotas(dateQuotas);
    const persons = reglistToObjects(reglistPath);

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
        const person = persons.shift() as RegData;
        person.tip_formular = FormularTypes[formularType];
        person.date = date;
        const regResult = await register(person);
        if (!regResult) {
          nonregisteredPersons.push(person);
          continue;
        }
        registeredPersons.push({ ...person, ...regResult });
      }
    }
  }

  if (registeredPersons.length || nonregisteredPersons.length) {
    await sendRegistrationDetails(registeredPersons);
    registrationResultToReglist({
      registered: registeredPersons,
      nonRegistered: nonregisteredPersons,
    });
    await informOnRegistrationResult();
    unlinkSync(reglistPath);
    await informOnReglistRemoved();
  }

  logger.log('Finish registration process');
}
