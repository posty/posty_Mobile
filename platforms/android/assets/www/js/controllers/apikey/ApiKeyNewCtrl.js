define(function () {
    'use strict';

    function ctrl($scope, $stateParams, $ionicViewService, HeaderBarService, ApiKeys) {

        var isLoading = false;        

        $scope.init = function() {
            $scope.apikey = {expires_at: ""};                        
            
            HeaderBarService.setTitle("Create Api Key");
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (apikey) {
            isLoading = true;
            ApiKeys.create(apikey).then(function (response) {  
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
            return ($scope.apikey.expires_at !="");
        }
    }
    ctrl.$inject = ['$scope', '$stateParams', '$ionicViewService', 'HeaderBarService', 'ApiKeys'];

    return ctrl;
});