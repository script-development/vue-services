/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
    comment:
        'This config was generated using a preset. Please see the handbook for more information: https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/vuejs.md#vuejs',
    mutate: ['src/**/*.js'],
    testRunner: 'mocha',
    mochaOptions: {
        // Optional mocha options
        spec: ['test/**/*.js'],
        ui: 'bdd',
        timeout: 3000,
        require: ['@babel/register'],
        'async-only': false,
    },
    reporters: ['progress', 'clear-text', 'html'],
    coverageAnalysis: 'off',
};
