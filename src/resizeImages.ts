import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'storage/test';

const folders = fs.readdirSync(directoryPath);
folders.forEach((folder) => {
    const folderPath = path.join(directoryPath, folder);

    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
        if (file.endsWith('.jpg')) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            const fileSizeInKB = stats.size;
            console.log(fileSizeInKB)
            const fileSizeInBytes = fileSizeInKB/ 1024;
        
            if (fileSizeInKB > 200000) {
                // Resize the image to 100KB
                const resizedFilePath = filePath.replace('.jpg', '_resized.jpg');

                sharp(filePath)
                    .jpeg({ quality: 30 })
                    .toFile(resizedFilePath, (err) => {
                        if (err) {
                            console.error('Error resizing image:', err);
                        } else {
                            console.log(`Resized ${file} to 100KB`);

                            // Rename the resized file back to the original filePath
                            fs.rename(resizedFilePath, filePath, (err) => {
                                if (err) {
                                    console.error('Error renaming file:', err);
                                } else {
                                    console.log(`Renamed ${resizedFilePath} to ${filePath}`);
                                }
                            });
                        }
                    });      
            }
        }
    });
});

// fs.readdir(directoryPath, (err, folders) => {
//     if (err) {
//         console.error('Error reading directory:', err);
//         return;
//     }

//     folders.forEach((folder) => {
//         const folderPath = path.join(directoryPath, folder);

//         fs.readdir(folderPath, (err, files) => {
//             if (err) {
//                 console.error('Error reading folder:', err);
//                 return;
//             }

//             files.forEach((file) => {
//                 if (file.endsWith('.jpg')) {
//                     const oldFilePath = path.join(folderPath, file);
//                     const newFileName = `${folder}_${file}`;
//                     const newFilePath = path.join(folderPath, newFileName);

//                     fs.rename(oldFilePath, newFilePath, (err) => {
//                         if (err) {
//                             console.error('Error renaming file:', err);
//                         } else {
//                             console.log(`Renamed ${file} to ${newFileName}`);
//                         }
//                     });
//                 }
//             });
//         });
//     });
// });