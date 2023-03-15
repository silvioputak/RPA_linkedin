const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until
const key = webdriver.Key
const companies = require('./input.json')

const driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().window().maximize()

const logs = []
const elements = {
    login: {
        username_path: 'session_key',
        password_path: 'session_password',
        submit_path:   '[data-id="sign-in-form__submit-btn"]'
    }
}

const writeLog = (message) => {
    logs.push(message)
    console.log(message)
}

function createJsonFile(name,value){
    const fs = require('fs');
    const jsonContent = JSON.stringify(value);

    fs.writeFile(name, jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    }); 
}



async function login() {
    // element paths 
    const {username_path, password_path, submit_path} = elements.login
    //credentials
    const {username, password} = companies

    try{
        writeLog("Trying to login in Linkedin")
        await driver.get(companies.url)
        writeLog("Getting url..")
        const usernameInput = await driver.wait(until.elementLocated(By.id(username_path)), 5000)
        await usernameInput.sendKeys(username)

        const passwordInput = await driver.wait(until.elementLocated(By.id(password_path)), 5000)
        await passwordInput.sendKeys(password)

        const submitButton = await driver.wait(until.elementLocated(By.css(submit_path)), 5000)
        await submitButton.click()

        writeLog("Login successful")
    }catch(err){
        writeLog("Login failed" + err.message)
    }
}

async function profile(){
    try{
        writeLog("Trying to edit profile")
        await driver.wait(until.elementLocated(By.xpath('//*[@id="global-nav"]/div/nav/ul/li[6]')), 5000).click();
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[text()='View Profile']")), 5000).click();
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//li-icon[@aria-label='Add new experience']")), 5000).click();
        // await driver.sleep(5000)
        await driver.findElement(By.xpath("//a[@data-field='experience_add_position']")).click()
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[@placeholder='Ex: Retail Sales Manager']")), 5000).sendKeys("Junior software engineer")
        // await driver.sleep(5000)
        await driver.findElement(By.xpath("//*[@placeholder='Ex: Microsoft']")).sendKeys("Neyho Informatika d.o.o")
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//select[@name='month']"))).sendKeys("May")
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//select[@name='year']")), 5000).sendKeys("2022")
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[@placeholder='Ex: Retail']")), 5000).clear()
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[@placeholder='Ex: Retail']")), 5000).sendKeys("Internet")
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath("//*[@placeholder='Ex: Retail']")), 5000).sendKeys(key.DOWN)
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[@placeholder='Ex: Retail']")), 5000).sendKeys(key.ENTER)
        // await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//*[text()='Save']")), 5000).click()
        // await driver.sleep(5000)
        //Skip button
        const skip = await driver.wait(until.elementLocated(By.xpath("//*[text()='Skip']")), 5000)
        skip ? await skip.click() : null
        await driver.sleep(5000)
        writeLog("Profile edited successfully")
    }catch(err){
        writeLog("Profile failed" + err.message)
    }
}

async function jobs(){
    try{
        writeLog("Trying to edit jobs")
        

        await driver.wait(until.elementLocated(By.xpath('//*[@id="global-nav"]/div/nav/ul/li[3]')), 5000).click();
        await driver.sleep(5000)
        /* await driver.wait(until.elementLocated(By.xpath('//*[starts-with(@id="jobs-search-box-keyword-id")]')), 5000).sendKeys("Junior software developer") */
        await driver.wait(until.elementLocated(By.xpath("//input[@aria-label='Search by title, skill, or company']")), 5000).sendKeys("Junior software intern");
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//input[@aria-label='City, state, or zip code']")), 5000).sendKeys("Croatia",key.RETURN);
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath("//span[text()='Set alert']")), 5000).click();
        await driver.sleep(5000)
        const jobsElement = await driver.wait(until.elementLocated(By.className("scaffold-layout__list-container")), 5000).getText();
        if(jobsElement){
            const jobs = [];
            const jobList = jobsElement.split('\n');
        
            for(let i = 0; i < jobList.length; i += 3) {
                const job = {
                    job: jobList[i],
                    company: jobList[i+1],
                    location: jobList[i+2]
                };
            
                jobs.push(job);
            }
            createJsonFile("./jobs.json", jobs);
        }
        else{
            writeLog("Failed to create json file with lists of jobs.")
        }
        
    }catch (err){
        writeLog("Failed to get jobs" + err.message)
    }
    
}

async function messages() {
    try {
        writeLog("Compose and send message")
        await driver.wait(until.elementLocated(By.xpath('//*[@id="global-nav"]/div/nav/ul/li[4]')), 5000).click();
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath('//*[@aria-label="Compose a new message"]')), 5000).click();
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath('//*[@placeholder="Type a name or multiple names"]')), 5000).sendKeys("Ivan Geng");
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath('//*[@placeholder="Type a name or multiple names"]')), 5000).sendKeys(key.ENTER);
        await driver.sleep(5000)
        await driver.wait(until.elementLocated(By.xpath('//*[@aria-label="Write a message…"]')), 5000).sendKeys("“Hi,My name is Robert Robotić and this is test message.”1");
        await driver.sleep(5000)
        /* await driver.wait(until.elementLocated(By.xpath('//button[text()="Send"]')), 2000).click(); */
        await driver.sleep(5000)
        writeLog("Message sent successfully")
    } catch (err) {
        writeLog("Messaging failed" + err.message)
    }
}

async function main(){
    try {
        debugger;
        await login()
        await profile()
        await jobs()
        await messages()
    } catch (error) {
        writeLog("Error: " + error.message)
    }finally{
        createJsonFile("./log.json", {logs : logs})
        await driver.quit()
    }
}


// Start the script
main()


    

