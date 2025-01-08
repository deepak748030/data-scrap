const { connect } = require('puppeteer-real-browser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserPreferencesPlugin = require('puppeteer-extra-plugin-user-preferences');
const fs = require('fs');
const path = require('path');


const downloadDirectory = path.join(__dirname, 'download2');

if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory);
}

puppeteer.use(StealthPlugin());
puppeteer.use(UserPreferencesPlugin({
    userPrefs: {
        'download.default_directory': downloadDirectory
    }
}));

// (async () => {
//     const { page } = await connect({
//         headless: true, // Run browser in headless mode
//         args: ["--no-sandbox"]
//     });

//     // Set the download behavior
//     const client = await page.target().createCDPSession();
//     await client.send('Page.setDownloadBehavior', {
//         behavior: 'allow',
//         downloadPath: downloadDirectory
//     });

//     await page.setUserAgent('...........');
//     await page.setExtraHTTPHeaders({
//         'Accept-Language': 'en-US,en;q=0.9',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//         'Sec-Fetch-User': '?1',
//         'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Linux"',
//     });
//     await page.goto('https://teradownloader.com', { waitUntil: 'networkidle2' });
//     console.log('page loaded');
//     console.log('interval start');
//     await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
//     console.log('interval end');
//     // Click on the Close button
//     await page.evaluate(() => {
//         const buttons = document.querySelectorAll('button[type="button"]');
//         console.log(buttons);
//         console.log('button finding');
//         buttons.forEach(button => {
//             if (button.offsetParent !== null) { // Check if the button is visible
//                 button.click();
//                 console.log('close btn clicked');
//             }
//         });

//         const inputs = document.querySelectorAll('input[type="text"]');
//         inputs.forEach(input => {
//             input.value = 'https://1024terabox.com/s/1niY7xPDW265pk39RRV3TdA'; // Fill the input with 'sample text'
//             console.log('input filled');
//         });
//         const submitButton = document.querySelector('button[type="submit"]');
//         if (submitButton && submitButton.offsetParent !== null) { // Check if the button is visible
//             submitButton.click();
//             console.log('submit btn clicked');
//         }
//         console.log('submit btn clicked');
//     });

//     await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//     console.log('page navigated');
//     console.log('interval start');

//     let downloadLinks = [];

//     while (downloadLinks.length === 0) {
//         downloadLinks = await page.evaluate(() => {
//             const anchors = document.querySelectorAll('a[rel="noopener noreferrer"]');
//             return Array.from(anchors)
//                 .map(anchor => anchor.href)
//                 .filter(href => !href.includes('play.google.com/store/apps/details?id=com.parrot.downloader'));
//         });

//         if (downloadLinks.length === 0) {
//             console.log('Download links not found, retrying...');
//             await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
//         }
//     }

//     if (downloadLinks.length > 0) {
//         console.log('Download links:', downloadLinks);
//         const thirdLink = downloadLinks[2];
//         if (thirdLink) {
//             try {
//                 await page.evaluate((link) => {
//                     const anchor = document.querySelector(`a[href="${link}"]`);
//                     if (anchor) {
//                         anchor.click();
//                         console.log('Third download link clicked');
//                     }
//                 }, thirdLink);
//                 // Assuming the download starts automatically, otherwise you may need to trigger it
//                 // Wait for the download to complete (this is just an example, adjust as needed)
//                 await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds
//                 console.log('Download should be completed');

//                 // List the files in the download directory
//                 const files = fs.readdirSync(downloadDirectory);
//                 console.log('Downloaded files:', files);
//                 files.forEach(file => {
//                     console.log('File location:', path.join(downloadDirectory, file));
//                 });
//             } catch (error) {
//                 console.error('Failed to click on third download link:', error);
//             }
//         } else {
//             console.log('Third download link not found');
//         }
//     } else {
//         console.log('Download links not found');
//     }

//     // await page.close();
//     // process.exit();
// })();


const express = require('express');
const router = express.Router();

// Middleware to parse JSON bodies
// router.use(bodyParser.json());

router.post('/download', async (req, res) => {
    const { url } = req.body;
    console.log(req.body);

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const { page } = await connect({
            headless: true,
            args: ["--no-sandbox"]
        });

        // Set the download behavior
        const client = await page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDirectory
        });

        await page.setUserAgent('...........');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Sec-Fetch-User': '?1',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
        });
        await page.goto('https://teradownloader.com', { waitUntil: 'networkidle2' });
        console.log('page loaded');

        // Click on the Close button
        await page.evaluate((url) => {
            console.log(url)
            const buttons = document.querySelectorAll('button[type="button"]');
            console.log(buttons);
            console.log('button finding');
            buttons.forEach(button => {
                if (button.offsetParent !== null) { // Check if the button is visible
                    button.click();
                    console.log('close btn clicked');
                }
            });

            const inputs = document.querySelectorAll('input[type="text"]');
            console.log(inputs.length);
            inputs.forEach(input => {
                input.value = url; // Fill the input with the provided URL
                console.log('input filled');
            });

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && submitButton.offsetParent !== null) { // Check if the button is visible
                submitButton.click();
                console.log('submit btn clicked');
            }
            console.log('submit btn clicked');
        }, url); // Pass the URL to the evaluate function

        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        console.log('page navigated');
        console.log('interval start');

        let downloadLinks = [];

        while (downloadLinks.length === 0) {
            downloadLinks = await page.evaluate(() => {
                const anchors = document.querySelectorAll('a[rel="noopener noreferrer"]');
                return Array.from(anchors)
                    .map(anchor => anchor.href)
                    .filter(href => !href.includes('play.google.com/store/apps/details?id=com.parrot.downloader'));
            });

            if (downloadLinks.length === 0) {
                console.log('Download links not found, retrying...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
            }
        }

        if (downloadLinks.length > 0) {
            console.log('Download links:', downloadLinks);
            const thirdLink = downloadLinks[2];
            if (thirdLink) {
                try {
                    await page.evaluate((link) => {
                        const anchor = document.querySelector(`a[href="${link}"]`);
                        if (anchor) {
                            anchor.click();
                            console.log('Third download link clicked');
                        }
                    }, thirdLink);

                    // Assuming the download starts automatically, otherwise you may need to trigger it
                    // Wait for the download to complete (this is just an example, adjust as needed)
                    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds
                    console.log('Download should be completed');

                    // List the files in the download directory
                    const files = fs.readdirSync(downloadDirectory);
                    console.log('Downloaded files:', files);
                    files.forEach(file => {
                        console.log('File location:', path.join(downloadDirectory, file));
                    });

                    res.status(200).json({ downloadLinks });
                } catch (error) {
                    console.error('Failed to click on third download link:', error);
                    res.status(500).json({ error: 'Failed to click on third download link' });
                }
            } else {
                console.log('Third download link not found');
                res.status(404).json({ error: 'Third download link not found' });
            }
        } else {
            console.log('Download links not found');
            res.status(404).json({ error: 'Download links not found' });
        }
    } catch (error) {
        console.error('Error during download process:', error);
        res.status(500).json({ error: 'Error during download process' });
    }
});


module.exports = router;