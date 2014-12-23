'use strict';

describe('Service: Trelloservice', function () {

  // load the service's module
  beforeEach(module('trelloGanttApp.trello'));

  // instantiate service
  var Trelloservice;

  beforeEach(inject(function (_Trelloservice_) {
    Trelloservice = _Trelloservice_;
  }));

  it('should get auth token from correct local storage key', function(){
      var test_value = 'test_value';
      localStorage.setItem('trello_token', test_value);
      expect(Trelloservice.getLocalToken()).toEqual(test_value);
  });

  it('should say user is not logged when there is no trello token', function(){
      localStorage.setItem('trello_token', null);
      expect(Trelloservice.isUserLogged()).toBe(false);
  });

  it('should say user is logged when there is trello token', function(){
      localStorage.setItem('trello_token', 'whatever');
      expect(Trelloservice.isUserLogged()).toBe(true);
  });

  it('should call correctly the authorize function', function(){
      spyOn(Trello, 'authorize');

      Trelloservice.authorize();
      expect(Trello.authorize.calls.length).toEqual(1);

      var args = Trello.authorize.calls[0].args[0];
      expect(args.type).toEqual('popup');
      expect(args.name).toEqual('TrelloGantt');
      expect(args.scope).toEqual({read:true, write:true, account:false});

  });

});
