#! /usr/bin/env node

const install = require('./install');
const helpers = require('./helpers');
const fs = require('fs');
const {exec} = require('child_process');

const command = process.argv[2];
const argument = process.argv[3];
const paramenter = process.argv[4];

switch (command) {
    case 'test':
        // console.log(helpers.readDirectory('\\app\\', 'local'));

        break;
    case 'install':
        install.createControllerIndexFile();
        install.createMainFile();
        install.createAppFile();
        install.createStaticDataFile();
        install.createAuthFiles();
        console.log('Installed succesfully');
        break;
    case 'make:controller':
        let newControllerDirectory = './resources/js/controllers/' + argument + '/';
        let controllerFile = argument + 'Controller.js';

        if (fs.existsSync(newControllerDirectory)) {
            console.log('Controller allready exists');
            break;
        }

        helpers.createDirectory(newControllerDirectory);
        helpers.createFile(newControllerDirectory, controllerFile, readDefaultControllerFile(argument));

        const capitalizedArgument = argument.charAt(0).toUpperCase() + argument.slice(1);

        updateControllerIndex();

        if (paramenter === '--laravel')
            run_shell_command('php artisan make:model ' + capitalizedArgument + ' --migration --controller --resource');

        console.log('Created ' + argument + ' controller succesfully');

        updateApiFile(capitalizedArgument);

        break;

    default:
        console.log('moi');

        break;
}

// TODO :: move to other file
// TODO :: documentation
function updateApiFile(routeName) {
    const apiFile = fs.openSync('./routes/api.php', 'a');

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
}

function run_shell_command(commmand) {
    exec(commmand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
}

function updateControllerIndex() {
    const controllerDirectories = helpers.readDirectory('./resources/js/controllers/').slice(0, -1);
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

    let controllerIndexData = helpers.readFile('\\files\\controllers\\index.js');

    const replaceControllerData = {
        IMPORTTYPEDEFHERE: typeDefControllers.join('\n '),
        IMPORTEXPORTCONTROLLERSHERE: exportControllers,
    };

    controllerIndexData = controllerIndexData.replace(/IMPORTTYPEDEFHERE|IMPORTEXPORTCONTROLLERSHERE/g, function (
        matched
    ) {
        return replaceControllerData[matched];
    });

    const newIndexControllerDirectory = './resources/js/controllers/';
    const newControllerIndexFile = 'index.js';
    helpers.createFile(newIndexControllerDirectory, newControllerIndexFile, controllerIndexData);
}

function readDefaultControllerFile(argument) {
    const replaceFillins = {
        FILL_INController: argument.charAt(0).toUpperCase() + argument.slice(1) + 'Controller',
        FILL_IN: argument,
    };

    return fs
        .readFileSync(__dirname + '\\files\\controllers\\default.js', 'utf8')
        .replace(/FILL_INController|FILL_IN/g, function (matched) {
            return replaceFillins[matched];
        });
}
