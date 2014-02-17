'use strict';

describe('Service: Trelloservice', function () {

  // load the service's module
  beforeEach(module('trelloGanttApp'));

  // instantiate service
  var Trelloservice;
  beforeEach(inject(function (_Trelloservice_) {
    Trelloservice = _Trelloservice_;
  }));

  it('should do something', function () {
    expect(!!Trelloservice).toBe(true);
  });

});
