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

  //variables for the patient data and the ui data
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
      //  $scope.selectedPatient = $scope.patients[0];
      //  $scope.selectPatient($scope.selectedPatient);
      },
      function(error){
        console.log(error);
      });
  }

  //function to set up what is shown in the patient detail view
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

  //function to create a new patient
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
        $scope.loadPatients();
      },
      function(error) {
        console.log(error);
      });
      $scope.loadPatients();
  }


  //function to get the possible doctors for the filtering
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

  //function to query server for filtered patients
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

  //function to search patients by name
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

  //function to load all the possible wards for filtering
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


  $scope.dischargePatient = function() {
    //find the current ward
    for (var i = 0; i < $scope.selectedPatient.wards.length; i++) {
      if ($scope.selectedPatient.wards[i].outdate === null || $scope.selectedPatient.wards[i].outdate === undefined) {
        //is currently in a room
        var ward = $scope.selectedPatient.wards[i];

        $http.put(SERVER_HOST + '/api/staysin', {
          pid: ward.pid,
          wid: ward.wid,
          indate: ward.indate,
          room: ward.room
        })
          .then(function(response) {
            console.log('discharged patient');
            $scope.loadPatients();
          }, function(err) {
            console.log(err);
          });
      }
    }
  }

  //Stuff to do on startup
  $scope.loadPatients();
  $scope.loadDoctors();
  $scope.loadWards();

  //The rest of the funtions are fo handling the various dialogs on the patients page
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
             '<md-dialog-content style="height: 250px; width:400; text-align:center;">'+
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
                 '<p style="color:red;">{{error}}</p>'+
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

          $scope.error = "";

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
                $scope.error = "Room in use";
                //$mdDialog.hide();
              });

          }

          $scope.closeDialog = function() {
            $mdDialog.hide();
          }
        }
      }

      $scope.showUpdatePatientDialog = function($event) {
          // var parentEl = angular.element(document.querySelector());
           $mdDialog.show({
             //parent: parentEl,
             targetEvent: $event,
             template:
             '<form ng-submit="updatePatient()" style="height: 550px; width:500px;">' +
               '<md-dialog aria-label="Update Patient">' +
               '<md-dialog-content style="height: 550px; width:400px; text-align:center;">'+
               '<h1 style="text-align:center; color:grey;">Admit to Ward</h1>'+
                  '<md-input-container>' +
                    '<label>First Name</label>' +
                    '<input class="mdl-textfield__input" type="text" ng-model="fname" required>' +
                    '<div ng-messages="$error">' +
                     ' <div ng-message="required">This is required!</div>' +
                    '</div>' +
                  '</md-input-container>' +
                   '<md-input-container>' +
                     '<label>Last Name</label>' +
                     '<input class="mdl-textfield__input" type="text" ng-model="lname" required>' +
                     '<div ng-messages="$error">' +
                      ' <div ng-message="required">This is required!</div>' +
                     '</div>' +
                   '</md-input-container>' +
                   '<md-input-container>' +
                     '<label>Phone Number</label>' +
                     '<input class="mdl-textfield__input" type="text" ng-model="phonenumber" required>' +
                     '<div ng-messages="$error">' +
                      ' <div ng-message="required">This is required!</div>' +
                     '</div>' +
                   '</md-input-container>' +
                   '<md-input-container>' +
                     '<label>Details</label>' +
                     '<input class="mdl-textfield__input" type="text" ng-model="pdetails" required>' +
                     '<div ng-messages="$error">' +
                      ' <div ng-message="required">This is required!</div>' +
                     '</div>' +
                   '</md-input-container>' +
               '  </md-dialog-content>' +
               '  <md-dialog-actions style="text-align:center;">' +
               '    <md-button class="md-primary" type="submit">' +
               '      Change ' +
               '    </md-button>' +
               '    <md-button ng-click="closeDialog()" class="md-primary">' +
               '      Close ' +
               '    </md-button>' +
               '  </md-dialog-actions>' +
               '</md-dialog>'+
             '</form>',
             locals: {
               selectPatient: $scope.selectPatient,
               selectedPatient: $scope.selectedPatient,
               loadPatients: $scope.loadPatients
             },
             bindToController: true,
             controllerAs: "ctrl",
             controller: DialogController
          });
          function DialogController($scope, $mdDialog, selectPatient, selectedPatient, loadPatients) {

              $scope.pid = selectedPatient.pid;
              $scope.fname =  selectedPatient.fname;
              $scope.lname =  selectedPatient.lname;
              $scope.phonenumber =  selectedPatient.phonenumber;
              $scope.pdetails =  selectedPatient.pdetails;

            $scope.updatePatient = function() {
              $http.put('http://localhost:3000/api/patients/' + $scope.pid, {
                pid: $scope.pid,
                fname: $scope.fname,
                lname: $scope.lname,
                phonenumber: $scope.phonenumber,
                pdetails: $scope.pdetails
              })
                .then(function(response) {
                  loadPatients();
                  selectedPatient.pid = $scope.pid;
                  selectedPatient.fname = $scope.fname;
                  selectedPatient.lname = $scope.lname;
                  selectedPatient.phonenumber = $scope.phonenumber;
                  selectedPatient.pdetails = $scope.pdetails;

                  selectPatient(selectedPatient);

                  $mdDialog.hide();
                }, function(err) {
                  console.log($scope.pid);
                  console.log(selectedPatient.pid);
                  console.log(err);
                });
            }


            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
          }
        }


        $scope.showBillDialog = function($event) {
            // var parentEl = angular.element(document.querySelector());
             $mdDialog.show({
               //parent: parentEl,
               targetEvent: $event,
               template:
                 '<md-dialog aria-label="Add Treatment" style="height:500; width:500;">' +
                 '<md-dialog-content style="height: 325px; width:400; text-align:center;">'+
                 '<br>'+
                 '<h1 style="text-align:center; color:grey;">Bill</h1>'+
                 '<table class="mdl-data-table mdl-js-data-table" style="margin-top:10px;">'+
                   '<thead>'+
                     '<tr>'+
                       '<th class="mdl-data-table__cell--non-numeric">Ward</th>'+
                       '<th class="mdl-data-table__cell--non-numeric">Room</th>'+
                       '<th class="mdl-data-table__cell--non-numeric">In</th>'+
                       '<th class="mdl-data-table__cell--non-numeric">Out</th>'+
                       '<th class="mdl-data-table__cell--non-numeric">Price</th>'+
                     '</tr>'+
                   '</thead>'+
                   '<tbody>'+
                     '<tr ng-repeat="ward in doneWards">'+
                       '<td class="mdl-data-table__cell--non-numeric">{{ward.wname}}</td>'+
                       '<td class="mdl-data-table__cell--non-numeric">{{ward.room}}</td>'+
                       '<td class="mdl-data-table__cell--non-numeric">{{ward.indate.substring(0,10)}}</td>'+
                       '<td class="mdl-data-table__cell--non-numeric">{{ward.outdate.substring(0,10)}}</td>'+
                       '<td class="mdl-data-table__cell--non-numeric">{{rate}}</td>'+
                     '</tr>'+
                   '</tbody>'+
                 '</table>'+
                 '<h1 style="text-align:center; color:green;">${{sum}}</h1>'+
                 '  </md-dialog-content>' +
                 '  <md-dialog-actions style="text-align:center;">' +
                 '    <md-button class="md-primary" type="submit">' +
                 '      Create ' +
                 '    </md-button>' +
                 '    <md-button ng-click="closeDialog()" class="md-primary">' +
                 '      Close ' +
                 '    </md-button>' +
                 '  </md-dialog-actions>' +
                 '</md-dialog>',
               locals: {
                 selectedPatient: $scope.selectedPatient
               },
               bindToController: true,
               controllerAs: 'ctrl',
               controller: DialogController
            });
            function DialogController($scope, $mdDialog, selectedPatient) {

              $scope.sum = 0.0;
              $scope.rate = 25.00;
              var ONE_DAY = 24 * 60 * 60 * 1000;
              $scope.doneWards = [];

              //got through the staysin history and
              console.log(selectedPatient.wards.length);
              for (var j = 0; j < selectedPatient.wards.length; j++) {

                if (selectedPatient.wards[j].outdate !== null && selectedPatient.wards[j].outdate !== undefined) {
                  //get days
                  var indate = new Date(selectedPatient.wards[j].indate);
                  var outdate = new Date(selectedPatient.wards[j].outdate);

                  $scope.sum += Math.round(Math.abs((outdate.getTime() - indate.getTime()) / ONE_DAY));
                  $scope.doneWards.push(selectedPatient.wards[j]);
                }
              }

              $scope.sum *= $scope.rate;

              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          }

}]);
