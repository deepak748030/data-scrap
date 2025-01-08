const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadFile = async () => {
    try {
        const url = "https://tera.xdisk.site/rd.html?url=https://cdn2.aialertz.com/U2FsdGVkX1%252B9v1ahuN2wdeyHZIU%252B15Qq9Q2ksS5Z19g1%252FjI96F4NCdaAs6tIkqDszUnta0GdCs%252BdtS8LWaJDdDQHAyjahvDtVDNJ1uIqIWfKCP%252B842GOu3K%252F4aaWMMsS.vdo&filename=2023-11-29-11-07-09(5).mp4&size=2.29%20MB";
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        // Save the file to the local filesystem
        const filePath = path.resolve('2023-11-29-11-07-09(5).mp4');
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', () => {
            console.log(`File downloaded to ${filePath}`);
        });
        writer.on('error', (err) => {
            console.error("Error writing the file:", err);
        });
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};

downloadFile();
