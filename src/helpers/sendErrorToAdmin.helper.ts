import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Logger } from './logger.helper';

const logger = new Logger('sendErrorToAdmin');

const RESULT_SUCCESS = 200;

const createUrl = (message: string, token: string, chatId: string) => {
  return `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${message}&disable_web_page_preview=true`;
};

export const sendErrorToAdmin = (
  message?: string,
  token: string = process.env.BOT_TOKEN,
  chatId: string = process.env.BOT_ADMIN_ID,
) => {
  if (!message || !token || !chatId) {
    return;
  }
  message = `‼️ ERROR: ${message}`;
  const url = createUrl(message, token, chatId);
  axios
    .get(url)
    .then((responce: AxiosResponse) => {
      if (responce.status !== RESULT_SUCCESS) {
        logger.error('Can`t send message to admin.');
      }
    })
    .catch((err) => {
      logger.error(err);
    });
};
