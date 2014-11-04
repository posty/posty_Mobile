/*global define, require */

define(['app'], function (app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider                
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'templates/settings.html'
                })

                .state('about', {
                    url: '/about',
                    templateUrl: 'templates/about.html',
                    controller: 'AboutCtrl'
                })

                .state('home', {
                    url: "/home",                    
                    templateUrl: "templates/home.html",
                    controller: 'HomeCtrl'                        
                })

                /**
                * Tets-States
                */

                .state('tets', {
                    url: '/tets',                    
                    templateUrl: 'templates/tet-index.html',
                    controller: 'TetIndexCtrl'        
                })

                .state('tet-detail', {
                    url: '/tet/:tetId',                
                    templateUrl: 'templates/tet-detail.html',
                    controller: 'TetDetailCtrl'                      
                })

                /**
                * Api-States
                */
                .state('change-api', {
                    url: '/change-api',
                    templateUrl: 'templates/api/change-api.html',
                    controller: 'ChangeAPICtrl'
                })                
                .state('api-index', {
                    url: '/api',
                    templateUrl: 'templates/api/api-index.html',
                    controller: 'ApiIndexCtrl'
                })
                .state('api-new', {
                    url: '/api-new',
                    templateUrl: 'templates/api/api-new.html',
                    controller: 'ApiNewCtrl'
                })

                /**
                * Domain-States
                */
                .state('domain-index', {
                    url: '/domain',
                    templateUrl: 'templates/domain/domain-index.html',
                    controller: 'DomainIndexCtrl'
                })

                .state('domain-new', {
                    url: '/domain-new',
                    templateUrl: 'templates/domain/domain-new.html',
                    controller: 'DomainNewCtrl'
                })
                .state('domain-detail', {
                    url: '/domain/:domainId',  
                    templateUrl: 'templates/domain/domain-detail.html',
                    controller: 'DomainDetailCtrl'
                })

                /**
                * User-States
                */
                .state('user-index', {
                    url: '/user',
                    templateUrl: 'templates/user/user-index.html',
                    controller: 'UserIndexCtrl'
                })

                .state('user-new', {
                    url: '/user-new',
                    templateUrl: 'templates/user/user-new.html',
                    controller: 'UserNewCtrl'
                })
                .state('user-detail', {
                    url: '/user/:userId',  
                    templateUrl: 'templates/user/user-detail.html',
                    controller: 'UserDetailCtrl'
                })

                /**
                * Transport-States
                */
                .state('transport-index', {
                    url: '/transports',
                    templateUrl: 'templates/transport/transport-index.html',
                    controller: 'TransportIndexCtrl'
                })

                .state('transport-new', {
                    url: '/transport-new',
                    templateUrl: 'templates/transport/transport-new.html',
                    controller: 'TransportNewCtrl'
                })
                .state('transport-detail', {
                    url: '/transport/:transportId',  
                    templateUrl: 'templates/transport/transport-detail.html',
                    controller: 'TransportDetailCtrl'
                })                   

                /**
                * Api-Key-States
                */
                .state('apikey-index', {
                    url: '/apikey',
                    templateUrl: 'templates/apikey/apikey-index.html',
                    controller: 'ApiKeyIndexCtrl'
                })
                .state('apikey-new', {
                    url: '/apikey-new',
                    templateUrl: 'templates/apikey/apikey-new.html',
                    controller: 'ApiKeyNewCtrl'
                })
                .state('apikey-detail', {
                    url: '/apikey/:apikeyId',  
                    templateUrl: 'templates/apikey/apikey-detail.html',
                    controller: 'ApiKeyDetailCtrl'
                })

                /**
                * Summary
                */
                .state('summary', {
                    url: '/summary',
                    templateUrl: 'templates/summary/summary.html',
                    controller: 'SummaryCtrl'
                });               


            $urlRouterProvider.otherwise("/home");

        }]);


});