import fs from 'fs';
import path from 'path';

const directoryPath = 'storage/datasets';

fs.readdir(directoryPath, (err, folders) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    folders.forEach((folder) => {
        const folderPath = path.join(directoryPath, folder);

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error('Error reading folder:', err);
                return;
            }

            files.forEach((file) => {
                if (file.toLowerCase().endsWith('.jpg')) {
                    const filePath = path.join(folderPath, file);

                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error removing file:', err);
                        } else {
                            console.log('File removed:', filePath);
                        }
                    });
                }
            });
        });
    });
});


