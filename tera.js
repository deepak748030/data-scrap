const { connect } = require('puppeteer-real-browser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserPreferencesPlugin = require('puppeteer-extra-plugin-user-preferences');
const fs = require('fs');
const path = require('path');
// const chromeLauncher = require('chrome-launcher');
const express = require('express');
const router = express.Router();



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

router.post('/download', async (req, res) => {
    const { url } = req.body;
    console.log(req.body);

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let page;
    try {


        // const chrome = await chromeLauncher.launch({
        //     chromePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
        // });

        const { page: connectedPage } = await connect({
            executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
            args: ["--no-sandbox"],
            headless: true, // Run browser in headless mode
        });
        page = connectedPage;

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
        console.log('Page loaded');

        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds

        // Close modal and submit the URL
        await page.evaluate((url) => {
            const buttons = document.querySelectorAll('button[type="button"]');
            buttons.forEach(button => {
                if (button.offsetParent !== null) {
                    button.click();
                }
            });

            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                input.value = url;
            });

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && submitButton.offsetParent !== null) {
                submitButton.click();
            }
        }, url);

        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

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
                        }
                    }, thirdLink);

                    // Wait for download to complete
                    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds

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
    } finally {
        if (page) {
            await page.close();
        }
    }
});

module.exports = router;
