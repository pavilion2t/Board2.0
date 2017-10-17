export function inputCurrency($filter) {
  'ngInject';
  function outputFormatter(modelValue) {
    if (modelValue !== null) {
      if ( isNaN(modelValue) ){
        return $filter('myCurrency')(parseFloat(0));
      }
      var value = $filter('myCurrency')(parseFloat(modelValue));
      return value;
    } else {
      return $filter('myCurrency')(parseFloat(0));
    }
  }

  function inputParser(viewValue) {
    if (viewValue !== null) {
      var value = viewValue.replace(/[^0-9.]/g, "");
      if ( isNaN(value) ){
        return 0;
      }
      return value;
    } else {
      return 0;
    }
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function postLink(scope, element, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        return inputParser(viewValue);
      });

      ctrl.$formatters.unshift(outputFormatter);
      element.on('change', function(e) {
        var element = e.target;
        element.value = outputFormatter(ctrl.$modelValue);
      });
    }
  };
}
