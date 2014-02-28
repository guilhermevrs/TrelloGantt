'use strict';

var obj = angular.module('trelloGanttApp')
.controller('BoardsCtrl', function ($scope, Trelloservice, generalSettings, $location) {

  if(!Trelloservice.isUserLogged()){
    $location.path('/');
  }

  Trelloservice.getBoards().then(function(boards){
   $scope.boards = boards;
 });

  /*Scope functions*/
  $scope.seeBoardChart = function(boardID){
   generalSettings.setBoardID(boardID);
   $location.path('/chart/'+boardID);
 }

});

obj['$inject'] = ['$scope', 'Trelloservice', 'generalSettings', '$location'];
