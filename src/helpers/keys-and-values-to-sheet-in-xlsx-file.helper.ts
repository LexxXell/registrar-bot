import * as xlsx from 'xlsx';
import { KeysAndValues } from '../@types/keys-and-values.types';

export function keysAndValuesToShetInXlsxFile(
  filePath: string,
  keysAndValues: KeysAndValues,
  sheetName: string = `Sheet_${Date.now().toString()}`,
) {
  const workBook = xlsx.readFile(filePath);
  const ws_data = [keysAndValues.keys, ...keysAndValues.values];
  const workSheet = xlsx.utils.aoa_to_sheet(ws_data);
  xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
  xlsx.writeFileXLSX(workBook, filePath);
}
