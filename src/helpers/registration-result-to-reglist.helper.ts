import { RegistrationResult } from '../@types/registration-result.type';
import { reglistPath } from './constants.helper';
import { keysAndValuesToShetInXlsxFile } from './keys-and-values-to-sheet-in-xlsx-file.helper';
import { objectsToKeysAndValues } from './objects-to-keys-and-values.helper';

export function registrationResultToReglist(regResult: RegistrationResult, reglistFilePath: string = reglistPath) {
  keysAndValuesToShetInXlsxFile(reglistFilePath, objectsToKeysAndValues(regResult.registered), 'Registered');
  keysAndValuesToShetInXlsxFile(reglistFilePath, objectsToKeysAndValues(regResult.nonRegistered), 'NonRegistered');
}
