'use strict';

var obj = angular.module('trelloGanttApp.chart', [])
.controller('ChartCtrl', function ($scope, Trelloservice, generalSettings, $location, $modal, $routeParams) {

	$scope.gantt = {};
	$scope.gantt.scale = 'day';

	var boardID = $routeParams.boardID;
	if(boardID === null)
		$location.path('/');
	else{
		Trelloservice.getBoardInfo(boardID).then(function(board){
			$scope.board = board;
			generalSettings.setMemberCache(board.members);
		});
	}

	if(!Trelloservice.isUserLogged())
		$location.path('/');

	/*Auxilary functions*/
	var buildGanttData = function (lists){
		var ganttData = [],
		minStart = null,
		maxEnd = null;
		var len = lists.length;

		for (var i = 0; i < len; i++) {
			var l = lists[i];

			var tempSeries = [];
			for (var j = l.cards.length - 1; j >= 0; j--) {
				var c = l.cards[j];
				var start = new Date();
				if(c.due !== null){
					start = new Date(c.due);
				}

				var end = new Date(start);
				var regObj = /\[[1-9](0-9)*d\]/;
				if(regObj.test(c.name)){
					var matches = regObj.exec(c.name);
					var duration = matches[0].replace('[','').replace('d]','');
					duration = parseInt(duration);
					end.setDate(start.getDate() + duration);
				}
				else{
					end.setDate(start.getDate() + 1);
				}

				c.from = new Date(start);
				c.to = new Date(end);

				if(minStart === null || minStart > start)
					minStart = new Date(start);
				if(maxEnd === null || maxEnd < end)
					maxEnd = new Date(end);

				var color = '#95a5a6';
				if(c.labels.length > 0){
					color = $scope.getLabelColor(c.labels[0].color);
				}

				tempSeries.push({
					id: c.id,
					subject: c.name,
					from: c.from,
					to: c.to,
					color: color,
					data: c
				});
			}

			if(tempSeries.length > 0){
				ganttData.push({
					id: l.id,
					description: l.name,
					name: l.name,
					tasks: tempSeries,
					order: i
				});
			}
		}

		if(minStart === null)
			minStart = new Date();
		if(maxEnd === null)
			maxEnd = new Date();
		minStart.setDate(minStart.getDate()-10);
		maxEnd.setDate(maxEnd.getDate()+10);
		return {
			data: ganttData,
			startChartt: minStart,
			endChartt: maxEnd
		};
	}

	/*SCOPE functions*/

	$scope.updateGantt = function (boardID){
		Trelloservice.getCardsFromBoard(boardID).then(function(data){
			$scope.clearData();

			var ganttData = buildGanttData(data);

			$scope.gantt.fromDate = ganttData.startChartt;
			$scope.gantt.toDate = ganttData.endChartt;

			$scope.loadData(ganttData.data);
			setTimeout(function(){
				$scope.scrollToDate(new Date());
			},500);
		})
	}

	$scope.getLabelColor = function(label){
		var color;
		switch(label){
			case 'red': color='#e74c3c'; break;
			case 'orange': color='#e67e22'; break;
			case 'yellow': color='#f1c40f'; break;
			case 'green': color='#1abc9c'; break;
			case 'blue': color='#3498db'; break;
			case 'purple': color='#9b59b6'; break;
		}
		return color;
	};

	$scope.addSamples = function () {
		$scope.updateGantt(boardID);
	};

	$scope.taskEvent = function(event) {
		var dirty = false;
		var current = event.task;
		var previous = event.task.data;
		if(current.from !== previous.from){
			dirty = true;
		}
		else if(current.to !== current.to){
			dirty = true;
		}

		if(dirty){
			var second=1000, minute=second*60, hour=minute*60, day=hour*24;
			var difference = (current.to-current.from)/day;
			difference = Math.ceil(difference);
			var regObj = /\[[1-9](0-9)*d\]/;
			if(regObj.test(current.subject)){
				current.subject = current.subject.replace(regObj, '['+difference+'d]');
			}
			else{
				current.subject = current.subject + ' ['+difference+'d]';
			}
			Trelloservice.updateCard({
				id: current.id,
				name: current.subject,
				due: current.from
			}).then(function(data){
				console.log(data);
			})
		}
	};

	$scope.rowEvent = function(event) {
		$scope.scrollToDate(event.row.from);
	};

	$scope.scrollEvent = function(event) {
		if (angular.equals(event.direction, 'left')) {
			console.log('Scroll event: Left');
		} else if (angular.equals(event.direction, 'right')) {
			console.log('Scroll event: Right');
		}
	};

	$scope.loadCardDetail = function(card){
		$modal.open({
			templateUrl: 'views/carddetail.html',
			controller: 'CarddetailsCtrl',
			resolve: {
				card: function () {
					return card;
				}
			}
		});
	}

});

obj[ '$inject' ] = ['$scope', 'Trelloservice', 'generalSettings', '$location', '$modal', '$routeParams'];
