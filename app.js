const express = require('express');
const { connect } = require('puppeteer-real-browser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserPreferencesPlugin = require('puppeteer-extra-plugin-user-preferences');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const downloadDirectory = path.join(__dirname, 'download2');

// Ensure download directory exists
if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory);
}

// Use Puppeteer plugins
puppeteer.use(StealthPlugin());
puppeteer.use(UserPreferencesPlugin({
    userPrefs: {
        'download.default_directory': downloadDirectory
    }
}));

app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const { page } = await connect({
            headless: true,
            args: ["--no-sandbox", "--disable-dev-shm-usage"] // Additional args for stability
        });

        // Set the download behavior
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDirectory
        });

        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Page loaded');

        // Handle button clicks and form submissions
        await page.evaluate((url) => {
            const buttons = document.querySelectorAll('button[type="button"]');
            buttons.forEach(button => {
                if (button.offsetParent !== null) { // Check if visible
                    button.click();
                }
            });
            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                input.value = url; // Fill the input with the provided URL
            });
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && submitButton.offsetParent !== null) { // Check if visible
                submitButton.click();
            }
        }, url);

        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        console.log('Page navigated');

        // Extract download links and handle downloads...
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
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
            }
        }

        if (downloadLinks.length > 0) {
            const thirdLink = downloadLinks[2]; // Adjust as necessary
            if (thirdLink) {
                await page.evaluate((link) => {
                    const anchor = document.querySelector(`a[href="${link}"]`);
                    if (anchor) anchor.click();
                }, thirdLink);

                // Wait for the download to complete (adjust as needed)
                await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds

                res.status(200).json({ message: 'Download should be completed', downloadLinks });
            } else {
                res.status(404).json({ error: 'Third download link not found' });
            }
        } else {
            res.status(404).json({ error: 'Download links not found' });
        }

    } catch (error) {
        console.error('Error during download process:', error);
        res.status(500).json({ error: 'Error during download process' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
