import fs from 'fs';
import path from 'path';
import { json } from 'stream/consumers';

const folderPath = 'storage/test';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return;
            }
            if (stats.isDirectory()) {
                const jsonFilePath = path.join(filePath, '000000001.json');

                fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading JSON file:', err);
                        return;
                    }
                    try {
                        const jsonData = JSON.parse(data);

                        if (jsonData.personalLink && jsonData.personalLink !== "") {
                            jsonData.personalLink = jsonData.personalLink.replace("/away?url=", "");
                        }else{
                            if(jsonData.links && jsonData.links !== ""){
                            jsonData.personalLink = jsonData.links;
                            jsonData.personalLink = jsonData.personalLink.replace("/away?url=", "");
                            }else{
                                jsonData.personalLink = "";
                            }
                        }
                        if(!jsonData.socialLinks){
                            jsonData.socialLinks = [];
                        }
                        jsonData.otherImages = []; // Add the "otherImages" attribute
                        jsonData.avatarCDNUrl = "";
                        jsonData.bannerCDNUrl = "";
                        delete jsonData.links;
                        const updatedData = JSON.stringify(jsonData, null, 2);

                        
                        fs.writeFile(jsonFilePath, updatedData, 'utf8', (err) => {
                            if (err) {
                                console.error('Error updating JSON file:', err);
                                return;
                            }
                            console.log('JSON file updated successfully:', file);
                        });
                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                    }
                });
            }
        });
    });
});