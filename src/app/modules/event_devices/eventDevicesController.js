export class EventDevicesController {
  constructor(devices,store,$rootScope, $scope, $state, DashboardFactory, gettextCatalog,EventDevicesFactory) {
    'ngInject';

    $scope.title = 'Event and Devices';
    $scope.positions = [];
    $scope.storeInfoWindowShow = false;
    $scope.deviceInfoWindowShow = false;

    var infowindow = null;

    $scope.storeSelected = function(event, store){

      if ( infowindow !== null ){
        infowindow.close();
        infowindow = null;
      }

      infowindow = new google.maps.InfoWindow();
      var center = new google.maps.LatLng(store.position[0],store.position[1]);
      var content = '<div style="width:300px;height:100px">'+
        '<h3>'+store.title+'</h3>'+
        '<div class="input-checkbox">'+
        '<input type="checkbox" id="checkbox-store-whitelist-enabled-map">'+
        '<label for="checkbox-store-whitelist-enabled-map"></label>'+
        '</div>'+
        '<b translate>Store Whitelist Enabled</b>'+
        '</div>';
      infowindow.setContent(content);
      infowindow.setPosition(center);
      infowindow.open($scope.map);
      setTimeout(function() {
        $("#checkbox-store-whitelist-enabled-map").prop('checked', $scope.store.device_whitelist_enabled);
        $("#checkbox-store-whitelist-enabled-map").on('click', function () {
          var elem = $(this);
          angular.element(elem).scope().changeStoreSettingMap();
        });
      },100);
    };

    $scope.deviceSelected = function(event, device){
      if ( infowindow !== null ){
        infowindow.close();
        infowindow = null;
      }
      infowindow = new google.maps.InfoWindow();
      var center = new google.maps.LatLng(device.position[0],device.position[1]);
      var content =
        '<div class="whitelist-infowindow">'+

        '<div>'+
        '<span>Store Name</span>'+
        '<span class="store">'+device.device.store_title+'</span>'+
        '</div>'+

        '<div>'+
        '<span>ID4Vendor (Keychain)</span>'+
        '<span>'+device.device.identifier_for_vendor+'</span>'+
        '</div>'+

        '<div>'+
        '<span>Device Name</span>'+
        '<span>'+decodeURI(device.title)+'</span>'+
        '</div>'+


        '<div>'+
        '<span>iOS Version</span>'+
        '<span>'+device.device.device_model+'</span>'+
        '</div>'+

        '<div>'+
        '<span>App Version</span>'+
        '<span>'+device.device.app_version+'</span>'+
        '</div>'+

        '</div>'+



        '<div class="input-checkbox">'+
        '<input type="checkbox" id="checkbox-whitelist-enabled-map" data-index="'+device.index+'">'+
        '<label for="checkbox-whitelist-enabled-map"></label>'+
        '</div>'+
        '<b translate>Device Whitelist</b>';

      infowindow.setContent( content );
      infowindow.setPosition(center);
      infowindow.open($scope.map);
      setTimeout(function() {
        $("#checkbox-whitelist-enabled-map").prop('checked', device.device.whitelist);
        $("#checkbox-whitelist-enabled-map").on('click', function () {
          var elem = $(this);
          angular.element(elem).scope().changeWhiteListMap(elem.attr('data-index'));
        });
      },100);
    };


    $scope.mapCenter = ['0','0'];

    $scope.changeStoreSettingMap = function(){
      $scope.store.device_whitelist_enabled = !$scope.store.device_whitelist_enabled;
      $scope.changeStoreSetting();
    };

    $scope.changeWhiteListMap = function(index){
      $scope.devices[index-1].whitelist = !$scope.devices[index-1].whitelist;
      $scope.changeWhiteList($scope.devices[index-1]);

    };

    $scope.loadMarker = function(){
      setTimeout(function(){
        _.each($scope.devices,function(val,index){
          var store_id = val.store_id;
          val.index = index + 1;
          if ( !$scope.deviceStore[store_id] && val.store_lat !== null && val.store_lng !== null ) {
            $scope.deviceStore[store_id] = {};
            $scope.deviceStore[store_id].position = [val.store_lat, val.store_lng];
            $scope.deviceStore[store_id].title = val.store_title;
            $scope.mapCenter =[val.store_lat, val.store_lng];
          }

          if ( val.lat !== null && val.lng !== null ){
            $scope.devicePosition[val.id] = {};

            $scope.devicePosition[val.id].position = [val.lat,val.lng];
            $scope.devicePosition[val.id].device = val;
            $scope.devicePosition[val.id].title = val.device_name;
            $scope.devicePosition[val.id].index = index + 1;
            $scope.devicePosition[val.id].markerindex = Math.min(index + 1,100);
          }


          if ( val.whitelist === null ){
            val.whitelist = false;
          }
        });
        $scope.$apply();

      },1000);
    };

    $scope.$on('mapInitialized', function(event, map) {
      $scope.chicago = map.getCenter();
      $scope.map = map;
      $scope.loadMarker();

    });
    $scope.map = null;
    $scope.checkAll = false;

    $scope.deviceStore = {};
    $scope.devicePosition = {};


    $scope.changeWhiteListAll = function(){
      _.each($scope.devices,function(val){
        val.whitelist = true;
        EventDevicesFactory.putDevices(val);
      });
    };

    $scope.changeWhiteListNone = function(){
      _.each($scope.devices,function(val){
        val.whitelist = false;
        EventDevicesFactory.putDevices(val);
      });
    };

    $scope.changeWhiteList = function(device){
      EventDevicesFactory.putDevices(device).success(function(data){
        console.log('data', data);
        if ( $scope.infowindow !== null ){
          $scope.infowindow.close();
          $scope.infowindow = null;
        }
      }).error(function(err) {
        console.error(err);
        $state.go($state.current.name, null, { reload: true });
        $scope.addErrorMessage = err.message;
      });
    };

    $scope.editDevice = function(device){
      $state.go('app.dashboard.event-devices.view',{device_id:device.id})
    };

    $scope.devices = devices.data.devices;
    $scope.store = store.data.module;


    $scope.changeStoreSetting = function(){
      EventDevicesFactory.putStore($scope.store.device_whitelist_enabled).success(function(data){
        $scope.store = data.module;
      }).error(function(err) {
        console.error(err);
      });
    };




    $scope.deleteDevice = function(device){
      if(confirm('Delete the device?')) {
        EventDevicesFactory.deleteDevices(device).success(function(data){
          $scope.devices = data.devices;

        }).error(function(err) {
          console.error(err);
        });
      }
    };

    $scope.newDevice = function(device){
      $state.go('app.dashboard.event-devices.new');
    };

  }
}

export class EventDevicesViewController {
  constructor($rootScope, $scope, $state, DashboardFactory, gettextCatalog,EventDevicesFactory,$stateParams) {
    'ngInject';

    $scope.editMode = false;

    $scope.newDevice = false;
    // load customer
    EventDevicesFactory.getDevices().success(function(data){
      console.log('data', data);
      $scope.devices = data.devices;
      _.each($scope.devices,function(val){
        if ( $stateParams.device_id === val.id.toString() ){
          $scope.currentDevice = val;
        }
      });
    }).error(function(err) {
      console.error(err);
    });

    $scope.enableEditMode = function() {
      $scope.editMode = true;
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.editMode = false;
        }
      }, false],
      ['Save', function() {

        EventDevicesFactory.putDevices($scope.currentDevice).success(function(data) {
          console.log(data);
          $state.go('app.dashboard.event-devices.index');
        })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });

      }, true],
    ];

  }
}

export class EventDevicesNewController{
  constructor($rootScope, $scope, $state, DashboardFactory, gettextCatalog,EventDevicesFactory,$stateParams) {
    'ngInject';

    $scope.currentDevice = {};
    $scope.editMode = true;
    $scope.newDevice = true;
    $scope.bottomActions = [
      ['Cancel', function() {

        $state.go('app.dashboard.event-devices.index');

      }, false],
      ['Save', function() {

        EventDevicesFactory.postDevices($scope.currentDevice).success(function(data) {
          console.log(data);
          $state.go('app.dashboard.event-devices.index');
        })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });

      }, true],
    ];
  }
}

export function decode () {
  return function (input) {

    return decodeURI(input);
  };
}
