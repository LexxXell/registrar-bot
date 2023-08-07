import { AxiosRequestConfig } from 'axios';
import https from 'https';
import { FormularTypes } from '../@types';

export const url_zii = 'https://programarecetatenie.eu/status_zii';
export const url_zile = 'https://programarecetatenie.eu/status_zile';
export const excludedDaysLookup: { [key in keyof typeof FormularTypes]: number[] } = {
  ART11_SUCEAVA: [0, 6],
  ART11_IASI: [0, 6],
  ART11_GALATI: [0, 6],
  ART8_81__10_27: [0, 5, 6],
  ART11_BUCURESTI: [0, 5, 6],
};
export const axiosConfig: AxiosRequestConfig = {
  responseType: 'json',
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};
export const startDateShift = 2;
export const dateUTCSuffix = 'T00:00:00.000Z';
