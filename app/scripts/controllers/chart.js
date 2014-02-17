'use strict';

var obj = angular.module('trelloGanttApp')
  .controller('ChartCtrl', function ($scope, Trelloservice) {
    Trelloservice.getBoards().then(function(data){
    	$scope.boards = data;
    	console.log(data);
    });
  });

  obj[ '$inject' ] = ['$scope', 'Trelloservice'];
