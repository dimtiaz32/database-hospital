'use strict';

angular.module('myApp.NursesCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nurses', {
    templateUrl: 'nurses/nurses.html',
    controller: 'NursesCtrl'
  });
}])

.controller('NursesCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

  var HOST = 'http://localhost:3000';

  $scope.nurses = [];
  $scope.selectedNurse = {};
  $scope.newNurse = {
    fname: 'John',
    lname: 'Smith'
  };

  //Filter Stuff
  $scope.wards = [];
  $scope.selectedWard;

  //Search Stuff
  $scope.fnameSearch;
  $scope.lnameSearch;

  //load functions
  $scope.loadNurses = function() {
    $http.get(HOST + '/api/nurses')
      .then(function(response){
        $scope.nurses = response.data.data;
        $scope.selectedNurse = $scope.nurses[0];
        $scope.selectNurse($scope.selectedNurse);
      },
      function(error){
        console.log(error);
      });
  }

  $scope.selectNurse = function(nurse) {
    $scope.selectedNurse = nurse;

    //get the wards for the nurse
    $http.get(HOST + '/api/nurseWards/' + nurse.nid)
      .then(function(response) {
        $scope.selectedNurse.wards = response.data.data;
      },
      function(error) {
        console.log(error);
      });

  }

  $scope.addNurse = function() {
    $http.post("http://localhost:3000/api/nurses",{
      fname: $scope.newNurse.fname,
      lname: $scope.newNurse.lname
    },{
      method: "POST"
    })
      .then(function(response) {
        $scope.loadNurses();
      },
      function(error) {
        console.log("ERROR OCCURRED");
        console.log(error);
      });
  }

  $scope.filterNurses = function() {
    $http.post(HOST + '/api/filteredNurses', {
      wid: $scope.selectedWard.wid
    })
      .then(function(response) {
        $scope.nurses = response.data.data;
      },
      function(error) {
        console.log(error);
      });
  }

  $scope.searchNurses = function() {
    $http.post(HOST + '/api/searchNurses', {
      fnamesearch: $scope.fnameSearch,
      lnamesearch: $scope.lnameSearch
    })
      .then(function(response) {
        $scope.nurses = response.data.data;
      }, function(error) {
        console.log(error);
      });
  }

  $scope.loadWards = function() {
    $http.get(HOST + '/api/wards')
      .then(function(response) {
        $scope.wards = response.data.data;
        $scope.wards.push({wid:0, wname:'None'});
      },
      function(error) {
        console.log("ERROR: " + error);
      });
  }

  //Functions to call on startup
  $scope.loadNurses();
  $scope.loadWards();



  $scope.showWorksInDialog = function($event) {
      // var parentEl = angular.element(document.querySelector());
       $mdDialog.show({
         //parent: parentEl,
         targetEvent: $event,
         template:
         '<form ng-submit="createWorksIn()">' +
           '<md-dialog aria-label="Add Treatment" style="height:500; width:500;">' +
           '<md-dialog-content style="height: 225px; width:400; text-align:center;">'+
           '<h1 style="text-align:center; color:grey;">Add to Ward</h1>'+
              '<md-input-container>' +
               '<label>Ward</label>' +
                '<md-select ng-model="sWard">' +
                  '<md-option ng-value="ward" ng-repeat="ward in actualWards">{{ward.wname}}</md-option>' +
                '</md-select>' +
               '</md-input-container>' +
           '  </md-dialog-content>' +
           '  <md-dialog-actions style="text-align:center;">' +
           '    <md-button class="md-primary" type="submit">' +
           '      Create ' +
           '    </md-button>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Close ' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>'+
         '</form>',
         locals: {
           wards: $scope.wards,
           selectNurse: $scope.selectNurse,
           selectedNurse: $scope.selectedNurse
         },
         bindToController: true,
         controllerAs: "ctrl",
         controller: DialogController
      });
      function DialogController($scope, $mdDialog, wards, selectNurse, selectedNurse) {
        $scope.actualWards = wards.slice();
        $scope.actualWards.splice($scope.actualWards.length - 1, 1);

        $scope.sWard;

        $scope.createWorksIn = function() {

          $http.post('http://localhost:3000/api/worksin', {
            nid: selectedNurse.nid,
            wid: $scope.sWard.wid
          })
            .then(function(response) {
              console.log("Added worksin");
              selectNurse(selectedNurse);
              $mdDialog.hide();
            },
            function(error) {
              console.log(error);
            });

        }

        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }


}]);
