import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { appendFileSync } from 'fs';

//credentials
cloudinary.config({ 
  cloud_name: 'dzsgjlkys', 
  api_key: "444663132235843", 
  api_secret: '6Mxm3z1tnRAb_dTwStEK8Bqxc4E'
});

// const image = "storage/datasets/zoe_wallace/zoe_wallace_profilePicZoom.jpg"
// const result = await cloudinary.uploader.upload(image, { folder: `fandora/zoe_walace`,public_id: 'test' });
// console.log(result);

const rootFolder = "D:/Fandorra Backup/20240313";
const records = fs.readFileSync("over25K_20240313.txt", "utf-8").split("\n");
const subFolders = fs.readdirSync(rootFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && records.includes(dirent.name))
    .map(dirent => dirent.name);

for (const subFolder of subFolders) {
    const folderPath = path.join(rootFolder, subFolder);
    const files = fs.readdirSync(folderPath)
        .filter(file => file.endsWith(".webp"));

    for (const file of files) {
        const imagePath = path.join(folderPath, file);
        const publicId = file.replace(".webp", "");
        const result = await cloudinary.uploader.upload(imagePath, { folder: `fandora/${subFolder}`, public_id: publicId });
        console.log(result);

        if(file.includes('banner')){
            const imageUrl = JSON.stringify({ banner_public_id: result.public_id.split('/')[1], 
            bannerCDN: result.secure_url });
            appendFileSync("cloudinary_img_urls_20240313.txt", imageUrl + '\n');
        }else{
            const imageUrl = JSON.stringify({ avatar_public_id: result.public_id.split('/')[1], avatarCDN: result.secure_url });
            appendFileSync("cloudinary_img_urls_20240313.txt", imageUrl + '\n');
        }

    }
}