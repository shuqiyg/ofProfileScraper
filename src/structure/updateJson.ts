import fs from 'fs';
import path from 'path';

const folderPath = 'storage/test';

fs.readdir(folderPath, async (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            const jsonFilePath = path.join(filePath, '000000001.json');

            try {
                const data = await fs.promises.readFile(jsonFilePath, 'utf8');
                const jsonData = JSON.parse(data);

                // Update jsonData with a new key "membership" and set the value to "none"
                jsonData.membership = "none";
                
                // *****remove "/away?url=" from personalLink ******//
                // if (jsonData.personalLink && jsonData.personalLink !== "") {
                //     jsonData.personalLink = jsonData.personalLink.replace("/away?url=", "");
                // } 

                const updatedData = JSON.stringify(jsonData, null, 2);

                await fs.promises.writeFile(jsonFilePath, updatedData, 'utf8');
                console.log('JSON file updated successfully:', file);
            } catch (err) {
                console.error('Error processing JSON file:', err);
            }
        }
    }
});