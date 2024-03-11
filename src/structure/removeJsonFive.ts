import fs from 'fs';
import path from 'path';

const folderPath = 'storage/datasets';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            const oldFilePath = path.join(filePath, '000000001.json');
            const newFilePath = path.join(filePath, '000000005.json');

            if (fs.existsSync(oldFilePath) && fs.existsSync(newFilePath)) {
                console.log(file)
                const newFileContent = fs.readFileSync(newFilePath, 'utf8');
                fs.writeFileSync(oldFilePath, newFileContent);
                fs.unlinkSync(newFilePath);
            }
        }
    });
});