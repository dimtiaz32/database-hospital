'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.PatientsCtrl'));

  describe('patients controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var patientsCtrl = $controller('PatientsCtrl');
      expect(patientsCtrl).toBeDefined();
    }));

  });
});
