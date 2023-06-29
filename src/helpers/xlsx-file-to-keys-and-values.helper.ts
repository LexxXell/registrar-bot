import * as xlsx from 'xlsx';
import { checkArrayLengths } from './check-array-lengths.helper';
import { KeysAndValues } from '../@types/keys-and-values.types';

export function xlsxFileToKeysAndValues(filePath: string, strictLength: boolean = true): KeysAndValues {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const keys: string[] = rows[0] as string[];

  if (keys.length !==  [...new Set(keys)].length) {
    throw new Error('There are non-unique keys in the table header.');
  }

  const values: string[][] = rows.slice(1).filter((el) => {
    try {
      return (el as []).length;
    } catch {
      return false;
    }
  }) as string[][];

  if (strictLength && !checkArrayLengths(values, keys.length)) {
    throw new Error('The table may not be complete.');
  }

  return { keys, values };
}
