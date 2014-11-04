define(function () {
    'use strict';

    function ctrl($scope, $ionicPopup, HeaderBarService, Transports) {

        var isLoading = true;

        $scope.init = function() {            
            HeaderBarService.setTitle('Transports');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(false);
            HeaderBarService.setNewClickLink('transport-new');
            $scope.doRefresh();
        }

        $scope.doRefresh = function() {
            isLoading = true;
            Transports.refresh().then(function () {
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }          

        $scope.getTransports = function() {
            return Transports.getList();
        }

        $scope.remove = function (transport, $event) {
            $event.preventDefault(); // stops event bubbling
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Transport',
                template: 'Are you sure you want to delete the transport?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    isLoading = true;
                    Transports.remove(transport).then(function () {
                    }).catch(function(response) {
                    }).finally(function() {
                        isLoading = false;
                    });
                }
            });
        }

        $scope.isLoading = function() {
            return isLoading;
        }
    }
    ctrl.$inject = ['$scope', '$ionicPopup', 'HeaderBarService', 'Transports'];

    return ctrl;
});