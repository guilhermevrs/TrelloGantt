'use strict';

describe('Controller: ChartctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('trelloGanttApp'));

  var ChartctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChartctrlCtrl = $controller('ChartctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
