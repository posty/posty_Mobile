define(function () {
    'use strict';

    function ctrl($scope, $ionicPopup, HeaderBarService, ApiKeys) {

        var isLoading = true;

        $scope.init = function() {            
            HeaderBarService.setTitle('API Keys');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(false);
            HeaderBarService.setNewClickLink('apikey-new');
            $scope.doRefresh();            
        }

        $scope.doRefresh = function() {
            isLoading = true;
            ApiKeys.refresh().then(function () {
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }        

        $scope.getApiKeys = function() {
            return ApiKeys.getList();
        }

        $scope.remove = function (apikey, $event) {
            $event.preventDefault(); // stops event bubbling
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete API Key',
                template: 'Are you sure you want to delete the api key?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    isLoading = true;
                    ApiKeys.remove(apikey).then(function () {
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

        $scope.iconName = function(apiKey) {
            if (ApiKeys.isExpired(apiKey)) {
                return "expired";
            } else if (!apiKey.active) {
                return "inactive";
            }
            return "ok";
        }

    }
    ctrl.$inject = ['$scope', '$ionicPopup', 'HeaderBarService', 'ApiKeys'];

    return ctrl;
});