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
const mongoMasterListPath = "MongoMasterList.txt";
const mongoMasterListData = fs.readFileSync(mongoMasterListPath, 'utf8');
const mongoMasterListArray = mongoMasterListData.split('\n');
console.log(mongoMasterListArray);


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
                            if (valueNumber >= 25) {
                                const accountName = jsonData.accountName;
                                 //check if accountName already exists
                                const existingDocument = await collection.findOne({ accountName });
                                if (!existingDocument) {
                                    documents.push(jsonData);
                                    console.log(++count);
                                    console.log(accountName, "---" ,jsonData.stats);

                                }
                            }
                        }
                        if (valueString.includes("M")) {
                            const accountName = jsonData.accountName;
                            //check if accountName already exists
                            const existingDocument = await collection.findOne({ accountName });
                            if (!existingDocument) {
                                documents.push(jsonData);
                                console.log(++count);
                                console.log(accountName, "---" ,jsonData.stats);                                
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

//total documents in mongo: 24572


// *************** get all userAccounts ******************
// async function appendAccountNamesToFile(collection) {
//     const cursor = collection.find({}, { projection: { accountName: 1, _id: 0 } });
//     const accountNames = await cursor.toArray();
//     const accountNamesString = accountNames.map((doc) => doc.accountName).join('\n');

//     fs.appendFileSync('MongoMasterList.txt', accountNamesString);
// }

// // Call the function after connecting to the database and before closing the connection
// await appendAccountNamesToFile(collection);