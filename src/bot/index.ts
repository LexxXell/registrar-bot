import path from 'path';
import { Telegraf } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';

import { Context } from './@types';
import { Logger } from '../helpers/logger.helper';
import { startComposer } from './composers/start.composer';
import { idGuard } from './middlewares/id-guard.middleware';
import { reglistComposer } from './composers/reglist.composer';
import { sendErrorToAdmin } from '../helpers/sendErrorToAdmin.helper';
import { propDateAwating, propDateEnv } from '../helpers/constants.helper';
import { setPrioritizeRegExp } from './helpers/constants.helper';

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

bot.hears(setPrioritizeRegExp, (ctx, next) => {
  if (!parseInt(process.env[propDateAwating] || '0')) {
    return next();
  }
  const { index } = setPrioritizeRegExp.exec(ctx.message.text).groups;
  process.env[propDateEnv] = (parseInt(index) - 1).toString();
  ctx.replyWithHTML(ctx.i18n.t('prioritize_set'));
});

bot.use(startComposer);
bot.use(reglistComposer);

bot.catch((error: Error) => {
  logger.error(error);
  sendErrorToAdmin(error.message);
});

export default bot;
