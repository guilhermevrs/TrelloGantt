'use strict';

describe('Service: generalSettings', function () {

  // load the service's module
  beforeEach(module('trelloGanttApp'));

  // instantiate service
  var generalSettings;
  beforeEach(inject(function (_generalSettings_) {
    generalSettings = _generalSettings_;
  }));

  it('should do something', function () {
    expect(!!generalSettings).toBe(true);
  });

});
