/*global define, require */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        config = require('config'),
        controllers = angular.module('app.controllers', ['app.services', 'app.config']);


    controllers.controller('HeaderBarCtrl', require('controllers/HeaderBarCtrl'));
    controllers.controller('FooterBarCtrl', require('controllers/FooterBarCtrl'));


    controllers.controller('MainCtrl', require('controllers/MainCtrl'));
    controllers.controller('NotificationCtrl', require('controllers/NotificationCtrl'));
    controllers.controller('HomeCtrl', require('controllers/HomeCtrl'));
    
    controllers.controller('AboutCtrl', require('controllers/AboutCtrl'));
    controllers.controller('LoginCtrl', require('controllers/LoginCtrl'));
    controllers.controller('PetIndexCtrl', require('controllers/PetIndexCtrl'));
    controllers.controller('PetDetailCtrl', require('controllers/PetDetailCtrl'));

    /**
    * Api-Controller
    */ 
    controllers.controller('ChangeAPICtrl', require('controllers/api/ChangeAPICtrl'));
    controllers.controller('ApiIndexCtrl', require('controllers/api/ApiIndexCtrl'));
    controllers.controller('ApiNewCtrl', require('controllers/api/ApiNewCtrl'));    

    /**
    * Domain-Controller
    */
    controllers.controller('DomainIndexCtrl', require('controllers/domain/DomainIndexCtrl'));
    controllers.controller('DomainNewCtrl', require('controllers/domain/DomainNewCtrl'));
    controllers.controller('DomainDetailCtrl', require('controllers/domain/DomainDetailCtrl'));

    /**
    * User-Controller
    */ 
    controllers.controller('UserIndexCtrl', require('controllers/user/UserIndexCtrl'));
    controllers.controller('UserNewCtrl', require('controllers/user/UserNewCtrl'));
    controllers.controller('UserDetailCtrl', require('controllers/user/UserDetailCtrl'));    

    /**
    * Tranpsort-Controller
    */ 
    controllers.controller('TransportIndexCtrl', require('controllers/transport/TransportIndexCtrl'));
    controllers.controller('TransportNewCtrl', require('controllers/transport/TransportNewCtrl'));
    controllers.controller('TransportDetailCtrl', require('controllers/transport/TransportDetailCtrl'));       

    /**
    * ApiKey-Controller
    */ 
    controllers.controller('ApiKeyIndexCtrl', require('controllers/apikey/ApiKeyIndexCtrl'));
    controllers.controller('ApiKeyNewCtrl', require('controllers/apikey/ApiKeyNewCtrl'));
    controllers.controller('ApiKeyDetailCtrl', require('controllers/apikey/ApiKeyDetailCtrl'));      


    /**
    * Summary-Controller
    */
    controllers.controller('SummaryCtrl', require('controllers/summary/SummaryCtrl'));


    controllers.controller('TetIndexCtrl', require('controllers/TetIndexCtrl'));
    controllers.controller('TetDetailCtrl', require('controllers/TetDetailCtrl'));
    
    controllers.run(['$rootScope', function ($rootScope) {
        $rootScope.sampleParam = "value";
    }]);
    
    return controllers;

});