define(function () {
    'use strict';

    function ctrl($scope, HeaderBarService) {

        $scope.init = function() {
            HeaderBarService.setTitle('About');
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }
    }

    ctrl.$inject = ['$scope', 'HeaderBarService'];
    return ctrl;
});