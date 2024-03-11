import fs from 'fs';
import path from 'path';

const datasetsFolderPath = 'storage/datasets';
const jsonFileName = '000000001.json';
const txtFileName = 'slToRefetch.txt';
// const parentFolderPath = path.resolve(__dirname, '..');
const txtFilePath = path.join(txtFileName);

fs.readdir(datasetsFolderPath, (err, folders) => {
    if (err) {
        console.error('Error reading datasets folder:', err);
        return;
    }

    folders.forEach((folder) => {
        const folderPath = path.join(datasetsFolderPath, folder);
        const jsonFilePath = path.join(folderPath, jsonFileName);

        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading ${jsonFileName} in ${folder}:`, err);
                return;
            }

            try {
                const json = JSON.parse(data);
                const socialLinks = json.socialLinks;

                if (socialLinks && socialLinks.length > 0) {
                    fs.appendFile(txtFilePath, `${folder}\n`, (err) => {
                        if (err) {
                            console.error(`Error appending ${folder} to ${txtFileName}:`, err);
                        }
                    });
                }
            } catch (err) {
                console.error(`Error parsing ${jsonFileName} in ${folder}:`, err);
            }
        });
    });
});