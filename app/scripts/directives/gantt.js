'use strict';

var obj = angular.module('trelloGanttApp')
.directive('gantt', function (Trelloservice) {
	return {
		template: '<div></div>',
		restrict: 'E',
		scope: {
			board: '=',
		},
		link: function (scope, element, attrs) {
			var updateGantt = function (boardID){
				Trelloservice.getCardsFromBoard(boardID).then(function(data){
					console.log(buildGanttData(data));
				})
			}

			var buildGanttData = function (lists){
				var ganttData = [];
				var len = lists.length; 
				for (var i = 0; i < len; i++) {
					var l = lists[i];

					var tempSeries = [];
					for (var j = l.cards.length - 1; j >= 0; j--) {
						var c = l.cards[j];
						var start = new Date();
						if(c.due != null){
							start = new Date(c.due);
						}
						var end = new Date();
						if(/\[[1-9](0-9)*d\]/.test(c.name)){

						}
						else{
							end.setDate(start.getDate() + 2);
						}
						tempSeries.push({
							name: c.name,
							start: start,
							end: end
						});
					};

					ganttData.push({
						id: i+1,
						idLIst: l.id,
						name: l.name,
						series: tempSeries
					});
				};
				return ganttData;
			}

			scope.$watch('board', function(oldVal, newVal) {
				if(newVal || oldVal)
					updateGantt(scope.board);
			});
		}
	};
});

obj[ '$inject' ] = ['Trelloservice'];