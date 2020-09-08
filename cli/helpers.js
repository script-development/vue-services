const fs = require('fs');
// TODO :: documentation

module.exports = {
    readDirectory(directory, env) {
        if (env === 'local') return fs.readdirSync(process.cwd() + directory, 'utf8');
        return fs.readdirSync(directory, 'utf8');
    },

    createDirectory(directory) {
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true});
    },

    readFile(file, env) {
        if (env === 'local') return fs.readFileSync(process.cwd() + file, 'utf8');
        return fs.readFileSync(__dirname + file, 'utf8');
    },

    createFile(dir, filename, content) {
        fs.writeFileSync(dir + filename, content);
        console.log('Created: ' + dir + filename);
    },
};
