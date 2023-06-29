export const siteUrl = 'https://programarecetatenie.eu';
export const months = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
];
export const articuleButtonSelector =
  '#formular > div:nth-child(1) > div > div > div > div > div:nth-child(2) > span > span.selection > span';
export const articuleSearchSelector = 'body > span > span > span.select2-search.select2-search--dropdown > input';
export const numePassportSelector = '#nume_pasaport';
export const prenumePassportSelector = '#prenume_pasaport';
export const dataNasteriiSelector = '#data_nasterii';
export const loculNasteriiSelector = '#locul_nasterii';
export const prenumeMamaSelector = '#prenume_mama';
export const prenumeTataSelector = '#prenume_tata';
export const emailSelector = '#email';
export const monthDatePickerSelector =
  '#data_programarii > div > div.datepicker-days > table > thead > tr:nth-child(2) > th.datepicker-switch';
export const nextButtonDatePickerSelector =
  '#data_programarii > div > div.datepicker-days > table > thead > tr:nth-child(2) > th.next';
export const calendarColumnSelector = '#data_programarii > div > div.datepicker-days > table > tbody > tr';
export const calendarRowSelector =
  '#data_programarii > div > div.datepicker-days > table > tbody > tr:nth-child(1) > td';
export const flagSelector = '#gdpr';
export const confirmButtonSelector = '#formular > div.row.mt-3 > div > button';
export const ticketNumberSelector = '#validation_box > div > div > div > p:nth-child(11)';
export const regDateSelector = `#validation_box > div > div > div > p:nth-child(6) > span:nth-child(2)`;
export const getSelectDateSelector = (currentWeek: string | number, currentDay: string | number) =>
  `#data_programarii > div > div.datepicker-days > table > tbody > tr:nth-child(${currentWeek}) > td:nth-child(${currentDay})`;
