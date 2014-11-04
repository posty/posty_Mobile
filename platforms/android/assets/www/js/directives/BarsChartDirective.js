/*global define*/

define(['angular', 'd3'], function (angular, d3) {
    "use strict";

    var directive = function ($parse) {
		return {
			restrict: 'E',
			replace: true,
			scope: {data: '=chartData'},
			link: function (scope, element, attrs) {				
				var chart = d3.select(element[0]);
				scope.$watchCollection('data', function (newValue, oldValue) {
					chart.append("div").attr("class", "chart")
					.selectAll('div')
					.data(scope.data).enter().append("div")
					.transition().ease("elastic")
					.style("width", function (d) {
						var tmp = 35;
						var val = d.percent + tmp;
						if (val >= 100) {
							val = 98;
						}
						return val + "%";
						})
						.text(function (d) {
						return d.caption;
					});
				});
			}
		};
    };

    directive.$inject = ['$parse'];
    return directive;
});
