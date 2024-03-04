import fs from 'fs';
import path from 'path';
const baseFolderPath = 'storage/datasets';
let counts = 0;
fs.readdirSync(baseFolderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => {
        const folderPath = path.join(baseFolderPath, dirent.name);
        fs.readdirSync(folderPath)
            .filter((fileName) => fileName.endsWith('.json'))
            .forEach((fileName) => {
                const filePath = path.join(folderPath, fileName);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const json = JSON.parse(fileContent);
                delete json.followers;
                delete json.profileHtml;
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
                console.log(++counts);
            });
    });


// ********** remove folder has no json
// fs.readdirSync(baseFolderPath, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .forEach((dirent) => {
//         const folderPath = path.join(baseFolderPath, dirent.name);
//         const jsonFiles = fs.readdirSync(folderPath)
//             .filter((fileName) => fileName.endsWith('.json'));

//         if (jsonFiles.length === 0) {
//             console.log(folderPath);
//             fs.rmdirSync(folderPath, { recursive: true });
//         }
//     });


// ********** extract url from folders that have 1 or less image
// fs.readdirSync(baseFolderPath, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .forEach((dirent) => {
//         const folderPath = path.join(baseFolderPath, dirent.name);
//         const jpegFiles = fs.readdirSync(folderPath)
//             .filter((fileName) => fileName.endsWith('.jpg'));

//         if (jpegFiles.length === 0 || jpegFiles.length === 1) {
//             console.log(folderPath);
//             // fs.rmdirSync(folderPath, { recursive: true })
//         }
//     });



// *********** remove json files that are not 000000001.json
// fs.readdirSync(baseFolderPath, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .forEach((dirent) => {
//         const folderPath = path.join(baseFolderPath, dirent.name);
//         fs.readdirSync(folderPath)
//             .filter((fileName) => fileName.endsWith('.json') && fileName !== '000000001.json')
//             .forEach((fileName) => {
//                 const filePath = path.join(folderPath, fileName);
//                 fs.unlinkSync(filePath);
//             });
//     });

