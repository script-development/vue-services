/**
 * Add controllers here for auto complete to work
 *
 * @typedef Controllers
 * @type {Object}
 IMPORTTYPEDEFHERE
 */

import * as services from '@script-development/vue-services';

// first require only the real controllers indexes files
const requireContext = require.context('./', true, /\.\/(?!base)(.*)\/\index.js$/);

/**
 * check which services the class wants
 *
 * @param {String} controllerClass
 */
const getServicesToInject = controllerClass => {
    controllerClass = controllerClass.toString();
    return Object.keys(services)
        .filter(service => controllerClass.indexOf(service) !== -1)
        .map(service => services[service]);
};

/**
 * @type {Controllers}
 */
const controllers = requireContext.keys().reduce((controllers, filename) => {
    // TODO :: this is very strict. Controller class names need to be UpperCamelCase
    // create the controller name and get the controller class name
    const controllerName = filename.split('/')[1] + 'Controller';
    const controllerClassName = controllerName[0].toUpperCase() + controllerName.substring(1);
    // require the class
    const controllerClass = requireContext(filename)[controllerClassName];

    // create and init the class
    controllers[controllerName] = new controllerClass(...getServicesToInject(controllerClass));
    return controllers;
}, {});

// Add controller name here for exporting
// export the instanced controllers here
export const {IMPORTEXPORTCONTROLLERSHERE} = controllers;
