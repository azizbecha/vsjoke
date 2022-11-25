const fs = require("fs");
const path = require("path");

export const updateSettings = (lang: string) => {
    let content = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    content.language = lang;
    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(content, null, 2)); 
};