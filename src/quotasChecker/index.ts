import { FormularTypes } from './@types';
import { DateQuotas } from './@types/date-quotas.type';
import { ZiiDate } from './@types/zii-date.type';
import { formatDate, getAvailableDates, getAvailableQuotas } from './helpers';

export async function getDateQuotas(formular: keyof typeof FormularTypes): Promise<Array<DateQuotas>> {
  let availableDates: string[] = [];
  const currentDate = new Date();
  const firstMonth = await getAvailableDates(
    formular,
    new Date(currentDate),
    new Date(new Date(currentDate).setDate(currentDate.getDate() + 7)),
    new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1)),
  );
  currentDate.setMonth(currentDate.getMonth() + 1);
  const secondMonth = await getAvailableDates(
    formular,
    new Date(currentDate),
    new Date(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-01'),
    new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 2)),
  );
  currentDate.setMonth(currentDate.getMonth() + 1);
  const thirdMonth = await getAvailableDates(
    formular,
    new Date(currentDate),
    new Date(formatDate(currentDate)),
    new Date(new Date(currentDate).setMonth(currentDate.getMonth())),
  );
  currentDate.setMonth(currentDate.getMonth() + 1);
  const fourMonth = await getAvailableDates(
    formular,
    new Date(currentDate),
    new Date(formatDate(currentDate)),
    new Date(new Date(currentDate).setMonth(currentDate.getMonth())),
  );
  availableDates = availableDates.concat(firstMonth).concat(secondMonth).concat(thirdMonth).concat(fourMonth);
  var outData: Array<{ date: ZiiDate; quotas: number }> = [];
  for await (let date of availableDates) {
    const quotas = await getAvailableQuotas(formular, date as ZiiDate);
    outData.push({ date: date as ZiiDate, quotas });
  }
  return outData;
}
