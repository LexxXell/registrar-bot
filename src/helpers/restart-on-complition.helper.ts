import { ILogger } from '../@types';

export const restartOnComplition = async (
  callback: Function,
  cooldownMs: number,
  checActive: (() => Promise<boolean>) | (() => boolean) = () => true,
  logger: ILogger = console,
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
