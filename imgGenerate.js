const puppeteer = require("puppeteer");

(async () => {
    // Launch Puppeteer in non-headless mode to see live interaction
    const browser = await puppeteer.launch({
        headless: false, // Ensures the browser UI is visible
        defaultViewport: null, // Full-screen browser window
        args: ["--start-maximized"], // Opens the browser in maximized mode
    });

    const page = await browser.newPage();

    try {
        // Navigate to the target website
        const url = "https://www.getmerlin.in/chat/tools/image-generator";
        console.log(`Navigating to ${url}`);
        await page.goto(url);

        // Wait for the input field and interact
        const inputSelector = "textarea"; // Adjust selector if necessary
        await page.waitForSelector(inputSelector);
        console.log("Typing a message...");
        await page.type(inputSelector, "Generate an image of a futuristic home ");

        // Wait for the send button and click it
        console.log('clicking btn')
        const sendButtonSelector = "button[type='submit']"; // Adjust selector if necessary
        await page.waitForSelector(sendButtonSelector);
        console.log('clicked')
        await page.click(sendButtonSelector);
        await page.waitForSelector(sendButtonSelector);
        console.log("Sending the message...");
        await page.click(sendButtonSelector);

        // Wait for the response
        const responseSelector = "div.my-6 img"; // Adjust selector if necessary
        console.log("Waiting for the response...");
        await page.waitForSelector(responseSelector);

        // Scrape the response
        const response = await page.evaluate((selector) => {
            const imgElement = document.querySelector(selector);
            return imgElement ? imgElement.src : "No image found.";
        }, responseSelector);

        console.log("Image URL:", response);
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        // Keep the browser open to allow live interaction
        console.log("Script execution completed. Browser will remain open.");
        // Comment out the next line if you want the browser to stay open
        // await browser.close();
    }
})();
