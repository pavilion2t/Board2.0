export function inputPercentage($filter) {

  function outputFormatter(modelValue, decimals) {
    var length = decimals || 2;
    if (modelValue !== null) {
      if ( isNaN(modelValue) ){
        return $filter('number')(parseFloat(0, length))+'%';
      }
      return $filter('number')(parseFloat(modelValue) * 100, length)+'%';
    } else {
      return $filter('number')(parseFloat(0, length))+'%';
    }
  }

  function inputParser(viewValue, decimals) {
    var length = decimals || 4;
    if (viewValue !== null) {
      var value = viewValue.replace(/[^0-9.]/g, "");
      if ( isNaN(value) ){
        return 0;
      }
      value = $filter('number')(parseFloat(value) / 100, length);
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
        var decimals = parseFloat(attrs.pctDecimals) || 4;
        return inputParser(viewValue, decimals);
      });

      ctrl.$formatters.unshift(outputFormatter);
      element.on('change', function(e) {
        var element = e.target;
        element.value = outputFormatter(ctrl.$modelValue, 2);
      });
    }
  };



}
