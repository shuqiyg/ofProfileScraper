import fs from 'fs';

const directoryPath = 'storage/datasets';
const output = 'noStats.txt';
const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

for (const folder of folders) {
    const folderPath = `${directoryPath}/${folder}`;
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file) => {
            if (file.endsWith('.json')) {
                const filePath = `${folderPath}/${file}`;
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const json = JSON.parse(fileContent);

                if (json.stats && Object.keys(json.stats).length > 0) {
                    console.log("Yes");
                } else {
                    console.log("no")
                    fs.appendFileSync(output, `${folder}\n`);
                }
            }
        })
    });
}
