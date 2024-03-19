import fs from 'fs';
import path from 'path';

const datasetsFolderPath = 'storage/datasets';
const jsonFileName = '000000001.json';
const txtFileName = 'slToRefetch.txt';

// ************ check which profile has social links (to refetch later)
// const parentFolderPath = path.resolve(__dirname, '..');
const txtFilePath = path.join(txtFileName);

fs.readdir(datasetsFolderPath, async (err, folders) => {
    if (err) {
        console.error('Error reading datasets folder:', err);
        return;
    }

    for (const folder of folders) {
        const folderPath = path.join(datasetsFolderPath, folder);
        const jsonFilePath = path.join(folderPath, jsonFileName);

        try {
            const data = await fs.promises.readFile(jsonFilePath, 'utf8');
            const json = JSON.parse(data);
            const socialLinks = json.socialLinks;

            if (socialLinks && socialLinks.length > 0) {
                await fs.promises.appendFile(txtFilePath, `${folder}\n`);
            }
        } catch (err) {
            console.error(`Error reading ${jsonFileName} in ${folder}:`, err);
        }
    }
});


//************* */ check missing json file in folders 
// fs.readdir(datasetsFolderPath, async (err, folders) => {
//     if (err) {
//         console.error('Error reading datasets folder:', err);
//         return;
//     }

//     for (const folder of folders) {
//         const folderPath = path.join(datasetsFolderPath, folder);
//         const jsonFilePath = path.join(folderPath, jsonFileName);

//         try {
//             const isJsonFileExists = await fs.promises.access(jsonFilePath, fs.constants.F_OK)
//                 .then(() => true)
//                 .catch(() => false);

//             if (!isJsonFileExists) {
//                 const missingJsonFilePath = path.join('missingJson.txt');
//                 await fs.promises.appendFile(missingJsonFilePath, `${folder}\n`);
//             }
//         } catch (err) {
//             console.error(`Error checking ${jsonFileName} in ${folder}:`, err);
//         }
//     }
// });