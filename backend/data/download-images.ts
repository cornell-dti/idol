import { bucket } from './firebase';

const fs = require('fs-extra');

const dirPath = 'backend/data/members/images/'
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath); 
}
else {
    fs.emptyDirSync(dirPath);
}

bucket.getFiles().then(results => {
    const files = results[0];
    files.forEach(async file => {
        const fileName = file.name.slice(file.name.indexOf('/') + 1)
        if (fileName.length > 0) {
            const filePath = dirPath + fileName;
            if(fs.existsSync(filePath) === false) fs.ensureFile(filePath); 
            bucket.file(file.name).download({destination:filePath});
        }
    });
}).catch((err) => console.log("Error in getting files: ", err));