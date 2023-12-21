import fs from 'fs';

const datasetFolder = "storage/datasets";
const accountsFile = "OnlyFinders.txt";

// Read the folder names under storage/datasets
const datasetFolders = fs.readdirSync(datasetFolder).map(folder => folder.toLowerCase());

console.log(datasetFolders);
// Read the records from ofAccountsFromOnlyFinders.txt
let accounts = fs.readFileSync(accountsFile, 'utf-8').split('\n').map(account => account.toLowerCase()).map(link => link.substring(link.lastIndexOf('/') + 1));;

// Filter out the records that contain a substring of any folder name
const filteredAccounts = accounts.filter(account => {
    return !datasetFolders.some(folder => account.includes(folder));
})

// Remove duplicate records
const uniqueAccounts = Array.from(new Set(filteredAccounts)).map(account => `https://onlyfans.com/${account}`);

// Update the ofAccountsFromOnlyFinders.txt file with the filtered records
fs.writeFileSync(accountsFile, uniqueAccounts.join('\n'));


// **************************
// verify links from ofMasterCleanUp.txt and filteredLinksAfterFirstDisrupt.txt

// combine ofAccoountsFromOnlyFinders.txt, ofMasterCleanUp.txt and filteredLinksAfterFirstDisrupt.txt, filter and cleanup


