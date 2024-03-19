import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';
import fetch from 'node-fetch';


async function downloadImage(url: string, filePath: string): Promise<void> {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
}


const crawler = new PlaywrightCrawler({
    // Function called for each URL
    navigationTimeoutSecs:3,
    async requestHandler({ request, page, enqueueLinks}) {
        maxRequestsPerCrawl:100;
        this.maxRequestRetries = 1;
        // Check if username element is present on the page
        const usernameElement = await page.locator('.g-user-name').first();
        if (!usernameElement) {
            console.log('Username element not found on page. Skipping URL:', request.url);
            return;
        }

        //username im
        const username = await usernameElement.textContent();

        //account name
        const splits = request.url.split('/');
        const accountName = splits[splits.length - 1];

        // stats of images, videos, likes, views, and streams
        let stats = {} 
        const sectionLinks = await page.$$eval('.b-profile__sections__link', (links) => links.map((link) => {
                const svg = link.querySelector('svg')?.getAttribute('data-icon-name');
                const span = link.querySelector('span')?.innerText;
                return { svg, span };
        }));
 
        console.log("**Stats**: ", sectionLinks)
        stats = sectionLinks.reduce((acc, { svg, span }) => {
            acc[svg] = span;
            return acc;
        }, {});

        //get the subscription fee
        let subsFee = "" || null;
        try {
            subsFee = await page.locator('.b-offer-join').first().textContent();
        } catch (error) {
            console.error('Error occurred while getting subscription fee:', error);
            subsFee = "Free";
        }

        //get the banner image
        const banner = await page.locator('.b-profile__header img').getAttribute('src');

        //get the profile pic
        let profilePic = "" || null;
        let profilePicZoom = "" || null;
        try {
            profilePic = await page.locator('.b-profile__user .g-avatar__img-wrapper img').getAttribute('src');
            profilePicZoom = convertThumbnailToPublic(profilePic as string);
        } catch (error) {
            console.error('Error occurred while getting profile picture (Banner Replace Instead):', error);
            profilePic = banner;
            profilePicZoom = banner;
        }
        
        //change the url to the full size image
        // const profilePicZoom = convertThumbnailToPublic(profilePic as string);

        //get the user info (bio)
        let userBio = "" || null;
        try{
            userBio = await page.locator('.b-user-info__text p').textContent();
        }catch(error){
            console.log("User bio not found for this URL");
        }

        //personal link
        let personalLink = "" || null;
        try {
            personalLink = await page.waitForSelector('.b-user-info__detail a', { timeout: 1000 }).then((el) => el.getAttribute('href'));
            // if(personalLink){
            personalLink.replace("/away?url=", "")
            // }
        } catch (error) {
            console.log("No Personal links Found.");
        }

        // social links
        let socialLinks = [] as string[];
        try {
            socialLinks = await page.$$eval('.m-single-current > div > a', (anchors) => anchors.map((anchor) => anchor.getAttribute('href')));
            console.log(socialLinks);
        } catch (error) {
            console.error('No Social links Found.');
        }

        const dataset = await Dataset.open(accountName)
        // Save data to default dataset
        await dataset.pushData({
            onlyFansUrl: request.url,
            accountName,
            userName: username,
            subsFee: findPriceOrFree(subsFee??"Free"),
            stats,
            avatar: profilePic,
            avatarZoom: profilePicZoom,
            bannerImg: banner,
            userBio: userBio,
            personalLink: personalLink,
            location: "",
            socialLinks,
            avatarCDN: "",
            bannerCDN: "",
            otherImages: [],
            active: 1,
            membership: "free",
            tags: [],
            likesCount: 0,
        });
        downloadImage(profilePic, `storage/datasets/${accountName}/${accountName}_profilePic.jpg`);
        downloadImage(profilePicZoom, `storage/datasets/${accountName}/${accountName}_profilePicZoom.jpg`);
        downloadImage(banner, `storage/datasets/${accountName}/${accountName}_banner.jpg`);
        
    },
});

// Read from ofLinks.txt file, extract all the strings separated by newline and create an array using those strings
const links = fs.readFileSync('ofLinks.txt', 'utf-8')
                .split('\n')
                .map(link => link.trim().toLowerCase())
                .filter(Boolean)
await crawler.addRequests(links);

// Run the crawler
await crawler.run();


//helper 1
function convertThumbnailToPublic(thumbnailUrl: string): string {
    let firstReplace = thumbnailUrl.replace("https://thumbs.onlyfans.com", "https://public.onlyfans.com");
    let secondReplace = firstReplace.replace("/public/files/thumbs/c144", "/files");
    return secondReplace;
}

//helper 2
function findPriceOrFree(input: string): string {
    const words = input.split(/\s+/);
    for (const word of words) {
      if (word.startsWith('$')) {
        return word;
      }
      if (word.toLowerCase() === 'free') {
        return 'Free';
      }
    }
    return 'Not Found';
  }

// https://imgur.com/ try scraping videos as well (redgif maybe?)
// https://apify.com/clockworks/tiktok-scraper

// ****************this is for fansly****************************
// // general profile content(html)
// const profile = await page.locator('.content-wrapper').innerHTML();
// //username
// const username = await page.locator('.username-wrapper .user-name').textContent();
// console.log(username);
// //display name
// const displayName = await page.locator('.icon-wrapper .display-name').textContent();
// console.log(displayName);
// //banner
// const banner = await page.locator('.image-placeholder-wrapper img').getAttribute('src'); 
// console.log(banner);
// const avatar = await page.locator('.avatar .image').getAttribute('src');
// console.log(avatar);
// const avatarZoom = await page.locator('.contain-no-grow').getAttribute('src');
// console.log(avatarZoom);
// const stats = await page.locator('.profile-stats').innerHTML();
// const bio = await page.locator('.profile-description-text span').textContent();
// const location = await page.locator('.location').textContent();
// const subPlans = await page.locator('app-account-subscription-plans').innerHTML();