const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until
const key = webdriver.Key
const json = require('./input.json')

const driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().window().maximize()

const logs = []
/* const elements = {
    login: {
        username_path: 'session_key',
        password_path: 'session_password',
        submit_path:   '[data-id="sign-in-form__submit-btn"]'
    },
    profile: {
        profile_path: '//*[@id="global-nav"]/div/nav/ul/li[6]',
        view_profile_path: '//*[text()="View Profile"]',
        add_experience_path: '//li-icon[@aria-label="Add new experience"]',
        add_position_path: '//a[@data-field="experience_add_position"]',
        position_path: '//*[@placeholder="Ex: Retail Sales Manager"]',
        company_path: '//*[@placeholder="Ex: Microsoft"]',
        month_path: '//select[@name="month"]',
        year_path: '//select[@name="year"]',
        industry_path: '//*[@placeholder="Ex: Retail"]',
        save_path: '//*[text()="Save"]',
    },
    jobs: {
        jobs_path: '//*[@id="global-nav"]/div/nav/ul/li[3]',
        input_jobs_path: "//input[@aria-label='Search by title, skill, or company']",
        input_location_path: "//input[@aria-label='City, state, or zip code']",
        list_jobs_path : "scaffold-layout__list-container",
        alert_path: "//span[text()='Set alert']"

    },
    messages: {
        messages_path: '//*[@id="global-nav"]/div/nav/ul/li[4]',
        compose_path: '//*[@aria-label="Compose a new message"]',
        contanct_path: '//*[@placeholder="Type a name or multiple names"]',
        text_path: '//*[@aria-label="Write a message…"]',
        send_path: '//button[text()="Send"]'
    }

} */

const writeLog = (message) => {
    logs.push(message)
    console.log(message)
}

function createJsonFile(name,value){
    const fs = require('fs'); 
    const dir = './logs';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

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
    const {username_path, password_path, submit_path} = json.paths.login
    //credentials
    const {url,username, password} = json.credentials

    try{
        writeLog("Login in Linkedin profile")
        await driver.get(url)
        const usernameInput = await driver.wait(until.elementLocated(By.id(username_path)), 5000)
        await usernameInput.sendKeys(username)

        const passwordInput = await driver.wait(until.elementLocated(By.id(password_path)), 5000)
        await passwordInput.sendKeys(password)

        const submitButton = await driver.wait(until.elementLocated(By.css(submit_path)), 5000)
        await submitButton.click()

        writeLog("Login successful")
    }catch(err){
        writeLog("Login in Linkedin failed" + err.message)
    }
}

async function profile(){
    // element paths 
    const {
        profile_path,
        view_profile_path,
        add_experience_path,
        add_position_path,
        position_path,
        company_path,
        month_path,
        year_path,
        industry_path,
        save_path
    } = json.paths.profile

    try{
        writeLog("Edit profile page")
        await driver.wait(until.elementLocated(By.xpath(profile_path)), 5000).click();
        await driver.wait(until.elementLocated(By.xpath(view_profile_path)), 5000).click();
        await driver.wait(until.elementLocated(By.xpath(add_experience_path)), 5000).click();
        await driver.wait(until.elementLocated(By.xpath(add_position_path)), 5000).click();
        /* await driver.findElement(By.xpath(add_position_path)).click() */
        await driver.wait(until.elementLocated(By.xpath(position_path)), 5000).sendKeys("Junior software engineer")
        await driver.findElement(By.xpath(company_path)).sendKeys("Neyho Informatika d.o.o")
        await driver.wait(until.elementLocated(By.xpath(month_path))).sendKeys("May")
        await driver.wait(until.elementLocated(By.xpath(year_path)), 5000).sendKeys("2022")
        await driver.wait(until.elementLocated(By.xpath(industry_path)), 5000).clear()
        await driver.wait(until.elementLocated(By.xpath(industry_path)), 5000).sendKeys("Internet")
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(industry_path)), 5000).sendKeys(key.DOWN)
        await driver.wait(until.elementLocated(By.xpath(industry_path)), 5000).sendKeys(key.ENTER)
        await driver.wait(until.elementLocated(By.xpath(save_path)), 5000).click()
        //Skip button after creating profile
        try{
            const skip = await driver.wait(until.elementLocated(By.xpath("//*[text()='Skip']")), 5000)
            skip ? await skip.click() : null
        }catch(err){
            writeLog("Skip button not found")
        }
        
        writeLog("Profile edited successfully")
    }catch(err){
        writeLog("Profile edit failed - " + err.message)
    }
}

async function jobs(){
    const {
        jobs_path,
        input_jobs_path,
        input_location_path,
        list_jobs_path,
        alert_path
    } = json.paths.jobs
    try{
        writeLog("Edit jobs page");
        await driver.wait(until.elementLocated(By.xpath(jobs_path)), 5000).click();
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(input_jobs_path)), 5000).sendKeys("Junior software intern");
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(input_location_path)), 5000).sendKeys("Croatia",key.RETURN);
        await driver.sleep(5000)
        const jobsElement = await driver.wait(until.elementLocated(By.className(list_jobs_path)), 5000).getText();
        debugger;
        if(jobsElement){
            const jobs = [];
            const jobList = jobsElement.split('\n');
            
            for(let i = 0; i < jobList.length; i += 5) {
                const job = {
                    job: jobList[i],
                    company: jobList[i+1],
                    location: jobList[i+2]
                };
            
                jobs.push(job);
            }
            createJsonFile("./logs/jobs.json", jobs);
        }
        else{
            writeLog("Failed to create json file with lists of jobs.")
        }
        try{
            await driver.wait(until.elementLocated(By.xpath(alert_path)), 5000).click()
        }catch(err){
            writeLog("Alert button is already activated")
        }
        
    }catch (err){
        writeLog("Failed to get jobs - " + err.message)
    }
    
}

async function messages() {
    const {
        messages_path,
        compose_path,
        contanct_path,
        text_path,
        send_path
    } = json.paths.messages
    try {
        writeLog("Compose and send message")
        await driver.wait(until.elementLocated(By.xpath(messages_path)), 5000).click();
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(compose_path)), 5000).click();
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(contanct_path)), 5000).sendKeys("Ivan Geng");
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(contanct_path)), 5000).sendKeys(key.ENTER);
        await driver.sleep(2000)
        await driver.wait(until.elementLocated(By.xpath(text_path)), 5000).sendKeys("“Hi,My name is Robert Robotić and this is test message.”1");
        await driver.sleep(2000)
        try{
            await driver.wait(until.elementLocated(By.xpath(send_path)), 2000).click();
        }catch(err){
            writeLog("Send button not found..")
        }
        writeLog("Message sent successfully")
    } catch (err) {
        writeLog("Messaging failed - " + err.message)
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
        createJsonFile("./logs/log.json", {logs : logs})
        await driver.quit()
    }
}


// Start the script
main()


    

