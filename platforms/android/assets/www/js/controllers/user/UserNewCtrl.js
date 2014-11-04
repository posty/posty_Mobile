define(function () {
    'use strict';

    function ctrl($scope, $ionicViewService, HeaderBarService, Users) {

        var isLoading = false;        

        $scope.init = function() {
            $scope.user = {name: "", password: "", confirmPassword: "", quota: ""};
            $scope.domain = Users.getDomain();            
            
            HeaderBarService.setTitle("Create User");
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.save = function (user) {
            isLoading = true;
            Users.create(user).then(function () {
                $scope.goBack();                            
            }).catch(function(response) {                
            }).finally(function() {
                isLoading = false;                              
            });
        }        

        $scope.isLoading = function() {
            return isLoading;
        }

        $scope.hasChanged = function () {
            return ($scope.user.name != "") ||
                   ($scope.user.password != "") ||
                   ($scope.user.confirmPassword != "") ||
                   ($scope.user.quota != "");
        }
    }
    ctrl.$inject = ['$scope', '$ionicViewService', 'HeaderBarService', 'Users'];

    return ctrl;
});