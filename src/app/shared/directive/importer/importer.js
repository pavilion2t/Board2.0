export function importer($state,$stateParams) {
  'ngInject';
  return {
    restrict: 'E',
    template: "<button class='_new' ng-click='open()' style='margin-right:5px'>{{name}}</button>",
    transclude: true,
    scope: {
      onClose: '=',
      service: '@',
      datakey: '@',
      name: '@',
      sample: '@',
      fullsample: '@',
      responseLayer: '@'
    },
    controller: function(ngDialog, $scope) {
      'ngInject';
      $scope.open = function() {

        ngDialog.open({
          template: 'app/shared/directive/importer/importer.html',
          className: 'ngdialog-theme-default ngdialog-theme-mega',
          controller: 'ImporterController',
          scope: $scope

        }).closePromise.then(function (response) {
          $state.go($state.current.name, $stateParams, { reload: true });
          if ( $scope.onClose ) {
            $scope.onClose(response);

          }
        });

      };
    }
  };
}

export function appFilereader($q){
  'ngInject';
  var slice = Array.prototype.slice;

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      closeFunc: '&',
      filedata: '='
    },
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return;

      ngModel.$render = function() {}
      element.bind('click', function(e) {
        scope.filedata = null;
      });
      element.bind('change', function(e) {
        var element = e.target;
        if(!element.value) return;

        element.disabled = true;
        $q.all(slice.call(element.files, 0).map(readFile))
          .then(function(values) {
            if (element.multiple) ngModel.$setViewValue(values);
            else ngModel.$setViewValue(values.length ? values[0] : null);


            element.disabled = false;
          });
        function readFile(file) {
          var deferred = $q.defer();
          var reader = new FileReader()
          reader.onload = function(e) {

            scope.filedata = file;
            deferred.resolve(e.target.result);
          }
          reader.onerror = function(e) {
            element.value = '';
            deferred.reject(e);
          }
          //reader.readAsBinaryString(file);
          reader.readAsText(file);
          return deferred.promise;
        }
      });
    }
  };
}

export class ImporterController {
  constructor(ImportFactory, DashboardFactory, $scope, $state, $stateParams) {
    'ngInject';
    $scope.refreshNew = function(){
      $scope.errors = [];
      $scope.noOfErrors = 0;
      $scope.noOfWarnings = 0;
      $scope.submitted = false;
      $scope.submitting = false;
      $scope.status = 'Waiting';
      $scope.imagefiledata = null;
      $scope.rate = 0;
    };

    $scope.refreshNew();

    $scope.fileNew = function() {
      $scope.data = null;
      $scope.csv = null;
      $scope.filedata = null;
      $scope.imagemodel = null;
      $scope.imagefiledata = null;
      $("#csvFileInput").val("");
      $("#imageFileInput").val("");
    };

    $scope.fileNew();


    var responseLayer = $scope.responseLayer;

    // Show the CSV after choosing the file
    $scope.$watch('data',function(csv){
      if ( csv ) {
        $scope.csv = csv;
        var data = Papa.parse(csv);
        $scope.table = data.data;
        $scope.errors = [];
        $scope.noOfErrors = 0;
        $scope.noOfWarnings = 0;
        $scope.submitted = false;
      }
    });

    function progressUpdater(val) {
      $scope.rate = val;
      $scope.$apply();
    }

    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {
      $scope.errors = [];
      $scope.noOfErrors = 0;
      $scope.noOfWarnings = 0;
      $scope.rate = 0;
      $scope.submitted = true;
      $scope.submitting = true;
      $scope.status = 'Step 1/6: Uploading CSV';
      $scope.step = 1;
      ImportFactory.importCSV($scope.service, $scope.datakey, $scope.filedata, $scope.afterUpload, progressUpdater);
    };



    // Start Validating File
    $scope.afterUpload = function( data ){

      var response = data[responseLayer];
      if ( responseLayer === 'null'){
        response = data;
      }

      if ( data.fail ){
        $scope.submitting = false;
        return;
      }



      $scope.importId = response.id;
      $scope.status = 'Step 2/6: Validating CSV';
      $scope.step = 2;
      $scope.rate = 0;
      $scope.$apply();
      ImportFactory.validateCSV($scope.service, $scope.importId, $scope.continueValidate);
    };

    // Continue
    $scope.continueValidate = function( data ){

      var response = data[responseLayer];
      if ( responseLayer === 'null'){
        response = data;
      }

      if ( data.fail ){
        $scope.submitting = false;
        return;
      }


      $scope.rate = parseFloat(response.validation_progress_rate);

      if ( !$.isEmptyObject(response.humanize_validation_errors) ) {
        for ( var key in response.humanize_validation_errors ) {
          var array = response.humanize_validation_errors[key];
          for (var i = 0; i < array.length; i++) {
            $scope.errors.push({row: key, type: 'error', value: array[i]});
            $scope.noOfErrors++;
          }
        }
      }
      if ( !$.isEmptyObject(response.humanize_validation_warnings) ) {
        for ( var key in response.humanize_validation_warnings ) {
          var array = response.humanize_validation_warnings[key];
          for (var i = 0; i < array.length; i++) {
            $scope.errors.push({row: key, type: 'warning', value: array[i]});
            $scope.noOfWarnings++;
          }
        }
      }




      if ( response.status !== 'validated' ) {
        $scope.status = 'Step 2/6: Validating CSV';
        $scope.$apply();
        ImportFactory.validateCSV($scope.service, $scope.importId, $scope.continueValidate);
      }
      else {
        $scope.step = -1;
        if ( $scope.noOfErrors === 0 ) {
          $scope.getImageUrl();
        }
        else {
          $scope.status = 'Waiting';
          $scope.submitting = false;
          $scope.$apply();
        }
      }


      $scope.$apply();
    };

    $scope.getImageUrl = function( ){

      if ( $scope.imagefiledata ){
        ImportFactory.getImageUrl($scope.service, $scope.importId, $scope.postImage);
        $scope.status = 'Step 3/6: Prepare to upload images';
        $scope.step = -1; //hide the progress bar
        $scope.$apply();
      }
      else {
        $scope.postCSV({success:true});
      }
    };

    $scope.postImageProgressFunction = function(percent){
      $scope.postImageProgress.percentComplete = percent;
      $scope.rate = percent;
      $scope.$apply();
    };

    $scope.postImageProgress = { percentComplete: 0 };


    $scope.postImage = function( data ){
      if ( !data || data.fail ){
        $scope.submitting = false;
        return;
      }

      console.log(data);
      $scope.status = 'Step 4/6: Uploading Image';
      $scope.step = 4;
      $scope.rate = 0;
      $scope.$apply();
      $scope.postImageProgress = { percentComplete: 0 };
      var url = data.upload_url;
      ImportFactory.putImage(url, $scope.imagefiledata, $scope.verifyImage, $scope.postImageProgressFunction);
    };

    $scope.verifyImage = function( data ){
      if ( !data || data.fail ){
        $scope.submitting = false;
        return;
      }
      console.log(data);
      $scope.status = 'Step 5/6: Verify Image';
      $scope.step = -1;
      $scope.rate = 0;
      $scope.$apply();

      if ( data.status !== 'success' ) {
        ImportFactory.verifyImage($scope.service, $scope.importId, $scope.verifyImage);
      }
      else {
        $scope.postCSV( {success:true} );
      }
    };

    $scope.postCSV = function( data ){
      if ( !data || data.fail ){
        $scope.submitting = false;
        return;
      }
      $scope.status = 'Step 6/6: Finalizing Upload';
      $scope.step = 6;
      $scope.rate = 0;
      $scope.$apply();
      ImportFactory.postCSV($scope.service, $scope.importId, $scope.finalized);
    };

    $scope.finalized = function( data ){

      var response = data[responseLayer];
      if ( responseLayer === 'null'){
        response = data;
      }

      $scope.rate = parseFloat(response.validation_progress_rate);

      if ( data.fail ){
        alert( data.textStatus );
        $scope.submitting = false;
        return;
      }
      if ( response.status !== 'imported' ) {
        $scope.status = 'Step 6/6: Finalizing Upload';
        $scope.step = 6;
        $scope.$apply();
        ImportFactory.validateCSV($scope.service, $scope.importId, $scope.finalized);
      }
      else {
        $scope.status = 'Step End: Finalized';
        $scope.submitting = false;
        $scope.step = -1;
        $scope.rate = 0;
        $scope.fileNew();
        $scope.$apply();


        //$scope.closeThisDialog();
        //$state.go($state.current.name, $stateParams, { reload: true });
      }
    };

    $scope.detailShown = false;
    $scope.showDetail = function(){
      $scope.detailShown = true;
    };

    $scope.hideDetail = function(){
      $scope.detailShown = false;
    };


  }
}
