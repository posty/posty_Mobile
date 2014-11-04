define(function () {
    'use strict';

    function ctrl($scope, toaster, AlertService) {       

        $scope.init = function() {          	

            $scope.alerts = AlertService.alerts();

			$scope.$watchCollection('alerts', function(newAlerts, oldAlerts) {				
				var hasGrown = newAlerts.length > oldAlerts.length;								
				if (hasGrown) {					
					var lastItem = $scope.alerts[$scope.alerts.length-1];
					lastItem.type = (lastItem.type == "danger" ? "error" : lastItem.type);
					toaster.pop(lastItem.type, "", lastItem.msg);
				}					
			});                      
        }
    }

    ctrl.$inject = ['$scope', 'toaster', 'AlertService'];
    return ctrl;
});