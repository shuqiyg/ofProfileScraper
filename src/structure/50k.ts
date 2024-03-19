import fs from 'fs';
import path from 'path';

const folderPath = 'storage/datasets';
const files = fs.readdirSync(folderPath);

files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
        const jsonFilePath = path.join(filePath, '000000001.json');

        try {
            fs.accessSync(jsonFilePath, fs.constants.F_OK);
            console.log(`********File ${jsonFilePath} exists.`);

            const data = fs.readFileSync(jsonFilePath, 'utf8');
            const json = JSON.parse(data);
            json.active = 'y';

            fs.writeFileSync(jsonFilePath, JSON.stringify(json), 'utf8');
            console.log(`Added "active" key to ${jsonFilePath}`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`File ${jsonFilePath} does not exist.`);
            } else {
                console.error('Error accessing file:', err);
            }
        }
    }
});
