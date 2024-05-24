import { Dataset, PlaywrightCrawler } from "crawlee";
import fs from "fs";
import fetch from "node-fetch";

async function downloadImage(url: string, filePath: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(filePath, buffer);
}

// Read from mongoOfUsers.json
const data = fs.readFileSync("mongoOfUsers.txt", "utf-8");

// Extract the array
const userArray = JSON.parse(data);

// Append "https://onlyfans.com/" to each element
const urls = userArray.map((username: string) => `https://onlyfans.com/${username}`);

const crawler = new PlaywrightCrawler({
  // Function called for each URL
  navigationTimeoutSecs: 5,
  async requestHandler({ request, page, enqueueLinks }) {
    maxRequestsPerCrawl: 50;
    this.maxRequestRetries = 1;
    // Check if username element is present on the page
    const usernameElement = page.locator(".g-user-name");
    if (usernameElement) {
      console.log(
        "+URL:",
        request.url
      );
      fs.appendFileSync("deletedOf.txt", request.url + "\n");
      return;
    }
  },
});



// Print out each URL
urls.forEach((url: string) => console.log(url));
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();

