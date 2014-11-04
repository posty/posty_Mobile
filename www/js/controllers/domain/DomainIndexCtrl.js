define(function () {
    'use strict';

    function ctrl($scope, $ionicPopup, HeaderBarService, Domains) {

        var isLoading = true;

        $scope.init = function() {
            HeaderBarService.setTitle('Domains');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(false);
            HeaderBarService.setNewClickLink('domain-new');
            isLoading = true;
            Domains.refresh().then(function () {
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;
            });
        }

        $scope.getDomains = function() {
            return Domains.getList();
        }

        $scope.remove = function (domain, $event) {
            $event.preventDefault(); // stops event bubbling
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Domain',
                template: 'Are you sure you want to delete the domain?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    isLoading = true;
                    Domains.remove(domain).then(function () {
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
    ctrl.$inject = ['$scope', '$ionicPopup', 'HeaderBarService', 'Domains'];

    return ctrl;
});