define(function () {
    'use strict';

    function ctrl($scope, $ionicSideMenuDelegate, $ionicViewService, HeaderBarService) {

        $scope.init = function () {
            /*
             * Has to be a Object, because simple variables are not working
             * in the $watch scope.
             */
            $scope.data = { searchText: HeaderBarService.getSearchText() };

            $scope.$watch('data.searchText', function (newValue, oldValue) {
                HeaderBarService.setSearchText(newValue);
            });
        };

        $scope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                HeaderBarService.setDefault();
            }
        );

        $scope.getTitle = function () {
            return HeaderBarService.getTitle();
        };

        $scope.smallLogoIsSet = function () {            
            return HeaderBarService.smallLogoIsSet();
        };

        $scope.backButtonIsHidden = function () {
            var backViewIsAssigned = $ionicViewService.getBackView() != null;
            return HeaderBarService.backButtonIsHidden() || !backViewIsAssigned;
        };

        $scope.searchButtonIsHidden = function () {
            return HeaderBarService.searchButtonIsHidden();
        };

        $scope.newButtonIsHidden = function () {
            return HeaderBarService.newButtonIsHidden();
        };

        $scope.getTemplateName = function () {
            return HeaderBarService.getTemplateName();
        };

        $scope.searchClick = function () {
            HeaderBarService.setSearch();
        };

        $scope.searchBackClick = function () {
            HeaderBarService.resetSearch();
        };

        $scope.newClick = function () {
            HeaderBarService.onNewClick();
        };

        $scope.menuClick = function () {
            $ionicSideMenuDelegate.toggleRight();
        };

        $scope.goBackClick = function () {
            $scope.goBack();
        };
    }

    ctrl.$inject = ['$scope', '$ionicSideMenuDelegate', '$ionicViewService' , 'HeaderBarService'];
    return ctrl;
});