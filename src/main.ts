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
    async requestHandler({ request, page, enqueueLinks}) {
        // Check if username element is present on the page
        const usernameElement = await page.locator('.b-compact-header__wrapper');
        if (!usernameElement) {
            console.log('Username element not found on page. Skipping URL:', request.url);
            return;
        }

        // maxRequestsPerCrawl:100;
        // this.maxRequestRetries =3;
        //username 
        const username = await usernameElement.textContent();

        //account name
        const splits = request.url.split('/');
        const accountName = splits[splits.length - 1];

        // stats of images, videos, likes, views, and streams
        const lis = await page.$$('.b-profile__sections li');
        const stats ={}
        for (let i = 0; i < lis.length; i++) {
            const li = lis[i];
            const iconName = await li.$eval('svg', (svg) => svg.getAttribute('data-icon-name'));
            const countSpan = await li.$eval('span', (span) => span.textContent);
            stats[iconName] = countSpan;
            console.log(`Icon name: ${iconName}, count: ${countSpan}`);
        }
        console.log("**Stats**: ", stats)
        // const userStats = await page.locator('.b-profile__sections').innerText();

        const followers = await page.locator('svg[data-icon-name="icon-follow"] use');

        //need to get the price of subscription, either free or $XX.XX
        const subsFee = await page.locator('.b-offer-join').first().textContent();

        //get the banner image
        const banner = await page.locator('.b-profile__header img').getAttribute('src');

        //get the profile pic
        const profilePic = await page.locator('.b-profile__user .g-avatar__img-wrapper img').getAttribute('src');
        //change the url to the full size image
        const profilePicZoom = convertThumbnailToPublic(profilePic as string);
        //get the user info (bio)
        const userBio = await page.locator('.b-user-info__text p').textContent();

        //personal link
        let personalLink = "" || null;
        try {
            personalLink = await page.waitForSelector('.b-user-info__detail a', { timeout: 1000 }).then((el) => el.getAttribute('href'));
        } catch (error) {
            console.log("Personal link not found for this URL");
        }

        //general profile content(html)
        const profile = await page.locator('.b-profile__content').innerHTML();

        //search for other social media links (tiktok, intagram, twitter, facebook, fansly, etc)
    //     console.log(request.url);
    //     await page.waitForSelector('.swiper-wrapper a');
    //     const links = await page.$$eval('.swiper-wrapper a', links => links.map(link => link.getAttribute('href')));
    //     if (links.length > 0) {
    //       await enqueueLinks({
    //           urls: links.filter(link => link !== null) as string[],
    //           selector: 'a',
    //           label: 'page',
    //           requestQueue: crawler.requestQueue
    //       });
    //   }
        const dataset = await Dataset.open(accountName)
        // Save data to default dataset
        await dataset.pushData({
            onlyFansUrl: request.url,
            accountName,
            userName: username,
            subsFee: findPriceOrFree(subsFee??"Free"),
            stats,
            followers: followers,
            avatar: profilePic,
            avatarZoom: profilePicZoom,
            bannerImg: banner,
            userBio: userBio,
            location: "",
            links: personalLink,
            profileHtml: profile,
        });
        // downloadImage(profilePic, `storage/datasets/${accountName}/profilePic.jpg`);
        // downloadImage(profilePicZoom, `storage/datasets/${accountName}/profilePicZoom.jpg`);
        // downloadImage(banner, `storage/datasets/${accountName}/banner.jpg`);
        
    },
});

// Read from ofLinks.txt file, extract all the strings separated by newline and create an array using those strings
const links = fs.readFileSync('ofLinks copy.txt', 'utf-8').split('\n').filter(Boolean);
console.log(links);
    // scrape 50 pages at a time, need to find out the limits of crawlee, maybe write a script to run multiple crawlers at once
await crawler.addRequests(links);
            // 'https://onlyfans.com/elle_girl713',
        // // 'https://onlyfans.com/Scared-Abalone-3477',
        // // 'https://onlyfans.com/elaina_stjames',
        // // 'https://onlyfans.com/loonascandi',
        // 'https://onlyfans.com/laurenelizabeth',
        // 'https://onlyfans.com/Kinkyffantasy',
        // 'https://onlyfans.com/AmateurParents',
        // 'https://onlyfans.com/pocketpixxie',
        // "https://onlyfans.com/mature_kittie",
        // "https://onlyfans.com/kristiandkloe/c1",
        // "https://onlyfans.com/kenandbarbie69",
        // "https://onlyfans.com/es.lain"


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
  
// Run the crawler
await crawler.run();


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