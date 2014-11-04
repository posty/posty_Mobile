define(function () {
    'use strict';

    function ctrl($scope, $stateParams, HeaderBarService, APIService) {

        var isLoading = false;        

        $scope.init = function() {
           // $scope.api = {caption: "", url: "", key: ""};                     
            $scope.api = {caption: "posty server 1", url: "http://posty-api-development.herokuapp.com/api/v1", key: "123456"};                                    
            HeaderBarService.setTitle("Create Api");
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (api) {
            isLoading = true;           
            APIService.apiIsReachable(api).then(function () {  
                APIService.add(api);
                APIService.save();
                $scope.goBack(); 
            }).catch(function() { 
            }).finally(function() {
                isLoading = false;                 
            }); 
        }     

        $scope.inputIsValid = function() {          
            return !APIService.contiansAPI($scope.api) && $scope.hasChanged() && ($scope.api.caption.length > 0);
        }        

        $scope.isLoading = function() {
            return isLoading;
        }

        $scope.hasChanged = function () {
            return ($scope.api.caption !=""
                ||  $scope.api.url !=""
                ||  $scope.api.key !="");
        }
    }
    ctrl.$inject = ['$scope', '$stateParams', 'HeaderBarService', 'APIService'];

    return ctrl;
});