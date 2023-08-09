import { FormularTypes } from '../quotasChecker/@types';
import { Logger } from './logger.helper';

const logger = new Logger('Constants');

export const dateRegex: RegExp = /^(?:20\d{2}|19\d{2})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
export const regCooldown: number = Number(process.env.REG_COOLDOWN_MS) || 3600000; // def. 1 hour
export const formularType: keyof typeof FormularTypes =
  (process.env.FORMULAR_TYPE as keyof typeof FormularTypes) || 'ART8_81__10_27';

export const propDateEnv = 'PROP_DATE_ENV';
export const propDateAwating = 'PROP_DATE_ENV_AWATING';

export const regLoopAwaiting = 'REG_LOOP_AWAITING';
if (!process.env[regLoopAwaiting]) {
  process.env[regLoopAwaiting] = 'true';
}

export const messageRecipients = [...new Set([process.env.BOT_OWNER_ID, process.env.BOT_ADMIN_ID])];

export const addPersonRegExp: RegExp = /^\/addperson\n(?<rawPerson>(?:.|\n)+)/im;
export const delPersonRegExp: RegExp = /^\/delperson\s+(?<email>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/im;

logger.info(`regCooldown: ${regCooldown}`);
logger.info(`formularType: ${formularType}`);
