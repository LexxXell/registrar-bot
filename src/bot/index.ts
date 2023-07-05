import path from 'path';
import { Telegraf } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';

import { Context } from './@types';
import { Logger } from '../helpers/logger.helper';
import { startComposer } from './composers/start.composer';
import { idGuard } from './middlewares/id-guard.middleware';
import { reglistComposer } from './composers/reglist.composer';
import { sendErrorToAdmin } from '../helpers/sendErrorToAdmin.helper';
import { sendRegistrationDetails } from './helpers/send-registration-details.helper';
import { RegisteredPerson } from '../@types/registered-person.type';

const logger = new Logger('Registrar Bot');

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN not specified');
}
const bot: Telegraf<Context> & { i18n?: TelegrafI18n } = new Telegraf(process.env.BOT_TOKEN);

bot.i18n = new TelegrafI18n({
  defaultLanguage: process.env.BOT_LANGUAGE || 'en',
  allowMissing: false,
  directory: path.resolve('locales'),
});

bot.use(bot.i18n);
bot.use(idGuard);

bot.use(startComposer);
bot.use(reglistComposer);

bot.command('test', async (ctx: Context) => {
  const person: RegisteredPerson = {
    email: 'MuntianuAleksei1987@gmail.com',
    nume: 'Aleksei',
    prenume: 'Muntianu',
    data_nasterii: '1987-12-07',
    locul_nasterii: 'Federația rusa',
    prenume_mama: 'Marina',
    prenume_tata: 'Nikolai',
    date: '2023-10-02',
    ticket_number:
      '21034z168828206564a123d1193c01.80336772y4d6e7ae87839893e3bb52daf347dd1ea076bd091582ca8f81a5dd3e0ca095953',
  };
  await sendRegistrationDetails([person]);
});

bot.catch((error: Error) => {
  logger.error(error);
  sendErrorToAdmin(error.message);
});

export default bot;
