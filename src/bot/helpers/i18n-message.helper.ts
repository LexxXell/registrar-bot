import bot from '..';

export function i18nMessage(resourceKey: string, templateData?: object): string {
  return bot.i18n.t(process.env.BOT_LANGUAGE ?? 'en', resourceKey, templateData);
}
