const fs = require('fs');
const path = require('path');
// TODO :: documentation
const PROJECTFOLDER = process.cwd();

module.exports = {
    readDirectory(directory, env) {
        if (env === 'local') return fs.readdirSync(path.join(PROJECTFOLDER, directory), 'utf8');
        return fs.readdirSync(directory, 'utf8');
    },

    createDirectory(directory) {
        if (!fs.existsSync(directory)) fs.mkdirSync(path.join(directory), {recursive: true});
    },

    readFile(file, env) {
        if (env === 'local') return fs.readFileSync(path.join(PROJECTFOLDER, file), 'utf8');
        return fs.readFileSync(path.join(__dirname, file), 'utf8');
    },

    createFile(dir, filename, content) {
        fs.writeFileSync(path.join(dir, filename), content);
        console.log('Created: ' + path.join(dir, filename));
    },
};
