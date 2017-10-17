import { inputBirthday } from './inputBirthday'
import { inputBox } from './inputBox'
import { inputCheckbox } from './inputCheckbox'
import { inputCurrency } from './inputCurrency'
import { inputDate } from './inputDate'
import { inputFile, inputFileRead } from './inputFile'
import { inputImage, inputImageRead, imagePreview } from './inputImage'
import { inputListing } from './inputListing'
import { inputPercentage } from './inputPercentage'
import { inputRadio } from './inputRadio'
import { inputSelect } from './inputSelect'
import { inputTextarea } from './inputTextarea'
import { inputTime } from './inputTime'
import { inputToggle } from './inputToggle'
import { inputWrapper } from './inputWrapper'

/**
 * Created by Alan on 9/1/2015.
 */
export default angular.module('inputModule', [])
  .factory('inputModule', [function () {
    var functions = {};

    /**
     * Global function to handle all validation
     */
    functions.validate = function (scope, attr, ngModel, key, param) {


      function valid(myValue, modValue) {

        var value = ngModel.$viewValue;
        var paramval = scope.$eval(attr[key]);
        var valid = false;
        if (!angular.isDefined(paramval) || paramval === null || paramval === false || paramval === 'false') {
          valid = true;
        }
        else {
          valid = param.func(param, value, paramval);
        }
        ngModel.$setValidity(key, valid);
        if (modValue) {
          return valid ? myValue : undefined;
        }
        return myValue;
      }

      // To set the validity of one criteria, return undefined for any invalid values
      var validMod = function (myValue) {
        return valid(myValue, true);
      };

      // Returns the original value for formatter (view value)
      var validUnmod = function (myValue) {
        return valid(myValue, false);
      };

      ngModel.$parsers.push(validMod);
      ngModel.$formatters.push(validUnmod);

      scope.$watch(attr[key], function () {
        ngModel.$setViewValue(ngModel.$viewValue);
      });
    };

    functions.justValidate = function (scope, attr, ngModel, key, param) {
      var value = ngModel.$modelValue;
      var paramval = scope.$eval(attr[key]);
      var valid = false;
      if (!angular.isDefined(paramval) || paramval === null || paramval === false || paramval === 'false') {
        valid = true;
      }
      else {
        valid = param.func(param, value, paramval);
      }
      ngModel.$setValidity(key, valid);
    };

    /**
     * Alternative Function to handle all validation if no modelvalue is affected (prevent infinite watch loop)
     */
    functions.validate2 = function (scope, attr, ngModel, key, param) {

      scope.$watch(function () {
        return ngModel.$viewValue;
      }, function (newValue) {
        functions.justValidate(scope, attr, ngModel, key, param);
      });

      scope.$watch(attr[key], function () {
        functions.justValidate(scope, attr, ngModel, key, param);
      });
    };

    /**
     * Helper function to return false if eval is true
     */
    functions.handleTrue = function (param, value, paramval) {
      return !paramval;
    };

    /**
     * Helper function to return false if eval is not equal to the value and value is not empty
     */
    functions.handleEqual = function (param, value, paramval) {
      return ( typeof value === 'undefined' || value === null || value === '' || paramval === value );
    };

    /**
     * Helper function to return true if eval is not equal to the value and value is not empty
     */
    functions.handleDiffer = function (param, value, paramval) {
      return ( typeof value === 'undefined' || value === null || value === '' || paramval !== value );
    };

    /**
     * Helper function to add to the validation function for min length
     */
    functions.handleLengthMin = function (param, value, paramval) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }

      return ( value.toString().length >= paramval );

    };

    functions.handleLengthMax = function (param, value, paramval) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }
      return ( value.toString().length <= paramval );

    };

    /**
     * Helper function to add to the validation function for pattern
     */
    functions.handlePattern = function (param, value) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }
      var reg = param.pattern;
      return reg.test(value);
    };

    functions.handleMin = function (param, value, paramval) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }

      var newval = '';
      if (typeof value === 'number') {
        newval = value;
      }
      else if (typeof value === 'string') {
        newval = parseFloat(value);
      }
      if (isNaN(newval) || newval === '') {
        return true;
      }


      var compareval = '';
      if (typeof paramval === 'number') {
        compareval = paramval;
      }
      else if (typeof paramval === 'string') {
        compareval = parseFloat(paramval);
      }
      if (isNaN(compareval)) {
        return true;
      }


      if (compareval <= newval) {
        return true;
      }

      return false;


    };

    functions.handleMax = function (param, value, paramval) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }

      var newval = '';
      if (typeof value === 'number') {
        newval = value;
      }
      else if (typeof value === 'string') {
        newval = parseFloat(value);
      }
      if (isNaN(newval) || newval === '') {
        return true;
      }


      var compareval = '';
      if (typeof paramval === 'number') {
        compareval = paramval;
      }
      else if (typeof paramval === 'string') {
        compareval = parseFloat(paramval);
      }
      if (isNaN(compareval)) {
        return true;
      }


      if (compareval >= newval) {
        return true;
      }
      return false;


    };


    /**
     * Helper function to add to the validation function for numbers
     */
    functions.handleNumber = function (param, value) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true;
      }

      var reg = /^[-]?(?:(?:0|[1-9][0-9]*)(?:\.[0-9]*)?|\.[0-9]+)$/;
      if (!reg.test(value)) {
        return false;
      }
      var newval = '';

      if (typeof value === 'number') {
        newval = value.toString();
      }
      else if (typeof value === 'string') {
        newval = value;
      }

      // Non negative
      if (newval.substring(0, 1) === '-' && !param.incNegative) {
        return false;
      }

      var negative = 0;
      if (newval.substring(0, 1) === '-') {
        negative = 1;
      }

      // Non integer
      if (param.decimal === 0 && newval.indexOf('.') !== -1) {
        return false;
      }

      var splits = newval.split('.');
      var decimal = 0;
      var integral = splits[0].length;
      if (splits.length === 2) {
        decimal = splits[1].length;
      }

      if (param.integral && integral > ( parseInt(param.integral) + negative )) {
        return false;
      }

      if (param.decimal && decimal > parseInt(param.decimal)) {
        return false;
      }


      return true;

    };

    return functions;
  }])
  /**
   * All different input fix for different browsers
   */
  .directive('validInput', ['$rootScope', '$timeout',
    function ($rootScope, appGlobalModule, $timeout) {
      'ngInject';
      var func = {
        restrict: 'EA',
        require: '?ngModel',
        scope: false,
        link: function ($scope, $elem, $attrs, ngModel) {

          /**
           *
           * Broadcast the validation error
           *
           */
          if (!ngModel) {
            return
          }
          $scope.$watch(function () {
            return ngModel.$error;
          }, function (newValue) {
            $rootScope.$broadcast('validateError', { name: $attrs['name'], error: ngModel.$error });
          }, true);
          $rootScope.$broadcast('validateError', { name: $attrs['name'], error: ngModel.$error });


          // Disable Auto Complete, Spell check
          $($elem).attr('spellcheck', false);
          $($elem).attr('autocomplete', "off");
          $($elem).attr('autocorrect', "off");
          $($elem).attr('autocapitalize', "off");


        }
      };
      return func;
    }])
  .directive('validMessages', [function () {
    var func = {
      restrict: 'A',
      replace: true,
      scope: {
        error: '=',
        errMessage: '@'
      },
      template: '<span ng-hide="valid" ng-class="{\'ng-invalid\':!valid}" class="error">{{localizedMessage}}</span>',
      link: function ($scope, $elem, $attrs) {

        $scope.valid = true;
        $scope.localizedMessage = null;
        if (angular.isDefined($scope.errMessage)) {
          $scope.localizedMessage = $scope.errMessage;
        }
        $scope.validate = function (error) {
          if (error !== null) {
            $scope.valid = !error[$attrs['key']];
          }
        };


        $scope.$on('validateError', function (event, args) {
          if (args.name === $attrs['for'] || args.name === $attrs['foralso']) {
            $scope.validate(args.error);
          }
        });


        $scope.$on('error', function (event, args) {
          $scope.validate(args.error);
        });
      }
    };
    return func;
  }])
  .directive('validLengthMin', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validLengthMin', { func: inputModule.handleLengthMin });
      }
    };
    return func;
  }])
  .directive('validLengthMax', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validLengthMax', { func: inputModule.handleLengthMax });
      }
    };
    return func;
  }])
  .directive('validFunc', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {


        inputModule.validate2($scope, $attrs, ngModel, 'validFunc', { func: inputModule.handleTrue });
      }
    };
    return func;
  }])
  .directive('validFunc2', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validFunc2', { func: inputModule.handleTrue });
      }
    };
    return func;
  }])
  .directive('validFunc3', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validFunc3', { func: inputModule.handleTrue });
      }
    };
    return func;
  }])
  .directive('validEqual', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validEqual', { func: inputModule.handleEqual });
      }
    };
    return func;
  }])
  .directive('validDiffer', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validDiffer', { func: inputModule.handleDiffer });
      }
    };
    return func;
  }])
  .directive('validAlphanumeric', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        var ALPHA_REGEX = new RegExp(/^[a-zA-Z0-9]+$/);
        inputModule.validate2($scope, $attrs, ngModel, 'validAlphanumeric',
          { func: inputModule.handlePattern, pattern: ALPHA_REGEX });
      }
    };
    return func;
  }])
  .directive('validAlpha', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        var ALPHA_REGEX = new RegExp(/^[a-zA-Z]+$/);
        inputModule.validate2($scope, $attrs, ngModel, 'validAlpha',
          { func: inputModule.handlePattern, pattern: ALPHA_REGEX });
      }
    };
    return func;
  }])
  .directive('validNumeric', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        var NUMBER_REGEX = new RegExp(/^[0-9]+$/);
        inputModule.validate2($scope, $attrs, ngModel, 'validNumeric',
          { func: inputModule.handlePattern, pattern: NUMBER_REGEX });
      }
    };
    return func;
  }])
  .directive('validMinimum', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validMinimum',
          { func: inputModule.handleMin });
      }
    };
    return func;
  }])
  .directive('validMaximum', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        inputModule.validate2($scope, $attrs, ngModel, 'validMaximum',
          { func: inputModule.handleMax });
      }
    };
    return func;
  }])
  .directive('validDecimal', ['inputModule', function (inputModule) {
    'ngInject';
    var func = {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {


        function validate() {
          var param = {};
          param.func = inputModule.handleNumber;
          param.decimal = $attrs['decimalPoint'];
          param.integral = $attrs['integralPoint'];
          param.incNegative = true;
          inputModule.justValidate($scope, $attrs, ngModel, 'validDecimal', param);
        }

        validate();


        $scope.$watch(function () {
          return ngModel.$viewValue;
        }, function (newValue) {
          validate();
        });

        $scope.$watch($attrs['validDecimal'], function () {
          validate();
        });

        $scope.$watch($attrs['decimalPoint'], function (newValue) {
          validate();
        });

        $scope.$watch($attrs['integralPoint'], function (newValue) {
          validate();
        });


      }
    };
    return func;
  }])
  .directive('inputBirthday', inputBirthday)
  .directive('inputBox', inputBox)
  .directive('inputCheckbox', inputCheckbox)
  .directive('inputCurrency', inputCurrency)
  .directive('inputDate', inputDate)
  .directive('inputFile', inputFile)
  .directive('inputFileRead', inputFileRead)
  .directive('inputImage', inputImage)
  .directive('inputImageRead', inputImageRead)
  .directive('imagePreview', imagePreview)
  .directive('inputListing', inputListing)
  .directive('inputPercentage', inputPercentage)
  .directive('inputRadio', inputRadio)
  .directive('inputSelect', inputSelect)
  .directive('inputTextarea', inputTextarea)
  .directive('inputTime', inputTime)
  .directive('inputToggle', inputToggle)
  .directive('inputWrapper', inputWrapper)
