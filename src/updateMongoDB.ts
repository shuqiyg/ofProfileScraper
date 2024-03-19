import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';

const username = "sq";
const password = "jbOUaNFDP68XlTbr";
const uri = `mongodb+srv://${username}:${password}@fandora.tk7wzhs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

try {
    await client.connect();

    const database = client.db("fandora");
    const collection = database.collection("users");
    const result = await collection.updateOne({ accountName: "kathrynfree" }, { $set: { active: 0} });
    console.log(result.modifiedCount); // Prints the number of documents modified
    
    // const existingDocuments = await collection.find({})
    // while (await existingDocuments.hasNext()) {
    //     const doc = await existingDocuments.next();
    //     if(!doc.likesCount){ 
    //         //********update the tags by counting the likes by using 'icon-like' ********* */
    //         let likes = doc.stats['icon-like'];
    //         let likesCount = 0;
    //         if (likes) {
    //             if (likes.includes('K')) {
    //                 likes = parseFloat(likes.replace('K', '')) * 1000;
    //             } else if (likes.includes('M')) {
    //                 likes = parseFloat(likes.replace('M', '')) * 1000000;
    //             } else {
    //                 likes = parseFloat(likes);
    //             }
    //             likesCount = Math.floor(likes)
    //             // console.log(likes);
    //             // if (likes > 500000) {
    //             //     doc.tags.push("top");
    //             // } else if (likes > 100000) {
    //             //     doc.tags.push("hot");
    //             // } else {
    //             //     doc.tags.push("new");
    //             // }
    //         }
    //         console.log(doc.accountName, likesCount);
    //         doc.likesCount = likesCount;
    //         await collection.updateOne({ _id: doc._id }, { $set: doc });
    //     }
    // }
} finally {
    await client.close();
}


