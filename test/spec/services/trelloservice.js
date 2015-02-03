'use strict';

describe('Service: Trelloservice', function () {

  // load the service's module
  beforeEach(module('trelloGanttApp.trello'));

  // instantiate service
  var Trelloservice,
    token,
    q,
    rootScope;

  var customDateEquality = function(first, second){
        var typeOfDate = typeof new Date();
        if (typeof first === typeOfDate && typeof second === typeOfDate) {
            return first.toString() === second.toString();
        }
  };

  beforeEach(inject(function (_Trelloservice_, $q, $rootScope) {
    jasmine.addCustomEqualityTester(customDateEquality);
    q = $q;
    rootScope = $rootScope;
    Trelloservice = _Trelloservice_;
    token = '' + Math.random();
  }));

  describe('In security functions', function(){

      it('should get auth token from correct local storage key', function(){
          var testValue = 'test_value';
          localStorage.setItem('trello_token', testValue);
          expect(Trelloservice.getLocalToken()).toEqual(testValue);
      });

      it('should say user is not logged when there is no trello token', function(){
          localStorage.setItem('trello_token', null);
          expect(Trelloservice.isUserLogged()).toBe(false);
      });

      it('should say user is logged when there is trello token', function(){
          localStorage.setItem('trello_token', 'whatever');
          expect(Trelloservice.isUserLogged()).toBe(true);
      });

      it('should call correctly the Trello authorize function', function(){
          spyOn(Trello, 'authorize');

          Trelloservice.authorize();
          expect(Trello.authorize.calls.count()).toEqual(1);

          var args = Trello.authorize.calls.argsFor(0)[0];
          expect(args.type).toEqual('popup');
          expect(args.name).toEqual('TrelloGantt');
          expect(args.scope).toEqual({read:true, write:true, account:false});

      });

      it('should call the Trello deauthorize function', function(){
          spyOn(Trello, 'deauthorize');
          Trelloservice.deauthorize();
          expect(Trello.deauthorize).toHaveBeenCalled();
      });
  });

  describe('In get boards', function(){

      it('should call correctly the Trello get', function(){
          spyOn(Trello, 'get');
          localStorage.setItem('trello_token', token);

          Trelloservice.getBoards();
          expect(Trello.get.calls.count()).toEqual(1);

          var args = Trello.get.calls.argsFor(0);
          expect(args[0]).toEqual('members/me/boards');
          expect(args[1]).toEqual({filter:'open', token: token});
      });

      it('should return promise value', function(){
          var randomData = 'data:' + Math.random();
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
              successFunc(randomData);
          });
          Trelloservice.getBoards().then(function(data){
              expect(data).toEqual(randomData);
          });
          rootScope.$digest();
      });

      it('should log error', function(){
          var randomData = 'data:' + Math.random();
          spyOn(console, 'error');
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
              errorFunc(randomData);
          });
          Trelloservice.getBoards();
          rootScope.$digest();

          expect(console.error.calls.count()).toEqual(1);
          expect(console.error).toHaveBeenCalledWith(randomData);
      });
  });

  describe('in getOrganizations', function(){
      it('should call correctly the Trello get', function(){
          spyOn(Trello, 'get');
          localStorage.setItem('trello_token', token);

          Trelloservice.getOrganizations();
          expect(Trello.get.calls.count()).toEqual(1);

          var args = Trello.get.calls.argsFor(0);
          expect(args[0]).toEqual('members/me/organizations');
          expect(args[1]).toEqual({token: token});
      });

      it('should return promise value', function(){
          var randomData = 'data:' + Math.random();
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
              successFunc(randomData);
          });
          Trelloservice.getOrganizations().then(function(data){
              expect(data).toEqual(randomData);
          });
          rootScope.$digest();
      });

      it('should log error', function(){
          var randomData = 'data:' + Math.random();
          spyOn(console, 'error');
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
              errorFunc(randomData);
          });
          Trelloservice.getOrganizations();
          rootScope.$digest();

          expect(console.error.calls.count()).toEqual(1);
          expect(console.error).toHaveBeenCalledWith(randomData);
      });

  });

  describe('in getBoardInfo', function(){
      it('should call correctly the Trello get', function(){
          spyOn(Trello, 'get');
          localStorage.setItem('trello_token', token);

          var boardID = Math.random();

          Trelloservice.getBoardInfo(boardID);
          expect(Trello.get.calls.count()).toEqual(1);

          var args = Trello.get.calls.argsFor(0);
          expect(args[0]).toEqual('boards/'+boardID);
          expect(args[1]).toEqual({token: token, members: 'all'});
      });

      it('should return promise value', function(){
          var randomData = 'data:' + Math.random();
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
              successFunc(randomData);
          });
          Trelloservice.getBoardInfo(0).then(function(data){
              expect(data).toEqual(randomData);
          });
          rootScope.$digest();
      });

      it('should log error', function(){
          var randomData = 'data:' + Math.random();
          spyOn(console, 'error');
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
              errorFunc(randomData);
          });
          Trelloservice.getBoardInfo(1);
          rootScope.$digest();

          expect(console.error.calls.count()).toEqual(1);
          expect(console.error).toHaveBeenCalledWith(randomData);
      });

  });

  describe('in getCardsFromBoard', function(){
      it('should call correctly the Trello get', function(){
          spyOn(Trello, 'get');
          localStorage.setItem('trello_token', token);

          var boardID = Math.random();

          Trelloservice.getCardsFromBoard(boardID);
          expect(Trello.get.calls.count()).toEqual(1);

          var args = Trello.get.calls.argsFor(0);
          expect(args[0]).toEqual('boards/'+boardID+'/lists/');
          expect(args[1]).toEqual({
					cards:'open',
					filter:'open',
					fields: 'name',
					token: token
				});
      });

      it('should return promise value', function(){
          var randomData = 'data:' + Math.random();
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
              successFunc(randomData);
          });
          Trelloservice.getCardsFromBoard(0).then(function(data){
              expect(data).toEqual(randomData);
          });
          rootScope.$digest();
      });

      it('should log error', function(){
          var randomData = 'data:' + Math.random();
          spyOn(console, 'error');
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
              errorFunc(randomData);
          });
          Trelloservice.getCardsFromBoard(1);
          rootScope.$digest();

          expect(console.error.calls.count()).toEqual(1);
          expect(console.error).toHaveBeenCalledWith(randomData);
      });

  });

  describe('in getBoardMembers', function(){
      it('should call correctly the Trello get', function(){
          spyOn(Trello, 'get');
          localStorage.setItem('trello_token', token);

          var boardID = Math.random();

          Trelloservice.getBoardMembers(boardID);
          expect(Trello.get.calls.count()).toEqual(1);

          var args = Trello.get.calls.argsFor(0);
          expect(args[0]).toEqual('boards/'+boardID+'/members/');
          expect(args[1]).toEqual({token: token});
      });

      it('should return promise value', function(){
          var randomData = 'data:' + Math.random();
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
              successFunc(randomData);
          });
          Trelloservice.getBoardMembers(0).then(function(data){
              expect(data).toEqual(randomData);
          });
          rootScope.$digest();
      });

      it('should log error', function(){
          var randomData = 'data:' + Math.random();
          spyOn(console, 'error');
          spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
              errorFunc(randomData);
          });
          Trelloservice.getBoardMembers(1);
          rootScope.$digest();

          expect(console.error.calls.count()).toEqual(1);
          expect(console.error).toHaveBeenCalledWith(randomData);
      });

  });

  describe('in card functions', function(){
      var card = {};
      beforeEach(function(){
          card.id = Math.random();
          card.name = '' + Math.random();
          card.due = new Date(new Date() * Math.random());
      });

      describe('in getCardData', function(){
          it('should call correctly the Trello get', function(){
              spyOn(Trello, 'get');
              localStorage.setItem('trello_token', token);

              Trelloservice.getCardData(card);
              expect(Trello.get.calls.count()).toEqual(1);

              expect(Trello.get.calls.argsFor(0)[0]).toEqual('cards/'+card.id + '/actions');
              expect(Trello.get.calls.argsFor(0)[1]).toEqual({token: token});
          });

          it('should return promise value', function(){
              var randomData = 'data:' + Math.random();
              spyOn(Trello, 'get').and.callFake(function(url, params, successFunc){
                  successFunc(randomData);
              });
              Trelloservice.getCardData(card).then(function(data){
                  expect(data).toEqual(randomData);
              });
              rootScope.$digest();
          });

          it('should log error', function(){
              var randomData = 'data:' + Math.random();
              spyOn(console, 'error');
              spyOn(Trello, 'get').and.callFake(function(url, params, successFunc, errorFunc){
                  return errorFunc(randomData);
              });
              Trelloservice.getCardData(card);
              rootScope.$digest();

              expect(console.error.calls.count()).toEqual(1);
              expect(console.error).toHaveBeenCalledWith(randomData);
          });

      });

      describe('in updateCard', function(){
          it('should call correctly the Trello get', function(){
              spyOn(Trello, 'put');
              localStorage.setItem('trello_token', token);

              Trelloservice.updateCard(card);
              expect(Trello.put.calls.count()).toEqual(1);

              expect(Trello.put.calls.argsFor(0)[0]).toEqual('cards/'+card.id);
              expect(Trello.put.calls.argsFor(0)[1]).toEqual({
		  name: card.name,
		  due: card.due,
		  token: token
	      });
          });

          it('should return promise value', function(){
              var randomData = 'data:' + Math.random();
              spyOn(Trello, 'put').and.callFake(function(url, params, successFunc){
                  successFunc(randomData);
              });
              Trelloservice.updateCard(card).then(function(data){
                  expect(data).toEqual(randomData);
              });
              rootScope.$digest();
          });

          it('should log error', function(){
              var randomData = 'data:' + Math.random();
              spyOn(console, 'error');
              spyOn(Trello, 'put').and.callFake(function(url, params, successFunc, errorFunc){
                  return errorFunc(randomData);
              });
              Trelloservice.updateCard(card);
              rootScope.$digest();

              expect(console.error.calls.count()).toEqual(1);
              expect(console.error).toHaveBeenCalledWith(randomData);
          });
      });
  });
});
