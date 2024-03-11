import fs from 'fs';
import path from 'path';

import { Dataset, PlaywrightCrawler } from 'crawlee';
const folderPath = '/storage/datasets';

fs.readdirSync(folderPath).forEach((folderName) => {
    const filePath = path.join(folderPath, folderName, 'data.json');
    
    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (jsonData.socialLinks && jsonData.socialLinks.length > 0) {
            const url = jsonData.socialLinks[0].url;
            // Perform actions with the URL
            // ...
        }
    } catch (error) {
        console.error(`Error parsing JSON file ${filePath}: ${error}`);
    }
});





const crawler = new PlaywrightCrawler({
    // Function called for each URL
    navigationTimeoutSecs: 10,
    maxRequestRetries: 2,
    async requestHandler({ request, page, enqueueLinks }) {
        console.log(page.url());
    },
});


await crawler.addRequests(["https://onlyfans.com/api2/v2/users/social/buttons/click?id=LwZEv4QDgQfXwJUKyu7WnhxaVOQoaP%2Bn&token=q1CYQ7y9e8144eb39e1f004338cc83298ca9ed49&app-token=33d57ade8c02dbc5a333db99ff9ae26a"]);

// // Run the crawler
await crawler.run();
























// if (jsonData.stats && Object.keys(jsonData.stats).length !== 0) {
//     if (jsonData.stats["icon-like"]) {
//         const valueString = jsonData.stats["icon-like"];
//         if (valueString.includes("K")) {
//             const valueWithoutK = valueString.replace("K", "");
//             const valueNumber = parseFloat(valueWithoutK);
//             if (valueNumber >= 20) {
//                 console.log(++count);
//                 console.log(jsonData.stats)
//                 // documents.push(jsonData);
//             }
//         }
//     }
// }