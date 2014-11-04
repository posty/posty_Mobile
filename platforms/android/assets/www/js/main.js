/*global requirejs, document, cordova, window, navigator, console */
requirejs.config({
    paths: {
        angular: '../components/angular/angular',
        angularAnimate: '../components/angular-animate/angular-animate',
        angularSanitize: '../components/angular-sanitize/angular-sanitize',
        uiRouter: '../components/angular-ui-router/release/angular-ui-router',
        ionic: '../components/ionic/release/js/ionic',
        ionicAngular: '../components/ionic/release/js/ionic-angular',
        text: '../components/requirejs-text/text',
        underscore: '../components/underscore/underscore',
        restangular: '../components/restangular/src/restangular',
        toaster: '../components/AngularJS-Toaster/toaster',
        d3: '../components/d3/d3',
        postyWebModel: '../components/posty-web-model/posty-web-model'
    },
    shim: {
        angular: {exports: 'angular'},
        angularAnimate: {deps: ['angular']},
        angularSanitize: {deps: ['angular']},
        uiRouter: {deps: ['angular']},
        ionic: {deps: ['angular'], exports: 'ionic'},
        ionicAngular: {deps: ['angular', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize']},
        restangular: { deps: ['underscore', 'angular']},
        toaster: { deps: ['angular', 'angularAnimate']},        
        postyWebModel: { deps: ['angular','restangular'] }
    },
    priority: [
        'angular',
        'ionic'
    ],
    deps: [
        'bootstrap'
    ]
});