export function inputTime($filter) {
  'ngInject';
  function outputFormatter(modelValue) {
    if (modelValue !== null) {


      var value = modelValue.replace(/[^0-9:]/g, "");
      var len = value.length;

      // Fixing Colon
      var timeValues = value.split(':');
      if ( len === 2 && value.indexOf(':') !== -1 ){
        timeValues[0] = '0'+value.substring(0,1);
      }
      if ( len > 2 && value.indexOf(':') === -1 ){
        timeValues[0] = value.substring(0,2);
        timeValues[1] = value.substring(2,4);
      }

      // Fixing Hours
      var hour = '';
      if ( timeValues.length > 0 ) {

        hour = parseFloat(timeValues[0]);

        if (isNaN(hour)){
          hour = '';
        }
        if ( timeValues[0].length > 1 && timeValues[0][0] === '0' && timeValues[0][1] !== '0'){
          hour = '0'+hour;
        }

        if ( timeValues[0].length === 1 && timeValues.length > 1 ){
          hour = '0'+hour;
        }

        if ( hour > 12 ){
          hour = 12;
        }
      }

      // Fixing minutes
      var min = '';
      if ( timeValues.length > 1 ){
        min = parseFloat(timeValues[1]);
        if (isNaN(min)){
          min = '';
        }
        if ( timeValues[1].length > 1 && timeValues[1][0] === '0'){
          min = '0'+min;
        }
        if ( min > 59 ){
          min = 59;
        }
      }


      // Incompleted Time
      if ( len > 2 ) {
        return hour + ':' + min;
      }
      if ( len <= 2 && value.indexOf(':') !== -1 ){
        return hour + ':';
      }
      else {
        return hour;
      }
    } else {
      return "00:00";
    }
  }
  var addZero = function(v){

    if ( parseFloat(v) < 10 ){
      return '000'+v;
    }
    else if ( parseFloat(v) < 100 ){
      return '00'+v;
    }
    else if ( parseFloat(v) < 1000 ){
      return '0'+v;
    }
    else {
      return String(v);
    }
  };

  function inputParser( viewValue,meridiem ) {
    if ( typeof viewValue !== 'undefined' && viewValue !== null) {
      var value = viewValue.replace(/[^0-9]/g, "");
      if ( value.length < 4 ){
        return '';
      }
      value = parseFloat(value);
      if ( meridiem === 'am' && value >= 1200 && value <= 1259 ){
        value -= 1200;
      }
      if ( meridiem === 'pm' && value < 1200 ){
        value += 1200;
      }

      return addZero(value);

    }
  }

  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      type: '@type',
      title: '@title',
      class: '@class',
      model: '=ngModel',
      disabled: '=ngDisabled',
      readonly: '=ngReadonly',
      min: '=',
      max: '='
    },
    templateUrl: 'app/shared/directive/inputs/input-time.html',
    link: function postLink(scope, element, attrs, ctrl) {

      scope.hours = '';

      ctrl.$formatters.unshift(outputFormatter);


      element.on('keyup', function(e) {
        var element = e.target;
        element.value = outputFormatter(element.value);
        scope.hours = element.value;
        scope.updateModel();
        scope.$apply();
      });

      scope.meridiem = 'am';
      scope.meridiems = [{value:'am',display:'AM'},{value:'pm',display:'PM'}];

      scope.notUpdateView = false;
      scope.updateModel = function(){
        scope.notUpdateView = true;
        scope.model = inputParser(scope.hours, scope.meridiem);
      };
      scope.updateView = function(){
        if ( scope.model && !isNaN(parseFloat(scope.model)) ){

          var value = parseFloat(scope.model);
          if ( value < 1200 ){
            scope.meridiem = 'am';
          }
          else {
            scope.meridiem = 'pm';
          }
          var val;
          if ( value < 100 ){
            val = value + 1200;
          }
          else if ( value > 1259 && value <= 2359 ){
            val = value - 1200;
          }
          else if ( value <= 2359 ){
            val = value;
          }
          else {
            val = '';
          }
          scope.hours = outputFormatter(addZero(val));
          console.log(scope.hours);

        }
        else {
          scope.hours = '';
          scope.meridiem = 'am';
        }
      };

      scope.updateView();


      scope.$watch('model',function(){
        if ( !scope.notUpdateView ) {
          scope.updateView();
        }
        scope.notUpdateView = false;
      });


    }
  };
}
