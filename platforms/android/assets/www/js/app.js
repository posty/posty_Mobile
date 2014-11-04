define(['angular',
        'uiRouter',
        'config',
        'filters/filters',
        'services/services',
        'directives/directives',
        'controllers/controllers',
        'ionicAngular',
        'restangular',
        'toaster',
        'postyWebModel'],

    function (angular, uiRouter) {
        'use strict';

        var app = angular.module('app', [
            'ionic',
            'app.controllers',
            'app.filters',
            'app.services',
            'app.directives',
            'app.config',
            'ui.router',
            'restangular',
            'toaster',
            'postySoft.models']);

        return app;

    });