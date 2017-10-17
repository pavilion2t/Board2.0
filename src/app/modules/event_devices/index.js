
import { EventDevicesController, EventDevicesViewController, EventDevicesNewController, decode } from './eventDevicesController'
import { EventDevicesFactory } from './eventDevicesFactory'

export default angular
  .module('event_devices', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.event-devices', {
        abstract: true,
        url: '/event-devices',
        template: '<ui-view />',
        data: {
          multiStoreSupport: false
        },
        resolve: {
          devices: function (EventDevicesFactory, $stateParams) {
            return EventDevicesFactory.getDevices($stateParams.store_id);
          },
          store: function (EventDevicesFactory, $stateParams) {
            return EventDevicesFactory.getStore($stateParams.store_id);
          }
        }
      })
      .state('app.dashboard.event-devices.index', { url: '', templateUrl: 'app/modules/event_devices/map.html', controller: 'EventDevicesController' })
      .state('app.dashboard.event-devices.new', { url: '/new', templateUrl: 'app/modules/event_devices/view_device.html', controller: 'EventDevicesNewController' })
      .state('app.dashboard.event-devices.view', { url: '/:device_id', templateUrl: 'app/modules/event_devices/view_device.html', controller: 'EventDevicesViewController' })
  })
  .controller('EventDevicesController', EventDevicesController)
  .controller('EventDevicesViewController', EventDevicesViewController)
  .controller('EventDevicesNewController', EventDevicesNewController)
  .filter('decode', decode)
  .factory('EventDevicesFactory', EventDevicesFactory)
