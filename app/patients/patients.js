'use strict';

angular.module('myApp.PatientsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients', {
    templateUrl: 'patients/patients.html',
    controller: 'PatientsCtrl',
    css: 'patients/patients.css'
  });
}])

.controller('PatientsCtrl', ['$scope', '$http', function($scope, $http) {
  var SERVER_HOST = 'http://localhost:3000'

  $scope.patients = [];
  $scope.selectedPatient = {};
  $scope.newPatient = {
    fname: 'John',
    lname: 'Doe',
    phonenumber: '1234567891',
    pdetails: 'No details'
  };

  $scope.loadPatients = function () {
    $http.get(SERVER_HOST + '/api/patients')
      .then(function(response){
        console.log(response);
        $scope.patients = response.data.data;
        $scope.selectedPatient = $scope.patients[0];
        console.log($scope.patients);
        console.log($scope.patients);
      },
      function(error){
        console.log("ERROR: " + error);
      });
  }

  $scope.selectPatient = function(patient) {
    $scope.selectedPatient = patient;
    console.log("NEW PATIENT SELECTED");
  }


  $scope.addPatient = function() {
    $http.post(SERVER_HOST + '/api/patients', {
      fname: $scope.newPatient.fname,
      lname: $scope.newPatient.lname,
      phonenumber: $scope.newPatient.phonenumber,
      pdetails: $scope.newPatient.pdetails
    },
    {
        method: 'POST'
    })
      .then(function(response) {
        console.log('Patient successflly created');
      },
      function(error) {
        console.log("ERROR: " + error);
      });
      $scope.loadPatients();
  }

  //Stuff to do on startup
  $scope.loadPatients();

}]);
