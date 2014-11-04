/*global define */

define(['angular', 'text!../settings.json'], function (angular, settings) {
    'use strict';

    var config = angular.module('app.config', ['app.services']);

    /* Parsing the settings.json to load the settings */
    var SETTINGS = JSON.parse(settings);

    /**
     * Version Constant
     */
    config.constant('VERSION', '0.1');
    
    /**
    * Global constants for the Application
    */
    config.constant('CONFIGS', {
        DATE_FORMAT: 'dd.MM.yyyy',
        API_DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss'
    });    

    /**
     * Run-Configuration of the Apllication-Settings
     */
    config.run(['Restangular', 'ProcessService', 'ResponseHandler', 'Servers', 'APIStorageService', function (Restangular, ProcessService, ResponseHandler, Servers, APIStorageService) {

        /* Setting configurations before a request is send */
        Restangular.addRequestInterceptor(
            function (elem, operation, what, url) {
                ProcessService.register();
                return elem;
            }
        );

        /* Setting configurations after a response was received */
        Restangular.addResponseInterceptor(
            function (data, operation, what, url, response, deferred) {
                ResponseHandler.add(response);
                ProcessService.unregister();
                return data;
            }
        );

        /* Setting configurations after an error was received */
        Restangular.setErrorInterceptor(
            function (response) {
                ResponseHandler.add(response);
                ProcessService.unregister();
                return true;
            }
        );

        /* Loading the API-Servers */
        APIStorageService.load();      

    }]);

    return config;
});