import { Composer } from 'telegraf';

import { Context } from '../@types';
import { Logger } from '../../helpers/logger.helper';
import { errorToUser } from '../helpers/error-to-user.helper';
import { addPersonRegExp, delPersonRegExp } from '../../helpers/constants.helper';
import { IPerson, PersonModel } from '../../models/person.model';
import { delay } from '../../helpers/delay.helper';

const logger = new Logger('RegList Composer');

export const reglistComposer: Composer<Context> = new Composer();

reglistComposer.hears(addPersonRegExp, async (ctx: Context) => {
  const { rawPerson } = addPersonRegExp.exec(ctx.message.text).groups;
  try {
    const person = await PersonModel.create(rawPersonToObj(rawPerson?.split('\n')));
    if (person) {
      await ctx.replyWithHTML(ctx.i18n.t('person_added_success', { person }));
    } else {
      await errorToUser(ctx);
    }
  } catch (e) {
    logger.error(e);
    await ctx.reply((e as Error).message);
  }
});

reglistComposer.hears(delPersonRegExp, async (ctx: Context) => {
  const { email } = delPersonRegExp.exec(ctx.message.text).groups;
  try {
    const deletedCount = (await PersonModel.deleteMany({ email })).deletedCount;
    await ctx.replyWithHTML(ctx.i18n.t(deletedCount ? 'person_deleted_success' : 'person_not_found', { email }));
  } catch (e) {
    logger.error(e);
    await errorToUser(ctx);
  }
});

reglistComposer.hears(/\/listpersons/i, async (ctx: Context) => {
  const personsList = await PersonModel.find();
  if (!personsList.length) {
    return await ctx.replyWithHTML(ctx.i18n.t('personslist_empty'));
  }
  for (let person of personsList) {
    await ctx.replyWithHTML(
      ctx.i18n.t(person.error ? 'person_error' : person.registaretion_number ? 'person_success' : 'person', { person }),
    );
    await delay(100);
  }
});

function rawPersonToObj([
  nume,
  prenume,
  data_nasterii,
  locul_nasterii,
  prenume_mama,
  prenume_tata,
  email,
]: string[]): IPerson {
  if (email && !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(email)) {
    throw new Error('Wrong email format');
  }
  return { nume, prenume, data_nasterii, locul_nasterii, prenume_mama, prenume_tata, email };
}
