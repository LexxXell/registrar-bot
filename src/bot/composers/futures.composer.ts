import { Composer } from 'telegraf';
import { Context } from '../@types';
import { setPrioritizeRegExp } from '../helpers/constants.helper';
import { propDateAwating, propDateEnv, regLoopAwaiting } from '../../helpers/constants.helper';
import { regLoop } from '../../reg-loop';

export const futuresComposer: Composer<Context> = new Composer();

futuresComposer.hears(setPrioritizeRegExp, (ctx, next) => {
  if (!parseInt(process.env[propDateAwating] || '0')) {
    return next();
  }
  const { index } = setPrioritizeRegExp.exec(ctx.message.text).groups;
  process.env[propDateEnv] = (parseInt(index) - 1).toString();
  ctx.replyWithHTML(ctx.i18n.t('prioritize_set'));
});

futuresComposer.hears(/\/startRegistration/i, async (ctx) => {
  if (/true/.test(process.env[regLoopAwaiting])) {
    regLoop();
    await ctx.replyWithHTML(ctx.i18n.t('start_reg_loop'));
  } else {
    await ctx.replyWithHTML(ctx.i18n.t('start_reg_loop_error'));
  }
});
