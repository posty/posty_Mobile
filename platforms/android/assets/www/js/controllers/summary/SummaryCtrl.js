define(function () {
    'use strict';

    function ctrl($scope, HeaderBarService, Summaries) {

        var isLoading = true;

        $scope.init = function() {            
            HeaderBarService.setTitle('Summary');           
            $scope.doRefresh();            
        }

        $scope.doRefresh = function() {
            isLoading = true;
            Summaries.refresh().then(function () {
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;                   
            });
        }        

        $scope.getData = function() {
            return Summaries.getList();
        }

        $scope.isLoading = function() {
            return isLoading;
        }

    }
    ctrl.$inject = ['$scope', 'HeaderBarService', 'Summaries'];

    return ctrl;
});