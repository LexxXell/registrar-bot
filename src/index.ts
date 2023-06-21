import './helpers/init-env.helper';
import bot from './bot';
import { Logger } from './helpers/logger.helper';
import { getDateQuotas } from './quotasChecker';

const logger = new Logger('Main');

console.log(getDateQuotas('ART11_BUCURESTI'));

// bot.launch().then(() => logger.log('Bot is running'));
