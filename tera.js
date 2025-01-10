const { connect } = require('puppeteer-real-browser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserPreferencesPlugin = require('puppeteer-extra-plugin-user-preferences');
const express = require('express');
const router = express.Router();

puppeteer.use(StealthPlugin());
puppeteer.use(UserPreferencesPlugin({
    userPrefs: {
        'download.default_directory': ''
    }
}));

router.post('/download', async (req, res) => {
    const { url } = req.body;
    console.log(req.body);

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const { page } = await connect({
            headless: true,
            args: ["--disable-dev-shm-usage"]
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

        await page.evaluate((url) => {
            console.log(url);
            const buttons = document.querySelectorAll('button[type="button"]');
            console.log(buttons);
            console.log('button finding');
            buttons.forEach(button => {
                if (button.offsetParent !== null) {
                    button.click();
                    console.log('close btn clicked');
                }
            });

            const inputs = document.querySelectorAll('input[type="text"]');
            console.log(inputs.length);
            inputs.forEach(input => {
                input.value = url;
                console.log('input filled');
            });

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && submitButton.offsetParent !== null) {
                submitButton.click();
                console.log('submit btn clicked');
            }
            console.log('submit btn clicked');
        }, url);

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
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (downloadLinks.length > 0) {
            console.log('Download links:', downloadLinks);
            res.status(200).json({ downloadLinks });
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
