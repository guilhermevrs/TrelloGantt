'use strict';

var obj = angular.module('trelloGanttApp.chart', [
    'gantt',
    'gantt.tree'
])
.controller('ChartCtrl', function ($scope, Trelloservice, generalSettings, $location, $modal, $routeParams) {

        $scope.gantt = {};
	$scope.gantt.scale = 'day';

	/*Auxilary functions*/

        /*SCOPE functions*/
        $scope.buildTasksData = function(cardList){
            var generatedData = [];
            generatedData.push({name: cardList.name});

            var cardsLength = cardList.cards.length;
            for(var cardIndex = 0; cardIndex < cardsLength; cardIndex++){
                var currentCard = cardList.cards[cardIndex];
                var generatedTask = {};
                generatedTask.name = currentCard.name;
                generatedTask.parent = cardList.name;
                var start = new Date();
                if(currentCard.due){
                    start = new Date(currentCard.due);
                }
                var end = start;
                generatedTask.tasks = [];
                generatedTask.tasks.push({
                    name: currentCard.name,
                    color: '#95a5a6',
                    from: start,
                    to: end
                });
                generatedData.push(generatedTask);
            }

            return generatedData;
        };

	$scope.buildGanttData = function (lists){
		var ganttData = [];
		var len = lists.length;
                var temp = 0;
		for (var i = 0; i < len; i++) {
			var list = lists[i];
                        var listData = $scope.buildTasksData(list);
                        ganttData = ganttData.concat(listData);
		}
                return ganttData;
	}

	$scope.updateGantt = function (boardID){
		Trelloservice.getCardsFromBoard(boardID).then(function(data){
			$scope.clearData();

			var ganttData = $scope.buildGanttData(data);

			//$scope.gantt.fromDate = ganttData.startChartt;
			//$scope.gantt.toDate = ganttData.endChartt;

			$scope.loadData(ganttData);
			/*setTimeout(function(){
				$scope.scrollToDate(new Date());
			},500);*/
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

        $scope.clearData = function(){
            $scope.data = undefined;
        };

        $scope.loadData = function(data){
            $scope.data = data;
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

        if(!Trelloservice.isUserLogged())
		$location.path('/');

	var boardID = $routeParams.boardID;
	if(boardID === null)
		$location.path('/');
	else{
		Trelloservice.getBoardInfo(boardID).then(function(board){
			$scope.board = board;
			generalSettings.setMemberCache(board.members);
		});
                $scope.updateGantt(boardID);
	}

});

obj[ '$inject' ] = ['$scope', 'Trelloservice', 'generalSettings', '$location', '$modal', '$routeParams'];
