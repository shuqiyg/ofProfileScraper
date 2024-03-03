import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';
import fetch from 'node-fetch';

let nsfw = [];

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    navigationTimeoutSecs: 10,
    maxRequestRetries: 2,
    async requestHandler({ request, page, enqueueLinks }) {

        // Check if NSFW icon element is present on the page
        const nsfwElement = await page.locator('.lrzZ8b0L6AzLkQj5Ww7H1') || document.querySelector('icon-nsfw');
        
        if (nsfwElement) {
            nsfw.push(request.url);
            // Append the URL to the new file named "subReddits_NSFW.txt"
            fs.appendFileSync('subReddits_NSFW.txt', request.url + '\n');
            console.log(request.url);
        }
    },
});

// Read from ofLinks.txt file, extract all the strings separated by newline and create an array using those strings
const links = fs.readFileSync('subreddits.txt', 'utf-8')
                .split('\n')
                .map(link => "https://www.reddit.com/r/" + link.trim().toLowerCase())
                .filter(Boolean)

await crawler.addRequests(links);

// // Run the crawler
await crawler.run();

