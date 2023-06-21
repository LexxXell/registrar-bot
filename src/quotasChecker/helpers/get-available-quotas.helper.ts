import { FormularTypes } from '../@types';
import { AziDate } from '../@types/azi-date.type';
import { url_zii } from './constants.helper';

/**
 * @param tip_formular
 * @param date ex. '2010-05'
 * @returns
 */
export async function getAvailableQuotas(tip_formular: keyof typeof FormularTypes, date: AziDate) {
  const formDataZii = new FormData();
  formDataZii.append('tip_formular', FormularTypes[tip_formular]);
  formDataZii.append('azi', date);
  const response = await fetch(url_zii, { method: 'POST', body: formDataZii });
  const quotas = await response.json();
  const out = (await quotas) as { numar_ramase: number };
  return out.numar_ramase;
}
