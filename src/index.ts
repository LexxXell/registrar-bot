import './helpers/init-env.helper';
import bot from './bot';
import { Logger } from './helpers/logger.helper';
import { restartOnComplition } from './helpers/restart-on-complition.helper';
import { regLoop } from './reg-loop';

const logger = new Logger('Main');

restartOnComplition(regLoop, parseInt(process.env.REG_COOLDOWN_MS) || 3600000, () => true, logger, 'RegLoop');

bot.launch().then(() => {
  logger.log('Bot is running');
});
