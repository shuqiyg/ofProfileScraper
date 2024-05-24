import { Dataset, PlaywrightCrawler } from "crawlee";
import fs from "fs";

//this if for scrapping channel profiles pages
// const filePath = "ph_channels.json";

// let phPages = [];
// for (let i = 1; i <= 10; i++) {
//   const crawler = new PlaywrightCrawler({
//     async requestHandler({ request, page, enqueueLinks }) {
//       const data = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll("div .description")).map(
//           (channel) => {
//             return {
//               chanelUrl: channel.querySelector("a")?.getAttribute("href"),
//               imgUrl: channel.querySelector("a img")?.getAttribute("src"),
//               channelName: channel.querySelector("a img")?.getAttribute("alt"),
//               videoViews: channel.querySelector(".omega span")?.innerHTML,
//             };
//           }
//         );
//       });

//       console.log(data);
//       fs.appendFileSync(filePath, JSON.stringify(data));
//     },
//   });
//   phPages.push(`https://www.pornhub.com/channels?o=rk&page=${i}`);

//   await crawler.addRequests(phPages);
//   // Run the crawler
//   await crawler.run();
// }

const filePath = "ph_channels.json";
const fileContent = fs.readFileSync(filePath, "utf-8");
const channels = JSON.parse(fileContent);

for (const channel of channels) {
  console.log(channel);
  const crawler = new PlaywrightCrawler({
    // Function called for each URL
    navigationTimeoutSecs: 10,
    async requestHandler({ request, page, enqueueLinks }) {
      maxRequestsPerCrawl: 100;
      this.maxRequestRetries = 2;

      try {
        const data = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("li.pcVideoListItem")
          ).map((li) => {
            return {
              category: "channel",
              channel: "",
              videoId: li.getAttribute("data-video-id"),
              videoKey: li.getAttribute("data-video-vkey"),
              title: li.querySelector(".title a")?.getAttribute("title"),
              uploader: li.querySelector(".usernameWrap a")?.textContent.trim(),
              uploaderUrl: li
                .querySelector(".usernameWrap a")
                ?.getAttribute("href"),
              thumbnailUrl: li.querySelector(".phimage a img")?.src,
              videoUrl: li
                .querySelector(".linkVideoThumb")
                ?.getAttribute("href"),
              data_mediabook: li
                .querySelector(".linkVideoThumb img")
                ?.getAttribute("data-mediabook"),
              width: li
                .querySelector(".linkVideoThumb img")
                ?.getAttribute("width"),
              height: li
                .querySelector(".linkVideoThumb img")
                ?.getAttribute("height"),
              duration: li.querySelector("div .duration")?.textContent.trim(),
              views: li.querySelector(".views var")?.textContent.trim(),
              rating: li
                .querySelector(".rating-container .value")
                ?.textContent.trim(),
            };
          });
        });
        console.log(data.length);

        for (const item of data) {
          console.log(item);
          let dirName = `${channel.channelUrl}/${item.videoId}`;
          dirName = dirName.replace(/^\//, '');
          console.log(dirName);
          item.channel = channel.channelName;
          const dataset = await Dataset.open(dirName);
          await dataset.pushData(item);
          // if (
          //   item.data_mediabook !== null &&
          //   item.data_mediabook !== ""
          // ) {
          //   downloadPreview(
          //     `storage/datasets/${dirName}`,
          //     item.data_mediabook as stringrec
          //   );
          // }
          // counts++;
          // fs.appendFileSync(
          //     "ph_channels_video_IDs.txt",
          //     item.videoId + "\n",
          //     "utf-8"
          // );
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
  });
  let phPages = [];
  for (let i = 1; i <= 1; i++) {
    phPages.push(`https://www.pornhub.com${channel.channelUrl}/videos?o=ra&page=${i}`);
  }
  await crawler.addRequests(phPages);
  // Run the crawler
  await crawler.run();
}