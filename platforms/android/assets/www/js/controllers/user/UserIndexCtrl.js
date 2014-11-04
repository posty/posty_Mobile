define(function () {
    'use strict';

    function ctrl($scope, $ionicPopup, HeaderBarService, FooterBarService, SelectDomainModalService, Users) {

        var isLoading = false;        

        $scope.init = function() {                        
            HeaderBarService.setTitle('Users');
            HeaderBarService.hideSearchButton(false);
            HeaderBarService.hideNewButton(false);
            HeaderBarService.setNewClickLink('user-new');  
            FooterBarService.setLeftTemplate('<button class="button button-icon ion-cube" ng-click="changeDomain()">  Change Domain</button>');            
            FooterBarService.getScope().changeDomain = function() {
                $scope.openModal();
            }
            if (!$scope.userDomainIsAssigned()) {
                $scope.openModal();
            } 
        }     

        $scope.userDomainIsAssigned = function() {            
            return Users.getDomain() != null;
        }

        $scope.cancelSelectDomain = function() {                        
            if (!$scope.userDomainIsAssigned()) {
                $scope.goBack();
            }            
        }             

        $scope.doRefreshDomain = function(domain) {            
            Users.setDomain(domain);
            $scope.doRefresh();            
        }             

        $scope.doRefresh = function(domain) {
            isLoading = true;            
            Users.refresh().then(function () {
            }).catch(function(response) {
            }).finally(function() {
                isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }          

        $scope.getUsers = function() {
            return Users.getList();
        }

        $scope.getDomain = function() {
            return Users.getDomain();
        }        

        $scope.remove = function (user, $event) {
            $event.preventDefault(); // stops event bubbling
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Transport',
                template: 'Are you sure you want to delete the user?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    isLoading = true;
                    Users.remove(user).then(function () {
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

        $scope.openModal = function() {            
            SelectDomainModalService.open($scope).then(function (domain) {                
                $scope.doRefreshDomain(domain);
            }).catch(function() {
                $scope.cancelSelectDomain();
            });
        };      

    }
    ctrl.$inject = ['$scope', '$ionicPopup', 'HeaderBarService', 'FooterBarService', 'SelectDomainModalService', 'Users'];

    return ctrl;
});