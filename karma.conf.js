// Karma configuration
// Generated on Mon Nov 14 2016 22:41:49 GMT+0200 (CAT)

module.exports = function (config) {
    "use strict";

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'src/lib/jquery/dist/jquery.js',
            'src/lib/angular/angular.js',
            'src/lib/angular-component-router/angular_1_router.js',
            'src/lib/angular-resource/angular-resource.js',
            'src/lib/bootstrap/dist/js/bootstrap.js',
            'src/lib/moment/moment.js',
            'src/lib/angular-mocks/angular-mocks.js',

            'src/lib/datatables.net/js/jquery.dataTables.js',
            'src/lib/angular-datatables/dist/angular-datatables.js',
            'src/lib/datatables.net-bs/js/dataTables.bootstrap.js',

            'src/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/lib/angular-sanitize/angular-sanitize.js',
            'src/lib/angular-translate/angular-translate.js',
            'src/lib/angular-dialog-service/dist/dialogs.js',
            'src/lib/angular-dialog-service/dist/dialogs-default-translations.js',

            'src/lib/angular-cache-buster/angular-cache-buster.js',
            'src/lib/angular-cookies/angular-cookies.js',
            'src/lib/ngstorage/ngStorage.js',

            'src/lib/chart.js/dist/Chart.js',

            'src/js/app.js',
            'test/spec/**/*.spec.js',

            { pattern: 'test/assets/**/*.json', watched: true, served: true, included: false }

        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/js/app.js': ['coverage'],
            '**/*.ts': ['typescript']
        },

        // coverage report settings
        coverageReporter: {
            includeAllSources: true,
            reporters: [{
                type: 'html',
                dir: 'test/coverage',
                subdir: '.'
            }, {
                type: 'text'
            }]
        },

        typescriptPreprocessor: {
            tsconfigPath: './tsconfig.json', // *obligatory 
            // options passed to the typescript compiler 
            // options: {
            //    sourceMap: false, // (optional) Generates corresponding .map file. 
            //    target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5' 
            //    module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd' 
            //    noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type. 
            //    noResolve: true, // (optional) Skip resolution and preprocessing. 
            //    removeComments: true, // (optional) Do not emit comments to output. 
            //    concatenateOutput: false // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false. 
            //},

            // extra typing definitions to pass to the compiler (globs allowed) 
            typings: [
                'typings/tsd.d.ts'
            ],

            // transforming the filenames 
            transformPath: function (path) {
                return path.replace(/\.ts$/, '.js');
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};