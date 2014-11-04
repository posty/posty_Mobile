define(function () {
    'use strict';

    function ctrl($scope, $stateParams, $ionicViewService, HeaderBarService, Transports) {

        var isLoading = false;

        $scope.init = function() {
            $scope.transport = Transports.getByID($stateParams.transportId);
            $scope.transportOld = angular.copy($scope.transport);            
            
            HeaderBarService.setTitle($scope.transport.name);
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (transport) {
            isLoading = true;
            Transports.edit(transport).then(function () {           
                $scope.transportOld = angular.copy(transport);
                $scope.goBack();
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;
            });
        }

        $scope.goBack = function () {
            var backView = $ionicViewService.getBackView();
            backView && backView.go();
        };        

        $scope.isLoading = function() {
            return isLoading;
        }

        $scope.hasChanged = function () {
            return ($scope.transport.name != $scope.transportOld.name) ||
                   ($scope.transport.destination != $scope.transportOld.destination);
        }
    }
    ctrl.$inject = ['$scope', '$stateParams', '$ionicViewService', 'HeaderBarService', 'Transports'];

    return ctrl;
});