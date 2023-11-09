import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    async requestHandler({ request, page, enqueueLinks}) {

        // Wait for 2 seconds before checking if username element is present on the page
        await page.waitForTimeout(1000);
        const usernameElement = await page.locator('.b-compact-header__wrapper');
        if (!usernameElement) {
            console.log('Username element not found on page. Skipping URL:', request.url);
            return;
        } else {
            console.log('This account exists ', await usernameElement.textContent());
        }
    },
    maxRequestRetries: 0, 
});

// Read the usernames from combined_users.txt
const usernames = fs.readFileSync('combined_users.txt', 'utf-8').split('\n').map(line => line.trim());

// Create an array of urls by appending each username to 'https://onlyfans.com/'
const urls = usernames.map(username => `https://onlyfans.com/${username}`);
console.log(urls)
// Add the urls to the crawler
await crawler.addRequests(urls);


// Run the crawler
await crawler.run();
