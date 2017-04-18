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
    phonenumber: '1234567890',
    pdetails: 'No details'
  };

  //Filter stuff
  $scope.doctors = [];
  $scope.selectedDoctor = { did:0 };
  $scope.wards = [];
  $scope.selectedWard = { wid:0 };

  //Search Stuff
  $scope.fnameSearch;
  $scope.lnameSearch;

  $scope.loadPatients = function () {
    $http.get(SERVER_HOST + '/api/patients')
      .then(function(response){
        $scope.patients = response.data.data;
        $scope.selectedPatient = $scope.patients[0];
      },
      function(error){
        console.log("ERROR: " + error);
      });
  }

  $scope.selectPatient = function(patient) {
    $scope.selectedPatient = patient;
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

  $scope.loadDoctors = function () {
    $http.get(SERVER_HOST + '/api/doctors')
      .then(function(response){
        $scope.doctors = response.data.data;
        $scope.doctors.push({did: 0, fname: 'None', lname: ''});
        console.log($scope.doctors);
      },
      function(error){
        console.log("ERROR: " + error);
      });
  }

  $scope.getSelectedDoctor = function() {
    console.log($scope.selectedDoctor.did);
  }

  $scope.filterPatients = function() {
    $http.post(SERVER_HOST + '/api/filteredPatients', {
      did: $scope.selectedDoctor.did,
      wid: $scope.selectedWard.wid
    },
    {
      method: 'POST',
    })
      .then(function(response) {
        $scope.patients = response.data.data;
        console.log("PATIENTS: " + $scope.patients);
      })
      .catch(function(error) {
        console.log("ERROR: " + error);
      });
  }

  $scope.searchPatients = function() {
    $http.post(SERVER_HOST + '/api/searchPatients', {
      fnamesearch: $scope.fnameSearch,
      lnamesearch: $scope.lnameSearch
    },
    {
      method: 'POST'
    })
      .then(function(response) {
        $scope.patients = response.data.data;
        console.log("PATIENTS: " + $scope.patients);
      })
      .catch(function(error) {
        console.log("ERRROR: " + error);
      });
  }

  $scope.loadWards = function() {
    $http.get(SERVER_HOST + '/api/wards')
      .then(function(response) {
        $scope.wards = response.data.data;
        $scope.wards.push({wid:0, wname:'None'});
      })
      .catch(function(error) {
        console.log("ERROR: " + error);
      });
  }

  $scope.getSelectedWard = function() {
    console.log($scope.selectedWard.wid);
  }

  //Stuff to do on startup
  $scope.loadPatients();
  $scope.loadDoctors();
  $scope.loadWards();

}]);
