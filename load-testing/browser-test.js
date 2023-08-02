import { chromium } from 'k6/x/browser';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '25s', target: 15 },
    { duration: '35s', target: 25 },
    { duration: '60s', target: 30 },
    { duration: '25s', target: 20 },
  ],
};

const base_url = 'http://34.149.85.150:80';
// const base_url = 'http://localhost:3000';

function randomString(length, charset = '') {
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

function randomNumber(length, charset = '') {
  if (!charset) charset = '0123456789';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

async function clientTest(page){
  const email = randomString(10) + '@mail.com';
  const phone = randomNumber(9)

  page.locator('a[href="/signup"]').click();

  page.locator('input[name="name"]').type("my user name");
  page.locator('input[name="email"]').type(`${email}`);
  page.locator('input[name="password"]').type('password');
  page.locator('input[name="2password"]').type('password');

  page.locator('input[name="phone"]').type(`${phone}`);

  page.locator('input[name="birthDate"]').type('201-02-01');

  const submitButton = page.locator('button[type="button"]');

  await Promise.all([page.waitForNavigation(), submitButton.click()]);

  check(page, {
    header: page.locator('h2').textContent() == 'Specialized network',
  });

  page.waitForSelector('a[class="btn btn-outline-dark"]', {state: 'attached', timeout: 10000})
  const categories = page.$$('a[class="btn btn-outline-dark"]')
  console.log(categories.length)
  const selectCategory = Math.floor(Math.random() * (categories.length-1))
  console.log(selectCategory)

  await Promise.all([page.waitForNavigation(), categories[selectCategory].click()]);

  check(page, {
    header: page.locator('#h3-serviceType0').isVisible(),
  });

  page.waitForSelector('a[class="btn btn-outline-dark"]', {state: 'attached', timeout: 10000})
  const types = page.$$('a[class="btn btn-outline-dark"]')
  console.log(types.length)
  const selectType = Math.floor(Math.random() * types.length)
  console.log(selectType)

  await Promise.all([page.waitForNavigation(), types[selectType].click()]);

  check(page, {
    header: page.locator('div[class=step1Text]').textContent() == 'Describe Task',
  });

  page.waitForSelector('input[name="adress"]', {state: 'attached', timeout: 4000})
  page.locator('input[name="adress"]').type("Myaddress,myparish");
  page.locator('input[name="numberDoor"]').type("999");
  page.locator('input[name="postalCode"]').type("9999-999");

  sleep(1)
  page.locator('select[name="districtSelect"]').selectOption("2");
  page.locator('select[name="municipalitySelect"]').selectOption("3");

  page.locator('input[name="description"]').type("This description for my task goes into detail about exactly what the service I need is.");

  page.locator('button[name="next"]').click();
  
  page.waitForSelector('.btn', {state: 'attached', timeout: 3000})
  const providerButtons = page.$$('.btn')
  console.log(providerButtons.length)
  const selectProvider = Math.floor(Math.random() * providerButtons.length)
  console.log(selectProvider)

  providerButtons[selectProvider].click();
  
  page.waitForSelector('button[class*="highlight"]:enabled', {state: 'attached', timeout: 10000})
  const options = page.$$('button[class*="highlight"]:enabled')
  console.log(options.length)
  var selectedAvailability = null

  while(selectedAvailability == null){
    const selectDate = Math.floor(Math.random() * options.length)
    console.log(selectDate)
    options[selectDate].click()
    page.waitForSelector('button[class="single-availability free"]', {state: 'attached', timeout: 10000})
    const availabilities = page.$$('button[class="single-availability free"]')
    if(availabilities.length > 0){
      const selectAvail = Math.floor(Math.random() * availabilities.length)
      selectedAvailability = availabilities[selectAvail]
    }
  }
  
  selectedAvailability.click()

  page.locator('.formService3next').click();

  page.waitForSelector('h3', {state: 'attached', timeout: 4000})
  page.locator('#checkData').check();

  await Promise.all([page.waitForNavigation(), page.locator('.formService4confirm').click()]);
}

async function providerTest(page){
  // integer between 3 and 14
  const randomProviderId = Math.floor(Math.random() * (15 - 4) + 4);
  const email = `email${randomProviderId-1}@mail.com`

  page.locator('#Log').click();

  page.locator('input[name="email"]').type(email);
  page.locator('input[name="password"]').type('password');

  page.locator('button[type="button"]').click();

  check(page, {
    header: page.locator('h2').textContent() == 'Specialized network',
  });

  page.locator('a[href="/tasks"]').click();

  page.waitForSelector('h2', {state: 'attached', timeout: 3000})

  check(page, {
    header: page.locator('h2').textContent() == 'Tasks To do',
  });
  page.waitForLoadState('networkidle', {timeout: 3000})


  const accept = Math.random() < 0.70

  var taskOptions = null
  if(accept){
    taskOptions = page.$$('button[name="acceptTask"]')
  } else {
    taskOptions = page.$$('button[name="rejectTask"]')
  }

  console.log(taskOptions.length)
  if(taskOptions.length > 0){
    const selectedOption = Math.floor(Math.random() * taskOptions.length)
    console.log(selectedOption)
    
    await Promise.all([page.waitForNavigation(), taskOptions[selectedOption].click()]);
  }
}

export default async function () {
  const browser = chromium.launch({ headless: true });
  const page = browser.newPage();


  try {
    await page.goto(`${base_url}/`);

    Math.random() < 0.80 ? await clientTest(page) : await providerTest(page);


  } finally {
    page.close();
    browser.close();
  }
}