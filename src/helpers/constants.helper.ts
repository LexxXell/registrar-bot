import { FormularTypes } from '../quotasChecker/@types';
import { Logger } from './logger.helper';

const logger = new Logger('Constants');

export const reglistPath: string = 'storage/reglist.xlsx';
export const regCooldown: number = Number(process.env.REG_COOLDOWN_MS) || 3600000; // def. 1 hour
export const formularType: keyof typeof FormularTypes =
  (process.env.FORMULAR_TYPE as keyof typeof FormularTypes) || 'ART8_81__10_27';

logger.info(`reglistPath: ${reglistPath}`);
logger.info(`regCooldown: ${regCooldown}`);
logger.info(`formularType: ${formularType}`);
