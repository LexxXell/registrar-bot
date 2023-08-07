import { FormularTypes } from './@types';
import { DateQuotas } from './@types/date-quotas.type';
import { ZiiDate } from './@types/zii-date.type';
import { getAvailableQuotas } from './helpers';
import { getDates } from './helpers/get-dates.helper';

export async function getDateQuotas(
  formular: keyof typeof FormularTypes = 'ART11_BUCURESTI',
): Promise<Array<DateQuotas>> {
  const date = new Date();

  let availableDates: string[] = [];

  for (let i = 0; i < 4; i++) {
    availableDates.push(...(await getDates(date)));
    date.setMonth(date.getMonth() + 1);
  }

  const availableDateQuotas: Array<{ date: ZiiDate; quotas: number }> = [];
  for (let _date of Array.from(new Set(availableDates)) as ZiiDate[]) {
    const quotas = await getAvailableQuotas(formular, _date);
    availableDateQuotas.push({ date: _date, quotas });
  }
  return availableDateQuotas;
}
