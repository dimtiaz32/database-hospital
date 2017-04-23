'use strict';

angular.module('myApp.PatientsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients', {
    templateUrl: 'patients/patients.html',
    controller: 'PatientsCtrl',
    css: 'patients/patients.css'
  });
}])

.controller('PatientsCtrl', ['$scope', '$http', '$mdDialog', '$window', function($scope, $http, $mdDialog, $window) {
  var SERVER_HOST = 'http://localhost:3000';

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
        $scope.selectPatient($scope.selectedPatient);
      },
      function(error){
        console.log(error);
      });
  }

  $scope.selectPatient = function(patient) {
    $scope.selectedPatient = patient;

    //Get the doctors and treatment for the patients
    $http.get(SERVER_HOST + "/api/patientDoctors/" + patient.pid)
      .then(function(response) {
        //console.log(response.data.data);
        $scope.selectedPatient.treatments = response.data.data;
      },
      function(error) {
        console.log(error);
      });

    //Get the wards for the patients
    $http.get(SERVER_HOST + '/api/patientWards/' + patient.pid)
      .then(function(response) {
        //console.log(response.data.data);
        $scope.selectedPatient.wards = response.data.data;
      },
      function(error) {
        console.log(error);
      });
  }


  $scope.addPatient = function() {

    console.log("DO NOTHING");

    // Set the Content-Type
    // $http.defaults.headers.post["Content-Type"] = "application/json";
    // console.log("ADDING PATIENT");
    var req = {
      url: SERVER_HOST + '/api/patients',
      method: 'POST',
      data: JSON.stringify({
        fname: $scope.newPatient.fname,
        lname: $scope.newPatient.lname,
        phonenumber: $scope.newPatient.phonenumber,
        pdetails: $scope.newPatient.pdetails
      })
    };

    $http(req)
      .then(function(response) {
        console.log(response);
        console.log('Patient successflly created');
      },
      function(error) {
        console.log(error);
      });
      $scope.loadPatients();
  }

  $scope.loadDoctors = function () {
    $http.get(SERVER_HOST + '/api/doctors')
      .then(function(response){
        $scope.doctors = response.data.data;
        $scope.doctors.push({did: 0, fname: 'None', lname: ''});
        //console.log($scope.doctors);
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
      },
      function(error) {
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
      },
      function(error) {
        console.log("ERRROR: " + error);
      });
  }

  $scope.loadWards = function() {
    $http.get(SERVER_HOST + '/api/wards')
      .then(function(response) {
        $scope.wards = response.data.data;
        $scope.wards.push({wid:0, wname:'None'});
      },
      function(error) {
        console.log("ERROR: " + error);
      });
  }

  $scope.getSelectedWard = function() {
    console.log($scope.selectedWard.wid);
  }

  $scope.sayHello = function() {
    console.log('HELLO');
  }

  //Stuff to do on startup
  $scope.loadPatients();
  $scope.loadDoctors();
  $scope.loadWards();

  $scope.showTreatmentDialog = function($event) {
      // var parentEl = angular.element(document.querySelector());
       $mdDialog.show({
         //parent: parentEl,
         targetEvent: $event,
         template:
         '<form ng-submit="createTreatment()">' +
           '<md-dialog aria-label="Add Treatment" style="height:500; width:500;">' +
           '<md-dialog-content style="height: 325px; width:400; text-align:center;">'+
           '<h1 style="text-align:center; color:grey;">Add Treatment</h1>'+
            '<div class="row">'+
              '<md-input-container>' +
               '<label>Doctor</label>' +
                '<md-select ng-model="sTreatDoctor">' +
                  '<md-option ng-value="doctor" ng-repeat="doctor in actualDoctors">{{doctor.fname}} {{doctor.lname}}</md-option>' +
                '</md-select>' +
               '</md-input-container>' +
            '</div>'+
               '<md-input-container>' +
                 '<label>Disease</label>' +
                 '<input class="mdl-textfield__input" type="text" ng-model="newTreatment.dname" required>' +
                 '<div ng-messages="$error">' +
                  ' <div ng-message="required">This is required!</div>' +
                 '</div>' +
               '</md-input-container>' +
               '<md-input-container>' +
                 '<label>Treatment</label>' +
                 '<input class="mdl-textfield__input" type="text" ng-model="newTreatment.treatment" required>' +
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
           doctors: $scope.doctors,
           pid: $scope.selectedPatient.pid,
           selectPatient: $scope.selectPatient,
           selectedPatient: $scope.selectedPatient
         },
         bindToController: true,
         controllerAs: "ctrl",
         controller: DialogController
      });
      function DialogController($scope, $mdDialog, doctors, pid, selectPatient, selectedPatient) {
        $scope.actualDoctors = doctors.slice();
        $scope.actualDoctors.splice($scope.actualDoctors.length - 1, 1);

        $scope.sTreatDoctor;

        $scope.newTreatment = {
          dname: '',
          treatment: ''
        };

        $scope.createTreatment = function() {
          console.log("CREATING TREAMENT");
          console.log($scope.sTreatDoctor.did);

          $http.post(SERVER_HOST + '/api/treatments', {
            pid: pid,
            did: $scope.sTreatDoctor.did,
            dname: $scope.newTreatment.dname,
            treatment: $scope.newTreatment.treatment
          })
            .then(function(response) {
              console.log("Added treatment");
              selectPatient(selectedPatient);
            },
            function(error) {
              console.log(error);
            });

          $mdDialog.hide();
        }

        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }

    $scope.showStaysInDialog = function($event) {
        // var parentEl = angular.element(document.querySelector());
         $mdDialog.show({
           //parent: parentEl,
           targetEvent: $event,
           template:
           '<form ng-submit="createStaysIn()">' +
             '<md-dialog aria-label="Add Treatment" style="height:500; width:500;">' +
             '<md-dialog-content style="height: 225px; width:400; text-align:center;">'+
             '<h1 style="text-align:center; color:grey;">Admit to Ward</h1>'+
              '<div class="row">'+
                '<md-input-container>' +
                 '<label>Ward</label>' +
                  '<md-select ng-model="sWard">' +
                    '<md-option ng-value="ward" ng-repeat="ward in actualWards">{{ward.wname}}</md-option>' +
                  '</md-select>' +
                 '</md-input-container>' +
              '</div>'+
                 '<md-input-container>' +
                   '<label>Room</label>' +
                   '<input class="mdl-textfield__input" type="number" ng-model="newWard.room" required>' +
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
             wards: $scope.wards,
             pid: $scope.selectedPatient.pid,
             selectPatient: $scope.selectPatient,
             selectedPatient: $scope.selectedPatient
           },
           bindToController: true,
           controllerAs: "ctrl",
           controller: DialogController
        });
        function DialogController($scope, $mdDialog, wards, pid, selectPatient, selectedPatient) {
          $scope.actualWards = wards.slice();
          $scope.actualWards.splice($scope.actualWards.length - 1, 1);

          $scope.sWard;

          $scope.newWard = {};

          $scope.createStaysIn = function() {
            console.log("CREATING STAYSIN");
            console.log($scope.sWard.wid);

            $http.post(SERVER_HOST + '/api/staysin', {
              pid: pid,
              wid: $scope.sWard.wid,
              room: $scope.newWard.room
            })
              .then(function(response) {
                console.log("Added staysin");
                selectPatient(selectedPatient);
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
