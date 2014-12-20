'use strict';

var obj = angular.module('trelloGanttApp.board', [
    'trelloGanttApp.trello',
    'trelloGanttApp.common'
])
.controller('BoardsCtrl', function ($scope, Trelloservice, generalSettings, $location) {

	if(!Trelloservice.isUserLogged()){
		$location.path('/');
	}

	Trelloservice.getOrganizations().then(function(organizations){
		//generalSettings.setOrganizationCache(organizations);
			$scope.organizations = organizations;
		Trelloservice.getBoards().then(function(boards){
			$scope.boards = boards;
		});
	});

	/*Scope functions*/
	$scope.seeBoardChart = function(boardID){
		$location.path('/chart/'+boardID);
	}

});

obj['$inject'] = ['$scope', 'Trelloservice', 'generalSettings', '$location'];
