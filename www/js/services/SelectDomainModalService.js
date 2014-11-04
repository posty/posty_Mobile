/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($ionicModal, $q, Domains) {

        return {
            open: function ($scope) {
                var deferred = $q.defer();

                $ionicModal.fromTemplateUrl('templates/directives/select-domain-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false

                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });                              
                
                $scope.closeModal = function() {
                    $scope.modal.hide();
                };
                
                $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                });

                var domainIsLoading = true;

                $scope.init = function() { 
                    Domains.refresh().then(function () {
                    }).catch(function(response) {
                    }).finally(function() {
                        domainIsLoading = false;
                    }); 
                }          

                $scope.isDomainLoading = function() {
                    return domainIsLoading;
                };

                $scope.selectDomain = function(domain) {
                    deferred.resolve(domain);
                    $scope.modal.hide();
                };

                $scope.cancel = function(domain) {                    
                    deferred.reject();  
                    $scope.modal.hide();
                };                

                $scope.getDomains = function() {
                    return Domains.getList();           
                };                 

                return deferred.promise;
            }
        };

    };

    factory.$inject = ['$ionicModal', '$q', 'Domains'];
    return factory;
});