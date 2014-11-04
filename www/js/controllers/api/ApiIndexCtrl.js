define(function () {
    'use strict';

    function ctrl($scope, $state, $ionicPopup, HeaderBarService, FooterBarService, APIService) {

        var isLoading = true;

        $scope.init = function() {            
            isLoading = true;
            FooterBarService.setLeftTemplate('<button class="button button-icon ion-ios7-undo" ng-click="goToChangeApiS()">  Change API\'s</button>');            
            FooterBarService.getScope().goToChangeApiS = function() {
                $state.go("change-api"); 
            }              
            HeaderBarService.setTitle('Edit API\'s');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(false);
            HeaderBarService.setNewClickLink('api-new');
            isLoading = false;
        }

        $scope.doRefresh = function() {         
            $scope.$broadcast('scroll.refreshComplete');            
        }        

        $scope.getApiS = function() {
            return APIService.getList();
        }

        $scope.isItemEditable = function(api) {
            return APIService.isItemEditable(api);
        }

        $scope.remove = function (api, $event) {
            $event.preventDefault(); // stops event bubbling
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete API',
                template: 'Are you sure you want to delete the api?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    isLoading = true;
                    APIService.remove(api).then(function () {
                        APIService.save();
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
    ctrl.$inject = ['$scope', '$state', '$ionicPopup', 'HeaderBarService', 'FooterBarService', 'APIService'];

    return ctrl;
});