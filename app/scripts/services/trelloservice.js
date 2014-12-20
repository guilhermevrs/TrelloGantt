'use strict';

var trelloObj = angular.module('trelloGanttApp.trello', [])
.factory('Trelloservice', function Trelloservice($http, $q) {
	var TrelloserviceClient = {
		apiKey : '4c1e45a79e9f167d2565897fd7970674',
		/*
			SECURITY FUNCTIONS
			*/
			authorize : function(){
				var defered = $q.defer();
				var me = this;
				Trello.authorize({
					type : 'popup',
					name : 'TrelloGantt',
					scope: { read: true, write: true, account: false },
					success : function(){
						defered.resolve(me.getLocalToken());
					},
					error: function(error){
						console.error(error);
					}
				});
				return defered.promise;
			},
			getLocalToken: function(){
				return localStorage.getItem('trello_token');
			},
			isUserLogged: function(){
				return this.getLocalToken() !== null;
			},
			deauthorize: function(){
				Trello.deauthorize();
			},
		/*
			END OF SECURITY FUNCTIONS
			*/
		/*
			MEMBER FUNCTIONS
			*/
			getBoards: function(){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('members/me/boards', {
					filter: 'open',
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
			getOrganizations: function(){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('members/me/organizations', {
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
			getBoardInfo: function(boardID){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('boards/'+boardID, {
					token: token,
					members  : 'all'
				}, function(data){
					defered.resolve(data);
				}, function(error){
					console.error(error);
				});
				return defered.promise;
			},
		/*
			END OF MEMBER FUNCTIONS
			*/
		/*
			BOARDS FUNCTIONS
			*/
			getCardsFromBoard: function(boardID){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('boards/'+boardID+'/lists/', {
					cards:'open',
					filter:'open',
					fields: 'name',
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
			getBoardMembers: function(boardID){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('boards/'+boardID+'/members/', {
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
		/*
			END BOARDS FUNCTIONS
			*/
			/*
			CARD FUNCTIONS
			*/
			updateCard: function(card){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.put('cards/'+card.id, {
					name: card.name,
					due: card.due,
					token: token
				}, function(data){
					defered.resolve(data);
				}, function(error){
					console.error(error);
				});
				return defered.promise;
			},
			getCardData: function(card){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('cards/'+card.id + '/actions',{
					token: token
				},
				function(data){
					defered.resolve(data);
				}, function(error){
					console.error(error);
				});
				return defered.promise;
			}
			/*
			END CARD FUNCTIONS
			*/
		};
		return TrelloserviceClient;
	});

trelloObj['$inject'] = ['$http', '$q'];
