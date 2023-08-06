import puppeteer, { Browser, Page } from 'puppeteer';
import { Logger } from '../helpers/logger.helper';
import { FormularTypes, PersonRegistrationResult, RegData } from './@types';
import {
  dataNasteriiSelector,
  emailSelector,
  formularSearchSelector,
  formularSelector,
  gdprSelector,
  loculNasteriiSelector,
  numarPasaportSelector,
  numePasaportSelector,
  prenumeMamaSelector,
  prenumePasaportSelector,
  prenumeTataSelector,
  programmereUrl,
  regBlankSelector,
  regDateSelector,
  ticketNumberSelector,
  transmiteButton,
  typeFormmularSelector,
} from './helpers';
import { delay } from '../helpers/delay.helper';

const logger = new Logger('Registrar');

const typeDelay = 100;

export async function register(regData: RegData): Promise<PersonRegistrationResult> {
  const browser: Browser = await puppeteer.launch({ headless: /true/.test(process.env.HEADLESS) ? 'new' : false });
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 1920 });

    await page.goto(programmereUrl, { waitUntil: 'networkidle2' });
    await delay(1000);

    await setFormularType(page, regData.tip_formular);
    await delay(1000);

    await page.type(numePasaportSelector, regData.nume, { delay: typeDelay });
    await delay(1000);
    await page.type(prenumePasaportSelector, regData.prenume, { delay: typeDelay });
    await delay(1000);
    await page.type(dataNasteriiSelector, regData.data_nasterii, { delay: typeDelay });
    await delay(1000);
    await page.click(loculNasteriiSelector, { delay: typeDelay });
    await page.type(loculNasteriiSelector, regData.locul_nasterii, { delay: typeDelay });
    await delay(1000);
    await page.type(prenumeMamaSelector, regData.prenume_mama, { delay: typeDelay });
    await delay(1000);
    await page.type(prenumeTataSelector, regData.prenume_tata, { delay: typeDelay });
    await delay(1000);
    await page.type(emailSelector, regData.email, { delay: typeDelay });
    await delay(1000);
    await page.type(numarPasaportSelector, regData.numar_pasaport, { delay: typeDelay });
    await delay(1000);

    // TODO: Set calendar добавить пролистывание месяцов
    // await page.click(`td.day[data-date="${Date.parse(regData.date)}"]`, { delay: typeDelay });
    await setDatepicker(page, new Date(regData.date));
    await delay(1000);

    await page.click(gdprSelector, { delay: typeDelay });
    await delay(1000);

    await clickTransmiteButton(page);
    await delay(1000);

    await page.waitForSelector(ticketNumberSelector, { timeout: 15000 });
    const ticket_number = await page.$eval(ticketNumberSelector, (el) => el.innerHTML);
    const date = await page.$eval(regDateSelector, (el) => el.innerHTML);

    const regBlank = await page.$(regBlankSelector);
    await regBlank.screenshot({ path: `reg_media/${regData.email}.png` });

    await browser.close();

    return {
      ticket_number,
      date,
    };
  } catch (e) {
    logger.error(e);
    await browser.close();
  }
}

async function setFormularType(page: Page, type: FormularTypes) {
  await page.waitForSelector(typeFormmularSelector, { timeout: 15000 });
  await page.click(formularSelector);
  await page.type(formularSearchSelector, type, { delay: typeDelay });
  await page.keyboard.press('Enter');
}

async function setDatepicker(page: Page, date: Date) {
  await page.evaluate((dateString) => {
    ($('#data_programarii > div > div.datepicker-days') as any).datepicker('setDate', dateString);
  }, date.toLocaleDateString('en-US'));
}

async function clickTransmiteButton(page: Page) {
  await page.waitForSelector('#transmite');
  await page.waitForFunction(() => {
    const button = document.querySelector('#transmite');
    return !(button as any).disabled;
  });
  await page.click(transmiteButton);
}
