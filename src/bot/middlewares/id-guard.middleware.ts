import { Middleware } from 'telegraf';
import { Context } from '../@types';
import { Logger } from '../../helpers/logger.helper';

const logger = new Logger('Registrar Bot - idGuard');

export const whiteList = process.env.BOT_WHITELIST ? process.env.BOT_WHITELIST.split(/\s|,\s?/) : [];

logger.log('WhiteList:', whiteList);

export async function idGuard(ctx: Context, next: Function): Promise<Middleware<Context>> {
  try {
    const user_id = ctx.from.id;
    if (
      (user_id && whiteList.includes(user_id.toString())) ||
      user_id === Number(process.env.BOT_OWNER_ID) ||
      user_id === Number(process.env.BOT_ADMIN_ID)
    ) {
      return next(ctx);
    }
    await ctx.replyWithHTML(ctx.i18n.t('forbidden', { id: ctx.from.id }));
  } catch {}
}
