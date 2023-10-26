import { Dataset, PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    async requestHandler({ request, page, enqueueLinks}) {
        maxRequestsPerCrawl:100;
        //username 
        const username = await page.locator('.b-compact-header__wrapper').textContent();

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
        console.log("****", stats)
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
        const personalLink = await page.locator('.b-user-info__detail a').getAttribute('href');

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

    
        // Save data to default dataset
        await Dataset.pushData({
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
        
    },
});

    // scrape 50 pages at a time, need to find out the limits of crawlee, maybe write a script to run multiple crawlers at once
    await crawler.addRequests([
        'https://onlyfans.com/elaina_stjames',
        'https://onlyfans.com/loonascandi',
        'https://onlyfans.com/laurenelizabeth',
    ]);

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