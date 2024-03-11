import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'storage/datasets';

const folders = fs.readdirSync(directoryPath);
folders.forEach((folder) => {
    const folderPath = path.join(directoryPath, folder);

    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
        if (file.endsWith('.jpg')) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            const fileSizeInBytes = stats.size;

            // if (fileSizeInBytes > 20000) {
                // Resize the image to under 20KB and transform it to webp format
                const resizedFilePath = filePath.replace('.jpg', '.webp');

                sharp(filePath)
                    .webp({ quality: 35, force: true })
                    .toBuffer((err, data) => {
                        if (err) {
                            console.error('Error resizing image:', err);
                        } else {
                            // const resizedFileSizeInBytes = data.length;
                            // fs.unlinkSync(filePath);
                            fs.writeFileSync(resizedFilePath, data);
                            console.log(`Resized ${file} to under 20KB and transformed to webp format`);

                        }
                    });
            // }
        }
    });
});
