export * from './@types';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { PersonRegistrationResult, RegData } from './@types';
import {
  siteUrl,
  months,
  articuleSearchSelector,
  numePassportSelector,
  prenumePassportSelector,
  dataNasteriiSelector,
  loculNasteriiSelector,
  prenumeMamaSelector,
  prenumeTataSelector,
  emailSelector,
  monthDatePickerSelector,
  nextButtonDatePickerSelector,
  calendarColumnSelector,
  calendarRowSelector,
  articuleButtonSelector,
  flagSelector,
  confirmButtonSelector,
  ticketNumberSelector,
  regDateSelector,
  getSelectDateSelector,
} from './helpers';

export async function register(userData: RegData): Promise<PersonRegistrationResult> {
  const browser: Browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    page.setViewport({ width: 720, height: 720 });

    await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });

    await page.waitForSelector('#tip_formular', { timeout: 10000 });
    await page.click(articuleButtonSelector);
    await page.$(articuleSearchSelector).then((v) => v?.type(userData.tip_formular));
    await page.keyboard.press('Enter');
    await page.$(numePassportSelector).then((v) => v?.type(userData.nume));
    await page.$(prenumePassportSelector).then((v) => v?.type(userData.prenume));
    await page.$(dataNasteriiSelector).then((v) => v?.type(userData.data_nasterii));
    await page.$(loculNasteriiSelector).then((v) => v?.type(userData.locul_nasterii));
    await page.$(prenumeMamaSelector).then((v) => v?.type(userData.prenume_mama));
    await page.$(prenumeTataSelector).then((v) => v?.type(userData.prenume_tata));
    await page.$(emailSelector).then((v) => v?.type(userData.email));

    const date = new Date(userData.date);
    const m = await page.$eval(monthDatePickerSelector, (element) => {
      return element.innerHTML;
    });
    let firstWord = m.replace(/ .*/, '');
    let currentMonth = months.findIndex((el) => el === firstWord);
    while (currentMonth !== date.getMonth()) {
      await page.click(nextButtonDatePickerSelector);
      let month = await page.$eval(monthDatePickerSelector, (element) => {
        return element.innerHTML;
      });
      firstWord = month.replace(/ .*/, '');
      currentMonth = months.findIndex((el) => el === firstWord);
    }

    let calendarColumnItemCount = await page.$$eval(calendarColumnSelector, (el) => el.length);
    let calendarRowItemCount = await page.$$eval(calendarRowSelector, (el) => el.length);

    //Нужно чтобы случайно не нажать на дату предыдущего месяца
    let currentWeek = date.getDate() > 7 ? 2 : 1;
    while (currentWeek < calendarColumnItemCount + 1) {
      let currentDay = 1;
      while (currentDay < calendarRowItemCount + 1) {
        let text = await page.$eval(getSelectDateSelector(currentWeek, currentDay), (el) => el.innerHTML);
        if (text == String(date.getDate())) {
          await page.click(getSelectDateSelector(currentWeek, currentDay));
          currentDay = calendarRowItemCount;
          currentWeek = calendarColumnItemCount;
        }
        currentDay++;
      }
      currentWeek++;
    }

    await page.click(flagSelector);
    await page.click(confirmButtonSelector);

    let ticket_number: string;
    let regDate: string;
    await page.waitForSelector(ticketNumberSelector, { timeout: 5000 });
    ticket_number = await page.$eval(ticketNumberSelector, (el) => el.innerHTML);
    regDate = await page.$eval(regDateSelector, (el) => el.innerHTML);

    await browser.close();

    return {
      ticket_number,
      date: regDate,
      email: userData.email,
    };
  } catch (error) {
    await browser.close();
    return;
  }
}
