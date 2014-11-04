define(function () {
    'use strict';

    function ctrl($scope, FooterBarService, $compile) {

        $scope.init = function () {
            FooterBarService.setScope($scope);
        };

        $scope.getLeftTemplate = function () {
            return FooterBarService.getLeftTemplate();
        }          
    }

    ctrl.$inject = ['$scope', 'FooterBarService', '$compile'];
    return ctrl;
});