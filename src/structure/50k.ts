import { appendFileSync } from 'fs';
import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';

let avatarSlug = ""
let bannerSlug = ""
let avatarZoomSlug = ""

async function run() {

        const documents = [];

        const foldersPath = "storage/datasets"
        const folders = fs.readdirSync(foldersPath);
        let count = 0;
        for (const folder of folders) {
            const filePath = path.join(foldersPath, folder, '000000001.json');
            const fileExists = fs.existsSync(filePath);
            if (fileExists) {
                const fileData = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(fileData);

                if (jsonData.stats && Object.keys(jsonData.stats).length !== 0) {
                    if (jsonData.stats["icon-like"]) {
                        const valueString = jsonData.stats["icon-like"];
                        if (valueString.includes("K")) {
                            const valueWithoutK = valueString.replace("K", "");
                            const valueNumber = parseFloat(valueWithoutK);
                            if (valueNumber >= 25) {
                                const accountName = jsonData.accountName;
                                appendFileSync("over25K.txt", accountName + '\n');
                            }
                        }
                        if (valueString.includes("M")) {
                            const accountName = jsonData.accountName;
                            appendFileSync("over25K.txt", accountName + '\n');                        
                            }
                        }
                    }
                }
            }
}

run().catch(console.dir);