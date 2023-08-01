import path from 'path';
import { Telegraf } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';

import { Context } from './@types';
import { Logger } from '../helpers/logger.helper';
import { startComposer } from './composers/start.composer';
import { idGuard } from './middlewares/id-guard.middleware';
import { reglistComposer } from './composers/reglist.composer';
import { sendErrorToAdmin } from '../helpers/sendErrorToAdmin.helper';

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

bot.catch((error: Error) => {
  logger.error(error);
  sendErrorToAdmin(error.message);
});

export default bot;
