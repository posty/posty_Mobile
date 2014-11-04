define(function () {
    'use strict';

    function ctrl($scope, $state, HeaderBarService, FooterBarService, APIService) {

        var isLoading = false;       

        $scope.currentServer = APIService.currentServer();

        $scope.init = function () {
            isLoading = true;
            FooterBarService.setLeftTemplate('<button class="button button-icon ion-ios7-compose" ng-click="goToEditApiS()">  Edit API\'s</button>');            
            FooterBarService.getScope().goToEditApiS = function() {
                $state.go("api-index"); 
            }       
            HeaderBarService.setTitle('Change API');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(true);                           
            isLoading = false;
        }

        $scope.selectServer = function (server) {
            $scope.currentServer = server
        };        

        $scope.getCurrentServer = function () {
            return APIService.getList();
        };

        $scope.getServers = function () {
            return APIService.getList();
        };

        $scope.isLoading = function() {
            return isLoading;
        }        

        $scope.save = function () {
            isLoading = true;           
            APIService.apiIsReachable($scope.currentServer).then(function () {                  
                APIService.setCurrentServer($scope.currentServer);
                APIService.save();
                $state.go("home");
            }).catch(function() { 
            }).finally(function() {
                isLoading = false;                 
            });                              
        }          

        $scope.hasChanged = function () {            
            return ($scope.currentServer != APIService.currentServer());
        }

    }

    ctrl.$inject = ['$scope', '$state', 'HeaderBarService', 'FooterBarService', 'APIService'];
    return ctrl;
});