'use strict';

var obj = angular.module('trelloGanttApp')
.controller('CarddetailsCtrl', function ($scope, Trelloservice, generalSettings, $modalInstance, card) {

	$scope.card = card;

	Trelloservice.getCardData(card).then(function(data){
		card.comments = data;
	});

	$scope.ok = function () {
		$modalInstance.close('Rubens');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.getMember = function(id){
		return generalSettings.getMemberCache(id);
	}
});
obj['$inject'] = ['$scope', 'Trelloservice', 'generalSettings'];