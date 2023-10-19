import { Dataset, PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    async requestHandler({ request, page, body }) {

        const username = await page.locator('.b-compact-header__wrapper').textContent();
        const followers = await page.locator('svg[data-icon-name="icon-follow"] use')
        .getAttribute('xlink:href');
        const profilePic = await page.locator('.g-avatar__img-wrapper img').getAttribute('src');
        const userInfo = await page.locator('.b-user-info__text p').textContent();
        const banner = await page.locator('.b-profile__header img').getAttribute('src');
        // Save data to default dataset
        await Dataset.pushData({
            url: request.url,
            username: username,
            followers: followers,
            avatar: profilePic,
            banner: banner,
            userInfo: userInfo,
        });
    },
});

await crawler.addRequests([
    'https://onlyfans.com/brandyontherocks'
]);

// Run the crawler
await crawler.run();