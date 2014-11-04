define(function () {
    'use strict';

    function ctrl($scope, $ionicViewService, ProcessService, HeaderBarService, FooterBarService, CONFIGS) {

        $scope.init = function () {            
            $scope.ProcessService = ProcessService;
            $scope.CONFIGS = CONFIGS;
        };

        $scope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                HeaderBarService.setDefault();
                FooterBarService.setDefault();                
            }
        );

        $scope.getHeaderSearchText = function () {
            return HeaderBarService.getSearchText();
        }

        $scope.goBack = function () {
            var backView = $ionicViewService.getBackView();
            backView && backView.go();            
        }

    }

    ctrl.$inject = ['$scope', '$ionicViewService', 'ProcessService', 'HeaderBarService', 'FooterBarService', 'CONFIGS'];
    return ctrl;
});