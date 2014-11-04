define(function () {
    'use strict';

    function ctrl($scope, $stateParams, $ionicViewService, HeaderBarService, ApiKeys) {

        var isLoading = false;

        $scope.init = function() {
            $scope.apikey = ApiKeys.getByID($stateParams.apikeyId);
            $scope.apikeyOld = angular.copy($scope.apikey);            
            
            HeaderBarService.setTitle($scope.apikey.access_token);
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (apikey) {
            isLoading = true;
            ApiKeys.edit(apikey).then(function () {           
                $scope.apikeyOld = angular.copy(apikey);
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
            return ($scope.apikey.expires_at != $scope.apikeyOld.expires_at) ||
                   ($scope.apikey.active != $scope.apikeyOld.active);
        }
    }
    ctrl.$inject = ['$scope', '$stateParams', '$ionicViewService', 'HeaderBarService', 'ApiKeys'];

    return ctrl;
});