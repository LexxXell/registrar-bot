import './helpers/init-env.helper';
import bot from './bot';
import { Logger } from './helpers/logger.helper';

const logger = new Logger('Main');

bot.launch().then(() => logger.log('Bot is running'));
