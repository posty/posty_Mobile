define(function () {
    'use strict';

    function ctrl($scope, $ionicViewService, HeaderBarService, Transports) {

        var isLoading = false;        

        $scope.init = function() {
            $scope.transport = {name: "", destination: ""};
            
            HeaderBarService.setTitle("Create Transport");
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (transport) {
            isLoading = true;
            Transports.create(transport).then(function () {
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
            return ($scope.transport.name != "") ||
                   ($scope.transport.destination != "");
        }
    }
    ctrl.$inject = ['$scope', '$ionicViewService', 'HeaderBarService', 'Transports'];

    return ctrl;
});