'user strict'

angular.module('myApp.WardsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wards', {
    templateUrl: 'wards/wards.html',
    controller: 'WardsCtrl',
    css: 'wards/wards.css'
  });
}])

.controller('WardsCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

  var SERVER_HOST = 'http://localhost:3000';

  $scope.wards = [];

  //function that gets the patients for a ward
  function getPatients(index, wid) {
    $http.get(SERVER_HOST + '/api/wardPatients/' + wid)
      .then(function(response) {
        $scope.wards[index].patients = response.data.data;
        console.log($scope.wards[index].patients);
        console.log(wid);
        console.log(response.data);
      }, function(error) {
        console.log(error);
        return undefined;
      });
  }

  //function that gets the nurses for a ward
  function getNurses(index, wid) {
    $http.get(SERVER_HOST + '/api/wardNurses/' + wid)
      .then(function(response) {
        $scope.wards[index].nurses = response.data.data;
        //console.log($scope.wards[index].nurses);
      }, function(error) {
        console.log(error);
      });
  }

  //function that loads wards
  $scope.loadWards = function() {
    $http.get(SERVER_HOST + '/api/wards')
      .then(function(response) {
        $scope.wards = response.data.data;

        //Now get the patients and nurses for each ward
        for (var i = 0; i < $scope.wards.length; i+=1) {
          getPatients(i, $scope.wards[i].wid);
          getNurses(i, $scope.wards[i].wid);
        }

      },
      function(error) {
        console.log("ERROR: " + error);
      });
  }


  //functions to call on startup
  $scope.loadWards();


  //This function manages the dialog to create a ward
  $scope.showWardsDialog = function($event) {
      // var parentEl = angular.element(document.querySelector());
       $mdDialog.show({
         //parent: parentEl,
         targetEvent: $event,
         template:
         '<form ng-submit="createWard()">' +
           '<md-dialog aria-label="Add Ward" style="height:500; width:500;">' +
           '<md-dialog-content style="height: 225px; width:400; text-align:center;">'+
           '<br>'+
           '<h1 style="text-align:center; color:grey;">Create Ward</h1>'+
               '<md-input-container>' +
                 '<label>Ward</label>' +
                 '<input class="mdl-textfield__input" type="text" ng-model="newWardName" required>' +
                 '<div ng-messages="$error">' +
                  ' <div ng-message="required">This is required!</div>' +
                 '</div>' +
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
           loadWards: $scope.loadWards
         },
         bindToController: true,
         controllerAs: "ctrl",
         controller: DialogController
      });
      function DialogController($scope, $mdDialog, loadWards) {

        $scope.newWardName;

        $scope.createWard = function() {
          $http.post('http://localhost:3000/api/wards', {
            wname: $scope.newWardName
          })
            .then(function(response) {
              loadWards();
              $mdDialog.hide();
            }, function(error) {
              console.log(error);
            });
        }

        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }

}]);
