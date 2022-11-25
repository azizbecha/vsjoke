const fs = require("fs");
const path = require("path");

export const readSettings = () => {
    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
    return {
        language: content.language,
        blacklistedFlags: content.blacklistedFlags
    };
};