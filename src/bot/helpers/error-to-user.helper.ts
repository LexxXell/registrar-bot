import { Context } from '../@types/context.type';

export const errorToUser = async (ctx: Context) => {
  await ctx.replyWithHTML(ctx.i18n.t('error', { admin: process.env.BOT_ADMIN_USERNAME || 'unspecified' }));
};
