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
            if (file.includes('tom')) {
                removeFolderRecursively(filePath);
            }
        } else {
            fs.unlinkSync(filePath);
        }
    });

    fs.rmdirSync(folderPath);
}

const rootFolderPath = 'D:/Fandorra Backup/OF_PROFILES_DATASETS_BK';

if (fs.existsSync(rootFolderPath)) {
    const folders = fs.readdirSync(rootFolderPath);

    folders.forEach((folder) => {
        const folderPath = path.join(rootFolderPath, folder);
        const isDirectory = fs.lstatSync(folderPath).isDirectory();

        if (isDirectory && folder.includes('tom')) {
            removeFolderRecursively(folderPath);
        }
    });
}