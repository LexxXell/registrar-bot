import { reglistPath } from './constants.helper';
import { keysAndValuesToObjects } from './keys-and-values-to-objects.helper';
import { xlsxFileToKeysAndValues } from './xlsx-file-to-keys-and-values.helper';

export const reglistToObjects = (regfilePath: string = reglistPath) =>
  keysAndValuesToObjects(xlsxFileToKeysAndValues(regfilePath));
