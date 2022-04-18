const fs = require('fs/promises') //allows for usage of asynch promises over callback functions
const puppeteer = require('puppeteer')
const cron = require('node-cron')
async function start() {
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto("https://learnwebcode.github.io/practice-requests/")
await page.screenshot({path: "amazing.png", fullPage: true})
//access document in browser
const names = await page.evaluate(()=>{
    return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
})
await fs.writeFile("names.txt", names.join("\r\n"))
// select multiple elements and puts them into an array - then puts that array into a callback function
await page.click("#clickme")
// $eval is used to find the first occurence, not like $$eval which runs querySelectorAll
const clickedData = await page.$eval("#data", el => el.textContent)
console.log(clickedData)
const photos = await page.$$eval("img", (imgs) => {
    return imgs.map(x=> x.src)
})
//form navigation
//automating a button press
await page.type("#ourfield", "blue")
await Promise.all([page.click("#ourform button"),page.waitForNavigation() ])
// await page.click("#ourform button")
// wait for page change --> put into Promise.all because sometimes it doesnt work without it
// await page.waitForNavigation()
const info = await page.$eval("#message", el => el.textContent)
console.log(info)

for(const photo of photos){
    const imagepage = await page.goto(photo)
    await fs.writeFile(photo.split("/").pop(),await imagepage.buffer())
}
await browser.close()
}

// setInterval(start, 5000 ) // continue to run forever for every interval fo 5000 ms

cron.schedule("*/5*****", start) // scheduling for specific times //requires node js to run forever

//cron tab //cron job