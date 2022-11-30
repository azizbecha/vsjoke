const fs = require("fs");
const path = require("path");

export function updateSettings(lang: string, flags: string[], timing: string) {
    let content = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

    content.language = lang;
    content.blacklistedFlags = flags;
    content.timing = timing;

    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(content, null, 2));
}