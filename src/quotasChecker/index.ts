import { FormularTypes } from './@types';
import { AziDate } from './@types/azi-date.type';
import { formatDate, getAvailableDates, getAvailableQuotas } from './helpers';

export async function getDateQuotas(formular: keyof typeof FormularTypes) {
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
  var outData: Map<string, number> = new Map<string, number>();
  for await (let date of availableDates) {
    const quotas = await getAvailableQuotas(formular, date as AziDate);
    outData.set(date, quotas);
  }
  return outData;
}
