const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until
/* const companies = require('./input.json') */
const driver = new webdriver.Builder()
.forBrowser('chrome')
.build();
// Show window in full screen
driver.manage().window().maximize()
driver.get('https://www.eywaonline.com/development')
//Start the scenario code like this:
driver.sleep(300).then(() => {
// Write EYWA login code here
})
.then(() => {
// Write code that opens module "Kontakti" here
})
.then(() => {
// Write next step code here etc.
})
