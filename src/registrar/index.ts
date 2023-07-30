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
  numarPassportSelector,
  setCalendar,
} from './helpers';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function register(userData: RegData): Promise<PersonRegistrationResult> {
  const browser: Browser = await puppeteer.launch({ headless: /true/.test(process.env.HEADLESS) });
  const page = await browser.newPage();
  try {
    page.setViewport({ width: 720, height: 720 });

    await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

    await page.waitForSelector('#tip_formular', { timeout: 15000 });
    await page.click(articuleButtonSelector);
    await sleep(2000 + Math.random() * 100);
    await page.$(articuleSearchSelector).then((v) => v?.type(userData.tip_formular, { delay: 100 }));
    await sleep(2000 + Math.random() * 100);
    await page.keyboard.press('Enter');

    await page.$(numePassportSelector).then((v) => v?.type(userData.nume, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(prenumePassportSelector).then((v) => v?.type(userData.prenume, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(dataNasteriiSelector).then((v) => v?.type(userData.data_nasterii, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(loculNasteriiSelector).then((v) => v?.type(userData.locul_nasterii, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(prenumeMamaSelector).then((v) => v?.type(userData.prenume_mama, { delay: 200 }));
    await sleep(500 + Math.random() * 100);

    await page.$(prenumeTataSelector).then((v) => v?.type(userData.prenume_tata, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(emailSelector).then((v) => v?.type(userData.email, { delay: 200 }));
    await sleep(500 + Math.random() * 100);
    await page.$(numarPassportSelector).then((v) => v?.type(userData.numar_pasaport, { delay: 200 }));

    await sleep(2000 + Math.random() * 100);
    const date: Date = new Date(userData.date);

    await page.evaluate((_date: string) => {
      console.log(_date);
      let element = document.createElement('script');
      element.innerHTML = _date;
      document.body.appendChild(element);
    }, setCalendar(date));

    await sleep(1500 + Math.random() * 100);
    await page.click(flagSelector);
    await page.evaluate((confirmSelector) => {
      let element = document.createElement('script');
      element.innerHTML = `document.getElementById("${confirmSelector}").removeAttribute("disabled")`;
      document.body.appendChild(element);
    }, confirmButtonSelector);
    await sleep(1500 + Math.random() * 100);
    await page.click(confirmButtonSelector);

    let ticket_number: string;
    let regDate: string;
    await page.waitForSelector(ticketNumberSelector, { timeout: 15000 });
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
