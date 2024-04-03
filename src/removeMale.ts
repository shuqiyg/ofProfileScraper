import fs from 'fs';
import path from 'path';

function removeFolderRecursively(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
        return;
    }

    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const isDirectory = fs.lstatSync(filePath).isDirectory();

        if (isDirectory) {
            if (file.includes('boy')) {
                removeFolderRecursively(filePath);
            }
        } else {
            fs.unlinkSync(filePath);
        }
    });

    fs.rmdirSync(folderPath);
}

const rootFolderPath = 'storage/datasets';

if (fs.existsSync(rootFolderPath)) {
    const folders = fs.readdirSync(rootFolderPath);

    folders.forEach((folder) => {
        const folderPath = path.join(rootFolderPath, folder);
        const isDirectory = fs.lstatSync(folderPath).isDirectory();

        if (isDirectory && folder.includes('boy')) {
            console.log(folderPath);
            removeFolderRecursively(folderPath);
        }
    });
}