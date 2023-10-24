import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    async requestHandler({ request, page, body }) {
        maxRequestsPerCrawl:100;
        //need to parse the header to get likes, subs, posts, videos, views,
        // const username = await page.locator('.b-compact-header__wrapper').textContent();
        const userStats = await page.locator('.b-profile__sections').innerHTML();
        for(let stat in userStats as any){
            console.log(stat);
        }
        const followers = await page.locator('svg[data-icon-name="icon-follow"] use');
        //need to get the price of subscription, either free or $XX.XX
        const subsFee = await page.locator('.b-offer-join').first().textContent();

        // const price = await page.locator('.b-btn-text__small').textContent();
        // .getAttribute('xlink:href');

        //get the banner image
        const banner = await page.locator('.b-profile__header img').getAttribute('src');
        //get the profile pic
        const profilePic = await page.locator('.b-profile__user .g-avatar__img-wrapper img').getAttribute('src');
        //change the url to the full size image
        const profilePicZoom = convertThumbnailToPublic(profilePic as string);
        //get the user info (bio)
        const userInfo = await page.locator('.b-user-info__text p').textContent();
        
        // Save data to default dataset
        await Dataset.pushData({
            subsFee: subsFee,
            // prict:price,
            url: request.url,
            // username: username,
            userStats: userStats,
            followers: followers,
            avatar: profilePic,
            avatarZoom: profilePicZoom,
            banner: banner,
            userInfo: userInfo,
        });
    },
});

// <div classname="abc">
    //  <div/>
    //  <img/>
    // </div>

    // scrape 50 pages at a time, need to find out the limits of crawlee, maybe write a script to run multiple crawlers at once
    await crawler.addRequests([
        'https://onlyfans.com/elaina_stjames',
        'https://onlyfans.com/loonascandi'
    ]);

function convertThumbnailToPublic(thumbnailUrl: string): string {
    let firstReplace = thumbnailUrl.replace("https://thumbs.onlyfans.com", "https://public.onlyfans.com");
    let secondReplace = firstReplace.replace("/public/files/thumbs/c144", "/files");
    return secondReplace;
  }

// Run the crawler
await crawler.run();


// https://imgur.com/ try scraping videos as well (redgif maybe?)
// https://apify.com/clockworks/tiktok-scraper