export function inputBox() {
  return {
    restrict: 'E',
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
    replace: true,
    templateUrl: 'app/shared/directive/inputs/input-box.html',
    link: function(scope, elem, attrs) {

      scope.checkIfInvalid = function($event) {
        scope.isInvalid = angular.element($event.currentTarget).hasClass('ng-invalid');
      };
    }
  };
}
