export class TimeSegmentController {
  constructor(opening_hours, timeSegments, CommonFactory, $state, $scope, TimeSegmentFactory, $stateParams) {
    'ngInject';

    $scope.opening_hours = opening_hours;
    $scope.time_segments = timeSegments;

    $scope.reload = function () {
      if (!$scope.opening_hours) {
        $scope.opening_hours = {};
      }

      for (var i = 0; i <= 6; i++) {
        if (!$scope.opening_hours[i]) {
          $scope.opening_hours[i] = [];
        }

      }
      if (!$scope.time_segments) {
        $scope.time_segments = {};
      }

      $scope.time_segments_array = [];
      for (var key in $scope.time_segments) {
        var obj = $scope.time_segments[key]
        var newObj = { start: obj.start, end: obj.end, title: key };
        $scope.time_segments_array.push(newObj);
      }
    };

    $scope.init = function () {

      $scope.reload();
      var localeData = moment.localeData();
      $scope.weekdays = localeData._weekdays;
      $scope.weekdays = _.map($scope.weekdays, function (day, index) {
        return { value: index, display: day };
      });
      $scope.weekday = $scope.weekdays[0].value;
    };

    $scope.timeSegmentsConversion = function () {
      $scope.time_segments = {};
      _.each($scope.time_segments_array, function (obj) {
        var newObj = { start: obj.start, end: obj.end };
        $scope.time_segments[obj.title] = newObj;
      });
    };

    $scope.checkValid = function (time1) {

      if (!time1.start || !time1.end) {
        return false;
      }
      /*
      var t1s = parseFloat(time1.start);
      var t1e = parseFloat(time1.end);
      if (t1s >= t1e) {
        return false;
      }*/
      return true;

    };
    $scope.checkOverlap = function (time1, time2) {

      var t1s = parseFloat(time1.start);
      var t2s = parseFloat(time2.start);
      var t1e = parseFloat(time1.end);
      var t2e = parseFloat(time2.end);

      if (t1s >= t2s && t1s < t2e) {
        return true;
      }
      else if (t1e >= t2s && t1e < t2s) {
        return true;
      }
      return false;


    };

    $scope.checkTime = function (arrays) {
      var valid = true;
      _.each(arrays, function (obj) {

        if (!$scope.checkValid(obj)) {
          obj.error['Invalid Time Segment'] = true;
          valid = false;
        }
        _.each(arrays, function (obj2) {

          if (obj !== obj2 && $scope.checkOverlap(obj, obj2)) {
            obj.error['Time Segments Overlap'] = true;
            obj2.error['Time Segments Overlap'] = true;
            valid = false;
          }
        });
      });
      return valid;
    };

    $scope.checkTimeSegments = function () {
      var valid = true;
      var titleMap = {};
      _.each($scope.time_segments_array, function (obj) {
        obj.error = {};
        if (obj.title === '') {
          obj.error['Title is required'] = true;
          valid = false;
        }
        if (!titleMap[obj.title]) {
          titleMap[obj.title] = true;
        }
        else {
          obj.error['Duplicated Title'] = true;
          valid = false;
        }
      });

      var checkTime = $scope.checkTime($scope.time_segments_array);
      if (!checkTime) {
        valid = false;
      }

      return valid;
    };


    $scope.init();


    function Hours() {
      return { 'start': '0900', 'end': '2200' };
    }

    function Segment() {
      return { 'title': '', 'start': '0900', 'end': '2200' };
    }

    $scope.addNewHours = function (weekday) {
      $scope.opening_hours[weekday.value].push(new Hours());
    };


    $scope.addNewSegments = function () {
      $scope.time_segments_array.push(new Segment());
    };

    $scope.copyHours = function (weekday) {
      var opening_hours = $scope.opening_hours[weekday.value];
      for (var i = 0; i <= 6; i++) {
        if (i !== weekday.value) {
          angular.copy(opening_hours, $scope.opening_hours[i]);
        }
      }
    };

    $scope.saveOpeningHours = function () {
      TimeSegmentFactory.set($stateParams.store_id, $scope.opening_hours).success(function () {
        TimeSegmentFactory.get($stateParams.store_id).then(function (data) {
          $scope.opening_hours = data;
          $scope.reload();
        });
      });
    };

    $scope.deleteOpeningHours = function () {
      TimeSegmentFactory.set($stateParams.store_id, {}).success(function () {
        TimeSegmentFactory.get($stateParams.store_id).then(function (data) {
          $scope.opening_hours = data;
          $scope.reload();
        });
      });
    };

    $scope.saveTimeSegments = function () {
      if ($scope.checkTimeSegments()) {

        $scope.timeSegmentsConversion();


        TimeSegmentFactory.setSegments($stateParams.store_id, $scope.time_segments).success(function () {
          TimeSegmentFactory.getSegments($stateParams.store_id).then(function (data) {
            $scope.time_segments = data;
            $scope.reload();
          });
        });
      }
    };
  }
}


export function timeSegmentRow() {
  return {
    scope: {
      hasTitle: '=',
      index: '=',
      hours: '=',
      collection: '=',
      weekday: '='
    },
    restrict: 'A',
    templateUrl: 'app/modules/settings/time_segment_row.html',
    controller: function ($scope) {
      $scope.removeHours = function (index, collection) {
        collection.splice(index, 1);
      };
    }
  };
}


