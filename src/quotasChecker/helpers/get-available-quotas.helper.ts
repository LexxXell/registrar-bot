import { Logger } from '../../helpers/logger.helper';
import { FormularTypes } from '../@types';
import { ZiiDate } from '../@types/zii-date.type';
import { url_zii } from './constants.helper';
import axios from 'axios';

const logger = new Logger('getAvailableQuotas');

/**
 * @param tip_formular FormularTypes
 * @param date ex. '2010-05-20'
 * @returns number
 */
export async function getAvailableQuotas(tip_formular: keyof typeof FormularTypes, date: ZiiDate): Promise<number> {
  try {
    const reqBody = {
      tip_formular: FormularTypes[tip_formular],
      azi: date,
    };
    const response = await axios.post(url_zii, reqBody, { responseType: 'json' });
    return response.data?.numar_ramase || 0;
  } catch (e) {
    logger.error(e);
    return 0;
  }
}
