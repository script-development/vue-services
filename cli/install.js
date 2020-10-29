const helpers = require('./helpers');
const path = require('path');

// TODO :: make paths absolute, are they relative to this or to project folder?
// TODO :: documentation

const mainDirectory = path.join('resources', 'js');

module.exports = {
    createControllerIndexFile() {
        const controllerDirectory = path.join('resources', 'js', 'controllers');
        const controllerIndexFile = 'index.js';
        helpers.createDirectory(controllerDirectory);
        helpers.createFile(
            controllerDirectory,
            controllerIndexFile,
            helpers.readFile(path.join('files', 'controllers', controllerIndexFile))
        );
    },

    createMainFile() {
        const mainFile = 'main.js';
        helpers.createDirectory(mainDirectory);
        helpers.createFile(mainDirectory, mainFile, helpers.readFile(path.join('files', mainFile)));
    },

    createAppFile() {
        const appFile = 'App.vue';
        helpers.createFile(mainDirectory, appFile, helpers.readFile(path.join('files', appFile)));
    },

    createAuthFiles() {
        const authDirectory = path.join('resources', 'js', 'pages', 'auth');
        const loginFile = 'Login.vue';
        const forgotPasswordFile = 'ForgotPassword.vue';
        const resetPasswordFile = 'ResetPassword.vue';

        helpers.createDirectory(authDirectory);
        helpers.createFile(authDirectory, loginFile, helpers.readFile(path.join('files', 'pages', 'auth', loginFile)));
        helpers.createFile(
            authDirectory,
            forgotPasswordFile,
            helpers.readFile(path.join('files', 'pages', 'auth', forgotPasswordFile))
        );
        helpers.createFile(
            authDirectory,
            resetPasswordFile,
            helpers.readFile(path.join('files', 'pages', 'auth', resetPasswordFile))
        );
    },

    createStaticDataFile() {
        const staticDataDirectory = path.join('resources', 'js', 'constants/');
        const staticDataFile = 'staticdata.js';
        helpers.createDirectory(staticDataDirectory);
        helpers.createFile(
            staticDataDirectory,
            staticDataFile,
            helpers.readFile(path.join('files', 'constants', staticDataFile))
        );
    },
};
