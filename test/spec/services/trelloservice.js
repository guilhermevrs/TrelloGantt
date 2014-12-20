'use strict';

describe('Service: Trelloservice', function () {

  // load the service's module
  beforeEach(module('trelloGanttApp.trello'));

  // instantiate service
  var Trelloservice;
  beforeEach(inject(function (_Trelloservice_) {
    Trelloservice = _Trelloservice_;
  }));

  it('should do something', function () {
    expect(!!Trelloservice).toBe(true);
  });

  it('should get auth token from correct local storage key', function(){
      var test_value = 'test_value';
      localStorage.setItem('trello_token', test_value);
      expect(Trelloservice.getLocalToken()).toEqual(test_value);
  });

});
