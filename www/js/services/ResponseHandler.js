/**
 * Central Response Handler. All Responses will be intercepted by the add method
 *
 * @class ResponseHandler
 */
define(['angular'], function (angular) {
    "use strict";

    var factory = function () {

        return {
            /**
             * adding responses to the local list
             *
             * @method add
             * @param response {Object} response-Object
             */
            add: function (response) {
                switch (response.status) {
                    case 401:
                        //ErrorService.throw("401", "Invalid API-Key");
                        //$location.path('/error');
                        break;
                    case 404:
                        //ErrorService.throw("404", "Ther Server is unreachable");
                        //$location.path('/error');
                        break;
                }
            }
        };

    };

    factory.$inject = [];
    return factory;
});
