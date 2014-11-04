/*global define, require, console, cordova, navigator */

define(['ionic', 'angular', 'app', 'routes'], function (ionic, angular, app) {
    'use strict';

    var $html,
        onDeviceReady = function () {
            angular.bootstrap(document, [app.name]);
        };

    document.addEventListener("deviceready", onDeviceReady, false);

    if (typeof cordova === 'undefined') {
        $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function () {
            try {
                angular.bootstrap(document, [app.name]);
            } catch (e) {
                console.error(e.stack || e.message || e);
            }
        });
    }

});