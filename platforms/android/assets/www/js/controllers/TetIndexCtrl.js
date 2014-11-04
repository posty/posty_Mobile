/*global define*/

define(function () {
    'use strict';

    function ctrl($scope, PetService, HeaderBarService) {
        $scope.pets = PetService.all();
        HeaderBarService.setTitle('Tets');
    }

    ctrl.$inject = ['$scope', 'PetService', 'HeaderBarService'];
    return ctrl;
    
});