/*global define */

define(function (require, d3) {

    'use strict';

    var angular = require('angular'),
     	d3 = require('d3'),
        services = require('services/services'),
        directives = angular.module('app.directives', ['app.services']);
    
    directives.directive('appVersion', require('directives/VersionDirective'));
    directives.directive('barsChart', require('directives/BarsChartDirective'));    
    directives.directive('compile', require('directives/CompileDirective'));    

    return directives;
});