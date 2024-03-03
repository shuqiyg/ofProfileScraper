import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

//credentials
cloudinary.config({ 
  cloud_name: 'dzsgjlkys', 
  api_key: "444663132235843", 
  api_secret: '6Mxm3z1tnRAb_dTwStEK8Bqxc4E'
});

// const image = "storage/datasets/zoe_wallace/zoe_wallace_profilePicZoom.jpg"
// const result = await cloudinary.uploader.upload(image, { folder: `fandora/zoe_walace`,public_id: 'test' });
// console.log(result);

const rootFolder = "storage/test";
const subFolders = fs.readdirSync(rootFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const subFolder of subFolders) {
    const folderPath = path.join(rootFolder, subFolder);
    const files = fs.readdirSync(folderPath)
        .filter(file => file.endsWith(".jpg"));

    for (const file of files) {
        const imagePath = path.join(folderPath, file);
        const publicId = file.replace(".jpg", "");
        const result = await cloudinary.uploader.upload(imagePath, { folder: `fandora/${subFolder}`, public_id: publicId });
        console.log(result);
    }
}