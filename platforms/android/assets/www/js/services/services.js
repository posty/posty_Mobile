/*global define */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        config = require('config'),
        services = angular.module('app.services', ['app.config']);

    services.factory('APIService', require('services/api/APIService'));
    /* 
        Possible Storage Services:
        - APISessionStorageService: loading Servers from localStorage
        - APIJSONStorageService: loading Servers from settings.json
        - APIJSONAndSessionStorageService: loading Servers from settings.json and localStorage
    */
    services.factory('APIStorageService', require('services/api/APIJSONAndSessionStorageService'));

    services.factory('PetService', require('services/PetService'));
    services.factory('ProcessService', require('services/ProcessService'));
    services.factory('ResponseHandler', require('services/ResponseHandler'));
    services.factory('HeaderBarService', require('services/HeaderBarService'));    
    services.factory('FooterBarService', require('services/FooterBarService'));    


    services.factory('StorageService', require('services/StorageService'));

    services.factory('SelectDomainModalService', require('services/SelectDomainModalService'));

    return services;
});