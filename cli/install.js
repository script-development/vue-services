const helpers = require('./helpers');
module.exports = {
    createControllerIndexFile() {
        const controllerDirectory = './resources/js/controllers/';
        const controllerIndexFile = 'index.js';
        helpers.createDirectory(controllerDirectory);
        helpers.createFile(
            controllerDirectory,
            controllerIndexFile,
            helpers.readFile('\\files\\controllers\\index.js')
        );
    },

    createMainFile() {
        const mainDirectory = './resources/js/';
        const mainFile = 'main.js';
        helpers.createDirectory(mainDirectory);
        helpers.createFile(mainDirectory, mainFile, helpers.readFile('\\files\\main.js'));
    },

    createAppFile() {
        const mainDirectory = './resources/js/';
        const appFile = 'App.vue';
        helpers.createFile(mainDirectory, appFile, helpers.readFile('\\files\\App.vue'));
    },

    createAuthFiles() {
        const authDirectory = './resources/js/pages/auth/';
        const loginFile = 'Login.vue';
        const forgotPasswordFile = 'ForgotPassword.vue';
        const resetPasswordFile = 'ResetPassword.vue';

        helpers.createDirectory(authDirectory);
        helpers.createFile(authDirectory, loginFile, helpers.readFile('\\files\\pages\\auth\\Login.vue'));
        helpers.createFile(
            authDirectory,
            forgotPasswordFile,
            helpers.readFile('\\files\\pages\\auth\\ForgotPassword.vue')
        );
        helpers.createFile(
            authDirectory,
            resetPasswordFile,
            helpers.readFile('\\files\\pages\\auth\\ResetPassword.vue')
        );
    },

    createStaticDataFile() {
        const staticDataDirectory = './resources/js/constants/';
        const staticDataFile = 'staticdata.js';
        helpers.createDirectory(staticDataDirectory);
        helpers.createFile(staticDataDirectory, staticDataFile, helpers.readFile('\\files\\constants\\staticdata.js'));
    },
};
