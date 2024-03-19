import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';

const username = "sq";
const password = "jbOUaNFDP68XlTbr";
const uri = `mongodb+srv://${username}:${password}@fandora.tk7wzhs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

let avatarSlug = ""
let bannerSlug = ""
let avatarZoomSlug = ""

async function run() {
    try {
        await client.connect();

        const database = client.db("fandora");
        const collection = database.collection("users");

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
                            if (valueNumber >= 15) {
                                const accountName = jsonData.accountName;
                                const existingDocument = await collection.findOne({ accountName });
                                if (!existingDocument) {
                                    documents.push(jsonData);
                                    console.log(++count);
                                    console.log(jsonData.stats);

                                }
                            }
                        }
                        if (valueString.includes("M")) {
                            const accountName = jsonData.accountName;
                            const existingDocument = await collection.findOne({ accountName });
                            if (!existingDocument) {
                                documents.push(jsonData);
                                console.log(++count);
                                console.log(jsonData.stats);                                
                            }
                        }
                    }
                }
            }
        }
        if(documents.length !== 0) {
            const result = await collection.insertMany(documents);
            console.log(`Documents inserted with the _ids: ${result.insertedIds}`);
        }else{
            console.log("No documents to insert");
        }
    } finally {
        await client.close();
    }
}

run().catch(console.dir);