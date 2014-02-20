'use strict';

var obj = angular.module('trelloGanttApp')
.controller('ChartCtrl', function ($scope, Trelloservice) {
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
					id: c.id,
					subject: c.name,
					from: start,
					to: end,
					color: "#93C47D"
				});
			};

			if(tempSeries.length > 0){
				ganttData.push({
					id: l.id,
					description: l.name,
					name: l.name,
					tasks: tempSeries
				});
			}
		};
		return ganttData;
	}

	$scope.updateGantt = function (boardID){
		Trelloservice.getCardsFromBoard(boardID).then(function(data){
			$scope.clearData();
			var ganttData = buildGanttData(data);
			$scope.loadData(ganttData);
		})
	}

	$scope.addSamples = function () {
		Trelloservice.getBoards().then(function(data){
			$scope.boards = data;
		});
	};

	$scope.taskEvent = function(event) {
		console.log('Task event: ' + event.task.subject + ' (Custom data: ' + event.task.data + ')');
	};

	$scope.rowEvent = function(event) {
		console.log('Row event: ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
	};

	$scope.scrollEvent = function(event) {
		if (angular.equals(event.direction, "left")) {
			console.log('Scroll event: Left');
		} else if (angular.equals(event.direction, "right")) {
			console.log('Scroll event: Right');
		}
	};

});

obj[ '$inject' ] = ['$scope', 'Trelloservice'];
