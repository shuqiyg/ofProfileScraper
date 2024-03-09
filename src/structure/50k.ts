import fs from 'fs';
import path from 'path';

const folderPath = 'storage/datasets';

fs.readdir(folderPath, (err, folders) => {
    if (err) {
        console.error('Error reading folders:', err);
        return;
    }

    folders.forEach((folder) => {
        const folderFullPath = path.join(folderPath, folder);

        fs.readdir(folderFullPath, (err, files) => {
            if (err) {
                console.error(`Error reading files in folder ${folder}:`, err);
                return;
            }

            const allJpgFilesAre50KB = files.filter((file) => path.extname(file) === '.jpg').map((file) => {
                const fileFullPath = path.join(folderFullPath, file);
                const stats = fs.statSync(fileFullPath);
                // console.log(`File: ${file}, Size: ${stats.size}`);
                return stats.size === 51280;
            }).every((size) => size);

            if (allJpgFilesAre50KB) {
                console.log(folder)
                fs.rmdir(folderFullPath, { recursive: true }, (err) => {
                    if (err) {
                        console.error(`Error removing folder ${folder}:`, err);
                    } else {
                        console.log(`Folder ${folder} removed successfully.`);
                    }
                });
            }
        });
    });
});