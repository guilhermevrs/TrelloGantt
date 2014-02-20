'use strict';

var obj = angular.module('trelloGanttApp')
.controller('ChartCtrl', function ($scope, Trelloservice) {
	var buildGanttData = function (lists){
		var ganttData = [],
		minStart = null,
		maxEnd = null;
		var len = lists.length;

		console.log(lists);

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
				if(minStart == null || minStart > start)
					minStart = new Date(start);
				if(maxEnd == null || maxEnd < end)
					maxEnd = new Date(end);

				var color = "#95a5a6";
				if(c.labels.length > 0){
					color = $scope.getLabelColor(c.labels[0].color);
				}

				tempSeries.push({
					id: c.id,
					subject: c.name,
					from: start,
					to: end,
					color: color
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
		minStart.setDate(minStart.getDate()-10);
		maxEnd.setDate(maxEnd.getDate()+10);
		return {
			data: ganttData,
			startChartt: minStart,
			endChartt: maxEnd
		};
	}

	$scope.updateGantt = function (boardID){
		Trelloservice.getCardsFromBoard(boardID).then(function(data){
			$scope.clearData();

			var ganttData = buildGanttData(data);
			$scope.gantt.fromDate = ganttData.startChartt;
			$scope.gantt.toDate = ganttData.endChartt;
			$scope.loadData(ganttData.data);
		})
	}

	$scope.gantt = {};
	$scope.gantt.scale = "day";

	$scope.getLabelColor = function(label){
		var color;
		switch(label){
			case 'red': color="#e74c3c"; break;
			case 'orange': color="#e67e22"; break;
			case 'yellow': color="#f1c40f"; break;
			case 'green': color="#1abc9c"; break;
			case 'blue': color="#3498db"; break;
			case 'purple': color="#9b59b6"; break;
		}
		return color;
	};

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
