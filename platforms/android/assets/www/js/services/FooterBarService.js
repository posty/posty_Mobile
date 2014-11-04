/**
 * Central Response Handler. All Responses will be intercepted by the add method
 *
 * @class ResponseHandler
 */
define(['angular'], function (angular) {
    "use strict";

    var factory = function () {

        var leftTemplate = '';
        var scope = null;

        return {
            setDefault: function () {
                leftTemplate = '';
                
            },

            getLeftTemplate: function () {
                return leftTemplate;
            },

            setLeftTemplate: function (newTemplate) {
                leftTemplate = newTemplate;
            },

            getScope: function () {
                return scope;
            },

            setScope: function (newScope) {
                scope = newScope;
            },
        };

    };

    factory.$inject = [];
    return factory;
});
