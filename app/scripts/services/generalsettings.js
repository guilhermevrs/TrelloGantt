'use strict';

angular.module('trelloGanttApp')
.factory('generalSettings', function () {
  var _boardID = null;

  return {
    getBoardID: function () {
      return _boardID;
    },
    setBoardID: function (boardID) {
      _boardID = boardID;
    }
  };
});
