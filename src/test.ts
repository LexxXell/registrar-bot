import puppeteer, { Browser, Page } from 'puppeteer';
import { delay } from './helpers/delay.helper';
import { Logger } from './helpers/logger.helper';
import { FormularTypes, PersonRegistrationResult, RegData } from './registrar/@types';

const logger = new Logger('Registrar');

const programmereUrl = 'https://programarecetatenie.eu/programare_online';
const typeFormmularSelector = '#tip_formular';
const formularSelector =
  '#formular > div:nth-child(1) > div > div > div > div > div:nth-child(2) > span > span.selection > span';
const formularSearchSelector = 'body > span > span > span.select2-search.select2-search--dropdown > input';
const numePasaportSelector = '#nume_pasaport';
const prenumePasaportSelector = '#prenume_pasaport';
const dataNasteriiSelector = '#data_nasterii';
const loculNasteriiSelector = '#locul_nasterii';
const prenumeMamaSelector = '#prenume_mama';
const prenumeTataSelector = '#prenume_tata';
const emailSelector = '#email';
const numarPasaportSelector = '#numar_pasaport';
const gdprSelector = `#gdpr`;
const transmiteButton = '#transmite';
const ticketNumberSelector = '#validation_box > div > div > div > p:nth-child(11)';
const regDateSelector = `#validation_box > div > div > div > p:nth-child(6) > span:nth-child(2)`;
const regBlankSelector = '#error_div';

const typeDelay = 100;

process.env['HEADLESS'] = 'false';

async function register(regData: RegData): Promise<PersonRegistrationResult> {
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

    // Set calendar
    await page.click(`td.day[data-date="${Date.parse(regData.date)}"]`, { delay: typeDelay });
    await delay(1000);

    await page.click(gdprSelector, { delay: typeDelay });
    await delay(1000);

    await page.screenshot({ path: './1.png' });

    await clickTransmiteButton(page);
    await delay(1000);

    await page.waitForSelector(ticketNumberSelector, { timeout: 15000 });
    const ticket_number = await page.$eval(ticketNumberSelector, (el) => el.innerHTML);
    const date = await page.$eval(regDateSelector, (el) => el.innerHTML);

    const regBlank = await page.$(regBlankSelector);
    await regBlank.screenshot({ path: `reg_media/${regData.email}.png` });

    await delay(60000);

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

async function clickTransmiteButton(page: Page) {
  await page.waitForSelector('#transmite');
  await page.waitForFunction(() => {
    const button = document.querySelector('#transmite');
    return !(button as any).disabled;
  });
  console.log('Button is active');
  await page.click(transmiteButton);
}

if (require.main === module) {
  register({
    nume: 'Lee',
    prenume: 'Brandon',
    data_nasterii: '1965-02-01',
    locul_nasterii: 'USA',
    prenume_mama: 'Brigit',
    prenume_tata: 'Brus',
    email: 'brandon1965lee2@gmail.com',
    numar_pasaport: '123456781',
    tip_formular: FormularTypes.ART11_BUCURESTI,
    date: '2023-08-08',
  }).then((res) => console.log(res));
}
