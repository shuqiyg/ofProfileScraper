import fs from 'fs';
import path from 'path';
import { Dataset, PlaywrightCrawler } from 'crawlee';

const folderPath = 'storage/datasets';
//******* */ find the OF Social Links first ***********

// const socialOFFilePath = path.join('slToRefetch.txt');
// const socialOFContent = fs.readFileSync(socialOFFilePath, 'utf-8');
// const socialOFRecords = socialOFContent.split('\n').filter(line => line.trim() !== '');

// const folders = fs.readdirSync(folderPath, { withFileTypes: true })
//     .filter(dirent => dirent.isDirectory())
//     .map(dirent => dirent.name);

// for (const folder of folders) {
//     const filePath = path.join(folderPath, folder, '000000001.json');
//     if (fs.existsSync(filePath)) {
//         const fileContent = fs.readFileSync(filePath, 'utf-8');
//         const data = JSON.parse(fileContent);
//         if (data.socialLinks && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
//             for (const link of data.socialLinks) {
//                 if (!socialOFRecords.includes(link)) {
//                     fs.appendFileSync(socialOFFilePath, `${link}\n`, 'utf-8');
//                 }
//             }
//         }
//     }
// }


// ********************* fetch social links *********************
// let count = 0;
// let keyValues = [];
// const crawler = new PlaywrightCrawler({
//     // maxRequestsPerCrawl: 100,
//     maxRequestRetries: 2,
//     async requestHandler({ request, page, enqueueLinks }) {
//         // console.log(request.url, " : ", page.url(), "\n");
//         const newPair: Record<string, string> = {};
//         newPair[request.url] = page.url();
//         keyValues.push(newPair);
//         console.log(++count, newPair);
//         // const newLink = page.url();
//         // newSocialLinks.push(newLink);
//     },
// });

// const filePath = path.join('slToRefetch.txt');
// const fileContent = fs.readFileSync(filePath, 'utf-8');
// const records = fileContent.split('\n').filter(line => line.trim() !== '');

// console.log(records)
// await crawler.addRequests(records);

// // Run the crawler
// await crawler.run();

// const keyValuesFilePath = path.join('keyValuesOF.txt');
// const keyValuesContent = JSON.stringify(keyValues);
// fs.writeFileSync(keyValuesFilePath, keyValuesContent, 'utf-8');

// *************************** replace social links with new ones by matching the key(old link) it's working on test *******
const folders = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const folder of folders) {
    const filePath = path.join(folderPath, folder, '000000001.json');
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        if (data.socialLinks && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
            for (let i = 0; i < data.socialLinks.length; i++) {
                const link = data.socialLinks[i];
                const keyValuePairs = JSON.parse(fs.readFileSync('keyValuesOF.txt', 'utf-8'));
                for (const pair of keyValuePairs) {
                    const key = Object.keys(pair)[0];
                    const value = pair[key];
                    if (link === key) {
                        data.socialLinks[i] = value;
                        break;
                    }
                }
            }
            fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
            console.log(folder, " : " ,data.socialLinks);
        }
    }
}