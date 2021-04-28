// eslint-disable-next-line
const fs = require('fs');
// eslint-disable-next-line
const path = require('path');
// TODO :: documentation
// eslint-disable-next-line
const PROJECTFOLDER = process.cwd();

module.exports = {
    readDirectory(directory, env) {
        if (env === 'local') return fs.readdirSync(path.join(PROJECTFOLDER, directory), 'utf8');
        return fs.readdirSync(directory, 'utf8');
    },

    createDirectory(directory) {
        if (!fs.existsSync(directory)) fs.mkdirSync(path.join(directory), { recursive: true });
    },

    readFile(file, env) {
        if (env === 'local') return fs.readFileSync(path.join(PROJECTFOLDER, file), 'utf8');
        return fs.readFileSync(path.join(__dirname, file), 'utf8');
    },

    createFile(dir, filename, content) {
        fs.writeFileSync(path.join(dir, filename), content);
        console.log('Created: ' + path.join(dir, filename));
    },

    checkForFileOrDirectory(fileOrDirectoryName, message) {
        if (!message) message = '';
        if (!fs.existsSync(fileOrDirectoryName)) {
            console.log('ERROR: Could not find ' + fileOrDirectoryName + '. ' + message);
            return false;
        }
        return true;
    },

    run_shell_command(commmand) {
        exec(commmand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(stdout);
            console.log(stderr);
        });
    },
    checkIfLaravelExists() {
        if (this.checkForFileOrDirectory(path.join('composer.json')))
            composerContent = this.readFile(path.join('composer.json'), 'local');
        if (!JSON.parse(composerContent).require['laravel/framework']) {
            console.log('Could not find Laravel installation.');
            return false;
        }
        return true;
    },
};
