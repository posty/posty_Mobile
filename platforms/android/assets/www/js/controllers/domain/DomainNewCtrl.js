define(function () {
    'use strict';

    function ctrl($scope, $ionicPopup, HeaderBarService, Domains, DomainAliasses) {

        var generalIsLoading = false;
        var aliasIsLoading = false;
        var aliasIsShowed = false;

        $scope.init = function() {
            $scope.domain = {name:""};
            $scope.domainOld = angular.copy($scope.domain);
            $scope.alias = {name:""};
            aliasIsShowed = false;
            HeaderBarService.setTitle("Create Domain");
            HeaderBarService.hideSearchButton(true);
            HeaderBarService.hideNewButton(true);
        }

        $scope.saveDomain = function (domain) {
            generalIsLoading = true;
            Domains.create(domain).then(function () {
                aliasIsShowed = true;
                DomainAliasses.setDomain($scope.domain);
                $scope.domainOld = angular.copy(domain);
            }).catch(function(response) {
            }).finally(function() {
                generalIsLoading = false;
            });
        }

        $scope.getAliasses = function() {
            return DomainAliasses.getList();
        }

        $scope.createAlias = function (alias) {
            aliasIsLoading = true;
            DomainAliasses.create(alias).then(function () {
            }).catch(function(response) {
            }).finally(function() {
                aliasIsLoading = false;
                $scope.emptyAliasInput();
            });
        }

        $scope.removeAlias = function (alias) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Alias',
                template: 'Are you sure you want to delete the alias?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    aliasIsLoading = true;
                    DomainAliasses.remove(alias).then(function () {
                    }).catch(function(response) {
                    }).finally(function() {
                        aliasIsLoading = false;
                    });
                }
            });
        }

        $scope.domainInputIsValid = function() {
            return $scope.hasChanged();
        }

        $scope.aliasInputIsValid = function() {
            return $scope.alias.name != "";
        }

        $scope.emptyAliasInput = function() {
            return $scope.alias.name = "";
        }

        $scope.generalIsLoading = function() {
            return generalIsLoading;
        }

        $scope.aliasIsLoading = function() {
            return aliasIsLoading;
        }

        $scope.aliasIsShowed = function() {
            return aliasIsShowed;
        }

        $scope.hasChanged = function () {
            return $scope.domain.name != $scope.domainOld.name;
        }
    }
    ctrl.$inject = ['$scope', '$ionicPopup', 'HeaderBarService', 'Domains', 'DomainAliasses'];

    return ctrl;
});