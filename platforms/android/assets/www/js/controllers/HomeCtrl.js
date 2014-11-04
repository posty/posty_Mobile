define(function () {
    'use strict';

    function ctrl($scope, HeaderBarService) {

        $scope.init = function() {            
            HeaderBarService.setTitle('Home');
            HeaderBarService.setSmallLogo(false);
            HeaderBarService.hideBackButton(true);
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

    }

    ctrl.$inject = ['$scope', 'HeaderBarService'];
    return ctrl;
});