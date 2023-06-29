import { KeysAndValues } from '../@types/keys-and-values.types';

export function keysAndValuesToObjects(keysAndValues: KeysAndValues): object[] {
  let result: object[] = [];
  const { keys, values } = keysAndValues;
  for (let rawObject of values) {
    const resultObject = {} as { [key: string]: string };
    for (let index in keys) {
      resultObject[keys[index]] = rawObject[index];
    }
    result.push(resultObject);
  }
  return result;
}
