import TelegrafI18n from 'telegraf-i18n';
import { TelegrafContext } from 'telegraf/typings/context';

export type Context = TelegrafContext & { i18n: TelegrafI18n };
