import { Composer } from 'telegraf';
import { Context } from '../@types';
import { PersonModel } from '../../models/person.model';

export const startComposer: Composer<Context> = new Composer();

startComposer.hears(/^\/start$|^\/help$|^\/help[_\s]{1}(?<command>[^\s]+)$/, async (ctx: Context) => {
  if (/^\/help[_\s]{1}(?<command>[^\s]+)$/.test(ctx.message.text)) {
    try {
      const { command } = /^\/help[_\s]{1}(?<command>[^\s]+)$/.exec(ctx.message.text).groups;
      return await ctx.replyWithHTML(ctx.i18n.t(`help_${command.replace('/', '').toLowerCase()}`));
    } catch {
      return await ctx.replyWithHTML(ctx.i18n.t('help_not_exist'));
    }
  }
  if (/^\/start$/.test(ctx.message.text)) {
    await ctx.replyWithHTML(ctx.i18n.t('start'));
  }
  await ctx.replyWithHTML(ctx.i18n.t('help'));
  if (String(ctx.from.id) === process.env.BOT_OWNER_ID) {
    await ctx.replyWithHTML(ctx.i18n.t('help_owner', { admin: process.env.BOT_ADMIN_USERNAME || 'unspecified' }));
  }
  if (String(ctx.from.id) === process.env.BOT_ADMIN_ID) {
    await ctx.replyWithHTML(ctx.i18n.t('help_admin', { admin: process.env.BOT_ADMIN_USERNAME || 'unspecified' }));
  }

  const personsCount = await PersonModel.find({ registration_number: { $eq: null }, error: { $eq: false } }).count();

  await ctx.replyWithHTML(
    ctx.i18n.t(personsCount ? 'personslist_count' : 'personslist_empty', { count: personsCount }),
  );
});
