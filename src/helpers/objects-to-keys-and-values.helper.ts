import { KeysAndValues } from '../@types/keys-and-values.types';

export function objectsToKeysAndValues(objArr: object[]): KeysAndValues {
  const keys: string[] = Object.keys(objArr[0]);
  if (!objArr.every((obj) => Object.keys(obj).length === keys.length)) {
    throw new Error('Objects keys lingth do not match');
  }
  const values: string[][] = objArr.map((obj) => Object.values(obj));
  return { keys, values };
}
