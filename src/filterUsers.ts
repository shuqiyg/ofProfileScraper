import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

const crawler = new PlaywrightCrawler({
    // Function called for each URL

    async requestHandler({ request, page, enqueueLinks}) {
        // Check if the page has a div element with class name "b-404"
        const is404 = await page.locator('.b-404');
        const ofURL = request.url;
        console.log("is404: ", await is404.textContent());
        if (is404) {
            // Read the usernames from userNotFound.txt
            const usernames = fs.readFileSync('userNotFound.txt', 'utf-8').split('\n').map(line => line.trim()).filter(Boolean);
            
            // Filter out the matching record
            const updatedUsernames = usernames.filter(username => username !== ofURL);
            
            // Write the updated content back to userNotFound.txt
            fs.writeFileSync('userNotFound.txt', updatedUsernames.join('\n'));
            
            return;
        }
    },
    maxRequestRetries: 1,   
});

// Read the usernames from combined_users.txt
const ofURLs = fs.readFileSync('ofMasterCleanUp.txt', 'utf-8').split('\n').map(line => line.trim()).filter(Boolean);

// Create an array of urls by appending each username to 'https://onlyfans.com/'
// const urls = usernames.map(username => `https://onlyfans.com/${username}`);
// console.log(urls)

// Add the urls to the crawler
await crawler.addRequests(ofURLs);

// Run the crawler
await crawler.run();
