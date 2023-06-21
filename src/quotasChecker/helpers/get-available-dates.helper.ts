import { FormularTypes } from '../@types';

import axios from 'axios';

export async function getAvailableDates(
  tip_formular: keyof typeof FormularTypes,
  currentDate: Date,
  startDate: Date,
  endDate: Date,
) {
  let excludedDays = [0, 6];
  switch (tip_formular) {
    case 'ART11_SUCEAVA':
      excludedDays = [0, 6];
      break;
    case 'ART11_IASI':
      excludedDays = [0, 6];
      break;
    case 'ART11_GALATI':
      excludedDays = [0, 6];
      break;
    case 'ART8_81__10_27':
      excludedDays = [0, 5, 6];
      break;
    case 'ART11_BUCURESTI':
      excludedDays = [0, 5, 6];
      break;
  }
  const url_zile = 'https://programarecetatenie.eu/status_zile';
  const reqBody = {
    azi:
      currentDate.getFullYear() +
      '-' +
      ((currentDate.getMonth() + 1).toString().length == 1 ? '0' : '') +
      (currentDate.getMonth() + 1),
    tip_formular: FormularTypes[tip_formular],
  };
  const response = await axios.post(url_zile, reqBody,{responseType:'json'});
  const dates = (response.data as { data: string[] }).data;
  const dateList = [];
  while (startDate <= endDate) {
    if (!excludedDays.includes(startDate.getDay())) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : `${startDate.getMonth() + 1}`;
      const day = startDate.getDate() < 10 ? `0${startDate.getDate()}` : `${startDate.getDate()}`;
      const date = `${year}-${month}-${day}`;
      if (!dates.includes(date)) {
        dateList.push(date);
      }
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  let out: string[] = [];
  dateList.forEach((element) => {
    if (new Date(element).getMonth() == currentDate.getMonth()) {
      out.push(element);
    }
  });
  return out;
}
