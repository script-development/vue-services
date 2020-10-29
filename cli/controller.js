const fs = require('fs');
const helpers = require('./helpers');
const {exec} = require('child_process');
const path = require('path');
// TODO :: documentation

module.exports = {
    controller(argument, parameter) {
        let newControllerDirectory = path.join('resources', 'js', 'controllers', argument, '/');
        let controllerFile = argument + 'Controller.js';

        if (fs.existsSync(newControllerDirectory)) {
            console.log('Controller allready exists');
        }

        helpers.createDirectory(newControllerDirectory);
        helpers.createFile(newControllerDirectory, controllerFile, this.readDefaultControllerFile(argument));

        const capitalizedArgument = argument.charAt(0).toUpperCase() + argument.slice(1);

        if (parameter === '--laravel')
            this.run_shell_command(
                'php artisan make:model ' + capitalizedArgument + ' --migration --controller --resource'
            );

        console.log('Created ' + argument + ' controller succesfully');
        this.updateControllerIndex();
        this.updateApiFile(capitalizedArgument);
    },

    updateControllerIndex() {
        const controllerDirectories = helpers
            .readDirectory(path.join('resources', 'js', 'controllers'))
            .filter(directories => {
                return directories != 'index.js';
            });

        let typeDefExampleControllers = "* @property {import('./example').ExampleController} exampleController";

        let typeDefControllers = [];
        let exportControllers = [];

        for (const controllerDirectory of controllerDirectories) {
            let replaceFillins = {
                example: controllerDirectory,
                ExampleController:
                    controllerDirectory.charAt(0).toUpperCase() + controllerDirectory.slice(1) + 'Controller',
                exampleController: controllerDirectory + 'Controller',
            };

            typeDefControllers.push(
                typeDefExampleControllers.replace(/example|ExampleController|exampleController/g, function (matched) {
                    return replaceFillins[matched];
                })
            );

            exportControllers.push(replaceFillins.exampleController);
        }

        let controllerIndexData = helpers.readFile(path.join('files', 'controllers', 'index.js'));

        const replaceControllerData = {
            IMPORTTYPEDEFHERE: typeDefControllers.join('\n '),
            IMPORTEXPORTCONTROLLERSHERE: exportControllers,
        };

        controllerIndexData = controllerIndexData.replace(/IMPORTTYPEDEFHERE|IMPORTEXPORTCONTROLLERSHERE/g, function (
            matched
        ) {
            return replaceControllerData[matched];
        });

        const newIndexControllerDirectory = path.join('resources', 'js', 'controllers');
        const newControllerIndexFile = 'index.js';
        helpers.createFile(newIndexControllerDirectory, newControllerIndexFile, controllerIndexData);
    },

    updateApiFile(routeName) {
        console.log('Updating API route file...');
        const apiFile = fs.openSync(path.join('routes', 'api.php'), 'a');

        const routeInfo = `
        \rRoute::group(['prefix' => '${routeName.toLowerCase()}'], static function () {
            \rRoute::get('', '${routeName}Controller@index');
            \rRoute::post('', '${routeName}Controller@store');
            \rRoute::delete('/{${routeName.toLowerCase()}}', '${routeName}Controller@destroy');
            \rRoute::get('/{${routeName.toLowerCase()}}', '${routeName}Controller@show');
            \rRoute::post('/{${routeName.toLowerCase()}}', '${routeName}Controller@update');
        \r});`;

        fs.appendFileSync(apiFile, routeInfo, {flag: 'a'});

        fs.closeSync(apiFile);

        console.log('Updated API routes succesfully');
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

    readDefaultControllerFile(argument) {
        const replaceFillins = {
            FILL_INController: argument.charAt(0).toUpperCase() + argument.slice(1) + 'Controller',
            FILL_IN: argument,
        };

        return fs
            .readFileSync(path.join(__dirname, 'files', 'controllers', 'default.js'), 'utf8')
            .replace(/FILL_INController|FILL_IN/g, function (matched) {
                return replaceFillins[matched];
            });
    },
};
