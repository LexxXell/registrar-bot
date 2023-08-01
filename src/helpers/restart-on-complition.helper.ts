import { ILogger } from '../@types';
import { Logger } from './logger.helper';

export const restartOnComplition = async (
  callback: Function,
  cooldownMs: number,
  checActive: (() => Promise<boolean>) | (() => boolean) = () => true,
  logger: ILogger = new Logger('restartOnComplition'),
  namespace?: string,
) => {
  try {
    await callback();
  } catch (e) {
    logger.error(`[ERROR] ${namespace ? namespace + ': ' : ''}`, e);
  } finally {
    if (await checActive()) {
      setTimeout(() => restartOnComplition(callback, cooldownMs, checActive, logger, namespace), cooldownMs);
    }
  }
};
